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
import { DashboardSummaryStrip } from '@/components/blocks/DashboardSummaryStrip'
import { QuarterlyAssessmentGrid } from '@/components/blocks/QuarterlyAssessmentGrid'
import { WeeklyCheckinGrid } from '@/components/blocks/WeeklyCheckinGrid'
import { FocusDimensionCards } from '@/components/blocks/FocusDimensionCards'
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

// ---------------------------------------------------------------------------
// Loading State
// ---------------------------------------------------------------------------

function LoadingSkeleton() {
  return (
    <AppShell>
      <div className="max-w-5xl mx-auto px-8 py-16">
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
          <h2 className="text-2xl font-bold text-black mb-4">
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
      <p className="font-mono text-xs font-bold uppercase tracking-[0.12em] text-black/40 mb-1">
        Your Leadership Snapshot
      </p>
      <p className="text-sm text-black/30 mb-8">From the 10-question hook assessment</p>

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

      <div className="bg-[#F7F3ED]/60 rounded-xl p-6 mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-white"
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
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <p className="font-mono text-xs uppercase tracking-[0.12em] text-black/40 mb-3">CEO Lab</p>
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
                  <p className="font-mono text-xs uppercase tracking-[0.12em] text-black/40 mb-2">CLMI Score</p>
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
                    <span className="text-xs text-black/30 mt-1.5 max-w-[72px] text-center leading-tight">{t.label}</span>
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
              <p className="text-sm text-black/40">All 15 dimensions, archetypes, and more</p>
            </a>
            <a
              href="/assessment/mirror"
              className="bg-white border border-black/10 rounded-lg p-6 hover:border-black/20 transition-colors"
            >
              <p className="text-base font-semibold text-black mb-1">Mirror Check</p>
              <p className="text-sm text-black/40">Invite a colleague to reveal blind spots</p>
            </a>
            <a
              href="/ceolab/results#growth-plan"
              className="bg-white border border-black/10 rounded-lg p-6 hover:border-black/20 transition-colors"
            >
              <p className="text-base font-semibold text-black mb-1">Frameworks</p>
              <p className="text-sm text-black/40">Your personalized growth plan</p>
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
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <p className="font-mono text-xs uppercase tracking-[0.12em] text-black/40 mb-3">CEO Lab</p>
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
                <p className="text-sm text-black/50 leading-relaxed">96 questions map your leadership across 15 dimensions in three territories.</p>
              </div>
              <div className="bg-white border border-black/10 rounded-lg p-8">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#A6BEA4]/15 text-base font-bold text-[#A6BEA4] mb-4">2</span>
                <h3 className="text-base font-semibold text-black mb-2">Understand</h3>
                <p className="text-sm text-black/50 leading-relaxed">Your scores reveal which frameworks will have the most impact on your growth.</p>
              </div>
              <div className="bg-white border border-black/10 rounded-lg p-8">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#E08F6A]/15 text-base font-bold text-[#E08F6A] mb-4">3</span>
                <h3 className="text-base font-semibold text-black mb-2">Grow</h3>
                <p className="text-sm text-black/50 leading-relaxed">Weekly check-ins track whether the frameworks are working. Real data, real progress.</p>
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
                  <p className="text-xs text-black/30 mt-1">{i + 1}</p>
                  <p className="text-sm font-medium text-black/40 mt-1.5">{stage.label}</p>
                  <p className="text-xs text-black/25">{stage.time}</p>
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
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <p className="font-mono text-xs uppercase tracking-[0.12em] text-black/40 mb-3">CEO Lab</p>
            <h1 className="text-4xl md:text-5xl font-bold text-black tracking-tight">
              Welcome back, {userName}
            </h1>
          </div>

          <div className="bg-white border border-black/10 rounded-lg p-12 md:p-16 max-w-3xl mx-auto text-center">
            <p className="font-mono text-xs uppercase tracking-[0.12em] text-black/40 mb-8">Assessment in progress</p>

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
                          <span className={`text-base font-semibold font-mono ${isCurrent ? 'text-black' : 'text-black/25'}`}>{stage}</span>
                        )}
                      </div>
                      <p className={`text-sm font-medium mt-2 ${isComplete ? 'text-black' : isCurrent ? 'text-black/70' : 'text-black/25'}`}>
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
            <p className="font-mono text-xs uppercase tracking-[0.12em] text-black/40 mb-3">CEO Lab</p>
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
// Checklist Home View (replaces old CompleteHomeView)
// ---------------------------------------------------------------------------

interface QuarterInfo {
  quarter: number
  year: number
  clmi: number | null
  completedAt: string | null
  isCurrent: boolean
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
}

function ChecklistHomeView({ data }: { data: HomeData }) {
  const {
    results, focusDimensions, streak, latestWeeklyScores,
    quarterlyAssessments, completedWeeksThisQuarter,
    currentWeekOfQuarter, currentQuarter, currentYear,
  } = data

  const clmi = results.session.clmi ?? 0
  const label = getVerbalLabel(clmi)
  const primaryArchetype = results.archetypes[0]

  // Build territory scores for mini-bars
  const territoryScores = results.territoryScores?.map(ts => ({
    territory: ts.territory,
    score: ts.score,
  }))

  return (
    <AppShell>
      <div className="px-8 py-16">
        <div className="max-w-5xl mx-auto">

          {/* ── "Due this week" banner ──────────────────────────── */}
          {streak.isDueThisWeek && focusDimensions.length > 0 && (
            <a
              href="/assessment/weekly"
              className="block bg-white border border-black/10 rounded-lg p-6 mb-6 hover:border-black/20 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full border-2 border-black flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-base font-semibold text-black">Weekly check-in due</p>
                    <p className="text-sm text-black/40">{focusDimensions.length} questions on your focus areas</p>
                  </div>
                </div>
                <span className="bg-black text-white px-6 py-2.5 rounded-lg text-sm font-semibold flex-shrink-0">
                  Check in
                </span>
              </div>
            </a>
          )}

          {/* ── Summary Strip ─────────────────────────────────────── */}
          <DashboardSummaryStrip
            clmi={clmi}
            label={label}
            streak={streak}
            primaryArchetype={primaryArchetype}
            territoryScores={territoryScores}
          />

          {/* ── Focus Dimension Cards ─────────────────────────────── */}
          {focusDimensions.length > 0 && (
            <FocusDimensionCards
              focusDimensions={focusDimensions}
              latestWeeklyScores={latestWeeklyScores}
            />
          )}

          {/* ── Quarterly Baseline Assessments ────────────────────── */}
          <QuarterlyAssessmentGrid quarterlyAssessments={quarterlyAssessments} />

          {/* ── Weekly Check-In Grid or Setup CTA ─────────────────── */}
          {focusDimensions.length > 0 ? (
            <WeeklyCheckinGrid
              completedWeeksThisQuarter={completedWeeksThisQuarter}
              currentWeekOfQuarter={currentWeekOfQuarter}
              currentQuarter={currentQuarter}
              currentYear={currentYear}
              currentStreak={streak.currentStreak}
            />
          ) : (
            <div className="mb-16">
              <div className="flex items-end justify-between pb-5 border-b border-black/10 mb-8">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.12em] text-black/40 mb-2">Accountability</p>
                  <h2 className="text-2xl font-semibold tracking-tight">Weekly Check-Ins</h2>
                </div>
              </div>
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
            </div>
          )}

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

      setHomeData({
        results: resultsJson.results,
        focusDimensions,
        streak: { currentStreak, lastCheckIn, isDueThisWeek },
        latestWeeklyScores,
        quarterlyAssessments,
        completedWeeksThisQuarter: [...completedWeeksSet].sort((a, b) => a - b),
        currentWeekOfQuarter,
        currentQuarter: currentQ,
        currentYear: currentY,
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
  if (pageState === 'complete' && homeData) return <ChecklistHomeView data={homeData} />

  return null
}
