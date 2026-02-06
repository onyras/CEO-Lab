# CEO Lab Assessment: Governance & Decision Architecture v4.0
# The System Behind the System

**Created:** 2026-02-06
**Updated:** 2026-02-06 (v4.0 realignment)
**Owner:** Nikolas Konstantin
**Status:** Living document (updated with every assessment change)
**Purpose:** Make every design decision traceable, every change auditable, and the entire system continuously improvable.

---

## PART 1: DOCUMENT HIERARCHY

### 1.1 Master Document Map

| ID | Document | Role | Current Version | Status |
|---|---|---|---|---|
| DOC-001 | Assessment System v4.0 | The instrument: all items, scales, staging, scoring overview | v4.0 | Pre-pilot |
| DOC-002 | Archetypes v4.0 | 12 pattern definitions, detection logic, report narratives | v4.0 | Pre-pilot |
| DOC-003 | Governance & Decisions (this) | Decision log, principles, registries, change process | v4.0 | Active |
| DOC-004 | Report Design Spec v4.0 | What the CEO sees: narrative, visualizations, Mirror/Meaning/Move | v4.0 | Pre-pilot |
| DOC-005 | Scoring Engine Spec v4.0 | Developer handoff: formulas, algorithms, database schema | v4.0 | Pre-pilot |
| DOC-006 | Pilot Study Protocol | Recruitment, consent, procedures, analysis plan, timeline | v1.0 | Pre-pilot |
| DOC-007 | Hook Assessment Spec | Free-tier 12-item instrument, scoring, report, conversion flow | v1.0 | Pre-pilot |
| DOC-008 | Onboarding & Intake Flow | Signup-to-assessment journey, Mirror Check setup, results delivery | v1.0 | Pre-pilot |
| DOC-009 | Changelog | Chronological record of version changes | Ongoing | Active |
| DOC-010 | Pilot Data & Analysis | Raw data, statistical outputs, trimming decisions | — | Not yet created |

### 1.2 Superseded Documents (archived, not deleted)

| Document | Replaced By | Reason |
|---|---|---|
| Assessment System v1.0 | v2.0 | Knowledge-based items replaced with behavioral |
| Assessment System v2.0 | v3.0 | Added SJI, IM, archetypes, staging |
| Assessment System v3.0 | v4.0 | DL-012: 18 dimensions misaligned with Konstantin Method; rebuilt to 15 |
| Archetypes v3.0 | v4.0 | DL-013: Signatures referenced dimensions that no longer exist |
| Governance v3.0 | v4.0 | Updated to reflect new document set and v4 decisions |

### 1.3 Document Rules

**Rule 1: No orphan decisions.** Every change must have a Decision Log entry.
**Rule 2: One source of truth per element.** Item text = Assessment System. Archetype defs = Archetypes. Scoring = Scoring Engine.
**Rule 3: Retired items are never deleted.** They move to the Item Registry with "Retired" status and reason.
**Rule 4: Version numbering.** Major (v3→v4) = structural change. Minor (v4.0→v4.1) = item revision. Patch (v4.1→v4.1.1) = typo.

---

## PART 2: DESIGN PRINCIPLES REGISTRY

### P1: Behavior Over Knowledge
Every item measures what a CEO does, not what they know. Framework knowledge ≠ leadership behavior.
**Established:** 2026-02-05 | **Override conditions:** None. Permanent.

### P2: Minimize Social Desirability Bias
The "right" answer should not be obvious. Reverse-scored items, IM detection, and SJIs counteract idealized self-reporting.
**Established:** 2026-02-05 | **Override conditions:** Reassess if pilot shows SD > 0.8 per dimension despite bias.

### P3: One Construct Per Item
Each item measures exactly one thing. No double-barreled questions.
**Established:** 2026-02-05 | **Override conditions:** None. Permanent.

### P4: Consistent Scale Architecture
Primary scale is behavioral frequency (1-5). Exceptions are documented and justified per item.
**Established:** 2026-02-05 | **Override conditions:** None.

### P5: Anchored to CEO Reality
Items describe situations CEOs encounter monthly+. Language matches how CEOs talk, not how coaches talk.
**Established:** 2026-02-05 | **Override conditions:** None.

### P6: Change Sensitivity
Items must be capable of detecting meaningful change within 90 days of focused development.
**Established:** 2026-02-05 | **Override conditions:** Reassess cadence if longitudinal data suggests slower change.

### P7: Multi-Method Measurement
No dimension relies on a single measurement method. Behavioral + SJI + Mirror Check triangulate.
**Established:** 2026-02-05 | **Override conditions:** If one method proves invalid, can reduce to two.

### P8: Archetypes Over Averages
Pattern intelligence (how dimensions interact) matters more than individual dimension scores.
**Established:** 2026-02-06 | **Override conditions:** None.

### P9: Method Alignment (NEW in v4)
Assessment dimensions must map 1:1 to Konstantin Method Playbook Library dimensions. Framework prescriptions must reference frameworks that live in the assessed dimension.
**Established:** 2026-02-06 | **Override conditions:** None. This principle prevents the structural crack that necessitated the v3→v4 rebuild. See DL-012.

---

## PART 3: DECISION LOG

Historical entries DL-001 through DL-011 are preserved from v3.0 governance. See archived CEO_LAB_GOVERNANCE.md (v3.0) for full text. Summary table:

| ID | Date | Decision | Status in v4 |
|---|---|---|---|
| DL-001 | 2026-02-05 | Replace knowledge items with behavioral | Still active |
| DL-002 | 2026-02-05 | Single primary scale (frequency 1-5) | Still active |
| DL-003 | 2026-02-05 | 2 reverse-scored per dimension | **Superseded by DL-012** (now 1 per dimension) |
| DL-004 | 2026-02-05 | Start at 108, trim to 72 | **Superseded by DL-005, then DL-012** |
| DL-005 | 2026-02-06 | 100 items, 3-section architecture | **Superseded by DL-012** (now 96 items) |
| DL-006 | 2026-02-06 | 4 dimensions get 5th behavioral item | **Superseded by DL-012** (all 15 get uniform 5 items) |
| DL-007 | 2026-02-06 | SJI: maturity-ranked + behavioral profile | Still active |
| DL-008 | 2026-02-06 | 70/30 behavioral/SJI composite | Still active |
| DL-009 | 2026-02-06 | 12 archetypes defined | Still active (signatures updated in DL-013) |
| DL-010 | 2026-02-06 | IM threshold: 4+ | Still active |
| DL-011 | 2026-02-06 | Stage 1 front-loads SJI + IM | Still active (adjusted staging in DL-012) |

---

### DL-012 | 2026-02-06 | Realign assessment from 18 dimensions to 15 (Konstantin Method)

**The structural crack:** v3's 18 assessment dimensions had drifted from the Konstantin Method Playbook Library's canonical 15-dimension architecture. The assessment measured "Multiplier Behavior" as a standalone dimension, but in the method, Multipliers sits inside "Diagnosing the Real Problem" (LT.3). Similarly, "Above the Line" was a standalone dimension, but in the method it lives inside "Self-Awareness" (LY.1). Framework prescription logic broke: CEOs scoring low on assessment dimensions received frameworks that lived elsewhere in the method architecture. The product story ("assessment finds gaps → method fills gaps") was structurally incoherent.

**Options considered:**
(a) Keep 18 dimensions, remap framework prescriptions to best-fit
(b) Reduce to 15 dimensions, full rebuild
(c) Expand the method to 18 dimensions to match the assessment

**Decision:** (b)

**Rationale:** (a) would create permanent mapping kludges and an ongoing maintenance burden. (c) would let the assessment tail wag the method dog. (b) is the only option that creates permanent structural coherence. The cost is a full rebuild. The benefit is that every future product feature (framework prescriptions, archetype signatures, coaching conversations) works from a single architectural truth.

**Impact:**
- Assessment: 100 items → 96 items (75 behavioral + 15 SJI + 6 IM)
- Dimensions: 18 sub-dimensions → 15 dimensions (uniform 5 per territory)
- Items per dimension: 4-5 variable → 5 uniform
- Reverse-scored items: 2 per dimension → 1 per dimension (DL-003 superseded)
- SJI count: 18 → 15 (1 per dimension, uniform)
- All archetype signatures require rebuild (see DL-013)
- All governance registries require update

**Principle(s):** P9 (Method Alignment, new), P1, P3

**Reversible?** No. This is a one-way architectural correction.

---

### DL-013 | 2026-02-06 | Rebuild all 12 archetype signatures against 15-dimension structure

**Trigger:** DL-012 made all v3 archetype signatures invalid (they referenced dimensions like "Multiplier Behavior," "Systems Thinking," "Delegation," "Communication Rhythm" that no longer exist as standalone dimensions).

**Options considered:**
(a) Mechanically remap old dimensions to new (find closest match)
(b) Rebuild each signature from scratch against new dimensions
(c) Retire archetypes, wait for pilot data to reveal empirical patterns

**Decision:** (b)

**Rationale:** (a) would produce signatures that don't reflect the actual dimensional semantics. "Delegation" doesn't map cleanly to any single v4 dimension; it spans LT.5 (Leader Identity), LT.3 (Diagnosing), and LO.4 (CEO Evolution). (c) loses 12 archetypes that are grounded in 15+ years of coaching observation and are core product IP. (b) preserves the coaching wisdom while ensuring structural integrity.

**Changes:**
- All 12 archetype HIGH/LOW signatures rebuilt using v4 dimension codes (LY.1-LO.5)
- SJI pattern references updated to v4 SJI numbering (SJ01-SJ15)
- Framework prescriptions updated to match dimensions where frameworks actually live
- Detection algorithm updated with partial match logic and SJI tendency cross-reference table
- Dimension coverage analysis added to verify all 15 dimensions appear in archetype system
- Mirror Check prediction added per archetype

**Principle(s):** P8, P9

**Reversible?** Signatures can be further refined after pilot. The rebuild is directionally permanent.

---

### DL-014 | 2026-02-06 | Create Report Design Specification

**Decision:** Create a dedicated document (DOC-004) defining the complete CEO report experience, separate from the assessment instrument and scoring engine.

**Rationale:** The report IS the product. Previously, report design was scattered across the Assessment System document and the Archetypes document. A dedicated spec ensures: (1) the CEO experience is designed holistically, (2) the development team has clear requirements for report generation, and (3) the narrative structure (Mirror/Meaning/Move) is defined once and referenced everywhere.

**Principle(s):** All

---

### DL-015 | 2026-02-06 | Create Scoring Engine Specification

**Decision:** Create a dedicated developer-facing document (DOC-005) containing all scoring formulas, algorithms, detection logic, and database schema.

**Rationale:** Scoring logic was embedded in the Assessment System document alongside dimension definitions and item text. Developers need a clean, code-ready reference without the coaching context. The separation also reduces the risk of scoring changes being made without updating the technical implementation (or vice versa).

**Principle(s):** Document Rule 2 (one source of truth)

---

### DL-016 | 2026-02-06 | Add Response Time Tracking

**Decision:** Record millisecond-precision timestamps for every item response. Use for real-time quality flags (rushing detection) and post-pilot item analysis (confusion detection, engagement patterns).

**Rationale:** Response time data is free to collect and expensive to retrofit. It enables two things that improve the instrument: (1) flagging unreliable submissions during data collection, and (2) identifying items that confuse CEOs (mean response time > 30s) or fail to engage them (uniform timing regardless of answer). The pilot protocol already referenced response time thresholds but the Assessment and Scoring Engine lacked formal specification.

**Impact:** New fields in data model (response_time_ms on item_responses, response_time_flags table). No impact on CEO experience; timing data is never shown to the CEO.

**Principle(s):** P3 (Assessment Over Time), P6 (Statistical Integrity)

---

### DL-017 | 2026-02-06 | Add Blind Spot Index (BSI)

**Decision:** Calculate an aggregate Blind Spot Index from Mirror Check data. BSI = mean of absolute gaps (CEO self-score minus rater score) across all 15 dimensions, on a 0-100 scale. A Directional BSI (signed mean) distinguishes over-estimation from under-confidence.

**Rationale:** Per-dimension gap data existed but no single metric captured overall self-awareness accuracy. BSI gives the CEO a memorable headline number alongside CLMI ("Your leadership maturity is 62%. Your self-awareness accuracy is 18.") and enables longitudinal self-awareness tracking. The formula is trivially derived from data already collected; only the aggregation and labeling are new.

**Impact:** BSI added to report Section 1 (headline) when Mirror Check is available. New table (blind_spot_index) in data model. New field (bsi) on assessment_sessions.

**Principle(s):** P3 (Assessment Over Time), P5 (Progressive Disclosure)

---

### DL-018 | 2026-02-06 | Architect Parallel Forms (A/B) for Quarterly Reassessment

**Decision:** Design the system architecture to support alternating Form A and Form B for behavioral and SJI items during quarterly reassessments. Form A = current v4.0 items. Form B = to be developed post-pilot. IM, Mirror Check, Weekly Signature, and Hook items remain fixed across forms.

**Rationale:** CEOs reassessing quarterly will encounter the same 75 behavioral items every 90 days. Practice effects (remembering "right" answers) and reduced engagement (familiarity) threaten longitudinal validity. However, writing 75 alternate items before pilot data confirms which Form A items work would be premature. The architecture is specced now; Form B item development begins after pilot analysis (v4.1+).

**Impact:** New field (form) on assessment_sessions and item_responses tables. Form selection logic added to Scoring Engine. No immediate item creation. Post-pilot: 150 candidate items written, equivalence-tested with 30-50 CEOs, best 75 selected.

**Principle(s):** P3 (Assessment Over Time), P9 (Method Alignment), P6 (Statistical Integrity)

**Note:** This is the first design decision with a deliberately deferred implementation. The architecture exists now; the content depends on pilot results.

---

## PART 4: ITEM REGISTRY (v4.0)

### 4.1 Active Items

| Range | Type | Count | Direction | Per Dimension |
|---|---|---|---|---|
| B01-B75 | Behavioral | 75 | 60 forward, 15 reverse | 5 (4F + 1R) |
| SJ01-SJ15 | Situational Judgment | 15 | N/A | 1 |
| IM01-IM06 | Impression Management | 6 | N/A | N/A |
| M01-M15 | Mirror Check | 15 | Forward | 1 |
| WS01-WS15 | Weekly Signature | 15 | Forward | 1 |

**Total active items:** 126 (96 in main assessment + 15 Mirror Check + 15 Weekly Signature)

**Planned items (post-pilot):**

| Range | Type | Count | Status |
|---|---|---|---|
| BA01-BA75 | Behavioral Form B | 75 | Not yet written. Depends on pilot item analysis (DL-018). |
| SJA01-SJA15 | SJI Form B | 15 | Not yet written. Depends on pilot SJI analysis (DL-018). |

### 4.2 Reverse-Scored Items

One per dimension (the 3rd item in each set of 5):
B03, B08, B14, B18, B23, B28, B33, B38, B43, B48, B53, B58, B63, B68, B73

### 4.3 Item Provenance

All v4 items are new compositions. They do not carry forward verbatim from v1-v3 (though many are informed by the same behavioral constructs). Canonical item text lives in DOC-001 (Assessment System v4.0).

### 4.4 Retired Items

All v3 items (B01-B76, SJ01-SJ18, IM01-IM06 from v3) are retired with status "Superseded by v4 rebuild (DL-012)." Full text preserved in archived Assessment System v3.0.

---

## PART 5: ARCHETYPE REGISTRY (v4.0)

| ID | Name | Status | HIGH Dimensions | LOW Dimensions | Established | Validated? |
|---|---|---|---|---|---|---|
| A01 | Brilliant Bottleneck | Active | LO.1, LY.1 | LT.5, LT.3, LO.4 | v3 / rebuilt v4 | Pending pilot |
| A02 | Empathetic Avoider | Active | LY.2, LT.1 | LT.2, LT.3, LT.5 | v3 / rebuilt v4 | Pending pilot |
| A03 | Lonely Operator | Active | LY.4, LY.5 | LT.4, LT.5, LO.4, LY.3 | v3 / rebuilt v4 | Pending pilot |
| A04 | Polished Performer | Active | Uniform high + IM ≥ 4 | Mirror gaps, SJI inconsistency | v3 / rebuilt v4 | Pending pilot |
| A05 | Visionary w/o Vehicle | Active | LO.1, LY.4, LY.1 | LO.3, LO.2, LT.4 | v3 / rebuilt v4 | Pending pilot |
| A06 | Conscious Leader, Stuck | Active | LY.1, LY.2, LY.3 | LO.1, LO.3, LO.4 | v3 / rebuilt v4 | Pending pilot |
| A07 | Firefighter | Active | LY.5, LY.2 | LO.3, LT.4, LY.3 | v3 / rebuilt v4 | Pending pilot |
| A08 | Democratic Idealist | Active | LT.1, LT.3 | LO.1, LT.2, LT.5 | v3 / rebuilt v4 | Pending pilot |
| A09 | Scaling Wall | Active | LY.5, LY.4, LT.1 | LO.4, LT.3, LT.5, LO.3 | v3 / rebuilt v4 | Pending pilot |
| A10 | Strategy Monk | Active | LO.1, LY.3, LY.1, LY.4 | LT.2, LT.4, LO.2 | v3 / rebuilt v4 | Pending pilot |
| A11 | Governance Orphan | Active | LT.1, LT.4, LO.1 | LO.5 | v3 / rebuilt v4 | Pending pilot |
| A12 | Accidental Culture | Active | LO.1, LO.4, LY.5 | LO.2, LT.1, LT.3 | v3 / rebuilt v4 | Pending pilot |

---

## PART 6: CHANGE MANAGEMENT PROCESS

### 6.1 How to Make a Change

1. **Propose:** Describe the change and rationale
2. **Check Principles:** Align with P1-P9 (override requires documented reasoning)
3. **Log:** Add Decision Log entry before implementing
4. **Update Registries:** Item Registry and/or Archetype Registry
5. **Version:** Update affected document version number
6. **Cascade:** Check downstream documents (Scoring Engine, Report Design, Technical Spec)

### 6.2 Change Categories

| Category | Examples | Approval | Decision Log? |
|---|---|---|---|
| Typo/formatting | Spelling, alignment | Self-approve | No |
| Item wording | Rewrite for clarity | Niko review | Yes |
| Item add/remove | New item, retire item | Niko + rationale | Yes + Registry |
| Scale change | Response scale modification | Niko + psychometric | Yes |
| Scoring change | Weighting, threshold, formula | Niko + data | Yes |
| Archetype change | Add, merge, retire, revise | Niko | Yes + Registry |
| Structural change | New section, staging, method | Niko + pilot consideration | Yes |
| Principle override | Deviation from P1-P9 | Niko + documented reasoning | Yes |

### 6.3 Post-Pilot Change Protocol

1. Run item analysis (α, item-total r, distributions)
2. Flag items meeting trimming criteria
3. Draft changes with data evidence
4. Log each in Decision Log with statistics
5. Update registries
6. Version all affected documents
7. Update Scoring Engine if logic changed

---

## PART 7: OPEN QUESTIONS

| ID | Question | Resolution Trigger | Status |
|---|---|---|---|
| OQ-001 | Are SJI maturity rankings correct? | Pilot debriefs | Open |
| OQ-002 | What is actual IM score distribution? | Pilot data | Open |
| OQ-003 | Is 70/30 behavioral/SJI weighting optimal? | Pilot correlations | Open |
| OQ-004 | Should all items be time-anchored to "past 30 days"? | Language review | Open |
| OQ-005 | Do archetypes resonate with real CEOs? | Pilot debriefs (≥70% recognition) | Open |
| OQ-006 | Is Mirror Check participation rate viable? | Pilot completion data | Open |
| OQ-007 | Do 5 items per dimension achieve α ≥ .70? | Pilot internal consistency | Open (updated: now 5 items, was 4) |
| OQ-008 | Stage-conditional weighting by company size? | 100+ completions | Open |
| OQ-009 | Should SJI include "Why?" text field? | Pilot test | Open |
| OQ-010 | **RESOLVED by DL-012.** Previously asked whether 4 "high-risk" dimensions needed extra items. v4 gives all dimensions 5 uniform items, eliminating the question. | — | Closed |
| OQ-011 | Numerical scores vs. verbal labels in report? | Pilot debriefs | Open |
| OQ-012 | Is 90 days the right reassessment cadence? | Longitudinal data | Open |
| OQ-013 | (NEW) Hook Assessment: is 12 items sufficient for territory-level signal? | Hook pilot conversion data | Open |
| OQ-014 | (NEW) Weekly Signature Questions: do CEOs sustain response rates past week 4? | Pulse engagement data | Open |
| OQ-015 | (NEW) Is the partial match threshold (2+ HIGH, 2+ LOW) too permissive for archetype detection? | Pilot archetype distribution | Open |
| OQ-016 | (NEW) Will Form B items achieve equivalence (α within .05, mean diff < 0.3, parallel r ≥ .70)? | Post-pilot equivalence testing | Open (deferred to v4.1) |
| OQ-017 | (NEW) What BSI range is typical for the CEO population? Calibration thresholds are theoretical. | Pilot Mirror Check data | Open |

---

## PART 8: ANNUAL REVIEW CHECKLIST

- [ ] Are all 9 design principles still valid?
- [ ] Do the 12 archetypes still match the CEO population?
- [ ] Have any items shown drift in correlation patterns?
- [ ] Is the IM threshold still appropriate?
- [ ] Any dimensions with persistent mean > 4.2 or < 2.0?
- [ ] Has the CEO population changed (stage, size, geography)?
- [ ] Are Konstantin Method frameworks still current? New frameworks to add?
- [ ] Is CLMI composite weighting supported by data?
- [ ] Are BSI thresholds calibrated against actual population data?
- [ ] Is Form B equivalence holding? Any form correction factors needed?
- [ ] Response time patterns: any items consistently triggering confusion flags?
- [ ] Any new measurement methods to add?
- [ ] Review all Open Questions: which can now be resolved?
- [ ] Check document hierarchy: all documents current and cross-referenced?

---

**END OF GOVERNANCE v4.0**
