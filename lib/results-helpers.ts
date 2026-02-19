// Results page helper functions extracted from results/page.tsx

import { getDimension } from '@/lib/constants'
import { getFrameworkPrescription, getVerbalLabel } from '@/lib/scoring'
import type { DimensionScore, DimensionId } from '@/types/assessment'
import { DIMENSION_BENCHMARKS, getBenchmarkContext } from '@/lib/benchmarks'

// ---------------------------------------------------------------------------
// Heatmap data builder
// ---------------------------------------------------------------------------

export function buildHeatmapData(dimensionScores: DimensionScore[]) {
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

// ---------------------------------------------------------------------------
// Roadmap entries builder
// ---------------------------------------------------------------------------

export function buildRoadmapEntries(
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
// Priority badges
// ---------------------------------------------------------------------------

export type DimPriority = 'strength' | 'growth' | 'quick-win' | null

export function getDimPriorities(scores: { dimensionId: string; score: number }[]): Record<string, DimPriority> {
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

export function getQuarterlyProjection(currentScore: number) {
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

export const PRIORITY_CONFIG = {
  strength: { label: 'Strength', color: 'bg-[#A6BEA4]/15 text-[#6B8E6B]' },
  growth: { label: 'Growth Area', color: 'bg-[#E08F6A]/15 text-[#C0714E]' },
  'quick-win': { label: 'Near Breakthrough', color: 'bg-[#7FABC8]/15 text-[#5B8DAD]' },
}

// ---------------------------------------------------------------------------
// Score insights per dimension
// ---------------------------------------------------------------------------

export function getScoreInsight(dimensionId: string, score: number): string {
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
