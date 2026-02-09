'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import { getDimension, TERRITORY_CONFIG } from '@/lib/constants'
import { getVerbalLabel } from '@/lib/scoring'
import { AppShell } from '@/components/layout/AppShell'
import { ScoreRing } from '@/components/visualizations/ScoreRing'
import type { DimensionId, Territory, VerbalLabel } from '@/types/assessment'

// ─── Territory accent colors ──────────────────────────────────────

const TERRITORY_COLORS: Record<Territory, string> = {
  leading_yourself: '#7FABC8',
  leading_teams: '#A6BEA4',
  leading_organizations: '#E08F6A',
}

// ─── Types ────────────────────────────────────────────────────────

type DashboardState = 'loading' | 'error' | 'free' | 'baseline-pending' | 'baseline-in-progress' | 'complete'

type DashboardTab = 'overview' | 'assessment'

interface DimensionScoreData {
  dimensionId: DimensionId
  name: string
  score: number
  label: VerbalLabel
  territory: Territory
}

interface DashboardData {
  userName: string
  clmi: number
  clmiLabel: VerbalLabel
  territories: {
    territory: Territory
    name: string
    score: number
    label: VerbalLabel
    color: string
  }[]
  dimensionScores: DimensionScoreData[]
  priorityDimensions: {
    dimensionId: DimensionId
    name: string
    score: number
    label: VerbalLabel
  }[]
  archetypes: {
    name: string
    matchType: 'full' | 'partial'
    signatureStrength: number
    sjiConfirmed?: boolean
    displayRank: number
  }[]
  weeklyPulseCount: number
  lastPulseDate: string | null
  mirrorCount: number
  bsi: number | null
  lastAssessmentDate: string | null
  stageReached: number
}

// ─── Loading Skeleton ──────────────────────────────────────────────

function DashboardSkeleton() {
  return (
    <AppShell>
      <div className="px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <div className="h-4 w-24 bg-black/5 rounded mb-3 animate-pulse" />
            <div className="h-10 w-72 bg-black/5 rounded animate-pulse" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 border border-black/5 animate-pulse">
                <div className="h-3 w-20 bg-black/5 rounded mb-4" />
                <div className="h-12 w-24 bg-black/5 rounded mb-3" />
                <div className="h-2 w-full bg-black/5 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  )
}

// ─── Component ────────────────────────────────────────────────────

export default function DashboardPage() {
  const router = useRouter()
  const [dashboardState, setDashboardState] = useState<DashboardState>('loading')
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<DashboardData | null>(null)

  const loadDashboard = useCallback(async () => {
    try {
      setDashboardState('loading')
      setError(null)

      const supabase = createClient()

      const { data: { user }, error: authError } = await supabase.auth.getUser()

      if (authError || !user) {
        router.push('/auth')
        return
      }

      const userName = user.user_metadata?.full_name
        || user.user_metadata?.name
        || user.email?.split('@')[0]
        || 'CEO'

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('subscription_status')
        .eq('id', user.id)
        .single()

      const isSubscribed = profile?.subscription_status === 'active'

      const emptyData: DashboardData = {
        userName,
        clmi: 0,
        clmiLabel: 'Critical gap',
        territories: [],
        dimensionScores: [],
        priorityDimensions: [],
        archetypes: [],
        weeklyPulseCount: 0,
        lastPulseDate: null,
        mirrorCount: 0,
        bsi: null,
        lastAssessmentDate: null,
        stageReached: 0,
      }

      if (!isSubscribed) {
        setData(emptyData)
        setDashboardState('free')
        return
      }

      // First, look for a completed session
      const { data: completedSession } = await supabase
        .from('assessment_sessions')
        .select('id, completed_at, stage_reached, clmi, bsi')
        .eq('ceo_id', user.id)
        .eq('version', '4.0')
        .not('completed_at', 'is', null)
        .order('completed_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      // If we have a completed session, use it for the full dashboard
      const session = completedSession

      if (!session) {
        // No completed session — check for any in-progress session
        const { data: latestSession } = await supabase
          .from('assessment_sessions')
          .select('id, completed_at, stage_reached, clmi, bsi')
          .eq('ceo_id', user.id)
          .eq('version', '4.0')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle()

        if (!latestSession) {
          setData({ ...emptyData })
          setDashboardState('baseline-pending')
          return
        }

        const stageReached = latestSession.stage_reached || 0
        setData({ ...emptyData, stageReached })
        setDashboardState('baseline-in-progress')
        return
      }

      // ── Baseline complete — load full dashboard data ──

      const { data: dimScores, error: dimError } = await supabase
        .from('dimension_scores')
        .select('dimension, composite, percentage, verbal_label')
        .eq('session_id', session.id)

      if (dimError) {
        throw new Error(`Failed to load dimension scores: ${dimError.message}`)
      }

      const { data: terrScores, error: terrError } = await supabase
        .from('territory_scores')
        .select('territory, score, verbal_label')
        .eq('session_id', session.id)

      if (terrError) {
        throw new Error(`Failed to load territory scores: ${terrError.message}`)
      }

      const { data: archetypeData } = await supabase
        .from('archetype_matches')
        .select('name, match_type, signature_strength, sji_confirmed, display_rank')
        .eq('session_id', session.id)
        .order('display_rank', { ascending: true })
        .limit(3)

      const territories = (['leading_yourself', 'leading_teams', 'leading_organizations'] as Territory[]).map(t => {
        const terrScore = terrScores?.find((ts: { territory: string; score: number; verbal_label: string }) => ts.territory === t)
        const config = TERRITORY_CONFIG[t]
        return {
          territory: t,
          name: config.displayLabel,
          score: terrScore?.score ?? 0,
          label: (terrScore?.verbal_label as VerbalLabel) ?? getVerbalLabel(terrScore?.score ?? 0),
          color: TERRITORY_COLORS[t],
        }
      })

      const allDimScores = (dimScores || []).map((ds: { dimension: string; composite: number; percentage: number; verbal_label: string }) => ({
        dimensionId: ds.dimension as DimensionId,
        name: getDimension(ds.dimension as DimensionId).name,
        score: ds.percentage as number,
        label: (ds.verbal_label as VerbalLabel) ?? getVerbalLabel(ds.percentage ?? 0),
        territory: getDimension(ds.dimension as DimensionId).territory,
      }))

      const sorted = [...allDimScores].sort((a, b) => a.score - b.score)
      const priorityDimensions = sorted.slice(0, Math.min(5, Math.max(3, sorted.filter(d => d.score <= 40).length || 3)))

      const archetypes = (archetypeData || []).map((a: { name: string; match_type: string; signature_strength: number; sji_confirmed: boolean | null; display_rank: number }) => ({
        name: a.name,
        matchType: a.match_type as 'full' | 'partial',
        signatureStrength: a.signature_strength,
        sjiConfirmed: a.sji_confirmed ?? undefined,
        displayRank: a.display_rank,
      }))

      const now = new Date()
      const currentQuarter = `${now.getFullYear()}-Q${Math.ceil((now.getMonth() + 1) / 3)}`

      const { count: weeklyPulseCount } = await supabase
        .from('weekly_pulse')
        .select('id', { count: 'exact', head: true })
        .eq('ceo_id', user.id)
        .eq('quarter', currentQuarter)

      const { data: lastPulse } = await supabase
        .from('weekly_pulse')
        .select('responded_at')
        .eq('ceo_id', user.id)
        .order('responded_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      const { count: mirrorCount } = await supabase
        .from('mirror_sessions')
        .select('id', { count: 'exact', head: true })
        .eq('session_id', session.id)
        .not('completed_at', 'is', null)

      const clmi = session.clmi ?? 0
      const clmiLabel = getVerbalLabel(clmi)

      setData({
        userName,
        clmi,
        clmiLabel,
        territories,
        dimensionScores: allDimScores,
        priorityDimensions,
        archetypes,
        weeklyPulseCount: weeklyPulseCount ?? 0,
        lastPulseDate: lastPulse?.responded_at ?? null,
        mirrorCount: mirrorCount ?? 0,
        bsi: session.bsi ?? null,
        lastAssessmentDate: session.completed_at,
        stageReached: session.stage_reached || 3,
      })
      setDashboardState('complete')
    } catch (err: any) {
      console.error('Dashboard load error:', err)
      setError(err.message || 'Failed to load dashboard')
      setDashboardState('error')
    }
  }, [router])

  useEffect(() => {
    loadDashboard()
  }, [loadDashboard])

  if (dashboardState === 'loading') {
    return <DashboardSkeleton />
  }

  if (dashboardState === 'error') {
    return (
      <AppShell>
        <div className="flex items-center justify-center px-6 min-h-[80vh]">
          <div className="max-w-md w-full">
            <div className="bg-white rounded-2xl p-8 border border-black/5">
              <h2 className="text-xl font-semibold text-black mb-3">Something went wrong</h2>
              <p className="text-black/60 text-sm mb-6">{error}</p>
              <button
                onClick={loadDashboard}
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

  if (dashboardState === 'free') {
    return <FreeUserView userName={data?.userName || 'CEO'} />
  }

  if (dashboardState === 'baseline-pending') {
    return <BaselinePendingView userName={data?.userName || 'CEO'} />
  }

  if (dashboardState === 'baseline-in-progress') {
    return <BaselineInProgressView userName={data?.userName || 'CEO'} stageReached={data?.stageReached || 0} />
  }

  if (!data) return null

  return <FullDashboardView data={data} />
}

// ═══════════════════════════════════════════════════════════════════
// STATE 1: Free User — Conversion page with grayed ScoreRings
// ═══════════════════════════════════════════════════════════════════

function FreeUserView({ userName }: { userName: string }) {
  return (
    <AppShell>
      <div className="px-6 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Grayed-out score visualization */}
          <div className="text-center mb-12">
            <p className="text-sm font-semibold tracking-widest uppercase text-black/40 mb-6">CEO Lab</p>

            <div className="flex justify-center mb-6">
              <ScoreRing
                value={0}
                size={160}
                strokeWidth={10}
                color="rgba(0,0,0,0.08)"
                trackColor="rgba(0,0,0,0.03)"
                showValue={false}
              />
            </div>

            {/* Question mark overlay */}
            <p className="text-6xl font-bold text-black/10 -mt-[108px] mb-[52px]">?</p>

            {/* 3 grayed territory rings */}
            <div className="flex justify-center gap-8 mb-10">
              {[
                { label: 'Leading Yourself', color: '#7FABC8' },
                { label: 'Leading Teams', color: '#A6BEA4' },
                { label: 'Leading Organizations', color: '#E08F6A' },
              ].map((t) => (
                <div key={t.label} className="flex flex-col items-center">
                  <ScoreRing
                    value={0}
                    size={64}
                    strokeWidth={5}
                    color={`${t.color}20`}
                    trackColor="rgba(0,0,0,0.03)"
                    showValue={false}
                  />
                  <span className="text-[10px] text-black/30 mt-1.5 max-w-[80px] text-center leading-tight">{t.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Headline */}
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-black tracking-tight mb-3">
              Unlock your leadership profile
            </h1>
            <p className="text-base text-black/50 max-w-lg mx-auto">
              The Konstantin Method measures 15 dimensions of leadership maturity. See where you lead from, spot your blind spots, and know exactly what to work on.
            </p>
          </div>

          {/* Benefit cards — outcomes not features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            {[
              {
                title: 'See where you lead from',
                desc: 'Your CLMI score across three territories reveals your leadership center of gravity.',
              },
              {
                title: 'Spot blind spots',
                desc: 'Mirror feedback from colleagues shows you what you can\'t see yourself.',
              },
              {
                title: 'Know what to work on',
                desc: 'Priority dimensions and framework prescriptions tell you exactly where to focus.',
              },
            ].map((card) => (
              <div key={card.title} className="bg-white rounded-2xl p-6 border border-black/5">
                <h3 className="text-sm font-semibold text-black mb-1.5">{card.title}</h3>
                <p className="text-sm text-black/50 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>

          {/* Subscribe CTA */}
          <div className="bg-white rounded-2xl p-10 border border-black/5 text-center">
            <a
              href="/api/checkout"
              className="inline-block bg-black text-white px-10 py-4 rounded-lg text-base font-semibold hover:bg-black/90 transition-colors mb-3"
            >
              Subscribe — &euro;100/month
            </a>
            <p className="text-xs text-black/30">
              Full assessment, weekly accountability, mirror feedback, and a personalized roadmap.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  )
}

// ═══════════════════════════════════════════════════════════════════
// STATE 2a: Subscribed, Baseline Not Started
// ═══════════════════════════════════════════════════════════════════

function BaselinePendingView({ userName }: { userName: string }) {
  return (
    <AppShell>
      <div className="px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <p className="text-sm font-semibold tracking-widest uppercase text-black/40 mb-2">Dashboard</p>
            <h1 className="text-3xl md:text-4xl font-bold text-black tracking-tight">
              Welcome, {userName}
            </h1>
          </div>

          <div className="bg-white rounded-2xl p-10 md:p-14 border border-black/5 max-w-2xl mx-auto text-center">
            {/* Territory dots */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#7FABC8' }} />
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#A6BEA4' }} />
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#E08F6A' }} />
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-black mb-3">
              Start Your Baseline Assessment
            </h2>
            <p className="text-base text-black/60 leading-relaxed mb-2 max-w-md mx-auto">
              96 questions across 3 stages. Takes about 25 minutes total.
            </p>
            <p className="text-sm text-black/40 mb-10 max-w-md mx-auto">
              You can complete it in one sitting or take breaks between stages.
            </p>

            {/* Stage indicators with ScoreRings */}
            <div className="flex items-center justify-center gap-8 mb-10">
              {[
                { label: 'Stage 1', items: '32 items', time: '~8 min' },
                { label: 'Stage 2', items: '34 items', time: '~9 min' },
                { label: 'Stage 3', items: '30 items', time: '~8 min' },
              ].map((stage, i) => (
                <div key={i} className="text-center">
                  <ScoreRing
                    value={0}
                    size={48}
                    strokeWidth={3}
                    color="rgba(0,0,0,0.08)"
                    trackColor="rgba(0,0,0,0.03)"
                    showValue={false}
                  />
                  <p className="text-[10px] text-black/30 mt-0.5">{i + 1}</p>
                  <p className="text-xs font-medium text-black/40 mt-1">{stage.label}</p>
                  <p className="text-[10px] text-black/25">{stage.time}</p>
                </div>
              ))}
            </div>

            <a
              href="/assessment/baseline"
              className="inline-block bg-black text-white px-10 py-4 rounded-lg text-base font-semibold hover:bg-black/90 transition-colors"
            >
              Begin Assessment
            </a>
          </div>
        </div>
      </div>
    </AppShell>
  )
}

// ═══════════════════════════════════════════════════════════════════
// STATE 2b: Subscribed, Baseline In Progress
// ═══════════════════════════════════════════════════════════════════

function BaselineInProgressView({ userName, stageReached }: { userName: string; stageReached: number }) {
  return (
    <AppShell>
      <div className="px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <p className="text-sm font-semibold tracking-widest uppercase text-black/40 mb-2">Dashboard</p>
            <h1 className="text-3xl md:text-4xl font-bold text-black tracking-tight">
              Welcome back, {userName}
            </h1>
          </div>

          <div className="bg-white rounded-2xl p-10 md:p-14 border border-black/5 max-w-2xl mx-auto text-center">
            <p className="text-sm font-medium text-black/40 uppercase tracking-wider mb-6">Assessment in progress</p>

            <h2 className="text-2xl md:text-3xl font-bold text-black mb-3">
              Stage {stageReached} of 3 complete
            </h2>
            <p className="text-base text-black/50 mb-10">
              Pick up where you left off.
            </p>

            {/* Stage progress with ScoreRings */}
            <div className="flex items-center justify-center gap-4 mb-10">
              {[1, 2, 3].map((stage) => {
                const isComplete = stage <= stageReached
                const isCurrent = stage === stageReached + 1
                const pct = isComplete ? 100 : 0

                return (
                  <div key={stage} className="flex items-center gap-4">
                    <div className="text-center">
                      <ScoreRing
                        value={pct}
                        size={56}
                        strokeWidth={4}
                        color={isComplete ? '#000' : 'rgba(0,0,0,0.08)'}
                        trackColor="rgba(0,0,0,0.03)"
                        showValue={false}
                      />
                      {/* Check or number inside */}
                      <div className="-mt-[42px] mb-[18px]">
                        {isComplete ? (
                          <svg className="w-5 h-5 mx-auto text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        ) : (
                          <span className={`text-sm font-semibold ${isCurrent ? 'text-black' : 'text-black/25'}`}>{stage}</span>
                        )}
                      </div>
                      <p className={`text-xs font-medium ${isComplete ? 'text-black' : isCurrent ? 'text-black/70' : 'text-black/25'}`}>
                        Stage {stage}
                      </p>
                    </div>

                    {stage < 3 && (
                      <div className={`w-12 h-0.5 mb-5 ${stage <= stageReached ? 'bg-black' : 'bg-black/10'}`} />
                    )}
                  </div>
                )
              })}
            </div>

            <a
              href="/assessment/baseline"
              className="inline-block bg-black text-white px-10 py-4 rounded-lg text-base font-semibold hover:bg-black/90 transition-colors"
            >
              Continue Assessment
            </a>
          </div>
        </div>
      </div>
    </AppShell>
  )
}

// ═══════════════════════════════════════════════════════════════════
// STATE 3: Full Dashboard — 3 Tabs
// ═══════════════════════════════════════════════════════════════════

function FullDashboardView({ data }: { data: DashboardData }) {
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview')

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <AppShell>
      <div className="px-6 py-12">
        <div className="max-w-6xl mx-auto">

          {/* ── Header ── */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8">
            <div>
              <p className="text-sm font-semibold tracking-widest uppercase text-black/40 mb-2">Dashboard</p>
              <h1 className="text-3xl md:text-4xl font-bold text-black tracking-tight">
                Welcome back, {data.userName}
              </h1>
            </div>
            <p className="text-sm text-black/40 mt-2 sm:mt-0">{today}</p>
          </div>

          {/* ── Tab bar (pill-style) ── */}
          <div className="flex gap-1 bg-black/[0.03] rounded-xl p-1 mb-8 w-fit">
            {([
              { key: 'overview', label: 'Overview' },
              { key: 'assessment', label: 'Assessment' },
            ] as { key: DashboardTab; label: string }[]).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.key
                    ? 'bg-white text-black shadow-[0_1px_3px_rgba(0,0,0,0.06)]'
                    : 'text-black/40 hover:text-black/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ── Tab content ── */}
          {activeTab === 'overview' && <OverviewTab data={data} />}
          {activeTab === 'assessment' && <AssessmentTab data={data} />}
        </div>
      </div>
    </AppShell>
  )
}

// ─── Overview Tab ─────────────────────────────────────────────────

function OverviewTab({ data }: { data: DashboardData }) {
  const daysSinceAssessment = data.lastAssessmentDate
    ? Math.floor((Date.now() - new Date(data.lastAssessmentDate).getTime()) / (1000 * 60 * 60 * 24))
    : 0

  const hasWeeklyPulse = data.weeklyPulseCount > 0
  const hasMirrorData = data.mirrorCount > 0

  function getClmiInterpretation(score: number): string {
    if (score <= 20) return 'Foundational stage — significant growth opportunities ahead'
    if (score <= 40) return 'Early foundations are forming across your leadership territories'
    if (score <= 60) return 'Solid mid-range capability with clear areas to develop further'
    if (score <= 80) return 'Strong leadership maturity across your three territories'
    return 'Exceptional leadership maturity — focus on sustaining and mentoring'
  }

  // Determine nudges for "What's Next"
  const nudges: { text: string; cta: string; href: string }[] = []

  // Check if current week's pulse is done
  const lastPulseDate = data.lastPulseDate ? new Date(data.lastPulseDate) : null
  const now = new Date()
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - now.getDay() + 1) // Monday
  startOfWeek.setHours(0, 0, 0, 0)
  const pulseThisWeek = lastPulseDate && lastPulseDate >= startOfWeek

  if (!hasWeeklyPulse) {
    nudges.push({
      text: 'Set up your Accountability Agent — pick 3 focus dimensions for weekly tracking.',
      cta: 'Set Up',
      href: '/assessment/weekly',
    })
  } else if (!pulseThisWeek) {
    nudges.push({
      text: 'Complete your weekly check-in to keep your streak going.',
      cta: 'Check In',
      href: '/assessment/weekly',
    })
  }

  if (!hasMirrorData) {
    nudges.push({
      text: 'Invite a colleague for a Mirror Check — see your blind spots through their eyes.',
      cta: 'Invite',
      href: '/assessment/mirror',
    })
  }

  if (nudges.length === 0 && data.priorityDimensions.length > 0) {
    const lowest = data.priorityDimensions[0]
    nudges.push({
      text: `Focus area: ${lowest.name} (${Math.round(lowest.score)}%). Check your full results for framework prescriptions.`,
      cta: 'View Results',
      href: '/results',
    })
  }

  return (
    <div>
      {/* CLMI ScoreRing (left) + Territory cards stacked (right) */}
      <div className="bg-white rounded-2xl p-8 md:p-10 border border-black/5 mb-6">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
          {/* Left: CLMI */}
          <div className="flex flex-col items-center text-center flex-shrink-0">
            <p className="text-sm text-black/50 mb-4">CEO Leadership Maturity Index</p>
            <ScoreRing
              value={data.clmi}
              size={200}
              strokeWidth={14}
              color="#000"
              label={data.clmiLabel}
            />
            <p className="text-sm text-black/50 mt-4 max-w-[240px]">
              {getClmiInterpretation(data.clmi)}
            </p>
            {data.lastAssessmentDate && (
              <p className="text-xs text-black/30 mt-2">
                Assessed {new Date(data.lastAssessmentDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            )}
          </div>

          {/* Right: 3 territories stacked */}
          <div className="flex-1 w-full space-y-3">
            {data.territories.map((t) => (
              <div
                key={t.territory}
                className="flex items-center gap-4 p-4 rounded-xl bg-[#F7F3ED]/50"
              >
                <ScoreRing
                  value={t.score}
                  size={56}
                  strokeWidth={4}
                  color={t.color}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-black">{t.name}</p>
                  <p className="text-xs text-black/40">{t.label}</p>
                </div>
                <span className="text-lg font-bold text-black">{Math.round(t.score)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Accountability Agent */}
      <div className="bg-white rounded-2xl p-8 border border-black/5 mb-6">
        <h2 className="text-lg font-semibold text-black mb-1">Accountability Agent</h2>
        <p className="text-sm text-black/40 mb-6">Weekly leadership habit tracking</p>

        {hasWeeklyPulse ? (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-3xl font-bold text-black">{data.weeklyPulseCount}</p>
                <p className="text-xs text-black/40">check-ins this quarter</p>
              </div>
              {data.lastPulseDate && (
                <div className="text-right">
                  <p className="text-xs text-black/40">Last check-in</p>
                  <p className="text-sm font-medium text-black">
                    {new Date(data.lastPulseDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
              )}
            </div>

            {/* Streak squares */}
            <div className="flex gap-1.5 mb-5">
              {Array.from({ length: 12 }, (_, i) => (
                <div
                  key={i}
                  className={`w-6 h-6 rounded-sm ${
                    i < data.weeklyPulseCount ? 'bg-black' : 'bg-black/5'
                  }`}
                />
              ))}
            </div>
            <p className="text-[10px] text-black/30 mb-4">12-week quarter view</p>

            <a
              href="/assessment/weekly"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center px-6 py-3 bg-black text-white rounded-lg text-sm font-medium hover:bg-black/90 transition-colors"
            >
              Open Check-in
            </a>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-black/50 mb-4 leading-relaxed">
              Three questions every Monday on your priority dimensions. Track growth week over week.
            </p>
            <a
              href="/assessment/weekly"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center px-6 py-3 bg-black text-white rounded-lg text-sm font-medium hover:bg-black/90 transition-colors"
            >
              Set Up Accountability Agent
            </a>
          </div>
        )}
      </div>

      {/* Mirror Check */}
      <div className="bg-white rounded-2xl p-8 border border-black/5">
        <h2 className="text-lg font-semibold text-black mb-1">Mirror Check</h2>
        <p className="text-sm text-black/40 mb-6">See how others experience your leadership</p>

        {hasMirrorData ? (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-black/40 mb-1">Blind Spot Index</p>
                <p className="text-3xl font-bold text-black">{data.bsi != null ? Math.round(data.bsi) : '--'}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-black/40 mb-1">Raters completed</p>
                <p className="text-sm font-medium text-black">{data.mirrorCount}</p>
              </div>
            </div>
            <a
              href="/assessment/mirror"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center px-6 py-3 border border-black/10 text-black rounded-lg text-sm font-medium hover:border-black/20 hover:bg-black/[0.02] transition-all"
            >
              Invite Another Rater
            </a>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-black/50 mb-4 leading-relaxed">
              Invite a colleague to answer 15 items about your leadership. No account needed on their end.
            </p>
            <a
              href="/assessment/mirror"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center px-6 py-3 bg-black text-white rounded-lg text-sm font-medium hover:bg-black/90 transition-colors"
            >
              Invite a Colleague
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Assessment Tab ──────────────────────────────────────────────

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

function AssessmentTab({ data }: { data: DashboardData }) {
  const [history, setHistory] = useState<{
    baselines: HistoryBaseline[]
    mirrors: HistoryMirror[]
    weeklies: HistoryWeekly[]
  } | null>(null)

  useEffect(() => {
    async function loadHistory() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

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
    }
    loadHistory()
  }, [])

  const hasHistory = history && (history.baselines.length > 0 || history.mirrors.length > 0 || history.weeklies.length > 0)

  return (
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
            href="/results"
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
  )
}
