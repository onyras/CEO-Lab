// CEO Lab V4 — Framework Content
// Structured content for the top 10 critical-tier frameworks.
// These are the frameworks that surface for the weakest scores — highest impact for pilot users.
// Content is placeholder until Niko provides final taglines, summaries, and external URLs.

import type { DimensionId } from '@/types/assessment'

export interface FrameworkContent {
  id: string                    // kebab-case slug
  name: string                  // display name
  dimension: DimensionId        // primary dimension
  tier: 'critical' | 'developing' | 'strong'
  tagline: string               // one-line "what this does" (max 15 words)
  summary: string               // 2-3 sentence overview
  whenToUse: string             // "Use this when..." (1 sentence)
  externalUrl?: string          // link to PDF, video, or resource
  coachingCta: boolean          // whether to show "Work with Niko" CTA
}

export const FRAMEWORK_CONTENT: FrameworkContent[] = [
  // 1. Five Drivers (LY.1 critical)
  {
    id: 'five-drivers',
    name: 'Five Drivers',
    dimension: 'LY.1',
    tier: 'critical',
    tagline: 'Identify the five unconscious patterns driving your leadership behavior.',
    summary: 'The Five Drivers framework maps the five core behavioral patterns that operate beneath conscious awareness: Be Perfect, Be Strong, Hurry Up, Please Others, and Try Hard. Each driver has a productive side and a shadow side. Understanding which drivers dominate your leadership gives you the power to choose your response instead of reacting on autopilot.',
    whenToUse: 'Use this when you notice yourself reacting to situations in ways that feel automatic and hard to control.',
    coachingCta: true,
  },

  // 2. Zone of Genius (LY.4 critical)
  {
    id: 'zone-of-genius',
    name: 'Zone of Genius',
    dimension: 'LY.4',
    tier: 'critical',
    tagline: 'Find where your deepest talent and greatest passion intersect.',
    summary: 'The Zone of Genius framework helps you identify the intersection of your innate talent and the work that energizes you most. Most CEOs spend too much time in their Zone of Competence or Excellence — things they\'re good at but that drain them. The goal is to systematically increase time in your Zone of Genius and delegate the rest.',
    whenToUse: 'Use this when you feel drained despite being productive, or when you\'re doing work someone else could handle.',
    coachingCta: true,
  },

  // 3. 5 Non-Negotiables (LY.5 critical)
  {
    id: 'five-non-negotiables',
    name: '5 Non-Negotiables',
    dimension: 'LY.5',
    tier: 'critical',
    tagline: 'Define the five practices you protect no matter what.',
    summary: 'The 5 Non-Negotiables framework asks you to identify exactly five daily or weekly practices that sustain your performance — sleep, exercise, reflection, deep work, or whatever keeps you at your best. The rule is simple: these five things are non-negotiable. When pressure increases, you protect them harder, not less. This is the foundation of sustainable high performance.',
    whenToUse: 'Use this when you notice your recovery practices are the first thing you sacrifice under pressure.',
    coachingCta: true,
  },

  // 4. Trust Formula (LT.1 critical)
  {
    id: 'trust-formula',
    name: 'Trust Formula',
    dimension: 'LT.1',
    tier: 'critical',
    tagline: 'Build trust systematically through credibility, reliability, and intimacy.',
    summary: 'The Trust Formula breaks trust into four measurable components: Credibility (do you know what you\'re talking about?), Reliability (do you follow through?), Intimacy (is it safe to be vulnerable with you?), divided by Self-Orientation (are you in it for yourself?). This gives you a precise diagnostic for where trust is breaking down with any individual or team.',
    whenToUse: 'Use this when trust feels low on your team but you can\'t pinpoint why.',
    coachingCta: true,
  },

  // 5. Radical Candor (LT.2 critical)
  {
    id: 'radical-candor',
    name: 'Radical Candor',
    dimension: 'LT.2',
    tier: 'critical',
    tagline: 'Challenge directly while caring personally — the art of honest feedback.',
    summary: 'Radical Candor sits at the intersection of two dimensions: Care Personally and Challenge Directly. Most leaders default to one of three failure modes: Ruinous Empathy (caring without challenging), Obnoxious Aggression (challenging without caring), or Manipulative Insincerity (neither). The framework gives you a simple diagnostic and practice for having conversations that are both honest and kind.',
    whenToUse: 'Use this when you\'re avoiding a hard conversation or when your feedback isn\'t landing.',
    coachingCta: true,
  },

  // 6. NVC basics (LT.2 critical)
  {
    id: 'nvc-basics',
    name: 'NVC Basics',
    dimension: 'LT.2',
    tier: 'critical',
    tagline: 'Communicate needs clearly without blame, judgment, or aggression.',
    summary: 'Nonviolent Communication (NVC) provides a four-step structure for any difficult conversation: Observation (what happened, without evaluation), Feeling (what emotion it triggered), Need (what underlying need is at stake), and Request (what you\'re asking for). This removes blame and defensiveness from conversations, making it possible to address the hardest topics constructively.',
    whenToUse: 'Use this when conversations keep escalating into defensiveness or blame.',
    coachingCta: true,
  },

  // 7. 5 Dysfunctions (LT.3 critical)
  {
    id: 'five-dysfunctions',
    name: '5 Dysfunctions of a Team',
    dimension: 'LT.3',
    tier: 'critical',
    tagline: 'Diagnose which layer of team dysfunction is blocking your team.',
    summary: 'Lencioni\'s 5 Dysfunctions model shows that team problems stack in a specific order: Absence of Trust → Fear of Conflict → Lack of Commitment → Avoidance of Accountability → Inattention to Results. You can\'t fix a higher-level dysfunction without first resolving the one below it. This framework tells you exactly where to start.',
    whenToUse: 'Use this when your team has symptoms everywhere and you need to find the root cause.',
    coachingCta: true,
  },

  // 8. Drucker's Five Questions (LO.1 critical)
  {
    id: 'druckers-five-questions',
    name: 'Drucker\'s Five Questions',
    dimension: 'LO.1',
    tier: 'critical',
    tagline: 'Answer five questions that clarify your organization\'s strategic direction.',
    summary: 'Peter Drucker distilled strategic clarity into five questions every organization must answer: What is our mission? Who is our customer? What does our customer value? What are our results? What is our plan? Most organizations have vague answers to at least two of these. Getting crisp, specific answers that your whole team can articulate is the foundation of strategic clarity.',
    whenToUse: 'Use this when your team makes decisions that don\'t align with your strategy, or when strategy feels fuzzy.',
    coachingCta: true,
  },

  // 9. 4 Cultures Model (LO.2 critical)
  {
    id: 'four-cultures-model',
    name: '4 Cultures Model',
    dimension: 'LO.2',
    tier: 'critical',
    tagline: 'Identify which culture type your organization actually operates in.',
    summary: 'The 4 Cultures Model maps organizations into four types: Control (hierarchy, process), Compete (results, speed), Collaborate (people, consensus), and Create (innovation, autonomy). Most organizations have a dominant culture and a secondary one. The insight is that culture isn\'t good or bad — it\'s either aligned to your strategy or it isn\'t. Misalignment is the real problem.',
    whenToUse: 'Use this when your stated values don\'t match how people actually behave day to day.',
    coachingCta: true,
  },

  // 10. Three Transitions (LO.4 critical)
  {
    id: 'three-transitions',
    name: 'Three Transitions',
    dimension: 'LO.4',
    tier: 'critical',
    tagline: 'Navigate the three identity shifts every scaling CEO must make.',
    summary: 'As companies scale, CEOs must navigate three fundamental transitions: Builder to Architect (stop doing, start designing), Operator to Strategist (stop managing, start directing), and Individual to Institution (stop being the company, start building something that outlasts you). Each transition requires letting go of the identity that made you successful at the previous stage.',
    whenToUse: 'Use this when you feel the company has outgrown your current way of leading.',
    coachingCta: true,
  },
]

// ─── Helpers ──────────────────────────────────────────────────────

export function getFrameworkBySlug(slug: string): FrameworkContent | undefined {
  return FRAMEWORK_CONTENT.find(f => f.id === slug)
}

export function getFrameworksByDimension(dimension: DimensionId): FrameworkContent[] {
  return FRAMEWORK_CONTENT.filter(f => f.dimension === dimension)
}

export function getFrameworkByName(name: string): FrameworkContent | undefined {
  return FRAMEWORK_CONTENT.find(f => f.name === name)
}
