import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'
import { calculateWeeklyTrend } from '@/lib/scoring'
import type { DimensionId } from '@/types/assessment'

// ─── Request Types ──────────────────────────────────────────────────

interface WeeklySaveRequest {
  responses: {
    dimensionId: DimensionId
    score: number // 1-5
  }[]
  quarter: string // e.g., "2026-Q1"
}

// ─── POST: Save weekly pulse responses ──────────────────────────────

export async function POST(request: Request) {
  try {
    // Initialize Supabase
    const supabase = await createServerSupabase()

    // STEP 1: Auth check
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    // STEP 2: Parse request body
    const body: WeeklySaveRequest = await request.json()
    const { responses, quarter } = body

    if (!responses || !Array.isArray(responses) || responses.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Responses array is required and must not be empty' },
        { status: 400 }
      )
    }

    if (!quarter || typeof quarter !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Quarter is required (e.g., "2026-Q1")' },
        { status: 400 }
      )
    }

    // Validate each response
    for (const r of responses) {
      if (!r.dimensionId || typeof r.score !== 'number' || r.score < 1 || r.score > 5) {
        return NextResponse.json(
          { success: false, error: `Invalid response: dimensionId and score (1-5) required. Got: ${JSON.stringify(r)}` },
          { status: 400 }
        )
      }
    }

    // STEP 3: Insert each response into weekly_pulse
    const now = new Date().toISOString()
    const insertRows = responses.map(r => ({
      ceo_id: user.id,
      dimension: r.dimensionId,
      score: r.score,
      quarter,
      responded_at: now,
    }))

    const { error: insertError } = await supabase
      .from('weekly_pulse')
      .insert(insertRows)

    if (insertError) {
      return NextResponse.json(
        { success: false, error: `Failed to save responses: ${insertError.message}` },
        { status: 500 }
      )
    }

    // STEP 4: For each dimension, load all historical scores and calculate trend
    const trends: Record<string, string> = {}

    for (const r of responses) {
      const { data: historyRows, error: historyError } = await supabase
        .from('weekly_pulse')
        .select('score')
        .eq('ceo_id', user.id)
        .eq('dimension', r.dimensionId)
        .order('responded_at', { ascending: true })

      if (historyError) {
        // If we can't load history for one dimension, mark as insufficient
        trends[r.dimensionId] = 'insufficient_data'
        continue
      }

      const scores = (historyRows || []).map((row: { score: number }) => row.score as number)
      trends[r.dimensionId] = calculateWeeklyTrend(scores)
    }

    // STEP 5: Return response
    return NextResponse.json({
      success: true,
      saved: responses.length,
      trends,
    })

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Unknown server error' },
      { status: 500 }
    )
  }
}
