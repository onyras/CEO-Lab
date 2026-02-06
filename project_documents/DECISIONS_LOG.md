# CEO Lab - Decisions Log

**Purpose:** Every major decision, dated, with rationale. Single source of truth for "why did we decide X?"

---

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
- Leading Yourself: 6 sub-dimensions
- Leading Teams: 6 sub-dimensions
- Leading Organizations: 6 sub-dimensions
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
- React Query + Supabase is proven pattern
- Total monthly cost: ~$25-50 until scale
**Impact:** Defines development environment, sets up for 8-week build timeline

### 2026-02-03: WhatsApp Automation Moved to Phase 2
**Decision:** Phase 1 uses dashboard form for weekly check-ins, WhatsApp automation in Phase 2
**Rationale:**
- Simplifies MVP scope (removes Twilio integration complexity)
- Validates if users will self-report before automating
- Dashboard form still captures all data
- Faster to build and launch
**Phase 1:** Users open dashboard weekly, complete 3-question form
**Phase 2:** Automate via WhatsApp once engagement patterns are proven
**Impact:** Reduces Phase 1 timeline by ~1-2 weeks

### 2026-02-03: Full Build Strategy (Option B)
**Decision:** Build complete platform and launch to newsletter (not concierge pilot)
**Rationale:**
- Warm audience of 3,000 newsletter subscribers
- Product vision is clear and validated
- Konstantin Method IP already proven
- Assessment architecture fully designed
**Timeline:** 8 weeks to public launch
**Target:** 30-60 paid subscribers in month 1

### 2026-02-04: Coupon Code System Implemented
**Decision:** Use Stripe Promotion Codes for all discounts and free access
**Rationale:**
- Fastest implementation (one line of code change)
- Built-in tracking and analytics in Stripe Dashboard
- No custom database tables or API routes needed
**Use Cases:**
- Beta testers: 100% off forever (e.g., BETA100)
- Launch promotions: 50% off for 3 months (e.g., LAUNCH50)
- Referrals: 25% off forever (e.g., FRIEND25)

### 2026-02-04: Dashboard Design Strategy Finalized (V3)
**Decision:** Merge ChatGPT's sophisticated design with our visual interactivity
**Key Changes:**
- Add 4 new sections: Decision Friction Index, Leadership Debt, "If I Were Your Coach", Leadership Wrapped
- Remove: What-if scenario sliders (premature)
- Enhance: Peer comparisons throughout
- Proprietary language only: No external framework mentions
- Design upgrade: ChatGPT's spacing/hierarchy applied to all visual components
**Impact:** Creates differentiated dashboard that's both strategic AND interactive

### 2026-02-04: Konstantin Method Sub-Dimensions Updated
**Decision:** Refined Leading Yourself sub-dimensions to match evolving framework
**Changes:**
- "Above the Line" → "Leading above the Line"
- "Emotional Fluidity" → "Emotional Intelligence"
- "Contemplative Practice" → "Grounded Presence"
- "Stress Design" → Removed, replaced with "Purpose & Direction"
**Impact:** Updates all assessment questions, dashboard labels, framework mapping

### 2026-02-05: Accountability Agent Feature Defined
**Decision:** Add personalized WhatsApp accountability system as major product feature
**What It Is:**
- Post-baseline: System suggests 3 weak areas based on assessment scores
- User creates 3 custom behavioral questions
- Delivered every Monday 9 AM via WhatsApp with tap-to-answer buttons
- 12-week tracking with quarterly review and reset
**Implementation:** 5-week timeline (MVP → Intelligence → Polish)
**Impact:** Makes CEO Lab sticky through weekly engagement, drives retention

### 2026-02-06: Assessment V4 Complete Rebuild
**Decision:** Rebuild assessment from V3 → V4, realigning to Konstantin Method's 15-dimension architecture
**Rationale:** V1-V3 had 18 dimensions that drifted from the method's actual 15-dimension structure
**Key Changes:**
- 18 dimensions → 15 dimensions
- Added Situational Judgment Items (SJI)
- Added Impression Management items
- Added Mirror Check (360-lite add-on)
- Total: 96 items (75 behavioral + 15 SJI + 6 IM)
**Impact:** Complete question bank rewrite, scoring architecture update

### 2026-02-06: Project Documentation Restructure
**Decision:** Restructure project_documents/ from flat files to organized folders
**Rationale:** 12 flat files grew organically over 2 weeks; PRODUCT_STRATEGY was 2000+ lines; conflicting design docs; no assessment versioning; feature specs scattered
**Structure:** assessment/, design/, technical/, features/, content/, archive/ with README.md index
**Impact:** Scalable foundation for years of feature development

### 2026-02-06: V4 Code Rebuild Complete
**Decision:** Complete code rebuild implementing V4 assessment architecture (26 files, ~8,800 lines)
**Rationale:**
- V3 code (18 dimensions, simple percentage scoring) couldn't support V4 architecture (15 dimensions, 70/30 composite, archetypes, BSI, mirror checks)
- Clean rebuild preferred over incremental migration to avoid V3/V4 hybrid bugs
- V3 tables and API routes left untouched for backward compatibility
**What was built:**
- Types & constants (2 files): Complete V4 type system + 15 dimension definitions, 12 archetype signatures, framework prescriptions
- Question banks (4 files): 75 behavioral + 15 SJI + 6 IM + 10 hook + 15 weekly + 15 mirror items
- Scoring engine (1 file, 639 lines): 17 functions — item scoring, 70/30 composite, territory/CLMI aggregation, archetype detection, BSI, mirror gaps, response time flags
- Database migration (1 file): 12 new tables with RLS policies (V3 tables untouched)
- API routes (6 files): session, save, hook, mirror, weekly, results under `/api/v4/`
- UI pages (6 files): hook, baseline (3-stage), results (8-section report), dashboard, weekly pulse, mirror check
- Visualization components (6 files): TerritoryBars, DimensionHeatmap, ArchetypeBadge, MirrorDotPlot, TrendLines, RoadmapTimeline
**Key design decisions within rebuild:**
- Reverse scoring follows Scoring Engine spec: only 3rd behavioral item per dimension (15 total)
- Hook assessment: 10 items (per spec), not 12 (per earlier plan)
- Mirror gap classification uses raw scale difference (1-5 scale), not percentage
- SJI scaling formula: `(raw - 1) * 1.333 + 1` maps 1-4 to 1.0-5.0
- Archetype detection: 4-step algorithm (IM check → full match → partial match → sort/cap at 3)
**Impact:** Ready for database migration, TypeScript compilation check, and end-to-end testing

### 2026-02-06: Free Entry Point = CEO Test (Temporary)
**Decision:** Use the existing CEO Test (35 questions, 7 categories, ~5 min) as the free lead-gen teaser. Not part of the core product.
**Rationale:**
- CEO Test already exists, is live, and proven (separate project: `01_CEO_test`)
- Hooks people in → leads to signup → dashboard is the real product
- CEO Test results do NOT carry into the dashboard — it's a standalone teaser
- **Temporary:** Will eventually be replaced with a custom free assessment built on V4/Konstantin Method
**Two entry paths:** Free CEO Test → signup, or direct signup
**Impact:** The V4 hook assessment (`/assessment/hook`, `/api/v4/hook`, `hook_sessions` table) may be repurposed as the future replacement for the CEO Test.

### 2026-02-06: Onboarding Flow & Auth
**Decision:** Two entry paths, auth via Google or Magic Link
**Flow:**
- **Path A (free):** Click "CEO Test" → take test (no auth) → login/signup wall before results → dashboard (conversion page)
- **Path B (direct signup):** Sign up → land on dashboard (conversion page)
- **Auth methods:** Google OAuth or Magic Link (email-based, no password)
- **CEO Test is a standalone teaser** — results do NOT carry into the dashboard
**Paywall:** Baseline assessment (96 items) only available after subscription.
**Impact:** Dashboard needs 3 states: (1) free user (conversion page), (2) subscribed pre-baseline, (3) subscribed with full results

### 2026-02-06: Baseline Assessment Flow
**Decision:** 3-stage baseline with saved progress, breathing animations between stages, visible on dashboard
**Flow:**
- Baseline appears on dashboard after subscription (prominent CTA)
- 3 stages (32 + 34 + 30 items), progress auto-saved — user can leave and resume anytime
- Between stages: breathing animation → "Good job" message → choice to continue or take a break
- Dashboard shows incomplete status if baseline not finished (e.g., "Stage 1 of 3 complete")
- No partial results shown between stages — just the breathing moment and encouragement
- Full results only after completing all 3 stages
**Impact:** Dashboard needs an "in-progress" state for baseline. Breathing animation component needed for stage transitions.

### 2026-02-06: Free User Dashboard & Payment Flow
**Decision:** Free users see a conversion-focused page (not a real dashboard), payment via Stripe Checkout, post-payment lands on dashboard with "Start Baseline" CTA
**Free user experience:**
- Not a dashboard — a focused conversion page explaining what the baseline assessment reveals
- Social proof, feature previews, value proposition → subscribe CTA
**Payment:** Stripe Checkout (redirect to Stripe-hosted page)
**Post-payment:** Return to dashboard showing "Start Baseline Assessment" state — prominent CTA to begin

### 2026-02-06: Post-Baseline Completion Flow
**Decision:** Congratulations page with breathing animation → button to dashboard with full results
**Flow:**
- Complete Stage 3 → Congratulations page with breathing animation + celebration message
- "See Your Results" button → main dashboard (now populated with full results: CLMI, territories, dimensions, archetypes, etc.)
- Dashboard becomes the home for all results and ongoing features (mirror check, weekly pulse, etc.)
**Note:** No separate results page redirect — results live on the dashboard. Additional features visible for ongoing engagement.

### 2026-02-06: Weekly Pulse Renamed to Accountability Agent
**Decision:** Rename "Weekly Pulse" / "Weekly Check-in" → **Accountability Agent (AA)** across the entire product
**Rationale:** "Accountability Agent" is more compelling, differentiating, and aligned with the product's core value proposition (accountability-first platform)
**Flow after baseline completion:**
1. User sees full results on dashboard first
2. Dashboard presents option to set up the Accountability Agent
3. On AA signup: one immediate fun question (ice-breaker/onboarding moment)
4. First real set of 3 questions arrives the following Monday
5. Weekly cadence from there (every Monday)
**Impact:** Rename in all code, UI, and docs: weekly_pulse table, `/api/v4/weekly`, `/assessment/weekly`, WeeklyItem type, etc. Code rename can happen later — concept rename is immediate.

### 2026-02-06: Accountability Agent Setup Details
**Decision:** System suggests focus dimensions, user can change. Dashboard-first with WhatsApp-ready architecture. Fixed ice-breaker.
**Focus dimension selection:**
- System suggests 3 dimensions based on baseline results (e.g., lowest scoring / priority dimensions)
- User can change any of the 3 — some people don't want to focus on their weakest areas
- User agency is key: they choose what to work on
**Delivery channel:**
- Phase 1: Dashboard (in-app check-in form)
- Phase 2: WhatsApp (already set up, pending Meta approval). Architecture should make switching trivial
**Ice-breaker question:** Fixed question for everyone (not personalized). Sent immediately on AA signup as a fun onboarding moment.
**Cadence:** First real set of 3 questions arrives the following Monday. Weekly from there.

### 2026-02-06: Mirror Check Available After Baseline
**Decision:** Mirror Check introduced alongside Accountability Agent setup, immediately after baseline completion
**Flow:** Dashboard shows both as next steps after user sees their full results

### 2026-02-06: Complete Onboarding Journey Finalized
**Decision:** Full end-to-end onboarding flow locked in
**Journey:**
1. CEO Test (free, standalone) → signup wall → login (Google / Magic Link)
2. Dashboard (free user) — conversion page showing what paid experience offers
3. Subscribe (Stripe Checkout)
4. Dashboard (subscribed) — "Start Baseline Assessment" CTA
5. Baseline Stage 1 (32 items) → breathing animation + "Good job" + continue or break
6. Baseline Stage 2 (34 items) → breathing animation + "Good job" + continue or break
7. Baseline Stage 3 (30 items) → Congratulations page + breathing animation → "See Your Results"
8. Dashboard (full results) — CLMI, territories, dimensions, archetypes, roadmap, all 16 sections
9. Two next steps: (a) Set up Accountability Agent, (b) Invite Mirror Check
10. Ongoing: AA every Monday (3 questions) + Mirror results appear when rater completes

---

**How to use this file:**
- Date all entries
- Include rationale (the "why" matters more than the "what")
- Note impact on other parts of the system
- Review before making related decisions
