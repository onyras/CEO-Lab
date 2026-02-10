'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import { TERRITORY_CONFIG, getDimension } from '@/lib/constants'
import { getFrameworkPrescription, getVerbalLabel } from '@/lib/scoring'
import {
  buildHeadlineText,
  buildBsiHeadlineText,
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

type ResultsTab = 'deep-dive' | 'dimensions' | 'archetypes' | 'blind-spots' | 'roadmap'

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

function ErrorState({ message, noResults }: { message: string; noResults?: boolean }) {
  return (
    <AppShell>
      <div className="flex items-center justify-center px-6 min-h-[80vh]">
        <div className="bg-white rounded-lg p-10 max-w-md w-full text-center shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          {noResults ? (
            <>
              <h2 className="text-xl font-bold text-black mb-3">
                No Results Yet
              </h2>
              <p className="text-sm text-black/60 mb-6 leading-relaxed">
                Complete the full CEO Leadership Assessment to unlock your detailed leadership report across 15 dimensions.
              </p>
              <div className="flex flex-col gap-3">
                <a
                  href="/api/checkout"
                  className="inline-block bg-black text-white px-8 py-4 rounded-lg text-base font-semibold hover:bg-black/90 transition-colors"
                >
                  Subscribe — &euro;100/month
                </a>
                <a
                  href="/dashboard"
                  className="text-sm text-black/40 hover:text-black/70 transition-colors"
                >
                  Return to Dashboard
                </a>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold text-black mb-3">
                Unable to Load Results
              </h2>
              <p className="text-sm text-black/60 mb-6 leading-relaxed">{message}</p>
              <a
                href="/dashboard"
                className="inline-block bg-black text-white px-8 py-4 rounded-lg text-base font-semibold hover:bg-black/90 transition-colors"
              >
                Return to Dashboard
              </a>
            </>
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

      {/* Leadership Profile — Radar Chart */}
      <div className="bg-white rounded-lg p-8 md:p-10 shadow-[0_1px_3px_rgba(0,0,0,0.04)] mb-6">
        <h2 className="text-xl font-bold text-black mb-1">Leadership Profile</h2>
        <p className="text-sm text-black/50 mb-4">Your shape across 15 dimensions</p>
        <div className="w-full flex justify-center">
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
      {/* Three Territories overview */}
      <div className="bg-white rounded-lg p-8 md:p-10 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <h2 className="text-xl font-bold text-black mb-1">Three Territories</h2>
        <p className="text-sm text-black/50 mb-6">Your leadership profile across three domains</p>
        <TerritoryBars
          territories={territoryScores.map((ts) => ({
            territory: ts.territory,
            score: Math.round(ts.score),
            verbalLabel: ts.verbalLabel,
          }))}
        />
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          {territoryScores.map((ts) => {
            const config = TERRITORY_CONFIG[ts.territory]
            const narrative = getTerritoryArcNarrative(ts.territory, ts.score)
            return (
              <div key={ts.territory} className="py-4 px-5 rounded-lg bg-[#F7F3ED]">
                <p className="text-xs font-semibold tracking-wider uppercase mb-2" style={{ color: TERRITORY_COLORS[ts.territory] }}>
                  {config.displayLabel}
                </p>
                <p className="text-sm text-black/70 leading-relaxed">{narrative}</p>
              </div>
            )
          })}
        </div>
      </div>

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
  territoryScores,
  imFlagged,
}: {
  dimensionScores: DimensionScore[]
  priorityDimensions: DimensionId[]
  territoryScores: TerritoryScore[]
  imFlagged: boolean
}) {
  return (
    <div className="space-y-6">
      {/* Territory Bars */}
      <div className="bg-white rounded-lg p-8 md:p-10 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <h2 className="text-xl font-bold text-black mb-1">Three Territories</h2>
        <p className="text-sm text-black/50 mb-6">Your leadership profile across three domains</p>
        <TerritoryBars
          territories={territoryScores.map((ts) => ({
            territory: ts.territory,
            score: Math.round(ts.score),
            verbalLabel: ts.verbalLabel,
          }))}
        />

        {/* Arc narratives */}
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          {territoryScores.map((ts) => {
            const config = TERRITORY_CONFIG[ts.territory]
            const narrative = getTerritoryArcNarrative(ts.territory, ts.score)
            return (
              <div key={ts.territory} className="py-4 px-5 rounded-lg bg-[#F7F3ED]">
                <p className="text-xs font-semibold tracking-wider uppercase mb-2" style={{ color: TERRITORY_COLORS[ts.territory] }}>
                  {config.displayLabel}
                </p>
                <p className="text-sm text-black/70 leading-relaxed">{narrative}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* 15 Dimensions Heatmap */}
      <div className="bg-white rounded-lg p-8 md:p-10 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <h2 className="text-xl font-bold text-black mb-1">15 Dimensions</h2>
        <p className="text-sm text-black/50 mb-6">All dimensions color-coded by your score range</p>
        <DimensionHeatmap dimensions={buildHeatmapData(dimensionScores)} />
      </div>

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
        <h2 className="text-xl font-bold text-black mb-1">Development Roadmap</h2>
        <p className="text-sm text-black/50 mb-6">Your 90-day plan based on priority dimensions</p>
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
            Go to Dashboard
          </a>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main Page Component
// ---------------------------------------------------------------------------

export default function ResultsPage() {
  const router = useRouter()
  const [results, setResults] = useState<FullResults | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<ResultsTab>('deep-dive')

  useEffect(() => {
    async function loadResults() {
      try {
        const supabase = createClient()
        const { data: { session } } = await supabase.auth.getSession()

        if (!session) {
          router.replace('/auth')
          return
        }

        const response = await fetch('/api/v4/results')

        if (!response.ok) {
          if (response.status === 401) {
            router.replace('/auth')
            return
          }
          if (response.status === 404) {
            setError('no-results')
            setLoading(false)
            return
          }
          throw new Error(`Failed to load results (${response.status})`)
        }

        const data = await response.json()
        setResults(data.results)
      } catch (err) {
        console.error('Error loading results:', err)
        setError('Something went wrong while loading your results. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    loadResults()
  }, [router])

  if (loading) return <LoadingSkeleton />

  if (error || !results) {
    const isNoResults = error === 'no-results' || !results
    return (
      <ErrorState
        message={error && error !== 'no-results' ? error : 'Something went wrong while loading your results.'}
        noResults={isNoResults}
      />
    )
  }

  const clmi = results.session.clmi ?? 0
  const hasMirrorData = results.mirrorGaps != null && results.mirrorGaps.length > 0
  const bsi = results.bsi
  const imFlagged = results.session.imFlagged

  const tabs: { key: ResultsTab; label: string }[] = [
    { key: 'deep-dive', label: 'Deep Dive' },
    { key: 'dimensions', label: 'Impact Areas' },
    { key: 'archetypes', label: 'Archetypes' },
    { key: 'blind-spots', label: 'Blind Spots' },
    { key: 'roadmap', label: 'Roadmap' },
  ]

  return (
    <AppShell>
      <div className="print:bg-white">
        {/* Page header */}
        <header className="pt-12 pb-4 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-xs font-medium text-black/40 uppercase tracking-wider mb-2">CEO Lab Assessment</p>
            <h1 className="text-3xl md:text-4xl font-bold text-black">Your Leadership Report</h1>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-6 pb-20">
          {/* Hero (always visible) */}
          <ResultsHero
            clmi={clmi}
            bsi={bsi}
            hasMirrorData={hasMirrorData}
            territoryScores={results.territoryScores}
            dimensionScores={results.dimensionScores}
            imFlagged={imFlagged}
          />

          {/* Tab bar */}
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

          {/* Tab content */}
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
              territoryScores={results.territoryScores}
              imFlagged={imFlagged}
            />
          )}
          {activeTab === 'archetypes' && (
            <ArchetypesTabContent archetypes={results.archetypes} imFlagged={imFlagged} />
          )}
          {activeTab === 'blind-spots' && (
            <BlindSpotsTabContent mirrorGaps={results.mirrorGaps} hasMirrorData={hasMirrorData} imFlagged={imFlagged} />
          )}
          {activeTab === 'roadmap' && (
            <RoadmapTabContent priorityDimensions={results.priorityDimensions} dimensionScores={results.dimensionScores} />
          )}
        </main>

        {/* Print styles */}
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
