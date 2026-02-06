# Hook Assessment - Feature Spec

**Status:** V4 questions drafted
**Source:** Extracted from CEO_LAB_ASSESSMENT_V4.md Section F

---

## Overview

12 items, ~5 minutes. Free entry point, no account needed. Creates "aha" moment, drives signup.

**Coverage:** One item per territory pair, covering all 15 dimensions through the strongest single indicator per dimension.

**Scoring:** 48 points total (16 per territory). Each item scored 1-4.

**Expected conversion:** 10-15% of completers sign up for paid.

---

## V4 Hook Questions

**Leading Yourself (4 items):**

**H01** (LY.1+LY.2): In the past week, when something frustrated you at work, how quickly did you recognize what was really going on underneath the frustration?
[1 = I didn't / 2 = After the fact / 3 = Within a few hours / 4 = Within minutes]

**H02** (LY.3): In the past week, how often did you feel genuinely present and undistracted during your most important conversations?
[1 = Almost never / 2 = Once or twice / 3 = About half the time / 4 = Most of the time]

**H03** (LY.4+LY.5): In the past week, what percentage of your working time was spent on work that only you could do, versus meetings, email, and firefighting?
[1 = Less than 20% deep work / 2 = 20-40% / 3 = 40-60% / 4 = More than 60%]

**Leading Teams (4 items):**

**H04** (LT.1): In the past month, how many times did someone on your team bring you bad news proactively (before you had to discover it)?
[1 = Never / 2 = Once / 3 = A few times / 4 = Regularly]

**H05** (LT.2+LT.3): Think of the last time a team conflict or performance issue needed your attention. How did you handle it?
[1 = Haven't addressed it yet / 2 = Addressed it but weeks later / 3 = Addressed it within a few days / 4 = Addressed it same week with curiosity about root causes]

**H06** (LT.4+LT.5): If you left for two weeks with no contact, how would your team function?
[1 = Major problems / 2 = Things would slow significantly / 3 = Most things would continue / 4 = Smoothly, with clear systems in place]

**Leading Organizations (4 items):**

**H07** (LO.1): If you asked five random employees to describe your company's strategy in one sentence, how consistent would their answers be?
[1 = Very different / 2 = Somewhat similar / 3 = Mostly aligned / 4 = Nearly identical]

**H08** (LO.2): In the past month, did you address a cultural norm violation by a strong performer?
[1 = No, and I tolerated the behavior / 2 = No, but I planned to / 3 = Yes, indirectly / 4 = Yes, directly and promptly]

**H09** (LO.3+LO.4): How different is your daily work today compared to 12 months ago?
[1 = Essentially the same / 2 = Slightly different / 3 = Noticeably different / 4 = Fundamentally different, reflecting company growth]

**H10** (LO.5): How would you describe your board communication?
[1 = Mostly performance updates / 2 = Honest about wins, careful about challenges / 3 = Open about most things / 4 = Radically candid, including my own uncertainties]

---

## Output

- Snapshot scores across 3 territories
- Top strength identified
- Biggest blind spot identified
- CTA: "This is your snapshot. Get your full CEO Profile + year-long tracking for €100/month"

---

## UX Flow

1. User clicks "Take Free Assessment" on landing page
2. Redirects to `/assessment/hook`
3. User answers 12 questions (client-side state)
4. On submit → POST `/api/assessment/hook`
5. API calculates scores, saves to DB
6. Redirects to `/assessment/hook/results` with scores
7. Results page shows scores + CTA to subscribe
8. Click "Get Full Profile" → `/checkout`

---

## Note
V4 reduced to 10 hook questions (from V3's 12) to cover 15 dimensions via paired items. Implementation may need to adjust from 12 to 10 questions.
