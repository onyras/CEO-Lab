import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { isAdminEmail } from '@/lib/admin'

interface ActivityEvent {
  type: string
  userId: string
  userName: string
  userEmail: string
  timestamp: string
  details: string
}

export async function GET(request: Request) {
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

    const url = new URL(request.url)
    const limit = parseInt(url.searchParams.get('limit') || '50')

    // Build user name/email maps from profiles + auth metadata
    const [profilesRes, authUsersRes] = await Promise.all([
      supabaseAdmin.from('user_profiles').select('id, full_name, created_at'),
      supabaseAdmin.auth.admin.listUsers({ perPage: 1000 }),
    ])
    const profiles = profilesRes.data || []
    const authUsers = authUsersRes.data?.users || []

    const authNameMap = new Map(authUsers.map(u => [u.id, u.user_metadata?.full_name || u.user_metadata?.name || null]))
    const emailMap = new Map(authUsers.map(u => [u.id, u.email || 'Unknown']))
    const nameMap = new Map(profiles.map(p => [p.id, p.full_name || authNameMap.get(p.id) || 'Unknown']))

    const events: ActivityEvent[] = []

    // 1. Assessment sessions (started + completed)
    const { data: sessions } = await supabaseAdmin
      .from('assessment_sessions')
      .select('ceo_id, started_at, completed_at, clmi, stage_reached, version')
      .eq('version', '4.0')
      .order('created_at', { ascending: false })
      .limit(100)

    for (const s of sessions || []) {
      if (s.completed_at) {
        events.push({
          type: 'baseline_completed',
          userId: s.ceo_id,
          userName: nameMap.get(s.ceo_id) || 'Unknown',
          userEmail: emailMap.get(s.ceo_id) || 'Unknown',
          timestamp: s.completed_at,
          details: `Completed baseline assessment (CLMI: ${s.clmi ? Math.round(Number(s.clmi)) : 'N/A'}%)`,
        })
      }
      events.push({
        type: 'baseline_started',
        userId: s.ceo_id,
        userName: nameMap.get(s.ceo_id) || 'Unknown',
        userEmail: emailMap.get(s.ceo_id) || 'Unknown',
        timestamp: s.started_at,
        details: `Started baseline assessment (Stage ${s.stage_reached}/3)`,
      })
    }

    // 2. Weekly pulse check-ins
    const { data: pulses } = await supabaseAdmin
      .from('weekly_pulse')
      .select('ceo_id, dimension, responded_at')
      .order('responded_at', { ascending: false })
      .limit(200)

    // Group pulses by ceo_id + date (they submit multiple dimensions at once)
    const pulseGroups = new Map<string, { ceo_id: string; date: string; count: number }>()
    for (const p of pulses || []) {
      const dateKey = p.responded_at.substring(0, 10)
      const key = `${p.ceo_id}-${dateKey}`
      const existing = pulseGroups.get(key)
      if (!existing) {
        pulseGroups.set(key, { ceo_id: p.ceo_id, date: p.responded_at, count: 1 })
      } else {
        existing.count++
      }
    }

    for (const g of pulseGroups.values()) {
      events.push({
        type: 'weekly_checkin',
        userId: g.ceo_id,
        userName: nameMap.get(g.ceo_id) || 'Unknown',
        userEmail: emailMap.get(g.ceo_id) || 'Unknown',
        timestamp: g.date,
        details: `Completed weekly check-in (${g.count} dimensions)`,
      })
    }

    // 3. Mirror sessions completed
    const { data: mirrors } = await supabaseAdmin
      .from('mirror_sessions')
      .select('session_id, rater_email, rater_relationship, completed_at, assessment_sessions!inner(ceo_id)')
      .not('completed_at', 'is', null)
      .order('completed_at', { ascending: false })
      .limit(50)

    for (const m of mirrors || []) {
      const ceoId = (m as any).assessment_sessions?.ceo_id
      if (ceoId) {
        events.push({
          type: 'mirror_completed',
          userId: ceoId,
          userName: nameMap.get(ceoId) || 'Unknown',
          userEmail: emailMap.get(ceoId) || 'Unknown',
          timestamp: m.completed_at!,
          details: `Mirror feedback received from ${m.rater_relationship || 'rater'}`,
        })
      }
    }

    // 4. Feedback submitted
    const { data: feedback } = await supabaseAdmin
      .from('user_feedback')
      .select('ceo_id, page_url, feedback_text, created_at')
      .order('created_at', { ascending: false })
      .limit(50)

    for (const f of feedback || []) {
      events.push({
        type: 'feedback_submitted',
        userId: f.ceo_id,
        userName: nameMap.get(f.ceo_id) || 'Unknown',
        userEmail: emailMap.get(f.ceo_id) || 'Unknown',
        timestamp: f.created_at,
        details: `Submitted feedback on ${f.page_url}: "${f.feedback_text.substring(0, 80)}${f.feedback_text.length > 80 ? '...' : ''}"`,
      })
    }

    // 5. New signups
    for (const p of profiles || []) {
      events.push({
        type: 'signup',
        userId: p.id,
        userName: nameMap.get(p.id) || 'Unknown',
        userEmail: emailMap.get(p.id) || 'Unknown',
        timestamp: p.created_at || new Date().toISOString(),
        details: 'New user signed up',
      })
    }

    // Sort by timestamp DESC and limit
    events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    return NextResponse.json({ events: events.slice(0, limit) })
  } catch (error: any) {
    console.error('Admin activity error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
