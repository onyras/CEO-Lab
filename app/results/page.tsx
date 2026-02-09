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

function getTeamImpact(dimensionId: string, score: number): string {
  const impacts: Record<string, Record<string, string>> = {
    'LY.1': {
      low: 'Your team is navigating around triggers you can\'t see. They\'re managing you instead of the work.',
      mid: 'Your team notices when you\'re off but doesn\'t always trust that you see it too.',
      high: 'Your team feels safe because you own your patterns openly. That gives them permission to do the same.',
    },
    'LY.2': {
      low: 'Your emotional reactions are setting the weather for the entire team. People are walking on eggshells.',
      mid: 'Your team reads your mood more than your words. Inconsistency creates hesitation.',
      high: 'Your emotional steadiness is a stabilizing force. People bring you hard things because you won\'t react badly.',
    },
    'LY.3': {
      low: 'Your reactivity is contagious — the team matches your urgency even when calm is needed.',
      mid: 'The team can feel when you\'re centered vs. when you\'re not. They perform better when you are.',
      high: 'Your calm under pressure creates a team that thinks before it reacts. That\'s compounding.',
    },
    'LY.4': {
      low: 'Without a clear sense of your zone of genius, the team doesn\'t know what only you should be doing.',
      mid: 'Your team sees your potential but also sees you spread too thin to fully realize it.',
      high: 'You\'re operating in your zone of genius and your team is building around it. Everyone knows their role.',
    },
    'LY.5': {
      low: 'Your burnout risk is visible to your team. They\'re worried about you even if they don\'t say it.',
      mid: 'Your team sees you push through when you should rest. Some are copying that pattern.',
      high: 'You model sustainable performance. Your team has permission to protect their own energy too.',
    },
    'LT.1': {
      low: 'People filter what they tell you. Bad news arrives late and surprises are the norm.',
      mid: 'Your team trusts you in easy moments but holds back when stakes are high.',
      high: 'Your team shares bad news early. That\'s saving you from surprises and compounding problems.',
    },
    'LT.2': {
      low: 'Unspoken issues are creating silent resentment. Your best people may be planning their exit.',
      mid: 'The team knows you care but wishes you\'d address things sooner and more directly.',
      high: 'People know where they stand. Tough feedback is expected, not feared. Relationships grow from it.',
    },
    'LT.3': {
      low: 'Your team brings you symptoms and you\'re solving them. The same problems keep returning.',
      mid: 'Your team respects your judgment but doesn\'t always see you dig deep enough on root causes.',
      high: 'Your team brings you the hardest puzzles because you find what others miss. That builds loyalty.',
    },
    'LT.4': {
      low: 'Your team wastes energy figuring out how to work together instead of doing the actual work.',
      mid: 'Basic rhythms exist but people still feel uncertain about expectations and priorities.',
      high: 'Your team runs like a well-tuned system. You\'ve freed everyone — including yourself — to think bigger.',
    },
    'LT.5': {
      low: 'Your team can\'t tell if you\'re the player or the coach. That ambiguity stalls their growth.',
      mid: 'Your team wants more autonomy but senses you\'re not quite ready to let go.',
      high: 'Your team feels genuinely empowered. They own their work and you own the direction.',
    },
    'LO.1': {
      low: 'Your organization makes inconsistent decisions because the strategy isn\'t clear enough to act on.',
      mid: 'People get the vision but struggle to make trade-offs without you because the "what not to do" isn\'t sharp.',
      high: 'Your team makes the same strategic decisions you would — even when you\'re not in the room.',
    },
    'LO.2': {
      low: 'Culture is happening by accident. New hires pick up habits you didn\'t intend, and values stay on the wall.',
      mid: 'People know what you value but the gap between stated culture and lived culture creates cynicism.',
      high: 'Your culture is a competitive advantage. People self-select in and out based on clear behavioral norms.',
    },
    'LO.3': {
      low: 'Your org structure creates bottlenecks and turf wars. People fight the system instead of working within it.',
      mid: 'Structure mostly works today but is already creating friction for where the company is heading.',
      high: 'Your org is built for the next stage. Teams collaborate across boundaries with minimal friction.',
    },
    'LO.4': {
      low: 'The company has outgrown your current operating style. People see it even if you don\'t — yet.',
      mid: 'You\'re evolving but legacy habits create friction. Your team needs the next version of you.',
      high: 'You\'re actively becoming what the company needs. Your team trusts that you\'ll grow with them.',
    },
    'LO.5': {
      low: 'Change either happens too abruptly or not at all. Your organization has whiplash or stagnation.',
      mid: 'You drive change but sometimes sacrifice good things in the process. The team feels the cost.',
      high: 'Change lands smoothly because you protect what works while building what\'s next. People trust the process.',
    },
  }
  const dimImpacts = impacts[dimensionId]
  if (!dimImpacts) return ''
  if (score < 40) return dimImpacts.low
  if (score < 65) return dimImpacts.mid
  return dimImpacts.high
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

function ErrorState({ message }: { message: string }) {
  return (
    <AppShell>
      <div className="flex items-center justify-center px-6 min-h-[80vh]">
        <div className="bg-white rounded-lg p-10 max-w-md w-full text-center shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
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
  imFlagged,
}: {
  clmi: number
  bsi?: number
  hasMirrorData: boolean
  territoryScores: TerritoryScore[]
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

  return (
    <div className="bg-white rounded-lg p-8 md:p-10 shadow-[0_1px_3px_rgba(0,0,0,0.04)] mb-6">
      <div className="flex flex-col items-center text-center">
        {/* CLMI ScoreRing */}
        <ScoreRing
          value={clmi}
          size={160}
          strokeWidth={10}
          color="#000"
          label={label}
        />

        {/* 3 territory rings */}
        <div className="flex justify-center gap-6 mt-6 mb-6">
          {territoryScores.map((ts) => (
            <ScoreRing
              key={ts.territory}
              value={ts.score}
              size={64}
              strokeWidth={4}
              color={TERRITORY_COLORS[ts.territory]}
              label={TERRITORY_CONFIG[ts.territory].displayLabel}
            />
          ))}
        </div>

        {/* Interpretation text */}
        <p className="text-base text-black/60 max-w-xl mx-auto leading-relaxed">
          {headlineText}
        </p>

        {/* BSI */}
        {hasMirrorData && bsi != null && (
          <p className="text-sm text-black/50 mt-3 max-w-xl mx-auto">
            {buildBsiHeadlineText(bsi)}
          </p>
        )}

        {/* IM advisory */}
        {imFlagged && (
          <div className="mt-4 bg-[#F7F3ED] rounded-lg p-4 max-w-xl text-left">
            <p className="text-xs font-semibold text-black/40 uppercase tracking-wider mb-1">
              A Note on Your Responses
            </p>
            <p className="text-sm text-black/70 leading-relaxed">
              {IM_HANDLING.headlineAdvisory}
            </p>
          </div>
        )}
      </div>
    </div>
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
  const [expanded, setExpanded] = useState<DimensionId | null>(null)

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
                const isExpanded = expanded === dim.dimensionId
                const score = dim.score
                const priority = priorities[dim.dimensionId]
                const insight = getScoreInsight(dim.dimensionId, score)
                const teamImpact = getTeamImpact(dim.dimensionId, score)

                return (
                  <div key={dim.dimensionId}>
                    <button
                      onClick={() => setExpanded(isExpanded ? null : dim.dimensionId)}
                      className="w-full p-4 rounded-xl hover:bg-[#F7F3ED]/50 transition-colors text-left"
                    >
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
                          <svg
                            className={`w-4 h-4 text-black/25 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                          </svg>
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

                      {/* Score insight — always visible */}
                      <p className="text-xs text-black/50 leading-relaxed">
                        {insight}
                      </p>
                    </button>

                    {/* Expanded: team impact */}
                    {isExpanded && (
                      <div className="mx-4 mb-3 pl-4 border-l-2 py-3 space-y-3" style={{ borderColor: color }}>
                        {teamImpact && (
                          <div className="bg-[#F7F3ED] rounded-lg p-3">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-black/40 mb-1">
                              Impact on your team
                            </p>
                            <p className="text-xs text-black/70 leading-relaxed">
                              {teamImpact}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
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
            setError('No assessment results found. Complete the assessment first to view your results.')
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
    return (
      <ErrorState
        message={error ?? 'No assessment results found. Complete the assessment first to view your results.'}
      />
    )
  }

  const clmi = results.session.clmi ?? 0
  const hasMirrorData = results.mirrorGaps != null && results.mirrorGaps.length > 0
  const bsi = results.bsi
  const imFlagged = results.session.imFlagged

  const tabs: { key: ResultsTab; label: string }[] = [
    { key: 'deep-dive', label: 'Deep Dive' },
    { key: 'dimensions', label: 'Dimensions' },
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
