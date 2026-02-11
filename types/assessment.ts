// CEO Lab Assessment V4 Types
// Aligned to the Konstantin Method — 15 dimensions, 3 territories

// ─── Enums & Literal Types ──────────────────────────────────────

export type Territory = 'leading_yourself' | 'leading_teams' | 'leading_organizations'

export type DimensionId =
  | 'LY.1' | 'LY.2' | 'LY.3' | 'LY.4' | 'LY.5'
  | 'LT.1' | 'LT.2' | 'LT.3' | 'LT.4' | 'LT.5'
  | 'LO.1' | 'LO.2' | 'LO.3' | 'LO.4' | 'LO.5'

export type ItemType = 'behavioral' | 'sji' | 'im' | 'mirror' | 'weekly' | 'hook'

export type ScoringDirection = 'forward' | 'reverse'

export type ScaleType = 'frequency' | 'degree' | 'confidence' | 'custom'

export type SjiBehavioralTag = 'Controller' | 'Avoider' | 'Rescuer' | 'Facilitator'

export type VerbalLabel = 'Reactive' | 'Awakening' | 'Practicing' | 'Consistent' | 'Mastered'

export type MatchType = 'full' | 'partial'

export type Stage = 1 | 2 | 3

export type Form = 'A' | 'B'

// ─── Item Interfaces ─────────────────────────────────────────────

export interface BehavioralItem {
  id: string                    // e.g. 'B01'
  dimensionId: DimensionId
  text: string
  scoringDirection: ScoringDirection
  scaleType: ScaleType
  stage: Stage
  customScale?: string[]        // 5 labels for custom scales
}

export interface SjiOption {
  text: string
  maturityScore: 1 | 2 | 3 | 4
  behavioralTag: SjiBehavioralTag
}

export interface SjiItem {
  id: string                    // e.g. 'SJ01'
  dimensionId: DimensionId
  scenario: string
  options: [SjiOption, SjiOption, SjiOption, SjiOption]
}

export interface ImItem {
  id: string                    // e.g. 'IM01'
  text: string
}

export interface MirrorItem {
  id: string                    // e.g. 'M01'
  dimensionId: DimensionId
  text: string
  scaleType: ScaleType
}

export interface WeeklyItem {
  id: string                    // e.g. 'W01'
  dimensionId: DimensionId
  text: string
  responseFormat: string
}

export interface HookOption {
  text: string
  value: 1 | 2 | 3 | 4
}

export interface HookItem {
  id: string                    // e.g. 'H01'
  dimensions: DimensionId[]     // 1-2 dimensions covered
  territory: Territory
  text: string
  options: [HookOption, HookOption, HookOption, HookOption]
}

// ─── Dimension & Territory Definitions ──────────────────────────

export interface DimensionDefinition {
  id: DimensionId
  name: string
  territory: Territory
  arcPosition: string
  coreQuestion: string
  behavioralItems: string[]     // 5 item IDs (e.g. ['B01','B02','B03','B04','B05'])
  sjiItem: string               // 1 SJI ID
  mirrorItem: string            // 1 Mirror ID
  weeklyItem: string            // 1 Weekly ID
}

// ─── Score Interfaces ─────────────────────────────────────────────

export interface DimensionScore {
  dimensionId: DimensionId
  behavioralMean: number        // 1.0-5.0
  sjiScaled?: number            // 1.0-5.0 (may be missing if SJI not yet answered)
  composite: number             // 1.0-5.0
  percentage: number            // 0-100
  verbalLabel: VerbalLabel
  confidence: 'full' | 'partial' | 'preliminary'
}

export interface TerritoryScore {
  territory: Territory
  score: number                 // 0-100
  verbalLabel: VerbalLabel
  dimensions: DimensionScore[]
}

export interface ArchetypeMatch {
  name: string
  matchType: MatchType
  signatureStrength: number
  sjiConfirmed?: boolean
  mirrorAmplified?: 'high' | 'flag_for_review' | 'neutral'
  displayRank: number           // 1-3
}

// ─── Session & Response Interfaces ──────────────────────────────

export interface AssessmentSession {
  id: string
  ceoId: string
  version: string
  form: Form
  startedAt: string
  completedAt?: string
  stageReached: Stage
  imTotal: number
  imFlagged: boolean
  clmi?: number
  bsi?: number
  totalTimeSeconds?: number
}

export interface ItemResponse {
  id: string
  sessionId: string
  itemId: string
  itemType: ItemType
  rawResponse: number
  scoredValue: number
  dimensionId?: DimensionId
  stage: Stage
  responseTimeMs: number
  respondedAt: string
}

// ─── Mirror Interfaces ──────────────────────────────────────────

export interface MirrorSession {
  id: string
  sessionId: string
  raterEmail: string
  raterRelationship: string
  completedAt?: string
}

export interface MirrorGap {
  dimensionId: DimensionId
  ceoPct: number
  raterPct: number
  gapPct: number
  gapLabel: string
  severity: 'aligned' | 'mild' | 'significant' | 'critical'
}

// ─── Hook & Weekly Interfaces ────────────────────────────────────

export interface HookSession {
  id: string
  ceoId: string
  completedAt: string
  lyScore: number
  ltScore: number
  loScore: number
  sharpestDimension: DimensionId
  converted: boolean
}

export interface WeeklyPulse {
  id: string
  ceoId: string
  dimensionId: DimensionId
  score: number
  quarter: string
  respondedAt: string
}

// ─── Report Interfaces ──────────────────────────────────────────

export interface FullResults {
  session: AssessmentSession
  dimensionScores: DimensionScore[]
  territoryScores: TerritoryScore[]
  archetypes: ArchetypeMatch[]
  priorityDimensions: DimensionId[]
  mirrorGaps?: MirrorGap[]
  bsi?: number
  directionalBsi?: number
}

// ─── Response Time Flags ─────────────────────────────────────────

export interface ResponseTimeFlag {
  flagType: 'item_too_fast' | 'item_too_slow' | 'stage_rushed' | 'stage_slow' | 'assessment_rushed' | 'assessment_extended'
  itemId?: string
  valueMs: number
  stage?: Stage
}
