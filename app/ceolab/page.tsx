'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import { TERRITORY_CONFIG, getDimension, FRAMEWORK_PRESCRIPTIONS } from '@/lib/constants'
import { getFrameworkPrescription, getVerbalLabel } from '@/lib/scoring'
import { FRAMEWORK_CONTENT, getFrameworkByName } from '@/lib/framework-content'
import {
  buildHeadlineText,
  buildBsiHeadlineText,
  buildHookInsight,
  IM_HANDLING,
  getTerritoryArcNarrative,
  DIMENSION_CONTENT,
  ARCHETYPE_DESCRIPTIONS,
  BLIND_SPOT_CLOSING,
  CLOSING_TEXT,
} from '@/lib/report-content'
import { AppShell } from '@/components/layout/AppShell'
import { ScoreRing } from '@/components/visualizations/ScoreRing'
import { TerritoryBars } from '@/components/visualizations/TerritoryBars'
import { DimensionHeatmap } from '@/components/visualizations/DimensionHeatmap'
import { ArchetypeBadge } from '@/components/visualizations/ArchetypeBadge'
import { MirrorDotPlot } from '@/components/visualizations/MirrorDotPlot'
import { RadarChart } from '@/components/visualizations/RadarChart'
import { LeadershipCircle } from '@/components/visualizations/LeadershipCircle'
import { RoadmapTimeline } from '@/components/visualizations/RoadmapTimeline'
import type {
  FullResults,
  DimensionScore,
  TerritoryScore,
  ArchetypeMatch,
  MirrorGap,
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

type ResultsTab = 'overview' | 'deep-dive' | 'dimensions' | 'archetypes' | 'blind-spots' | 'growth-plan' | 'roadmap'

function buildHeatmapData(dimensionScores: DimensionScore[]) {
  return dimensionScores.map((ds) => {
    const def = getDimension(ds.dimensionId)
    return {
      dimensionId: ds.dimensionId,
      name: def.name,
      territory: def.territory,
      percentage: Math.round(ds.percentage),
      verbalLabel: ds.verbalLabel,
    }
  })
}

function buildRoadmapEntries(
  priorityDimensions: DimensionId[],
  dimensionScores: DimensionScore[]
) {
  return priorityDimensions.map((dimId, index) => {
    const def = getDimension(dimId)
    const score = dimensionScores.find((ds) => ds.dimensionId === dimId)
    const percentage = score?.percentage ?? 0
    const frameworks = getFrameworkPrescription(dimId, percentage)

    const startDay = index * 14 + 1
    const endDay = startDay + 20

    return {
      dimensionId: dimId,
      dimensionName: def.name,
      territory: def.territory,
      percentage,
      verbalLabel: score?.verbalLabel ?? getVerbalLabel(percentage),
      frameworks,
      startDay: Math.min(startDay, 90),
      endDay: Math.min(endDay, 90),
    }
  })
}

// ---------------------------------------------------------------------------
// Deep Dive: Score Insights, Team Impact, Priority Badges
// ---------------------------------------------------------------------------

type DimPriority = 'strength' | 'growth' | 'quick-win' | null

function getDimPriorities(scores: { dimensionId: string; score: number }[]): Record<string, DimPriority> {
  const sorted = [...scores].sort((a, b) => a.score - b.score)
  const result: Record<string, DimPriority> = {}
  sorted.slice(0, 3).forEach((d) => { result[d.dimensionId] = 'growth' })
  sorted.slice(-3).forEach((d) => { result[d.dimensionId] = 'strength' })
  sorted.forEach((d) => {
    if (!result[d.dimensionId] && d.score >= 45 && d.score <= 60) {
      result[d.dimensionId] = 'quick-win'
    }
  })
  return result
}

function getQuarterlyProjection(currentScore: number) {
  const quarters = [{ q: 'Q1', score: currentScore, isNow: true }]
  let prev = currentScore
  for (let i = 2; i <= 4; i++) {
    const growth = Math.round((100 - prev) * 0.2)
    const next = Math.min(100, prev + Math.max(growth, 2))
    quarters.push({ q: `Q${i}`, score: next, isNow: false })
    prev = next
  }
  return quarters
}

const PRIORITY_CONFIG = {
  strength: { label: 'Strength', color: 'bg-[#A6BEA4]/15 text-[#6B8E6B]' },
  growth: { label: 'Growth Area', color: 'bg-[#E08F6A]/15 text-[#C0714E]' },
  'quick-win': { label: 'Near Breakthrough', color: 'bg-[#7FABC8]/15 text-[#5B8DAD]' },
}

function getScoreInsight(dimensionId: string, score: number): string {
  const insights: Record<string, Record<string, string>> = {
    'LY.1': {
      low: 'Patterns are running you — you\'re reacting before you realize it.',
      mid: 'You see your patterns but they still drive you under pressure.',
      high: 'Strong self-awareness. Now model it — help your team see their own.',
    },
    'LY.2': {
      low: 'Emotions are either hijacking your decisions or being suppressed entirely.',
      mid: 'You manage emotions in calm moments but lose precision under stress.',
      high: 'You navigate emotions well. Your team reads your composure as safety.',
    },
    'LY.3': {
      low: 'Constant reactivity is clouding your judgment. Stillness is a skill to build.',
      mid: 'You can find calm but it\'s fragile. Pressure still pulls you off center.',
      high: 'You stay grounded under fire. This is the foundation of everything else.',
    },
    'LY.4': {
      low: 'You\'re spending time on things anyone could do. Your zone of genius is unprotected.',
      mid: 'You know what matters but aren\'t fully committed to it yet.',
      high: 'Clear purpose drives your decisions. You\'re building something only you can build.',
    },
    'LY.5': {
      low: 'You\'re burning capacity that you\'ll need later. This is a sustainability risk.',
      mid: 'You protect your energy sometimes but let urgency override your boundaries.',
      high: 'You\'ve built systems to sustain performance. This is a competitive advantage.',
    },
    'LT.1': {
      low: 'Truth is traveling slowly in your team. People are editing what they tell you.',
      mid: 'Trust exists but isn\'t deep enough for real candor under pressure.',
      high: 'Your team tells you the truth fast. That\'s the most valuable thing a leader can build.',
    },
    'LT.2': {
      low: 'Avoided conversations are creating hidden debt. Problems are compounding.',
      mid: 'You have hard conversations but sometimes too late or too softly.',
      high: 'You address issues directly and early. Relationships grow from it, not despite it.',
    },
    'LT.3': {
      low: 'You\'re solving symptoms. The real problems are one or two layers deeper.',
      mid: 'You sense there\'s more beneath the surface but don\'t always dig deep enough.',
      high: 'You consistently find the root cause. Your team brings you the hard puzzles.',
    },
    'LT.4': {
      low: 'Your team lacks clear rhythms. People don\'t know what\'s expected or when.',
      mid: 'Basic structures exist but aren\'t consistent enough to create momentum.',
      high: 'Your team runs on clear systems. You\'ve freed yourself to think, not manage.',
    },
    'LT.5': {
      low: 'You\'re either too involved or too absent. Boundaries need definition.',
      mid: 'You know you should step back but struggle to let go of ownership.',
      high: 'You\'ve found the line between leading and doing. Your team feels autonomous.',
    },
    'LO.1': {
      low: 'Your strategy isn\'t clear enough for others to make decisions without you.',
      mid: 'The vision is there but the choices about what NOT to do aren\'t sharp.',
      high: 'Crisp strategy. Your team makes the same decisions you would in your absence.',
    },
    'LO.2': {
      low: 'Culture is happening to you, not being designed by you. Values are aspirational, not lived.',
      mid: 'You care about culture but haven\'t codified it into observable behaviors.',
      high: 'You\'ve designed the invisible forces. Culture is a system, not a poster.',
    },
    'LO.3': {
      low: 'Your org structure reflects your past, not your future. Restructure is overdue.',
      mid: 'Structure mostly works but creates friction at the seams between teams.',
      high: 'Your organization is built for where you\'re going. Structure enables, not constrains.',
    },
    'LO.4': {
      low: 'The CEO your company needed last year isn\'t the one it needs next year. Time to evolve.',
      mid: 'You\'re growing but parts of your old operating mode are holding you back.',
      high: 'You\'re actively becoming who your company needs next. That\'s rare and valuable.',
    },
    'LO.5': {
      low: 'Change is either too disruptive or not happening. Neither is sustainable.',
      mid: 'You can drive change but sometimes break what was working in the process.',
      high: 'You balance preservation and innovation. Change lands without casualties.',
    },
  }
  const dimInsights = insights[dimensionId]
  if (!dimInsights) return ''
  if (score < 40) return dimInsights.low
  if (score < 65) return dimInsights.mid
  return dimInsights.high
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
// Hero Section (always visible at top)
// ---------------------------------------------------------------------------

function ResultsHero({
  clmi,
  bsi,
  hasMirrorData,
  territoryScores,
  dimensionScores,
  imFlagged,
}: {
  clmi: number
  bsi?: number
  hasMirrorData: boolean
  territoryScores: TerritoryScore[]
  dimensionScores: DimensionScore[]
  imFlagged: boolean
}) {
  const label = getVerbalLabel(clmi)

  const headlineText = buildHeadlineText(
    clmi,
    label,
    territoryScores.map((ts) => ({
      territory: ts.territory,
      score: ts.score,
      label: ts.verbalLabel,
    }))
  )

  function getClmiInterpretation(score: number): string {
    if (score <= 20) return 'Foundational stage — significant growth opportunities ahead'
    if (score <= 40) return 'Early foundations are forming across your leadership territories'
    if (score <= 60) return 'Solid mid-range capability with clear areas to develop further'
    if (score <= 80) return 'Strong leadership maturity across your three territories'
    return 'Exceptional leadership maturity — focus on sustaining and mentoring'
  }

  const radarData = dimensionScores.map((ds) => {
    const def = getDimension(ds.dimensionId)
    return {
      dimensionId: ds.dimensionId,
      name: def.name,
      territory: def.territory,
      percentage: Math.round(ds.percentage),
    }
  })

  return (
    <>
      {/* CLMI Score + Territory Breakdown */}
      <div className="bg-white rounded-lg p-8 md:p-10 shadow-[0_1px_3px_rgba(0,0,0,0.04)] mb-6">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
          {/* Left: CLMI */}
          <div className="flex flex-col items-center text-center flex-shrink-0">
            <p className="text-sm text-black/50 mb-4">CEO Leadership Maturity Index</p>
            <ScoreRing
              value={clmi}
              size={200}
              strokeWidth={14}
              color="#000"
              label={label}
            />
            <p className="text-sm text-black/50 mt-4 max-w-[240px]">
              {getClmiInterpretation(clmi)}
            </p>
          </div>

          {/* Right: 3 territories stacked */}
          <div className="flex-1 w-full space-y-3">
            {territoryScores.map((ts) => (
              <div
                key={ts.territory}
                className="flex items-center gap-4 p-4 rounded-xl bg-[#F7F3ED]/50"
              >
                <ScoreRing
                  value={ts.score}
                  size={56}
                  strokeWidth={4}
                  color={TERRITORY_COLORS[ts.territory]}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-black">{TERRITORY_CONFIG[ts.territory].displayLabel}</p>
                  <p className="text-xs text-black/40">{ts.verbalLabel}</p>
                </div>
                <span className="text-lg font-bold text-black">{Math.round(ts.score)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Interpretation */}
        <p className="text-base text-black/60 max-w-xl mx-auto leading-relaxed text-center mt-6">
          {headlineText}
        </p>

        {/* BSI */}
        {hasMirrorData && bsi != null && (
          <p className="text-sm text-black/50 mt-3 max-w-xl mx-auto text-center">
            {buildBsiHeadlineText(bsi)}
          </p>
        )}

        {/* IM advisory */}
        {imFlagged && (
          <div className="mt-4 bg-[#F7F3ED] rounded-lg p-4 max-w-xl mx-auto text-left">
            <p className="text-xs font-semibold text-black/40 uppercase tracking-wider mb-1">
              A Note on Your Responses
            </p>
            <p className="text-sm text-black/70 leading-relaxed">
              {IM_HANDLING.headlineAdvisory}
            </p>
          </div>
        )}
      </div>

      {/* Leadership Profile — Circle + Radar */}
      <div className="bg-white rounded-lg p-8 md:p-10 shadow-[0_1px_3px_rgba(0,0,0,0.04)] mb-6">
        <h2 className="text-xl font-bold text-black mb-1">Leadership Profile</h2>
        <p className="text-sm text-black/50 mb-4">Your shape across 15 dimensions</p>
        <div className="space-y-8">
          <LeadershipCircle
            dimensions={radarData}
            clmiScore={clmi}
          />
          <RadarChart
            dimensions={radarData}
            className="max-w-full"
          />
        </div>
      </div>
    </>
  )
}

// ---------------------------------------------------------------------------
// Tab: Deep Dive (rich dimension analysis with insights + team impact)
// ---------------------------------------------------------------------------

function DeepDiveTabContent({
  dimensionScores,
  territoryScores,
}: {
  dimensionScores: DimensionScore[]
  territoryScores: TerritoryScore[]
}) {
  const enrichedScores = dimensionScores.map((ds) => {
    const def = getDimension(ds.dimensionId)
    return {
      dimensionId: ds.dimensionId,
      name: def.name,
      score: Math.round(ds.percentage),
      label: ds.verbalLabel,
      territory: def.territory,
    }
  })

  const priorities = getDimPriorities(enrichedScores)
  const territories: Territory[] = ['leading_yourself', 'leading_teams', 'leading_organizations']

  return (
    <div className="space-y-6">
      {/* Three Territories — bento cards */}
      <div className="grid md:grid-cols-3 gap-4">
        {territoryScores.map((ts) => {
          const config = TERRITORY_CONFIG[ts.territory]
          const color = TERRITORY_COLORS[ts.territory]
          const narrative = getTerritoryArcNarrative(ts.territory, ts.score)
          const score = Math.round(ts.score)

          return (
            <div
              key={ts.territory}
              className="bg-white rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden"
            >
              {/* Headline */}
              <div className="px-6 pt-6 pb-0">
                <h3 className="text-lg font-bold text-black">{config.displayLabel}</h3>
                <p className="text-xs text-black/40 mt-0.5">{config.arcDescription}</p>
              </div>
              {/* Score area */}
              <div className="px-6 pt-4 pb-6 flex flex-col items-center">
                <ScoreRing
                  value={score}
                  size={100}
                  strokeWidth={6}
                  color={color}
                  valueSuffix="%"
                  showValue={true}
                />
                <p className="text-sm text-black/40 mt-3">{ts.verbalLabel}</p>
              </div>
              {/* Narrative */}
              <div className="px-6 pb-6">
                <p className="text-sm text-black/60 leading-relaxed">{narrative}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Territory Deep Dives — 5 dimensions per territory */}
      {territories.map((t) => {
        const config = TERRITORY_CONFIG[t]
        const color = TERRITORY_COLORS[t]
        const terrScore = territoryScores.find((ts) => ts.territory === t)
        const dims = enrichedScores.filter((d) => d.territory === t)

        return (
          <div key={`deep-${t}`} className="bg-white rounded-lg p-6 md:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            {/* Territory header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-black">{config.displayLabel}</h2>
                <p className="text-xs text-black/40 mt-0.5">{config.arcDescription}</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-black">{Math.round(terrScore?.score ?? 0)}%</span>
                <p className="text-xs text-black/40">{terrScore?.verbalLabel ?? ''}</p>
              </div>
            </div>

            {/* 5 dimension bars */}
            <div className="space-y-4">
              {dims.map((dim) => {
                const score = dim.score
                return (
                  <div key={dim.dimensionId}>
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-sm font-medium text-black">{dim.name}</p>
                      <span className="text-sm font-bold text-black">{score}%</span>
                    </div>
                    <div className="bg-black/[0.04] rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500 ease-out"
                        style={{
                          width: `${Math.max(2, score)}%`,
                          backgroundColor: color,
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}

      {/* 15 Dimensions Heatmap */}
      <div className="bg-white rounded-lg p-8 md:p-10 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <h2 className="text-xl font-bold text-black mb-1">15 Dimensions</h2>
        <p className="text-sm text-black/50 mb-6">All dimensions color-coded by your score range</p>
        <DimensionHeatmap dimensions={buildHeatmapData(dimensionScores)} />
      </div>

      {/* Per-territory dimension rows */}
      {territories.map((t) => {
        const config = TERRITORY_CONFIG[t]
        const color = TERRITORY_COLORS[t]
        const terrScore = territoryScores.find((ts) => ts.territory === t)
        const dims = enrichedScores.filter((d) => d.territory === t)

        return (
          <div key={t} className="bg-white rounded-lg p-6 md:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            {/* Territory header */}
            <div className="flex items-center gap-4 mb-6">
              <ScoreRing
                value={terrScore?.score ?? 0}
                size={56}
                strokeWidth={4}
                color={color}
              />
              <div>
                <h2 className="text-lg font-semibold text-black">{config.displayLabel}</h2>
                <p className="text-xs text-black/40">{terrScore?.verbalLabel ?? ''}</p>
              </div>
            </div>

            {/* 5 dimension rows */}
            <div className="space-y-1">
              {dims.map((dim) => {
                const score = dim.score
                const priority = priorities[dim.dimensionId]
                const insight = getScoreInsight(dim.dimensionId, score)

                return (
                  <div key={dim.dimensionId}>
                    <div className="p-4 rounded-xl">
                      {/* Name + priority badge + score */}
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <div className="flex items-center gap-2 min-w-0 flex-wrap">
                          <p className="text-sm font-semibold text-black">{dim.name}</p>
                          {priority && (
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${PRIORITY_CONFIG[priority].color}`}>
                              {PRIORITY_CONFIG[priority].label}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-lg font-bold text-black">{score}%</span>
                        </div>
                      </div>

                      {/* Score bar */}
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex-1 bg-black/[0.04] rounded-full h-2.5 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500 ease-out"
                            style={{
                              width: `${Math.max(2, score)}%`,
                              backgroundColor: color,
                            }}
                          />
                        </div>
                        <span className={`text-[10px] font-semibold uppercase tracking-wide flex-shrink-0 ${
                          score >= 80 ? 'text-[#A6BEA4]'
                            : score >= 60 ? 'text-black/50'
                            : score >= 40 ? 'text-[#E08F6A]'
                            : 'text-red-400'
                        }`}>
                          {dim.label}
                        </span>
                      </div>

                      {/* Quarterly growth trajectory */}
                      <div className="flex gap-2 mt-3 mb-2">
                        {getQuarterlyProjection(score).map((qd, qi, arr) => {
                          const vLabel = getVerbalLabel(qd.score)
                          const delta = qi > 0 ? qd.score - arr[qi - 1].score : 0

                          if (qd.isNow) {
                            return (
                              <div
                                key={qd.q}
                                className="flex-1 rounded-[10px] py-3 px-2 text-center"
                                style={{ backgroundColor: color }}
                              >
                                <div className="text-[9px] font-bold text-white/70 uppercase tracking-wide mb-1">
                                  Q1 — Now
                                </div>
                                <div className="text-[22px] font-bold text-white leading-tight">{qd.score}%</div>
                                <div className="text-[9px] text-white/60 mt-0.5">{vLabel}</div>
                              </div>
                            )
                          }

                          const borderOpacity = qi === 1 ? 0.1 : qi === 2 ? 0.08 : 0.06
                          const textOpacity = qi === 1 ? 0.25 : qi === 2 ? 0.2 : 0.15
                          const scoreOpacity = qi === 1 ? 0.2 : qi === 2 ? 0.15 : 0.1
                          const labelOpacity = qi === 1 ? 0.15 : qi === 2 ? 0.12 : 0.08
                          const deltaOpacity = qi === 1 ? 1 : qi === 2 ? 0.5 : 0.35

                          return (
                            <div
                              key={qd.q}
                              className="flex-1 rounded-[10px] py-3 px-2 text-center relative"
                              style={{ border: `1.5px dashed rgba(0,0,0,${borderOpacity})` }}
                            >
                              <div
                                className="text-[9px] font-semibold uppercase tracking-wide mb-1"
                                style={{ color: `rgba(0,0,0,${textOpacity})` }}
                              >
                                {qd.q}
                              </div>
                              <div
                                className="text-[22px] font-bold leading-tight"
                                style={{ color: `rgba(0,0,0,${scoreOpacity})` }}
                              >
                                {qd.score}%
                              </div>
                              <div
                                className="text-[9px] mt-0.5"
                                style={{ color: `rgba(0,0,0,${labelOpacity})` }}
                              >
                                {vLabel}
                              </div>
                              {delta > 0 && (
                                <div
                                  className="absolute -top-2.5 right-2 text-[9px] font-semibold"
                                  style={{ color, opacity: deltaOpacity }}
                                >
                                  +{delta}
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>

                      {/* Score insight — always visible */}
                      <p className="text-xs text-black/50 leading-relaxed">
                        {insight}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Tab: Dimensions (Heatmap + Priority Dimensions)
// ---------------------------------------------------------------------------

function DimensionsTabContent({
  dimensionScores,
  priorityDimensions,
  imFlagged,
}: {
  dimensionScores: DimensionScore[]
  priorityDimensions: DimensionId[]
  imFlagged: boolean
}) {
  return (
    <div className="space-y-6">
      {/* Priority Dimensions (Mirror/Meaning/Move) */}
      <div className="bg-white rounded-lg p-8 md:p-10 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <h2 className="text-xl font-bold text-black mb-1">Priority Dimensions</h2>
        <p className="text-sm text-black/50 mb-6">
          Your most impactful development areas. Mirror the gap, understand the meaning, then move.
        </p>

        {imFlagged && (
          <div className="bg-[#F7F3ED] rounded-lg p-5 mb-6">
            <p className="text-sm text-black/70 leading-relaxed">
              {IM_HANDLING.priorityFrameworkNote}
            </p>
          </div>
        )}

        <div className="space-y-8">
          {priorityDimensions.map((dimId) => {
            const def = getDimension(dimId)
            const score = dimensionScores.find((ds) => ds.dimensionId === dimId)
            if (!score) return null

            const percentage = Math.round(score.percentage)
            const frameworks = getFrameworkPrescription(dimId, score.percentage)
            const content = DIMENSION_CONTENT[dimId]
            const isLow = score.percentage <= 50

            return (
              <div key={dimId} className="border border-black/10 rounded-lg p-6 hover:border-black/20 transition-colors">
                {/* Header row */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-xs font-medium text-black/40 mb-0.5">
                      {def.id} &middot; {TERRITORY_CONFIG[def.territory].displayLabel}
                    </p>
                    <h3 className="text-lg font-semibold text-black">{def.name}</h3>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <span className="text-2xl font-bold text-black">{percentage}%</span>
                    <p className="text-xs text-black/50 mt-0.5">{score.verbalLabel}</p>
                  </div>
                </div>

                {/* Score bar */}
                <div className="h-2 w-full rounded-full bg-[#F7F3ED] overflow-hidden mb-6">
                  <div
                    className="h-full rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: TERRITORY_COLORS[def.territory],
                    }}
                  />
                </div>

                {/* MIRROR */}
                <div className="mb-6">
                  <p className="text-xs font-semibold text-black/40 uppercase tracking-wider mb-2">Mirror</p>
                  <p className="text-sm text-black/70 leading-relaxed mb-2">
                    <span className="font-semibold text-black">{def.name}</span>: {content.behavioralDefinition}
                  </p>
                  <p className="text-sm text-black/60 leading-relaxed">
                    Your score of {percentage}% ({score.verbalLabel}) means this is{' '}
                    {percentage <= 40 ? 'a critical development area'
                      : percentage <= 60 ? 'an area still being built'
                      : percentage <= 80 ? 'a solid foundation with room to deepen'
                      : 'a genuine strength'}.
                  </p>
                </div>

                {/* MEANING */}
                <div className="mb-6">
                  <p className="text-xs font-semibold text-black/40 uppercase tracking-wider mb-2">Meaning</p>
                  <p className="text-sm text-black/70 leading-relaxed mb-3">
                    {isLow ? content.lowIndicator : content.highIndicator}
                  </p>
                  <p className="text-sm text-black/70 leading-relaxed mb-3">{content.costOfIgnoring}</p>
                  <div className="bg-[#F7F3ED] rounded-lg p-4">
                    <p className="text-xs font-semibold text-black/40 uppercase tracking-wider mb-1">The Question to Sit With</p>
                    <p className="text-sm font-medium text-black/80 italic leading-relaxed">{def.coreQuestion}</p>
                  </div>
                </div>

                {/* MOVE */}
                <div>
                  <p className="text-xs font-semibold text-black/40 uppercase tracking-wider mb-2">Move</p>
                  {frameworks.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs font-medium text-black/50 mb-2">Recommended frameworks:</p>
                      <div className="flex flex-wrap gap-2">
                        {frameworks.map((fw) => (
                          <span key={fw} className="inline-block px-3 py-1.5 text-xs font-medium text-black bg-[#F7F3ED] rounded-full">{fw}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="mt-3">
                    <p className="text-xs font-medium text-black/50 mb-2">Full framework library for {def.name}:</p>
                    <div className="flex flex-wrap gap-2">
                      {content.frameworks.map((fw) => (
                        <span key={fw} className="inline-block px-3 py-1.5 text-xs text-black/60 border border-black/10 rounded-full">{fw}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Tab: Archetypes
// ---------------------------------------------------------------------------

function ArchetypesTabContent({
  archetypes,
  imFlagged,
}: {
  archetypes: ArchetypeMatch[]
  imFlagged: boolean
}) {
  const hasMatches = archetypes.length > 0

  return (
    <div className="bg-white rounded-lg p-8 md:p-10 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <h2 className="text-xl font-bold text-black mb-1">Archetypes</h2>

      {imFlagged && (
        <div className="bg-[#F7F3ED] rounded-lg p-5 mb-6 mt-4">
          <p className="text-sm text-black/70 leading-relaxed">{IM_HANDLING.archetypeNote}</p>
        </div>
      )}

      {hasMatches ? (
        <>
          <p className="text-sm text-black/50 mb-6 mt-2">
            Your leadership profile matches the following pattern{archetypes.length > 1 ? 's' : ''}.
          </p>

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {archetypes.map((arch) => (
              <ArchetypeBadge
                key={arch.name}
                name={arch.name}
                matchType={arch.matchType}
                signatureStrength={arch.signatureStrength}
                sjiConfirmed={arch.sjiConfirmed}
                displayRank={arch.displayRank}
              />
            ))}
          </div>

          <div className="space-y-6">
            {archetypes.map((arch) => {
              const desc = ARCHETYPE_DESCRIPTIONS[arch.name]
              if (!desc) return null

              return (
                <div key={arch.name} className="border border-black/10 rounded-lg p-6">
                  <div className="mb-4">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-black">{desc.name}</h3>
                      <span className="text-xs font-medium text-black/40 px-2 py-0.5 bg-[#F7F3ED] rounded-full">
                        {arch.matchType === 'full' ? 'Full match' : 'Partial match'}
                      </span>
                    </div>
                    <p className="text-base text-black/70 leading-relaxed font-medium italic">{desc.oneSentence}</p>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs font-semibold text-black/40 uppercase tracking-wider mb-1">What This Looks Like</p>
                    <p className="text-sm text-black/70 leading-relaxed">{desc.whatThisLooksLike}</p>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs font-semibold text-black/40 uppercase tracking-wider mb-1">What This Is Costing You</p>
                    <p className="text-sm text-black/70 leading-relaxed">{desc.whatThisIsCostingYou}</p>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs font-semibold text-black/40 uppercase tracking-wider mb-1">The Shift</p>
                    <p className="text-sm text-black/70 leading-relaxed">{desc.theShift}</p>
                  </div>

                  {desc.frameworkReferences.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-black/40 uppercase tracking-wider mb-2">Key Frameworks</p>
                      <div className="flex flex-wrap gap-2">
                        {desc.frameworkReferences.map((fw) => (
                          <span key={fw} className="inline-block px-3 py-1.5 text-xs font-medium text-black bg-[#F7F3ED] rounded-full">{fw}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {arch.sjiConfirmed != null && (
                    <div className="pt-3 border-t border-black/10">
                      {arch.sjiConfirmed ? (
                        <p className="text-xs text-black/50 flex items-center gap-1.5">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#A6BEA4]" />
                          Confirmed by situational responses
                        </p>
                      ) : (
                        <p className="text-xs text-black/50 flex items-center gap-1.5">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#E08F6A]" />
                          Self-report and situational responses diverge. Worth exploring.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </>
      ) : (
        <div className="text-center py-8 mt-2">
          <p className="text-black/60 text-sm max-w-md mx-auto leading-relaxed">
            Your profile doesn&apos;t match a single dominant pattern. This usually means a balanced profile or a transitional phase.
          </p>
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Tab: Blind Spots
// ---------------------------------------------------------------------------

function BlindSpotsTabContent({
  mirrorGaps,
  hasMirrorData,
  imFlagged,
}: {
  mirrorGaps?: MirrorGap[]
  hasMirrorData: boolean
  imFlagged: boolean
}) {
  const significantGaps = (mirrorGaps ?? []).filter(
    (g) => g.severity === 'significant' || g.severity === 'critical'
  )

  return (
    <div className="bg-white rounded-lg p-8 md:p-10 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <h2 className="text-xl font-bold text-black mb-1">Blind Spots</h2>

      {hasMirrorData && mirrorGaps && mirrorGaps.length > 0 ? (
        <>
          <p className="text-sm text-black/50 mb-6 mt-2">
            How others see your leadership compared to how you see yourself.
          </p>

          {imFlagged && (
            <div className="bg-[#F7F3ED] rounded-lg p-5 mb-6">
              <p className="text-sm text-black/70 leading-relaxed">{IM_HANDLING.mirrorElevation}</p>
            </div>
          )}

          <MirrorDotPlot
            gaps={mirrorGaps.map((gap) => ({
              dimensionId: gap.dimensionId,
              dimensionName: getDimension(gap.dimensionId).name,
              ceoPct: gap.ceoPct,
              raterPct: gap.raterPct,
              gapLabel: gap.gapLabel,
              severity: gap.severity,
            }))}
          />

          {significantGaps.length > 0 && (
            <div className="mt-6 space-y-4">
              {significantGaps.map((gap) => {
                const def = getDimension(gap.dimensionId)
                const gapDirection = gap.ceoPct > gap.raterPct ? 'higher than your rater' : 'lower than your rater'
                const gapSize = Math.abs(Math.round(gap.ceoPct - gap.raterPct))

                return (
                  <div
                    key={gap.dimensionId}
                    className="border-l-2 pl-4 py-2"
                    style={{ borderColor: gap.severity === 'critical' ? '#E08F6A' : '#7FABC8' }}
                  >
                    <p className="text-xs font-semibold text-black/40 uppercase tracking-wider mb-1">
                      {def.name} <span className="normal-case font-normal">&mdash; {gap.gapLabel}</span>
                    </p>
                    <p className="text-sm text-black/70 leading-relaxed">
                      You rated yourself {gapSize} points {gapDirection} on {def.name}. This gap suggests that your experience of your own leadership differs meaningfully from how it lands with others.
                    </p>
                  </div>
                )
              })}
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-black/10">
            <p className="text-sm text-black/60 leading-relaxed">{BLIND_SPOT_CLOSING}</p>
          </div>
        </>
      ) : (
        <div className="text-center py-8 mt-2">
          <p className="text-black/60 text-sm max-w-md mx-auto leading-relaxed mb-6">
            Blind spot analysis requires a Mirror Check &mdash; a brief survey completed by someone who works closely with you.
          </p>
          <a
            href="/assessment/mirror"
            className="inline-block bg-black text-white px-8 py-4 rounded-lg text-base font-semibold hover:bg-black/90 transition-colors"
          >
            Invite a Trusted Colleague
          </a>
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Tab: Roadmap
// ---------------------------------------------------------------------------

function RoadmapTabContent({
  priorityDimensions,
  dimensionScores,
}: {
  priorityDimensions: DimensionId[]
  dimensionScores: DimensionScore[]
}) {
  const entries = buildRoadmapEntries(priorityDimensions, dimensionScores)
  const top3 = priorityDimensions.slice(0, 3)

  return (
    <div className="space-y-6">
      {/* Roadmap timeline */}
      <div className="bg-white rounded-lg p-8 md:p-10 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <h2 className="text-xl font-bold text-black mb-1">Your Growth Path</h2>
        <p className="text-sm text-black/50 mb-6">Your 90-day leadership growth plan</p>
        <RoadmapTimeline priorityDimensions={entries} />

        {/* First moves */}
        <div className="mt-8 space-y-6">
          <p className="text-xs font-semibold text-black/40 uppercase tracking-wider">Your First Moves</p>

          {top3.map((dimId) => {
            const def = getDimension(dimId)
            const score = dimensionScores.find((ds) => ds.dimensionId === dimId)
            const percentage = score?.percentage ?? 0
            const frameworks = getFrameworkPrescription(dimId, percentage)
            const content = DIMENSION_CONTENT[dimId]
            const primaryFramework = frameworks.length > 0 ? frameworks[0] : 'See framework list above'

            return (
              <div key={dimId} className="border border-black/10 rounded-lg p-5">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="text-base font-semibold text-black">{def.name}</h4>
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded-full text-white shrink-0 ml-3"
                    style={{ backgroundColor: TERRITORY_COLORS[def.territory] }}
                  >
                    {primaryFramework}
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-semibold text-black/50 mb-1">This week:</p>
                    <p className="text-sm text-black/70 leading-relaxed">{content.highIndicator.split('.')[0]}.</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-black/50 mb-1">Observable shift:</p>
                    <p className="text-sm text-black/70 leading-relaxed">
                      {percentage <= 40
                        ? `You will notice moments where you catch the old pattern before it completes. That noticing is the first sign of growth in ${def.name}.`
                        : percentage <= 60
                          ? `You will begin to see consistency where there was previously inconsistency. ${def.name} will shift from something you do sometimes to something others can count on.`
                          : `The shift will be subtle but others will notice: ${def.name} will move from a personal practice to something that shapes how your team operates.`}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Reassessment reminder */}
        <div className="mt-8 bg-[#F7F3ED] rounded-lg p-5 text-center">
          <p className="text-xs font-semibold text-black/40 uppercase tracking-wider mb-2">Quarterly Reassessment</p>
          <p className="text-sm text-black/60 leading-relaxed max-w-lg mx-auto">
            Retake the full assessment in 90 days to measure your progress. Meaningful shift in leadership behavior takes 8-12 weeks of deliberate practice.
          </p>
        </div>
      </div>

      {/* Closing */}
      <div className="bg-white rounded-lg p-8 md:p-10 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <h2 className="text-xl font-bold text-black mb-4">What Comes Next</h2>
        <div className="text-center py-4">
          <div className="max-w-lg mx-auto mb-8">
            {CLOSING_TEXT.split('\n\n').map((paragraph, i) => (
              <p key={i} className="text-lg text-black/70 leading-relaxed mb-4 last:mb-0">{paragraph}</p>
            ))}
          </div>
          <a
            href="/dashboard"
            className="inline-block bg-black text-white px-8 py-4 rounded-lg text-base font-semibold hover:bg-black/90 transition-colors"
          >
            Go to Plan
          </a>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Tab: Growth Plan
// ---------------------------------------------------------------------------

function GrowthPlanTabContent({
  dimensionScores,
  priorityDimensions,
}: {
  dimensionScores: DimensionScore[]
  priorityDimensions: DimensionId[]
}) {
  // Determine primary focus: quarterly focus from localStorage, or fallback to top 3 priorities
  const [focusDimensions, setFocusDimensions] = useState<DimensionId[]>([])
  const [isQuarterlyFocus, setIsQuarterlyFocus] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('aa_focus_dimensions')
      if (stored) {
        const parsed = JSON.parse(stored) as DimensionId[]
        if (Array.isArray(parsed) && parsed.length > 0) {
          setFocusDimensions(parsed.slice(0, 3))
          setIsQuarterlyFocus(true)
          return
        }
      }
    } catch {
      // ignore parse errors
    }
    setFocusDimensions(priorityDimensions.slice(0, 3))
    setIsQuarterlyFocus(false)
  }, [priorityDimensions])

  // Build primary focus cards data
  const primaryCards = focusDimensions.map(dimId => {
    const dim = getDimension(dimId)
    const score = dimensionScores.find(ds => ds.dimensionId === dimId)
    const percentage = score?.percentage ?? 0
    const verbalLabel = score?.verbalLabel ?? getVerbalLabel(percentage)
    const frameworks = getFrameworkPrescription(dimId, percentage)
    const content = DIMENSION_CONTENT[dimId]
    const costOfIgnoring = content?.costOfIgnoring ?? ''
    // Extract first sentence for "Why This Matters"
    const firstSentence = costOfIgnoring.split(/(?<=\.)\s/)[0] || costOfIgnoring

    return {
      dimensionId: dimId,
      dimensionName: dim.name,
      territory: dim.territory,
      coreQuestion: dim.coreQuestion,
      percentage,
      verbalLabel,
      firstSentence,
      frameworks: frameworks.map(fw => ({
        name: fw,
        content: getFrameworkByName(fw),
      })),
    }
  })

  // Build "Other Growth Areas" — remaining dimensions grouped by territory
  const focusSet = new Set(focusDimensions)
  const territories: Territory[] = ['leading_yourself', 'leading_teams', 'leading_organizations']
  const otherByTerritory = territories.map(t => {
    const config = TERRITORY_CONFIG[t]
    const color = TERRITORY_COLORS[t]
    const dims = dimensionScores
      .filter(ds => !focusSet.has(ds.dimensionId) && getDimension(ds.dimensionId).territory === t)
    return { territory: t, label: config.displayLabel, color, dims }
  }).filter(g => g.dims.length > 0)

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="bg-white rounded-lg p-8 md:p-10 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <h2 className="text-xl font-bold text-black mb-2">
          Your Growth Plan
        </h2>
        <p className="text-sm text-black/50 leading-relaxed max-w-lg">
          {isQuarterlyFocus
            ? 'Based on your quarterly focus — the dimensions you chose to prioritize this quarter.'
            : 'Based on your assessment priorities — the areas with the most room for growth.'}
        </p>
      </div>

      {/* Primary Focus Cards */}
      <div className="space-y-4">
        <p className="text-xs font-semibold text-black/40 uppercase tracking-wider px-1">Primary Focus</p>
        {primaryCards.map(card => {
          const color = TERRITORY_COLORS[card.territory]
          return (
            <div
              key={card.dimensionId}
              className="bg-white rounded-lg p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
              style={{ borderLeftWidth: 3, borderLeftColor: color }}
            >
              {/* Badge + score */}
              <div className="flex items-start justify-between mb-3">
                <span
                  className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: `${color}15`,
                    color,
                  }}
                >
                  {isQuarterlyFocus ? 'Quarterly Focus' : 'Priority Area'}
                </span>
                <span className="text-xs text-black/40">
                  {Math.round(card.percentage)}% — {card.verbalLabel}
                </span>
              </div>

              {/* Dimension name */}
              <h3 className="text-lg font-semibold text-black mb-1">{card.dimensionName}</h3>

              {/* Core question */}
              <p className="text-sm italic text-black/40 mb-4">{card.coreQuestion}</p>

              {/* Why this matters */}
              <div className="mb-4">
                <p className="text-xs font-semibold text-black/40 uppercase tracking-wider mb-1">Why This Matters</p>
                <p className="text-sm text-black/60 leading-relaxed">{card.firstSentence}</p>
              </div>

              {/* Prescribed frameworks */}
              {card.frameworks.length > 0 && (
                <div className="space-y-2">
                  {card.frameworks.map(fw => (
                    <div key={fw.name} className="flex items-center justify-between">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-black">{fw.name}</p>
                        {fw.content && (
                          <p className="text-xs text-black/40 truncate">{fw.content.tagline}</p>
                        )}
                      </div>
                      {fw.content ? (
                        <a
                          href={`/frameworks/${fw.content.id}`}
                          className="flex-shrink-0 ml-4 inline-flex items-center gap-1 text-xs font-medium text-black hover:text-black/70 transition-colors"
                        >
                          Learn more
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </a>
                      ) : (
                        <span className="flex-shrink-0 ml-4 text-[10px] text-black/30">Coming soon</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Other Growth Areas */}
      {otherByTerritory.length > 0 && (
        <div className="bg-white rounded-lg p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <h3 className="text-sm font-semibold text-black/40 uppercase tracking-wider mb-6">Other Growth Areas</h3>

          <div className="space-y-8">
            {otherByTerritory.map(group => (
              <div key={group.territory}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: group.color }} />
                  <h4 className="text-sm font-semibold text-black">{group.label}</h4>
                </div>

                <div className="space-y-3">
                  {group.dims.map(dim => {
                    const dimDef = getDimension(dim.dimensionId)
                    const percentage = Math.round(dim.percentage)
                    const frameworks = getFrameworkPrescription(dim.dimensionId, percentage)

                    return (
                      <div key={dim.dimensionId} className="pl-5 border-l-2" style={{ borderColor: `${group.color}30` }}>
                        <div className="flex items-center justify-between mb-1.5">
                          <p className="text-sm font-medium text-black">{dimDef.name}</p>
                          <span className="text-xs text-black/40">{percentage}% — {dim.verbalLabel}</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {frameworks.map(fw => {
                            const fwContent = getFrameworkByName(fw)
                            return fwContent ? (
                              <a
                                key={fw}
                                href={`/frameworks/${fwContent.id}`}
                                className="inline-block px-2.5 py-1 text-xs font-medium text-black bg-[#F7F3ED] rounded-full hover:bg-[#F7F3ED]/80 transition-colors"
                              >
                                {fw}
                              </a>
                            ) : (
                              <span
                                key={fw}
                                className="inline-block px-2.5 py-1 text-xs text-black/50 border border-black/10 rounded-full"
                              >
                                {fw}
                              </span>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Coaching CTA */}
      <div className="bg-white rounded-lg p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)] text-center">
        <h3 className="text-lg font-semibold text-black mb-2">Want Guided Support?</h3>
        <p className="text-sm text-black/50 mb-6 max-w-sm mx-auto">
          Work through your growth plan with Niko in a focused coaching session.
        </p>
        <a
          href="https://cal.com/nikolaskonstantin"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-black text-white px-8 py-3.5 rounded-lg text-sm font-semibold hover:bg-black/90 transition-colors"
        >
          Book a Session
        </a>
      </div>
    </div>
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
// Free User View
// ---------------------------------------------------------------------------

function FreeUserView({ userName, userId }: { userName: string; userId?: string }) {
  return (
    <AppShell>
      <div className="px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <HookResultsBanner userId={userId} />

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

            <p className="text-6xl font-bold text-black/10 -mt-[108px] mb-[52px]">?</p>

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

          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-black tracking-tight mb-3">
              Unlock your leadership profile
            </h1>
            <p className="text-base text-black/50 max-w-lg mx-auto">
              The Konstantin Method measures 15 dimensions of leadership maturity. See where you lead from, spot your blind spots, and know exactly what to work on.
            </p>
          </div>

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
              <div key={card.title} className="bg-white rounded-lg p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <h3 className="text-sm font-semibold text-black mb-1.5">{card.title}</h3>
                <p className="text-sm text-black/50 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-lg p-10 shadow-[0_1px_3px_rgba(0,0,0,0.04)] text-center">
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
// Complete Results View
// ---------------------------------------------------------------------------

function CompleteResultsView({ results }: { results: FullResults }) {
  const [activeTab, setActiveTab] = useState<ResultsTab>('overview')

  const clmi = results.session.clmi ?? 0
  const hasMirrorData = results.mirrorGaps != null && results.mirrorGaps.length > 0
  const bsi = results.bsi
  const imFlagged = results.session.imFlagged

  const tabs: { key: ResultsTab; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'deep-dive', label: 'Deep Dive' },
    { key: 'dimensions', label: 'Impact Areas' },
    { key: 'archetypes', label: 'Archetypes' },
    { key: 'blind-spots', label: 'Blind Spots' },
    { key: 'growth-plan', label: 'Growth Plan' },
    { key: 'roadmap', label: 'Growth Path' },
  ]

  return (
    <AppShell>
      <div className="print:bg-white">
        <header className="pt-12 pb-4 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-xs font-medium text-black/40 uppercase tracking-wider mb-2">CEO Lab Assessment</p>
            <h1 className="text-3xl md:text-4xl font-bold text-black">Your Leadership Report</h1>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-6 pb-20">
          <div className="flex gap-1 p-1.5 bg-black/[0.04] rounded-xl mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-3 px-4 rounded-lg text-base font-semibold transition-all ${
                  activeTab === tab.key
                    ? 'bg-white text-black shadow-sm'
                    : 'text-black/40 hover:text-black/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'overview' && (
            <ResultsHero
              clmi={clmi}
              bsi={bsi}
              hasMirrorData={hasMirrorData}
              territoryScores={results.territoryScores}
              dimensionScores={results.dimensionScores}
              imFlagged={imFlagged}
            />
          )}
          {activeTab === 'deep-dive' && (
            <DeepDiveTabContent
              dimensionScores={results.dimensionScores}
              territoryScores={results.territoryScores}
            />
          )}
          {activeTab === 'dimensions' && (
            <DimensionsTabContent
              dimensionScores={results.dimensionScores}
              priorityDimensions={results.priorityDimensions}
              imFlagged={imFlagged}
            />
          )}
          {activeTab === 'archetypes' && (
            <ArchetypesTabContent archetypes={results.archetypes} imFlagged={imFlagged} />
          )}
          {activeTab === 'blind-spots' && (
            <BlindSpotsTabContent mirrorGaps={results.mirrorGaps} hasMirrorData={hasMirrorData} imFlagged={imFlagged} />
          )}
          {activeTab === 'growth-plan' && (
            <GrowthPlanTabContent dimensionScores={results.dimensionScores} priorityDimensions={results.priorityDimensions} />
          )}
          {activeTab === 'roadmap' && (
            <RoadmapTabContent priorityDimensions={results.priorityDimensions} dimensionScores={results.dimensionScores} />
          )}
        </main>

        <style jsx global>{`
          @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            header, main { max-width: 100% !important; }
            section { break-inside: avoid; page-break-inside: avoid; }
          }
        `}</style>
      </div>
    </AppShell>
  )
}

// ---------------------------------------------------------------------------
// Main Page Component
// ---------------------------------------------------------------------------

type CeoLabState = 'loading' | 'error' | 'free' | 'baseline-pending' | 'baseline-in-progress' | 'complete'

export default function CeoLabPage() {
  const router = useRouter()
  const [pageState, setPageState] = useState<CeoLabState>('loading')
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<FullResults | null>(null)
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

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('subscription_status, full_name')
        .eq('id', user.id)
        .single()

      const name = profile?.full_name
        || user.user_metadata?.full_name
        || user.user_metadata?.name
        || user.email?.split('@')[0]
        || 'CEO'
      setUserName(name)

      const isSubscribed = profile?.subscription_status === 'active'

      if (!isSubscribed) {
        setPageState('free')
        return
      }

      // Check for completed session
      const { data: completedSession } = await supabase
        .from('assessment_sessions')
        .select('id, completed_at, stage_reached, clmi, bsi')
        .eq('ceo_id', user.id)
        .eq('version', '4.0')
        .not('completed_at', 'is', null)
        .order('completed_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (!completedSession) {
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

      // Has completed session — load full results
      const response = await fetch('/api/v4/results')

      if (!response.ok) {
        if (response.status === 401) {
          router.replace('/auth')
          return
        }
        throw new Error(`Failed to load results (${response.status})`)
      }

      const data = await response.json()
      setResults(data.results)
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
  if (pageState === 'free') return <FreeUserView userName={userName} userId={userId} />
  if (pageState === 'baseline-pending') return <BaselinePendingView userName={userName} userId={userId} />
  if (pageState === 'baseline-in-progress') return <BaselineInProgressView userName={userName} stageReached={stageReached} />
  if (pageState === 'complete' && results) return <CompleteResultsView results={results} />

  return null
}
