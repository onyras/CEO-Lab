# Accountability Agent - Feature Spec

**Status:** Defined, not yet built
**Source:** Extracted from PRODUCT_STRATEGY.md accountability agent section
**Timeline:** 5 weeks (MVP → Intelligence → Polish)

---

## Overview

Personalized WhatsApp-based accountability system that helps users track custom behavioral metrics weekly through interactive tap-to-answer questions.

**Activates:** Immediately after user completes baseline assessment.

---

## User Journey

### 1. Post-Baseline Suggestions (Automated)
- User completes baseline assessment
- System analyzes scores and identifies 3-5 lowest sub-dimensions
- Dashboard shows: "Based on your results, we recommend focusing on:"
  - Energy Management (Score: 24%)
  - Trust Formula (Score: 31%)
  - Strategic Clarity (Score: 28%)
- User selects 3 focus areas for the quarter

### 2. Custom Question Development (Interactive)
- For each selected focus area, user creates 1 custom question
- System provides examples based on the sub-dimension
- User can customize or write their own behavioral question

### 3. Measurement Options (User-Defined)
- For each question, user defines 3 measurement options (tap-to-select)
- System suggests options based on question type:
  - **Time-based:** "0-5 hours", "5-10 hours", "10-15 hours", "15+ hours"
  - **Yes/No:** "Yes", "No", "Partially"
  - **Frequency:** "0 times", "1-3 times", "4-7 times", "8+ times"
  - **Percentage:** "0-25%", "25-50%", "50-75%", "75-100%"
- Multi-answer selection enabled

### 4. Weekly Delivery (Every Monday 9 AM)
- WhatsApp message: "Good morning! Week X check-in (Q1 2026)"
- Question 1 with 3 tap-to-answer buttons
- User taps → saves → Question 2 → taps → saves → Question 3
- Completion summary with streak + insights

### 5. Quarterly Reset
- After 13 weeks: "Q1 complete! Ready to set Q2 focus?"
- Review Q1 progress
- Option to keep same questions OR choose new focus areas

---

## Dashboard Integration

### Setup Flow (After Baseline)
1. Card: "Set Up Your Accountability Agent"
2. Modal with 3-step wizard:
   - **Step 1:** Select 3 focus areas (suggested based on scores)
   - **Step 2:** Write or customize 3 questions
   - **Step 3:** Define measurement options
3. Preview → Confirm → First message sends next Monday

### Tracking Dashboard
- 3 line charts (one per custom question)
- Weekly data points over 12-week quarter
- Trend indicators (improving, stable, declining)
- AI-generated insights per question
- Comparison to baseline score

---

## Technical Architecture

### API Routes
- `/api/accountability/setup` - POST: Save 3 questions + options
- `/api/accountability/suggest` - GET: Return low-scoring sub-dimensions
- `/api/accountability/webhook` - POST: Receive WhatsApp responses
- `/api/accountability/send` - POST: Trigger weekly send (cron)

### WhatsApp Messages
- Button Messages for ≤3 options (single or multi-select)
- List Messages for 4-10 options
- Multi-select via `selection_type: "multiple"`

---

## Implementation Timeline

**Phase 1: MVP (2 weeks)**
- Setup wizard, database schema, WhatsApp builder, webhook handler, basic charts

**Phase 2: Intelligence (2 weeks)**
- AI suggestion engine, smart question templates, trend analysis, completion summary

**Phase 3: Polish (1 week)**
- Quarterly review flow, streak tracking, social sharing, mobile responsive

---

## Differentiation

- Not a generic habit tracker — questions derived from professional leadership assessment
- Not one-size-fits-all — users define what to measure
- Integrated with baseline — questions map to 15 dimensions
- Professional context — designed for CEOs, not personal habits

---

## Success Metrics

- 80%+ weekly completion rate
- Average response time: <2 minutes
- 2x score improvement for 80%+ completers vs baseline
- Quarterly retention: 90%+
- NPS: 50+ ("This keeps me accountable")
