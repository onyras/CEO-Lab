import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { isAdminEmail } from '@/lib/admin'

export async function GET() {
  try {
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

    // Fetch all user profiles
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from('user_profiles')
      .select('id, full_name, subscription_status, baseline_completed, hook_completed, created_at, stripe_customer_id')
      .order('created_at', { ascending: false })

    if (profilesError) throw profilesError

    // Fetch auth users for emails
    const { data: { users: authUsers }, error: authError } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 })
    if (authError) throw authError

    const emailMap = new Map(authUsers.map(u => [u.id, u.email]))

    // Fetch latest assessment session per user
    const { data: sessions } = await supabaseAdmin
      .from('assessment_sessions')
      .select('ceo_id, clmi, completed_at, stage_reached, version')
      .eq('version', '4.0')
      .order('completed_at', { ascending: false })

    const sessionMap = new Map<string, { clmi: number | null; completed_at: string | null; stage_reached: number }>()
    for (const s of sessions || []) {
      if (!sessionMap.has(s.ceo_id)) {
        sessionMap.set(s.ceo_id, {
          clmi: s.clmi,
          completed_at: s.completed_at,
          stage_reached: s.stage_reached,
        })
      }
    }

    // Fetch weekly pulse counts per user
    const { data: pulses } = await supabaseAdmin
      .from('weekly_pulse')
      .select('ceo_id, responded_at')

    const pulseMap = new Map<string, { count: number; lastDate: string | null }>()
    for (const p of pulses || []) {
      const existing = pulseMap.get(p.ceo_id)
      if (!existing) {
        pulseMap.set(p.ceo_id, { count: 1, lastDate: p.responded_at })
      } else {
        existing.count++
        if (p.responded_at > (existing.lastDate || '')) {
          existing.lastDate = p.responded_at
        }
      }
    }

    // Fetch mirror session counts per user (via assessment_sessions)
    const { data: mirrors } = await supabaseAdmin
      .from('mirror_sessions')
      .select('session_id, completed_at')

    const mirrorSessionIds = new Set((mirrors || []).map(m => m.session_id))
    const mirrorCountMap = new Map<string, number>()
    for (const s of sessions || []) {
      if (mirrorSessionIds.has(s.ceo_id)) {
        // Need to map session_id -> ceo_id
      }
    }

    // Better approach: get mirror counts via session join
    const { data: mirrorWithCeo } = await supabaseAdmin
      .from('mirror_sessions')
      .select('session_id, completed_at, assessment_sessions!inner(ceo_id)')

    const mirrorMap = new Map<string, number>()
    for (const m of mirrorWithCeo || []) {
      const ceoId = (m as any).assessment_sessions?.ceo_id
      if (ceoId && m.completed_at) {
        mirrorMap.set(ceoId, (mirrorMap.get(ceoId) || 0) + 1)
      }
    }

    // Build response
    const users = (profiles || []).map(p => ({
      id: p.id,
      name: p.full_name || 'Unknown',
      email: emailMap.get(p.id) || 'Unknown',
      subscriptionStatus: p.subscription_status,
      baselineCompleted: p.baseline_completed,
      hookCompleted: p.hook_completed,
      joinedAt: p.created_at,
      stripeCustomerId: p.stripe_customer_id,
      clmi: sessionMap.get(p.id)?.clmi || null,
      baselineCompletedAt: sessionMap.get(p.id)?.completed_at || null,
      stageReached: sessionMap.get(p.id)?.stage_reached || 0,
      weeklyCount: pulseMap.get(p.id)?.count || 0,
      lastPulseDate: pulseMap.get(p.id)?.lastDate || null,
      mirrorCount: mirrorMap.get(p.id) || 0,
    }))

    return NextResponse.json({ users })
  } catch (error: any) {
    console.error('Admin users error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
