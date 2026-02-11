// CEO Lab V4 — Scoring Engine
// Source: CEO_LAB_SCORING_ENGINE_V4.md (Developer Handoff)
// All formulas, archetype detection, BSI, response timing, framework prescriptions

import type {
  DimensionId,
  DimensionScore,
  TerritoryScore,
  Territory,
  ArchetypeMatch,
  MirrorGap,
  VerbalLabel,
  SjiBehavioralTag,
  ItemResponse,
  Stage,
  ResponseTimeFlag,
} from '@/types/assessment'

import {
  DIMENSIONS,
  REVERSE_SCORED_ITEMS,
  VERBAL_LABELS,
  BSI_LABELS,
  ARCHETYPE_SIGNATURES,
  FRAMEWORK_PRESCRIPTIONS,
  TERRITORY_CONFIG,
} from './constants'

// ─── 1. Item-Level Scoring ──────────────────────────────────────────

/**
 * Score a behavioral item. Forward: raw. Reverse: 6 - raw.
 * Scoring Engine v4.0 Section 2.1
 */
export function scoreItem(rawResponse: number, scoringDirection: 'forward' | 'reverse'): number {
  return scoringDirection === 'reverse' ? 6 - rawResponse : rawResponse
}

/**
 * Scale an SJI maturity score (1-4) to 1.0-5.0.
 * Formula: (raw - 1) * 1.333 + 1
 * Scoring Engine v4.0 Section 2.2
 */
export function scoreSjiItem(rawMaturityScore: number): number {
  return (rawMaturityScore - 1) * 1.333 + 1
}

/**
 * Score an IM item. Returns 1 if implausibly positive (>= 4), 0 otherwise.
 * Scoring Engine v4.0 Section 2.3
 */
export function scoreImItem(rawResponse: number): number {
  return rawResponse >= 4 ? 1 : 0
}

// ─── 2. Dimension-Level Scoring ─────────────────────────────────────

/**
 * Calculate a single dimension's composite score.
 * Composite = 0.70 * behavioral_mean + 0.30 * sji_scaled
 * If SJI missing: composite = behavioral_mean, confidence = "partial"
 * Scoring Engine v4.0 Sections 3.1-3.4
 */
export function calculateDimensionScore(
  behavioralScoredValues: number[],
  sjiScaled?: number,
  dimensionId?: DimensionId
): DimensionScore {
  // Behavioral mean: handle missing items
  const validValues = behavioralScoredValues.filter(v => v != null && !isNaN(v))
  const answeredCount = validValues.length

  let behavioralMean: number
  if (answeredCount === 0) {
    behavioralMean = 0
  } else if (answeredCount < 3) {
    // < 3 items: mark incomplete, still compute what we can
    behavioralMean = validValues.reduce((a, b) => a + b, 0) / answeredCount
  } else {
    behavioralMean = validValues.reduce((a, b) => a + b, 0) / answeredCount
  }

  // Composite: 70/30 blend if SJI available
  let composite: number
  let confidence: 'full' | 'partial' | 'preliminary'

  if (sjiScaled != null) {
    composite = 0.70 * behavioralMean + 0.30 * sjiScaled
    confidence = answeredCount >= 5 ? 'full' : answeredCount >= 3 ? 'partial' : 'preliminary'
  } else {
    composite = behavioralMean
    confidence = answeredCount >= 3 ? 'partial' : 'preliminary'
  }

  // Percentage: (composite - 1) / 4 * 100
  const percentage = Math.max(0, Math.min(100, ((composite - 1) / 4) * 100))

  return {
    dimensionId: dimensionId ?? 'LY.1',
    behavioralMean: round(behavioralMean, 3),
    sjiScaled: sjiScaled != null ? round(sjiScaled, 3) : undefined,
    composite: round(composite, 3),
    percentage: round(percentage, 2),
    verbalLabel: getVerbalLabel(percentage),
    confidence,
  }
}

// ─── 3. Aggregate Scoring ───────────────────────────────────────────

/**
 * Calculate territory score from its 5 dimension scores.
 * Territory score = mean of 5 dimension percentages.
 * Scoring Engine v4.0 Section 4.1
 */
export function calculateTerritoryScore(
  territory: Territory,
  dimensionScores: DimensionScore[]
): TerritoryScore {
  const percentages = dimensionScores.map(d => d.percentage)
  const score = percentages.length > 0
    ? percentages.reduce((a, b) => a + b, 0) / percentages.length
    : 0

  return {
    territory,
    score: round(score, 2),
    verbalLabel: getVerbalLabel(score),
    dimensions: dimensionScores,
  }
}

/**
 * Calculate CLMI = mean of 3 territory scores.
 * Scoring Engine v4.0 Section 4.2
 */
export function calculateCLMI(territoryScores: TerritoryScore[]): number {
  const scores = territoryScores.map(t => t.score)
  if (scores.length === 0) return 0
  return round(scores.reduce((a, b) => a + b, 0) / scores.length, 2)
}

/**
 * Calculate IM total and flagged status.
 * Total = sum of binary flags (0 or 1) for each IM item.
 * Flagged = total >= 4.
 * Scoring Engine v4.0 Section 4.3
 */
export function calculateIM(imResponses: number[]): { total: number; flagged: boolean } {
  const points = imResponses.map(r => scoreImItem(r))
  const total = points.reduce((a, b) => a + b, 0)
  return { total, flagged: total >= 4 }
}

// ─── 4. Archetype Detection ─────────────────────────────────────────

/**
 * Detect matching archetypes from dimension scores.
 * Scoring Engine v4.0 Section 6
 */
export function detectArchetypes(
  dimensionScores: DimensionScore[],
  imFlagged: boolean,
  sjiTags?: SjiBehavioralTag[],
  mirrorGaps?: MirrorGap[]
): ArchetypeMatch[] {
  const scoreMap = new Map<DimensionId, number>()
  for (const ds of dimensionScores) {
    scoreMap.set(ds.dimensionId, ds.percentage)
  }

  const matches: ArchetypeMatch[] = []
  let displayRank = 1

  // Step 1: Polished Performer check
  if (imFlagged) {
    matches.push({
      name: 'Polished Performer',
      matchType: 'full',
      signatureStrength: 100,
      sjiConfirmed: undefined,
      mirrorAmplified: undefined,
      displayRank: displayRank++,
    })
  }

  // Step 2 + 3: Check all standard archetypes
  for (const sig of ARCHETYPE_SIGNATURES) {
    if (sig.detection === 'im_flag') continue // Already handled

    const highScores = sig.high.map(d => scoreMap.get(d) ?? 50)
    const lowScores = sig.low.map(d => scoreMap.get(d) ?? 50)

    const highMet = sig.high.filter(d => (scoreMap.get(d) ?? 50) >= 70)
    const lowMet = sig.low.filter(d => (scoreMap.get(d) ?? 50) <= 40)

    const allHighMet = highMet.length === sig.high.length
    const allLowMet = lowMet.length === sig.low.length

    if (allHighMet && allLowMet && sig.high.length > 0) {
      // Full match
      const meanHigh = mean(highScores)
      const meanLow = mean(lowScores)
      const strength = meanHigh - meanLow

      matches.push({
        name: sig.name,
        matchType: 'full',
        signatureStrength: round(strength, 2),
        displayRank: 0, // assigned after sorting
      })
    } else {
      // Partial match check
      const minLow = Math.min(2, sig.low.length)
      if (highMet.length >= 2 && lowMet.length >= minLow) {
        const qualifyingHighScores = highMet.map(d => scoreMap.get(d) ?? 50)
        const qualifyingLowScores = lowMet.map(d => scoreMap.get(d) ?? 50)
        const strength = mean(qualifyingHighScores) - mean(qualifyingLowScores)

        matches.push({
          name: sig.name,
          matchType: 'partial',
          signatureStrength: round(strength, 2),
          displayRank: 0,
        })
      }
    }
  }

  // Step 4: Sort — Polished Performer first, then full > partial, then by strength
  const polished = matches.filter(m => m.name === 'Polished Performer')
  const rest = matches
    .filter(m => m.name !== 'Polished Performer')
    .sort((a, b) => {
      if (a.matchType !== b.matchType) {
        return a.matchType === 'full' ? -1 : 1
      }
      return b.signatureStrength - a.signatureStrength
    })

  const sorted = [...polished, ...rest]

  // Assign display ranks and cap at 3
  const result = sorted.slice(0, 3).map((m, i) => ({
    ...m,
    displayRank: i + 1,
  }))

  // SJI tendency cross-reference
  if (sjiTags && sjiTags.length > 0) {
    const tendencyCounts: Record<SjiBehavioralTag, number> = {
      Controller: 0,
      Avoider: 0,
      Rescuer: 0,
      Facilitator: 0,
    }
    for (const tag of sjiTags) {
      tendencyCounts[tag]++
    }
    const dominantTendency = (Object.entries(tendencyCounts) as [SjiBehavioralTag, number][])
      .sort((a, b) => b[1] - a[1])[0][0]

    for (const match of result) {
      const sig = ARCHETYPE_SIGNATURES.find(s => s.name === match.name)
      if (sig?.expectedSjiTendency) {
        match.sjiConfirmed = sig.expectedSjiTendency.includes(dominantTendency)
      }
    }
  }

  // Mirror amplification
  if (mirrorGaps && mirrorGaps.length > 0) {
    const gapMap = new Map<DimensionId, number>()
    for (const gap of mirrorGaps) {
      gapMap.set(gap.dimensionId, gap.gapPct)
    }

    for (const match of result) {
      const sig = ARCHETYPE_SIGNATURES.find(s => s.name === match.name)
      if (!sig || sig.detection === 'im_flag') continue

      let alignmentCount = 0
      let contradictionCount = 0

      for (const lowDim of sig.low) {
        const gap = gapMap.get(lowDim)
        if (gap != null) {
          if (gap > 0) alignmentCount++ // CEO higher than rater = confirms blind spot
          if (gap < 0) contradictionCount++
        }
      }

      if (alignmentCount > contradictionCount) {
        match.mirrorAmplified = 'high'
      } else if (contradictionCount > alignmentCount) {
        match.mirrorAmplified = 'flag_for_review'
      } else {
        match.mirrorAmplified = 'neutral'
      }
    }
  }

  return result
}

// ─── 5. Priority Dimensions ─────────────────────────────────────────

/**
 * Select 3-5 priority dimensions for deep dive.
 * Scoring Engine v4.0 Section 7
 */
export function selectPriorityDimensions(
  dimensionScores: DimensionScore[],
  mirrorGaps?: MirrorGap[]
): DimensionId[] {
  const sorted = [...dimensionScores].sort((a, b) => a.percentage - b.percentage)
  const priorities: DimensionId[] = []

  // Step 1: All dimensions <= 40% (max 3, lowest first)
  for (const ds of sorted) {
    if (ds.percentage <= 40 && priorities.length < 3) {
      priorities.push(ds.dimensionId)
    }
  }

  // Step 2: Fill to 3 with next lowest
  for (const ds of sorted) {
    if (priorities.length >= 3) break
    if (!priorities.includes(ds.dimensionId)) {
      priorities.push(ds.dimensionId)
    }
  }

  // Step 3: Mirror gaps — add dimensions with |gap| >= 1.0 raw (= 25% on 0-100 scale)
  if (mirrorGaps && mirrorGaps.length > 0) {
    const gapDims = mirrorGaps
      .filter(g => Math.abs(g.gapPct) >= 25) // |gap| >= 1.0 on raw scale ≈ 25 percentage points
      .sort((a, b) => Math.abs(b.gapPct) - Math.abs(a.gapPct))
      .map(g => g.dimensionId)

    for (const dim of gapDims) {
      if (priorities.length >= 5) break
      if (!priorities.includes(dim)) {
        priorities.push(dim)
      }
    }
  } else {
    // Step 4: No mirror, fill to max 5 with next lowest
    for (const ds of sorted) {
      if (priorities.length >= 5) break
      if (!priorities.includes(ds.dimensionId)) {
        priorities.push(ds.dimensionId)
      }
    }
  }

  return priorities.slice(0, 5)
}

// ─── 6. Mirror / BSI ───────────────────────────────────────────────

/**
 * Calculate Blind Spot Index. Mean of absolute gaps across all dimensions.
 * Scoring Engine v4.0 Section 5.4
 */
export function calculateBSI(
  ceoPercentages: Map<DimensionId, number>,
  raterPercentages: Map<DimensionId, number>
): number {
  const gaps: number[] = []
  for (const dim of DIMENSIONS) {
    const ceoPct = ceoPercentages.get(dim.id)
    const raterPct = raterPercentages.get(dim.id)
    if (ceoPct != null && raterPct != null) {
      gaps.push(Math.abs(ceoPct - raterPct))
    }
  }
  return gaps.length > 0 ? round(mean(gaps), 1) : 0
}

/**
 * Calculate Directional BSI. Mean of signed gaps.
 * Positive = CEO over-estimates. Negative = CEO under-estimates.
 * Scoring Engine v4.0 Section 5.4
 */
export function calculateDirectionalBSI(
  ceoPercentages: Map<DimensionId, number>,
  raterPercentages: Map<DimensionId, number>
): number {
  const signedGaps: number[] = []
  for (const dim of DIMENSIONS) {
    const ceoPct = ceoPercentages.get(dim.id)
    const raterPct = raterPercentages.get(dim.id)
    if (ceoPct != null && raterPct != null) {
      signedGaps.push(ceoPct - raterPct)
    }
  }
  return signedGaps.length > 0 ? round(mean(signedGaps), 1) : 0
}

/**
 * Classify the gap between CEO composite and rater raw score.
 * Uses raw scale (1-5) gap for classification.
 * Scoring Engine v4.0 Section 5.2
 */
export function classifyMirrorGap(
  ceoComposite: number,
  raterRaw: number
): MirrorGap & { dimensionId: DimensionId } {
  const ceoPct = ((ceoComposite - 1) / 4) * 100
  const raterPct = ((raterRaw - 1) / 4) * 100
  const gapPct = ceoPct - raterPct
  const gapRaw = ceoComposite - raterRaw

  let gapLabel: string
  let severity: MirrorGap['severity']

  const absGap = Math.abs(gapRaw)

  if (absGap <= 0.5) {
    gapLabel = 'Aligned'
    severity = 'aligned'
  } else if (absGap <= 1.0) {
    gapLabel = gapRaw > 0 ? 'Mild blind spot' : 'Possible under-confidence'
    severity = 'mild'
  } else if (absGap <= 1.5) {
    gapLabel = gapRaw > 0 ? 'Significant blind spot' : 'Notable under-confidence'
    severity = 'significant'
  } else {
    gapLabel = gapRaw > 0 ? 'Critical blind spot' : 'Strong under-confidence'
    severity = 'critical'
  }

  return {
    dimensionId: 'LY.1', // Caller sets this
    ceoPct: round(ceoPct, 2),
    raterPct: round(raterPct, 2),
    gapPct: round(gapPct, 2),
    gapLabel,
    severity,
  }
}

// ─── 7. Hook Assessment ─────────────────────────────────────────────

/**
 * Calculate hook assessment scores.
 * Territory score = (mean_raw - 1) / 4 * 100
 * Sharpest = item furthest from midpoint (2.5 for 1-4 scale).
 * Scoring Engine v4.0 Section 9
 */
export function calculateHookScores(
  responses: { itemId: string; dimensions: DimensionId[]; territory: Territory; value: number }[]
): {
  lyScore: number
  ltScore: number
  loScore: number
  sharpestDimension: DimensionId
} {
  const byTerritory: Record<Territory, number[]> = {
    leading_yourself: [],
    leading_teams: [],
    leading_organizations: [],
  }

  for (const r of responses) {
    byTerritory[r.territory].push(r.value)
  }

  const calcPct = (values: number[]) => {
    if (values.length === 0) return 0
    const m = values.reduce((a, b) => a + b, 0) / values.length
    return round(((m - 1) / 3) * 100, 2) // Hook uses 1-4 scale, so divide by 3
  }

  // Sharpest insight: item with largest distance from midpoint (2.5 on 1-4 scale)
  let maxDistance = 0
  let sharpestDimension: DimensionId = 'LY.1'
  for (const r of responses) {
    const distance = Math.abs(r.value - 2.5)
    if (distance > maxDistance) {
      maxDistance = distance
      sharpestDimension = r.dimensions[0]
    }
  }

  return {
    lyScore: calcPct(byTerritory.leading_yourself),
    ltScore: calcPct(byTerritory.leading_teams),
    loScore: calcPct(byTerritory.leading_organizations),
    sharpestDimension,
  }
}

// ─── 8. Weekly Pulse ────────────────────────────────────────────────

/**
 * Calculate trend velocity from weekly scores.
 * Requires >= 8 data points. Compares first half vs second half means.
 * Scoring Engine v4.0 Section 10
 */
export function calculateWeeklyTrend(
  scores: number[]
): 'improving' | 'stable' | 'declining' | 'insufficient_data' {
  if (scores.length < 8) return 'insufficient_data'

  const midpoint = Math.floor(scores.length / 2)
  const firstHalf = scores.slice(0, midpoint)
  const secondHalf = scores.slice(midpoint)

  const firstMean = mean(firstHalf)
  const secondMean = mean(secondHalf)
  const delta = secondMean - firstMean

  if (delta >= 0.5) return 'improving'
  if (delta <= -0.5) return 'declining'
  return 'stable'
}

// ─── 9. Labels & Prescriptions ──────────────────────────────────────

/**
 * Get verbal label for a percentage score.
 * Scoring Engine v4.0 Section 3.4
 */
export function getVerbalLabel(percentage: number): VerbalLabel {
  for (const { max, label } of VERBAL_LABELS) {
    if (percentage <= max) return label
  }
  return 'Mastered'
}

/**
 * Get BSI interpretation label.
 */
export function getBsiLabel(bsi: number): string {
  for (const { max, label } of BSI_LABELS) {
    if (bsi <= max) return label
  }
  return 'Significant self-perception gap'
}

/**
 * Get framework prescriptions for a dimension at a given score.
 * Scoring Engine v4.0 Section 8
 */
export function getFrameworkPrescription(
  dimensionId: DimensionId,
  percentage: number
): string[] {
  const prescriptions = FRAMEWORK_PRESCRIPTIONS[dimensionId]
  if (!prescriptions) return []

  if (percentage <= 40) return prescriptions.critical
  if (percentage <= 70) return prescriptions.developing
  return prescriptions.strong
}

// ─── 10. Response Time Quality Flags ────────────────────────────────

/**
 * Flag response time anomalies.
 * Scoring Engine v4.0 Section 12
 */
export function flagResponseTimes(
  itemResponses: { itemId: string; responseTimeMs: number }[],
  stageTimes: Record<number, number>, // stage → elapsed seconds
  totalTimeSeconds: number
): ResponseTimeFlag[] {
  const flags: ResponseTimeFlag[] = []

  // Item-level flags
  for (const item of itemResponses) {
    if (item.responseTimeMs < 2000) {
      flags.push({
        flagType: 'item_too_fast',
        itemId: item.itemId,
        valueMs: item.responseTimeMs,
      })
    }
    if (item.responseTimeMs > 120000) {
      flags.push({
        flagType: 'item_too_slow',
        itemId: item.itemId,
        valueMs: item.responseTimeMs,
      })
    }
  }

  // Stage-level flags
  const expectedMin: Record<number, number> = { 1: 8, 2: 10, 3: 8 } // minutes
  const expectedMax: Record<number, number> = { 1: 25, 2: 30, 3: 25 }

  for (const [stageStr, elapsed] of Object.entries(stageTimes)) {
    const stage = Number(stageStr) as Stage
    if (elapsed < (expectedMin[stage] ?? 8) * 60) {
      flags.push({
        flagType: 'stage_rushed',
        valueMs: elapsed * 1000,
        stage,
      })
    }
    if (elapsed > (expectedMax[stage] ?? 25) * 60) {
      flags.push({
        flagType: 'stage_slow',
        valueMs: elapsed * 1000,
        stage,
      })
    }
  }

  // Total assessment flags
  if (totalTimeSeconds < 600) {
    flags.push({
      flagType: 'assessment_rushed',
      valueMs: totalTimeSeconds * 1000,
    })
  }
  if (totalTimeSeconds > 7200) {
    flags.push({
      flagType: 'assessment_extended',
      valueMs: totalTimeSeconds * 1000,
    })
  }

  return flags
}

// ─── Utilities ──────────────────────────────────────────────────────

function mean(values: number[]): number {
  if (values.length === 0) return 0
  return values.reduce((a, b) => a + b, 0) / values.length
}

function round(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals)
  return Math.round(value * factor) / factor
}
