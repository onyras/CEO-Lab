// CEO Lab V4 Constants
// All dimension definitions, archetype signatures, and scoring thresholds

import type { DimensionDefinition, DimensionId, Territory, VerbalLabel } from '@/types/assessment'

// ─── 15 Dimension Definitions ────────────────────────────────────

export const DIMENSIONS: DimensionDefinition[] = [
  // Leading Yourself
  { id: 'LY.1', name: 'Self-Awareness', territory: 'leading_yourself', arcPosition: 'See', coreQuestion: 'Can you see the patterns running you before they run you?', behavioralItems: ['B01','B02','B03','B04','B05'], sjiItem: 'SJ01', mirrorItem: 'M01', weeklyItem: 'W01' },
  { id: 'LY.2', name: 'Emotional Mastery', territory: 'leading_yourself', arcPosition: 'Feel', coreQuestion: 'Can you navigate emotions without being hijacked or going numb?', behavioralItems: ['B06','B07','B08','B09','B10'], sjiItem: 'SJ02', mirrorItem: 'M02', weeklyItem: 'W02' },
  { id: 'LY.3', name: 'Grounded Presence', territory: 'leading_yourself', arcPosition: 'Ground', coreQuestion: 'Do you have the inner stillness to see clearly when everything moves?', behavioralItems: ['B11','B12','B13','B14','B15'], sjiItem: 'SJ03', mirrorItem: 'M03', weeklyItem: 'W03' },
  { id: 'LY.4', name: 'Purpose & Mastery', territory: 'leading_yourself', arcPosition: 'Direct', coreQuestion: 'Are you committed to the path only you can walk?', behavioralItems: ['B16','B17','B18','B19','B20'], sjiItem: 'SJ04', mirrorItem: 'M04', weeklyItem: 'W04' },
  { id: 'LY.5', name: 'Peak Performance', territory: 'leading_yourself', arcPosition: 'Sustain', coreQuestion: 'Can you protect your capacity for deep work over decades?', behavioralItems: ['B21','B22','B23','B24','B25'], sjiItem: 'SJ05', mirrorItem: 'M05', weeklyItem: 'W05' },
  // Leading Teams
  { id: 'LT.1', name: 'Building Trust', territory: 'leading_teams', arcPosition: 'Trust', coreQuestion: 'Have you created the conditions where truth travels fast?', behavioralItems: ['B26','B27','B28','B29','B30'], sjiItem: 'SJ06', mirrorItem: 'M06', weeklyItem: 'W06' },
  { id: 'LT.2', name: 'Hard Conversations', territory: 'leading_teams', arcPosition: 'Truth', coreQuestion: 'Can you say what needs to be said without destroying what you\'ve built?', behavioralItems: ['B31','B32','B33','B34','B35'], sjiItem: 'SJ07', mirrorItem: 'M07', weeklyItem: 'W07' },
  { id: 'LT.3', name: 'Diagnosing the Real Problem', territory: 'leading_teams', arcPosition: 'Diagnosis', coreQuestion: 'Can you see what\'s actually broken beneath the surface?', behavioralItems: ['B36','B37','B38','B39','B40'], sjiItem: 'SJ08', mirrorItem: 'M08', weeklyItem: 'W08' },
  { id: 'LT.4', name: 'Team Operating System', territory: 'leading_teams', arcPosition: 'System', coreQuestion: 'Have you shaped the rhythms and standards your team runs on?', behavioralItems: ['B41','B42','B43','B44','B45'], sjiItem: 'SJ09', mirrorItem: 'M09', weeklyItem: 'W09' },
  { id: 'LT.5', name: 'Leader Identity', territory: 'leading_teams', arcPosition: 'Identity', coreQuestion: 'Do you know where you end and your team begins?', behavioralItems: ['B46','B47','B48','B49','B50'], sjiItem: 'SJ10', mirrorItem: 'M10', weeklyItem: 'W10' },
  // Leading Organizations
  { id: 'LO.1', name: 'Strategic Clarity', territory: 'leading_organizations', arcPosition: 'See', coreQuestion: 'Have you made the choices that define where you play and how you win?', behavioralItems: ['B51','B52','B53','B54','B55'], sjiItem: 'SJ11', mirrorItem: 'M11', weeklyItem: 'W11' },
  { id: 'LO.2', name: 'Culture Design', territory: 'leading_organizations', arcPosition: 'Shape', coreQuestion: 'Have you designed the invisible forces that shape how people behave?', behavioralItems: ['B56','B57','B58','B59','B60'], sjiItem: 'SJ12', mirrorItem: 'M12', weeklyItem: 'W12' },
  { id: 'LO.3', name: 'Organizational Architecture', territory: 'leading_organizations', arcPosition: 'Build', coreQuestion: 'Does your structure match where you\'re going, not where you\'ve been?', behavioralItems: ['B61','B62','B63','B64','B65'], sjiItem: 'SJ13', mirrorItem: 'M13', weeklyItem: 'W13' },
  { id: 'LO.4', name: 'CEO Evolution', territory: 'leading_organizations', arcPosition: 'Evolve', coreQuestion: 'Are you growing into what your company needs next?', behavioralItems: ['B66','B67','B68','B69','B70'], sjiItem: 'SJ14', mirrorItem: 'M14', weeklyItem: 'W14' },
  { id: 'LO.5', name: 'Leading Change', territory: 'leading_organizations', arcPosition: 'Change', coreQuestion: 'Can you protect what works while building what\'s next?', behavioralItems: ['B71','B72','B73','B74','B75'], sjiItem: 'SJ15', mirrorItem: 'M15', weeklyItem: 'W15' },
]

// ─── Reverse-Scored Items ────────────────────────────────────────
// Derived from the (R) markings on each item in CEO_LAB_ASSESSMENT_V4.md.
// Most dimensions have 2 reverse-scored items; LY.3 and LT.1 have 1 each.
// 28 total across 15 dimensions.
//
// NOTE: The Scoring Engine v4.0 Section 1.3 claims "1 reverse per dimension,
// item 3 is reverse" — that is a simplification error. The actual item bank
// in the Assessment spec marks 2 items (R) per dimension as listed below.
// The Assessment spec is the source of truth for scoring direction.
export const REVERSE_SCORED_ITEMS = new Set<string>([
  // LY.1 Self-Awareness
  'B02',  // (R) same type of conflict with different people
  'B04',  // (R) feedback genuinely surprised me
  // LY.2 Emotional Mastery
  'B07',  // (R) suppressed emotion came out later
  'B10',  // (R) avoided giving honest feedback
  // LY.3 Grounded Presence
  'B12',  // (R) mind kept racing when trying to rest
  // LY.4 Purpose & Mastery
  'B17',  // (R) spent time on work someone else could handle
  'B20',  // (R) felt pulled in directions that don't align
  // LY.5 Peak Performance
  'B22',  // (R) worked through obvious signs of exhaustion
  'B25',  // (R) spent majority of time in reactive mode
  // LT.1 Building Trust
  'B28',  // (R) learned about problem from back channel
  // LT.2 Hard Conversations
  'B32',  // (R) avoided uncomfortable conversation
  'B35',  // (R) softened feedback so much it didn't land
  // LT.3 Diagnosing the Real Problem
  'B37',  // (R) provided answer before team could develop own
  'B39',  // (R) people came to me for decisions they could make
  // LT.4 Team Operating System
  'B42',  // (R) meetings ended without clear outcomes
  'B45',  // (R) team's way of working was mostly improvised
  // LT.5 Leader Identity
  'B47',  // (R) took back delegated task
  'B50',  // (R) attended meeting in area I should have let go
  // LO.1 Strategic Clarity
  'B52',  // (R) pursued opportunity that didn't fit strategy
  'B55',  // (R) confused business plan with actual strategy
  // LO.2 Culture Design
  'B57',  // (R) tolerated high performer violating norms
  'B59',  // (R) gap between stated culture and actual behavior
  // LO.3 Organizational Architecture
  'B62',  // (R) org structure created bottlenecks
  'B64',  // (R) people worked around formal structure
  // LO.4 CEO Evolution
  'B67',  // (R) doing work I should have transitioned away from
  'B70',  // (R) held onto area because letting go felt like losing relevance
  // LO.5 Leading Change
  'B72',  // (R) withheld or softened bad news to board
  'B75',  // (R) avoided making needed organizational change
])

// ─── Stage Assignment ────────────────────────────────────────────
// Stage 1 (32): 1st behavioral per dim (15) + SJ01-SJ11 (11) + IM01-IM06 (6)
// Stage 2 (34): 2nd+3rd behavioral per dim (30) + SJ12-SJ15 (4)
// Stage 3 (30): 4th+5th behavioral per dim (30)

export const STAGE_ITEMS: Record<number, string[]> = {
  1: [
    // 1st behavioral per dimension
    'B01','B06','B11','B16','B21','B26','B31','B36','B41','B46','B51','B56','B61','B66','B71',
    // SJ01-SJ11
    'SJ01','SJ02','SJ03','SJ04','SJ05','SJ06','SJ07','SJ08','SJ09','SJ10','SJ11',
    // IM01-IM06
    'IM01','IM02','IM03','IM04','IM05','IM06',
  ],
  2: [
    // 2nd + 3rd behavioral per dimension
    'B02','B03','B07','B08','B12','B13','B17','B18','B22','B23',
    'B27','B28','B32','B33','B37','B38','B42','B43','B47','B48',
    'B52','B53','B57','B58','B62','B63','B67','B68','B72','B73',
    // SJ12-SJ15
    'SJ12','SJ13','SJ14','SJ15',
  ],
  3: [
    // 4th + 5th behavioral per dimension
    'B04','B05','B09','B10','B14','B15','B19','B20','B24','B25',
    'B29','B30','B34','B35','B39','B40','B44','B45','B49','B50',
    'B54','B55','B59','B60','B64','B65','B69','B70','B74','B75',
  ],
}

// ─── Verbal Label Thresholds ─────────────────────────────────────

export const VERBAL_LABELS: { max: number; label: VerbalLabel }[] = [
  { max: 20, label: 'Critical gap' },
  { max: 40, label: 'Early development' },
  { max: 60, label: 'Building' },
  { max: 80, label: 'Strong' },
  { max: 100, label: 'Mastery' },
]

// ─── BSI Thresholds ──────────────────────────────────────────────

export const BSI_LABELS: { max: number; label: string }[] = [
  { max: 10, label: 'High self-awareness' },
  { max: 20, label: 'Moderate self-awareness' },
  { max: 30, label: 'Notable blind spots' },
  { max: 100, label: 'Significant self-perception gap' },
]

// ─── 12 Archetype Signatures ─────────────────────────────────────

export interface ArchetypeSignature {
  name: string
  high: DimensionId[]
  low: DimensionId[]
  detection?: 'im_flag'
  expectedSjiTendency?: string
}

export const ARCHETYPE_SIGNATURES: ArchetypeSignature[] = [
  { name: 'Brilliant Bottleneck', high: ['LO.1','LY.1'], low: ['LT.5','LT.3','LO.4'], expectedSjiTendency: 'Controller' },
  { name: 'Empathetic Avoider', high: ['LY.2','LT.1'], low: ['LT.2','LT.3','LT.5'], expectedSjiTendency: 'Rescuer' },
  { name: 'Lonely Operator', high: ['LY.4','LY.5'], low: ['LT.4','LT.5','LO.4','LY.3'], expectedSjiTendency: 'Controller' },
  { name: 'Polished Performer', high: [], low: [], detection: 'im_flag' },
  { name: 'Visionary Without Vehicle', high: ['LO.1','LY.4','LY.1'], low: ['LO.3','LO.2','LT.4'], expectedSjiTendency: 'Facilitator' },
  { name: 'Conscious Leader, Stuck', high: ['LY.1','LY.2','LY.3'], low: ['LO.1','LO.3','LO.4'], expectedSjiTendency: 'Facilitator' },
  { name: 'Firefighter', high: ['LY.5','LY.2'], low: ['LO.3','LT.4','LY.3'], expectedSjiTendency: 'Controller' },
  { name: 'Democratic Idealist', high: ['LT.1','LT.3'], low: ['LO.1','LT.2','LT.5'], expectedSjiTendency: 'Facilitator' },
  { name: 'Scaling Wall', high: ['LY.5','LY.4','LT.1'], low: ['LO.4','LT.3','LT.5','LO.3'], expectedSjiTendency: 'Controller' },
  { name: 'Strategy Monk', high: ['LO.1','LY.3','LY.1','LY.4'], low: ['LT.2','LT.4','LO.2'], expectedSjiTendency: 'Facilitator' },
  { name: 'Governance Orphan', high: ['LT.1','LT.4','LO.1'], low: ['LO.5'], expectedSjiTendency: 'Facilitator' },
  { name: 'Accidental Culture', high: ['LO.1','LO.4','LY.5'], low: ['LO.2','LT.1','LT.3'], expectedSjiTendency: 'Rescuer' },
]

// ─── Framework Prescriptions ──────────────────────────────────────
// dimension → score tier → framework names

export const FRAMEWORK_PRESCRIPTIONS: Record<DimensionId, { critical: string[]; developing: string[]; strong: string[] }> = {
  'LY.1': { critical: ['Five Drivers', 'Above the Line'], developing: ['Drama Triangle', 'Reactive Patterns'], strong: ['Munger\'s Inversion'] },
  'LY.2': { critical: ['Wheel of Emotions', 'Idiot Compassion'], developing: ['4 Stages Compassion', 'Emotional Fluidity'], strong: ['50 Rules', 'Compassion Shift'] },
  'LY.3': { critical: ['5 Enemies of Focus', 'Bandwidth'], developing: ['3 Meditations', 'Flywheel'], strong: ['Wheel of Awareness', 'Wisdom Quadrant'] },
  'LY.4': { critical: ['Zone of Genius', 'Four Relationships'], developing: ['Dartboard Method', 'Kodawari'], strong: ['Musashi\'s 22 Rules'] },
  'LY.5': { critical: ['5 Non-Negotiables', '80:20'], developing: ['Deep Work', 'Yerkes-Dodson'], strong: ['ZRM Peak States'] },
  'LT.1': { critical: ['Trust Formula', 'Psych Safety basics'], developing: ['Mistakes\u2192Trust', 'Lencioni Pyramid'], strong: ['Psych Safety advanced'] },
  'LT.2': { critical: ['NVC basics', 'Radical Candor'], developing: ['4 Ways of Listening', 'Honest Mirror'], strong: ['NVC advanced', 'Generative Listening'] },
  'LT.3': { critical: ['5 Dysfunctions', 'Self-Reliance Spiral'], developing: ['Multiplier Effect', '4 Relationship Killers'], strong: ['5 Dysfunctions facilitation', 'Multiplier mastery'] },
  'LT.4': { critical: ['4 Meetings (basic cadence)'], developing: ['4 Meetings advanced', 'Off-Site Design'], strong: ['Custom rhythm design'] },
  'LT.5': { critical: ['Founder\'s Clarity', '3 Levels'], developing: ['Team One', '3 Levels advanced'], strong: ['Team One mastery'] },
  'LO.1': { critical: ['Drucker\'s Five Questions', '6 Strategy Traps'], developing: ['Playing to Win', 'Strategy Masks'], strong: ['Org Maturity Analysis'] },
  'LO.2': { critical: ['4 Cultures Model', 'Four Quadrants'], developing: ['Growth Mindset', 'Decision Architecture'], strong: ['Inclusion Spectrum'] },
  'LO.3': { critical: ['Five Paradigms', 'Role Radar'], developing: ['Kaizen', 'Role Radar advanced'], strong: ['Consultant Readiness'] },
  'LO.4': { critical: ['Three Transitions', 'CEO Test'], developing: ['Three Deaths', 'Peter Principle'], strong: ['5 Criteria for CEO Success'] },
  'LO.5': { critical: ['Onion Theory', 'Board Excellence basics'], developing: ['Ambidextrous Org', 'Board advanced'], strong: ['Transformation Readiness', 'Campaigning'] },
}

// ─── Territory Config ────────────────────────────────────────────

export const TERRITORY_CONFIG: Record<Territory, { name: string; displayLabel: string; arcDescription: string }> = {
  leading_yourself: {
    name: 'Leading Yourself',
    displayLabel: 'Leading Yourself',
    arcDescription: 'See \u2192 Feel \u2192 Ground \u2192 Direct \u2192 Sustain',
  },
  leading_teams: {
    name: 'Leading Teams',
    displayLabel: 'Leading Teams',
    arcDescription: 'Trust \u2192 Truth \u2192 Diagnosis \u2192 System \u2192 Identity',
  },
  leading_organizations: {
    name: 'Leading Organizations',
    displayLabel: 'Leading Organizations',
    arcDescription: 'See \u2192 Shape \u2192 Build \u2192 Evolve \u2192 Change',
  },
}

// ─── Helper: Get dimension by ID ─────────────────────────────────

export function getDimension(id: DimensionId): DimensionDefinition {
  const dim = DIMENSIONS.find(d => d.id === id)
  if (!dim) throw new Error(`Unknown dimension: ${id}`)
  return dim
}

export function getDimensionsByTerritory(territory: Territory): DimensionDefinition[] {
  return DIMENSIONS.filter(d => d.territory === territory)
}
