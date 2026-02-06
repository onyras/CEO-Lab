import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { DIMENSIONS } from '@/lib/constants'
import { selectPriorityDimensions } from '@/lib/scoring'
import type { FullResults } from '@/types/assessment'

// ─── GET: Fetch complete assessment results ─────────────────────────

export async function GET(request: Request) {
  try {
    // Initialize Supabase
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    )

    // STEP 1: Auth check
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    // STEP 2: Get sessionId from URL params (optional)
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')

    // STEP 3: Load assessment session
    let sessionQuery = supabase
      .from('assessment_sessions')
      .select('*')
      .eq('ceo_id', user.id)

    if (sessionId) {
      // Specific session requested
      sessionQuery = sessionQuery.eq('id', sessionId)
    } else {
      // Get latest completed session
      sessionQuery = sessionQuery
        .not('completed_at', 'is', null)
        .order('completed_at', { ascending: false })
        .limit(1)
    }

    const { data: sessionData, error: sessionError } = await sessionQuery.maybeSingle()

    if (sessionError) {
      return NextResponse.json(
        { success: false, error: `Failed to load session: ${sessionError.message}` },
        { status: 500 }
      )
    }

    if (!sessionData) {
      return NextResponse.json(
        { success: false, error: 'No assessment session found' },
        { status: 404 }
      )
    }

    // Verify session belongs to the authenticated user
    if (sessionData.ceo_id !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Session does not belong to this user' },
        { status: 403 }
      )
    }

    const sid = sessionData.id

    // STEP 4-8: Load all score data in parallel
    const [
      dimensionScoresResult,
      territoryScoresResult,
      archetypeMatchesResult,
      mirrorGapsResult,
      blindSpotIndexResult,
    ] = await Promise.all([
      // STEP 4: Dimension scores
      supabase
        .from('dimension_scores')
        .select('*')
        .eq('session_id', sid),

      // STEP 5: Territory scores
      supabase
        .from('territory_scores')
        .select('*')
        .eq('session_id', sid),

      // STEP 6: Archetype matches (ordered by display_rank)
      supabase
        .from('archetype_matches')
        .select('*')
        .eq('session_id', sid)
        .order('display_rank', { ascending: true }),

      // STEP 7: Mirror gaps (may be empty)
      supabase
        .from('mirror_gaps')
        .select('*')
        .eq('session_id', sid),

      // STEP 8: Blind spot index (may be empty)
      supabase
        .from('blind_spot_index')
        .select('*')
        .eq('session_id', sid)
        .maybeSingle(),
    ])

    // Check for errors
    if (dimensionScoresResult.error) {
      return NextResponse.json(
        { success: false, error: `Failed to load dimension scores: ${dimensionScoresResult.error.message}` },
        { status: 500 }
      )
    }

    if (territoryScoresResult.error) {
      return NextResponse.json(
        { success: false, error: `Failed to load territory scores: ${territoryScoresResult.error.message}` },
        { status: 500 }
      )
    }

    if (archetypeMatchesResult.error) {
      return NextResponse.json(
        { success: false, error: `Failed to load archetype matches: ${archetypeMatchesResult.error.message}` },
        { status: 500 }
      )
    }

    if (mirrorGapsResult.error) {
      return NextResponse.json(
        { success: false, error: `Failed to load mirror gaps: ${mirrorGapsResult.error.message}` },
        { status: 500 }
      )
    }

    if (blindSpotIndexResult.error) {
      return NextResponse.json(
        { success: false, error: `Failed to load blind spot index: ${blindSpotIndexResult.error.message}` },
        { status: 500 }
      )
    }

    const dimensionScores = dimensionScoresResult.data || []
    const territoryScores = territoryScoresResult.data || []
    const archetypes = archetypeMatchesResult.data || []
    const mirrorGaps = mirrorGapsResult.data || []
    const blindSpotData = blindSpotIndexResult.data

    // STEP 9: Determine priority dimensions from dimension scores
    const priorityDimensions = selectPriorityDimensions(
      dimensionScores,
      mirrorGaps.length > 0 ? mirrorGaps : undefined
    )

    // STEP 10: Build session object
    const session = {
      id: sessionData.id,
      ceoId: sessionData.ceo_id,
      version: sessionData.version,
      form: sessionData.form,
      startedAt: sessionData.started_at,
      completedAt: sessionData.completed_at,
      stageReached: sessionData.stage_reached,
      imTotal: sessionData.im_total,
      imFlagged: sessionData.im_flagged,
      clmi: sessionData.clmi,
      bsi: sessionData.bsi,
      totalTimeSeconds: sessionData.total_time_seconds,
    }

    // Build FullResults
    const results: FullResults = {
      session,
      dimensionScores,
      territoryScores,
      archetypes,
      priorityDimensions,
      ...(mirrorGaps.length > 0 && { mirrorGaps }),
      ...(blindSpotData?.bsi != null && { bsi: blindSpotData.bsi }),
      ...(blindSpotData?.directional_bsi != null && { directionalBsi: blindSpotData.directional_bsi }),
    }

    // STEP 11: Return response
    return NextResponse.json({
      success: true,
      results,
    })

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Unknown server error' },
      { status: 500 }
    )
  }
}
