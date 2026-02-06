# CEO Lab Rebuild Plan

**Date:** 2026-02-06
**Purpose:** Prep work for Niko + you before restarting the code

---

## What's Happening

We're keeping the backend (auth, Stripe, database, API routes, WhatsApp) and redoing everything after login: dashboard, results, visualizations, and swapping in new questions. The strategies, assessment architecture, and accountability agent design all carry over.

---

## The Problem Right Now

There are **3 different naming systems** in the project. This must be resolved first.

### Name Conflicts

| # | In Code (`scoring.ts`) | In Assessment Doc | In Dashboard Strategy (V3) |
|---|---|---|---|
| 1 | Energy Management | Energy Management | Energy Architecture |
| 2 | Self-Awareness | Self-Awareness | Self-Awareness |
| 3 | Above the Line | Leading above the Line | Leading above the Line |
| 4 | **Emotional Fluidity** | **Emotional Intelligence** | **Emotional Intelligence** |
| 5 | **Contemplative Practice** | **Grounded Presence** | **Grounded Presence** |
| 6 | **Stress Design** | **Purpose & Direction** | **Purpose & Direction** |
| 7 | Trust Formula | Trust Formula | Trust Scaffolding |
| 8 | Psychological Safety | Psychological Safety | (not listed separately) |
| 9 | Multiplier Behavior | Multiplier Behavior | Multiplier Behavior |
| 10 | Communication Rhythm | Communication Rhythm | Communication Rhythm |
| 11 | Team Health | Team Health | Team Health |
| 12 | Accountability & Delegation | Accountability & Delegation | Delegation Load |
| 13 | Strategic Clarity | Strategic Clarity | Strategic Clarity |
| 14 | Culture as System | Culture as System | Culture as System |
| 15 | Three Transitions | Three Transitions | (not in V3 list) |
| 16 | Systems Thinking | Systems Thinking | Systems Thinking |
| 17 | Organizational Design | Organizational Design | Organizational Design |
| 18 | Board & Governance | Board & Governance | Governance Alignment |

**Bold = conflicts that must be resolved.**

The V3 dashboard strategy introduced "proprietary" names (Trust Scaffolding, Energy Architecture, Delegation Load, Execution Rigor, Feedback Loops, Governance Alignment) but the assessment doc kept the original names. These need to be ONE list.

---

## Step 1: Lock the 18 Dimension Names (Niko decides)

**Time needed:** 30 minutes

Niko picks ONE name per dimension. No going back after this. Everything in the product uses these names: questions, scoring, database, dashboard, reports, WhatsApp.

Fill in the "Final Name" column:

| # | Territory | Current Name | Final Name |
|---|---|---|---|
| 1 | Yourself | Energy Management | _________________ |
| 2 | Yourself | Purpose & Direction | _________________ |
| 3 | Yourself | Self-Awareness | _________________ |
| 4 | Yourself | Leading above the Line | _________________ |
| 5 | Yourself | Emotional Intelligence | _________________ |
| 6 | Yourself | Grounded Presence | _________________ |
| 7 | Teams | Trust Formula / Trust Scaffolding | _________________ |
| 8 | Teams | Psychological Safety / Feedback Loops | _________________ |
| 9 | Teams | Multiplier Behavior | _________________ |
| 10 | Teams | Communication Rhythm | _________________ |
| 11 | Teams | Team Health | _________________ |
| 12 | Teams | Accountability & Delegation / Delegation Load | _________________ |
| 13 | Orgs | Strategic Clarity | _________________ |
| 14 | Orgs | Culture as System | _________________ |
| 15 | Orgs | Three Transitions / Execution Rigor | _________________ |
| 16 | Orgs | Systems Thinking | _________________ |
| 17 | Orgs | Organizational Design | _________________ |
| 18 | Orgs | Board & Governance / Governance Alignment | _________________ |

**Tip for Niko:** The V3 "proprietary" names (Trust Scaffolding, Energy Architecture, etc.) sound more premium and Konstantin-Method-specific. The assessment doc names are clearer and more recognizable. Pick what feels right for users seeing their results.

---

## Step 2: Write the Questions (Niko writes, you format)

**Time needed:** 2-3 hours

Three question sets needed. Use the tables below as the format - this is exactly what gets turned into code.

### 2A. Hook Questions (12 questions)

Free entry point. 4 per territory. Multiple choice, 4 options each (1-4 points).

These need to create an "aha" moment in 5 minutes. Each question should make the CEO think "I never measured that before."

| # | Territory | Dimension | Question | Option A (1pt) | Option B (2pt) | Option C (3pt) | Option D (4pt) |
|---|---|---|---|---|---|---|---|
| 1 | Yourself | [dim 1] | | | | | |
| 2 | Yourself | [dim 2] | | | | | |
| 3 | Yourself | [dim 3] | | | | | |
| 4 | Yourself | [dim 4] | | | | | |
| 5 | Teams | [dim 7] | | | | | |
| 6 | Teams | [dim 8] | | | | | |
| 7 | Teams | [dim 9] | | | | | |
| 8 | Teams | [dim 10] | | | | | |
| 9 | Orgs | [dim 13] | | | | | |
| 10 | Orgs | [dim 14] | | | | | |
| 11 | Orgs | [dim 15] | | | | | |
| 12 | Orgs | [dim 16] | | | | | |

**Note:** Pick 4 of 6 dimensions per territory for the hook. Not all 6 need to appear - choose the ones that land hardest.

### 2B. Baseline Questions (100 questions)

Paid assessment. 5-6 questions per dimension. 5-point scale (1-5). Assigned to stages.

**Distribution:**
- Stage 1 (Q1-30): 1-2 questions per dimension - broad coverage
- Stage 2 (Q31-60): 1-2 more per dimension - deeper
- Stage 3 (Q61-100): 2-3 more per dimension - comprehensive

| # | Stage | Territory | Dimension | Question | 1 (Strongly Disagree) | 2 | 3 (Neutral) | 4 | 5 (Strongly Agree) |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 1 | Yourself | [dim 1] | | | | | | |
| 2 | 1 | Yourself | [dim 2] | | | | | | |
| ... | | | | | | | | | |
| 100 | 3 | Orgs | [dim 18] | | | | | | |

**Question writing tips for Niko:**
- Behavioral > theoretical ("How often do you..." not "Do you believe...")
- Specific > vague ("In the last 2 weeks..." not "Generally...")
- Each question should measure ONE thing
- Avoid double-barrel questions ("Do you delegate AND communicate well?")
- Mix positive and negative framing to prevent pattern-answering

### 2C. Weekly Questions (18 questions)

One per dimension. User picks 3 per quarter. Same question repeated weekly for 12 weeks.

| # | Territory | Dimension | Question | Input Type | Options (if select) |
|---|---|---|---|---|---|
| 1 | Yourself | [dim 1] | | number / select / yesno | |
| 2 | Yourself | [dim 2] | | number / select / yesno | |
| ... | | | | | |
| 18 | Orgs | [dim 18] | | number / select / yesno | |

**Input types:**
- `number` = user types a number (e.g., "How many hours of deep work?")
- `select` = pick from options (e.g., "Mostly questions / Balanced / Mostly answers")
- `yesno` = binary (e.g., "Did you hold your weekly tactical?")

---

## Step 3: Plan the Dashboard (Together, on paper)

**Time needed:** 1-2 hours

The V3 strategy has 16 sections. That's too many for launch. Pick which ones are MVP.

### Dashboard Sections - Priority Decision

Rate each: **MUST** (launch), **NEXT** (month 2), **LATER** (phase 2+)

| # | Section | What It Shows | Priority |
|---|---|---|---|
| 1 | **Hero Score Card** | Overall score + 3 territory rings + peer comparison | _______ |
| 2 | **Konstantin Method Map** | Visual map of all 18 dimensions by territory | _______ |
| 3 | **Territory Scores** | 3 territories with progress bars + short insights | _______ |
| 4 | **Sub-Dimension Heatmap** | 18-cell color grid, clickable for details | _______ |
| 5 | **Leadership Signature** | Radar chart (18 points) with optional peer overlay | _______ |
| 6 | **Hidden Patterns** | AI-generated insights from score patterns | _______ |
| 7 | **Decision Friction Index** | % of decisions routing through you vs healthy benchmark | _______ |
| 8 | **Leadership Debt** | Gap between highest and lowest dimensions | _______ |
| 9 | **Question Drivers** | Click to see which answers drove each score | _______ |
| 10 | **12-Week Trends** | Line charts of weekly check-in data over quarter | _______ |
| 11 | **Benchmark Distribution** | Your score vs peer cohorts with distribution curve | _______ |
| 12 | **Leadership Wrapped** | Spotify-style: Biggest Growth, Most Consistent, Largest Drop | _______ |
| 13 | **Metrics Library** | 12 KPI tiles with key numbers | _______ |
| 14 | **Leverage Matrix** | Impact vs Control 2x2 for dimensions | _______ |
| 15 | **"If I Were Your Coach"** | 3 specific interventions ranked by leverage | _______ |
| 16 | **Your Next 30 Days** | 3 priority actions based on scores | _______ |

**My recommendation for MVP:**

| Must Have (Launch) | Next (Month 2) | Later |
|---|---|---|
| 1. Hero Score Card | 6. Hidden Patterns | 7. Decision Friction Index |
| 3. Territory Scores | 9. Question Drivers | 11. Benchmark Distribution |
| 4. Sub-Dimension Heatmap | 10. 12-Week Trends | 12. Leadership Wrapped |
| 5. Leadership Signature | 13. Metrics Library | 14. Leverage Matrix |
| 8. Leadership Debt | | |
| 15. "If I Were Your Coach" | | |
| 16. Your Next 30 Days | | |

That gives 7 sections for launch. Enough to impress, not so many that quality drops.

### For Each MVP Section, Sketch These

For each section you mark as MUST, write down:

**Section name:**
- What score/data does it use? (which dimensions, what calculation)
- What should the user FEEL when they see it?
- One sentence of what it looks like (layout, not design)

Example:
> **Leadership Debt**
> - Data: Difference between highest and lowest sub-dimension percentages
> - Feel: "Oh, I didn't realize how uneven I am"
> - Layout: Big number (e.g., "34-point gap") with the two dimension names below it

---

## Step 4: Decide Peer Benchmarks (Quick decision)

**Time needed:** 15 minutes

The dashboard shows "You vs Peers" in several places. For launch:

**Option A:** Hardcode reasonable benchmarks based on Niko's coaching experience
- "Average CEO scores 62% on Leading Yourself"
- Pro: Fast, no data dependency
- Con: Not real data

**Option B:** No peer data at launch, add when 50+ users exist
- Pro: Honest
- Con: Dashboard feels emptier

**Option C:** Use Niko's coaching client data (anonymized) as initial benchmark
- Pro: Real data from real CEOs
- Con: Needs Niko to calculate averages from past assessments

Pick one: _________________

If Option A or C, fill in benchmark scores:

| Dimension | Peer Average (%) |
|---|---|
| 1. [dim name] | ___% |
| 2. [dim name] | ___% |
| ... | |
| 18. [dim name] | ___% |

---

## Step 5: Accountability Agent Setup Questions

**Time needed:** 30 minutes

After baseline, users set up their accountability agent. Niko needs to provide:

**For each of the 18 dimensions, write 2-3 example questions a user might ask themselves weekly:**

Example for Energy Management:
- "How many hours of deep work did I complete this week?"
- "Which energy practices did I do this week?" (multi-select)
- "How many days did I protect my morning focus block?"

These become the **suggestions** users see when setting up their agent. Users can also write custom questions.

---

## What to Bring Back

When you're ready to restart coding, bring this document with these filled in:

- [ ] **Step 1 complete:** 18 final dimension names (locked, no changes)
- [ ] **Step 2A complete:** 12 hook questions in table format
- [ ] **Step 2B complete:** 100 baseline questions in table format with stage assignments
- [ ] **Step 2C complete:** 18 weekly questions in table format
- [ ] **Step 3 complete:** Dashboard sections prioritized (MUST/NEXT/LATER) with sketches for MUST sections
- [ ] **Step 4 complete:** Peer benchmark decision + numbers if applicable
- [ ] **Step 5 complete:** 2-3 example accountability questions per dimension

---

## What Happens After (The Code Rebuild)

Once you bring back the completed plan, here's what gets built:

### Phase 1: Foundation Reset (Week 1)
1. Update `lib/scoring.ts` with final 18 dimension names
2. Swap all 3 question files (hook, baseline, weekly)
3. Update database if dimension names changed
4. Clean up unused code (delete `/elegant`, `/nova`, `/beautiful`, `/debug`, `backup_original_design/`, `01_chatgpt app/`, `landing-design/`)

### Phase 2: Dashboard Build (Weeks 2-3)
5. Build each MVP dashboard section as a standalone component
6. Wire up to real score data from Supabase
7. Add drill-down modals for heatmap cells
8. Build the "If I Were Your Coach" logic
9. Build the "Next 30 Days" logic

### Phase 3: Polish + Accountability Agent (Weeks 4-5)
10. Accountability Agent setup wizard (3-step modal)
11. Weekly WhatsApp integration with custom questions
12. Dashboard tracking charts for accountability responses
13. Landing page update with new copy
14. Mobile responsive pass on all new sections

### Phase 4: Testing + Launch
15. Internal testing (Niko + small group)
16. Fix issues
17. Launch to newsletter

---

## Quick Reference: What's Staying in the Code

These are solid and don't need changes (unless dimension names change in the database):

- `/auth` + `/auth/callback` - Google OAuth + magic link
- `/api/checkout` - Stripe €100/month
- `/api/webhooks` - Stripe subscription management
- `/api/baseline/save-v2` - Assessment save + score calculation
- `/api/baseline/responses` - Hook assessment save
- `/api/focus/save` - Quarterly focus save
- `/api/checkin/save` - Weekly check-in + streaks
- `/api/whatsapp/webhook` - WhatsApp integration
- `lib/supabase-browser.ts` + `lib/supabase.ts` - DB clients
- `lib/stripe.ts` - Stripe client
- `types/assessment.ts` - TypeScript interfaces
- All database tables and schema
- WhatsApp flows system
- Legal pages (privacy, terms, refund)

---

**End of plan. Fill in the blanks, come back, and we build.**
