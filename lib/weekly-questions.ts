// CEO Lab V4 — Weekly Signature Questions (15 items, one per dimension)
// Source: CEO_LAB_ASSESSMENT_V4.md, "WEEKLY SIGNATURE QUESTIONS" section
// CEOs select 3-5 dimensions per quarter. Response takes ~30 seconds.
// Voice: first-person "I" — consistent with baseline behavioral items.

import type { WeeklyItem } from '@/types/assessment'

export const weeklyItems: WeeklyItem[] = [
  // ─── Leading Yourself ──────────────────────────────────────────
  {
    id: 'W01',
    dimensionId: 'LY.1',
    text: 'Times I caught a reactive pattern before it played out this week:',
    responseFormat: 'number',
  },
  {
    id: 'W02',
    dimensionId: 'LY.2',
    text: 'When a difficult emotion came up this week, I named it and navigated it cleanly.',
    responseFormat: 'select:Yes/Partly/No',
  },
  {
    id: 'W03',
    dimensionId: 'LY.3',
    text: 'Days I practiced deliberate stillness or meditation this week:',
    responseFormat: 'number',
  },
  {
    id: 'W04',
    dimensionId: 'LY.4',
    text: 'Percentage of my hours this week in my zone of genius:',
    responseFormat: 'percentage',
  },
  {
    id: 'W05',
    dimensionId: 'LY.5',
    text: 'Hours of deep, uninterrupted work I completed this week:',
    responseFormat: 'number',
  },

  // ─── Leading Teams ─────────────────────────────────────────────
  {
    id: 'W06',
    dimensionId: 'LT.1',
    text: 'Someone brought me bad news or a mistake this week without me asking.',
    responseFormat: 'select:Yes/No',
  },
  {
    id: 'W07',
    dimensionId: 'LT.2',
    text: 'I am currently avoiding a difficult conversation.',
    responseFormat: 'select:Yes/No',
  },
  {
    id: 'W08',
    dimensionId: 'LT.3',
    text: 'When someone brought me a problem this week, I:',
    responseFormat: 'select:Mostly asked/Mixed/Mostly told',
  },
  {
    id: 'W09',
    dimensionId: 'LT.4',
    text: 'My leadership team meeting this week was:',
    responseFormat: 'select:Waste/Status updates/Some decisions/Highly effective',
  },
  {
    id: 'W10',
    dimensionId: 'LT.5',
    text: 'Percentage of my time this week ON the business vs. IN the business:',
    responseFormat: 'percentage',
  },

  // ─── Leading Organizations ─────────────────────────────────────
  {
    id: 'W11',
    dimensionId: 'LO.1',
    text: "I said no to something this week that didn't fit my strategy.",
    responseFormat: 'select:Yes/No/Nothing came up',
  },
  {
    id: 'W12',
    dimensionId: 'LO.2',
    text: 'I observed behavior this week that violated cultural norms.',
    responseFormat: "select:No violations/Saw it, addressed it/Saw it, didn't address it",
  },
  {
    id: 'W13',
    dimensionId: 'LO.3',
    text: 'Someone needed to work around the formal structure to get something done this week.',
    responseFormat: "select:Yes/No/Don't know",
  },
  {
    id: 'W14',
    dimensionId: 'LO.4',
    text: 'Percentage of my work this week I should have let go of by now:',
    responseFormat: 'percentage',
  },
  {
    id: 'W15',
    dimensionId: 'LO.5',
    text: 'I proactively communicated with my board or key stakeholders this week.',
    responseFormat: 'select:Yes/No',
  },
]
