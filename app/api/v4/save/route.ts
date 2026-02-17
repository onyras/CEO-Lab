import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'
import { DIMENSIONS, REVERSE_SCORED_ITEMS, STAGE_ITEMS } from '@/lib/constants'
import { behavioralItems, sjiItems, imItems } from '@/lib/baseline-questions'
import {
  scoreItem, scoreSjiItem, scoreImItem,
  calculateDimensionScore, calculateTerritoryScore, calculateCLMI,
  calculateIM, detectArchetypes, selectPriorityDimensions,
  flagResponseTimes, getVerbalLabel,
} from '@/lib/scoring'
import type { DimensionId, Territory, SjiBehavioralTag } from '@/types/assessment'

// ─── Request Interface ──────────────────────────────────────────────

interface SaveRequest {
  sessionId: string
  stage: number
  responses: {
    itemId: string
    rawResponse: number
    responseTimeMs: number
  }[]
}

// ─── Helpers ────────────────────────────────────────────────────────

function getItemType(itemId: string): 'behavioral' | 'sji' | 'im' {
  if (itemId.startsWith('B')) return 'behavioral'
  if (itemId.startsWith('SJ')) return 'sji'
  if (itemId.startsWith('IM')) return 'im'
  return 'behavioral'
}

function getDimensionForItem(itemId: string): DimensionId | undefined {
  const type = getItemType(itemId)
  if (type === 'behavioral') {
    const item = behavioralItems.find(b => b.id === itemId)
    return item?.dimensionId
  }
  if (type === 'sji') {
    const item = sjiItems.find(s => s.id === itemId)
    return item?.dimensionId
  }
  // IM items have no dimension
  return undefined
}

function getTerritoryFromDimension(dimensionId: DimensionId): Territory {
  if (dimensionId.startsWith('LY')) return 'leading_yourself'
  if (dimensionId.startsWith('LT')) return 'leading_teams'
  return 'leading_organizations'
}

// ─── POST Handler ───────────────────────────────────────────────────

export async function POST(request: Request) {
  const startTime = Date.now()
  const logs: string[] = []

  try {
    logs.push('=== V4 ASSESSMENT SAVE START ===')

    // ── Initialize Supabase ──────────────────────────────────────
    const supabase = await createServerSupabase()

    // ── STEP 1: Authenticate user ────────────────────────────────
    logs.push('Step 1: Authenticating user...')
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      logs.push(`Auth failed: ${authError?.message || 'No user'}`)
      return NextResponse.json({
        success: false,
        error: 'Authentication failed',
        logs
      }, { status: 401 })
    }

    logs.push(`User authenticated: ${user.id}`)

    // ── STEP 2: Parse and validate request ───────────────────────
    logs.push('Step 2: Parsing request...')
    let body: SaveRequest

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

    const { sessionId, stage, responses } = body

    if (!sessionId) {
      logs.push('Missing sessionId')
      return NextResponse.json({
        success: false,
        error: 'sessionId is required',
        logs
      }, { status: 400 })
    }

    if (!stage || stage < 1 || stage > 3) {
      logs.push(`Invalid stage: ${stage}`)
      return NextResponse.json({
        success: false,
        error: `Invalid stage: ${stage}. Must be 1, 2, or 3.`,
        logs
      }, { status: 400 })
    }

    if (!responses || responses.length === 0) {
      logs.push('No responses provided')
      return NextResponse.json({
        success: false,
        error: 'No responses provided',
        logs
      }, { status: 400 })
    }

    logs.push(`Session: ${sessionId}, Stage: ${stage}, Responses: ${responses.length}`)

    // ── STEP 3: Load and verify session ──────────────────────────
    logs.push('Step 3: Loading session and verifying ownership...')

    const { data: session, error: sessionError } = await supabase
      .from('assessment_sessions')
      .select('*')
      .eq('id', sessionId)
      .single()

    if (sessionError || !session) {
      logs.push(`Session not found: ${sessionError?.message || 'No data'}`)
      return NextResponse.json({
        success: false,
        error: `Session not found: ${sessionError?.message || 'Unknown'}`,
        logs
      }, { status: 404 })
    }

    // Verify session belongs to user
    if (session.ceo_id !== user.id) {
      logs.push(`Session ownership mismatch: session.ceo_id=${session.ceo_id}, user=${user.id}`)
      return NextResponse.json({
        success: false,
        error: 'Session does not belong to this user',
        logs
      }, { status: 403 })
    }

    // Verify stage matches expected progression
    if (stage !== session.stage_reached + 1 && stage !== session.stage_reached) {
      logs.push(`Stage mismatch: expected ${session.stage_reached + 1} or ${session.stage_reached}, got ${stage}`)
      return NextResponse.json({
        success: false,
        error: `Stage mismatch: expected ${session.stage_reached + 1}, got ${stage}`,
        logs
      }, { status: 400 })
    }

    logs.push(`Session verified: stage_reached=${session.stage_reached}, submitting stage=${stage}`)

    // ── STEP 4: Score each item ──────────────────────────────────
    logs.push('Step 4: Scoring items...')

    const scoredResponses: {
      itemId: string
      itemType: 'behavioral' | 'sji' | 'im'
      rawResponse: number
      scoredValue: number
      dimension: DimensionId | null
      responseTimeMs: number
    }[] = []

    const sjiTags: SjiBehavioralTag[] = []

    for (const resp of responses) {
      const { itemId, rawResponse, responseTimeMs } = resp
      const itemType = getItemType(itemId)
      const dimension = getDimensionForItem(itemId) ?? null

      let scoredValue: number

      if (itemType === 'behavioral') {
        // Look up scoring direction
        const scoringDirection = REVERSE_SCORED_ITEMS.has(itemId) ? 'reverse' : 'forward'
        scoredValue = scoreItem(rawResponse, scoringDirection)
        logs.push(`  ${itemId}: raw=${rawResponse}, direction=${scoringDirection}, scored=${scoredValue}, dim=${dimension}`)
      } else if (itemType === 'sji') {
        // SJI: scale maturity score, extract behavioral tag
        scoredValue = scoreSjiItem(rawResponse)

        // Extract behavioral tag from the selected option
        const sjiItem = sjiItems.find(s => s.id === itemId)
        if (sjiItem) {
          // rawResponse is the maturity score (1-4), find matching option
          const selectedOption = sjiItem.options.find(opt => opt.maturityScore === rawResponse)
          if (selectedOption) {
            sjiTags.push(selectedOption.behavioralTag)
            logs.push(`  ${itemId}: raw=${rawResponse}, scaled=${scoredValue.toFixed(3)}, tag=${selectedOption.behavioralTag}, dim=${dimension}`)
          } else {
            logs.push(`  ${itemId}: raw=${rawResponse}, scaled=${scoredValue.toFixed(3)}, tag=UNKNOWN (no option match), dim=${dimension}`)
          }
        }
      } else {
        // IM: binary scoring
        scoredValue = scoreImItem(rawResponse)
        logs.push(`  ${itemId}: raw=${rawResponse}, scored=${scoredValue}, type=im`)
      }

      scoredResponses.push({
        itemId,
        itemType,
        rawResponse,
        scoredValue,
        dimension,
        responseTimeMs,
      })
    }

    logs.push(`Scored ${scoredResponses.length} items (${sjiTags.length} SJI tags collected)`)

    // ── STEP 5: Upsert item responses to DB ─────────────────────
    logs.push('Step 5: Upserting item responses...')

    const responseRecords = scoredResponses.map(r => ({
      session_id: sessionId,
      item_id: r.itemId,
      item_type: r.itemType,
      raw_response: r.rawResponse,
      scored_value: r.scoredValue,
      dimension: r.dimension,
      stage,
      response_time_ms: r.responseTimeMs,
    }))

    const { error: upsertError } = await supabase
      .from('item_responses')
      .upsert(responseRecords, {
        onConflict: 'session_id,item_id'
      })

    if (upsertError) {
      logs.push(`Upsert error: ${upsertError.message}`)
      return NextResponse.json({
        success: false,
        error: `Failed to save responses: ${upsertError.message}`,
        logs
      }, { status: 500 })
    }

    logs.push(`Upserted ${responseRecords.length} item responses`)

    // ── STEP 6: Update session stage_reached ─────────────────────
    logs.push('Step 6: Updating session stage_reached...')

    const { error: stageUpdateError } = await supabase
      .from('assessment_sessions')
      .update({ stage_reached: stage })
      .eq('id', sessionId)

    if (stageUpdateError) {
      logs.push(`Stage update error: ${stageUpdateError.message}`)
      return NextResponse.json({
        success: false,
        error: `Failed to update stage: ${stageUpdateError.message}`,
        logs
      }, { status: 500 })
    }

    logs.push(`Session stage_reached updated to ${stage}`)

    // ── STEP 7: If all 3 stages complete, calculate final scores ─
    const assessmentComplete = stage === 3

    if (!assessmentComplete) {
      const duration = Date.now() - startTime
      logs.push(`Stage ${stage} saved. Assessment not yet complete.`)
      logs.push(`=== V4 SAVE COMPLETED in ${duration}ms ===`)

      return NextResponse.json({
        success: true,
        stageCompleted: stage,
        assessmentComplete: false,
        responsesSaved: responseRecords.length,
        duration,
        logs
      })
    }

    // ── All 3 stages complete: Calculate everything ──────────────
    logs.push('Step 7: All 3 stages complete. Loading all responses for final scoring...')

    const { data: allResponses, error: loadError } = await supabase
      .from('item_responses')
      .select('*')
      .eq('session_id', sessionId)

    if (loadError || !allResponses) {
      logs.push(`Load all responses error: ${loadError?.message || 'No data'}`)
      return NextResponse.json({
        success: false,
        error: `Failed to load responses for scoring: ${loadError?.message || 'Unknown'}`,
        logs
      }, { status: 500 })
    }

    logs.push(`Loaded ${allResponses.length} total item responses`)

    // ── Group behavioral scored values by dimension ──────────────
    const behavioralByDimension = new Map<DimensionId, number[]>()
    const sjiByDimension = new Map<DimensionId, number>()
    const imRawResponses: number[] = []
    const allSjiTags: SjiBehavioralTag[] = []

    for (const resp of allResponses) {
      if (resp.item_type === 'behavioral' && resp.dimension) {
        const dimId = resp.dimension as DimensionId
        if (!behavioralByDimension.has(dimId)) {
          behavioralByDimension.set(dimId, [])
        }
        behavioralByDimension.get(dimId)!.push(resp.scored_value)
      } else if (resp.item_type === 'sji' && resp.dimension) {
        const dimId = resp.dimension as DimensionId
        sjiByDimension.set(dimId, resp.scored_value)

        // Re-extract SJI behavioral tag from raw response
        const sjiItem = sjiItems.find(s => s.id === resp.item_id)
        if (sjiItem) {
          const selectedOption = sjiItem.options.find(opt => opt.maturityScore === resp.raw_response)
          if (selectedOption) {
            allSjiTags.push(selectedOption.behavioralTag)
          }
        }
      } else if (resp.item_type === 'im') {
        imRawResponses.push(resp.raw_response)
      }
    }

    logs.push(`Grouped: ${behavioralByDimension.size} dimensions with behavioral data, ${sjiByDimension.size} SJI scores, ${imRawResponses.length} IM items`)

    // ── Calculate all 15 dimension scores ────────────────────────
    logs.push('Calculating 15 dimension scores...')

    const dimensionScores = DIMENSIONS.map(dim => {
      const behavioralValues = behavioralByDimension.get(dim.id) ?? []
      const sjiScaled = sjiByDimension.get(dim.id)
      const score = calculateDimensionScore(behavioralValues, sjiScaled, dim.id)

      logs.push(`  ${dim.id} (${dim.name}): behavioral_mean=${score.behavioralMean}, sji=${score.sjiScaled ?? 'N/A'}, composite=${score.composite}, pct=${score.percentage}%, label=${score.verbalLabel}, confidence=${score.confidence}`)

      return score
    })

    // ── Calculate 3 territory scores ─────────────────────────────
    logs.push('Calculating 3 territory scores...')

    const territories: Territory[] = ['leading_yourself', 'leading_teams', 'leading_organizations']
    const territoryScores = territories.map(territory => {
      const dims = dimensionScores.filter(d => {
        const def = DIMENSIONS.find(dd => dd.id === d.dimensionId)
        return def?.territory === territory
      })
      const score = calculateTerritoryScore(territory, dims)
      logs.push(`  ${territory}: score=${score.score}%, label=${score.verbalLabel}`)
      return score
    })

    // ── Calculate CLMI ───────────────────────────────────────────
    const clmi = calculateCLMI(territoryScores)
    logs.push(`CLMI: ${clmi}%`)

    // ── Calculate IM ─────────────────────────────────────────────
    const im = calculateIM(imRawResponses)
    logs.push(`IM: total=${im.total}, flagged=${im.flagged}`)

    // ── Detect archetypes ────────────────────────────────────────
    logs.push('Detecting archetypes...')
    const archetypes = detectArchetypes(dimensionScores, im.flagged, allSjiTags)
    for (const arch of archetypes) {
      logs.push(`  #${arch.displayRank}: ${arch.name} (${arch.matchType}, strength=${arch.signatureStrength}, sji_confirmed=${arch.sjiConfirmed ?? 'N/A'})`)
    }

    // ── Select priority dimensions ───────────────────────────────
    logs.push('Selecting priority dimensions...')
    const priorityDimensions = selectPriorityDimensions(dimensionScores)
    logs.push(`Priority dimensions: ${priorityDimensions.join(', ')}`)

    // ── Flag response times ──────────────────────────────────────
    logs.push('Flagging response times...')

    const itemTimings = allResponses.map((r: { item_id: string; response_time_ms: number }) => ({
      itemId: r.item_id,
      responseTimeMs: r.response_time_ms,
    }))

    // Calculate stage times from item response times
    const stageTimes: Record<number, number> = {}
    for (const resp of allResponses) {
      const s = resp.stage as number
      if (!stageTimes[s]) stageTimes[s] = 0
      stageTimes[s] += (resp.response_time_ms || 0) / 1000 // Convert ms to seconds
    }

    const totalTimeSeconds = Object.values(stageTimes).reduce((a, b) => a + b, 0)

    const responseTimeFlags = flagResponseTimes(itemTimings, stageTimes, totalTimeSeconds)
    logs.push(`Response time flags: ${responseTimeFlags.length} flags`)
    for (const flag of responseTimeFlags) {
      logs.push(`  ${flag.flagType}: item=${flag.itemId ?? 'N/A'}, value=${flag.valueMs}ms, stage=${flag.stage ?? 'N/A'}`)
    }

    // ── STEP 8: Save dimension scores to DB ──────────────────────
    logs.push('Step 8: Saving dimension scores...')

    const dimensionScoreRecords = dimensionScores.map(ds => ({
      session_id: sessionId,
      dimension: ds.dimensionId,
      behavioral_mean: ds.behavioralMean,
      sji_scaled: ds.sjiScaled ?? null,
      composite: ds.composite,
      percentage: ds.percentage,
      verbal_label: ds.verbalLabel,
      confidence: ds.confidence,
    }))

    const { error: dimScoreError } = await supabase
      .from('dimension_scores')
      .upsert(dimensionScoreRecords, {
        onConflict: 'session_id,dimension'
      })

    if (dimScoreError) {
      logs.push(`Dimension scores save error: ${dimScoreError.message}`)
      // Don't fail the whole request - responses are saved
      logs.push('Warning: Dimension scores not saved but item responses are safe')
    } else {
      logs.push(`Saved ${dimensionScoreRecords.length} dimension scores`)
    }

    // ── Save territory scores to DB ──────────────────────────────
    logs.push('Saving territory scores...')

    const territoryScoreRecords = territoryScores.map(ts => ({
      session_id: sessionId,
      territory: ts.territory,
      score: ts.score,
      verbal_label: ts.verbalLabel,
    }))

    const { error: terrScoreError } = await supabase
      .from('territory_scores')
      .upsert(territoryScoreRecords, {
        onConflict: 'session_id,territory'
      })

    if (terrScoreError) {
      logs.push(`Territory scores save error: ${terrScoreError.message}`)
      logs.push('Warning: Territory scores not saved but item responses are safe')
    } else {
      logs.push(`Saved ${territoryScoreRecords.length} territory scores`)
    }

    // ── Save archetype matches to DB ─────────────────────────────
    logs.push('Saving archetype matches...')

    // Delete existing archetype matches for this session first
    const { error: archDeleteError } = await supabase
      .from('archetype_matches')
      .delete()
      .eq('session_id', sessionId)

    if (archDeleteError) {
      logs.push(`Archetype delete error: ${archDeleteError.message}`)
    }

    if (archetypes.length > 0) {
      const archetypeRecords = archetypes.map(a => ({
        session_id: sessionId,
        archetype_name: a.name,
        match_type: a.matchType,
        signature_strength: a.signatureStrength,
        sji_confirmed: a.sjiConfirmed ?? null,
        mirror_amplified: a.mirrorAmplified ?? null,
        display_rank: a.displayRank,
      }))

      const { error: archInsertError } = await supabase
        .from('archetype_matches')
        .insert(archetypeRecords)

      if (archInsertError) {
        logs.push(`Archetype insert error: ${archInsertError.message}`)
        logs.push('Warning: Archetypes not saved but scores are safe')
      } else {
        logs.push(`Saved ${archetypeRecords.length} archetype matches`)
      }
    } else {
      logs.push('No archetypes detected')
    }

    // ── Save response time flags to DB ───────────────────────────
    logs.push('Saving response time flags...')

    // Delete existing flags for this session first
    const { error: flagDeleteError } = await supabase
      .from('response_time_flags')
      .delete()
      .eq('session_id', sessionId)

    if (flagDeleteError) {
      logs.push(`Flag delete error: ${flagDeleteError.message}`)
    }

    if (responseTimeFlags.length > 0) {
      const flagRecords = responseTimeFlags.map(f => ({
        session_id: sessionId,
        flag_type: f.flagType,
        item_id: f.itemId ?? null,
        value_ms: f.valueMs,
        stage: f.stage ?? null,
      }))

      const { error: flagInsertError } = await supabase
        .from('response_time_flags')
        .insert(flagRecords)

      if (flagInsertError) {
        logs.push(`Flag insert error: ${flagInsertError.message}`)
        logs.push('Warning: Response time flags not saved but scores are safe')
      } else {
        logs.push(`Saved ${flagRecords.length} response time flags`)
      }
    } else {
      logs.push('No response time flags to save')
    }

    // ── Update assessment session as complete ────────────────────
    logs.push('Updating assessment session as complete...')

    const { error: completeError } = await supabase
      .from('assessment_sessions')
      .update({
        completed_at: new Date().toISOString(),
        clmi,
        im_total: im.total,
        im_flagged: im.flagged,
        total_time_seconds: Math.round(totalTimeSeconds),
      })
      .eq('id', sessionId)

    if (completeError) {
      logs.push(`Session complete update error: ${completeError.message}`)
      logs.push('Warning: Session not marked complete but all scores are saved')
    } else {
      logs.push(`Session marked complete: clmi=${clmi}, im_total=${im.total}, im_flagged=${im.flagged}, total_time=${Math.round(totalTimeSeconds)}s`)
    }

    // ── SUCCESS ──────────────────────────────────────────────────
    const duration = Date.now() - startTime
    logs.push(`=== V4 SAVE COMPLETED in ${duration}ms ===`)

    return NextResponse.json({
      success: true,
      stageCompleted: stage,
      assessmentComplete: true,
      scores: {
        clmi,
        im: { total: im.total, flagged: im.flagged },
        territories: territoryScores.map(ts => ({
          territory: ts.territory,
          score: ts.score,
          verbalLabel: ts.verbalLabel,
        })),
        dimensions: dimensionScores.map(ds => ({
          dimensionId: ds.dimensionId,
          composite: ds.composite,
          percentage: ds.percentage,
          verbalLabel: ds.verbalLabel,
          confidence: ds.confidence,
        })),
        archetypes: archetypes.map(a => ({
          name: a.name,
          matchType: a.matchType,
          signatureStrength: a.signatureStrength,
          sjiConfirmed: a.sjiConfirmed,
          displayRank: a.displayRank,
        })),
        priorityDimensions,
      },
      responsesSaved: responseRecords.length,
      responseTimeFlags: responseTimeFlags.length,
      duration,
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
