# CEO Lab - Roadmap

**Last Updated:** 2026-02-17

---

## Current Status

**Phase:** V4 code rebuild + UX overhaul complete → Ready for testing
**Launch Target:** After pilot validation (12-week protocol)
**Next Milestone:** Run migrations (005 + 007), verify full flow end-to-end, begin pilot

---

## What's Done

### Assessment Spec (V4)
- [x] Assessment architecture finalized (V4: 96 items, 15 dimensions, 3 stages)
- [x] All questions drafted (75 behavioral + 15 SJI + 6 IM + 15 mirror + 15 weekly + 10 hook)
- [x] Scoring engine specified (70/30 composite, 12 archetypes, BSI)
- [x] Report design specified (5 types, 8 sections)
- [x] Pilot protocol defined (12-week validation)
- [x] 6 V4 spec documents in `project_documents/assessment/`

### V4 Code Rebuild (2026-02-06)
- [x] **Types & Constants** — `types/assessment.ts` (219 lines), `lib/constants.ts` (180 lines)
- [x] **Question Banks** — `lib/baseline-questions.ts` (1156 lines: 75 B + 15 SJI + 6 IM), `lib/hook-questions.ts` (133 lines: 10 items), `lib/weekly-questions.ts` (103 lines: 15 items), `lib/mirror-questions.ts` (103 lines: 15 items)
- [x] **Scoring Engine** — `lib/scoring.ts` (639 lines: 17 functions covering item scoring, dimension/territory/CLMI, archetype detection, BSI, hook/weekly, response time flags, framework prescriptions)
- [x] **Database Migration** — `database/migrations/005_v4_schema.sql` (377 lines: 12 tables with RLS)
- [x] **API Routes** — 6 endpoints under `app/api/v4/` (session, save, hook, mirror, weekly, results)
- [x] **Assessment UI** — Hook page (471 lines), Baseline page (789 lines)
- [x] **Results & Dashboard** — Results page (661 lines), Dashboard (461 lines)
- [x] **Visualization Components** — 6 components: TerritoryBars, DimensionHeatmap, ArchetypeBadge, MirrorDotPlot, TrendLines, RoadmapTimeline
- [x] **Weekly & Mirror UI** — Weekly pulse page (509 lines), Mirror check page (689 lines)

### Interpretation Layer (2026-02-11)
- [x] Verbal labels reframed: Reactive / Awakening / Practicing / Consistent / Mastered
- [x] Capacity framing: scores displayed as "X% capacity" throughout
- [x] Per-territory shape radar with balanced/developing/spiky analysis
- [x] Creative/reactive tension display (side-by-side high/low indicators)
- [x] Shape analysis helper (`lib/shape-analysis.ts`)
- [x] TerritoryRadar component (`components/visualizations/TerritoryRadar.tsx`)

### UX/Flow Overhaul (2026-02-17)
- [x] **Foundation** — Shared `lib/supabase-server.ts` (replaces 20-line boilerplate in 6 routes), migration `007_ux_overhaul.sql` (reveal_seen column + weekly_pulse index), focus dimensions API (`/api/v4/focus`), streak utility (`lib/streaks.ts`)
- [x] **Weekly Check-In Loop** — Accountability setup writes focus dims to DB via `/api/v4/focus`. Weekly check-in filters to 3 focus dimensions (3 questions, not 15). Redirects to setup if no focus set.
- [x] **Home Screen Redesign** — Full results view extracted to `/ceolab/results` (7 tabs). Home page (`/ceolab`) replaced with engagement view: CLMI summary strip, weekly CTA, focus dimension cards with trends, quick links. AppShell nav updated: Home + Results.
- [x] **First-Time Results Reveal** — 5-step guided walkthrough at `/ceolab/reveal`: animated score ring, archetype intro, territory breakdown, priority dimensions, CTA to accountability setup. Reveal-seen API (`/api/v4/reveal-seen`). Auto-redirects first-time users.
- [x] **Hook Results Before Auth** — New results page at `/assessment/hook/results` showing territory scores, archetype hint, framework teaser before requiring auth. Hook assessment now redirects here instead of directly to `/auth`.
- [x] **Enhancements** — "If I Were Your Coach" coaching interventions in Growth Plan tab (`lib/coaching-interventions.ts`). Peer benchmarks on Deep Dive dimension bars (`lib/benchmarks.ts`). Auth page brand alignment (beige `#F7F3ED`, black, matching AppShell style).

### Pre-V4
- [x] Coupon code system (Stripe promotion codes)
- [x] WhatsApp Business API setup
- [x] Auth flow (login/signup)

---

## Next Steps

### Immediate (This Week)
- [x] Run `005_v4_schema.sql` migration on Supabase
- [ ] Verify TypeScript compiles (`npx tsc --noEmit`)
- [ ] Test full flow: Hook → Baseline (3 stages) → Results → Mirror → Weekly
- [ ] Fix any runtime issues

### Testing & Launch
- [ ] Internal testing (Niko + small group)
- [ ] Fix issues from testing
- [ ] Begin 12-week pilot protocol
- [ ] Iterate based on pilot data

---

## Post-Launch (Month 2+)

**Dashboard enhancements:**
- [ ] Hidden Patterns (AI insights)
- [ ] Question Drivers (click to explore)
- [ ] 12-Week Trends (line charts)
- [ ] Metrics Library (KPI tiles)

**Features:**
- [ ] WhatsApp automation (Phase 2 delivery)
- [ ] AI-generated monthly reports
- [ ] Quarterly deep-dive reports
- [x] Archetype reveal experience (built in UX overhaul, Batch D)
- [ ] Archetype evolution tracking

**Later:**
- [ ] Decision Friction Index
- [x] Benchmark Distribution — hardcoded peer benchmarks implemented (lib/benchmarks.ts)
- [ ] Leadership Wrapped (Spotify-style annual)
- [ ] Leverage Matrix
- [ ] Annual comprehensive report
- [ ] Social sharing (shareable snapshots)
- [ ] Enterprise / team archetype maps
- [ ] Coach certification program

---

## Success Metrics

- Conservative: 30-60 paid subscribers in month 1
- Optimistic: 90-150 paid subscribers in month 1
- Key metric: 80%+ weekly check-in completion rate
- Retention target: <10% monthly churn

---

## Blocking Items

1. **Niko must review V4 questions** before code rebuild starts
2. **Dimension names must be locked** (currently 3 naming systems — see REBUILD_PLAN in archive)
3. ~~**Peer benchmark decision** needed~~ → Resolved: hardcoded benchmarks based on coaching experience (lib/benchmarks.ts)

---

**Update this file weekly. Log decisions in DECISIONS_LOG.md.**
