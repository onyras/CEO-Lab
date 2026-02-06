// CEO Lab V4 — Weekly Signature Questions (15 items, one per dimension)
// Source: CEO_LAB_ASSESSMENT_V4.md, "WEEKLY SIGNATURE QUESTIONS" section
// CEOs select 3-5 dimensions per quarter. Response takes ~30 seconds.

import type { WeeklyItem } from '@/types/assessment'

export const weeklyItems: WeeklyItem[] = [
  // ─── Leading Yourself ──────────────────────────────────────────
  {
    id: 'W01',
    dimensionId: 'LY.1',
    text: 'How many times this week did you catch a reactive pattern before it played out?',
    responseFormat: 'number',
  },
  {
    id: 'W02',
    dimensionId: 'LY.2',
    text: 'This week, when a difficult emotion came up, did you name it and navigate it cleanly?',
    responseFormat: 'select:Yes/Partly/No',
  },
  {
    id: 'W03',
    dimensionId: 'LY.3',
    text: 'How many days this week did you practice deliberate stillness or meditation?',
    responseFormat: 'number',
  },
  {
    id: 'W04',
    dimensionId: 'LY.4',
    text: 'What percentage of your hours this week were in your zone of genius?',
    responseFormat: 'percentage',
  },
  {
    id: 'W05',
    dimensionId: 'LY.5',
    text: 'How many hours of deep, uninterrupted work did you complete this week?',
    responseFormat: 'number',
  },

  // ─── Leading Teams ─────────────────────────────────────────────
  {
    id: 'W06',
    dimensionId: 'LT.1',
    text: 'Did someone bring you bad news or a mistake this week without you asking?',
    responseFormat: 'select:Yes/No',
  },
  {
    id: 'W07',
    dimensionId: 'LT.2',
    text: 'Is there a difficult conversation you\'re currently avoiding?',
    responseFormat: 'select:Yes/No',
  },
  {
    id: 'W08',
    dimensionId: 'LT.3',
    text: 'This week, when someone brought you a problem, did you ask or tell?',
    responseFormat: 'select:Mostly asked/Mixed/Mostly told',
  },
  {
    id: 'W09',
    dimensionId: 'LT.4',
    text: 'Rate your leadership team meeting this week:',
    responseFormat: 'select:Waste/Status updates/Some decisions/Highly effective',
  },
  {
    id: 'W10',
    dimensionId: 'LT.5',
    text: 'What % of your time this week was ON the business vs. IN the business?',
    responseFormat: 'percentage',
  },

  // ─── Leading Organizations ─────────────────────────────────────
  {
    id: 'W11',
    dimensionId: 'LO.1',
    text: 'Did you say no to something this week that didn\'t fit your strategy?',
    responseFormat: 'select:Yes/No/Nothing came up',
  },
  {
    id: 'W12',
    dimensionId: 'LO.2',
    text: 'Did you observe behavior this week that violated cultural norms? If so, did you address it?',
    responseFormat: 'select:No violations/Saw it, addressed it/Saw it, didn\'t address it',
  },
  {
    id: 'W13',
    dimensionId: 'LO.3',
    text: 'This week, did anyone need to work around the formal structure to get something done?',
    responseFormat: 'select:Yes/No/Don\'t know',
  },
  {
    id: 'W14',
    dimensionId: 'LO.4',
    text: 'What % of your work this week should you have let go of by now?',
    responseFormat: 'percentage',
  },
  {
    id: 'W15',
    dimensionId: 'LO.5',
    text: 'Did you proactively communicate with your board or key stakeholders this week?',
    responseFormat: 'select:Yes/No',
  },
]
