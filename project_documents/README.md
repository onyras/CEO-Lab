# CEO Lab - Project Documents Index

**Last Updated:** 2026-02-06

Where everything lives. Update this file when the structure changes.

---

## Root

| File | Purpose |
|---|---|
| `PRODUCT_STRATEGY.md` | Vision, positioning, audience, pricing, business model (~280 lines) |
| `DECISIONS_LOG.md` | Every major decision, dated with rationale |
| `ROADMAP.md` | What's built, what's next, phases, blocking items |

## Assessment (`assessment/`)

| File | Purpose |
|---|---|
| `CURRENT.md` | Pointer to current version (currently v4) |
| `v4.md` | V4 assessment spec: 15 dimensions, 96 items, SJI, IM, mirror check |
| `SCORING.md` | Scoring architecture, CLMI index, verbal labels, IM thresholds |
| `CEO_LAB_ASSESSMENT_V4.md` | V4 complete instrument: 15 dimensions, 96 items, hook, weekly, mirror |
| `CEO_LAB_SCORING_ENGINE_V4.md` | V4 scoring engine: all formulas, archetype detection, DB schema |
| `CEO_LAB_REPORT_DESIGN_V4.md` | V4 report design: 5 report types, 8 sections, visualizations |
| `CEO_LAB_GOVERNANCE_V4.md` | V4 governance: decision log, principles, registries |
| `CEO_LAB_PILOT_PROTOCOL_V4.md` | V4 pilot protocol: 12-week validation plan |
| `CEO_LAB_CHANGELOG_V4.md` | V4 changelog: version history |
| `analysis/v3_v4_comparison.md` | V3 vs V4 dimension changes |
| `analysis/v3_deep_analysis.md` | V3 quality review and issues |
| `archive/v2_konstantin_method_assessment.md` | V2 assessment (superseded) |
| `archive/v3.md` | V3 assessment (superseded, if available) |

## Design (`design/`)

| File | Purpose |
|---|---|
| `BRAND.md` | Canonical colors, fonts, visual identity (beige/black/Inter) |
| `COMPONENTS.md` | Reusable UI components and patterns aligned to BRAND.md |
| `DASHBOARD_SPEC.md` | V3 dashboard design: 16 sections, peer comparisons, proprietary terms |

## Technical (`technical/`)

| File | Purpose |
|---|---|
| `ARCHITECTURE.md` | Tech stack, deployment strategy, environments, cost |
| `DATABASE.md` | Schema, RLS policies, UPSERT patterns, migrations |
| `API.md` | All endpoints, request/response formats |
| `PRODUCTION_CHECKLIST.md` | Production launch checklist |
| `DEVELOPMENT.md` | Local development setup guide |
| `COUPON_CODES_SETUP.md` | Stripe coupon codes configuration |
| `GOOGLE_OAUTH_SETUP.md` | Google OAuth setup for Supabase auth |

## Features (`features/`)

Each feature has its own folder with a `SPEC.md`.

| Feature | Path | Status |
|---|---|---|
| Hook Assessment | `features/hook-assessment/SPEC.md` | Spec complete |
| Baseline Assessment | `features/baseline-assessment/SPEC.md` | Spec complete |
| Weekly Check-Ins | `features/weekly-checkins/SPEC.md` | Spec complete |
| Accountability Agent | `features/accountability-agent/SPEC.md` | Spec complete |
| WhatsApp | `features/whatsapp/SPEC.md` | Spec complete |
| Dashboard | `features/dashboard/SPEC.md` | Spec complete |
| Reports | `features/reports/SPEC.md` | Spec complete |
| Mirror Check | `features/mirror-check/SPEC.md` | Spec complete |
| Stripe Payments | `features/stripe-payments/SPEC.md` | Implemented |
| Archetypes | `features/archetypes/SPEC.md` | Strategic analysis |
| Onboarding | `features/onboarding/SPEC.md` | Full onboarding journey: entry paths, dashboard states, baseline flow, post-baseline |

## Content (`content/`)

| File | Purpose |
|---|---|
| `FRAMEWORK_PRESCRIPTIONS.md` | Score tier → framework mapping (15 dimensions) |
| `LANDING_PAGE_COPY.md` | Landing page copy and section structure |
| `playbooks/konstantin_method_playbooks.md` | 73 Konstantin Method frameworks (313KB reference) |

## Archive (`archive/`)

Superseded documents kept for reference.

| File | Why Archived |
|---|---|
| `DESIGN_SYSTEM_v1_navy_gold.md` | Old design system with wrong colors (navy/gold) |
| `MVP_BUILD_PLAN.md` | Week 1 plan, partially completed |
| `REBUILD_PLAN.md` | Superseded by this restructure |
| `baseline_sub_dimension_map.md` | Early V2/V3 sub-dimension architecture |
| `DATABASE_SCHEMA_v1.md` | Original database ERD (superseded by `technical/DATABASE.md`) |
| `DATABASE_README.md` | Old database folder README |
| `DATABASE_SETUP.md` | Old database setup instructions |
| `DATABASE_SETUP_COMPLETE.md` | Old database setup completion notes |
| `REDESIGN_PROPOSAL.md` | Jan redesign proposal (superseded by current design) |
| `REQUIRED_MATERIALS_FROM_NIKO.md` | Initial content requirements list |
| `CEO_LEADERSHIP_TEST_INTAKE.md` | Original intake document |
| `BASELINE_QUESTIONS_PROMPT.md` | Early question generation prompt |
| `WORKSHOP_PROMPT_CEO_ASSESSMENT.md` | Workshop prompt (superseded by v4 assessment) |
| `IMAGE_REQUIREMENTS.md` | Image asset requirements |
| `workshops/` | Workshop templates and landing page content |
