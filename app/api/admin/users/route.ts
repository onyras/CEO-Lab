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

    // Fetch all data in parallel
    const [profilesRes, authUsersRes, sessionsRes, pulsesRes, mirrorRes] = await Promise.all([
      supabaseAdmin
        .from('user_profiles')
        .select('id, full_name, subscription_status, baseline_completed, hook_completed, created_at, stripe_customer_id')
        .order('created_at', { ascending: false }),
      supabaseAdmin.auth.admin.listUsers({ perPage: 1000 }),
      supabaseAdmin
        .from('assessment_sessions')
        .select('ceo_id, clmi, completed_at, started_at, stage_reached, version, total_time_seconds')
        .eq('version', '4.0')
        .order('started_at', { ascending: false }),
      supabaseAdmin
        .from('weekly_pulse')
        .select('ceo_id, responded_at'),
      supabaseAdmin
        .from('mirror_sessions')
        .select('session_id, completed_at, assessment_sessions!inner(ceo_id)'),
    ])

    if (profilesRes.error) throw profilesRes.error

    const profiles = profilesRes.data || []
    const authUsers = authUsersRes.data?.users || []
    const sessions = sessionsRes.data || []
    const pulses = pulsesRes.data || []
    const mirrorWithCeo = mirrorRes.data || []

    // Build email + name maps from auth users (includes Google OAuth metadata)
    const emailMap = new Map(authUsers.map(u => [u.id, u.email]))
    const authNameMap = new Map(authUsers.map(u => [
      u.id,
      u.user_metadata?.full_name || u.user_metadata?.name || null,
    ]))

    // Build session map — prefer completed sessions, fall back to latest started
    const sessionMap = new Map<string, {
      clmi: number | null
      completed_at: string | null
      started_at: string | null
      stage_reached: number
      total_time_seconds: number | null
    }>()
    // First pass: all sessions (sorted by started_at desc, so first per user = latest)
    for (const s of sessions) {
      if (!sessionMap.has(s.ceo_id)) {
        sessionMap.set(s.ceo_id, {
          clmi: s.clmi,
          completed_at: s.completed_at,
          started_at: s.started_at,
          stage_reached: s.stage_reached,
          total_time_seconds: s.total_time_seconds,
        })
      }
    }
    // Second pass: override with completed session if one exists
    for (const s of sessions) {
      if (s.completed_at) {
        const existing = sessionMap.get(s.ceo_id)
        if (existing && !existing.completed_at) {
          sessionMap.set(s.ceo_id, {
            clmi: s.clmi,
            completed_at: s.completed_at,
            started_at: s.started_at,
            stage_reached: s.stage_reached,
            total_time_seconds: s.total_time_seconds,
          })
        }
      }
    }

    // Weekly pulse counts per user
    const pulseMap = new Map<string, { count: number; lastDate: string | null }>()
    for (const p of pulses) {
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

    // Mirror counts per CEO
    const mirrorMap = new Map<string, number>()
    for (const m of mirrorWithCeo) {
      const ceoId = (m as any).assessment_sessions?.ceo_id
      if (ceoId && m.completed_at) {
        mirrorMap.set(ceoId, (mirrorMap.get(ceoId) || 0) + 1)
      }
    }

    // Build response — derive baseline completion from actual session data
    const users = profiles.map(p => {
      const session = sessionMap.get(p.id)
      const hasCompletedBaseline = !!session?.completed_at
      return {
        id: p.id,
        name: p.full_name || authNameMap.get(p.id) || 'Unknown',
        email: emailMap.get(p.id) || 'Unknown',
        subscriptionStatus: p.subscription_status,
        baselineCompleted: hasCompletedBaseline,
        hookCompleted: p.hook_completed,
        joinedAt: p.created_at,
        stripeCustomerId: p.stripe_customer_id,
        clmi: session?.clmi || null,
        baselineCompletedAt: session?.completed_at || null,
        baselineStartedAt: session?.started_at || null,
        stageReached: session?.stage_reached || 0,
        totalTimeSeconds: session?.total_time_seconds || null,
        weeklyCount: pulseMap.get(p.id)?.count || 0,
        lastPulseDate: pulseMap.get(p.id)?.lastDate || null,
        mirrorCount: mirrorMap.get(p.id) || 0,
      }
    })

    return NextResponse.json({ users })
  } catch (error: any) {
    console.error('Admin users error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
