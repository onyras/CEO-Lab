import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'

// ─── GET: Check if user has seen the reveal ─────────────────────

export async function GET() {
  try {
    const supabase = await createServerSupabase()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { data, error } = await supabase
      .from('user_profiles')
      .select('reveal_seen')
      .eq('id', user.id)
      .maybeSingle()

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      revealSeen: data?.reveal_seen ?? false,
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Unknown error' },
      { status: 500 }
    )
  }
}

// ─── POST: Mark reveal as seen ──────────────────────────────────

export async function POST() {
  try {
    const supabase = await createServerSupabase()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { error } = await supabase
      .from('user_profiles')
      .update({ reveal_seen: true })
      .eq('id', user.id)

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Unknown error' },
      { status: 500 }
    )
  }
}
