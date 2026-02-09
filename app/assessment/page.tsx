'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import { AppShell } from '@/components/layout/AppShell'

// ─── Types ────────────────────────────────────────────────────────

interface AssessmentRecord {
  id: string
  version: string
  stage_reached: number
  completed_at: string | null
  created_at: string
  clmi: number | null
}

interface MirrorRecord {
  id: string
  rater_name: string | null
  completed_at: string | null
  created_at: string
}

interface WeeklyRecord {
  id: string
  quarter: string
  responded_at: string
}

// ─── Assessment Card ──────────────────────────────────────────────

function AssessmentCard({
  title,
  description,
  status,
  statusLabel,
  lastDate,
  actionLabel,
  actionHref,
  disabled,
}: {
  title: string
  description: string
  status: 'not-started' | 'in-progress' | 'completed'
  statusLabel: string
  lastDate?: string | null
  actionLabel: string
  actionHref: string
  disabled?: boolean
}) {
  const statusColors = {
    'not-started': 'bg-black/5 text-black/50',
    'in-progress': 'bg-[#E08F6A]/15 text-[#E08F6A]',
    completed: 'bg-[#A6BEA4]/15 text-[#A6BEA4]',
  }

  return (
    <div className="bg-white rounded-xl border border-black/8 p-6">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-black">{title}</h3>
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}
        >
          {statusLabel}
        </span>
      </div>
      <p className="text-sm text-black/60 mb-4 leading-relaxed">{description}</p>
      {lastDate && (
        <p className="text-xs text-black/40 mb-4">
          Last completed: {new Date(lastDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </p>
      )}
      <a
        href={actionHref}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
          disabled
            ? 'bg-black/5 text-black/30 pointer-events-none'
            : 'bg-black text-white hover:bg-black/90'
        }`}
      >
        {actionLabel}
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M6 3H3V13H13V10M9 3H13V7M13 3L7 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </div>
  )
}

// ─── History Row ──────────────────────────────────────────────────

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

// ─── Page ─────────────────────────────────────────────────────────

export default function AssessmentHubPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [baselines, setBaselines] = useState<AssessmentRecord[]>([])
  const [mirrors, setMirrors] = useState<MirrorRecord[]>([])
  const [weeklies, setWeeklies] = useState<WeeklyRecord[]>([])
  const [isSubscribed, setIsSubscribed] = useState(false)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/auth')
        return
      }

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('subscription_status')
        .eq('id', user.id)
        .single()

      setIsSubscribed(profile?.subscription_status === 'active')

      const { data: sessions } = await supabase
        .from('assessment_sessions')
        .select('id, version, stage_reached, completed_at, created_at, clmi')
        .eq('ceo_id', user.id)
        .eq('version', '4.0')
        .order('created_at', { ascending: false })

      setBaselines(sessions || [])

      const { data: mirrorData } = await supabase
        .from('mirror_sessions')
        .select('id, rater_name, completed_at, created_at')
        .eq('ceo_id', user.id)
        .order('created_at', { ascending: false })

      setMirrors(mirrorData || [])

      const { data: weeklyData } = await supabase
        .from('weekly_pulse')
        .select('id, quarter, responded_at')
        .eq('ceo_id', user.id)
        .order('responded_at', { ascending: false })
        .limit(12)

      setWeeklies(weeklyData || [])

      setLoading(false)
    }
    load()
  }, [router])

  const completedBaseline = baselines.find((b) => b.completed_at)
  const inProgressBaseline = baselines.find((b) => !b.completed_at)

  const baselineStatus: 'not-started' | 'in-progress' | 'completed' = completedBaseline
    ? 'completed'
    : inProgressBaseline
    ? 'in-progress'
    : 'not-started'

  const baselineStatusLabel = {
    'not-started': 'Not Started',
    'in-progress': `Stage ${inProgressBaseline?.stage_reached || 0} of 3`,
    completed: 'Completed',
  }[baselineStatus]

  const baselineActionLabel = {
    'not-started': 'Start Baseline',
    'in-progress': 'Continue Assessment',
    completed: 'Retake Assessment',
  }[baselineStatus]

  const mirrorCompleted = mirrors.filter((m) => m.completed_at)
  const mirrorStatus: 'not-started' | 'completed' = mirrorCompleted.length > 0 ? 'completed' : 'not-started'

  if (loading) {
    return (
      <AppShell>
        <div className="px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="h-4 w-24 bg-black/5 rounded mb-3 animate-pulse" />
            <div className="h-10 w-64 bg-black/5 rounded mb-10 animate-pulse" />
            <div className="grid gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-40 bg-black/[0.02] rounded-xl animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-wider text-black/40 mb-2">
              Assessments
            </p>
            <h1 className="text-3xl font-bold text-black">
              Your Assessment Hub
            </h1>
            <p className="text-base text-black/50 mt-2">
              Track your progress across all assessment types.
            </p>
          </div>

          {/* Assessment Cards */}
          <div className="grid gap-6 mb-12">
            <AssessmentCard
              title="Baseline Assessment"
              description="96 questions across 15 leadership dimensions in three focused stages. Takes approximately 25 minutes total."
              status={baselineStatus}
              statusLabel={baselineStatusLabel}
              lastDate={completedBaseline?.completed_at}
              actionLabel={baselineActionLabel}
              actionHref="/assessment/baseline"
            />

            <AssessmentCard
              title="Weekly Check-in"
              description="Quick pulse on your 3 focus dimensions. Takes about 5 minutes. Builds your accountability streak."
              status={weeklies.length > 0 ? 'completed' : 'not-started'}
              statusLabel={weeklies.length > 0 ? `${weeklies.length} check-ins` : 'Not Started'}
              lastDate={weeklies[0]?.responded_at}
              actionLabel="Open Check-in"
              actionHref="/assessment/weekly"
              disabled={!isSubscribed || !completedBaseline}
            />

            <AssessmentCard
              title="Mirror Check"
              description="Invite a colleague to rate you on the same dimensions. Reveals blind spots between self-perception and how others see you."
              status={mirrorStatus}
              statusLabel={mirrorCompleted.length > 0 ? `${mirrorCompleted.length} completed` : 'No Raters'}
              lastDate={mirrorCompleted[0]?.completed_at}
              actionLabel="Invite Rater"
              actionHref="/assessment/mirror"
              disabled={!isSubscribed || !completedBaseline}
            />
          </div>

          {/* History */}
          {(baselines.length > 0 || weeklies.length > 0 || mirrors.length > 0) && (
            <div>
              <h2 className="text-lg font-semibold text-black mb-4">History</h2>
              <div className="bg-white rounded-xl border border-black/8 p-5">
                {baselines
                  .filter((b) => {
                    // Hide abandoned sessions (incomplete) if a completed session exists
                    if (b.completed_at) return true
                    if (completedBaseline) return false
                    return true
                  })
                  .map((b) => (
                  <HistoryRow
                    key={b.id}
                    label={`Baseline Assessment ${b.completed_at ? '' : '(in progress)'}`}
                    date={b.completed_at || b.created_at}
                    status={b.completed_at ? 'Completed' : `Stage ${b.stage_reached}/3`}
                    score={b.clmi}
                  />
                ))}
                {mirrors.map((m) => (
                  <HistoryRow
                    key={m.id}
                    label={`Mirror Check${m.rater_name ? ` — ${m.rater_name}` : ''}`}
                    date={m.completed_at || m.created_at}
                    status={m.completed_at ? 'Completed' : 'Pending'}
                  />
                ))}
                {weeklies.slice(0, 5).map((w) => (
                  <HistoryRow
                    key={w.id}
                    label={`Weekly Check-in (${w.quarter})`}
                    date={w.responded_at}
                    status="Completed"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
