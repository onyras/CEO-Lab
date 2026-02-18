'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import { TERRITORY_CONFIG, getDimension } from '@/lib/constants'
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

const TERRITORY_COLORS: Record<Territory, string> = {
  leading_yourself: '#7FABC8',
  leading_teams: '#A6BEA4',
  leading_organizations: '#E08F6A',
}

// ---------------------------------------------------------------------------
// Loading State
// ---------------------------------------------------------------------------

function LoadingSkeleton() {
  return (
    <AppShell>
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="space-y-6">
          <div className="text-center mb-12">
            <div className="h-8 w-48 bg-black/5 rounded mx-auto mb-3 animate-pulse" />
            <div className="h-4 w-72 bg-black/5 rounded mx-auto animate-pulse" />
          </div>
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
            >
              <div className="h-4 w-8 bg-black/5 rounded mb-3 animate-pulse" />
              <div className="h-6 w-40 bg-black/5 rounded mb-6 animate-pulse" />
              <div className="space-y-3">
                <div className="h-3 w-full bg-black/5 rounded animate-pulse" />
                <div className="h-3 w-4/5 bg-black/5 rounded animate-pulse" />
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
      <div className="flex items-center justify-center px-6 min-h-[80vh]">
        <div className="bg-white rounded-lg p-10 max-w-md w-full text-center shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <h2 className="text-xl font-bold text-black mb-3">
            Something went wrong
          </h2>
          <p className="text-sm text-black/60 mb-6 leading-relaxed">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-block bg-black text-white px-8 py-4 rounded-lg text-base font-semibold hover:bg-black/90 transition-colors"
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
      } catch {}

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
        } catch {}
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
    <div className="bg-white rounded-lg p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)] mb-6">
      <p className="text-sm font-semibold tracking-widest uppercase text-black/40 mb-1">
        Your Leadership Snapshot
      </p>
      <p className="text-xs text-black/30 mb-6">From the 10-question hook assessment</p>

      <div className="space-y-4 mb-6">
        {territories.map(t => (
          <div key={t.label}>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: t.color }}
                />
                <span className="text-sm font-medium text-black">{t.label}</span>
              </div>
              <span className="text-sm font-bold text-black">{Math.round(t.score)}%</span>
            </div>
            <div className="w-full bg-black/5 rounded-full h-2.5">
              <div
                className="h-2.5 rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${Math.max(2, t.score)}%`,
                  backgroundColor: t.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#F7F3ED]/60 rounded-xl p-5 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span
            className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold text-white"
            style={{ backgroundColor: sharpestTerritoryColor }}
          >
            {sharpestTerritoryLabel}
          </span>
          <span className="text-sm font-semibold text-black">{sharpestDim.name}</span>
        </div>
        <p className="text-sm text-black/60 leading-relaxed">
          {buildHookInsight(sharpestDim.name, isLow ? 1 : 4, isLow)}
        </p>
      </div>

      <p className="text-sm text-black/50 leading-relaxed">
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
      <div className="px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <p className="text-sm font-semibold tracking-widest uppercase text-black/40 mb-2">CEO Lab</p>
            <h1 className="text-3xl md:text-4xl font-bold text-black tracking-tight">
              Welcome, {userName}
            </h1>
          </div>

          <HookResultsBanner userId={userId} />

          {/* Summary Strip — placeholder */}
          <div className="bg-white rounded-lg p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-6">
                <ScoreRing
                  value={0}
                  size={80}
                  strokeWidth={6}
                  color="rgba(0,0,0,0.08)"
                  trackColor="rgba(0,0,0,0.03)"
                  showValue={false}
                />
                <div>
                  <p className="text-xs text-black/40 uppercase tracking-wider mb-1">CLMI Score</p>
                  <p className="text-2xl font-bold text-black/15">?</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                {[
                  { label: 'Leading Yourself', color: '#7FABC8' },
                  { label: 'Leading Teams', color: '#A6BEA4' },
                  { label: 'Leading Organizations', color: '#E08F6A' },
                ].map((t) => (
                  <div key={t.label} className="flex flex-col items-center">
                    <ScoreRing
                      value={0}
                      size={48}
                      strokeWidth={4}
                      color={`${t.color}20`}
                      trackColor="rgba(0,0,0,0.03)"
                      showValue={false}
                    />
                    <span className="text-[10px] text-black/30 mt-1 max-w-[64px] text-center leading-tight">{t.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Weekly Check-in — locked */}
          <LockedSection title="Subscribe to access weekly check-ins" className="mb-6" />

          {/* Focus Dimensions — locked */}
          <LockedSection title="Subscribe to choose your focus dimensions" className="mb-6" />

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <a
              href="/ceolab/results"
              className="bg-white rounded-lg p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_2px_6px_rgba(0,0,0,0.08)] transition-shadow"
            >
              <p className="text-sm font-semibold text-black mb-1">Full Results</p>
              <p className="text-xs text-black/40">All 15 dimensions, archetypes, and more</p>
            </a>
            <a
              href="/assessment/mirror"
              className="bg-white rounded-lg p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_2px_6px_rgba(0,0,0,0.08)] transition-shadow"
            >
              <p className="text-sm font-semibold text-black mb-1">Mirror Check</p>
              <p className="text-xs text-black/40">Invite a colleague to reveal blind spots</p>
            </a>
            <a
              href="/ceolab/results#growth-plan"
              className="bg-white rounded-lg p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_2px_6px_rgba(0,0,0,0.08)] transition-shadow"
            >
              <p className="text-sm font-semibold text-black mb-1">Frameworks</p>
              <p className="text-xs text-black/40">Your personalized growth plan</p>
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
      <div className="px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <p className="text-sm font-semibold tracking-widest uppercase text-black/40 mb-2">CEO Lab</p>
            <h1 className="text-3xl md:text-4xl font-bold text-black tracking-tight">
              Welcome, {userName}
            </h1>
          </div>

          <div className="max-w-2xl mx-auto">
            <HookResultsBanner userId={userId} />
          </div>

          <div className="max-w-2xl mx-auto mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#7FABC8]/15 text-sm font-bold text-[#7FABC8] mb-3">1</span>
                <h3 className="text-sm font-semibold text-black mb-1">Measure</h3>
                <p className="text-xs text-black/50 leading-relaxed">96 questions map your leadership across 15 dimensions in three territories.</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#A6BEA4]/15 text-sm font-bold text-[#A6BEA4] mb-3">2</span>
                <h3 className="text-sm font-semibold text-black mb-1">Understand</h3>
                <p className="text-xs text-black/50 leading-relaxed">Your scores reveal which frameworks will have the most impact on your growth.</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#E08F6A]/15 text-sm font-bold text-[#E08F6A] mb-3">3</span>
                <h3 className="text-sm font-semibold text-black mb-1">Grow</h3>
                <p className="text-xs text-black/50 leading-relaxed">Weekly check-ins track whether the frameworks are working. Real data, real progress.</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-10 md:p-14 shadow-[0_1px_3px_rgba(0,0,0,0.04)] max-w-2xl mx-auto text-center">
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

// ---------------------------------------------------------------------------
// Baseline In Progress View
// ---------------------------------------------------------------------------

function BaselineInProgressView({ userName, stageReached }: { userName: string; stageReached: number }) {
  return (
    <AppShell>
      <div className="px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <p className="text-sm font-semibold tracking-widest uppercase text-black/40 mb-2">CEO Lab</p>
            <h1 className="text-3xl md:text-4xl font-bold text-black tracking-tight">
              Welcome back, {userName}
            </h1>
          </div>

          <div className="bg-white rounded-lg p-10 md:p-14 shadow-[0_1px_3px_rgba(0,0,0,0.04)] max-w-2xl mx-auto text-center">
            <p className="text-sm font-medium text-black/40 uppercase tracking-wider mb-6">Assessment in progress</p>

            <h2 className="text-2xl md:text-3xl font-bold text-black mb-3">
              Stage {stageReached} of 3 complete
            </h2>
            <p className="text-base text-black/50 mb-10">
              Pick up where you left off.
            </p>

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

// ---------------------------------------------------------------------------
// Complete Home View (engagement-focused)
// ---------------------------------------------------------------------------

interface HomeData {
  results: FullResults
  focusDimensions: DimensionId[]
  streak: { currentStreak: number; lastCheckIn: string | null; isDueThisWeek: boolean }
  latestWeeklyScores: Record<string, number>
}

function CompleteHomeView({ data }: { data: HomeData }) {
  const { results, focusDimensions, streak, latestWeeklyScores } = data
  const clmi = results.session.clmi ?? 0
  const label = getVerbalLabel(clmi)
  const primaryArchetype = results.archetypes[0]
  const archetypeDesc = primaryArchetype ? ARCHETYPE_DESCRIPTIONS[primaryArchetype.name] : null

  const lastCheckInText = streak.lastCheckIn
    ? new Date(streak.lastCheckIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : 'Never'

  return (
    <AppShell>
      <div className="px-6 py-12">
        <div className="max-w-3xl mx-auto">

          {/* Summary Strip */}
          <div className="bg-white rounded-lg p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-6">
                <ScoreRing value={clmi} size={80} strokeWidth={6} color="#000" label={label} />
                <div>
                  <p className="text-xs text-black/40 uppercase tracking-wider mb-1">CLMI Score</p>
                  <p className="text-2xl font-bold text-black">{Math.round(clmi)}%</p>
                  <p className="text-xs text-black/40">{label}</p>
                </div>
              </div>
              <div className="flex items-center gap-6 text-sm">
                <div className="text-center">
                  <p className="text-lg font-bold text-black">{streak.currentStreak}</p>
                  <p className="text-xs text-black/40">Week streak</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-black">{lastCheckInText}</p>
                  <p className="text-xs text-black/40">Last check-in</p>
                </div>
              </div>
            </div>

            {/* Primary Archetype Badge */}
            {primaryArchetype && archetypeDesc && (
              <div className="mt-4 pt-4 border-t border-black/5 flex items-center gap-3">
                <span className="text-xs font-medium text-black/40 uppercase tracking-wider">Primary Archetype</span>
                <span className="inline-flex items-center px-3 py-1 bg-[#F7F3ED] rounded-full text-sm font-semibold text-black">
                  {primaryArchetype.name}
                </span>
              </div>
            )}
          </div>

          {/* Weekly Check-In CTA */}
          {streak.isDueThisWeek && focusDimensions.length > 0 && (
            <a
              href="/assessment/weekly"
              className="block bg-black text-white rounded-lg p-6 mb-6 hover:bg-black/90 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold">Your weekly check-in is ready</p>
                  <p className="text-sm text-white/60 mt-1">{focusDimensions.length} questions, 60 seconds</p>
                </div>
                <svg className="w-6 h-6 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </a>
          )}

          {/* Focus Dimensions */}
          {focusDimensions.length > 0 && (
            <div className="mb-6">
              <p className="text-xs font-semibold text-black/40 uppercase tracking-wider mb-3 px-1">Focus Dimensions</p>
              <div className="grid gap-3">
                {focusDimensions.map(dimId => {
                  const def = getDimension(dimId)
                  const baselineScore = results.dimensionScores.find(ds => ds.dimensionId === dimId)
                  const baselinePct = baselineScore ? Math.round(baselineScore.percentage) : 0
                  const latestWeekly = latestWeeklyScores[dimId]
                  const color = TERRITORY_COLORS[def.territory]

                  return (
                    <div key={dimId} className="bg-white rounded-lg p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                          <p className="text-sm font-semibold text-black">{def.name}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-black">{baselinePct}%</span>
                          {latestWeekly != null && (
                            <span className={`text-xs font-medium ${latestWeekly >= baselinePct ? 'text-[#A6BEA4]' : 'text-[#E08F6A]'}`}>
                              {latestWeekly >= baselinePct ? '\u2191' : '\u2193'}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="bg-black/[0.04] rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${Math.max(2, baselinePct)}%`, backgroundColor: color }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* No focus dimensions — setup CTA */}
          {focusDimensions.length === 0 && (
            <a
              href="/accountability/setup"
              className="block bg-white rounded-lg p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] mb-6 hover:shadow-[0_2px_6px_rgba(0,0,0,0.08)] transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-black">Set up weekly check-ins</p>
                  <p className="text-xs text-black/50 mt-1">Choose 3 dimensions to track this quarter</p>
                </div>
                <svg className="w-5 h-5 text-black/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </a>
          )}

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <a
              href="/ceolab/results"
              className="bg-white rounded-lg p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_2px_6px_rgba(0,0,0,0.08)] transition-shadow"
            >
              <p className="text-sm font-semibold text-black mb-1">Full Results</p>
              <p className="text-xs text-black/40">All 15 dimensions, archetypes, and more</p>
            </a>
            <a
              href="/assessment/mirror"
              className="bg-white rounded-lg p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_2px_6px_rgba(0,0,0,0.08)] transition-shadow"
            >
              <p className="text-sm font-semibold text-black mb-1">Mirror Check</p>
              <p className="text-xs text-black/40">Invite a colleague to reveal blind spots</p>
            </a>
            <a
              href="/ceolab/results#growth-plan"
              className="bg-white rounded-lg p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_2px_6px_rgba(0,0,0,0.08)] transition-shadow"
            >
              <p className="text-sm font-semibold text-black mb-1">Frameworks</p>
              <p className="text-xs text-black/40">Your personalized growth plan</p>
            </a>
          </div>
        </div>
      </div>
    </AppShell>
  )
}

// ---------------------------------------------------------------------------
// Main Page Component
// ---------------------------------------------------------------------------

type CeoLabState = 'loading' | 'error' | 'dashboard-locked' | 'baseline-pending' | 'baseline-in-progress' | 'complete'

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
      // This ensures results show even if profile query fails
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
      // (skip if reveal_seen is undefined, meaning migration 007 hasn't run)
      if (profile && profile.reveal_seen === false) {
        router.push('/ceolab/reveal')
        return
      }

      // Load full results + focus + streak in parallel
      const [resultsRes, focusRes] = await Promise.all([
        fetch('/api/v4/results'),
        fetch('/api/v4/focus'),
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

      // Load streak data (query weekly_pulse)
      const { data: pulseRows } = await supabase
        .from('weekly_pulse')
        .select('responded_at, dimension, score')
        .eq('ceo_id', user.id)
        .order('responded_at', { ascending: true })

      // Calculate basic streak from pulse rows
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

        // Simple streak: count weeks with responses
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

      setHomeData({
        results: resultsJson.results,
        focusDimensions,
        streak: { currentStreak, lastCheckIn, isDueThisWeek },
        latestWeeklyScores,
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
  if (pageState === 'complete' && homeData) return <CompleteHomeView data={homeData} />

  return null
}

// ---------------------------------------------------------------------------
// ISO Week helper
// ---------------------------------------------------------------------------

function getISOWeek(date: Date): number {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7))
  const jan4 = new Date(d.getFullYear(), 0, 4)
  return Math.ceil(((d.getTime() - jan4.getTime()) / 86400000 + jan4.getDay() + 1) / 7)
}
