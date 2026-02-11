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

    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString()

    // Fetch all data in parallel
    const [profilesRes, sessionsRes, pulsesRes, mirrorsRes, hooksRes, responsesRes] = await Promise.all([
      supabaseAdmin.from('user_profiles').select('id, subscription_status, created_at'),
      supabaseAdmin.from('assessment_sessions').select('ceo_id, started_at, completed_at, stage_reached, clmi, total_time_seconds, version').eq('version', '4.0'),
      supabaseAdmin.from('weekly_pulse').select('ceo_id, responded_at'),
      supabaseAdmin.from('mirror_sessions').select('id, session_id, completed_at, assessment_sessions!inner(ceo_id)'),
      supabaseAdmin.from('hook_sessions').select('id, ceo_id, completed_at, converted'),
      supabaseAdmin.from('item_responses').select('session_id, stage, response_time_ms, responded_at'),
    ])

    const profiles = profilesRes.data || []
    const sessions = sessionsRes.data || []
    const pulses = pulsesRes.data || []
    const mirrors = mirrorsRes.data || []
    const hooks = hooksRes.data || []
    const responses = responsesRes.data || []

    const totalUsers = profiles.length
    const activeSubscribers = profiles.filter(p => p.subscription_status === 'active').length
    const inactiveUsers = profiles.filter(p => p.subscription_status !== 'active').length

    // ── 1. Subscription conversion rate ──
    const subscriptionConversionRate = totalUsers > 0
      ? Math.round((activeSubscribers / totalUsers) * 100)
      : 0

    // ── 2. Baseline start rate (of subscribed users) ──
    const usersWithSessions = new Set(sessions.map(s => s.ceo_id))
    const subscribedUsers = profiles.filter(p => p.subscription_status === 'active')
    const baselineStartRate = subscribedUsers.length > 0
      ? Math.round((subscribedUsers.filter(p => usersWithSessions.has(p.id)).length / subscribedUsers.length) * 100)
      : 0

    // ── 3. Baseline completion rate (of starters) ──
    const completedSessions = sessions.filter(s => s.completed_at)
    const usersWhoCompleted = new Set(completedSessions.map(s => s.ceo_id))
    const baselineCompletionRate = usersWithSessions.size > 0
      ? Math.round((usersWhoCompleted.size / usersWithSessions.size) * 100)
      : 0

    // ── 4. Average baseline duration (hours) ──
    const durations = completedSessions
      .filter(s => s.started_at && s.completed_at)
      .map(s => (new Date(s.completed_at!).getTime() - new Date(s.started_at).getTime()) / (1000 * 60 * 60))
    const avgBaselineDurationHours = durations.length > 0
      ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length * 10) / 10
      : null

    // ── 5. Average total assessment time (minutes) ──
    const totalTimes = completedSessions.filter(s => s.total_time_seconds).map(s => s.total_time_seconds! / 60)
    const avgAssessmentMinutes = totalTimes.length > 0
      ? Math.round(totalTimes.reduce((a, b) => a + b, 0) / totalTimes.length)
      : null

    // ── 6. Average time per stage (minutes) ──
    const stageTimesMap: Record<number, number[]> = { 1: [], 2: [], 3: [] }
    // Group responses by session+stage, compute duration from first to last response
    const sessionStageResponses = new Map<string, { min: number; max: number }>()
    for (const r of responses) {
      if (!r.responded_at || !r.stage) continue
      const key = `${r.session_id}-${r.stage}`
      const t = new Date(r.responded_at).getTime()
      const existing = sessionStageResponses.get(key)
      if (!existing) {
        sessionStageResponses.set(key, { min: t, max: t })
      } else {
        if (t < existing.min) existing.min = t
        if (t > existing.max) existing.max = t
      }
    }
    for (const [key, { min, max }] of sessionStageResponses) {
      const stage = parseInt(key.split('-').pop() || '0')
      if (stage >= 1 && stage <= 3 && max > min) {
        stageTimesMap[stage].push((max - min) / (1000 * 60))
      }
    }
    const avgTimePerStage = Object.fromEntries(
      Object.entries(stageTimesMap).map(([stage, times]) => [
        stage,
        times.length > 0 ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : null,
      ])
    )

    // ── 7. Average response time per item (seconds) ──
    const responseTimes = responses.filter(r => r.response_time_ms && r.response_time_ms > 0).map(r => r.response_time_ms!)
    const avgResponseTimeSeconds = responseTimes.length > 0
      ? Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length / 100) / 10
      : null

    // ── 8. Weekly check-in frequency ──
    const pulseUsers = new Map<string, Set<string>>()
    for (const p of pulses) {
      const week = p.responded_at.substring(0, 10) // group by date for unique check-in days
      if (!pulseUsers.has(p.ceo_id)) pulseUsers.set(p.ceo_id, new Set())
      pulseUsers.get(p.ceo_id)!.add(week)
    }
    const totalCheckinDays = Array.from(pulseUsers.values()).reduce((sum, dates) => sum + dates.size, 0)
    const avgCheckinsPerUser = pulseUsers.size > 0
      ? Math.round(totalCheckinDays / pulseUsers.size * 10) / 10
      : 0

    // ── 9. Active users (7d / 30d) ──
    const activeUserIds7d = new Set<string>()
    const activeUserIds30d = new Set<string>()
    for (const s of sessions) {
      if (s.started_at >= weekAgo) activeUserIds7d.add(s.ceo_id)
      if (s.started_at >= monthAgo) activeUserIds30d.add(s.ceo_id)
    }
    for (const p of pulses) {
      if (p.responded_at >= weekAgo) activeUserIds7d.add(p.ceo_id)
      if (p.responded_at >= monthAgo) activeUserIds30d.add(p.ceo_id)
    }

    // ── 10. Mirror response rate ──
    const totalMirrorInvites = mirrors.length
    const completedMirrors = mirrors.filter(m => m.completed_at).length
    const mirrorResponseRate = totalMirrorInvites > 0
      ? Math.round((completedMirrors / totalMirrorInvites) * 100)
      : null

    // ── 11. Hook conversion rate ──
    const totalHooks = hooks.length
    const convertedHooks = hooks.filter(h => h.converted).length
    const hookConversionRate = totalHooks > 0
      ? Math.round((convertedHooks / totalHooks) * 100)
      : null

    // ── 12. CLMI distribution ──
    const clmiValues = completedSessions.filter(s => s.clmi).map(s => Number(s.clmi))
    const avgClmi = clmiValues.length > 0
      ? Math.round(clmiValues.reduce((a, b) => a + b, 0) / clmiValues.length)
      : null
    const clmiDistribution = {
      '0-25': clmiValues.filter(v => v <= 25).length,
      '26-50': clmiValues.filter(v => v > 25 && v <= 50).length,
      '51-75': clmiValues.filter(v => v > 50 && v <= 75).length,
      '76-100': clmiValues.filter(v => v > 75).length,
    }

    // ── 13. Churn risk — active subscribers with no activity in 14+ days ──
    const recentlyActive = new Set<string>()
    for (const s of sessions) {
      if (s.started_at >= twoWeeksAgo || (s.completed_at && s.completed_at >= twoWeeksAgo)) {
        recentlyActive.add(s.ceo_id)
      }
    }
    for (const p of pulses) {
      if (p.responded_at >= twoWeeksAgo) recentlyActive.add(p.ceo_id)
    }
    const churnRisk = subscribedUsers.filter(p => !recentlyActive.has(p.id))
    const churnRiskCount = churnRisk.length

    // ── 14. Signup trend (signups per week, last 8 weeks) ──
    const signupWeeks: Record<string, number> = {}
    for (let i = 0; i < 8; i++) {
      const weekStart = new Date(now.getTime() - (i + 1) * 7 * 24 * 60 * 60 * 1000)
      const weekEnd = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000)
      const label = weekStart.toISOString().substring(5, 10)
      signupWeeks[label] = profiles.filter(p => {
        const d = new Date(p.created_at)
        return d >= weekStart && d < weekEnd
      }).length
    }

    // ── 15. Time from signup to baseline start (days) ──
    const signupToStartDays: number[] = []
    for (const s of sessions) {
      const profile = profiles.find(p => p.id === s.ceo_id)
      if (profile && s.started_at) {
        const days = (new Date(s.started_at).getTime() - new Date(profile.created_at).getTime()) / (1000 * 60 * 60 * 24)
        if (days >= 0) signupToStartDays.push(days)
      }
    }
    const avgSignupToStartDays = signupToStartDays.length > 0
      ? Math.round(signupToStartDays.reduce((a, b) => a + b, 0) / signupToStartDays.length * 10) / 10
      : null

    return NextResponse.json({
      overview: {
        totalUsers,
        activeSubscribers,
        inactiveUsers,
        subscriptionConversionRate,
      },
      baseline: {
        startRate: baselineStartRate,
        completionRate: baselineCompletionRate,
        avgDurationHours: avgBaselineDurationHours,
        avgAssessmentMinutes,
        avgTimePerStage,
        avgResponseTimeSeconds,
        avgSignupToStartDays,
      },
      engagement: {
        avgCheckinsPerUser,
        activeUsers7d: activeUserIds7d.size,
        activeUsers30d: activeUserIds30d.size,
        churnRiskCount,
        totalCheckins: pulses.length,
      },
      mirror: {
        totalInvites: totalMirrorInvites,
        completed: completedMirrors,
        responseRate: mirrorResponseRate,
      },
      hook: {
        total: totalHooks,
        converted: convertedHooks,
        conversionRate: hookConversionRate,
      },
      scores: {
        avgClmi,
        clmiDistribution,
      },
      trends: {
        signupWeeks,
      },
    })
  } catch (error: any) {
    console.error('Admin report error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
