# CEO Lab: Scoring Engine Specification v4.0
# Developer Handoff Document

**Created:** 2026-02-06
**Version:** 4.0
**Status:** Pre-pilot
**Audience:** Development team building the assessment platform
**Dependencies:** CEO_LAB_ASSESSMENT_V4.md, CEO_LAB_ARCHETYPES_V4.md, CEO_LAB_REPORT_DESIGN_V4.md

---

## OVERVIEW

This document contains every formula, algorithm, and decision rule needed to transform raw assessment responses into scores, archetypes, flags, and report content. No ambiguity should remain. If something is unclear, it is a bug in this spec.

---

## 1. ITEM STRUCTURE

### 1.1 Item Types and Counts

| Type | IDs | Count | Response Format | Raw Range |
|---|---|---|---|---|
| Behavioral | B01-B75 | 75 (5 per dimension) | 5-point Likert | 1-5 |
| Situational Judgment | SJ01-SJ15 | 15 (1 per dimension) | 4-option forced choice | 1-4 (maturity score) |
| Impression Management | IM01-IM06 | 6 | 5-point Likert | 1-5 (binary flag) |
| Mirror Check | M01-M15 | 15 (1 per dimension) | 5-point Likert | 1-5 |
| Weekly Signature | WS01-WS15 | 15 (1 per dimension) | 5-point scale | 1-5 |
| Hook Assessment | H01-H12 | 12 (4 per territory) | 5-point Likert | 1-5 |

### 1.2 Item-to-Dimension Map

Each dimension has exactly 5 behavioral items + 1 SJI + 1 Mirror Check + 1 Weekly Signature.

```
LY.1 Self-Awareness:        B01-B05  |  SJ01  |  M01  |  WS01
LY.2 Emotional Mastery:     B06-B10  |  SJ02  |  M02  |  WS02
LY.3 Grounded Presence:     B11-B15  |  SJ03  |  M03  |  WS03
LY.4 Purpose & Mastery:     B16-B20  |  SJ04  |  M04  |  WS04
LY.5 Peak Performance:      B21-B25  |  SJ05  |  M05  |  WS05
LT.1 Building Trust:        B26-B30  |  SJ06  |  M06  |  WS06
LT.2 Hard Conversations:    B31-B35  |  SJ07  |  M07  |  WS07
LT.3 Diagnosing Problems:   B36-B40  |  SJ08  |  M08  |  WS08
LT.4 Team Operating System: B41-B45  |  SJ09  |  M09  |  WS09
LT.5 Leader Identity:       B46-B50  |  SJ10  |  M10  |  WS10
LO.1 Strategic Clarity:     B51-B55  |  SJ11  |  M11  |  WS11
LO.2 Culture Design:        B56-B60  |  SJ12  |  M12  |  WS12
LO.3 Org Architecture:      B61-B65  |  SJ13  |  M13  |  WS13
LO.4 CEO Evolution:         B66-B70  |  SJ14  |  M14  |  WS14
LO.5 Leading Change:        B71-B75  |  SJ15  |  M15  |  WS15
```

### 1.3 Scoring Direction

Each dimension: 4 forward-scored + 1 reverse-scored behavioral items.
Pattern: Items 1, 2, 4, 5 are forward. Item 3 (the middle item) is reverse.

Reverse-scored items (15 total, one per dimension):
B03, B08, B13, B18, B23, B28, B33, B38, B43, B48, B53, B58, B63, B68, B73

### 1.4 Stage Assignment

| Stage | Behavioral Items | SJI Items | IM Items | Total |
|---|---|---|---|---|
| 1 (Engage) | 15 (1st item per dim) | SJ01-SJ11 | IM01-IM06 | 32 |
| 2 (Deepen) | 30 (2nd + 3rd per dim) | SJ12-SJ15 | - | 34 |
| 3 (Complete) | 30 (4th + 5th per dim) | - | - | 30 |
| **Total** | **75** | **15** | **6** | **96** |

---

## 2. ITEM-LEVEL SCORING

### 2.1 Behavioral Items

```
if scoring_direction == FORWARD:
    scored_value = raw_response                # Range: 1-5
if scoring_direction == REVERSE:
    scored_value = 6 - raw_response            # 1→5, 2→4, 3→3, 4→2, 5→1
```

### 2.2 SJI Items

Each SJI has 4 options. Each option is pre-assigned:
- A maturity score (1, 2, 3, or 4): measures developmental level
- A behavioral tag (Controller / Avoider / Rescuer / Facilitator): maps to archetype patterns

Maturity score rescaled to 1.0-5.0:
```
sji_scaled = (raw_maturity_score - 1) * 1.333 + 1

Mapping:
  Raw 1 → 1.000
  Raw 2 → 2.333
  Raw 3 → 3.667
  Raw 4 → 4.999
```

Store both the scaled maturity score AND the behavioral tag per SJI.

### 2.3 IM Items

Binary flag per item:
```
if raw_response >= 4: im_point = 1    # Implausibly positive
if raw_response <= 3: im_point = 0    # Normal range
```

### 2.4 Mirror Check Items

No reverse scoring. Direct use: `scored_value = raw_response` (1-5 scale).

---

## 3. DIMENSION-LEVEL SCORING

### 3.1 Behavioral Mean

```
behavioral_mean = sum(scored_values for 5 items in dimension) / 5
Range: 1.0 to 5.0
```

Missing items: If 4/5 answered, divide by 4. If 3 or fewer, mark dimension "incomplete."

### 3.2 Dimension Composite

```
composite = (0.70 * behavioral_mean) + (0.30 * sji_scaled)
Range: 1.0 to 5.0
```

If SJI is missing (dimensions SJ12-SJ15 are Stage 2; if only Stage 1 complete):
```
composite = behavioral_mean   # 100% behavioral
confidence = "partial"
```

### 3.3 Percentage Conversion

```
percentage = (composite - 1) / 4 * 100
Range: 0% to 100%
```

### 3.4 Verbal Labels

```
  0-20%:  "Critical gap"
 21-40%:  "Early development"
 41-60%:  "Building"
 61-80%:  "Strong"
 81-100%: "Mastery"
```

---

## 4. AGGREGATE SCORING

### 4.1 Territory Scores

```
territory_LY = mean(LY.1%, LY.2%, LY.3%, LY.4%, LY.5%)
territory_LT = mean(LT.1%, LT.2%, LT.3%, LT.4%, LT.5%)
territory_LO = mean(LO.1%, LO.2%, LO.3%, LO.4%, LO.5%)
```

### 4.2 CLMI

```
CLMI = mean(territory_LY, territory_LT, territory_LO)
Range: 0% to 100%
```

### 4.3 Impression Management

```
im_total = sum(im_points for IM01-IM06)    # Range: 0-6
im_flagged = (im_total >= 4)               # Boolean
```

IM is NEVER included in any composite, territory, or CLMI calculation.

---

## 5. MIRROR CHECK

### 5.1 Gap Calculation

```
For each dimension D:
  ceo_pct   = dimension percentage from composite
  rater_pct = (rater_raw - 1) / 4 * 100

  gap_pct = ceo_pct - rater_pct
  gap_raw = ceo_composite_raw - rater_raw    # Both on 1-5 scale
```

### 5.2 Gap Classification

Based on gap_raw (1-5 scale):
```
  |gap| <= 0.5:    "Aligned"
  |gap| 0.5-1.0:   "Mild blind spot"        (if positive) / "Possible under-confidence" (if negative)
  |gap| 1.0-1.5:   "Significant blind spot"  (if positive) / "Notable under-confidence" (if negative)
  |gap| > 1.5:     "Critical blind spot"     (if positive) / "Strong under-confidence" (if negative)
```

### 5.3 Flagging for Report

Flag all dimensions where |gap_raw| >= 1.0 for inclusion in report Section 6 (Blind Spots) and for priority dimension consideration.

### 5.4 Blind Spot Index (BSI)

A single number that captures overall self-awareness accuracy across all 15 dimensions. High BSI = large average gap between self-perception and rater perception. Low BSI = CEO sees themselves roughly as others do.

```python
def calculate_bsi(ceo_percentages, rater_percentages):
    """
    Both inputs: dict of {dimension: percentage} for all 15 dimensions.
    Returns BSI on 0-100 scale.
    """
    gaps = []
    for dim in ALL_15_DIMENSIONS:
        gap = ceo_percentages[dim] - rater_percentages[dim]
        gaps.append(abs(gap))
    
    bsi = mean(gaps)
    return round(bsi, 1)
```

**Range:** 0 to 100 (theoretical). In practice, expect 5-35.

**Interpretation:**
```
BSI 0-10:    "High self-awareness" (strong alignment between self and rater)
BSI 11-20:   "Moderate self-awareness" (typical for reflective CEOs)
BSI 21-30:   "Notable blind spots" (meaningful gaps in multiple dimensions)
BSI 31+:     "Significant self-perception gap" (self-view and external view diverge substantially)
```

**Directional BSI (optional, for coaching):**

The raw BSI treats over-estimation and under-estimation equally. A directional variant captures the tendency:

```python
def calculate_directional_bsi(ceo_percentages, rater_percentages):
    signed_gaps = []
    for dim in ALL_15_DIMENSIONS:
        gap = ceo_percentages[dim] - rater_percentages[dim]
        signed_gaps.append(gap)
    
    directional_bsi = mean(signed_gaps)
    return round(directional_bsi, 1)
    
    # Positive = CEO consistently rates self higher than rater (over-estimation)
    # Negative = CEO consistently rates self lower than rater (under-confidence)
    # Near zero = gaps exist but balance out in both directions
```

**Report usage:**
- BSI appears in report Section 1 (The Headline) when Mirror Check is available, alongside CLMI
- BSI appears in Section 6 (Blind Spots) with interpretation
- Tracked quarterly alongside CLMI for longitudinal self-awareness development

---

## 6. ARCHETYPE DETECTION ALGORITHM

### 6.1 Signatures

```json
{
  "Brilliant Bottleneck":      { "high": ["LO.1","LY.1"],           "low": ["LT.5","LT.3","LO.4"] },
  "Empathetic Avoider":        { "high": ["LY.2","LT.1"],           "low": ["LT.2","LT.3","LT.5"] },
  "Lonely Operator":           { "high": ["LY.4","LY.5"],           "low": ["LT.4","LT.5","LO.4","LY.3"] },
  "Polished Performer":        { "detection": "im_flag" },
  "Visionary Without Vehicle": { "high": ["LO.1","LY.4","LY.1"],    "low": ["LO.3","LO.2","LT.4"] },
  "Conscious Leader, Stuck":   { "high": ["LY.1","LY.2","LY.3"],    "low": ["LO.1","LO.3","LO.4"] },
  "Firefighter":               { "high": ["LY.5","LY.2"],           "low": ["LO.3","LT.4","LY.3"] },
  "Democratic Idealist":       { "high": ["LT.1","LT.3"],           "low": ["LO.1","LT.2","LT.5"] },
  "Scaling Wall":              { "high": ["LY.5","LY.4","LT.1"],    "low": ["LO.4","LT.3","LT.5","LO.3"] },
  "Strategy Monk":             { "high": ["LO.1","LY.3","LY.1","LY.4"], "low": ["LT.2","LT.4","LO.2"] },
  "Governance Orphan":         { "high": ["LT.1","LT.4","LO.1"],    "low": ["LO.5"] },
  "Accidental Culture":        { "high": ["LO.1","LO.4","LY.5"],    "low": ["LO.2","LT.1","LT.3"] }
}
```

### 6.2 Detection Steps

**Step 1: Polished Performer check**
```
if im_flagged == True:
    assign "Polished Performer" as primary archetype (display rank 1)
    continue to check other archetypes for secondary matches
```

**Step 2: Full match check (all standard archetypes)**
```
for each archetype:
    full_match = ALL high dimensions >= 70% AND ALL low dimensions <= 40%
    if full_match:
        signature_strength = mean(high_scores) - mean(low_scores)
        add to matches as "full" match
```

**Step 3: Partial match check**
```
for each archetype not already fully matched:
    high_met = count of high dimensions >= 70%
    low_met  = count of low dimensions <= 40%
    min_low  = min(2, count of low dimensions)   # Handle Governance Orphan (1 low dim)

    if high_met >= 2 AND low_met >= min_low:
        use only qualifying dimensions for strength calc
        signature_strength = mean(qualifying_highs) - mean(qualifying_lows)
        add to matches as "partial" match
```

**Step 4: Sort and limit**
```
sort matches: Polished Performer first (if present), then by signature_strength descending
full matches rank above partial matches at equal strength
display max 3
if more than 3: note overflow count
```

### 6.3 SJI Tendency Cross-Reference

Aggregate behavioral tags across 15 SJIs:
```
tendency_counts = count of each tag (Controller, Avoider, Rescuer, Facilitator)
dominant_tendency = tag with highest count
```

Expected tendencies per archetype:
```
Brilliant Bottleneck:      Controller
Empathetic Avoider:        Rescuer or Avoider
Lonely Operator:           Controller
Visionary Without Vehicle: Facilitator (strategy), Avoider (structure)
Conscious Leader, Stuck:   Facilitator
Firefighter:               Facilitator (pressure), Controller (systems)
Democratic Idealist:       Facilitator (process), Avoider (authority)
Scaling Wall:              Controller
Strategy Monk:             Facilitator
Governance Orphan:         Facilitator (internal), Avoider (board)
Accidental Culture:        Rescuer (people), Facilitator (strategy)
```

If dominant tendency matches expected: "Confirmed by situational responses."
If dominant tendency does not match: "Self-report and situational responses diverge. Worth exploring in coaching."

### 6.4 Mirror Check Amplification

When Mirror Check data is available:
```
for each matched archetype:
    for each LOW dimension in archetype signature:
        if mirror_gap for that dimension > 0 (CEO higher than rater):
            alignment_count += 1
        if mirror_gap < 0:
            contradiction_count += 1

    if alignment_count > contradiction_count: confidence = "high"
    if contradiction_count > alignment_count: confidence = "flag_for_review"
    else: confidence = "neutral"
```

---

## 7. PRIORITY DIMENSION SELECTION

Algorithm for selecting 3-5 dimensions for the Mirror/Meaning/Move deep dive.

```
Step 1: All dimensions <= 40% (max 3, lowest first)
Step 2: If < 3 priorities, add next lowest dimensions until 3
Step 3: If Mirror Check data, add dimensions with |gap| >= 1.0 (max 2 more)
Step 4: If no Mirror Check and < 5, add next lowest (max 2 more)
Hard cap: 5 priority dimensions
```

---

## 8. FRAMEWORK PRESCRIPTION

Lookup table mapping (dimension + score range) to framework names:

| Dimension | 0-40% (Critical) | 41-70% (Developing) | 71-100% (Strong) |
|---|---|---|---|
| LY.1 | Five Drivers, Above the Line | Drama Triangle, Reactive Patterns | Munger's Inversion |
| LY.2 | Wheel of Emotions, Idiot Compassion | 4 Stages Compassion, Emotional Fluidity | 50 Rules, Compassion Shift |
| LY.3 | 5 Enemies of Focus, Bandwidth | 3 Meditations, Flywheel | Wheel of Awareness, Wisdom Quadrant |
| LY.4 | Zone of Genius, Four Relationships | Dartboard Method, Kodawari | Musashi's 22 Rules |
| LY.5 | 5 Non-Negotiables, 80:20 | Deep Work, Yerkes-Dodson | ZRM Peak States |
| LT.1 | Trust Formula, Psych Safety basics | Mistakes→Trust, Lencioni Pyramid | Psych Safety advanced |
| LT.2 | NVC basics, Radical Candor | 4 Ways of Listening, Honest Mirror | NVC advanced, Generative Listening |
| LT.3 | 5 Dysfunctions, Self-Reliance Spiral | Multiplier Effect, 4 Relationship Killers | 5 Dysfunctions facilitation, Multiplier mastery |
| LT.4 | 4 Meetings (basic cadence) | 4 Meetings advanced, Off-Site Design | Custom rhythm design |
| LT.5 | Founder's Clarity, 3 Levels | Team One, 3 Levels advanced | Team One mastery |
| LO.1 | Drucker's Five Questions, 6 Strategy Traps | Playing to Win, Strategy Masks | Org Maturity Analysis |
| LO.2 | 4 Cultures Model, Four Quadrants | Growth Mindset, Decision Architecture | Inclusion Spectrum |
| LO.3 | Five Paradigms, Role Radar | Kaizen, Role Radar advanced | Consultant Readiness |
| LO.4 | Three Transitions, CEO Test | Three Deaths, Peter Principle | 5 Criteria for CEO Success |
| LO.5 | Onion Theory, Board Excellence basics | Ambidextrous Org, Board advanced | Transformation Readiness, Campaigning |

---

## 9. HOOK ASSESSMENT SCORING

12 items, 4 per territory.

```
Territory score = mean(4 items) converted to 0-100%:
  territory_pct = (mean_raw - 1) / 4 * 100

Sharpest insight = item with largest distance from midpoint (3.0):
  distance = abs(response - 3.0)
  Most extreme item → map to its primary dimension → select insight template
```

---

## 10. WEEKLY PULSE SCORING

```
Trend velocity (requires >= 8 data points):
  first_half_mean = mean of first half of scores
  second_half_mean = mean of second half of scores
  delta = second_half_mean - first_half_mean

  if delta >= 0.5:  "improving"
  if delta <= -0.5: "declining"
  else:             "stable"
```

---

## 11. EDGE CASES

| Scenario | Handling |
|---|---|
| Stage 1 only completed | Generate preview report. All scores from 1 item per dimension. No archetype detection. Confidence = "preliminary." |
| Stage 1+2 completed | Full SJI available. 3 items per dimension. Archetype preview (relaxed thresholds: HIGH ≥ 65, LOW ≤ 45). |
| Individual item skipped | Calculate dimension from available items. If < 1 item: "Insufficient data." |
| IM = 6 (maximum) | Polished Performer primary. All scores reported with validity caveat. Mirror Check given maximum prominence. |
| All rater scores = 5 | Flag as courtesy rating with advisory note. |
| All rater scores = 1 | Flag as adversarial rating with advisory note. |
| 0 archetype matches | Display: "Your profile doesn't match a single dominant pattern." Focus on dimension priorities. |
| 4+ archetype matches | Display top 3 by strength. Note: "Additional patterns detected." |
| CEO retakes (quarterly) | Store both sessions. Generate delta per dimension, archetype changes, CLMI trajectory. |
| Straight-line responding | Flag if all behavioral responses identical, or if any stage has zero variance. |
| Response time < 10 min total | Flag as potential rushing. |

---

## 12. RESPONSE TIME ANALYTICS

### 12.1 Data Collection

Every item response stores a timestamp. From these, three levels of timing data are calculated:

```python
# Per-item response time
item_time_ms = item_responded_at - item_displayed_at

# Per-stage elapsed time
stage_time = last_item_responded_at_in_stage - first_item_displayed_at_in_stage

# Total assessment time
total_time = final_item_responded_at - first_item_displayed_at
```

**Storage:** `response_time_ms` field on item_responses table.

### 12.2 Quality Flags

```python
def flag_response_times(item_responses, stage_times, total_time):
    flags = []
    
    # Item-level flags
    for item in item_responses:
        if item.response_time_ms < 2000:       # < 2 seconds
            flags.append(("item_too_fast", item.item_id, item.response_time_ms))
        if item.response_time_ms > 120000:      # > 2 minutes
            flags.append(("item_too_slow", item.item_id, item.response_time_ms))
    
    # Stage-level flags
    for stage, elapsed in stage_times.items():
        expected_min = {1: 8, 2: 10, 3: 8}      # minutes
        expected_max = {1: 25, 2: 30, 3: 25}
        if elapsed < expected_min[stage] * 60:
            flags.append(("stage_rushed", stage, elapsed))
        if elapsed > expected_max[stage] * 60:
            flags.append(("stage_slow", stage, elapsed))
    
    # Total flags
    if total_time < 600:                          # < 10 minutes total
        flags.append(("assessment_rushed", None, total_time))
    if total_time > 7200:                         # > 120 minutes total
        flags.append(("assessment_extended", None, total_time))
    
    return flags
```

### 12.3 Item Analysis Use (post-pilot)

Response time data enables two psychometric analyses:

**Confusion detection:** Items with mean response time > 30 seconds are candidates for rewording (CEOs are re-reading or unsure what is being asked).

**Discrimination analysis:** Items where response time does not vary by response choice (e.g., people answering 1 take the same time as people answering 5) may have low engagement. Items where extreme responses (1 or 5) take longer than middle responses (3) suggest thoughtful differentiation.

```python
def item_time_analysis(item_id, all_responses):
    """Post-pilot analysis. Not real-time."""
    responses = [r for r in all_responses if r.item_id == item_id]
    
    mean_time = mean([r.response_time_ms for r in responses])
    
    # Time by response value
    time_by_value = {}
    for value in [1, 2, 3, 4, 5]:
        subset = [r.response_time_ms for r in responses if r.raw_response == value]
        if subset:
            time_by_value[value] = mean(subset)
    
    return {
        "item_id": item_id,
        "mean_time_ms": mean_time,
        "time_by_response": time_by_value,
        "flag_confusion": mean_time > 30000,
        "flag_too_fast": mean_time < 4000
    }
```

### 12.4 Report Data (optional, coach-facing only)

Response time data is never shown to the CEO (it would create self-consciousness). For coach-facing reports:

- Total assessment time (context for interpretation)
- Number of items flagged as too fast (rushing indicator)
- Stages with notable pauses (may indicate save-and-resume or distraction)

---

## 13. PARALLEL FORMS ARCHITECTURE

### 13.1 Problem Statement

CEOs reassess quarterly. Seeing the same items every 90 days creates two risks:
- **Practice effects:** CEOs remember items and adjust responses toward "desired" answers
- **Reduced sensitivity:** Familiarity makes items feel less fresh, reducing thoughtful engagement

Parallel forms (Form A and Form B) solve this by alternating equivalent items across administrations.

### 13.2 Form Structure

```
Form A: Current v4.0 items (B01-B75, SJ01-SJ15)
Form B: Alternate items (BA01-BA75, SJA01-SJA15) — to be developed post-pilot
```

Each Form B item measures the same dimension with the same construct, different behavioral indicator.

**Example (LT.2 Hard Conversations):**
```
Form A (B31): "When a direct report is underperforming, I address it within two weeks."
Form B (BA31): "In the past 30 days, I initiated a difficult conversation I would have preferred to avoid."
```

Both measure the same behavior (willingness to have hard conversations promptly) through different observable indicators.

### 13.3 Equivalence Requirements

Before Form B goes into production, it must demonstrate:

| Metric | Requirement | Test Method |
|---|---|---|
| Same dimension α | Form B α within .05 of Form A α | Administer both to pilot subset |
| Comparable means | Form A/B mean difference < 0.3 per dimension | Counterbalanced within-subjects design |
| Comparable SDs | Form A/B SD ratio between 0.8 and 1.2 | Same design |
| Parallel reliability | Form A-B correlation per dimension r ≥ .70 | Test-retest with alternating forms |
| Same archetype detection | ≥ 80% agreement on primary archetype | Run detection on both form outputs |

### 13.4 Development Timeline

| Phase | When | Activity |
|---|---|---|
| 1. Pilot with Form A only | Now (v4.0) | Establish Form A psychometrics |
| 2. Write Form B candidates | Post-pilot (v4.1+) | 2 alternate items per dimension (150 candidates) |
| 3. Expert review of Form B | Post-pilot + 2 weeks | Niko reviews for construct fidelity |
| 4. Equivalence pilot | Post-pilot + 4 weeks | 30-50 CEOs take both forms (counterbalanced) |
| 5. Select Form B items | Post-pilot + 6 weeks | Pick best 5 per dimension based on equivalence data |
| 6. Production deployment | Post-pilot + 8 weeks | Alternating forms in quarterly reassessment |

### 13.5 Administration Logic

```python
def select_form(ceo_id, assessment_history):
    """
    Returns which form to administer.
    Alternates A/B on each reassessment.
    """
    previous_assessments = get_completed_assessments(ceo_id)
    
    if len(previous_assessments) == 0:
        return "A"  # First assessment always Form A
    
    last_form = previous_assessments[-1].form
    return "B" if last_form == "A" else "A"
```

### 13.6 Scoring Implications

Both forms use identical scoring formulas (Section 2-4). The only difference is which items are presented. Composite scores, territory scores, CLMI, archetype detection, and all downstream calculations remain unchanged.

**Longitudinal comparison:** When comparing Assessment 1 (Form A) to Assessment 2 (Form B), a small form effect may exist. After equivalence testing, if a systematic bias is found (e.g., Form B consistently scores 2% lower on LT.2), a form correction factor can be applied:

```python
def apply_form_correction(score, form, dimension, correction_table):
    if correction_table and dimension in correction_table[form]:
        return score + correction_table[form][dimension]
    return score  # No correction if table not yet established
```

### 13.7 Items That Do NOT Alternate

- **IM items (IM01-IM06):** Same every time. Social desirability detection works best with consistent items.
- **Mirror Check (M01-M15):** Same every time. Rater comparison requires stable items.
- **Weekly Signature Questions (WS01-WS15):** Same every time. Trend tracking requires consistency.
- **Hook Assessment (H01-H12):** Same every time. Conversion benchmarking requires consistency.

Only behavioral items (B01-B75) and SJI items (SJ01-SJ15) alternate.

### 13.8 Data Model Addition

```
item_responses: add column form CHAR(1) DEFAULT 'A'  -- 'A' or 'B'
assessment_sessions: add column form CHAR(1) DEFAULT 'A'
```

---

## 14. DATA STORAGE (Reference Schema)

```
assessment_sessions (id, ceo_id, version, form, started_at, completed_at, stage_reached, im_total, im_flagged, clmi, bsi, total_time_seconds)
item_responses (id, session_id, item_id, item_type, raw_response, scored_value, dimension, stage, response_time_ms, responded_at)
dimension_scores (id, session_id, dimension, behavioral_mean, sji_scaled, composite, percentage, verbal_label, confidence)
territory_scores (id, session_id, territory, score, verbal_label)
archetype_matches (id, session_id, archetype_name, match_type, signature_strength, sji_confirmed, mirror_amplified, display_rank)
mirror_sessions (id, session_id, rater_email, rater_relationship, completed_at)
mirror_responses (id, mirror_session_id, dimension, raw_response, percentage)
mirror_gaps (id, session_id, dimension, ceo_pct, rater_pct, gap_pct, gap_label, severity)
blind_spot_index (id, session_id, bsi, directional_bsi)
weekly_pulse (id, ceo_id, dimension, score, quarter, responded_at)
hook_sessions (id, ceo_id, completed_at, ly_score, lt_score, lo_score, sharpest_dimension, converted)
response_time_flags (id, session_id, flag_type, item_id, value_ms, stage)
```

---

**END OF SCORING ENGINE SPECIFICATION v4.0**
