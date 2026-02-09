import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { hookItems } from '@/lib/hook-questions'
import { calculateHookScores } from '@/lib/scoring'
import type { DimensionId, Territory } from '@/types/assessment'

// Service role client for insert (bypasses RLS — hook is designed for anonymous users)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

interface HookSaveRequest {
  responses: {
    itemId: string
    value: number
  }[]
}

export async function POST(request: Request) {
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

    // Step 1: Try to get user (optional — hook works without auth)
    const { data: { user } } = await supabase.auth.getUser()
    const ceoId = user?.id ?? null

    // Step 2: Parse and validate responses
    const body: HookSaveRequest = await request.json()

    if (!body.responses || !Array.isArray(body.responses) || body.responses.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Responses array is required' },
        { status: 400 }
      )
    }

    // Validate each response against known hook items
    const hookItemMap = new Map(hookItems.map(item => [item.id, item]))

    for (const r of body.responses) {
      if (!hookItemMap.has(r.itemId)) {
        return NextResponse.json(
          { success: false, error: `Unknown item: ${r.itemId}` },
          { status: 400 }
        )
      }
      if (r.value < 1 || r.value > 4 || !Number.isInteger(r.value)) {
        return NextResponse.json(
          { success: false, error: `Invalid value for ${r.itemId}: must be 1-4` },
          { status: 400 }
        )
      }
    }

    // Step 3: Map each response to its dimensions and territory
    const enrichedResponses = body.responses.map(r => {
      const item = hookItemMap.get(r.itemId)!
      return {
        itemId: r.itemId,
        dimensions: item.dimensions as DimensionId[],
        territory: item.territory as Territory,
        value: r.value,
      }
    })

    // Step 4: Calculate scores
    const scores = calculateHookScores(enrichedResponses)

    // Step 5: Save to hook_sessions table (using admin client to bypass RLS)
    const { data: hookSession, error: insertError } = await supabaseAdmin
      .from('hook_sessions')
      .insert({
        ceo_id: ceoId,
        completed_at: new Date().toISOString(),
        ly_score: scores.lyScore,
        lt_score: scores.ltScore,
        lo_score: scores.loScore,
        sharpest_dimension: scores.sharpestDimension,
        converted: false,
      })
      .select('id')
      .single()

    if (insertError || !hookSession) {
      return NextResponse.json(
        { success: false, error: `Failed to save hook session: ${insertError?.message || 'Unknown error'}` },
        { status: 500 }
      )
    }

    // Step 6: Return scores
    return NextResponse.json({
      success: true,
      hookSessionId: hookSession.id,
      scores: {
        lyScore: scores.lyScore,
        ltScore: scores.ltScore,
        loScore: scores.loScore,
        sharpestDimension: scores.sharpestDimension,
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Unknown server error' },
      { status: 500 }
    )
  }
}
