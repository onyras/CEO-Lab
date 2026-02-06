# Weekly Check-Ins - Feature Spec

**Status:** Designed, Phase 1 = dashboard form, Phase 2 = WhatsApp
**Source:** Extracted from PRODUCT_STRATEGY.md and V4 assessment

---

## Overview

3-5 questions per week, ~30 seconds. User selects dimensions to focus on per quarter. Same questions repeated weekly for 12 weeks. Builds clear trend data.

**Phase 1 Delivery:** Dashboard form (user self-reports weekly)
**Phase 2 Delivery:** WhatsApp automation (conversational, push-based)

---

## V4 Weekly Signature Questions (15 questions)

One per dimension. CEO selects 3-5 to focus on per quarter.

| # | Dimension | Weekly Question |
|---|---|---|
| W01 | Self-Awareness | How many times this week did you catch a reactive pattern before it played out? |
| W02 | Emotional Mastery | This week, when a difficult emotion came up, did you name it and navigate it cleanly? (Yes/Partly/No) |
| W03 | Grounded Presence | How many days this week did you practice deliberate stillness or meditation? |
| W04 | Purpose & Mastery | What percentage of your hours this week were in your zone of genius? |
| W05 | Peak Performance | How many hours of deep, uninterrupted work did you complete this week? |
| W06 | Building Trust | Did someone bring you bad news or a mistake this week without you asking? (Yes/No) |
| W07 | Hard Conversations | Is there a difficult conversation you're currently avoiding? (Yes/No) |
| W08 | Diagnosis | This week, when someone brought you a problem, did you ask or tell? (Mostly asked/Mixed/Mostly told) |
| W09 | Team Operating System | Rate your leadership team meeting this week: (Waste/Status updates/Some decisions/Highly effective) |
| W10 | Leader Identity | What % of your time this week was ON the business vs. IN the business? |
| W11 | Strategic Clarity | Did you say no to something this week that didn't fit your strategy? (Yes/No/Nothing came up) |
| W12 | Culture Design | Did you observe behavior this week that violated cultural norms? If so, did you address it? |
| W13 | Org Architecture | This week, did anyone need to work around the formal structure to get something done? (Yes/No/Don't know) |
| W14 | CEO Evolution | What % of your work this week should you have let go of by now? |
| W15 | Leading Change | Did you proactively communicate with your board or key stakeholders this week? (Yes/No) |

---

## User Journey

1. User completes baseline assessment
2. System suggests 3-5 lowest sub-dimensions
3. User selects 3-5 focus areas for the quarter
4. Same questions repeated weekly for 12 weeks
5. Quarterly review: see progress, choose new focus

---

## Phase 1: Dashboard Form

1. User opens dashboard
2. "Weekly Check-In" card shows 3 focus questions
3. User answers inline (number inputs, dropdowns, text)
4. Submit → Updates charts, shows completion summary
5. Streak tracking and weekly history visible

---

## Phase 2: WhatsApp Delivery

See `features/whatsapp/SPEC.md` for full WhatsApp flow.

- System sends Question 1 via WhatsApp
- User replies → System confirms, sends Question 2
- Repeat for Question 3
- System sends completion summary + streak

**Frequency:** Sunday 9 AM (user's timezone)
**Cost:** ~$2-3 per user per year

---

## Success Metrics

- Weekly completion rate: 80%+
- Average response time: <2 minutes
- Quarterly retention: 90%+ continue to Q2
