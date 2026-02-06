// CEO Lab V4 — Hook Assessment Items (free tier)
// Source: CEO_LAB_ASSESSMENT_V4.md, "HOOK ASSESSMENT" section
// 10 items covering all 15 dimensions through paired indicators

import type { HookItem } from '@/types/assessment'

export const hookItems: HookItem[] = [
  // ─── Leading Yourself ──────────────────────────────────────────
  {
    id: 'H01',
    dimensions: ['LY.1', 'LY.2'],
    territory: 'leading_yourself',
    text: 'In the past week, when something frustrated you at work, how quickly did you recognize what was really going on underneath the frustration?',
    options: [
      { text: "I didn't", value: 1 },
      { text: 'After the fact', value: 2 },
      { text: 'Within a few hours', value: 3 },
      { text: 'Within minutes', value: 4 },
    ],
  },
  {
    id: 'H02',
    dimensions: ['LY.3'],
    territory: 'leading_yourself',
    text: 'In the past week, how often did you feel genuinely present and undistracted during your most important conversations?',
    options: [
      { text: 'Almost never', value: 1 },
      { text: 'Once or twice', value: 2 },
      { text: 'About half the time', value: 3 },
      { text: 'Most of the time', value: 4 },
    ],
  },
  {
    id: 'H03',
    dimensions: ['LY.4', 'LY.5'],
    territory: 'leading_yourself',
    text: 'In the past week, what percentage of your working time was spent on work that only you could do, versus meetings, email, and firefighting?',
    options: [
      { text: 'Less than 20% deep work', value: 1 },
      { text: '20-40%', value: 2 },
      { text: '40-60%', value: 3 },
      { text: 'More than 60%', value: 4 },
    ],
  },

  // ─── Leading Teams ─────────────────────────────────────────────
  {
    id: 'H04',
    dimensions: ['LT.1'],
    territory: 'leading_teams',
    text: 'In the past month, how many times did someone on your team bring you bad news proactively (before you had to discover it)?',
    options: [
      { text: 'Never', value: 1 },
      { text: 'Once', value: 2 },
      { text: 'A few times', value: 3 },
      { text: 'Regularly', value: 4 },
    ],
  },
  {
    id: 'H05',
    dimensions: ['LT.2', 'LT.3'],
    territory: 'leading_teams',
    text: 'Think of the last time a team conflict or performance issue needed your attention. How did you handle it?',
    options: [
      { text: "Haven't addressed it yet", value: 1 },
      { text: 'Addressed it but weeks later', value: 2 },
      { text: 'Addressed it within a few days', value: 3 },
      { text: 'Addressed it same week with curiosity about root causes', value: 4 },
    ],
  },
  {
    id: 'H06',
    dimensions: ['LT.4', 'LT.5'],
    territory: 'leading_teams',
    text: 'If you left for two weeks with no contact, how would your team function?',
    options: [
      { text: 'Major problems', value: 1 },
      { text: 'Things would slow significantly', value: 2 },
      { text: 'Most things would continue', value: 3 },
      { text: 'Smoothly, with clear systems in place', value: 4 },
    ],
  },

  // ─── Leading Organizations ─────────────────────────────────────
  {
    id: 'H07',
    dimensions: ['LO.1'],
    territory: 'leading_organizations',
    text: "If you asked five random employees to describe your company's strategy in one sentence, how consistent would their answers be?",
    options: [
      { text: 'Very different', value: 1 },
      { text: 'Somewhat similar', value: 2 },
      { text: 'Mostly aligned', value: 3 },
      { text: 'Nearly identical', value: 4 },
    ],
  },
  {
    id: 'H08',
    dimensions: ['LO.2'],
    territory: 'leading_organizations',
    text: 'In the past month, did you address a cultural norm violation by a strong performer?',
    options: [
      { text: 'No, and I tolerated the behavior', value: 1 },
      { text: 'No, but I planned to', value: 2 },
      { text: 'Yes, indirectly', value: 3 },
      { text: 'Yes, directly and promptly', value: 4 },
    ],
  },
  {
    id: 'H09',
    dimensions: ['LO.3', 'LO.4'],
    territory: 'leading_organizations',
    text: 'How different is your daily work today compared to 12 months ago?',
    options: [
      { text: 'Essentially the same', value: 1 },
      { text: 'Slightly different', value: 2 },
      { text: 'Noticeably different', value: 3 },
      { text: 'Fundamentally different, reflecting company growth', value: 4 },
    ],
  },
  {
    id: 'H10',
    dimensions: ['LO.5'],
    territory: 'leading_organizations',
    text: 'How would you describe your board communication?',
    options: [
      { text: 'Mostly performance updates', value: 1 },
      { text: 'Honest about wins, careful about challenges', value: 2 },
      { text: 'Open about most things', value: 3 },
      { text: 'Radically candid, including my own uncertainties', value: 4 },
    ],
  },
]
