# CEO Lab: Pilot Study Protocol v4.0
# Validating the Assessment Before Launch

**Created:** 2026-02-06
**Version:** 4.0
**Owner:** Nikolas Konstantin
**Status:** Pre-launch
**Dependencies:** Assessment System v4.0, Archetypes v4.0, Report Design v4.0, Scoring Engine v4.0

---

## PURPOSE

This protocol defines exactly how the CEO Lab assessment gets validated before it becomes a paid product. Every step, every metric, every decision point. The goal: confirm that the instrument measures what it claims to measure, differentiates between CEOs, and produces reports that leaders find genuinely useful.

---

## TIMELINE OVERVIEW

| Phase | Duration | Key Activity | Output |
|---|---|---|---|
| 1. Expert Review | Week 1 | Niko reviews all 96 items | Revised items (flagged or approved) |
| 2. Language Review | Week 2 | 5-8 CEOs review items for clarity and relevance | CEO feedback, revised items |
| 3. Instrument Lock | Week 3 | Final revisions, lock pilot version | Pilot-ready instrument |
| 4. Platform Build | Weeks 3-4 | Build assessment in delivery platform | Live assessment link |
| 5. Pilot Recruitment | Weeks 4-5 | Recruit 50-80 CEOs | Confirmed participants |
| 6. Data Collection | Weeks 5-8 | CEOs complete assessment | Raw response data |
| 7. Debrief Calls | Weeks 7-9 | 30-minute calls with ~20 CEOs | Qualitative feedback |
| 8. Statistical Analysis | Weeks 9-10 | Item analysis, reliability, validity | Analysis report |
| 9. Revision | Week 11 | Trim items, adjust scoring | Production instrument |
| 10. Production Lock | Week 12 | Lock final version | v4.1 (production) |

**Total duration: 12 weeks from start to production-ready instrument.**

---

## PHASE 1: EXPERT REVIEW (Week 1)

### Who
Niko reviews all 96 items solo.

### Process
For each item, evaluate against 5 quality criteria:

| Criterion | Question | Fail Example |
|---|---|---|
| **Behavioral** | Does it measure what the CEO does, not what they know? | "I understand the importance of psychological safety" (knowledge) |
| **Realistic** | Would a CEO encounter this monthly+? | "When leading a board-level crisis response..." (too rare) |
| **Sensitive** | Would the score change with 90 days of focused practice? | "I am naturally extroverted" (trait, not developable) |
| **Non-obvious** | Can the CEO identify the "right" answer instantly? | "I give my team members autonomy" (obvious social desirability) |
| **Jargon-free** | Zero framework names, zero coaching vocabulary? | "I practice radical candor with my direct reports" |

### Output
- Each item marked: Approved / Flagged (with reason) / Rewrite needed
- Flagged items revised before Phase 2
- Target: 0 items failing any criterion after revision

---

## PHASE 2: CEO LANGUAGE REVIEW (Week 2)

### Who
5-8 CEOs from the target audience (20+ employees, Series A+, €2M+ ARR). Recruited from existing relationships. These reviewers are NOT eligible for the pilot sample (to prevent contamination).

### Process
Each reviewer receives all 96 items in a spreadsheet. For each item, they answer:

1. **Clarity:** "Is this question clear? Would you know exactly what it's asking?" (Yes / No / Unclear)
2. **Relevance:** "Does this describe something you actually deal with as a CEO?" (Very relevant / Somewhat / Not relevant)
3. **Honesty:** "Could you answer this honestly, or would you feel pressure to give the 'right' answer?" (Could be honest / Would feel pressure)
4. **Language:** "Is there a word or phrase that feels off, unclear, or too 'coaching-speak'?" (Free text)

### Analysis
- Flag any item where ≥2 reviewers mark "Unclear" or "Not relevant"
- Flag any item where ≥3 reviewers say "Would feel pressure" (social desirability risk)
- Collect all language suggestions; revise where pattern is clear

### Output
- Revised items incorporating CEO feedback
- Documentation of changes (for Decision Log)

---

## PHASE 3: INSTRUMENT LOCK (Week 3)

### Process
1. Incorporate all revisions from Phases 1 and 2
2. Finalize item order within stages (randomized within stages, never blocked by dimension)
3. Lock the pilot instrument (no further changes until analysis)
4. Document locked version as "Assessment System v4.0-pilot"

### Deliverable
- Locked assessment with 96 items in final order
- Version-stamped copy stored in document registry

---

## PHASE 4: PLATFORM BUILD (Weeks 3-4)

### Requirements
- Assessment delivered as web form (mobile-responsive)
- 3-stage progressive design (Stage 1 → Stage 2 → Stage 3)
- Progress indicator showing stage and completion %
- Save-and-resume capability (CEO can leave and return)
- Item randomization within stages
- Response timestamps per item (for response time analysis)
- Completion timestamp per stage

### Technical specifications
Per Scoring Engine v4.0. Assessment platform must:
- Store all raw responses
- Calculate and store all scores on completion
- Generate report data object per Report Design v4.0
- Support Mirror Check link generation (unique URL per CEO)
- Support PDF report export

---

## PHASE 5: PILOT RECRUITMENT (Weeks 4-5)

### Target Sample
- **Minimum:** 50 completions (all 3 stages)
- **Ideal:** 80 completions
- **Maximum:** 100 (cap to manage debrief workload)

### Eligibility Criteria
- CEO, founder, or managing director
- Company with 20+ employees
- Series A or later (or equivalent revenue stage: €2M+ ARR)
- Not a current 1:1 coaching client of Niko (to avoid demand effects)
- Not a Phase 2 language reviewer

### Recruitment Channels

| Channel | Method | Expected Yield |
|---|---|---|
| Newsletter (The Mindful CEO) | Dedicated email with CTA | 15-25 |
| LinkedIn (organic post) | Post explaining the pilot, link to signup | 10-20 |
| Direct outreach | Personal messages to qualified CEOs | 10-15 |
| Wise Leaders Fellowship alumni | Direct invitation | 5-10 |
| Referral | Ask early signups to refer 1-2 peers | 5-10 |

### Incentive
- 3 months free CEO Lab access (activated at launch)
- 30-minute personal debrief call with Niko
- Early access to full report before public launch
- Name on the "Founding Pilot" acknowledgment (optional)

### Signup Flow
1. CEO clicks recruitment link
2. Landing page explains: what the pilot is, time commitment (~40 minutes for assessment + 30 minutes for debrief), what they get in return
3. Consent form (see Phase 5.1)
4. Basic demographics (company size, stage, role, years as CEO)
5. Receives unique assessment link via email

### 5.1 Consent

The consent form must include:

- Purpose of the pilot (validating a leadership assessment instrument)
- What participation involves (completing a ~40-minute assessment, optional 30-minute debrief call)
- Data usage: responses will be analyzed in aggregate for psychometric validation; individual reports are confidential to the CEO
- No personally identifiable data will be shared without explicit permission
- CEO can withdraw at any time and request data deletion
- Results are preliminary (pilot instrument, not yet validated)
- Aggregated, anonymized findings may be published (with consent)

---

## PHASE 6: DATA COLLECTION (Weeks 5-8)

### Process
- CEOs receive assessment link and complete at their own pace
- Automated reminders: Day 3 (if not started), Day 7 (if started but incomplete), Day 14 (final reminder)
- Mirror Check: after CEO completes, they receive a link to share with one trusted rater (optional for pilot)
- Target: 60%+ of enrolled CEOs complete all 3 stages

### Data Quality Checks (automated)
Run on each submission:

| Check | Flag If | Action |
|---|---|---|
| Total time < 10 minutes | Rushing | Flag for review, include in analysis with caution |
| Total time > 120 minutes | Distracted/multitasking | Flag (may indicate save-and-resume across days, which is fine) |
| Any item response time < 2 seconds | Not reading | Flag item responses |
| Zero variance within any stage | Same answer for every item | Exclude from analysis |
| IM score ≥ 5 | Extreme idealization | Include in analysis but note; may reduce reliability metrics |

### Tracking Dashboard
Real-time tracking during collection period:

- Total enrolled / started / completed Stage 1 / completed all
- Stage 1→2 completion rate (target: ≥70%)
- Stage 2→3 completion rate (target: ≥80%)
- Mirror Check completion rate
- Average completion time per stage
- Data quality flags

---

## PHASE 7: DEBRIEF CALLS (Weeks 7-9)

### Who
~20 CEOs from the pilot sample (mix of score ranges). Prioritize: CEOs who complete quickly (most engaged), CEOs flagged for unusual patterns, and CEOs who explicitly express interest.

### Format
30 minutes, 1:1, video call with Niko. Structured conversation:

**Part 1: Report Review (10 min)**
- Walk through their report
- "What resonates? What feels wrong?"
- "Is there anything in here that surprised you?"

**Part 2: Archetype Reaction (5 min)**
- "You matched [archetype]. Does that describe you?"
- "What would you change about this description?"
- If 0 matches: "None of our patterns matched. Does any of these 12 names ring true for you?"

**Part 3: Assessment Experience (5 min)**
- "Were any questions confusing?"
- "Did you feel pressure to give the 'right' answer?"
- "How long did it feel? Too long, about right, or surprisingly short?"

**Part 4: Value Assessment (5 min)**
- "If this were a paid product, would you find this report useful?"
- "What would make it more useful?"
- "Would you recommend this to a peer CEO?"

**Part 5: Mirror Check (5 min, if applicable)**
- "Did your rater complete it? If so, what was that conversation like?"
- "Did the blind spot data surprise you?"

### Data Capture
- Notes for each call (structured by the 5 parts above)
- Quantitative: archetype recognition (yes/no), report usefulness (1-5), NPS question
- Qualitative: themes from open feedback

---

## PHASE 8: STATISTICAL ANALYSIS (Weeks 9-10)

### 8.1 Item-Level Analysis

For each of the 75 behavioral items:

| Metric | Target | Action if Missed |
|---|---|---|
| Item mean | 2.0-4.0 | Anchors too easy or too hard; recalibrate |
| Item SD | ≥ 0.80 | Item not differentiating; rewrite |
| Item-total correlation (within dimension) | r ≥ .30 | Item doesn't measure the construct; drop or rewrite |
| Response distribution | No single option chosen > 60% | Ceiling/floor effect; rewrite |
| Response time mean | 5-30 seconds | Below: not reading. Above: confusing wording. |

### 8.2 Dimension-Level Analysis

For each of the 15 dimensions:

| Metric | Target | Action if Missed |
|---|---|---|
| Cronbach's α (5 behavioral items) | ≥ .70 | Drop weakest item, recalculate. If still < .65, rewrite dimension items. |
| Dimension mean | 2.0-4.0 | Population calibration issue |
| Dimension SD | ≥ 0.60 | Items not differentiating at dimension level |
| Inter-dimension correlations | r < .80 between any pair | Dimensions not distinct enough; consider merging or redefining |

### 8.3 SJI Analysis

For each of the 15 SJI items:

| Metric | Target | Action if Missed |
|---|---|---|
| Option distribution | No option > 50% | Options too transparent; revise |
| SJI-behavioral correlation (same dimension) | r = .20-.50 | Below .20: measuring different things. Above .50: redundant. |
| SJI maturity score vs. debrief validation | ≥60% agreement | Maturity rankings may be wrong; revise based on debrief data |

### 8.4 Impression Management Analysis

| Metric | Target | Action if Missed |
|---|---|---|
| IM mean | < 2.0 | Items too obvious; revise for subtlety |
| IM-CLMI correlation | r < .40 | Assessment too gameable; add more IM items or revise behavioral items |
| IM flag rate (% of sample with IM ≥ 4) | 10-25% | Below 10%: threshold too strict. Above 25%: threshold too lenient. |

### 8.5 Mirror Check & Blind Spot Index Analysis

| Metric | Target | Action if Missed |
|---|---|---|
| Completion rate | ≥ 40% of CEOs get a rater to complete | Below 40%: consider simplifying or adding incentive |
| Self-other correlation per dimension | r = .20-.50 | Below .20: measuring different constructs. Above .50: courtesy bias suspected. |
| Mean gap (self minus other) | 0.3-0.8 (CEOs score selves slightly higher) | Below 0.3: surprisingly aligned (good). Above 0.8: self-enhancement bias strong. |
| BSI mean | 10-25 | Below 10: raters may be too generous or items too similar. Above 25: construct mismatch between self and rater versions. |
| BSI SD | ≥ 5 | Below 5: BSI not differentiating between CEOs; review gap calculation. |
| Directional BSI mean | Positive (slight over-estimation expected) | If negative (CEOs underrate themselves on average): unexpected for target population; investigate. |
| BSI-IM correlation | r = .10-.40 | Below .10: BSI and IM measuring unrelated things (ok). Above .40: self-enhancement driving both; BSI may be redundant with IM. |

### 8.6 Archetype Analysis

| Metric | Target | Action if Missed |
|---|---|---|
| Match rate | ≥ 80% of CEOs match ≥ 1 archetype | Thresholds too strict; consider relaxing or adding partial match |
| Archetype distribution | No single archetype > 30% of matches | One archetype too broad; tighten signature |
| Co-occurrence | No two archetypes co-occur > 60% | Signatures too similar; differentiate or merge |
| Recognition rate (debrief) | ≥ 70% say "that's me" | Archetype descriptions don't resonate; rewrite |
| SJI confirmation rate | ≥ 60% | SJI tendency predictions wrong; revise prediction map |

### 8.7 Stage Completion Analysis

| Metric | Target | Action if Missed |
|---|---|---|
| Stage 1 completion (of enrolled) | ≥ 85% | Signup-to-start friction; simplify onboarding |
| Stage 1→2 transition | ≥ 70% | Stage 1 too long or not engaging; adjust staging |
| Stage 2→3 transition | ≥ 80% | Fatigue; consider shortening Stage 2 |
| Full completion (of enrolled) | ≥ 55% | Overall length problem; consider trimming to 4 items per dimension |
| Average total time | 30-50 minutes | Below 30: rushing concern. Above 50: fatigue. |

### 8.8 Report Validation

| Metric | Target | Source |
|---|---|---|
| Report comprehension | ≥ 90% can explain their top priority | Debrief |
| Archetype recognition | ≥ 70% "that's me" | Debrief |
| Report usefulness | ≥ 4.0 / 5.0 | Debrief |
| Action initiation | ≥ 70% attempt "this week" practice | 2-week follow-up |
| NPS (would recommend) | ≥ 40 | Debrief |

---

## PHASE 9: REVISION (Week 11)

### Decision Framework

Based on analysis results, apply decisions in this order:

**1. Item trimming**
If α ≥ .70 with all 5 items: keep all 5.
If α < .70: identify the weakest item (lowest item-total correlation) and calculate α-if-deleted. If removing 1 item achieves α ≥ .70, drop that item (production = 4 items for that dimension). If not, rewrite the two weakest items.

**2. SJI revision**
If option distribution is unbalanced (>50% choosing one option): revise the dominant option to be less obviously "right." If maturity ranking disagreed with debrief data (>40% of high-performing CEOs chose a "lower" option): re-rank options.

**3. IM revision**
If IM mean > 2.0: items are too obvious. Rewrite for subtlety. If IM-CLMI correlation > .40: social desirability is contaminating scores. Add 2 more IM items or revise the most transparent behavioral items.

**4. Archetype revision**
If an archetype has < 5% match rate: consider retiring. If two archetypes co-occur > 60%: merge into one or sharpen differentiation. If recognition < 50% for any archetype: rewrite portrait based on debrief feedback.

**5. Scoring adjustment**
If SJI-behavioral correlation across dimensions averages outside .20-.50: adjust the 70/30 weighting. If below .20: reduce SJI weight (e.g., 80/20). If above .50: consider equalizing (60/40).

**6. BSI threshold calibration**
Review BSI distribution from pilot Mirror Check data. If population mean differs substantially from the theoretical 10-25 range, adjust interpretation labels. If BSI-IM correlation > .40, BSI may be partially redundant with IM; document finding for future consideration.

**7. Parallel Forms: Begin Form B development**
Using pilot item-level data, identify which behavioral constructs per dimension produce the strongest items. Write 2 alternate Form B candidate items per dimension (150 total), targeting the same construct through different behavioral indicators. Schedule equivalence testing as a separate mini-pilot (30-50 CEOs, counterbalanced design). See Assessment V4.0, Parallel Forms Architecture for full development path.

### Log All Changes
Every revision gets a Decision Log entry (DL-019+) with statistical evidence.

---

## PHASE 10: PRODUCTION LOCK (Week 12)

### Process
1. Finalize all revisions
2. Re-run item analysis on revised instrument (simulated if no new data)
3. Version as "Assessment System v4.1 (production)"
4. Update all downstream documents: Scoring Engine, Report Design, Archetypes, Governance
5. Lock for launch

### Production Readiness Checklist

- [ ] All items meet quality criteria (Phase 1 standards)
- [ ] α ≥ .70 for all 15 dimensions
- [ ] Archetype recognition ≥ 70%
- [ ] Report usefulness ≥ 4.0 / 5.0
- [ ] Stage completion funnel within targets
- [ ] BSI thresholds calibrated against pilot data
- [ ] Response time tracking operational (timestamps, flags)
- [ ] Platform tested with 3 non-pilot users (UX validation)
- [ ] Report PDF generation working correctly
- [ ] Mirror Check flow working end-to-end
- [ ] Scoring Engine producing correct results (verified against manual calculation for 5 pilot cases)
- [ ] All documents updated to reflect revisions
- [ ] Decision Log entries complete for all changes
- [ ] Changelog updated (CHG-008)
- [ ] Form B candidate items written (150 items, for separate equivalence testing)

---

## RISK REGISTER

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Insufficient recruitment (< 50) | Medium | High (underpowered analysis) | Begin recruitment 2 weeks early; activate referral channel |
| Low completion rate (< 55%) | Medium | Medium (reduces usable data) | Optimize Stage 1 engagement; add mid-point encouragement email |
| Very low Mirror Check completion | High | Low (Mirror Check is add-on, not core) | Simplify rater experience; consider in-app instead of email |
| IM too high across population | Low | Medium (validity concern) | Revise IM items for subtlety; adjust threshold |
| Multiple dimensions fail α < .65 | Low | High (instrument reliability problem) | Major item rewrite; possible re-pilot for worst dimensions |
| CEOs don't recognize archetypes | Medium | High (core product IP at risk) | Use debrief data to rewrite; consider data-driven clustering |
| Form B fails equivalence testing | Medium | Medium (delays parallel forms, not launch) | Use best partial set; rotate 3 of 5 items per dimension as interim solution |
| BSI thresholds miscalibrated | Low | Low (labels wrong, math fine) | Recalibrate labels from actual pilot distribution |

---

**END OF PILOT STUDY PROTOCOL v4.0**
