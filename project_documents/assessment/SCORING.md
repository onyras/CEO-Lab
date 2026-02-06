# CEO Lab - Scoring Architecture

**Last Updated:** 2026-02-06
**Source:** Extracted from CEO_LAB_ASSESSMENT_V4.md Section H
**Persists across assessment versions** — scoring logic is independent of question content.

---

## Response Scales

**Primary scale (Frequency):** Used for ~80% of behavioral items.
1 = Almost never (0-10% of the time)
2 = Rarely (10-30%)
3 = Sometimes (30-60%)
4 = Often (60-90%)
5 = Almost always (90-100%)

**Secondary scale (Degree):** Used when frequency doesn't apply.
1 = Not at all → 5 = Fully

**Secondary scale (Confidence):** Used for perceived team-level conditions.
1 = Very unlikely → 5 = Very likely

**Impression Management scale:** Standard 1-5 frequency. Scored 0 (realistic: 1-3) or 1 (implausibly positive: 4-5).

**Time anchoring:** All behavioral items anchored to "in the past 30 days" or "in a typical week."

---

## Item Notation

- **(F)** = Forward-scored (higher = more developed)
- **(R)** = Reverse-scored (higher on scale = less developed; inverted before aggregation)
- **[Freq]** = Frequency scale
- **[Deg]** = Degree scale
- **[Conf]** = Confidence scale
- **[Custom]** = Custom scale defined in the item

---

## Sub-Dimension Composite Score

For each of the 15 dimensions:

1. **Behavioral score:** Mean of 5 items (reverse-scored items inverted: new_score = 6 - raw_score). Range: 1.0-5.0
2. **SJI score:** Single item, scored 1-4, rescaled to 1.0-5.0 (formula: (raw - 1) × 1.33 + 1)
3. **Composite:** 70% behavioral + 30% SJI
4. **Converted to 0-100% scale:** (composite - 1) / 4 × 100

---

## Verbal Labels

| Score | Label | Meaning |
|---|---|---|
| 0-20% | Critical gap | This dimension is likely causing visible problems now |
| 21-40% | Early development | Awareness exists but behavior hasn't shifted consistently |
| 41-60% | Building | Active development; inconsistent but trending upward |
| 61-80% | Strong | Consistent behavior; room for refinement |
| 81-100% | Mastery | Rare; consistent excellence others can observe |

---

## Territory Score

Each territory = mean of its 5 dimension composites.

---

## CLMI (CEO Leadership Maturity Index)

CLMI = mean of 3 territory scores.

---

## Impression Management

IM score = sum of items scored 1 (implausibly positive response). Range: 0-6.
- IM 0-3: No flag
- IM 4-6: Validity flag. Report message: "Your responses suggest a tendency to present an idealized picture. This assessment is most valuable when answered with radical honesty. Consider retaking with the intent to describe your actual behavior, not your aspirations."

IM score is NOT included in the CLMI.

---

## Mirror Check Gaps

For each dimension: Gap = CEO self-score - Rater score.
- 0 to 0.5: Aligned perception
- 0.5 to 1.0: Mild blind spot
- 1.0 to 1.5: Significant blind spot
- 1.5+: Critical blind spot (flag for coaching)
- Negative gap (rater scores higher): Possible under-confidence or imposter syndrome

---

## SJI Scoring

Each scenario option receives:
- Maturity score (1-4)
- Behavioral profile tag: Rescuer / Avoider / Controller / Facilitator

Tags tracked across all 15 SJIs to generate secondary behavioral tendency map.

---

## Staging Design

### Stage 1: Engage (~32 items, ~15 minutes)
- 15 behavioral items (1st item per dimension)
- 11 SJI items (SJ01-SJ11)
- 6 IM items (IM01-IM06)
- Total: 32

### Stage 2: Deepen (~34 items, ~15 minutes)
- 30 behavioral items (2nd and 3rd items per dimension)
- 4 SJI items (SJ12-SJ15)
- Total: 34

### Stage 3: Complete (~30 items, ~12 minutes)
- 30 behavioral items (4th and 5th items per dimension)
- Total: 30

**Grand total: 96 items**

Items randomized within stages across dimensions (never blocked by dimension to prevent halo effects).
