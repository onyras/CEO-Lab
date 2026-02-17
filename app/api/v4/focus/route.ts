import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'
import type { DimensionId } from '@/types/assessment'

// ─── GET: Load current focus dimensions ─────────────────────────────

export async function GET() {
  try {
    const supabase = await createServerSupabase()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 })
    }

    const now = new Date()
    const year = now.getFullYear()
    const quarter = Math.ceil((now.getMonth() + 1) / 3)

    const { data, error } = await supabase
      .from('quarterly_focus')
      .select('sub_dimension_1, sub_dimension_2, sub_dimension_3, year, quarter')
      .eq('user_id', user.id)
      .eq('year', year)
      .eq('quarter', quarter)
      .maybeSingle()

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({
        success: true,
        dimensions: [],
        quarter,
        year,
      })
    }

    const dimensions: DimensionId[] = [
      data.sub_dimension_1 as DimensionId,
      data.sub_dimension_2 as DimensionId,
      data.sub_dimension_3 as DimensionId,
    ]

    return NextResponse.json({
      success: true,
      dimensions,
      quarter: data.quarter,
      year: data.year,
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// ─── POST: Upsert focus dimensions ──────────────────────────────────

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabase()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 })
    }

    const body = await request.json()
    const { dimensions } = body

    if (!dimensions || !Array.isArray(dimensions) || dimensions.length !== 3) {
      return NextResponse.json(
        { success: false, error: 'Exactly 3 dimensions are required' },
        { status: 400 }
      )
    }

    const now = new Date()
    const year = now.getFullYear()
    const quarter = Math.ceil((now.getMonth() + 1) / 3)

    const { error } = await supabase
      .from('quarterly_focus')
      .upsert({
        user_id: user.id,
        year,
        quarter,
        sub_dimension_1: dimensions[0],
        sub_dimension_2: dimensions[1],
        sub_dimension_3: dimensions[2],
      }, {
        onConflict: 'user_id,year,quarter',
      })

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, dimensions, quarter, year })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
