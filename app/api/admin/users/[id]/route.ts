import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { isAdminEmail } from '@/lib/admin'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params

    // Auth check
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) { return cookieStore.get(name)?.value },
          set(name: string, value: string, options: any) { cookieStore.set({ name, value, ...options }) },
          remove(name: string, options: any) { cookieStore.set({ name, value: '', ...options }) },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (!user?.email || !isAdminEmail(user.email)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Fetch user profile
    const { data: profile } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Fetch auth user for email
    const { data: { user: authUser } } = await supabaseAdmin.auth.admin.getUserById(userId)

    // Fetch all assessment sessions
    const { data: sessions } = await supabaseAdmin
      .from('assessment_sessions')
      .select('*')
      .eq('ceo_id', userId)
      .eq('version', '4.0')
      .order('created_at', { ascending: false })

    // Fetch dimension scores for latest completed session
    let dimensionScores: any[] = []
    let territoryScores: any[] = []
    let archetypeMatches: any[] = []
    const completedSession = (sessions || []).find(s => s.completed_at)

    if (completedSession) {
      const [dimRes, terRes, archRes] = await Promise.all([
        supabaseAdmin
          .from('dimension_scores')
          .select('*')
          .eq('session_id', completedSession.id),
        supabaseAdmin
          .from('territory_scores')
          .select('*')
          .eq('session_id', completedSession.id),
        supabaseAdmin
          .from('archetype_matches')
          .select('*')
          .eq('session_id', completedSession.id)
          .order('display_rank', { ascending: true }),
      ])
      dimensionScores = dimRes.data || []
      territoryScores = terRes.data || []
      archetypeMatches = archRes.data || []
    }

    // Fetch weekly pulse history
    const { data: pulses } = await supabaseAdmin
      .from('weekly_pulse')
      .select('*')
      .eq('ceo_id', userId)
      .order('responded_at', { ascending: false })

    // Fetch mirror sessions
    let mirrorSessions: any[] = []
    if (completedSession) {
      const { data: mirrors } = await supabaseAdmin
        .from('mirror_sessions')
        .select('*')
        .eq('session_id', completedSession.id)
      mirrorSessions = mirrors || []
    }

    // Fetch BSI
    let bsi: number | null = null
    if (completedSession) {
      const { data: bsiData } = await supabaseAdmin
        .from('blind_spot_index')
        .select('bsi')
        .eq('session_id', completedSession.id)
        .maybeSingle()
      bsi = bsiData?.bsi ?? null
    }

    // Fetch hook session
    const { data: hookSession } = await supabaseAdmin
      .from('hook_sessions')
      .select('*')
      .eq('ceo_id', userId)
      .order('completed_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    return NextResponse.json({
      user: {
        id: profile.id,
        name: profile.full_name,
        email: authUser?.email || 'Unknown',
        subscriptionStatus: profile.subscription_status,
        stripeCustomerId: profile.stripe_customer_id,
        stripeSubscriptionId: profile.stripe_subscription_id,
        baselineCompleted: profile.baseline_completed,
        hookCompleted: profile.hook_completed,
        joinedAt: profile.created_at,
      },
      sessions: sessions || [],
      dimensionScores,
      territoryScores,
      archetypeMatches,
      pulses: pulses || [],
      mirrorSessions,
      bsi,
      hookSession,
    })
  } catch (error: any) {
    console.error('Admin user detail error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
