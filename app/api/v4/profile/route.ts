import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'

// ─── GET: Load user profile ────────────────────────────────────────

export async function GET() {
  try {
    const supabase = await createServerSupabase()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 })
    }

    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('full_name, subscription_status')
      .eq('id', user.id)
      .single()

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      profile: {
        full_name: profile?.full_name || '',
        email: user.email || '',
        avatar_url: user.user_metadata?.avatar_url || null,
        subscription_status: profile?.subscription_status || 'inactive',
      },
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// ─── PATCH: Update user profile ─────────────────────────────────────

export async function PATCH(request: Request) {
  try {
    const supabase = await createServerSupabase()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 })
    }

    const body = await request.json()
    const { full_name } = body

    if (typeof full_name !== 'string' || full_name.trim().length === 0) {
      return NextResponse.json({ success: false, error: 'Full name is required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('user_profiles')
      .update({ full_name: full_name.trim() })
      .eq('id', user.id)

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, full_name: full_name.trim() })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
