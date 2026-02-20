'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import { TERRITORY_CONFIG, TERRITORY_COLORS, getDimension } from '@/lib/constants'
import { getVerbalLabel } from '@/lib/scoring'
import {
  buildHeadlineText,
  buildHookInsight,
  ARCHETYPE_DESCRIPTIONS,
} from '@/lib/report-content'
import { AppShell } from '@/components/layout/AppShell'
import { ScoreRing } from '@/components/visualizations/ScoreRing'
import { LockedSection } from '@/components/ui/LockedSection'
import type {
  FullResults,
  DimensionId,
  Territory,
} from '@/types/assessment'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getQuarterFromDate(date: Date): { quarter: number; year: number } {
  return {
    quarter: Math.ceil((date.getMonth() + 1) / 3),
    year: date.getFullYear(),
  }
}

function getQuarterStartDate(quarter: number, year: number): Date {
  return new Date(year, (quarter - 1) * 3, 1)
}

function getWeekOfQuarter(date: Date, quarter: number, year: number): number {
  const start = getQuarterStartDate(quarter, year)
  const days = Math.floor((date.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  return Math.max(1, Math.min(13, Math.floor(days / 7) + 1))
}

function getISOWeek(date: Date): number {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7))
  const jan4 = new Date(d.getFullYear(), 0, 4)
  const week = Math.ceil(((d.getTime() - jan4.getTime()) / 86400000 + jan4.getDay() + 1) / 7)
  // Guard for year boundary: week 0 → 1, week > 53 → 1
  return Math.max(1, Math.min(53, week))
}

function getTimeOfDayGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

function getFirstName(fullName: string): string {
  return fullName.split(' ')[0]
}

// ---------------------------------------------------------------------------
// Loading State
// ---------------------------------------------------------------------------

function LoadingSkeleton() {
  return (
    <AppShell>
      <div className="max-w-6xl mx-auto px-8 py-16">
        <div className="space-y-8">
          <div className="mb-12">
            <div className="h-4 w-32 bg-black/5 rounded mb-3 animate-pulse" />
            <div className="h-8 w-48 bg-black/5 rounded animate-pulse" />
          </div>
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-white border border-black/10 rounded-lg p-10"
            >
              <div className="h-4 w-24 bg-black/5 rounded mb-4 animate-pulse" />
              <div className="h-7 w-44 bg-black/5 rounded mb-8 animate-pulse" />
              <div className="space-y-4">
                <div className="h-4 w-full bg-black/5 rounded animate-pulse" />
                <div className="h-4 w-4/5 bg-black/5 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  )
}

// ---------------------------------------------------------------------------
// Error State
// ---------------------------------------------------------------------------

function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <AppShell>
      <div className="flex items-center justify-center px-8 min-h-[80vh]">
        <div className="bg-white border border-black/10 rounded-lg p-12 max-w-lg w-full text-center">
          <h2 className="text-3xl font-bold text-black mb-4">
            Something went wrong
          </h2>
          <p className="text-base text-black/60 mb-8 leading-relaxed">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-block bg-black text-white px-10 py-4 rounded-lg text-base font-semibold hover:bg-black/90 transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </AppShell>
  )
}

// ---------------------------------------------------------------------------
// Hook Results Banner
// ---------------------------------------------------------------------------

interface HookResultsData {
  lyScore: number
  ltScore: number
  loScore: number
  sharpestDimension: DimensionId
}

function HookResultsBanner({ userId }: { userId?: string }) {
  const [hookData, setHookData] = useState<HookResultsData | null>(null)

  useEffect(() => {
    async function loadHookResults() {
      try {
        const stored = localStorage.getItem('ceolab_hook_results')
        if (stored) {
          const parsed = JSON.parse(stored)
          setHookData({
            lyScore: parsed.lyScore,
            ltScore: parsed.ltScore,
            loScore: parsed.loScore,
            sharpestDimension: parsed.sharpestDimension,
          })
          localStorage.removeItem('ceolab_hook_results')
          return
        }
      } catch (e) {
        console.warn('Failed to parse hook results from localStorage:', e)
      }

      if (userId) {
        try {
          const supabase = createClient()
          const { data } = await supabase
            .from('hook_sessions')
            .select('ly_score, lt_score, lo_score, sharpest_dimension')
            .eq('ceo_id', userId)
            .order('completed_at', { ascending: false })
            .limit(1)
            .single()

          if (data) {
            setHookData({
              lyScore: data.ly_score,
              ltScore: data.lt_score,
              loScore: data.lo_score,
              sharpestDimension: data.sharpest_dimension as DimensionId,
            })
          }
        } catch (e) {
          console.warn('Failed to load hook results from Supabase:', e)
        }
      }
    }

    loadHookResults()
  }, [userId])

  if (!hookData) return null

  const sharpestDim = getDimension(hookData.sharpestDimension)
  const sharpestTerritoryColor = TERRITORY_COLORS[sharpestDim.territory]
  const sharpestTerritoryLabel = TERRITORY_CONFIG[sharpestDim.territory].displayLabel

  const territoryScoreMap: Record<Territory, number> = {
    leading_yourself: hookData.lyScore,
    leading_teams: hookData.ltScore,
    leading_organizations: hookData.loScore,
  }
  const isLow = territoryScoreMap[sharpestDim.territory] < 50

  const territories = [
    { label: 'Leading Yourself', score: hookData.lyScore, color: '#7FABC8' },
    { label: 'Leading Teams', score: hookData.ltScore, color: '#A6BEA4' },
    { label: 'Leading Organizations', score: hookData.loScore, color: '#E08F6A' },
  ]

  return (
    <div className="bg-white border border-black/10 rounded-lg p-8 mb-8">
      <p className="font-mono text-sm font-bold uppercase tracking-[0.12em] text-black/50 mb-1">
        Your Leadership Snapshot
      </p>
      <p className="text-base text-black/40 mb-8">From the 10-question hook assessment</p>

      <div className="space-y-5 mb-8">
        {territories.map(t => (
          <div key={t.label}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: t.color }}
                />
                <span className="text-base font-medium text-black">{t.label}</span>
              </div>
              <span className="text-base font-bold font-mono text-black">{Math.round(t.score)}%</span>
            </div>
            <div className="w-full bg-black/5 rounded-full h-3">
              <div
                className="h-3 rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${Math.max(2, t.score)}%`,
                  backgroundColor: t.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#F7F3ED]/60 rounded-lg p-6 mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold text-white"
            style={{ backgroundColor: sharpestTerritoryColor }}
          >
            {sharpestTerritoryLabel}
          </span>
          <span className="text-base font-semibold text-black">{sharpestDim.name}</span>
        </div>
        <p className="text-base text-black/60 leading-relaxed">
          {buildHookInsight(sharpestDim.name, isLow ? 1 : 4, isLow)}
        </p>
      </div>

      <p className="text-base text-black/50 leading-relaxed">
        Take the full assessment for your complete leadership profile across all 15 dimensions.
      </p>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Locked Dashboard View (registered but not subscribed, no assessment)
// ---------------------------------------------------------------------------

function LockedDashboardView({ userName, userId }: { userName: string; userId?: string }) {
  return (
    <AppShell>
      <div className="px-8 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <p className="font-mono text-sm uppercase tracking-[0.12em] text-black/50 mb-3">CEO Lab</p>
            <h1 className="text-4xl md:text-5xl font-bold text-black tracking-tight">
              Welcome, {userName}
            </h1>
          </div>

          <HookResultsBanner userId={userId} />

          {/* Summary Strip — placeholder */}
          <div className="bg-white border border-black/10 rounded-lg p-8 mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-center gap-8">
                <ScoreRing
                  value={0}
                  size={96}
                  strokeWidth={6}
                  color="rgba(0,0,0,0.08)"
                  trackColor="rgba(0,0,0,0.03)"
                  showValue={false}
                />
                <div>
                  <p className="font-mono text-sm uppercase tracking-[0.12em] text-black/50 mb-2">CLMI Score</p>
                  <p className="text-3xl font-bold text-black/15">?</p>
                </div>
              </div>
              <div className="flex items-center gap-8">
                {[
                  { label: 'Leading Yourself', color: '#7FABC8' },
                  { label: 'Leading Teams', color: '#A6BEA4' },
                  { label: 'Leading Organizations', color: '#E08F6A' },
                ].map((t) => (
                  <div key={t.label} className="flex flex-col items-center">
                    <ScoreRing
                      value={0}
                      size={56}
                      strokeWidth={4}
                      color={`${t.color}20`}
                      trackColor="rgba(0,0,0,0.03)"
                      showValue={false}
                    />
                    <span className="text-base text-black/50 mt-1.5 max-w-[72px] text-center leading-tight">{t.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Weekly Check-in — locked */}
          <LockedSection title="Subscribe to access weekly check-ins" className="mb-8" />

          {/* Focus Dimensions — locked */}
          <LockedSection title="Subscribe to choose your focus dimensions" className="mb-8" />

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/ceolab/results"
              className="bg-white border border-black/10 rounded-lg p-6 hover:border-black/20 transition-colors"
            >
              <p className="text-base font-semibold text-black mb-1">Full Results</p>
              <p className="text-base text-black/50">All 15 dimensions, archetypes, and more</p>
            </a>
            <a
              href="/assessment/mirror"
              className="bg-white border border-black/10 rounded-lg p-6 hover:border-black/20 transition-colors"
            >
              <p className="text-base font-semibold text-black mb-1">Mirror Check</p>
              <p className="text-base text-black/50">How others experience your leadership</p>
            </a>
            <a
              href="/ceolab/results#growth-plan"
              className="bg-white border border-black/10 rounded-lg p-6 hover:border-black/20 transition-colors"
            >
              <p className="text-base font-semibold text-black mb-1">Frameworks</p>
              <p className="text-base text-black/50">Your personalized growth plan</p>
            </a>
          </div>
        </div>
      </div>
    </AppShell>
  )
}

// ---------------------------------------------------------------------------
// Baseline Pending View
// ---------------------------------------------------------------------------

function BaselinePendingView({ userName, userId }: { userName: string; userId?: string }) {
  return (
    <AppShell>
      <div className="px-8 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <p className="font-mono text-sm uppercase tracking-[0.12em] text-black/50 mb-3">CEO Lab</p>
            <h1 className="text-4xl md:text-5xl font-bold text-black tracking-tight">
              Welcome, {userName}
            </h1>
          </div>

          <div className="max-w-3xl mx-auto">
            <HookResultsBanner userId={userId} />
          </div>

          <div className="max-w-3xl mx-auto mb-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-white border border-black/10 rounded-lg p-8">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#7FABC8]/15 text-base font-bold text-[#7FABC8] mb-4">1</span>
                <h3 className="text-base font-semibold text-black mb-2">Measure</h3>
                <p className="text-base text-black/60 leading-relaxed">96 questions map your leadership across 15 dimensions in three territories.</p>
              </div>
              <div className="bg-white border border-black/10 rounded-lg p-8">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#A6BEA4]/15 text-base font-bold text-[#A6BEA4] mb-4">2</span>
                <h3 className="text-base font-semibold text-black mb-2">Understand</h3>
                <p className="text-base text-black/60 leading-relaxed">Your scores reveal which frameworks will have the most impact on your growth.</p>
              </div>
              <div className="bg-white border border-black/10 rounded-lg p-8">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#E08F6A]/15 text-base font-bold text-[#E08F6A] mb-4">3</span>
                <h3 className="text-base font-semibold text-black mb-2">Grow</h3>
                <p className="text-base text-black/60 leading-relaxed">Weekly check-ins track whether the frameworks are working. Real data, real progress.</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-black/10 rounded-lg p-12 md:p-16 max-w-3xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-10">
              <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: '#7FABC8' }} />
              <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: '#A6BEA4' }} />
              <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: '#E08F6A' }} />
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
              Start Your Baseline Assessment
            </h2>
            <p className="text-lg text-black/60 leading-relaxed mb-3 max-w-md mx-auto">
              96 questions across 3 stages. Takes about 25 minutes total.
            </p>
            <p className="text-base text-black/40 mb-12 max-w-md mx-auto">
              You can complete it in one sitting or take breaks between stages.
            </p>

            <div className="flex items-center justify-center gap-10 mb-12">
              {[
                { label: 'Stage 1', items: '32 items', time: '~8 min' },
                { label: 'Stage 2', items: '34 items', time: '~9 min' },
                { label: 'Stage 3', items: '30 items', time: '~8 min' },
              ].map((stage, i) => (
                <div key={i} className="text-center">
                  <ScoreRing
                    value={0}
                    size={56}
                    strokeWidth={3}
                    color="rgba(0,0,0,0.08)"
                    trackColor="rgba(0,0,0,0.03)"
                    showValue={false}
                  />
                  <p className="text-base text-black/50 mt-1">{i + 1}</p>
                  <p className="text-sm font-medium text-black/40 mt-1.5">{stage.label}</p>
                  <p className="text-sm text-black/35">{stage.time}</p>
                </div>
              ))}
            </div>

            <a
              href="/assessment/baseline"
              className="inline-block bg-black text-white px-12 py-4 rounded-lg text-lg font-semibold hover:bg-black/90 transition-colors"
            >
              Begin Assessment
            </a>
          </div>
        </div>
      </div>
    </AppShell>
  )
}

// ---------------------------------------------------------------------------
// Baseline In Progress View
// ---------------------------------------------------------------------------

function BaselineInProgressView({ userName, stageReached }: { userName: string; stageReached: number }) {
  return (
    <AppShell>
      <div className="px-8 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <p className="font-mono text-sm uppercase tracking-[0.12em] text-black/50 mb-3">CEO Lab</p>
            <h1 className="text-4xl md:text-5xl font-bold text-black tracking-tight">
              Welcome back, {userName}
            </h1>
          </div>

          <div className="bg-white border border-black/10 rounded-lg p-12 md:p-16 max-w-3xl mx-auto text-center">
            <p className="font-mono text-sm uppercase tracking-[0.12em] text-black/50 mb-8">Assessment in progress</p>

            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
              Stage {stageReached} of 3 complete
            </h2>
            <p className="text-lg text-black/50 mb-12">
              Pick up where you left off.
            </p>

            <div className="flex items-center justify-center gap-5 mb-12">
              {[1, 2, 3].map((stage) => {
                const isComplete = stage <= stageReached
                const isCurrent = stage === stageReached + 1

                return (
                  <div key={stage} className="flex items-center gap-5">
                    <div className="text-center">
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center border-2 ${
                        isComplete ? 'bg-black border-black' : isCurrent ? 'border-black' : 'border-black/10'
                      }`}>
                        {isComplete ? (
                          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        ) : (
                          <span className={`text-base font-semibold font-mono ${isCurrent ? 'text-black' : 'text-black/35'}`}>{stage}</span>
                        )}
                      </div>
                      <p className={`text-sm font-medium mt-2 ${isComplete ? 'text-black' : isCurrent ? 'text-black/70' : 'text-black/35'}`}>
                        Stage {stage}
                      </p>
                    </div>

                    {stage < 3 && (
                      <div className={`w-14 h-0.5 mb-7 ${stage <= stageReached ? 'bg-black' : 'bg-black/10'}`} />
                    )}
                  </div>
                )
              })}
            </div>

            <a
              href="/assessment/baseline"
              className="inline-block bg-black text-white px-12 py-4 rounded-lg text-lg font-semibold hover:bg-black/90 transition-colors"
            >
              Continue Assessment
            </a>
          </div>
        </div>
      </div>
    </AppShell>
  )
}

// ---------------------------------------------------------------------------
// V3 Upgrade View
// ---------------------------------------------------------------------------

function V3UpgradeView({ userName }: { userName: string }) {
  return (
    <AppShell>
      <div className="px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10">
            <p className="font-mono text-sm uppercase tracking-[0.12em] text-black/50 mb-3">CEO Lab</p>
            <h1 className="text-4xl md:text-5xl font-bold text-black tracking-tight">
              Welcome back, {userName}
            </h1>
          </div>

          <div className="bg-white border border-black/10 rounded-lg p-12 md:p-16 text-center">
            <div className="flex items-center justify-center gap-3 mb-10">
              <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: '#7FABC8' }} />
              <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: '#A6BEA4' }} />
              <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: '#E08F6A' }} />
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
              New Assessment Available
            </h2>
            <p className="text-lg text-black/60 leading-relaxed mb-3 max-w-lg mx-auto">
              You completed an earlier version of the assessment. The new V4 measures 15 dimensions across three territories with deeper scoring.
            </p>
            <p className="text-base text-black/40 mb-12 max-w-lg mx-auto">
              Take the updated assessment to unlock your full leadership dashboard.
            </p>

            <a
              href="/assessment/baseline"
              className="inline-block bg-black text-white px-12 py-4 rounded-lg text-lg font-semibold hover:bg-black/90 transition-colors"
            >
              Take V4 Assessment
            </a>
          </div>
        </div>
      </div>
    </AppShell>
  )
}

// ---------------------------------------------------------------------------
// Redesigned Home View
// ---------------------------------------------------------------------------

interface QuarterInfo {
  quarter: number
  year: number
  clmi: number | null
  completedAt: string | null
  isCurrent: boolean
}

interface SessionInfo {
  id: string
  completedAt: string
  clmi: number
}

interface MirrorInvite {
  id: string
  email: string
  name: string
  isCompleted: boolean
}

interface HomeData {
  results: FullResults
  focusDimensions: DimensionId[]
  streak: { currentStreak: number; lastCheckIn: string | null; isDueThisWeek: boolean }
  latestWeeklyScores: Record<string, number>
  quarterlyAssessments: QuarterInfo[]
  completedWeeksThisQuarter: number[]
  currentWeekOfQuarter: number
  currentQuarter: number
  currentYear: number
  hasMirrorData: boolean
  mirrorInvites: MirrorInvite[]
  mirrorCompletedCount: number
  allSessions: SessionInfo[]
}

const MIRROR_UNLOCK_THRESHOLD = 5
const MIRROR_GOAL_THRESHOLD = 15

// ── To-Do Item Types ─────────────────────────────────────────────

interface TodoItem {
  id: string
  priority: 'do-now' | 'coming-up'
  title: string
  description: string
  href: string
  ctaLabel: string
  completed: boolean
  icon: 'assessment' | 'focus' | 'checkin' | 'mirror' | 'calendar'
}

function buildTodoItems(data: HomeData): TodoItem[] {
  const items: TodoItem[] = []
  const hasCompletedAssessment = data.allSessions.length > 0
  const hasFocusDimensions = data.focusDimensions.length > 0

  // No completed assessment
  if (!hasCompletedAssessment) {
    items.push({
      id: 'baseline',
      priority: 'do-now',
      title: 'Complete Your Baseline Assessment',
      description: '96 questions across 15 dimensions. Takes about 25 minutes.',
      href: '/assessment/baseline',
      ctaLabel: 'Start Assessment',
      completed: false,
      icon: 'assessment',
    })
  } else {
    items.push({
      id: 'baseline',
      priority: 'coming-up',
      title: 'Baseline Assessment',
      description: 'Completed',
      href: '/ceolab/results',
      ctaLabel: 'View Results',
      completed: true,
      icon: 'assessment',
    })
  }

  // No focus dimensions
  if (!hasFocusDimensions && hasCompletedAssessment) {
    items.push({
      id: 'focus',
      priority: 'do-now',
      title: 'Choose Your Focus Areas',
      description: 'Pick 3 dimensions to track weekly. This activates your accountability system.',
      href: '/accountability/setup',
      ctaLabel: 'Choose Dimensions',
      completed: false,
      icon: 'focus',
    })
  } else if (hasFocusDimensions) {
    items.push({
      id: 'focus',
      priority: 'coming-up',
      title: 'Focus Areas Set',
      description: `${data.focusDimensions.length} dimensions selected`,
      href: '/accountability/setup',
      ctaLabel: 'Change',
      completed: true,
      icon: 'focus',
    })
  }

  // Check-in due this week
  if (data.streak.isDueThisWeek && hasFocusDimensions) {
    items.push({
      id: 'checkin',
      priority: 'do-now',
      title: 'Weekly Check-In Due',
      description: `${data.focusDimensions.length} quick questions on your focus areas. Keep your streak alive.`,
      href: '/assessment/weekly',
      ctaLabel: 'Check In Now',
      completed: false,
      icon: 'checkin',
    })
  } else if (!data.streak.isDueThisWeek && hasFocusDimensions) {
    items.push({
      id: 'checkin',
      priority: 'coming-up',
      title: 'Weekly Check-In',
      description: 'Done for this week',
      href: '/assessment/weekly',
      ctaLabel: 'Done',
      completed: true,
      icon: 'checkin',
    })
  }

  // Mirror Check
  if (hasCompletedAssessment) {
    const { mirrorCompletedCount, mirrorInvites } = data
    const isUnlocked = mirrorCompletedCount >= MIRROR_UNLOCK_THRESHOLD

    if (isUnlocked) {
      items.push({
        id: 'mirror',
        priority: 'coming-up',
        title: 'Mirror Check',
        description: `${mirrorCompletedCount} raters completed`,
        href: '/ceolab/results',
        ctaLabel: 'View Results',
        completed: true,
        icon: 'mirror',
      })
    } else if (mirrorInvites.length === 0) {
      items.push({
        id: 'mirror',
        priority: 'coming-up',
        title: 'Set Up Mirror Check',
        description: `Invite colleagues to rate your leadership. Need ${MIRROR_UNLOCK_THRESHOLD} responses to unlock.`,
        href: '/assessment/mirror',
        ctaLabel: 'Invite Raters',
        completed: false,
        icon: 'mirror',
      })
    } else {
      items.push({
        id: 'mirror',
        priority: 'coming-up',
        title: 'Mirror Check',
        description: `${mirrorCompletedCount} of ${MIRROR_UNLOCK_THRESHOLD} responses to unlock`,
        href: '/assessment/mirror',
        ctaLabel: 'Invite More',
        completed: false,
        icon: 'mirror',
      })
    }
  }

  // Next quarterly assessment
  if (hasCompletedAssessment) {
    const lastSession = data.allSessions[data.allSessions.length - 1]
    const lastDate = new Date(lastSession.completedAt)
    const nextDate = new Date(lastDate)
    nextDate.setMonth(nextDate.getMonth() + 3)
    const now = new Date()
    const isDue = now >= nextDate

    // Check if current quarter already has assessment
    const currentQuarterHasAssessment = data.quarterlyAssessments.some(
      q => q.isCurrent && q.clmi != null
    )

    if (!currentQuarterHasAssessment && isDue) {
      items.push({
        id: 'quarterly',
        priority: 'do-now',
        title: 'Quarterly Re-Assessment Due',
        description: 'Time to measure your growth. Retake the baseline to track progress.',
        href: '/assessment/baseline',
        ctaLabel: 'Retake Assessment',
        completed: false,
        icon: 'calendar',
      })
    } else if (!currentQuarterHasAssessment) {
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
      items.push({
        id: 'quarterly',
        priority: 'coming-up',
        title: `Next Baseline: ${monthNames[nextDate.getMonth()]} ${nextDate.getFullYear()}`,
        description: 'Quarterly re-assessments track your growth over time.',
        href: '/assessment/baseline',
        ctaLabel: 'View Schedule',
        completed: false,
        icon: 'calendar',
      })
    }
  }

  // Sort: do-now first, then coming-up. Within each, uncompleted first.
  items.sort((a, b) => {
    if (a.priority !== b.priority) return a.priority === 'do-now' ? -1 : 1
    if (a.completed !== b.completed) return a.completed ? 1 : -1
    return 0
  })

  return items
}

function TodoIcon({ type, completed }: { type: TodoItem['icon']; completed: boolean }) {
  const baseClass = completed ? 'text-black/20' : 'text-black'

  if (type === 'assessment') {
    return (
      <svg className={`w-5 h-5 ${baseClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
      </svg>
    )
  }
  if (type === 'focus') {
    return (
      <svg className={`w-5 h-5 ${baseClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    )
  }
  if (type === 'checkin') {
    return (
      <svg className={`w-5 h-5 ${baseClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  }
  if (type === 'mirror') {
    return (
      <svg className={`w-5 h-5 ${baseClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    )
  }
  // calendar
  return (
    <svg className={`w-5 h-5 ${baseClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
  )
}

// ── Feedback Section ──────────────────────────────────────────────

function FeedbackSection() {
  const [feedback, setFeedback] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!feedback.trim()) return

    setStatus('sending')
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: feedback.trim() }),
      })
      if (!res.ok) throw new Error('Failed to send')
      setStatus('sent')
      setFeedback('')
      setTimeout(() => setStatus('idle'), 3000)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  return (
    <div className="bg-white border border-black/10 rounded-lg p-8">
      <p className="font-mono text-sm uppercase tracking-[0.12em] text-black/50 mb-2">Feedback</p>
      <h2 className="text-xl font-semibold text-black mb-1">Help us improve CEO Lab</h2>
      <p className="text-base text-black/50 mb-6">Have feedback? Want to suggest a feature? Let us know.</p>

      <form onSubmit={handleSubmit}>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="What would make CEO Lab more useful for you?"
          className="w-full border border-black/10 rounded-lg p-4 text-sm text-black placeholder:text-black/35 resize-none focus:outline-none focus:border-black/20 bg-[#F7F3ED]/30"
          rows={3}
        />
        <div className="flex items-center justify-between mt-4">
          <div>
            {status === 'sent' && (
              <p className="text-base text-black/50">Thank you for your feedback.</p>
            )}
            {status === 'error' && (
              <p className="text-sm text-red-500/70">Failed to send. Please try again.</p>
            )}
          </div>
          <button
            type="submit"
            disabled={status === 'sending' || !feedback.trim()}
            className="bg-black text-white px-10 py-4 rounded-lg text-base font-semibold hover:bg-black/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {status === 'sending' ? 'Sending...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  )
}

// ── Main Home View ────────────────────────────────────────────────

function ChecklistHomeView({ data, userName }: { data: HomeData; userName: string }) {
  const {
    results, focusDimensions, streak, latestWeeklyScores,
    quarterlyAssessments, completedWeeksThisQuarter,
    currentWeekOfQuarter, currentQuarter, currentYear,
    mirrorInvites, mirrorCompletedCount, allSessions,
  } = data

  const mirrorIsUnlocked = mirrorCompletedCount >= MIRROR_UNLOCK_THRESHOLD

  const clmi = results.session.clmi ?? 0
  const label = getVerbalLabel(clmi)

  const territoryScores = results.territoryScores ?? []

  const todoItems = buildTodoItems(data)
  const doNowItems = todoItems.filter(i => i.priority === 'do-now' && !i.completed)
  const comingUpItems = todoItems.filter(i => i.priority === 'coming-up' || i.completed)

  // Weekly check-in grid data
  const completedWeeksSet = new Set(completedWeeksThisQuarter)
  const completedWeeksCount = completedWeeksThisQuarter.length

  // Baseline assessment info
  const lastSession = allSessions.length > 0 ? allSessions[allSessions.length - 1] : null
  const nextQuarterlyDate = lastSession
    ? (() => {
        const d = new Date(lastSession.completedAt)
        d.setMonth(d.getMonth() + 3)
        return d
      })()
    : null

  return (
    <AppShell>
      <div className="px-8 py-16">
        <div className="max-w-6xl mx-auto space-y-12">

          {/* ── 1. Big Personalized Greeting ───────────────────────── */}
          <div>
            <p className="font-mono text-sm uppercase tracking-[0.12em] text-black/50 mb-3">CEO Lab</p>
            <h1 className="text-4xl md:text-5xl font-bold text-black tracking-tight mb-3">
              {getTimeOfDayGreeting()}, {getFirstName(userName)}
            </h1>
            <p className="text-lg text-black/40">
              Your leadership growth dashboard. Track, measure, and improve.
            </p>
          </div>

          {/* ── 2. High-Level Overview Card ─────────────────────────── */}
          <div className="bg-white border border-black/10 rounded-lg p-8 md:p-10">
            <p className="font-mono text-sm uppercase tracking-[0.12em] text-black/50 mb-6">Leadership Overview</p>

            <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-12">
              {/* CLMI Score Ring */}
              <div className="flex items-center gap-6 flex-shrink-0">
                <ScoreRing value={clmi} size={120} strokeWidth={8} color="#000" />
                <div>
                  <p className="text-4xl font-bold font-mono tracking-tight text-black">{Math.round(clmi)}%</p>
                  <p className="text-base text-black/40 mt-1">{label}</p>
                  <p className="font-mono text-xs uppercase tracking-[0.12em] text-black/35 mt-2">CLMI Score</p>
                </div>
              </div>

              {/* Territory breakdown bars */}
              <div className="flex-1 space-y-4">
                {territoryScores.map((ts) => (
                  <div key={ts.territory}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: TERRITORY_COLORS[ts.territory] }}
                        />
                        <span className="text-sm font-medium text-black">
                          {TERRITORY_CONFIG[ts.territory].displayLabel}
                        </span>
                      </div>
                      <span className="text-sm font-bold font-mono text-black">{Math.round(ts.score)}%</span>
                    </div>
                    <div className="w-full bg-black/5 rounded-full h-2.5">
                      <div
                        className="h-2.5 rounded-full transition-all duration-700 ease-out"
                        style={{
                          width: `${Math.max(4, ts.score)}%`,
                          backgroundColor: TERRITORY_COLORS[ts.territory],
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="mt-8 pt-6 border-t border-black/5">
              <a
                href="/ceolab/results"
                className="inline-flex items-center gap-2 text-base font-semibold text-black hover:text-black/70 transition-colors"
              >
                See Full Analytics
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </a>
            </div>
          </div>

          {/* ── 3. Dynamic To-Do List ──────────────────────────────── */}
          <div>
            <div className="border-b border-black/10 pb-4 mb-8">
              <p className="font-mono text-sm uppercase tracking-[0.12em] text-black/50 mb-2">Your Next Steps</p>
              <h2 className="text-3xl font-bold tracking-tight">What to do next</h2>
            </div>

            <div className="space-y-3">
              {/* Do Now items */}
              {doNowItems.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  className="block bg-white border border-black/10 rounded-lg p-6 hover:border-black/20 transition-colors"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <TodoIcon type={item.icon} completed={false} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-black text-white">
                            Do now
                          </span>
                        </div>
                        <p className="text-base font-semibold text-black">{item.title}</p>
                        <p className="text-base text-black/50 mt-0.5">{item.description}</p>
                      </div>
                    </div>
                    <span className="bg-black text-white px-6 py-2.5 rounded-lg text-sm font-semibold flex-shrink-0 whitespace-nowrap">
                      {item.ctaLabel}
                    </span>
                  </div>
                </a>
              ))}

              {/* Coming Up / Completed items */}
              {comingUpItems.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  className={`block border rounded-lg p-6 transition-colors ${
                    item.completed
                      ? 'bg-black/[0.01] border-black/5'
                      : 'bg-white border-black/10 hover:border-black/20'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        item.completed ? 'bg-black' : 'bg-black/5'
                      }`}>
                        {item.completed ? (
                          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        ) : (
                          <TodoIcon type={item.icon} completed={false} />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className={`text-base font-semibold ${item.completed ? 'text-black/30' : 'text-black'}`}>
                          {item.title}
                        </p>
                        <p className={`text-sm mt-0.5 ${item.completed ? 'text-black/20' : 'text-black/40'}`}>
                          {item.description}
                        </p>
                      </div>
                    </div>
                    {!item.completed && (
                      <span className="text-sm font-medium text-black/40 flex-shrink-0 whitespace-nowrap">
                        {item.ctaLabel}
                      </span>
                    )}
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* ── 4. Accountability Agent Section ─────────────────────── */}
          <div>
            <div className="border-b border-black/10 pb-4 mb-8">
              <p className="font-mono text-sm uppercase tracking-[0.12em] text-black/50 mb-2">Accountability Agent</p>
              <h2 className="text-3xl font-bold tracking-tight mb-1">Weekly Tracking</h2>
              <p className="text-base text-black/40">Your weekly check-in system. Consistent measurement drives growth.</p>
            </div>

            {focusDimensions.length > 0 ? (
              <div className="space-y-5">
                {/* Streak + Progress Grid */}
                <div className="bg-white border border-black/10 rounded-lg p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-6">
                      <div>
                        <p className="text-3xl font-bold font-mono text-black">{streak.currentStreak}</p>
                        <p className="text-base text-black/60 mt-0.5">Week streak</p>
                      </div>
                      {streak.lastCheckIn && (
                        <div className="pl-6 border-l border-black/5">
                          <p className="text-base font-medium text-black">
                            {new Date(streak.lastCheckIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </p>
                          <p className="text-base text-black/60 mt-0.5">Last check-in</p>
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold font-mono text-black">{completedWeeksCount}<span className="text-base font-normal text-black/35">/12</span></p>
                      <p className="font-mono text-base text-black/60 uppercase tracking-[0.08em]">Q{currentQuarter} {currentYear}</p>
                    </div>
                  </div>

                  {/* 12-week grid */}
                  <div className="grid grid-cols-6 md:grid-cols-12 gap-3">
                    {Array.from({ length: 12 }, (_, i) => {
                      const weekNum = i + 1
                      const isCompleted = completedWeeksSet.has(weekNum)
                      const isCurrent = weekNum === currentWeekOfQuarter && !isCompleted
                      const isFuture = weekNum > currentWeekOfQuarter

                      if (isCompleted) {
                        return (
                          <div key={weekNum} className="flex flex-col items-center gap-1.5">
                            <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
                              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                              </svg>
                            </div>
                            <span className="font-mono text-base text-black/60">W{weekNum}</span>
                          </div>
                        )
                      }

                      if (isCurrent) {
                        return (
                          <a key={weekNum} href="/assessment/weekly" className="flex flex-col items-center gap-1.5 group">
                            <div className="w-10 h-10 rounded-full border-2 border-black flex items-center justify-center group-hover:bg-black transition-colors">
                              <span className="font-mono text-xs font-bold text-black group-hover:text-white transition-colors">{weekNum}</span>
                            </div>
                            <span className="font-mono text-xs text-black font-bold">Now</span>
                          </a>
                        )
                      }

                      return (
                        <div key={weekNum} className="flex flex-col items-center gap-1.5">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            isFuture ? 'bg-black/[0.03]' : 'bg-black/[0.06]'
                          }`}>
                            <span className={`font-mono text-xs ${isFuture ? 'text-black/15' : 'text-black/35'}`}>{weekNum}</span>
                          </div>
                          <span className="font-mono text-base text-black/40">W{weekNum}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Focus Dimensions with latest scores */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {focusDimensions.map((dimId) => {
                    const dim = getDimension(dimId)
                    const color = TERRITORY_COLORS[dim.territory]
                    const latestScore = latestWeeklyScores[dimId]
                    const hasScore = latestScore !== undefined

                    return (
                      <div
                        key={dimId}
                        className="bg-white border border-black/10 rounded-lg p-6"
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <span
                            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: color }}
                          />
                          <span className="font-mono text-sm uppercase tracking-[0.12em] text-black/50">
                            {TERRITORY_CONFIG[dim.territory].displayLabel.replace('Leading ', '')}
                          </span>
                        </div>

                        <h3 className="text-base font-semibold text-black mb-3">{dim.name}</h3>

                        {hasScore ? (
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-black/5 rounded-full h-1.5">
                              <div
                                className="h-1.5 rounded-full transition-all duration-500"
                                style={{
                                  width: `${Math.max(4, latestScore)}%`,
                                  backgroundColor: color,
                                }}
                              />
                            </div>
                            <span className="text-sm font-mono font-bold text-black">{Math.round(latestScore)}%</span>
                          </div>
                        ) : (
                          <p className="text-base text-black/50">No check-in data yet</p>
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Start Check-In CTA */}
                {streak.isDueThisWeek && (
                  <div className="text-center pt-2">
                    <a
                      href="/assessment/weekly"
                      className="inline-block bg-black text-white px-10 py-4 rounded-lg text-base font-semibold hover:bg-black/90 transition-colors"
                    >
                      Start Check-In
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <a
                href="/accountability/setup"
                className="block bg-white border border-black/10 rounded-lg p-8 hover:border-black/20 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xl font-semibold text-black mb-2">Choose 3 focus dimensions</p>
                    <p className="text-base text-black/40">Set up your weekly accountability for this quarter</p>
                  </div>
                  <svg className="w-7 h-7 text-black/30 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </a>
            )}
          </div>

          {/* ── 5. Mirror Check Section ──────────────────────────── */}
          <div>
            <div className="border-b border-black/10 pb-4 mb-8">
              <p className="font-mono text-sm uppercase tracking-[0.12em] text-black/50 mb-2">Mirror Check</p>
              <h2 className="text-3xl font-bold tracking-tight mb-1">Outside Perspective</h2>
              <p className="text-base text-black/40">
                Invite colleagues to rate your leadership. {MIRROR_UNLOCK_THRESHOLD} responses unlock your results. {MIRROR_GOAL_THRESHOLD} gives you reliable data.
              </p>
            </div>

            {mirrorInvites.length === 0 ? (
              <a
                href="/assessment/mirror"
                className="block bg-white border border-black/10 rounded-lg p-8 hover:border-black/20 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xl font-semibold text-black mb-2">Invite your first rater</p>
                    <p className="text-base text-black/40">
                      Direct reports, peers, board members — anyone who sees your leadership in action.
                    </p>
                  </div>
                  <svg className="w-7 h-7 text-black/30 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </a>
            ) : (
              <div className="space-y-5">
                {/* Progress card */}
                <div className="bg-white border border-black/10 rounded-lg p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-3xl font-bold font-mono text-black">
                        {mirrorCompletedCount}
                        <span className="text-base font-normal text-black/35">/{MIRROR_UNLOCK_THRESHOLD} to unlock</span>
                      </p>
                      <p className="text-base text-black/50 mt-0.5">responses received</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold font-mono text-black">
                        {mirrorInvites.length}
                        <span className="text-sm font-normal text-black/35"> invited</span>
                      </p>
                      <p className="text-base text-black/50">goal: {MIRROR_GOAL_THRESHOLD}</p>
                    </div>
                  </div>

                  {/* Progress bar toward GOAL_THRESHOLD */}
                  <div className="mb-6">
                    <div className="w-full bg-black/5 rounded-full h-2.5 relative">
                      <div
                        className="absolute top-0 h-2.5 border-l-2 border-black/20"
                        style={{ left: `${(MIRROR_UNLOCK_THRESHOLD / MIRROR_GOAL_THRESHOLD) * 100}%` }}
                      />
                      <div
                        className="h-2.5 rounded-full bg-black transition-all duration-700 ease-out"
                        style={{ width: `${Math.min(100, (mirrorCompletedCount / MIRROR_GOAL_THRESHOLD) * 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-black/30 mt-1.5">
                      <span>0</span>
                      <span>{MIRROR_UNLOCK_THRESHOLD} unlock</span>
                      <span>{MIRROR_GOAL_THRESHOLD}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-5 border-t border-black/5">
                    {mirrorIsUnlocked ? (
                      <a
                        href="/ceolab/results"
                        className="inline-flex items-center gap-2 text-base font-semibold text-black hover:text-black/70 transition-colors"
                      >
                        View Mirror Check results
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </a>
                    ) : (
                      <p className="text-base text-black/40">
                        {MIRROR_UNLOCK_THRESHOLD - mirrorCompletedCount} more{' '}
                        {MIRROR_UNLOCK_THRESHOLD - mirrorCompletedCount === 1 ? 'response' : 'responses'} needed to unlock.
                      </p>
                    )}
                    <a
                      href="/assessment/mirror"
                      className="text-sm font-medium text-black/50 hover:text-black transition-colors flex-shrink-0"
                    >
                      + Invite more
                    </a>
                  </div>
                </div>

                {/* Invite list */}
                <div className="bg-white border border-black/10 rounded-lg overflow-hidden">
                  <div className="px-8 py-5 border-b border-black/5">
                    <p className="text-sm font-semibold text-black">Invited Raters</p>
                  </div>
                  <div className="divide-y divide-black/5">
                    {mirrorInvites.map((invite) => (
                      <div key={invite.id} className="px-8 py-4 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-black">{invite.name || invite.email}</p>
                          {invite.name && <p className="text-xs text-black/40 mt-0.5">{invite.email}</p>}
                        </div>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          invite.isCompleted
                            ? 'bg-black/5 text-black/60'
                            : 'bg-black/[0.03] text-black/35'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${invite.isCompleted ? 'bg-black/40' : 'bg-black/20'}`} />
                          {invite.isCompleted ? 'Completed' : 'Pending'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── 6. Baseline Assessment Section ────────────────────── */}
          <div>
            <div className="border-b border-black/10 pb-4 mb-8">
              <p className="font-mono text-sm uppercase tracking-[0.12em] text-black/50 mb-2">Quarterly Assessments</p>
              <h2 className="text-3xl font-bold tracking-tight mb-1">Baseline Assessments</h2>
              <p className="text-base text-black/40">Full leadership measurement across 15 dimensions. Take quarterly to track growth.</p>
            </div>

            {/* Next assessment activation notice */}
            {nextQuarterlyDate && (
              <div className="bg-[#F7F3ED]/60 border border-black/5 rounded-lg p-6 mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-black/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-base font-semibold text-black">Next assessment activates {nextQuarterlyDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                    <p className="text-base text-black/50">Quarterly re-assessments measure your growth over time</p>
                  </div>
                </div>
                {new Date() >= nextQuarterlyDate && (
                  <a href="/assessment/baseline" className="bg-black text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-black/90 transition-colors flex-shrink-0">
                    Retake Now
                  </a>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quarterlyAssessments.map((qi) => {
                const qLabel = `Q${qi.quarter} ${qi.year}`
                const key = `${qi.year}-${qi.quarter}`

                if (qi.clmi != null && qi.completedAt) {
                  const verbal = getVerbalLabel(qi.clmi)
                  const dateStr = new Date(qi.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  return (
                    <div key={key} className="bg-white border border-black/10 rounded-lg p-8">
                      <p className="font-mono text-sm uppercase tracking-[0.12em] text-black/50 mb-5">{qLabel}</p>
                      <div className="flex items-center gap-5">
                        <ScoreRing value={qi.clmi} size={64} strokeWidth={5} color="#000" />
                        <div>
                          <p className="text-3xl font-bold font-mono tracking-tight">{Math.round(qi.clmi)}%</p>
                          <p className="text-base text-black/50">{verbal}</p>
                        </div>
                      </div>
                      <p className="text-sm text-black/35 mt-5 font-mono uppercase tracking-[0.08em]">Completed {dateStr}</p>
                    </div>
                  )
                }

                if (qi.isCurrent) {
                  return (
                    <a key={key} href="/assessment/baseline" className="block bg-black text-white rounded-lg p-8 hover:bg-black/90 transition-colors">
                      <p className="font-mono text-sm uppercase tracking-[0.12em] text-white/50 mb-5">{qLabel}</p>
                      <p className="text-xl font-semibold mb-2">Take Assessment</p>
                      <p className="text-base text-white/60">96 questions &middot; ~25 min</p>
                    </a>
                  )
                }

                return (
                  <div key={key} className="bg-black/[0.02] border border-black/5 rounded-lg p-8">
                    <p className="font-mono text-sm uppercase tracking-[0.12em] text-black/30 mb-5">{qLabel}</p>
                    <p className="text-base text-black/30">Skipped</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* ── 7. Feedback Section ─────────────────────────────────── */}
          <FeedbackSection />

        </div>
      </div>
    </AppShell>
  )
}

// ---------------------------------------------------------------------------
// Main Page Component
// ---------------------------------------------------------------------------

type CeoLabState = 'loading' | 'error' | 'dashboard-locked' | 'baseline-pending' | 'baseline-in-progress' | 'v3-upgrade' | 'complete'

export default function CeoLabPage() {
  const router = useRouter()
  const [pageState, setPageState] = useState<CeoLabState>('loading')
  const [error, setError] = useState<string | null>(null)
  const [homeData, setHomeData] = useState<HomeData | null>(null)
  const [userName, setUserName] = useState('CEO')
  const [userId, setUserId] = useState<string | undefined>(undefined)
  const [stageReached, setStageReached] = useState(0)

  const loadPage = React.useCallback(async () => {
    try {
      setPageState('loading')
      setError(null)

      const supabase = createClient()
      const { data: { user }, error: authError } = await supabase.auth.getUser()

      if (authError || !user) {
        router.push('/auth')
        return
      }

      setUserId(user.id)

      // Check for completed session FIRST — before profile query
      const { data: completedSession } = await supabase
        .from('assessment_sessions')
        .select('id, completed_at, stage_reached, clmi, bsi')
        .eq('ceo_id', user.id)
        .eq('version', '4.0')
        .not('completed_at', 'is', null)
        .order('completed_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      // Load profile (gracefully handle missing reveal_seen column)
      let profile: { subscription_status?: string; full_name?: string; reveal_seen?: boolean } | null = null
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('subscription_status, full_name, reveal_seen')
        .eq('id', user.id)
        .single()

      if (!profileError) {
        profile = profileData
      } else {
        // Fallback: query without reveal_seen in case migration 007 hasn't run
        const { data: fallbackProfile } = await supabase
          .from('user_profiles')
          .select('subscription_status, full_name')
          .eq('id', user.id)
          .single()
        profile = fallbackProfile ? { ...fallbackProfile, reveal_seen: undefined } : null
      }

      const name = profile?.full_name
        || user.user_metadata?.full_name
        || user.user_metadata?.name
        || user.email?.split('@')[0]
        || 'CEO'
      setUserName(name)

      const subStatus = profile?.subscription_status || 'inactive'
      const isSubscribed = subStatus === 'active' || subStatus === 'trialing'

      if (!completedSession) {
        // Check if user completed an older (pre-V4) assessment
        const { data: oldAssessment } = await supabase
          .from('baseline_assessments')
          .select('id, completed_at')
          .eq('user_id', user.id)
          .not('completed_at', 'is', null)
          .limit(1)
          .maybeSingle()

        if (oldAssessment) {
          setPageState('v3-upgrade')
          return
        }

        // No completed assessment — check subscription for next steps
        if (!isSubscribed) {
          setPageState('dashboard-locked')
          return
        }

        // Check for in-progress session
        const { data: latestSession } = await supabase
          .from('assessment_sessions')
          .select('id, completed_at, stage_reached')
          .eq('ceo_id', user.id)
          .eq('version', '4.0')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle()

        if (!latestSession) {
          setPageState('baseline-pending')
          return
        }

        setStageReached(latestSession.stage_reached || 0)
        setPageState('baseline-in-progress')
        return
      }

      // Check reveal_seen — if explicitly false, redirect to reveal
      if (profile && profile.reveal_seen === false) {
        router.push('/ceolab/reveal')
        return
      }

      // Load full results + focus + ALL completed sessions in parallel
      const [resultsRes, focusRes, allSessionsRes] = await Promise.all([
        fetch('/api/v4/results'),
        fetch('/api/v4/focus'),
        supabase
          .from('assessment_sessions')
          .select('id, completed_at, clmi')
          .eq('ceo_id', user.id)
          .eq('version', '4.0')
          .not('completed_at', 'is', null)
          .order('completed_at', { ascending: true }),
      ])

      if (!resultsRes.ok) {
        if (resultsRes.status === 401) {
          router.replace('/auth')
          return
        }
        throw new Error(`Failed to load results (${resultsRes.status})`)
      }

      const [resultsJson, focusJson] = await Promise.all([
        resultsRes.json(),
        focusRes.json(),
      ])

      const focusDimensions: DimensionId[] = focusJson.success && focusJson.dimensions
        ? focusJson.dimensions
        : []

      // Load weekly pulse data
      const { data: pulseRows } = await supabase
        .from('weekly_pulse')
        .select('responded_at, dimension, score')
        .eq('ceo_id', user.id)
        .order('responded_at', { ascending: true })

      // ── Calculate streak ──────────────────────────────────────
      let currentStreak = 0
      let lastCheckIn: string | null = null
      let isDueThisWeek = true
      const latestWeeklyScores: Record<string, number> = {}

      if (pulseRows && pulseRows.length > 0) {
        lastCheckIn = pulseRows[pulseRows.length - 1].responded_at

        // Get latest score per dimension
        for (const row of pulseRows) {
          latestWeeklyScores[row.dimension] = ((row.score - 1) / 4) * 100
        }

        // Count weeks with responses
        const weekSet = new Set<string>()
        for (const row of pulseRows) {
          const d = new Date(row.responded_at)
          const weekKey = `${d.getFullYear()}-W${String(getISOWeek(d)).padStart(2, '0')}`
          weekSet.add(weekKey)
        }

        const now = new Date()
        const currentWeekKey = `${now.getFullYear()}-W${String(getISOWeek(now)).padStart(2, '0')}`
        isDueThisWeek = !weekSet.has(currentWeekKey)

        // Count streak backwards
        const sortedWeeks = [...weekSet].sort()
        const lastWeekKey = sortedWeeks[sortedWeeks.length - 1]
        const prevWeekKey = `${now.getFullYear()}-W${String(getISOWeek(new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000))).padStart(2, '0')}`

        if (lastWeekKey === currentWeekKey || lastWeekKey === prevWeekKey) {
          currentStreak = 1
          for (let i = sortedWeeks.length - 2; i >= 0; i--) {
            const [yA, wA] = sortedWeeks[i].split('-W').map(Number)
            const [yB, wB] = sortedWeeks[i + 1].split('-W').map(Number)
            if ((yA === yB && wB - wA === 1) || (yB === yA + 1 && wB === 1 && wA >= 52)) {
              currentStreak++
            } else {
              break
            }
          }
        }
      }

      // ── Build quarterly assessment data ───────────────────────
      const now = new Date()
      const { quarter: currentQ, year: currentY } = getQuarterFromDate(now)

      const allSessions = allSessionsRes.data || []
      const sessionsByQuarter: Record<string, { clmi: number; completedAt: string }> = {}
      for (const s of allSessions) {
        const d = new Date(s.completed_at)
        const { quarter: sq, year: sy } = getQuarterFromDate(d)
        const key = `${sy}-${sq}`
        if (!sessionsByQuarter[key] || new Date(s.completed_at) > new Date(sessionsByQuarter[key].completedAt)) {
          sessionsByQuarter[key] = { clmi: Number(s.clmi), completedAt: s.completed_at }
        }
      }

      // Build range from earliest session to current quarter
      let startYear = currentY
      let startQuarter = currentQ
      for (const key of Object.keys(sessionsByQuarter)) {
        const [y, q] = key.split('-').map(Number)
        if (y < startYear || (y === startYear && q < startQuarter)) {
          startYear = y
          startQuarter = q
        }
      }

      const quarterlyAssessments: QuarterInfo[] = []
      let iterY = startYear
      let iterQ = startQuarter
      while (iterY < currentY || (iterY === currentY && iterQ <= currentQ)) {
        const key = `${iterY}-${iterQ}`
        const session = sessionsByQuarter[key]
        quarterlyAssessments.push({
          quarter: iterQ,
          year: iterY,
          clmi: session?.clmi ?? null,
          completedAt: session?.completedAt ?? null,
          isCurrent: iterY === currentY && iterQ === currentQ,
        })
        iterQ++
        if (iterQ > 4) { iterQ = 1; iterY++ }
      }

      // If no sessions found (shouldn't happen), show current quarter
      if (quarterlyAssessments.length === 0) {
        quarterlyAssessments.push({
          quarter: currentQ, year: currentY,
          clmi: null, completedAt: null, isCurrent: true,
        })
      }

      // ── Build weekly check-in data for current quarter ────────
      const quarterStart = getQuarterStartDate(currentQ, currentY)
      const completedWeeksSet = new Set<number>()

      if (pulseRows) {
        for (const row of pulseRows) {
          const d = new Date(row.responded_at)
          const { quarter: rq, year: ry } = getQuarterFromDate(d)
          if (rq === currentQ && ry === currentY) {
            const daysSinceStart = Math.floor((d.getTime() - quarterStart.getTime()) / (1000 * 60 * 60 * 24))
            const weekNum = Math.max(1, Math.min(13, Math.floor(daysSinceStart / 7) + 1))
            completedWeeksSet.add(weekNum)
          }
        }
      }

      const daysSinceQuarterStart = Math.floor((now.getTime() - quarterStart.getTime()) / (1000 * 60 * 60 * 24))
      const currentWeekOfQuarter = Math.max(1, Math.min(13, Math.floor(daysSinceQuarterStart / 7) + 1))

      // ── Load mirror invites ───────────────────────────────────
      const { data: mirrorSessions } = await supabase
        .from('mirror_sessions')
        .select('id, rater_email, rater_relationship, completed_at')
        .eq('session_id', completedSession.id)

      const mirrorInvites: MirrorInvite[] = (mirrorSessions || []).map((s: {
        id: string; rater_email: string; rater_relationship: string; completed_at: string | null
      }) => ({
        id: s.id,
        email: s.rater_email,
        name: s.rater_relationship || '',
        isCompleted: !!s.completed_at,
      }))

      const mirrorCompletedCount = mirrorInvites.filter(i => i.isCompleted).length

      // ── Determine mirror data status ──────────────────────────
      const fullResults: FullResults = resultsJson.results
      const hasMirrorData = mirrorCompletedCount >= MIRROR_UNLOCK_THRESHOLD

      // ── Build session info array ──────────────────────────────
      const sessionInfos: SessionInfo[] = allSessions.map((s: { id: string; completed_at: string; clmi: number }) => ({
        id: s.id,
        completedAt: s.completed_at,
        clmi: Number(s.clmi),
      }))

      setHomeData({
        results: fullResults,
        focusDimensions,
        streak: { currentStreak, lastCheckIn, isDueThisWeek },
        latestWeeklyScores,
        quarterlyAssessments,
        completedWeeksThisQuarter: [...completedWeeksSet].sort((a, b) => a - b),
        currentWeekOfQuarter,
        currentQuarter: currentQ,
        currentYear: currentY,
        hasMirrorData,
        mirrorInvites,
        mirrorCompletedCount,
        allSessions: sessionInfos,
      })
      setPageState('complete')
    } catch (err: any) {
      console.error('CEO Lab load error:', err)
      setError(err.message || 'Failed to load CEO Lab')
      setPageState('error')
    }
  }, [router])

  useEffect(() => {
    loadPage()
  }, [loadPage])

  if (pageState === 'loading') return <LoadingSkeleton />
  if (pageState === 'error') return <ErrorState message={error || 'Something went wrong'} onRetry={loadPage} />
  if (pageState === 'dashboard-locked') return <LockedDashboardView userName={userName} userId={userId} />
  if (pageState === 'baseline-pending') return <BaselinePendingView userName={userName} userId={userId} />
  if (pageState === 'baseline-in-progress') return <BaselineInProgressView userName={userName} stageReached={stageReached} />
  if (pageState === 'v3-upgrade') return <V3UpgradeView userName={userName} />
  if (pageState === 'complete' && homeData) return <ChecklistHomeView data={homeData} userName={userName} />

  return null
}
