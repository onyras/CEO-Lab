import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'
import { DIMENSIONS } from '@/lib/constants'
import { calculateBSI, calculateDirectionalBSI, classifyMirrorGap, getBsiLabel } from '@/lib/scoring'
import type { DimensionId, MirrorGap } from '@/types/assessment'

interface MirrorSaveRequest {
  mirrorSessionId: string
  responses: {
    dimensionId: DimensionId
    rawResponse: number
  }[]
}

export async function POST(request: Request) {
  const startTime = Date.now()
  const logs: string[] = []

  try {
    logs.push('=== V4 MIRROR SAVE START ===')

    // Initialize Supabase
    const supabase = await createServerSupabase()

    // STEP 1: Parse and validate request
    logs.push('Step 1: Parsing request...')
    let body: MirrorSaveRequest

    try {
      body = await request.json()
    } catch (e) {
      logs.push('Failed to parse JSON')
      return NextResponse.json({
        success: false,
        error: 'Invalid JSON in request body',
        logs
      }, { status: 400 })
    }

    const { mirrorSessionId, responses } = body

    if (!mirrorSessionId) {
      logs.push('Missing mirrorSessionId')
      return NextResponse.json({
        success: false,
        error: 'mirrorSessionId is required',
        logs
      }, { status: 400 })
    }

    if (!responses || !Array.isArray(responses) || responses.length === 0) {
      logs.push('Missing or empty responses')
      return NextResponse.json({
        success: false,
        error: 'responses array is required and must not be empty',
        logs
      }, { status: 400 })
    }

    // Validate each response
    const validDimensionIds = new Set(DIMENSIONS.map(d => d.id))
    for (const r of responses) {
      if (!validDimensionIds.has(r.dimensionId)) {
        logs.push(`Invalid dimensionId: ${r.dimensionId}`)
        return NextResponse.json({
          success: false,
          error: `Invalid dimensionId: ${r.dimensionId}`,
          logs
        }, { status: 400 })
      }
      if (r.rawResponse < 1 || r.rawResponse > 5 || !Number.isInteger(r.rawResponse)) {
        logs.push(`Invalid rawResponse for ${r.dimensionId}: ${r.rawResponse}`)
        return NextResponse.json({
          success: false,
          error: `rawResponse must be an integer between 1 and 5, got ${r.rawResponse} for ${r.dimensionId}`,
          logs
        }, { status: 400 })
      }
    }

    logs.push(`Validated ${responses.length} responses for mirror session ${mirrorSessionId}`)

    // STEP 2: Load mirror_session and verify it's not already completed
    logs.push('Step 2: Loading mirror session...')

    const { data: mirrorSession, error: mirrorSessionError } = await supabase
      .from('mirror_sessions')
      .select('id, session_id, completed_at')
      .eq('id', mirrorSessionId)
      .single()

    if (mirrorSessionError || !mirrorSession) {
      logs.push(`Mirror session not found: ${mirrorSessionError?.message || 'No data'}`)
      return NextResponse.json({
        success: false,
        error: `Mirror session not found: ${mirrorSessionError?.message || 'Unknown'}`,
        logs
      }, { status: 404 })
    }

    if (mirrorSession.completed_at) {
      logs.push(`Mirror session already completed at ${mirrorSession.completed_at}`)
      return NextResponse.json({
        success: false,
        error: 'This mirror session has already been completed',
        logs
      }, { status: 409 })
    }

    const sessionId = mirrorSession.session_id
    logs.push(`Mirror session valid. Parent assessment session: ${sessionId}`)

    // STEP 3: Load the parent assessment_session to verify it exists
    logs.push('Step 3: Loading parent assessment session...')

    const { data: assessmentSession, error: assessmentError } = await supabase
      .from('assessment_sessions')
      .select('id, ceo_id')
      .eq('id', sessionId)
      .single()

    if (assessmentError || !assessmentSession) {
      logs.push(`Assessment session not found: ${assessmentError?.message || 'No data'}`)
      return NextResponse.json({
        success: false,
        error: `Parent assessment session not found: ${assessmentError?.message || 'Unknown'}`,
        logs
      }, { status: 404 })
    }

    logs.push(`Parent assessment session found for CEO: ${assessmentSession.ceo_id}`)

    // STEP 4: Save 15 mirror responses to mirror_responses table
    logs.push('Step 4: Saving mirror responses...')

    const mirrorResponseRecords = responses.map(r => ({
      mirror_session_id: mirrorSessionId,
      dimension: r.dimensionId,
      raw_response: r.rawResponse,
      percentage: ((r.rawResponse - 1) / 4) * 100,
    }))

    const { error: saveResponsesError } = await supabase
      .from('mirror_responses')
      .insert(mirrorResponseRecords)

    if (saveResponsesError) {
      logs.push(`Save mirror responses error: ${saveResponsesError.message}`)
      return NextResponse.json({
        success: false,
        error: `Failed to save mirror responses: ${saveResponsesError.message}`,
        logs
      }, { status: 500 })
    }

    logs.push(`Saved ${mirrorResponseRecords.length} mirror responses`)

    // STEP 5: Load CEO's dimension scores for gap calculation
    logs.push('Step 5: Loading CEO dimension scores...')

    const dimensionIds = responses.map(r => r.dimensionId)

    const { data: ceoDimensionScores, error: ceoScoresError } = await supabase
      .from('dimension_scores')
      .select('dimension, composite')
      .eq('session_id', sessionId)
      .in('dimension', dimensionIds)

    if (ceoScoresError) {
      logs.push(`Load CEO scores error: ${ceoScoresError.message}`)
      return NextResponse.json({
        success: false,
        error: `Failed to load CEO dimension scores: ${ceoScoresError.message}`,
        logs
      }, { status: 500 })
    }

    if (!ceoDimensionScores || ceoDimensionScores.length === 0) {
      logs.push('No CEO dimension scores found for this session')
      return NextResponse.json({
        success: false,
        error: 'No CEO dimension scores found. The baseline assessment must be completed first.',
        logs
      }, { status: 400 })
    }

    logs.push(`Loaded ${ceoDimensionScores.length} CEO dimension scores`)

    // Build CEO scores lookup
    const ceoScoreMap = new Map<DimensionId, number>()
    for (const score of ceoDimensionScores) {
      ceoScoreMap.set(score.dimension as DimensionId, score.composite)
    }

    // STEP 6: Calculate gaps for each dimension using classifyMirrorGap
    logs.push('Step 6: Calculating mirror gaps...')

    const gaps: (MirrorGap & { dimensionId: DimensionId })[] = []
    const ceoPercentages = new Map<DimensionId, number>()
    const raterPercentages = new Map<DimensionId, number>()

    for (const r of responses) {
      const ceoComposite = ceoScoreMap.get(r.dimensionId)

      if (ceoComposite == null) {
        logs.push(`Warning: No CEO score for dimension ${r.dimensionId}, skipping gap`)
        continue
      }

      // Classify the gap between CEO composite and rater raw
      const gap = classifyMirrorGap(ceoComposite, r.rawResponse)
      gap.dimensionId = r.dimensionId
      gaps.push(gap)

      // Build percentage maps for BSI calculation
      ceoPercentages.set(r.dimensionId, gap.ceoPct)
      raterPercentages.set(r.dimensionId, gap.raterPct)
    }

    logs.push(`Calculated ${gaps.length} mirror gaps`)

    // STEP 7: Save gaps to mirror_gaps table (upsert in case of re-submission)
    logs.push('Step 7: Saving mirror gaps...')

    const gapRecords = gaps.map(g => ({
      session_id: sessionId,
      dimension: g.dimensionId,
      ceo_pct: g.ceoPct,
      rater_pct: g.raterPct,
      gap_pct: g.gapPct,
      gap_label: g.gapLabel,
      severity: g.severity,
    }))

    const { error: saveGapsError } = await supabase
      .from('mirror_gaps')
      .upsert(gapRecords, {
        onConflict: 'session_id,dimension'
      })

    if (saveGapsError) {
      logs.push(`Save gaps error: ${saveGapsError.message}`)
      return NextResponse.json({
        success: false,
        error: `Failed to save mirror gaps: ${saveGapsError.message}`,
        logs
      }, { status: 500 })
    }

    logs.push(`Saved ${gapRecords.length} mirror gap records`)

    // STEP 8: Calculate BSI and Directional BSI
    logs.push('Step 8: Calculating BSI and Directional BSI...')

    const bsi = calculateBSI(ceoPercentages, raterPercentages)
    const directionalBsi = calculateDirectionalBSI(ceoPercentages, raterPercentages)
    const bsiLabel = getBsiLabel(bsi)

    logs.push(`BSI: ${bsi}, Directional BSI: ${directionalBsi}, Label: ${bsiLabel}`)

    // STEP 9: Save to blind_spot_index table
    logs.push('Step 9: Saving blind spot index...')

    const { error: saveBsiError } = await supabase
      .from('blind_spot_index')
      .insert({
        session_id: sessionId,
        bsi,
        directional_bsi: directionalBsi,
      })

    if (saveBsiError) {
      logs.push(`Save BSI error: ${saveBsiError.message}`)
      return NextResponse.json({
        success: false,
        error: `Failed to save blind spot index: ${saveBsiError.message}`,
        logs
      }, { status: 500 })
    }

    logs.push('Saved blind spot index')

    // STEP 10: Update assessment_sessions with BSI value
    logs.push('Step 10: Updating assessment session with BSI...')

    const { error: updateSessionError } = await supabase
      .from('assessment_sessions')
      .update({ bsi })
      .eq('id', sessionId)

    if (updateSessionError) {
      logs.push(`Update session error: ${updateSessionError.message}`)
      // Non-fatal: BSI is saved in blind_spot_index table
      logs.push('Warning: Assessment session not updated but BSI data is saved')
    } else {
      logs.push('Assessment session updated with BSI')
    }

    // STEP 11: Mark mirror_session as completed
    logs.push('Step 11: Marking mirror session as completed...')

    const { error: completeError } = await supabase
      .from('mirror_sessions')
      .update({ completed_at: new Date().toISOString() })
      .eq('id', mirrorSessionId)

    if (completeError) {
      logs.push(`Complete mirror session error: ${completeError.message}`)
      // Non-fatal: data is saved
      logs.push('Warning: Mirror session not marked complete but all data is saved')
    } else {
      logs.push('Mirror session marked as completed')
    }

    // SUCCESS: Return gap analysis
    const duration = Date.now() - startTime
    logs.push(`=== MIRROR SAVE COMPLETED in ${duration}ms ===`)

    return NextResponse.json({
      success: true,
      gaps: gaps.map(g => ({
        dimensionId: g.dimensionId,
        ceoPct: g.ceoPct,
        raterPct: g.raterPct,
        gapPct: g.gapPct,
        gapLabel: g.gapLabel,
        severity: g.severity,
      })),
      bsi,
      directionalBsi,
      bsiLabel,
      logs
    })

  } catch (error: any) {
    logs.push(`FATAL ERROR: ${error.message}`)
    logs.push(`Stack: ${error.stack}`)

    return NextResponse.json({
      success: false,
      error: error.message || 'Unknown server error',
      logs
    }, { status: 500 })
  }
}
