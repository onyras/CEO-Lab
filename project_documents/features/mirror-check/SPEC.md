# Mirror Check - Feature Spec

**Status:** V4 questions drafted
**Source:** Extracted from CEO_LAB_ASSESSMENT_V4.md Section D

---

## Overview

360-lite add-on. One item per dimension (15 total), answered by a trusted rater (direct report, co-founder, chief of staff, or board member) about the CEO. Uses the same response scales as the main assessment.

---

## Rater Framing

*"Please answer based on what you actually observe, not what [CEO name] intends or aspires to. There are no right answers. Your honest perspective is the most valuable thing you can provide."*

---

## Mirror Check Items

| # | Dimension | Question |
|---|---|---|
| M01 | Self-Awareness | In the past 30 days, when this leader had a strong reaction, they noticed it and adjusted their behavior rather than being driven by it. |
| M02 | Emotional Mastery | In the past 30 days, this leader expressed difficult emotions in a way that was honest but not harmful. |
| M03 | Grounded Presence | In the past 30 days, when I spoke with this leader during important conversations, they were genuinely present and attentive. |
| M04 | Purpose & Mastery | This leader seems to be doing work that aligns with their deepest strengths. |
| M05 | Peak Performance | In the past 30 days, this leader appeared to be managing their energy and workload sustainably. |
| M06 | Building Trust | In the past 30 days, I felt comfortable bringing this leader bad news without fearing a negative reaction. |
| M07 | Hard Conversations | In the past 30 days, when this leader needed to address a difficult topic, they did so directly and in a timely way. |
| M08 | Diagnosis | In the past 30 days, when I brought this leader a problem, they asked questions before offering solutions. |
| M09 | Team OS | Our team currently has clear, effective rhythms that help us collaborate well. |
| M10 | Leader Identity | In the past 30 days, this leader empowered the team to make decisions rather than keeping control. |
| M11 | Strategic Clarity | I can clearly articulate our strategic priorities and use them to guide my own decisions. |
| M12 | Culture Design | In the past 30 days, this leader addressed behavior that went against our culture, even from strong performers. |
| M13 | Org Architecture | Decision rights and roles are clear enough that I rarely need to escalate or work around the structure. |
| M14 | CEO Evolution | This leader has visibly evolved their role to match the company's current needs. |
| M15 | Leading Change | In the past 30 days, this leader communicated openly about challenges and uncertainties, not just successes. |

---

## Gap Analysis

Gap = CEO self-score - Rater score.

| Gap | Interpretation |
|---|---|
| 0 to 0.5 | Aligned perception |
| 0.5 to 1.0 | Mild blind spot |
| 1.0 to 1.5 | Significant blind spot |
| 1.5+ | Critical blind spot (flag for coaching) |
| Negative | Possible under-confidence or imposter syndrome |

---

## Unlock & Encouragement Thresholds

- **Unlock threshold:** 5 completed responses → Mirror Check results become visible
- **Recommended goal:** 15 raters minimum for statistically reliable data
- Before 5 completions: home page shows invite progress, results tab is locked
- After unlock: gap analysis and self-vs-rater comparison are shown in results

## Naming Convention

- Single name throughout the product: **Mirror Check**
- "Blind spots" = the output/insight surfaced by Mirror Check (not a separate feature)
- Never use "Blind Spot Detection" as a feature name

## Implementation

- Phase 2+ feature (not MVP)
- Rater receives unique link via email
- Anonymous responses aggregated
- Dashboard shows self-vs-rater comparison per dimension
- Home page shows: invited rater list with status, progress toward 5 (unlock) and 15 (goal)
