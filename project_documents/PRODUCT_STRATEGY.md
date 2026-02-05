# CEO Lab - Project Master Document

**Last Updated:** 2026-02-04

This is the living document for CEO Lab. Everything about the project lives here: strategy, positioning, roadmap, timeline, decisions, and open questions. Update this after every major conversation or decision.

---

## Project Summary

**What It Is:**
CEO Lab is a premium accountability platform that helps founders and CEOs develop self-leadership through systematic measurement and tracking. It's built on the Konstantin Method - 60+ battle-tested frameworks for leadership development.

**Who It's For:**
- First-time founders who don't feel like "natural" CEOs
- Technical specialists now leading teams/companies
- High-earning solo entrepreneurs ($200k+) treating their career as a business
- Series A/B CEOs anxious about AI disruption and uncertain about their competitive edge

**The Core Problem:**
In times of extreme change, founders don't know if they're actually getting better as leaders. Success doesn't equal competence validation. Without measurement, anxiety drives decisions instead of strategy.

**The Solution:**
CEO Lab provides what's missing - a "CEO mirror" that objectively reflects how you're doing:
1. **Baseline Assessment** - Digital coach that measures 5-7 core leadership dimensions
2. **Weekly Check-Ins** - 3 questions via WhatsApp tracking behavioral change
3. **Progress Dashboard** - Visual score trends showing improvement over time
4. **Prescribed Content** - Frameworks automatically recommended based on identified gaps
5. **AI-Generated Insights** - Monthly/quarterly/annual reports showing patterns and growth

**What Makes It Different:**
- **Accountability-first, not content library** - The value is measurement and tracking, not PDF access
- **Niko's unique approach** - Bridges hard measurement (structure, metrics, business lens) with spiritual depth (stillness, nervous system, presence)
- **Prescribed, not browsed** - Content surfaces based on data, not self-directed exploration
- **Premium positioning** - ~€100/month, coherent with cognitive load and target audience

**Core Insight:**
The only reliable competitive edge in the AI age is continuous adaptation. But you can't adapt if you don't have measurement. CEO Lab makes leadership development measurable.

**Business Model:**
Premium subscription (~€100/month) targeting 3000 newsletter subscribers for launch. Conservative goal: 30-60 paid subscribers month 1. Key success metric: 80%+ weekly check-in completion rate.

**Current Status:** Assessment architecture complete. Dashboard design refined based on competitive analysis. Ready for V3 implementation combining strategic depth with visual interactivity.

---

## Project Status

**Current Phase:** Design Complete → Moving to Technical Implementation
**Launch Target:** 8 weeks from development start
**Next Milestone:** Niko reviews all 130 questions, technical spec document created
**Completion:**
- ✅ Assessment architecture finalized (100 questions, 3 stages, 60% milestone)
- ✅ All 130 questions drafted (12 hook + 100 baseline + 18 weekly)
- ✅ Weekly check-in system designed (WhatsApp, quarterly focus)
- ✅ Dashboard visualization designed
- ✅ Framework prescription logic defined
- ✅ Coupon code system implemented (Stripe promotion codes for free access & discounts)
- ⏳ Pending: Niko review and approval
- ⏳ Pending: Technical implementation

---

## CEO Lab Refinement Checklist

**Source:** Moritz + Alex feedback
**Purpose:** Strategic guidance for all product decisions

### 1. Target & Positioning
- [ ] Aim at founders/CEOs who don't feel like "natural" CEOs
- [ ] Explicitly speak to high-paid specialists anxious about AI disrupting their roles
- [ ] Core framing: "Be the CEO of your career" / "Your career is a business; run it like one"
- [ ] Emphasize self-leadership, adaptation, communication as the only reliable edge in the AI age

### 2. Value Proposition & Differentiation
- [ ] Present CEO Lab as a "CEO mirror" that objectively reflects how you're actually doing
- [ ] Highlight Nico's unique mix:
  - [ ] Hard measurement + objective business lens
  - [ ] Stillness / spiritual / nervous-system depth
- [ ] Show how it bridges:
  - [ ] Masculine: structure, metrics, accountability
  - [ ] Feminine: presence, inner work, non-measurement parts of life

### 3. Product Scope & Roadmap
- [ ] Start with **individuals** (CEOs, founders, serious entrepreneurs)
- [ ] Defer company-wide product (SLAs, infra, tech ops) to later; don't lock yourself into running technical systems full-time
- [ ] Use a **free/light initial assessment** as the funnel:
  - [ ] "What's your #1 obstacle as a leader right now?" → then lead into full assessment

### 4. Pricing
- [ ] Position as **premium** (around €100/month, not €15/month SaaS)
- [ ] Make price coherent with:
  - [ ] Cognitive load and seriousness of the work
  - [ ] Premium brand & CEO target
- [ ] If you adjust, stay in a premium band (e.g. ~€80–100), not "cheap tool"

### 5. Messaging & Copy
- [ ] Speak directly to a person, not just list abstractions
  - [ ] Replace generic benefit lines like "consistent accountability, measurable growth" with:
    - [ ] "Become more consistent and accountable"
    - [ ] "See your progress and growth measured over time"
- [ ] Call out:
  - [ ] First-time founders
  - [ ] Technical or specialist leaders suddenly running teams/companies
  - [ ] High-earning solo founders

### 6. Use-cases & Outputs
- [ ] Design outputs CEOs can *use*:
  - [ ] For their own performance reviews
  - [ ] As signal when aiming for very high-level roles
- [ ] Make the yearly report feel like **Spotify Wrapped** for leadership/personal goals
- [ ] Offer optional **shareable snapshots** (monthly/quarterly/yearly) people can choose to post publicly ("follow my progress on CEO Lab")

### 7. Audience Breadth
- [ ] Support:
  - [ ] Formal CEOs and founders
  - [ ] High-earning entrepreneurs with their own projects
  - [ ] People tracking more "personal" metrics (health, nature, time, etc.) as legitimate performance data

### 8. Execution & Your Role
- [ ] Treat CEO Lab as a proof piece that you can:
  - [ ] Spot high-value opportunities
  - [ ] MVP them
  - [ ] **Ship** and get usage/revenue
- [ ] Prioritize:
  - [ ] Launching a narrow but real v1
  - [ ] Getting first paying users and iterating
- [ ] If you delegate:
  - [ ] Keep scopes tight and profit-oriented
  - [ ] Avoid "many experiments + spend, no profit" over the year

---

## Core Product Definition

**CEO Lab is an accountability platform that helps founders develop self-leadership through measurement and regular tracking.**

**Primary Value:** Accountability + measurement (not content access)

**Secondary Value:** Frameworks and toolkits that support weak areas (prescribed based on data, not browsed)

---

## Product Architecture (FINALIZED)

### Complete Assessment System

**Total Question Bank: 130 questions**
- 12 Hook questions (free entry point)
- 100 Baseline questions (staged across 3 sessions)
- 18 Weekly tracking questions (one per sub-dimension)

---

## Dashboard Design Strategy (Updated 2026-02-04)

### Design Philosophy

**Core Principle:** Strategic depth + visual interactivity

**V3 Approach:** Merge ChatGPT's clean, sophisticated design with our visual density and interactive features.

### Key Design Decisions

#### **1. Visual Style**
- **Base:** ChatGPT's cleaner, more sophisticated aesthetic
- **Enhancement:** Keep all visualizations (charts, rings, radar, heatmap)
- **Typography:** More whitespace, bigger headlines, tighter hierarchy
- **Layout:** Card-based with subtle borders, not heavy boxes
- **Colors:** Beige background (#F7F3ED), accent colors for territories only (blue/green/orange)

#### **2. Strategic Sections to Add**

**Decision Friction Index**
- Shows % of organizational decisions routing through CEO
- Benchmark comparison (e.g., "41% vs 28% healthy")
- Primary drivers identified (Communication Rhythm, Delegation, Governance)
- Impact statement on business velocity
- Horizontal bar visualization

**Leadership Debt**
- Gap between highest and lowest sub-dimensions
- Shows organizational inconsistency
- Simple number display (e.g., "30-point gap")
- Explains cost of inconsistency

**"If I Were Your Coach"**
- 3 specific interventions ranked by leverage
- Each includes: Current state, Target, Expected lift, Timeline
- No sliders or what-if scenarios (removed for now)
- Clear prescriptive recommendations

**Leadership Wrapped**
- Spotify-style annual highlights
- Three cards: Biggest Growth, Most Consistent, Largest Drop
- Dimension names + score changes
- Shareable, emotional, memorable

#### **3. Peer Comparisons (Enhanced)**

**Current (weak):** Basic "You: 76, Peer: 71" text

**V3 (enhanced):**
- Multiple cohort filters (All CEOs, Series A, SaaS, Team Size 20-50)
- Show your score vs each cohort median
- Contextual interpretation ("Your advantage narrows in Series A cohort")
- Visual distribution curve with your marker
- Percentile within each cohort
- Integrated throughout dashboard (not just one section)

**Show peer context everywhere:**
- Hero score card: Distribution bar with peer median
- Territory cards: "Your cohort median: 72 (+2 advantage)"
- Heatmap cells: "Peer: 74 (-6 gap) ← Blind spot"
- Radar chart: Ghost overlay of peer median (toggleable)

#### **4. Removed/Postponed**

**What-If Scenarios:** Removed
- Current implementation looks unpolished
- Projections not accurate enough yet
- May revisit in Phase 3 with better modeling

**Historical Comparison Toggle:** Simplified
- Don't need toggle for every chart
- Integrate naturally where it adds value
- Show in Leadership Wrapped and trend charts only

#### **5. Proprietary Language (Konstantin Method)**

**No external framework mentions:**
- ❌ Don't mention: Trust Formula, Drama Triangle, 5 Dysfunctions, CEO Test
- ✅ Use instead: Konstantin Method proprietary concepts

**Proprietary terminology:**

**Leading Yourself:**
- Energy Architecture
- Purpose & Direction
- Self-Awareness
- Leading above the Line
- Emotional Intelligence
- Grounded Presence

**Leading Teams:**
- Trust Scaffolding
- Delegation Load
- Feedback Loops
- Multiplier Behavior
- Team Health
- Communication Rhythm

**Leading Organizations:**
- Strategic Clarity
- Execution Rigor
- Systems Thinking
- Culture as System
- Organizational Design
- Governance Alignment

#### **6. Section Structure (V3 Final)**

1. Hero (score card + 3 rings + peer comparison bar)
2. Konstantin Method Map (proprietary concepts, domain cards)
3. Territory Scores (progress bars + insights)
4. Sub-Dimension Heatmap (clickable cells with drill-down)
5. Leadership Signature (radar chart with peer overlay option)
6. Hidden Patterns (punchier AI insights)
7. **Decision Friction Index** (new)
8. **Leadership Debt** (new)
9. Question Drivers (with click-to-explore)
10. 12-Week Trends (line charts)
11. Benchmark Distribution (enhanced peer comparison)
12. **Leadership Wrapped** (new)
13. Metrics Library (12 KPI tiles)
14. Leverage Matrix (Impact vs Control)
15. **"If I Were Your Coach"** (new)
16. Your Next 30 Days (3 priority actions)

**Total:** 16 sections (4 new, 12 enhanced)

### Implementation Notes

**Design Base:**
- Use ChatGPT's spacing and hierarchy as foundation
- Apply to all our existing visual components
- No custom inline styles - use design system
- Card-based layout throughout

**Interactive Features to Keep:**
- Click any heatmap cell → modal with details
- Click question drivers → see contributing questions
- Hover states with contextual info
- Smooth animations and transitions

**Interactive Features to Remove:**
- What-if scenario sliders
- Historical comparison toggles
- Excessive hover states

**Technical:**
- Keep all canvas/SVG visualizations
- Enhance modal system for drill-downs
- Better loading states and animations
- Responsive design for mobile

### Success Metrics

**User feedback should be:**
- "This is sophisticated" (design quality)
- "I can explore everything" (interactivity)
- "I didn't know that about myself" (insights)
- "I know exactly what to work on" (actionability)

**Technical metrics:**
- Dashboard load time: <2 seconds
- Mobile responsive: All sections usable on phone
- Accessibility: WCAG AA compliant

---

### 1. Hook Assessment (FREE - 12 questions, ~5 min)

**Purpose:** Create "aha" moment, show immediate value, drive signup

**Coverage:** 4 questions per territory (Leading Yourself, Leading Teams, Leading Organizations)

**Scoring:** 48 points total (16 per territory)

**Output:**
- Snapshot scores across 3 territories
- Top strength identified
- Biggest blind spot identified
- CTA: "This is your snapshot. Get your full CEO Profile + year-long tracking for €100/month"

**Expected conversion:** 10-15% of completers sign up

**See full questions:** [Hook Assessment Questions - Full List in Appendix A]

---

### 2. Baseline Assessment (PAID - 100 questions, staged)

**Purpose:** Comprehensive baseline across all 18 sub-dimensions

**Total:** 100 questions = 100 points per territory (300 total)
- Leading Yourself: 32 questions (60 points possible)
- Leading Teams: 35 questions (60 points possible)
- Leading Organizations: 33 questions (60 points possible)

**Structure:** 18 sub-dimensions across 3 territories

#### **Territory 1: Leading Yourself (32 questions)**
1. Energy Management (5 questions) - Protecting time for deep work and operating in optimal stress zone
2. Purpose & Direction (6 questions) - Knowing what drives you and aligning work with your zone of genius
3. Self-Awareness (5 questions) - Recognizing patterns, triggers, biases, and blind spots before they run you
4. Leading above the Line (6 questions) - Responding with curiosity instead of blame, victim, or hero mindsets
5. Emotional Intelligence (5 questions) - Identifying and navigating emotions in real-time without getting stuck or suppressing
6. Grounded Presence (5 questions) - Maintaining inner stillness and perspective, especially under pressure

#### **Territory 2: Leading Teams (35 questions)**
7. Trust Formula (6 questions)
8. Psychological Safety (6 questions)
9. Multiplier Behavior (6 questions)
10. Communication Rhythm (6 questions)
11. Team Health (6 questions)
12. Accountability & Delegation (5 questions)

#### **Territory 3: Leading Organizations (33 questions)**
13. Strategic Clarity (6 questions)
14. Culture as System (6 questions)
15. Three Transitions (6 questions)
16. Systems Thinking (5 questions)
17. Organizational Design (5 questions)
18. Board & Governance (5 questions)

---

### 3. Staged Delivery with 60% Milestone

**Key Innovation:** Break 100 questions into 3 stages with meaningful checkpoint at 60%

#### **Stage 1: Foundation (30 questions, ~20 min) → 30% Complete**
- Coverage: 1-2 questions per sub-dimension
- Establishes baseline across all 18 dimensions
- User CAN start weekly check-ins after this stage
- **Unlocks:** Snapshot scores, identify focus areas

#### **Stage 2: Depth (30 questions, ~20 min) → 60% COMPLETE** ✨
- Coverage: Add 1-2 more questions per sub-dimension
- More accurate scoring, better framework prescriptions
- **KEY MILESTONE - Most users complete to here**
- **Unlocks:**
  - Prescribed frameworks based on scores
  - Monthly AI-generated reports
  - Solid baseline for weekly tracking
  - User can confidently start weekly check-ins

#### **Stage 3: Comprehensive (40 questions, ~25 min) → 100% Complete** 🏆
- Coverage: Remaining 2-3 questions per sub-dimension
- Maximum depth and precision
- **Unlocks:**
  - Full comprehensive profile
  - Annual tracking eligibility
  - Quarterly deep-dive reassessments
  - Achievement: "Completion Master"

**See full questions:** [Baseline Assessment Questions - Full List in Appendix B]

---

### 4. Weekly Check-Ins (3 questions, ~3 min)

**Phase 1 Delivery:** Dashboard form (user self-reports weekly)

**Phase 2 Delivery:** WhatsApp automation (conversational, push-based)

**Frequency:** Weekly (user chooses when to complete in Phase 1, automated Sunday 9am in Phase 2)

**Phase 1 Format:**
1. User opens dashboard
2. "Weekly Check-In" card shows 3 focus questions
3. User answers inline (number inputs, dropdowns, text)
4. Submit → Updates charts, shows completion summary
5. Streak tracking and weekly history visible

**Phase 2 Format (WhatsApp):**
1. System sends Question 1 via WhatsApp
2. User replies (e.g., "6 hours")
3. System confirms, sends Question 2
4. User replies
5. System confirms, sends Question 3
6. User replies
7. System sends completion summary + streak

**Question Selection:**
- User chooses 3 sub-dimensions to focus on per quarter (Q1, Q2, Q3, Q4)
- Each sub-dimension has ONE signature question
- Same 3 questions repeated weekly for 12 weeks
- Builds clear trend data over quarter

**18 Signature Questions (Weekly Tracking Library):**

**Leading Yourself:**
1. Energy Management: "This week, how many hours of Deep Work did you complete?"
2. Purpose & Direction: "This week, did your work align with your zone of genius?"
3. Self-Awareness: "How many times did you catch yourself mid-pattern this week?"
4. Leading above the Line: "When problems arose, did you respond with blame or curiosity?"
5. Emotional Intelligence: "How many times did you name your emotion in real-time?"
6. Grounded Presence: "How many days did you maintain stillness practice this week?"

**Leading Teams:**
7. Trust Formula: "How many commitments did you keep vs. break this week?"
8. Psychological Safety: "How fast did bad news reach you this week?"
9. Multiplier Behavior: "Did you ask more questions or give more answers in meetings?"
10. Communication Rhythm: "Did you hold your weekly tactical meeting?"
11. Team Health: "Did your team have healthy conflict this week?"
12. Accountability: "What % of decisions required your approval this week?"

**Leading Organizations:**
13. Strategic Clarity: "Did you review your strategy this week?"
14. Culture as System: "Did you actively shape culture this week?"
15. Three Transitions: "What % of time did you spend working ON vs. IN?"
16. Systems Thinking: "Did you see patterns or isolated incidents?"
17. Organizational Design: "Did your org structure support or hinder execution?"
18. Board & Governance: "Did you proactively use your board this week?"

**Example User Journey:**
- **Week 1-12 (Q1):** Energy Management, Trust Formula, Strategic Clarity questions
- **Quarterly Review:** See progress, choose Q2 focus
- **Week 13-24 (Q2):** Trust (keep), Emotional Fluidity (new), Three Transitions (new)
- **Repeat quarterly**

**Technical Implementation:**
- Twilio WhatsApp API integration
- Webhook receives user responses
- Parse and normalize responses
- Store in database, update scores
- Send next question or completion message

**Cost:** ~$2-3 per user per year in WhatsApp messaging

---

### 5. Dashboard & Visualization

**Two Main Views:**

#### **5.1 Baseline Profile (Heatmap)**
- All 18 sub-dimensions displayed
- Color-coded: Red (0-30%), Yellow (30-60%), Green (60-80%), Blue (80-100%)
- Shows overall territory scores
- Updated when baseline is retaken (quarterly/annually)

#### **5.2 Weekly Tracking (Trend Charts)**
- Line graphs for 3 focus areas
- Shows weekly data points over 12-week quarter
- Comparison to baseline score
- Trend indicators (↗️ improving, → stable, ↘️ declining)
- Average, peak week, consistency rate
- AI-generated insights per dimension

**Example Visualization:**
```
📊 ENERGY MANAGEMENT
Baseline: 24% → Current Trend: 52% (↑28%)

Weekly Deep Work Hours:
Week: 1  2  3  4  5  6  7  8  9 10 11 12
      ●  ●  ●  ●  ●  ●  ●  ●
      4  6  8 10  8 12 14 18

Average: 9.5 hours/week
Trend: ↗️ Improving (+187% from Week 1)
Best week: Week 8 (18 hours)
Consistency: 8/8 weeks tracked

💡 Insight: You've doubled your Deep Work capacity.
Keep protecting those focus blocks!
```

---

### 6. Progress Reports

#### **6.1 Weekly Completion Summary (WhatsApp)**
Sent immediately after 3rd question answered:
```
All done! ✅ Week 8 complete.

Quick summary:
• Deep Work: 18 hours (↑ from last week's 14)
• Commitments: 100% kept (↑ from 86%)
• Strategy Review: Yes (✓ 3 weeks in a row)

See full insights: [dashboard link]
Keep going! 🔥 8-week streak
```

#### **6.2 Monthly Report (AI-Generated)**
- Patterns observed across 3 focus areas
- Score trends for the month
- Behavioral insights
- Framework recommendations
- Celebration of wins

#### **6.3 Quarterly Deep-Dive**
- Re-assess 18 questions (3 focus areas × 6 questions each)
- Show 12-week progress: Baseline → Current
- Score change per focus area
- Choose Q2 focus areas
- Quarterly achievement badge

#### **6.4 Annual Comprehensive ("Spotify Wrapped")**
- Full 100-question re-assessment
- Year-over-year comparison
- Biggest growth area
- Most consistent dimension
- Weekly completion rate (X/52 weeks)
- Shareable snapshot (optional)
- "You improved X% this year"

---

### 7. Content Library (Supporting Role)

**Structure:** 73 playbooks from Konstantin Method mapped to 18 sub-dimensions

**Prescription Logic:**
- User completes baseline
- Low score in sub-dimension (e.g., Trust Formula = 12/30)
- Dashboard shows: "Recommended Framework: Trust Formula"
- User clicks → Opens PDF/module
- Track engagement: Did they open it? Did score improve?

**Framework Delivery (MVP):**
- PDF downloads from Supabase Storage
- 3-min video summary per framework (optional Phase 2)
- Clear CTA: "Want to go deeper? Book 1-on-1 with Niko"

**Positioning Niko for Hire:**
- Every framework page shows: "From Nikolas Konstantin's coaching library"
- Sidebar: "Work Directly with Niko" section with booking link
- Monthly reports footer: CTA to book discovery call
- Annual wrap-up: "Ready to accelerate with 1-on-1 coaching?"

**The Funnel:**
Newsletter (3,000) → CEO Lab Hook (free) → CEO Lab Paid (€100/mo) → 1-on-1 Coaching (€15k)

---

## Target Anxieties

### The Core Problem
Founders don't know if they're actually getting better as leaders. They're busy, they're shipping, but they have no objective measurement of growth.

### Specific Anxieties We Address

**"Am I becoming the leader this company needs?"**
- Imposter syndrome
- No feedback loop at the top
- Success ≠ competence validation

**"How do I know where to focus?"**
- Everything feels urgent
- No clear priorities for self-development
- Analysis paralysis

**"Am I behind?"**
- FOMO on AI, trends, tools
- Constant comparison to other founders
- Anxiety-driven decision making vs strategic focus

**"What's my competitive edge?"**
- Old advantages (network, credentials, past success) feel less reliable
- Everyone has access to same tools/info
- Unclear what actually matters

### The Insight
In times of extreme change and abundance, **the only reliable competitive edge is continuous adaptation.**

Not your product. Not your network. Not what you know today. **Your ability to adapt.**

But you can't adapt if you don't have measurement.

---

## Positioning & Messaging

### Key Messaging Pillars

**1. You Don't Know Where You Are**
- Traditional markers of success don't work anymore
- Everyone has AI, but nobody feels safe
- Measurement is missing from leadership development

**2. Frameworks as Rituals**
- Rituals structure space and time
- They convert anxiety into productive action
- They give your mind objective ways to measure progress
- Better than doomscrolling or adding another tool to your stack

**3. Self-Leadership is the Core Skill**
- When overwhelmed: step away from the computer, sit in silence
- That's better than adding new software
- Self-leadership > everything else

**4. Continuous Adaptation is the Edge**
- Not about what you know today
- About how fast you can see blind spots and adjust
- Requires measurement + accountability

**5. "If You Go With Us, You'll Be Able to Adapt"**
- This is the promise
- Not "here's 50 PDFs"
- "Here's a system that ensures you're getting better"

---

## What Makes Someone Successful in CEO Lab?

**Success Metrics:**
1. **High check-in completion rate** (80%+ weekly completion)
2. **Measurable score improvement** over 3-6 months
3. **Behavioral change tracked in weekly responses**
4. **Engagement with prescribed content** when gaps are identified
5. **Subjective feeling**: "I know where I stand now"

**Not success:**
- Number of PDFs downloaded
- Hours spent in content library
- Passive consumption without behavior change

---

## Product Questions (RESOLVED)

### Weekly Check-Ins Design ✅
- [x] **DECIDED:** User chooses 3 focus areas per quarter
- [x] **DECIDED:** Same 3 questions every week for 12 weeks (not rotating)
- [x] **DECIDED:** Quarterly review to adjust focus areas
- [x] **DECIDED:** Behavioral questions ("What did you DO this week?")
- [x] **DECIDED:** WhatsApp delivery (conversational, low-friction)

### Content Integration ✅
- [x] **DECIDED:** Frameworks automatically prescribed based on scores
- [x] **DECIDED:** Dashboard shows recommendations: "Your Trust score is low → Complete Trust Formula"
- [x] **DECIDED:** Users choose when to engage (not mandatory assignments)
- [x] **DECIDED:** Track engagement: Did they open it? Did score improve?
- [x] **DECIDED:** MVP = PDF downloads, Phase 2 = interactive modules

### Reporting ✅
- [x] **DECIDED:** Monthly report = patterns observed, score trends, insights, recommendations
- [x] **DECIDED:** Quarterly = 18-question re-assessment of focus areas, score progress, choose new focus
- [x] **DECIDED:** Annual = Full 100-question re-assessment, year-over-year comparison, "Spotify Wrapped" style

### Pricing/Tiers ✅
- [x] **DECIDED:** Free hook assessment (12 questions) + Paid comprehensive (€100/month)
- [x] **DECIDED:** No free tier with limited features
- [x] **DECIDED:** Assessment included in €100/month (not separate charge)
- [x] **DECIDED:** Baseline staged across 3 sessions with 60% milestone

---

## Competitive Positioning

**We are NOT:**
- A content library (like Masterclass, Maven)
- A coaching marketplace (like BetterUp)
- A generic assessment tool

**We ARE:**
- An accountability system with built-in measurement
- The "CEO of your own career" tracking platform
- Rituals + frameworks + measurement in one system

**Closest comps:**
- Whoop (but for leadership, not fitness)
- Duolingo (streak-based accountability, but for self-leadership)
- Spotify Wrapped (makes personal data meaningful and shareable)

---

## Launch Strategy (High Level)

### Target Audience
- 3000 newsletter subscribers (warm audience)
- Series A/B founders
- CEOs feeling overwhelmed/uncertain about growth

### Launch Sequence
1. Publish landing page with new positioning
2. Enable signups (likely paid-only to start)
3. Announce to newsletter
4. LinkedIn content series on "measurement in leadership"
5. Optional: Founding member discount for first 100

### Success Metrics
- Conservative: 30-60 paid subscribers in month 1
- Optimistic: 90-150 paid subscribers in month 1
- Key metric: 80%+ weekly check-in completion rate

---

## Technical Stack (FINALIZED)

### Frontend
- **Next.js 14** - Full-stack React framework with App Router
- **React** - UI library with Server Components + Client Components
- **TypeScript** - Type-safe development
- **ShadCN + Tailwind CSS** - Component library + utility-first styling
- **React Query (TanStack Query)** - Client-side data management, caching, and real-time sync

### Backend
- **Supabase** - Backend-as-a-service platform
  - PostgreSQL database
  - Real-time subscriptions
  - Row-level security (RLS)
  - Authentication (email/password, OAuth)
  - Storage (framework PDFs)
- **Supabase Edge Functions** - Serverless functions for webhooks and background jobs

### Integrations
- **Stripe** - Payment processing (€100/month subscriptions)
- **Twilio WhatsApp API** - Weekly check-in delivery
- **Vercel** - Hosting and deployment

### Data Management Pattern
- React Query wraps Supabase queries for caching and optimistic updates
- Supabase real-time invalidates React Query cache on data changes
- Best of both: Supabase handles backend + real-time, React Query handles client-side data layer

### Why This Stack?
- **Next.js:** SSR for landing page SEO, one codebase for frontend/API routes
- **ShadCN + Tailwind:** Pre-built accessible components, rapid UI development
- **React Query + Supabase:** Eliminates state management boilerplate, automatic cache invalidation on real-time updates
- **Supabase:** Zero backend code, instant API, real-time out of the box
- **Total cost:** ~$25-50/month until significant scale

### Deployment Strategy

**Two environments for safe, controlled releases:**

#### 1. Staging Environment
- **Purpose:** Internal testing during development and updates
- **Access:** Niko + development team only
- **Vercel:** `staging.ceolab.app` (auto-deploy from `develop` branch)
- **Supabase:** Separate staging project (isolated database)
- **Stripe:** Test mode with test cards
- **Twilio:** Sandbox WhatsApp number
- **Usage:**
  - Test new features before releasing
  - Run experiments and iterations
  - Break things without affecting users
  - QA all updates here first

#### 2. Production Environment
- **Purpose:** Stable environment for users
- **Access:** Public (paying subscribers)
- **Vercel:** `ceolab.app` (manual deploy from `main` branch)
- **Supabase:** Production project (live database)
- **Stripe:** Live mode (real payments)
- **Twilio:** Production WhatsApp number
- **Update policy:**
  - Only deploy when fully tested in staging
  - Manual approval required for production deploys
  - No direct commits to `main` branch
  - Production is stable and predictable

**Workflow:**
1. Develop feature in `develop` branch → auto-deploys to staging
2. Test thoroughly in staging environment
3. When stable, create PR: `develop` → `main`
4. Review and approve PR
5. Merge to `main` → manual deploy to production

**Cost:** ~$50-75/month total (2 Supabase projects, 2 Vercel deployments, 1 Twilio account)

---

## Technical Requirements

### MVP (Phase 1)
- [ ] Landing page with new positioning
- [ ] Hook assessment (12 questions, free)
- [ ] Baseline assessment (100 questions, staged: 30q → 60q → 100q)
- [ ] Dashboard with:
  - [ ] Baseline heatmap (18 sub-dimensions)
  - [ ] Weekly check-in form (3 questions, on-platform)
  - [ ] Weekly tracking charts (12-week trends)
  - [ ] Quarterly focus selection
- [ ] Stripe payment integration (€100/month)
- [ ] User auth and profiles

### Phase 2
- [ ] WhatsApp automation (Twilio integration)
  - [ ] Weekly check-ins delivered via WhatsApp
  - [ ] Conversational response flow
  - [ ] Automated reminders
- [ ] AI-generated monthly reports
- [ ] Content library integration
- [ ] Prescribed frameworks based on scores
- [ ] Quarterly deep-dive reports

### Phase 3
- [ ] Annual wrap-up feature ("Spotify Wrapped" style)
- [ ] Social sharing (anonymized scores, growth)
- [ ] Cohort comparison (optional benchmarking)
- [ ] Advanced WhatsApp features (streak tracking, motivational messages)

---

## Content Strategy

### Frameworks That Exist (From NK Library)
- CEO Test & 5 Criteria
- Zone of Genius
- Five Drivers
- Trust Formula
- Deep Work
- 80/20 Discipline
- Mental Biases
- Four Relationships
- Above the Line
- (50+ more across Leading Yourself, Others, Organizations)

### How Content Gets Used in CEO Lab
1. User takes baseline test
2. Low score in "Strategic Vision" → Dashboard shows: "Your Strategic Vision score is 4/10"
3. Recommended action: "Complete the Strategic Vision Framework" (link to PDF/module)
4. Track: Did they engage? Did score improve in next check-in?

### Weekly Check-In Content
- Need 20-30 rotating questions across all dimensions
- Mix of behavioral + reflective
- Ties back to baseline test dimensions

---

## Materials Needed From Niko

### Critical (Must Have)
- [ ] Complete CEO Leadership Test questions
- [ ] Scoring methodology for each dimension
- [ ] Dimension definitions (what each measures, why it matters)
- [ ] Results interpretation (what score ranges mean)

### Important (Should Have)
- [ ] Weekly check-in questions (20-30 rotating)
- [ ] Sample reports (what output looks like)
- [ ] Monthly/quarterly report template/structure

### Nice to Have
- [ ] Visual preferences for charts/graphs
- [ ] Client success stories (anonymized before/after)

---

## Timeline & Milestones

### Phase 1: Foundation (Weeks 1-2)
- [ ] Finalize product strategy and positioning
- [ ] Receive critical materials from Niko (test questions, scoring)
- [ ] Design weekly check-in question flow
- [ ] Finalize pricing and tier structure

### Phase 2: Build MVP (Weeks 3-6)
- [ ] Build landing page with new positioning
- [ ] Build CEO Leadership Test (assessment form)
- [ ] Build weekly check-in system (WhatsApp → form)
- [ ] Build basic dashboard (score tracking)
- [ ] Integrate Stripe payments
- [ ] Set up Supabase (auth, database, storage)

### Phase 3: Content Migration (Weeks 5-7)
- [ ] Migrate frameworks/PDFs from Google Drive
- [ ] Upload to Supabase Storage
- [ ] Create Notion CMS for content metadata
- [ ] Map content to assessment dimensions

### Phase 4: Testing (Week 7-8)
- [ ] Internal testing (Niko + small group)
- [ ] Refine based on feedback
- [ ] Finalize onboarding flow

### Phase 5: Launch (Week 9)
- [ ] Publish landing page
- [ ] Enable signups
- [ ] Announce to newsletter (3000 subscribers)
- [ ] LinkedIn launch campaign
- [ ] Monitor first 50 signups closely

### Phase 6: Iteration (Weeks 10-12)
- [ ] Collect user feedback
- [ ] Track check-in completion rates
- [ ] Build monthly report feature
- [ ] Add prescribed content recommendations

---

## Team & Resources

### Roles
- **Niko:** Product vision, content creation, client feedback
- **Development:** [Name TBD] - Frontend/backend build
- **Design:** [Using NK brand system]

### Budget
- Hosting: Vercel/Netlify (free tier initially)
- Supabase: Free tier → Pro ($25/month when needed)
- Stripe: 2.9% + $0.30 per transaction
- Domain: TBD
- Tools: Existing NK stack

### External Dependencies
- Niko to provide CEO Leadership Test materials
- Niko to provide weekly check-in questions
- Niko to provide framework PDFs from Google Drive

---

## Risks & Mitigation

### Risk 1: Low Check-In Completion Rate
**Impact:** High
**Probability:** Medium
**Mitigation:**
- Make check-ins extremely short (2-3 min max)
- Send at consistent time each week
- WhatsApp link for easy access
- Streak tracking for motivation
- Weekly reminder notifications

### Risk 2: Materials Not Ready from Niko
**Impact:** High (blocks development)
**Probability:** Medium
**Mitigation:**
- Start with draft questions if needed
- Iterate on scoring methodology post-launch
- Build infrastructure first, content second

### Risk 3: Positioning Too Abstract
**Impact:** Medium (low conversion)
**Probability:** Medium
**Mitigation:**
- Test messaging with small group first
- Use concrete examples in copy
- Show sample reports/dashboards
- Offer demo or trial period

### Risk 4: Low Conversion from Newsletter
**Impact:** Medium
**Probability:** Low (warm audience should convert)
**Mitigation:**
- Founding member discount for first 100
- Free trial period
- Personal outreach to engaged subscribers

### Risk 5: Churn After Month 1
**Impact:** High
**Probability:** Medium
**Mitigation:**
- Focus on quick wins in first month
- Monthly reports create value moments
- Streak tracking creates habit
- Personal check-ins with early users

---

## Decisions Log

### 2026-01-28: Positioning Shift
**Decision:** CEO Lab is accountability-first, not content library
**Rationale:** Differentiation, higher engagement, addresses real anxiety
**Impact:** Changes landing page copy, product architecture, success metrics

### 2026-01-28: Weekly Check-Ins via WhatsApp
**Decision:** Send weekly check-in link via WhatsApp
**Rationale:** Low friction, high engagement, meets users where they are
**Impact:** Need WhatsApp integration or simple link-based form

### 2026-01-28: Pricing Structure (Updated with Strategic Guidance)
**Decision:** Premium positioning (~€100/month)
**Rationale:**
- Coherent with cognitive load and seriousness of the work
- Aligns with premium brand and CEO target audience
- Separates from cheap SaaS tools
- Reflects value of hard measurement + spiritual depth combination
**Funnel Strategy:** Free/light initial assessment as entry point
**Options still being refined:**
- €100/month subscription
- €80-100/month range (stay premium)
- Free assessment → paid tracking/reports
**Next Step:** Finalize exact pricing tier before launch

### 2026-02-04: Coupon Code System Implemented
**Decision:** Use Stripe Promotion Codes for all discounts and free access
**Rationale:**
- Fastest implementation (one line of code change)
- Built-in tracking and analytics in Stripe Dashboard
- No custom database tables or API routes needed
- Supports both 100% off (free access) and percentage/fixed discounts
- Professional invoicing and billing automation
**Use Cases:**
- Beta testers: 100% off forever (e.g., BETA100)
- Launch promotions: 50% off for 3 months (e.g., LAUNCH50)
- Referrals: 25% off forever (e.g., FRIEND25)
**Tracking:** All usage analytics available in Stripe Dashboard (redemptions, revenue impact, active subscriptions per code)
**Implementation:** See COUPON_CODES_SETUP.md for complete guide

### 2026-02-02: Complete Assessment Architecture Finalized
**Decision:** 100-question baseline staged across 3 sessions with 60% milestone
**Rationale:**
- 100 questions provides comprehensive depth (justifies €100/month premium positioning)
- Staging reduces friction (20-25 min per session vs 60+ min marathon)
- 60% milestone creates meaningful checkpoint where most users can stop and start tracking
- Stage 3 (100%) is aspirational for power users
**Structure:**
- Stage 1: Foundation (30 questions, 30% complete)
- Stage 2: Depth (30 questions, 60% complete) ← KEY MILESTONE
- Stage 3: Comprehensive (40 questions, 100% complete)
**Impact:** Sets clear product architecture, completion incentives, MVP scope

### 2026-02-02: 18 Sub-Dimensions Across 3 Territories
**Decision:** Comprehensive framework with 18 sub-dimensions mapped to Konstantin Method
**Structure:**
- Leading Yourself: 6 sub-dimensions (Energy, Self-Awareness, Above the Line, Emotional Fluidity, Contemplative Practice, Stress Design)
- Leading Teams: 6 sub-dimensions (Trust Formula, Psychological Safety, Multiplier Behavior, Communication Rhythm, Team Health, Accountability)
- Leading Organizations: 6 sub-dimensions (Strategic Clarity, Culture as System, Three Transitions, Systems Thinking, Organizational Design, Board & Governance)
**Rationale:** Maps perfectly to 73 playbooks, provides nuanced assessment, allows targeted framework prescription
**Impact:** Defines entire question bank structure, weekly check-in options, dashboard visualization

### 2026-02-02: Weekly Check-Ins User-Controlled, Quarterly Rotation
**Decision:** Users choose 3 focus areas per quarter, same 3 questions weekly, adjust quarterly
**Rationale:**
- User agency (they choose what to work on, not system dictating)
- Consistency (same questions build clear trend data)
- Habit formation (repetition creates ritual)
- Quarterly milestone creates natural reassessment point
**Format:** WhatsApp delivery, 3 questions, ~3 minutes
**Impact:** Creates 18 signature questions (one per sub-dimension), defines quarterly review flow

### 2026-02-02: WhatsApp as Primary Weekly Delivery
**Decision:** Weekly check-ins delivered via WhatsApp (not email or web form)
**Rationale:**
- Higher completion rates (60-80% vs 20-30% for email)
- Conversational and low-friction
- Meets users where they already are
- Push notifications built-in
- Feels personal (like coach checking in)
**Technical:** Twilio WhatsApp API, webhook for responses, parse and store
**Cost:** ~$2-3 per user per year
**Impact:** Requires WhatsApp integration, but dramatically improves engagement

### 2026-02-02: Hook Assessment as Free Entry Point
**Decision:** 12-question free assessment before payment wall
**Structure:** 4 questions per territory, 5 minutes, immediate snapshot results
**Rationale:**
- Low friction entry
- Shows immediate value
- Creates "aha" moment
- Drives conversion to paid
**Expected conversion:** 10-15% of completers sign up
**Impact:** Defines top-of-funnel experience, conversion driver

### 2026-02-02: Framework Prescription Based on Scores
**Decision:** Automatically prescribe frameworks based on low sub-dimension scores
**Format:** Dashboard shows "Recommended: [Framework Name]" with link to PDF/module
**Rationale:** Makes 73-playbook library useful (not overwhelming), ties content to measurement
**Phase 1:** PDF downloads
**Phase 2:** Interactive modules with exercises
**CTA:** Every framework page includes "Work with Niko" booking link
**Impact:** Defines content delivery, positions Niko for 1-on-1 coaching funnel

### 2026-02-02: Technical Stack Finalized
**Decision:** Next.js 14 + React + ShadCN/Tailwind + React Query + Supabase
**Stack:**
- Frontend: Next.js 14 with TypeScript, ShadCN components, Tailwind CSS
- Data layer: React Query (TanStack Query) for caching and state management
- Backend: Supabase (PostgreSQL, auth, real-time, storage, edge functions)
- Integrations: Stripe (payments), Twilio (WhatsApp)
- Hosting: Vercel
**Rationale:**
- Next.js provides SSR for landing page SEO + unified frontend/API
- ShadCN gives pre-built accessible components, rapid development
- React Query + Supabase is proven pattern: Supabase handles backend/real-time, React Query handles client-side data layer
- React Query eliminates state management boilerplate, automatic cache invalidation
- Supabase provides zero-config backend, instant API, real-time subscriptions
- Total monthly cost: ~$25-50 until scale
**Impact:** Defines development environment, sets up for 8-week build timeline

### 2026-02-03: WhatsApp Automation Moved to Phase 2
**Decision:** Phase 1 uses dashboard form for weekly check-ins, WhatsApp automation in Phase 2
**Rationale:**
- Simplifies MVP scope (removes Twilio integration complexity)
- Validates if users will self-report before automating
- Dashboard form still captures all data (3 questions, trends, streaks)
- Can measure completion rates organically
- Faster to build and launch
- WhatsApp becomes growth/engagement lever after proving core value
**Phase 1:** Users open dashboard weekly, complete 3-question form
**Phase 2:** Automate via WhatsApp once engagement patterns are proven
**Impact:** Reduces Phase 1 timeline by ~1-2 weeks, de-risks technical complexity

### 2026-02-04: Dashboard Design Strategy Finalized (V3)
**Decision:** Merge ChatGPT's sophisticated design with our visual interactivity
**Rationale:**
- ChatGPT created cleaner, more sophisticated aesthetic with better hierarchy
- Their strategic sections (Decision Friction, Leadership Debt, Coach, Wrapped) add massive value
- Our interactive features (modals, charts, drill-downs) provide depth they lack
- Best of both: Strategic depth + visual exploration
**Key Changes:**
- **Add 4 new sections:** Decision Friction Index, Leadership Debt, "If I Were Your Coach", Leadership Wrapped
- **Remove:** What-if scenario sliders (premature, looks unpolished)
- **Enhance:** Peer comparisons throughout (multiple cohorts, contextual interpretation, visual distribution)
- **Proprietary language only:** No external framework mentions (Trust Formula, Drama Triangle, etc.) - use Konstantin Method concepts
- **Design upgrade:** ChatGPT's spacing/hierarchy applied to all our visual components
**Impact:** Creates differentiated dashboard that's both strategic AND interactive, fully proprietary to Konstantin Method

### 2026-02-04: Konstantin Method Sub-Dimensions Updated
**Decision:** Refined Leading Yourself sub-dimensions to match evolving framework
**Changes:**
- "Above the Line" → "Leading above the Line" (more active framing)
- "Emotional Fluidity" → "Emotional Intelligence" (clearer, more recognizable)
- "Contemplative Practice" → "Grounded Presence" (captures essence better)
- "Stress Design" → Removed, replaced with "Purpose & Direction" (more foundational)
**New Leading Yourself framework:**
1. Energy Management
2. Purpose & Direction (new)
3. Self-Awareness
4. Leading above the Line
5. Emotional Intelligence
6. Grounded Presence
**Rationale:** Purpose & Direction is more foundational than Stress Design (which can be covered in Energy Management). Better represents the Konstantin Method's focus on alignment and inner clarity.
**Impact:** Updates all assessment questions, dashboard labels, framework mapping, weekly check-in questions

### 2026-02-03: Full Build Strategy (Option B)
**Decision:** Build complete platform and launch to newsletter (not concierge pilot)
**Rationale:**
- Warm audience of 3,000 newsletter subscribers
- Product vision is clear and validated
- Konstantin Method IP already proven
- Assessment architecture fully designed
- Technical stack finalized
**Timeline:** 8 weeks to public launch
**Target:** 30-60 paid subscribers in month 1
**Key metric:** 60%+ weekly check-in completion rate (via dashboard)
**Impact:** Commit to full development, prepare for newsletter launch campaign

---

## Changelog

### 2026-01-28 - Problem Section Rebuilt Based on Strategic Guidance
- **Replaced generic problem statements with specific target personas**
- **New headline:** "You Need a Mirror" (positions CEO Lab as objective reflection tool)
- **Six persona-specific cards:**
  1. "You Were the Technical Expert" → now running teams (specialist → leader transition)
  2. "AI Just Disrupted Your Edge" → speaks to high-paid specialists anxious about AI
  3. "You're a First-Time Founder" → building without feedback
  4. "You Make $200k+ Solo" → your career IS a business (strategic framing)
  5. "Every Tool Makes You Anxious" → no framework to decide
  6. "You Don't Feel Like a 'Natural CEO'" → imposter syndrome + no measurement
- **Messaging shift:** From abstractions ("self-leadership is the edge") to direct ("Are you running it like one?")
- **Targets right people:** First-time founders, technical leaders, high-earning solopreneurs, specialists
- Sets up "CEO mirror" positioning naturally
- Updated index.html:69-115

### 2026-01-28 - Strategic Refinement Checklist Added (Moritz + Alex Feedback)
- **Added comprehensive strategic guidance** from external feedback
- **Key strategic shifts:**
  - Target: Founders/CEOs who don't feel like "natural" CEOs + high-paid specialists anxious about AI
  - Positioning: "CEO mirror" - objective reflection of how you're doing
  - Pricing: Premium (~€100/month, not €15 SaaS)
  - Messaging: Speak directly to person ("Become more consistent") not abstractions ("consistent accountability")
  - Product scope: Start with individuals, defer company-wide product
  - Funnel: Free/light initial assessment ("What's your #1 obstacle?")
  - Outputs: Usable for performance reviews, shareable snapshots, "Spotify Wrapped" for leadership
- **Emphasize Nico's unique mix:**
  - Hard measurement + objective business lens
  - Stillness / spiritual / nervous-system depth
  - Bridges masculine (structure, metrics) and feminine (presence, inner work)
- **Execution priority:** Ship narrow v1, get paying users, iterate (proof piece)
- All future decisions should reference this checklist

### 2026-01-28 - MAJOR: Design System Created + Sections Rebuilt
- **Created DESIGN_SYSTEM.md** - Establishes reusable components and patterns
- **Rebuilt both anxiety sections** using design system (cut ~80% of text):
  1. "You Don't Know Where You Stand" - 3 cards instead of massive text blocks
  2. "Become the CEO of Your Career" - 6 punchy cards (problems + pains combined)
- **Design principles enforced:**
  - Use established classes (section, section__title, assessment-card, etc.)
  - No custom inline styles
  - Titles do the work (3-5 words)
  - Descriptions support (1-2 sentences max)
  - Cards stand out, minimal text
- **Text reduction examples:**
  - Old: 250+ words of explanation
  - New: Card title (4 words) + description (1 sentence)
- All sections now follow consistent visual language
- Updated index.html:69-115, 129-165

### 2026-01-28 - "Is This You?" Section Added (Problems → Pains → Solution)
- Created section using copywriting principle: problems to resonate, pains to motivate
- Header: "Is This You?" (relevance check)
- Three-part structure:
  1. **Problems (Resonate)** - Feed back their specific problems so they feel heard:
     - See AI tools and wonder "Am I falling behind?"
     - Compare to other founders, feel like everyone's moving faster
     - Work hard but no idea if actually getting better as leader
     - Read frameworks but no clear answer on "Where do I stand?"
  2. **Pains (Motivate through loss)** - "Here's What That Costs You":
     - Every day without data = might be working on wrong things
     - Developing blind spots that will cost you later
     - Other founders measuring ARE adapting faster (competitive loss)
     - Without measurement, anxiety makes your decisions (not strategy)
  3. **Solution** - What CEO Lab Does (coming next in section)
- Visual design: problems in dark cards with icons, pains in red-toned section with ✕ symbols
- Updated index.html:347-450

### 2026-01-28 - Landing Page "Why This Matters" Section Added
- Created new section addressing founder anxiety directly
- Positioned between Hero and How It Works sections
- Key messaging points:
  - "You don't know where you are" (the anxiety)
  - Continuous adaptation as only reliable edge
  - Frameworks as rituals that structure reality
  - Self-leadership as the core skill
  - "If you go with us, you'll be able to adapt"
- Section includes: The Problem, The Challenge, Rituals explanation, Core Skill
- Visual design: dark background, split cards, centered callouts
- Updated index.html:69-137

### 2026-01-28 - Master Project Document Created
- Established core positioning: accountability-first, not content library
- Defined target anxieties: "You don't know where you are"
- Key insight: Continuous adaptation is the only edge
- Messaging: Frameworks as rituals that structure reality
- Open questions documented for weekly check-ins, content integration
- Added project management sections: Timeline, Team, Risks, Decisions

### 2026-02-02 - MAJOR: Complete Assessment Architecture Finalized
- **Full question bank defined:** 130 total questions
  - 12 Hook questions (free entry point)
  - 100 Baseline questions (comprehensive assessment)
  - 18 Weekly signature questions (tracking library)
- **Staged baseline delivery with 60% milestone:**
  - Stage 1: Foundation (30 questions, 30%)
  - Stage 2: Depth (30 questions, 60%) ← KEY MILESTONE
  - Stage 3: Comprehensive (40 questions, 100%)
- **18 sub-dimensions finalized across 3 territories:**
  - Leading Yourself: 6 dimensions (32 questions)
  - Leading Teams: 6 dimensions (35 questions)
  - Leading Organizations: 6 dimensions (33 questions)
- **All questions drafted and mapped to Konstantin Method frameworks**
- **Staging reduces friction while maintaining premium depth**

### 2026-02-02 - Weekly Check-In System Fully Designed
- **User-controlled quarterly focus:** Users choose 3 sub-dimensions per quarter
- **Same 3 questions weekly:** Consistency builds clear trend data
- **Quarterly rotation:** Review progress every 12 weeks, adjust focus
- **WhatsApp delivery:** Conversational, low-friction, high completion rates
- **18 signature questions:** One per sub-dimension, forms tracking library
- **Technical flow defined:** Twilio WhatsApp API, webhook, response parsing
- **Cost:** ~$2-3 per user per year in WhatsApp messaging

### 2026-02-02 - Dashboard Visualization Designed
- **Baseline heatmap:** All 18 sub-dimensions, color-coded by score
- **Weekly tracking charts:** Line graphs for 3 focus areas over 12 weeks
- **Trend indicators:** Show improvement, stability, or decline
- **AI-generated insights:** Per dimension, pattern recognition
- **Comparison to baseline:** Track progress from starting point
- **Quarterly summaries:** 12-week progress report with score changes

### 2026-02-02 - Framework Prescription Logic Defined
- **Automatic recommendations:** Based on low sub-dimension scores
- **Dashboard integration:** "Your Trust score is low → Complete Trust Formula"
- **Engagement tracking:** Did they open? Did score improve?
- **MVP delivery:** PDF downloads (Phase 2: interactive modules)
- **Niko positioning:** Every framework links to 1-on-1 coaching booking
- **Funnel:** Newsletter → Hook → CEO Lab (€100/mo) → 1-on-1 Coaching (€15k)

### 2026-02-02 - Product Questions Resolved
- ✅ Weekly check-in format decided (user-controlled, quarterly focus)
- ✅ Content integration decided (prescribed based on scores)
- ✅ Reporting structure decided (weekly, monthly, quarterly, annual)
- ✅ Pricing decided (free hook + €100/month comprehensive)
- ✅ Staging strategy decided (30% → 60% → 100% with milestone)
- **All major architecture questions answered**
- **Ready for technical implementation**

### 2026-02-02 - Technical Stack Finalized
- **Frontend:** Next.js 14 + React + TypeScript
- **UI Library:** ShadCN + Tailwind CSS
- **Data Management:** React Query (TanStack Query) wrapping Supabase queries
- **Backend:** Supabase (PostgreSQL, auth, real-time, storage)
- **Integrations:** Stripe (payments), Twilio (WhatsApp)
- **Hosting:** Vercel
- **Pattern:** React Query handles client-side caching/state, Supabase handles backend + real-time
- **Cost:** ~$25-50/month until significant scale
- **Deployment:** Two environments (staging for testing, production for stable releases)

---

## Next Immediate Actions

**Priority:** Assessment architecture complete, move to technical implementation

1. **Completed (2026-02-02):**
   - [x] Complete assessment architecture finalized (100 questions, 3 stages)
   - [x] All 18 sub-dimensions defined and mapped to frameworks
   - [x] Hook assessment questions drafted (12 questions)
   - [x] Baseline questions drafted (100 questions across 3 stages)
   - [x] Weekly signature questions defined (18 questions)
   - [x] Weekly check-in system designed (WhatsApp, quarterly focus)
   - [x] Dashboard visualization designed (heatmap + trend charts)
   - [x] Framework prescription logic defined
   - [x] All product questions resolved

2. **This week:**
   - [ ] Review all 130 questions with Niko for approval
   - [ ] Create technical implementation spec document
   - [ ] Design dashboard wireframes/mockups
   - [ ] Write landing page copy for hook assessment
   - [ ] Define database schema (users, assessments, responses, check-ins)

3. **Next 2 weeks:**
   - [ ] Build hook assessment (12 questions, free)
   - [ ] Build Stage 1 baseline (30 questions)
   - [ ] Set up Twilio WhatsApp API integration
   - [ ] Build basic dashboard (scores display)
   - [ ] Integrate Stripe payment (€100/month)
   - [ ] Set up Supabase (auth, database, storage)

4. **Next 4 weeks (MVP Launch):**
   - [ ] Complete all 3 baseline stages (100 questions)
   - [ ] Build weekly check-in system (WhatsApp flow)
   - [ ] Build quarterly focus selection
   - [ ] Upload framework PDFs to storage
   - [ ] Build framework prescription display
   - [ ] Internal testing with Niko + small group
   - [ ] Soft launch to newsletter (target: 30-60 paid users)

---

**How to Use This Document:**
- Update after every major product conversation
- Date all significant changes in Changelog
- Move open questions to Decisions Log when resolved
- Track progress by checking off Timeline milestones
- Review Risks weekly and update mitigation strategies
- Keep Next Immediate Actions current (max 1-2 week horizon)

---

# APPENDICES

## Appendix A: Hook Assessment Questions (12 Questions)

**Purpose:** Free entry point, creates "aha" moment, drives signup
**Time:** ~5 minutes
**Scoring:** 48 points total (16 per territory)

### LEADING YOURSELF (4 questions)

**Q1. Energy Management**
In the last week, how many hours did you spend on work that only you could do (not meetings, emails, or fire-fighting)?
- 0-2 hours (I'm drowning) — 1 point
- 3-5 hours (I'm surviving) — 2 points
- 6-10 hours (I'm managing) — 3 points
- 10+ hours (I'm thriving) — 4 points

**Q2. Self-Awareness**
When was the last time you said "I don't know" in front of your team?
- Can't remember (I'm the expert) — 1 point
- More than a month ago — 2 points
- In the last 2 weeks — 3 points
- This week (I model vulnerability) — 4 points

**Q3. Above the Line**
When something goes wrong, what's your first internal reaction?
- "Who screwed this up?" (Blame) — 1 point
- "Why does this always happen?" (Victim) — 2 points
- "I'll fix it myself" (Hero) — 3 points
- "What did I miss? What can we learn?" (Curiosity) — 4 points

**Q4. Contemplative Practice**
Do you have a daily practice that creates space for stillness (meditation, journaling, walking)?
- No, I don't have time — 1 point
- I try, but it's sporadic — 2 points
- Yes, a few times a week — 3 points
- Yes, it's non-negotiable — 4 points

### LEADING TEAMS (4 questions)

**Q5. Psychological Safety**
How long does it take for bad news to reach you?
- I find out weeks later (or never) — 1 point
- Days, through back channels — 2 points
- Within 24 hours — 3 points
- Immediately, people seek me out — 4 points

**Q6. Multiplier Behavior**
In your last team meeting, did you ask more questions or give more answers?
- All answers (I'm the expert) — 1 point
- Mostly answers, some questions — 2 points
- Balanced — 3 points
- Mostly questions (I expand their thinking) — 4 points

**Q7. Trust Formula**
When you commit to something, how often do you deliver on time?
- I overcommit and underdeliver — 1 point
- 50-70% of the time — 2 points
- 80-90% of the time — 3 points
- 95%+, or I renegotiate early — 4 points

**Q8. Delegation**
What percentage of decisions require your final approval?
- 80%+ (I'm the bottleneck) — 1 point
- 50-70% (I'm involved in most) — 2 points
- 30-50% (Team owns a lot) — 3 points
- <20% (Team is empowered) — 4 points

### LEADING ORGANIZATIONS (4 questions)

**Q9. Strategic Clarity**
Can every person on your leadership team explain your strategy in one sentence, and would they all say the same thing?
- No, we're not aligned — 1 point
- Probably not — 2 points
- Most could — 3 points
- Yes, we're crystal clear — 4 points

**Q10. Culture as System**
Is your culture designed intentionally, or did it just happen?
- It just happened (we're winging it) — 1 point
- We have values on a wall — 2 points
- We're actively shaping it — 3 points
- It's designed and enforced — 4 points

**Q11. Three Transitions**
Are you working IN the business (execution) or ON the business (strategy, structure, culture)?
- 80% IN, 20% ON (I'm an operator) — 1 point
- 60% IN, 40% ON (I'm transitioning) — 2 points
- 40% IN, 60% ON (I'm leading) — 3 points
- 80% ON, 20% IN (I'm architecting) — 4 points

**Q12. Systems Thinking**
When problems repeat, do you see isolated incidents or systemic patterns?
- Everything feels random — 1 point
- I see incidents — 2 points
- I'm starting to see patterns — 3 points
- I diagnose systems — 4 points

---

## Appendix B: Assessment System

**All assessment questions, scoring methodology, and report generation details have been moved to:**

**→ `/project_documents/KONSTANTIN_METHOD_ASSESSMENT.md`**

This dedicated document contains:
- Hook Assessment (12 questions)
- Baseline Assessment (100 questions)
- Weekly Check-In Questions (18 questions)
- Scoring methodology for all assessment types
- Report generation templates (weekly, monthly, quarterly, annual)
- AI analysis frameworks and pattern recognition
- Framework prescription logic

**Quick Reference:**
- Leading Yourself: 32 questions across 6 sub-dimensions
- Leading Teams: 35 questions across 6 sub-dimensions
- Leading Organizations: 33 questions across 6 sub-dimensions
- Total: 100 baseline questions + 12 hook questions + 18 weekly questions

---

## Appendix C: Weekly Signature Questions (18 Questions)

**Purpose:** Weekly tracking questions, one per sub-dimension
**Usage:** User selects 3 per quarter, same 3 questions repeated weekly

### LEADING YOURSELF (6 questions)

1. **Energy Management:** "This week, how many hours of Deep Work did you complete?"
2. **Purpose & Direction:** "This week, did your work align with your zone of genius?"
3. **Self-Awareness:** "How many times did you catch yourself mid-pattern this week?"
4. **Leading above the Line:** "When problems arose this week, did you respond with blame or curiosity?"
5. **Emotional Intelligence:** "How many times did you name your emotion in real-time this week?"
6. **Grounded Presence:** "How many days did you maintain stillness practice this week?"

### LEADING TEAMS (6 questions)

7. **Trust Formula:** "How many commitments did you keep vs. break this week?"
8. **Psychological Safety:** "How fast did bad news reach you this week?"
9. **Multiplier Behavior:** "In meetings this week, did you ask more questions or give more answers?"
10. **Communication Rhythm:** "Did you hold your weekly tactical meeting this week?"
11. **Team Health:** "Did your team have healthy conflict this week?"
12. **Accountability & Delegation:** "What % of decisions required your approval this week?"

### LEADING ORGANIZATIONS (6 questions)

13. **Strategic Clarity:** "Did you review your strategy this week?"
14. **Culture as System:** "Did you actively shape culture this week?"
15. **Three Transitions:** "This week, what % of time did you spend working ON vs. IN the business?"
16. **Systems Thinking:** "When problems arose this week, did you see patterns or incidents?"
17. **Organizational Design:** "Did your org structure support or hinder execution this week?"
18. **Board & Governance:** "Did you proactively use your board this week?"

---

## Appendix D: Sub-Dimension Mapping to Konstantin Method

### LEADING YOURSELF

**1.1 Energy Management**
Protecting time for deep work and operating in your optimal stress zone, not burnout or boredom
Frameworks: Deep Work, Harada Method, Work Smarter, Kodawari, Yerkes-Dodson, Burnout Prevention

**1.2 Purpose & Direction**
Knowing what drives you and aligning your work with your zone of genius
Frameworks: Five Drivers, Zone of Genius, Leitmotif Principle, ZRM, Second Mountain

**1.3 Self-Awareness**
Recognizing your patterns, triggers, biases, and blind spots before they run you
Frameworks: Mental Biases, Four Relationships, Self-Awareness Practices, Pattern Recognition

**1.4 Leading above the Line**
Responding with curiosity instead of blame, victim, or hero mindsets
Frameworks: Above the Line, Drama Triangle, Four Horsemen, Radical Responsibility

**1.5 Emotional Intelligence**
Identifying and navigating emotions in real-time without getting stuck or suppressing
Frameworks: Emotional Intelligence, Emotional Fluidity, Contracts, The Undoing, Empathy vs Compassion

**1.6 Grounded Presence**
Maintaining inner stillness and perspective, especially under pressure
Frameworks: 3 Styles of Meditation, 4 Ways of Listening, Ritual, Contemplative Practice, Wisdom Quadrant

### LEADING TEAMS

**2.1 Trust Formula**
Frameworks: Trust Formula (Credibility, Reliability, Intimacy, Self-Orientation), Rebuilding Trust

**2.2 Psychological Safety**
Frameworks: Psychological Safety, Idiot vs Wise Compassion, Four Horsemen, Feedback Culture

**2.3 Multiplier Behavior**
Frameworks: Multipliers (Talent Magnet, Liberator, Challenger, Debate Maker, Investor)

**2.4 Communication Rhythm**
Frameworks: Four Meetings, Non-Violent Communication, Bandwidth/Appropriateness

**2.5 Team Health**
Frameworks: 5 Dysfunctions, Team One, Co-Founder Relationships, Mistakes as Assets

**2.6 Accountability & Delegation**
Frameworks: Self-Reliance Spiral, Zone of Genius, Peter Principle, Leader's Trap

### LEADING ORGANIZATIONS

**3.1 Strategic Clarity**
Frameworks: Drucker's Five Questions, Playing to Win, 6 Strategy Traps

**3.2 Culture as System**
Frameworks: Four Cultures Model, Mindset Culture Test, Culture Diagnostics

**3.3 Three Transitions**
Frameworks: Three Transitions, Three Deaths of a CEO, Role Radar, ON vs IN Business

**3.4 Systems Thinking**
Frameworks: Four Quadrants, Onion Theory of Risk, Ambidextrous Organizations, Flywheel

**3.5 Organizational Design**
Frameworks: 5 Organizational Models, Three Levels, Ambidextrous Design, Scaling Playbook

**3.6 Board & Governance**
Frameworks: Board of Directors, Board Effectiveness, Stakeholder Management, Founder to Chairman

---

**END OF DOCUMENT**
