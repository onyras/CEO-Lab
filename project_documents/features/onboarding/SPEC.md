# CEO Lab — Onboarding Flow Spec

**Last Updated:** 2026-02-06

---

## Overview

The onboarding journey takes a stranger from first contact to an engaged, paying subscriber with full assessment results and ongoing accountability.

**10 steps, 3 dashboard states, 2 entry paths.**

---

## Entry Paths

### Path A: CEO Test (Free)
1. Visitor clicks "CEO Test" (standalone quiz, separate project)
2. Takes 35-question assessment (~5 min, no auth required)
3. Finishes → **login/signup wall before seeing results**
4. Auth via Google OAuth or Magic Link
5. Lands on dashboard (free user state)

### Path B: Direct Signup
1. Visitor signs up directly (from pricing page, landing page, etc.)
2. Auth via Google OAuth or Magic Link
3. Lands on dashboard (free user state)

**Note:** The CEO Test is a standalone lead-gen teaser. Results do NOT carry into the CEO Lab dashboard. It will eventually be replaced with a custom free assessment built on the V4/Konstantin Method.

---

## Dashboard States

### State 1: Free User (Not Subscribed)
- **Not a real dashboard** — a conversion-focused page
- Shows what the paid experience offers (feature previews, value proposition, social proof)
- Subscribe CTA → Stripe Checkout
- After payment → returns to dashboard State 2

### State 2: Subscribed, Baseline Not Started / In Progress
- Prominent "Start Baseline Assessment" CTA (if not started)
- If in progress: shows current stage (e.g., "Stage 2 of 3") + "Continue" CTA
- Assessment progress is always visible

### State 3: Subscribed, Baseline Complete
- Full results dashboard (CLMI, territories, 15 dimensions, archetypes, roadmap, all 16 sections)
- Next steps: Set up Accountability Agent + Invite Mirror Check
- Ongoing features available (AA check-ins, Mirror results, etc.)

---

## Baseline Assessment Flow

### Starting
- Available on dashboard after subscription
- User clicks "Start Baseline Assessment"

### 3 Stages
| Stage | Items | Content |
|---|---|---|
| Stage 1 | 32 | 15 behavioral + 11 SJI + 6 IM |
| Stage 2 | 34 | 30 behavioral + 4 SJI |
| Stage 3 | 30 | 30 behavioral |

### During Assessment
- One question at a time
- Progress bar within each stage (e.g., "Question 12 of 32")
- Stage indicator visible (e.g., "Stage 1 of 3")
- Progress auto-saved — user can leave and resume anytime
- Response time tracked per item

### Between Stages
- Breathing animation (few seconds, skippable)
- "Good job" message
- Choice: "Continue to Stage X" or "Take a break"
- If they leave: dashboard shows incomplete status with "Continue" CTA

### After Stage 3
- Congratulations page with breathing animation
- "See Your Results" button → main dashboard (now State 3 with full results)

---

## Post-Baseline: Next Steps

Both available immediately on the dashboard after viewing results:

### 1. Accountability Agent (AA)
- **Setup:** System suggests 3 focus dimensions (based on lowest scores / priority)
- **User can change** any of the 3 — user agency is key
- **Ice-breaker:** One fixed fun question sent immediately on setup
- **First real check-in:** Following Monday (3 questions)
- **Cadence:** Every Monday
- **Phase 1 delivery:** Dashboard (in-app form)
- **Phase 2 delivery:** WhatsApp (already set up, pending Meta approval)
- Architecture designed so switching to WhatsApp is trivial

### 2. Mirror Check
- CEO invites a colleague (email + relationship type)
- Rater receives a link, answers 15 items (no auth needed, token-based)
- Results appear on CEO's dashboard when rater completes
- Adds Blind Spot Index (BSI) to the results

---

## Complete Journey Map

```
1.  CEO Test (free, standalone) or Direct Signup
        ↓
2.  Login / Signup (Google OAuth or Magic Link)
        ↓
3.  Dashboard — State 1: Free user (conversion page)
        ↓
4.  Subscribe (Stripe Checkout)
        ↓
5.  Dashboard — State 2: "Start Baseline Assessment"
        ↓
6.  Baseline Stage 1 (32 items)
    → Breathing animation + "Good job" + continue or break
        ↓
7.  Baseline Stage 2 (34 items)
    → Breathing animation + "Good job" + continue or break
        ↓
8.  Baseline Stage 3 (30 items)
    → Congratulations + breathing animation → "See Your Results"
        ↓
9.  Dashboard — State 3: Full results
    (CLMI, territories, dimensions, archetypes, roadmap)
        ↓
10. Next steps:
    (a) Set up Accountability Agent (3 focus dims, ice-breaker, Monday cadence)
    (b) Invite Mirror Check (colleague 360-lite feedback)
        ↓
    Ongoing: AA every Monday + Mirror results when rater completes
```

---

## Auth

- **Methods:** Google OAuth, Magic Link (email-based, no password)
- **No traditional email/password signup**
- **Auth trigger:** After completing CEO Test (before results) or direct signup

---

## Open Questions

- What is the fixed ice-breaker question for AA?
- CEO Test replacement: when to build the custom V4-based free teaser?
- Specific copy/design for the free user conversion page?
