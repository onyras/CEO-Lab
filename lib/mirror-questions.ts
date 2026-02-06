// CEO Lab V4 — Mirror Check Items (15 items, one per dimension)
// Source: CEO_LAB_ASSESSMENT_V4.md, "MIRROR CHECK ITEMS" section
// Answered by a trusted rater about the CEO. Uses same response scales.

import type { MirrorItem } from '@/types/assessment'

export const mirrorItems: MirrorItem[] = [
  // ─── Leading Yourself ──────────────────────────────────────────
  {
    id: 'M01',
    dimensionId: 'LY.1',
    text: 'In the past 30 days, when this leader had a strong reaction, they noticed it and adjusted their behavior rather than being driven by it.',
    scaleType: 'frequency',
  },
  {
    id: 'M02',
    dimensionId: 'LY.2',
    text: 'In the past 30 days, this leader expressed difficult emotions (frustration, disappointment, concern) in a way that was honest but not harmful.',
    scaleType: 'frequency',
  },
  {
    id: 'M03',
    dimensionId: 'LY.3',
    text: 'In the past 30 days, when I spoke with this leader during important conversations, they were genuinely present and attentive.',
    scaleType: 'frequency',
  },
  {
    id: 'M04',
    dimensionId: 'LY.4',
    text: 'This leader seems to be doing work that aligns with their deepest strengths, rather than getting pulled into tasks others could handle.',
    scaleType: 'degree',
  },
  {
    id: 'M05',
    dimensionId: 'LY.5',
    text: 'In the past 30 days, this leader appeared to be managing their energy and workload sustainably, rather than running on fumes.',
    scaleType: 'frequency',
  },

  // ─── Leading Teams ─────────────────────────────────────────────
  {
    id: 'M06',
    dimensionId: 'LT.1',
    text: 'In the past 30 days, I felt comfortable bringing this leader bad news or admitting a mistake without fearing a negative reaction.',
    scaleType: 'frequency',
  },
  {
    id: 'M07',
    dimensionId: 'LT.2',
    text: 'In the past 30 days, when this leader needed to address a difficult topic, they did so directly and in a timely way.',
    scaleType: 'frequency',
  },
  {
    id: 'M08',
    dimensionId: 'LT.3',
    text: 'In the past 30 days, when I brought this leader a problem, they asked questions to understand before offering solutions.',
    scaleType: 'frequency',
  },
  {
    id: 'M09',
    dimensionId: 'LT.4',
    text: 'Our team currently has clear, effective rhythms (meetings, check-ins, decision processes) that help us collaborate well.',
    scaleType: 'degree',
  },
  {
    id: 'M10',
    dimensionId: 'LT.5',
    text: 'In the past 30 days, this leader empowered the team to make decisions rather than keeping control.',
    scaleType: 'frequency',
  },

  // ─── Leading Organizations ─────────────────────────────────────
  {
    id: 'M11',
    dimensionId: 'LO.1',
    text: 'I can clearly articulate our company\'s strategic priorities and use them to guide my own decisions.',
    scaleType: 'degree',
  },
  {
    id: 'M12',
    dimensionId: 'LO.2',
    text: 'In the past 30 days, this leader addressed behavior that went against our culture, even when the person involved was a strong performer.',
    scaleType: 'frequency',
  },
  {
    id: 'M13',
    dimensionId: 'LO.3',
    text: 'In my experience, decision rights and roles in this organization are clear enough that I rarely need to escalate or work around the structure.',
    scaleType: 'degree',
  },
  {
    id: 'M14',
    dimensionId: 'LO.4',
    text: 'This leader has visibly evolved their role to match the company\'s current needs rather than holding onto responsibilities from an earlier stage.',
    scaleType: 'degree',
  },
  {
    id: 'M15',
    dimensionId: 'LO.5',
    text: 'In the past 30 days, this leader communicated openly with stakeholders (board, investors, team) about challenges and uncertainties, not just successes.',
    scaleType: 'frequency',
  },
]
