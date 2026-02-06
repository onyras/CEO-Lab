'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import { DIMENSIONS, getDimension, TERRITORY_CONFIG } from '@/lib/constants'
import { getVerbalLabel } from '@/lib/scoring'
import type { DimensionId, Territory, VerbalLabel } from '@/types/assessment'

// ─── Territory accent colors ──────────────────────────────────────

const TERRITORY_COLORS: Record<Territory, string> = {
  leading_yourself: '#7FABC8',
  leading_teams: '#A6BEA4',
  leading_organizations: '#E08F6A',
}

// ─── Types ────────────────────────────────────────────────────────

type DashboardState = 'loading' | 'error' | 'free' | 'baseline-pending' | 'baseline-in-progress' | 'complete'

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

// ─── Lock Icon ────────────────────────────────────────────────────

function LockIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
  )
}

// ─── Loading Skeleton ──────────────────────────────────────────────

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-[#F7F3ED] px-6 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header skeleton */}
        <div className="mb-10">
          <div className="h-4 w-24 bg-black/5 rounded mb-3 animate-pulse" />
          <div className="h-10 w-72 bg-black/5 rounded animate-pulse" />
        </div>

        {/* Top row skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-8 border border-black/5 animate-pulse">
              <div className="h-3 w-20 bg-black/5 rounded mb-4" />
              <div className="h-12 w-24 bg-black/5 rounded mb-3" />
              <div className="h-2 w-full bg-black/5 rounded" />
            </div>
          ))}
        </div>

        {/* Middle row skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 bg-white rounded-2xl p-8 border border-black/5 animate-pulse">
            <div className="h-5 w-48 bg-black/5 rounded mb-6" />
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 mb-4">
                <div className="h-2 w-2 bg-black/5 rounded-full" />
                <div className="flex-1 h-2 bg-black/5 rounded" />
              </div>
            ))}
          </div>
          <div className="bg-white rounded-2xl p-8 border border-black/5 animate-pulse">
            <div className="h-5 w-36 bg-black/5 rounded mb-6" />
            <div className="h-16 w-16 bg-black/5 rounded-full mx-auto mb-4" />
            <div className="h-3 w-32 bg-black/5 rounded mx-auto" />
          </div>
        </div>
      </div>
    </div>
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

      // ── Check auth ──
      const { data: { user }, error: authError } = await supabase.auth.getUser()

      if (authError || !user) {
        router.push('/auth')
        return
      }

      // ── Get user name from metadata ──
      const userName = user.user_metadata?.full_name
        || user.user_metadata?.name
        || user.email?.split('@')[0]
        || 'CEO'

      // ── Check subscription status ──
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('subscription_status')
        .eq('id', user.id)
        .single()

      const isSubscribed = profile?.subscription_status === 'active'

      if (!isSubscribed) {
        setData({
          userName,
          clmi: 0,
          clmiLabel: 'Critical gap',
          territories: [],
          priorityDimensions: [],
          archetypes: [],
          weeklyPulseCount: 0,
          lastPulseDate: null,
          mirrorCount: 0,
          bsi: null,
          lastAssessmentDate: null,
          stageReached: 0,
        })
        setDashboardState('free')
        return
      }

      // ── Check baseline assessment status ──
      const { data: session } = await supabase
        .from('assessment_sessions')
        .select('id, completed_at, stage_reached, clmi, bsi')
        .eq('ceo_id', user.id)
        .eq('version', '4.0')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      const hasBaseline = !!session
      const baselineComplete = !!session?.completed_at
      const stageReached = session?.stage_reached || 0

      if (!hasBaseline) {
        setData({
          userName,
          clmi: 0,
          clmiLabel: 'Critical gap',
          territories: [],
          priorityDimensions: [],
          archetypes: [],
          weeklyPulseCount: 0,
          lastPulseDate: null,
          mirrorCount: 0,
          bsi: null,
          lastAssessmentDate: null,
          stageReached: 0,
        })
        setDashboardState('baseline-pending')
        return
      }

      if (!baselineComplete) {
        setData({
          userName,
          clmi: 0,
          clmiLabel: 'Critical gap',
          territories: [],
          priorityDimensions: [],
          archetypes: [],
          weeklyPulseCount: 0,
          lastPulseDate: null,
          mirrorCount: 0,
          bsi: null,
          lastAssessmentDate: null,
          stageReached,
        })
        setDashboardState('baseline-in-progress')
        return
      }

      // ── Baseline complete — load full dashboard data ──

      // Load dimension scores
      const { data: dimScores, error: dimError } = await supabase
        .from('dimension_scores')
        .select('dimension, composite, percentage, verbal_label')
        .eq('session_id', session.id)

      if (dimError) {
        throw new Error(`Failed to load dimension scores: ${dimError.message}`)
      }

      // Load territory scores
      const { data: terrScores, error: terrError } = await supabase
        .from('territory_scores')
        .select('territory, score, verbal_label')
        .eq('session_id', session.id)

      if (terrError) {
        throw new Error(`Failed to load territory scores: ${terrError.message}`)
      }

      // Load archetype matches
      const { data: archetypeData } = await supabase
        .from('archetype_matches')
        .select('name, match_type, signature_strength, sji_confirmed, display_rank')
        .eq('session_id', session.id)
        .order('display_rank', { ascending: true })
        .limit(3)

      // Build territory data
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

      // Build dimension scores and find priority dimensions (lowest 3-5)
      const dimScoreEntries = (dimScores || []).map((ds: { dimension: string; composite: number; percentage: number; verbal_label: string }) => ({
        dimensionId: ds.dimension as DimensionId,
        name: getDimension(ds.dimension as DimensionId).name,
        score: ds.percentage as number,
        label: (ds.verbal_label as VerbalLabel) ?? getVerbalLabel(ds.percentage ?? 0),
      }))

      const sorted = [...dimScoreEntries].sort((a, b) => a.score - b.score)
      const priorityDimensions = sorted.slice(0, Math.min(5, Math.max(3, sorted.filter(d => d.score <= 40).length || 3)))

      // Build archetype data
      const archetypes = (archetypeData || []).map((a: { name: string; match_type: string; signature_strength: number; sji_confirmed: boolean | null; display_rank: number }) => ({
        name: a.name,
        matchType: a.match_type as 'full' | 'partial',
        signatureStrength: a.signature_strength,
        sjiConfirmed: a.sji_confirmed ?? undefined,
        displayRank: a.display_rank,
      }))

      // Weekly pulse data
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

      // Mirror data
      const { count: mirrorCount } = await supabase
        .from('mirror_sessions')
        .select('id', { count: 'exact', head: true })
        .eq('session_id', session.id)
        .not('completed_at', 'is', null)

      // CLMI
      const clmi = session.clmi ?? 0
      const clmiLabel = getVerbalLabel(clmi)

      setData({
        userName,
        clmi,
        clmiLabel,
        territories,
        priorityDimensions,
        archetypes,
        weeklyPulseCount: weeklyPulseCount ?? 0,
        lastPulseDate: lastPulse?.responded_at ?? null,
        mirrorCount: mirrorCount ?? 0,
        bsi: session.bsi ?? null,
        lastAssessmentDate: session.completed_at,
        stageReached,
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

  // ─── Loading State ──────────────────────────────────────────────

  if (dashboardState === 'loading') {
    return <DashboardSkeleton />
  }

  // ─── Error State ────────────────────────────────────────────────

  if (dashboardState === 'error') {
    return (
      <div className="min-h-screen bg-[#F7F3ED] flex items-center justify-center px-6">
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
    )
  }

  // ─── STATE 1: Free User (Not Subscribed) ────────────────────────

  if (dashboardState === 'free') {
    return <FreeUserView userName={data?.userName || 'CEO'} />
  }

  // ─── STATE 2: Subscribed, Baseline Pending ──────────────────────

  if (dashboardState === 'baseline-pending') {
    return <BaselinePendingView userName={data?.userName || 'CEO'} />
  }

  // ─── STATE 2b: Subscribed, Baseline In Progress ─────────────────

  if (dashboardState === 'baseline-in-progress') {
    return <BaselineInProgressView userName={data?.userName || 'CEO'} stageReached={data?.stageReached || 0} />
  }

  // ─── STATE 3: Full Dashboard ────────────────────────────────────

  if (!data) return null

  return <FullDashboardView data={data} />
}

// ═══════════════════════════════════════════════════════════════════
// STATE 1: Free User — Conversion-focused page
// ═══════════════════════════════════════════════════════════════════

function FreeUserView({ userName }: { userName: string }) {
  const features = [
    {
      title: '96-item assessment',
      description: 'Across 15 leadership dimensions built on the Konstantin Method. Three stages, each deepening the picture.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
        </svg>
      ),
    },
    {
      title: 'Leadership Maturity Index',
      description: 'Your CLMI score — a single number that captures where you stand across Leading Yourself, Teams, and Organizations.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
      ),
    },
    {
      title: 'Archetype detection',
      description: 'Discover which leadership patterns define you — Brilliant Bottleneck, Empathetic Avoider, Visionary Without Vehicle, and 9 more.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
        </svg>
      ),
    },
    {
      title: 'Weekly Accountability Agent',
      description: 'Every Monday, three focused questions on your priority dimensions. Track your growth week over week.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
      ),
    },
    {
      title: 'Mirror Check',
      description: 'See your blind spots through a colleague\'s eyes. Invite a rater for a 15-item external perspective.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
        </svg>
      ),
    },
  ]

  return (
    <div className="min-h-screen bg-[#F7F3ED] px-6 py-12">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-4">
          <p className="text-sm font-semibold tracking-widest uppercase text-black/40 mb-2">CEO Lab</p>
        </div>

        {/* Hero */}
        <div className="mb-16">
          <h1 className="text-3xl md:text-4xl lg:text-[44px] font-bold text-black tracking-tight leading-tight mb-4">
            Discover your complete<br />leadership profile
          </h1>
          <p className="text-base md:text-lg text-black/60 leading-relaxed max-w-2xl">
            The Konstantin Method measures 15 dimensions of leadership maturity across three territories.
            See where you lead from, where you get stuck, and exactly what to work on next.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
          {features.map((feature, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-7 border border-black/5 relative overflow-hidden"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#F7F3ED] flex items-center justify-center flex-shrink-0 text-black/40">
                  {feature.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <h3 className="text-base font-semibold text-black">{feature.title}</h3>
                    <LockIcon className="w-3.5 h-3.5 text-black/20 flex-shrink-0" />
                  </div>
                  <p className="text-sm text-black/50 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-white rounded-2xl p-10 border border-black/5 text-center">
          <h2 className="text-2xl font-bold text-black mb-2">
            Start measuring what matters
          </h2>
          <p className="text-black/50 text-base mb-8 max-w-lg mx-auto">
            Full assessment, weekly accountability, mirror feedback, and a personalized leadership roadmap.
          </p>

          <a
            href="/api/checkout"
            className="inline-block bg-black text-white px-10 py-4 rounded-lg text-base font-semibold hover:bg-black/90 transition-colors mb-4"
          >
            Subscribe — &euro;100/month
          </a>

          <p className="text-xs text-black/30">
            Have a code? You can apply it at checkout.
          </p>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// STATE 2a: Subscribed, Baseline Not Started
// ═══════════════════════════════════════════════════════════════════

function BaselinePendingView({ userName }: { userName: string }) {
  return (
    <div className="min-h-screen bg-[#F7F3ED] px-6 py-12">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <p className="text-sm font-semibold tracking-widest uppercase text-black/40 mb-2">Dashboard</p>
          <h1 className="text-3xl md:text-4xl font-bold text-black tracking-tight">
            Welcome, {userName}
          </h1>
        </div>

        {/* Start Assessment Card */}
        <div className="bg-white rounded-2xl p-10 md:p-14 border border-black/5 max-w-2xl mx-auto text-center">
          {/* Decorative territory dots */}
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

          {/* Stage Indicators */}
          <div className="flex items-center justify-center gap-6 mb-10">
            {[
              { label: 'Stage 1', items: '32 items' },
              { label: 'Stage 2', items: '34 items' },
              { label: 'Stage 3', items: '30 items' },
            ].map((stage, i) => (
              <div key={i} className="text-center">
                <div className="w-10 h-10 rounded-full border-2 border-black/10 flex items-center justify-center mx-auto mb-2">
                  <span className="text-sm font-semibold text-black/30">{i + 1}</span>
                </div>
                <p className="text-xs font-medium text-black/40">{stage.label}</p>
                <p className="text-xs text-black/25">{stage.items}</p>
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
  )
}

// ═══════════════════════════════════════════════════════════════════
// STATE 2b: Subscribed, Baseline In Progress
// ═══════════════════════════════════════════════════════════════════

function BaselineInProgressView({ userName, stageReached }: { userName: string; stageReached: number }) {
  return (
    <div className="min-h-screen bg-[#F7F3ED] px-6 py-12">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <p className="text-sm font-semibold tracking-widest uppercase text-black/40 mb-2">Dashboard</p>
          <h1 className="text-3xl md:text-4xl font-bold text-black tracking-tight">
            Welcome back, {userName}
          </h1>
        </div>

        {/* Progress Card */}
        <div className="bg-white rounded-2xl p-10 md:p-14 border border-black/5 max-w-2xl mx-auto text-center">
          <p className="text-sm font-medium text-black/40 uppercase tracking-wider mb-6">Assessment in progress</p>

          <h2 className="text-2xl md:text-3xl font-bold text-black mb-3">
            Stage {stageReached} of 3 complete
          </h2>
          <p className="text-base text-black/50 mb-10">
            Pick up where you left off.
          </p>

          {/* Stage Progress Steps */}
          <div className="flex items-center justify-center gap-4 mb-10">
            {[1, 2, 3].map((stage) => {
              const isComplete = stage <= stageReached
              const isCurrent = stage === stageReached + 1

              return (
                <div key={stage} className="flex items-center gap-4">
                  <div className="text-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 transition-colors ${
                        isComplete
                          ? 'bg-black text-white'
                          : isCurrent
                            ? 'border-2 border-black text-black'
                            : 'border-2 border-black/10 text-black/25'
                      }`}
                    >
                      {isComplete ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      ) : (
                        <span className="text-sm font-semibold">{stage}</span>
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
  )
}

// ═══════════════════════════════════════════════════════════════════
// STATE 3: Full Dashboard — Baseline Complete
// ═══════════════════════════════════════════════════════════════════

function FullDashboardView({ data }: { data: DashboardData }) {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const daysSinceAssessment = data.lastAssessmentDate
    ? Math.floor((Date.now() - new Date(data.lastAssessmentDate).getTime()) / (1000 * 60 * 60 * 24))
    : 0
  const showRetake = daysSinceAssessment > 90

  const hasWeeklyPulse = data.weeklyPulseCount > 0
  const hasMirrorData = data.mirrorCount > 0

  // CLMI interpretation
  function getClmiInterpretation(score: number): string {
    if (score <= 20) return 'Foundational stage — significant growth opportunities ahead'
    if (score <= 40) return 'Early foundations are forming across your leadership territories'
    if (score <= 60) return 'Solid mid-range capability with clear areas to develop further'
    if (score <= 80) return 'Strong leadership maturity across your three territories'
    return 'Exceptional leadership maturity — focus on sustaining and mentoring'
  }

  return (
    <div className="min-h-screen bg-[#F7F3ED] px-6 py-12">
      <div className="max-w-6xl mx-auto">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10">
          <div>
            <p className="text-sm font-semibold tracking-widest uppercase text-black/40 mb-2">Dashboard</p>
            <h1 className="text-3xl md:text-4xl font-bold text-black tracking-tight">
              Welcome back, {data.userName}
            </h1>
          </div>
          <p className="text-sm text-black/40 mt-2 sm:mt-0">{today}</p>
        </div>

        {/* ── CLMI Hero Card ── */}
        <div className="bg-white rounded-2xl p-8 md:p-10 border border-black/5 mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
            <div className="flex flex-col items-center md:items-start">
              <p className="text-sm text-black/50 mb-2">CEO Leadership Maturity Index</p>
              <p className="text-7xl md:text-8xl font-bold text-black leading-none mb-2">
                {Math.round(data.clmi)}
              </p>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-black/5 text-black/70">
                {data.clmiLabel}
              </span>
            </div>
            <div className="flex-1 md:border-l md:border-black/5 md:pl-10">
              <p className="text-base text-black/60 leading-relaxed">
                {getClmiInterpretation(data.clmi)}
              </p>
              {data.lastAssessmentDate && (
                <p className="text-xs text-black/30 mt-3">
                  Assessed {new Date(data.lastAssessmentDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ── Territory Score Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {data.territories.map((t) => (
            <div
              key={t.territory}
              className="bg-white rounded-2xl p-6 border border-black/5"
            >
              <div className="flex items-center gap-2 mb-4">
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: t.color }}
                />
                <p className="text-sm font-semibold text-black">{t.name}</p>
              </div>

              <p className="text-4xl font-bold text-black mb-1">{Math.round(t.score)}%</p>
              <p className="text-xs text-black/50 mb-4">{t.label}</p>

              <div className="w-full bg-black/5 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${Math.max(2, t.score)}%`,
                    backgroundColor: t.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* ── Priority Dimensions + Archetypes Row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Priority Dimensions */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-8 border border-black/5">
            <h2 className="text-lg font-semibold text-black mb-1">Priority Dimensions</h2>
            <p className="text-sm text-black/40 mb-6">Your areas with the most growth potential</p>

            <div className="space-y-4">
              {data.priorityDimensions.map((dim, i) => {
                const dimension = getDimension(dim.dimensionId)
                const territoryColor = TERRITORY_COLORS[dimension.territory]

                return (
                  <div key={dim.dimensionId} className="flex items-center gap-4">
                    <span className="text-sm font-medium text-black/30 w-5 text-right flex-shrink-0">
                      {i + 1}
                    </span>
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: territoryColor }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-medium text-black truncate">{dim.name}</p>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-sm font-bold text-black">{Math.round(dim.score)}%</span>
                          <span className="text-xs text-black/40">{dim.label}</span>
                        </div>
                      </div>
                      <div className="w-full bg-black/5 rounded-full h-1.5 mt-2">
                        <div
                          className="h-1.5 rounded-full transition-all duration-500 ease-out"
                          style={{
                            width: `${Math.max(2, dim.score)}%`,
                            backgroundColor: territoryColor,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Archetypes */}
          <div className="bg-white rounded-2xl p-8 border border-black/5">
            <h2 className="text-lg font-semibold text-black mb-1">Leadership Archetypes</h2>
            <p className="text-sm text-black/40 mb-6">Patterns that define your leadership</p>

            {data.archetypes.length > 0 ? (
              <div className="space-y-4">
                {data.archetypes.map((arch) => (
                  <div key={arch.name} className="border border-black/5 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#F7F3ED] text-[10px] font-semibold text-black">
                          #{arch.displayRank}
                        </span>
                        <h3 className="text-sm font-semibold text-black leading-tight">{arch.name}</h3>
                      </div>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                        arch.matchType === 'full'
                          ? 'bg-black text-white'
                          : 'bg-white text-black/60 border border-black/20'
                      }`}>
                        {arch.matchType === 'full' ? 'Full' : 'Partial'}
                      </span>
                    </div>
                    <div className="h-1 w-full rounded-full bg-[#F7F3ED] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-black transition-all duration-500 ease-out"
                        style={{ width: `${Math.max(2, Math.min(100, arch.signatureStrength))}%` }}
                      />
                    </div>
                    {arch.sjiConfirmed && (
                      <p className="text-[10px] text-black/40 mt-2">Confirmed by situational responses</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center py-8">
                <p className="text-sm text-black/30 text-center">No archetypes detected</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Accountability Agent + Mirror Check Row ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Accountability Agent Card */}
          <div className="bg-white rounded-2xl p-8 border border-black/5">
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
                <a
                  href="/assessment/weekly"
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
                  className="w-full inline-flex items-center justify-center px-6 py-3 bg-black text-white rounded-lg text-sm font-medium hover:bg-black/90 transition-colors"
                >
                  Set Up Accountability Agent
                </a>
              </div>
            )}
          </div>

          {/* Mirror Check Card */}
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
                  className="w-full inline-flex items-center justify-center px-6 py-3 bg-black text-white rounded-lg text-sm font-medium hover:bg-black/90 transition-colors"
                >
                  Invite a Colleague
                </a>
              </div>
            )}
          </div>
        </div>

        {/* ── Quick Actions ── */}
        <div className="bg-white rounded-2xl p-8 border border-black/5">
          <h2 className="text-lg font-semibold text-black mb-6">Quick Actions</h2>

          <div className={`grid grid-cols-1 sm:grid-cols-2 ${showRetake ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-4`}>
            <a
              href="/results"
              className="flex items-center gap-4 p-5 rounded-xl border border-black/10 hover:border-black/20 hover:bg-black/[0.02] transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-black/5 flex items-center justify-center flex-shrink-0 group-hover:bg-black/10 transition-colors">
                <svg className="w-5 h-5 text-black/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-black">View Full Report</p>
                <p className="text-xs text-black/40">Detailed scores and insights</p>
              </div>
            </a>

            <a
              href="/assessment/weekly"
              className="flex items-center gap-4 p-5 rounded-xl border border-black/10 hover:border-black/20 hover:bg-black/[0.02] transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-black/5 flex items-center justify-center flex-shrink-0 group-hover:bg-black/10 transition-colors">
                <svg className="w-5 h-5 text-black/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-black">Accountability Agent</p>
                <p className="text-xs text-black/40">Quick weekly check-in</p>
              </div>
            </a>

            <a
              href="/assessment/mirror"
              className="flex items-center gap-4 p-5 rounded-xl border border-black/10 hover:border-black/20 hover:bg-black/[0.02] transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-black/5 flex items-center justify-center flex-shrink-0 group-hover:bg-black/10 transition-colors">
                <svg className="w-5 h-5 text-black/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-black">Invite Mirror Rater</p>
                <p className="text-xs text-black/40">Get outside perspective</p>
              </div>
            </a>

            {showRetake && (
              <a
                href="/assessment/baseline"
                className="flex items-center gap-4 p-5 rounded-xl border border-black/10 hover:border-black/20 hover:bg-black/[0.02] transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-black/5 flex items-center justify-center flex-shrink-0 group-hover:bg-black/10 transition-colors">
                  <svg className="w-5 h-5 text-black/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182M2.985 19.644l3.181-3.182" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-black">Retake Assessment</p>
                  <p className="text-xs text-black/40">Last taken {daysSinceAssessment} days ago</p>
                </div>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
