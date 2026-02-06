# CEO Lab - Project Rules

## What This Is

CEO Lab is a premium accountability platform (~€100/month) for founders and CEOs. Built on the Konstantin Method (60+ frameworks). Tech stack: Next.js 14, Supabase, Stripe, Tailwind/ShadCN.

## Project Documents

All strategy, specs, and design docs live in `project_documents/`. **Start with the index:**

```
project_documents/README.md    ← What's where. Always check this first.
```

### Key Files

| Need to know... | Read this |
|---|---|
| Product vision, audience, positioning | `project_documents/PRODUCT_STRATEGY.md` |
| Current assessment version | `project_documents/assessment/CURRENT.md` → points to `v4.md` |
| Assessment questions, dimensions, items | `project_documents/assessment/v4.md` |
| Scoring logic, CLMI, verbal labels | `project_documents/assessment/SCORING.md` |
| Colors, fonts, visual identity | `project_documents/design/BRAND.md` |
| UI components and patterns | `project_documents/design/COMPONENTS.md` |
| Dashboard design (16 sections) | `project_documents/design/DASHBOARD_SPEC.md` |
| Database schema, RLS | `project_documents/technical/DATABASE.md` |
| API endpoints | `project_documents/technical/API.md` |
| What's built, what's next | `project_documents/ROADMAP.md` |
| Past decisions and rationale | `project_documents/DECISIONS_LOG.md` |
| Feature spec for [X] | `project_documents/features/[x]/SPEC.md` |

## Rules

### Source of Truth: Project Documents

**CRITICAL: Every file in `project_documents/` is a source of truth. When writing code that implements anything described in these documents, you MUST read the actual document first and use its content verbatim.**

- **NEVER generate, fabricate, or paraphrase content** that exists in project documents. Item text, question text, scenario text, scale labels, framework names, narrative templates — if it's in the spec, copy it exactly.
- **ALWAYS read the full source document** before writing code that depends on it. If the file is large, read it in chunks. Do not rely on summaries, structural descriptions, or assumptions about what the file "probably" contains.
- **When delegating to sub-agents**, the sub-agent MUST be instructed to read the source file directly. Passing a structural description is not sufficient — the agent must read and extract verbatim content from the actual file.
- **After writing content from a spec**, verify a sample of items against the source document to confirm verbatim accuracy.

This rule exists because a previous session generated 96 fake assessment questions instead of reading the 72KB spec file that contained all the real ones. That mistake required a complete rewrite.

### Design System
- **ALWAYS** check `design/BRAND.md` and `design/COMPONENTS.md` before writing UI code
- Colors: beige `#F7F3ED`, black, white. Territory accents: blue `#7FABC8`, green `#A6BEA4`, orange `#E08F6A`
- Font: Inter only. No serif fonts.
- **NEVER** use navy (`#0A1628`), gold (`#D4AF37`), or Crimson Pro — those are the old, incorrect design system
- No custom inline styles. Use component patterns from COMPONENTS.md
- No gradients, no heavy shadows, no complex animations

### Assessment
- Current version is **V4** (15 dimensions, 3 territories, 5 per territory)
- V3 had 18 dimensions — that's outdated. Always use V4's 15.
- Scoring: 70% behavioral + 30% SJI composite
- The 15 dimensions are defined in `assessment/v4.md` — use those names exactly

### Assessment Dimensions (V4)
**Leading Yourself:** Self-Awareness, Emotional Mastery, Grounded Presence, Purpose & Mastery, Peak Performance
**Leading Teams:** Building Trust, Hard Conversations, Diagnosing the Real Problem, Team Operating System, Leader Identity
**Leading Organizations:** Strategic Clarity, Culture Design, Organizational Architecture, CEO Evolution, Leading Change

### Adding New Content

**New feature:**
1. Create `project_documents/features/new-feature/SPEC.md`
2. Add one line to `project_documents/README.md` index
3. Log decision in `project_documents/DECISIONS_LOG.md`

**New assessment version:**
1. Create `project_documents/assessment/v5.md`
2. Update `project_documents/assessment/CURRENT.md` to point to v5

**Design changes:**
1. Update `project_documents/design/BRAND.md` or `design/COMPONENTS.md`
2. Add version note at top with date

### Naming Conventions
- Folders: `kebab-case` (e.g., `hook-assessment/`)
- Doc files: `UPPERCASE.md` (e.g., `SPEC.md`, `BRAND.md`)
- Assessment versions: `v4.md`, `v5.md`

### Do NOT
- Put feature specs, question text, or technical details in PRODUCT_STRATEGY.md — it's strategy only (~280 lines)
- Use V3's 18 dimensions (superseded by V4's 15)
- Create one-off design patterns — use COMPONENTS.md
- Delete archived files — they're kept for reference in `archive/`
