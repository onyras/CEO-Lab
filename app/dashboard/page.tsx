'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import { getVerbalLabel } from '@/lib/scoring'
import { AppShell } from '@/components/layout/AppShell'
import type { VerbalLabel } from '@/types/assessment'

// ─── Types ────────────────────────────────────────────────────────

type AdminState = 'loading' | 'error' | 'loaded'

interface AdminData {
  userName: string
  clmi: number
  lastAssessmentDate: string | null
  weeklyPulseCount: number
  lastPulseDate: string | null
  mirrorCount: number
  bsi: number | null
  hasCompletedBaseline: boolean
}

// ─── Loading Skeleton ──────────────────────────────────────────────

function AdminSkeleton() {
  return (
    <AppShell>
      <div className="px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10">
            <div className="h-4 w-16 bg-black/5 rounded mb-3 animate-pulse" />
            <div className="h-8 w-48 bg-black/5 rounded animate-pulse" />
          </div>
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 border border-black/5 animate-pulse">
                <div className="h-5 w-40 bg-black/5 rounded mb-4" />
                <div className="h-3 w-full bg-black/5 rounded mb-2" />
                <div className="h-3 w-3/4 bg-black/5 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  )
}

// ─── History types + row component ──────────────────────────────

interface HistoryBaseline {
  id: string
  completedAt: string | null
  createdAt: string
  stageReached: number
  clmi: number | null
}

interface HistoryMirror {
  id: string
  raterName: string | null
  completedAt: string | null
  createdAt: string
}

interface HistoryWeekly {
  id: string
  quarter: string
  respondedAt: string
}

function HistoryRow({
  label,
  date,
  status,
  score,
}: {
  label: string
  date: string
  status: string
  score?: number | null
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-black/5 last:border-0">
      <div>
        <p className="text-sm font-medium text-black">{label}</p>
        <p className="text-xs text-black/40">
          {new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>
      <div className="flex items-center gap-3">
        {score != null && (
          <span className="text-sm font-semibold text-black">{Math.round(score)}%</span>
        )}
        <span className="text-xs text-black/50">{status}</span>
      </div>
    </div>
  )
}

// ─── Main Component ────────────────────────────────────────────────

export default function AdminPage() {
  const router = useRouter()
  const [adminState, setAdminState] = useState<AdminState>('loading')
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<AdminData | null>(null)
  const [history, setHistory] = useState<{
    baselines: HistoryBaseline[]
    mirrors: HistoryMirror[]
    weeklies: HistoryWeekly[]
  } | null>(null)

  const loadAdmin = useCallback(async () => {
    try {
      setAdminState('loading')
      setError(null)

      const supabase = createClient()
      const { data: { user }, error: authError } = await supabase.auth.getUser()

      if (authError || !user) {
        router.push('/auth')
        return
      }

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('subscription_status, full_name')
        .eq('id', user.id)
        .single()

      const userName = profile?.full_name
        || user.user_metadata?.full_name
        || user.user_metadata?.name
        || user.email?.split('@')[0]
        || 'CEO'

      const isSubscribed = profile?.subscription_status === 'active'

      if (!isSubscribed) {
        setData({
          userName,
          clmi: 0,
          lastAssessmentDate: null,
          weeklyPulseCount: 0,
          lastPulseDate: null,
          mirrorCount: 0,
          bsi: null,
          hasCompletedBaseline: false,
        })
        setAdminState('loaded')
        return
      }

      // Check for completed session
      const { data: completedSession } = await supabase
        .from('assessment_sessions')
        .select('id, completed_at, clmi, bsi')
        .eq('ceo_id', user.id)
        .eq('version', '4.0')
        .not('completed_at', 'is', null)
        .order('completed_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (!completedSession) {
        setData({
          userName,
          clmi: 0,
          lastAssessmentDate: null,
          weeklyPulseCount: 0,
          lastPulseDate: null,
          mirrorCount: 0,
          bsi: null,
          hasCompletedBaseline: false,
        })
        setAdminState('loaded')
        return
      }

      // Load workshop data
      const now = new Date()
      const currentQuarter = `${now.getFullYear()}-Q${Math.ceil((now.getMonth() + 1) / 3)}`

      const [{ data: pulseRows }, { data: lastPulse }, { count: mirrorCount }] = await Promise.all([
        supabase
          .from('weekly_pulse')
          .select('responded_at')
          .eq('ceo_id', user.id)
          .eq('quarter', currentQuarter),
        supabase
          .from('weekly_pulse')
          .select('responded_at')
          .eq('ceo_id', user.id)
          .order('responded_at', { ascending: false })
          .limit(1)
          .maybeSingle(),
        supabase
          .from('mirror_sessions')
          .select('id', { count: 'exact', head: true })
          .eq('session_id', completedSession.id)
          .not('completed_at', 'is', null),
      ])

      const weeklyPulseCount = new Set((pulseRows || []).map((r: { responded_at: string }) => r.responded_at)).size

      setData({
        userName,
        clmi: completedSession.clmi ?? 0,
        lastAssessmentDate: completedSession.completed_at,
        weeklyPulseCount: weeklyPulseCount ?? 0,
        lastPulseDate: lastPulse?.responded_at ?? null,
        mirrorCount: mirrorCount ?? 0,
        bsi: completedSession.bsi ?? null,
        hasCompletedBaseline: true,
      })

      // Load history
      const [{ data: sessions }, { data: mirrorData }, { data: weeklyData }] = await Promise.all([
        supabase
          .from('assessment_sessions')
          .select('id, stage_reached, completed_at, created_at, clmi')
          .eq('ceo_id', user.id)
          .eq('version', '4.0')
          .order('created_at', { ascending: false }),
        supabase
          .from('mirror_sessions')
          .select('id, rater_name, completed_at, created_at')
          .eq('ceo_id', user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('weekly_pulse')
          .select('id, quarter, responded_at')
          .eq('ceo_id', user.id)
          .order('responded_at', { ascending: false })
          .limit(12),
      ])

      const completedBaseline = (sessions || []).find((b: any) => b.completed_at)

      setHistory({
        baselines: (sessions || [])
          .filter((b: any) => {
            if (b.completed_at) return true
            if (completedBaseline) return false
            return true
          })
          .map((b: any) => ({
            id: b.id,
            completedAt: b.completed_at,
            createdAt: b.created_at,
            stageReached: b.stage_reached,
            clmi: b.clmi,
          })),
        mirrors: (mirrorData || []).map((m: any) => ({
          id: m.id,
          raterName: m.rater_name,
          completedAt: m.completed_at,
          createdAt: m.created_at,
        })),
        weeklies: (weeklyData || []).map((w: any) => ({
          id: w.id,
          quarter: w.quarter,
          respondedAt: w.responded_at,
        })),
      })

      setAdminState('loaded')
    } catch (err: any) {
      console.error('Admin load error:', err)
      setError(err.message || 'Failed to load admin page')
      setAdminState('error')
    }
  }, [router])

  useEffect(() => {
    loadAdmin()
  }, [loadAdmin])

  if (adminState === 'loading') return <AdminSkeleton />

  if (adminState === 'error') {
    return (
      <AppShell>
        <div className="flex items-center justify-center px-6 min-h-[80vh]">
          <div className="max-w-md w-full">
            <div className="bg-white rounded-2xl p-8 border border-black/5">
              <h2 className="text-xl font-semibold text-black mb-3">Something went wrong</h2>
              <p className="text-black/60 text-sm mb-6">{error}</p>
              <button
                onClick={loadAdmin}
                className="px-6 py-2.5 bg-black text-white rounded-lg text-sm font-medium hover:bg-black/90 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </AppShell>
    )
  }

  if (!data) return null

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const hasHistory = history && (history.baselines.length > 0 || history.mirrors.length > 0 || history.weeklies.length > 0)

  return (
    <AppShell>
      <div className="px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8">
            <div>
              <p className="text-sm font-semibold tracking-widest uppercase text-black/40 mb-2">Admin</p>
              <h1 className="text-3xl md:text-4xl font-bold text-black tracking-tight">
                Workshop Management
              </h1>
            </div>
            <p className="text-sm text-black/40 mt-2 sm:mt-0">{today}</p>
          </div>

          {/* Not subscribed / no baseline — point to CEO Lab */}
          {!data.hasCompletedBaseline && (
            <div className="bg-white rounded-2xl p-8 border border-black/5 text-center mb-6">
              <p className="text-sm text-black/50 mb-4">
                Complete your baseline assessment in CEO Lab to unlock workshop management tools.
              </p>
              <a
                href="/ceolab"
                className="inline-block bg-black text-white px-8 py-3 rounded-lg text-sm font-semibold hover:bg-black/90 transition-colors"
              >
                Go to CEO Lab
              </a>
            </div>
          )}

          {/* Workshop cards — only shown when baseline is complete */}
          {data.hasCompletedBaseline && (
            <div className="space-y-6">
              {/* Baseline Assessment */}
              <div className="bg-white rounded-2xl p-8 border border-black/5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-black">Baseline Assessment</h2>
                    <p className="text-sm text-black/40 mt-1">96 questions across 15 leadership dimensions in three focused stages</p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#A6BEA4]/15 text-[#A6BEA4]">
                    Completed
                  </span>
                </div>

                <div className="flex items-center gap-6 mb-5">
                  <div>
                    <p className="text-3xl font-bold text-black">{Math.round(data.clmi)}%</p>
                    <p className="text-xs text-black/40">CLMI Score</p>
                  </div>
                  {data.lastAssessmentDate && (
                    <div>
                      <p className="text-sm font-medium text-black">
                        {new Date(data.lastAssessmentDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </p>
                      <p className="text-xs text-black/40">Last completed</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <a
                    href="/ceolab"
                    className="inline-flex items-center px-5 py-2.5 bg-black text-white rounded-lg text-sm font-medium hover:bg-black/90 transition-colors"
                  >
                    View Results
                  </a>
                  <a
                    href="/assessment/baseline"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 border border-black/10 text-black rounded-lg text-sm font-medium hover:border-black/20 hover:bg-black/[0.02] transition-all"
                  >
                    Retake Assessment
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path d="M6 3H3V13H13V10M9 3H13V7M13 3L7 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Weekly Check-in */}
              <div className="bg-white rounded-2xl p-8 border border-black/5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-black">Weekly Check-in</h2>
                    <p className="text-sm text-black/40 mt-1">Quick pulse on your 3 focus dimensions. Takes about 5 minutes.</p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                    data.weeklyPulseCount > 0 ? 'bg-[#A6BEA4]/15 text-[#A6BEA4]' : 'bg-black/5 text-black/50'
                  }`}>
                    {data.weeklyPulseCount > 0 ? `${data.weeklyPulseCount} check-ins` : 'Not Started'}
                  </span>
                </div>

                {data.weeklyPulseCount > 0 && data.lastPulseDate && (
                  <p className="text-xs text-black/40 mb-4">
                    Last check-in: {new Date(data.lastPulseDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                )}

                <a
                  href="/assessment/weekly"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-lg text-sm font-medium hover:bg-black/90 transition-colors"
                >
                  {data.weeklyPulseCount > 0 ? 'Open Check-in' : 'Start Check-ins'}
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M6 3H3V13H13V10M9 3H13V7M13 3L7 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </div>

              {/* Mirror Check */}
              <div className="bg-white rounded-2xl p-8 border border-black/5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-black">Mirror Check</h2>
                    <p className="text-sm text-black/40 mt-1">Invite a colleague to rate you on the same dimensions. Reveals blind spots.</p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                    data.mirrorCount > 0 ? 'bg-[#A6BEA4]/15 text-[#A6BEA4]' : 'bg-black/5 text-black/50'
                  }`}>
                    {data.mirrorCount > 0 ? `${data.mirrorCount} completed` : 'No Raters'}
                  </span>
                </div>

                {data.mirrorCount > 0 && data.bsi != null && (
                  <div className="flex items-center gap-4 mb-4">
                    <div>
                      <p className="text-2xl font-bold text-black">{Math.round(data.bsi)}</p>
                      <p className="text-xs text-black/40">Blind Spot Index</p>
                    </div>
                  </div>
                )}

                <a
                  href="/assessment/mirror"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-lg text-sm font-medium hover:bg-black/90 transition-colors"
                >
                  {data.mirrorCount > 0 ? 'Invite Another Rater' : 'Invite a Colleague'}
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M6 3H3V13H13V10M9 3H13V7M13 3L7 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </div>

              {/* History */}
              {hasHistory && (
                <div className="bg-white rounded-2xl border border-black/5 p-6">
                  <h2 className="text-sm font-semibold text-black/40 uppercase tracking-wider mb-4">History</h2>
                  <div>
                    {history.baselines.map((b) => (
                      <HistoryRow
                        key={b.id}
                        label={`Baseline Assessment ${b.completedAt ? '' : '(in progress)'}`}
                        date={b.completedAt || b.createdAt}
                        status={b.completedAt ? 'Completed' : `Stage ${b.stageReached}/3`}
                        score={b.clmi}
                      />
                    ))}
                    {history.mirrors.map((m) => (
                      <HistoryRow
                        key={m.id}
                        label={`Mirror Check${m.raterName ? ` — ${m.raterName}` : ''}`}
                        date={m.completedAt || m.createdAt}
                        status={m.completedAt ? 'Completed' : 'Pending'}
                      />
                    ))}
                    {history.weeklies.slice(0, 5).map((w) => (
                      <HistoryRow
                        key={w.id}
                        label={`Weekly Check-in (${w.quarter})`}
                        date={w.respondedAt}
                        status="Completed"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
