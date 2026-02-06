# CEO Lab - Dashboard Design Specification (V3)

**Last Updated:** 2026-02-04
**Source:** Extracted from PRODUCT_STRATEGY.md dashboard section

---

## Design Philosophy

**Core Principle:** Strategic depth + visual interactivity

**V3 Approach:** Merge ChatGPT's clean, sophisticated design with visual density and interactive features.

---

## Key Design Decisions

### 1. Visual Style
- **Base:** ChatGPT's cleaner, more sophisticated aesthetic
- **Enhancement:** Keep all visualizations (charts, rings, radar, heatmap)
- **Typography:** More whitespace, bigger headlines, tighter hierarchy
- **Layout:** Card-based with subtle borders, not heavy boxes
- **Colors:** Beige background (#F7F3ED), accent colors for territories only (blue/green/orange)

### 2. Strategic Sections

**Decision Friction Index**
- Shows % of organizational decisions routing through CEO
- Benchmark comparison (e.g., "41% vs 28% healthy")
- Primary drivers identified (Communication Rhythm, Delegation, Governance)
- Impact statement on business velocity
- Horizontal bar visualization

**Leadership Debt**
- Gap between highest and lowest sub-dimensions
- Shows organizational inconsistency
- Simple number display (e.g., "30-point gap")
- Explains cost of inconsistency

**"If I Were Your Coach"**
- 3 specific interventions ranked by leverage
- Each includes: Current state, Target, Expected lift, Timeline
- No sliders or what-if scenarios (removed for now)
- Clear prescriptive recommendations

**Leadership Wrapped**
- Spotify-style annual highlights
- Three cards: Biggest Growth, Most Consistent, Largest Drop
- Dimension names + score changes
- Shareable, emotional, memorable

### 3. Peer Comparisons (Enhanced)

**Current (weak):** Basic "You: 76, Peer: 71" text

**V3 (enhanced):**
- Multiple cohort filters (All CEOs, Series A, SaaS, Team Size 20-50)
- Show your score vs each cohort median
- Contextual interpretation ("Your advantage narrows in Series A cohort")
- Visual distribution curve with your marker
- Percentile within each cohort
- Integrated throughout dashboard (not just one section)

**Show peer context everywhere:**
- Hero score card: Distribution bar with peer median
- Territory cards: "Your cohort median: 72 (+2 advantage)"
- Heatmap cells: "Peer: 74 (-6 gap) ← Blind spot"
- Radar chart: Ghost overlay of peer median (toggleable)

### 4. Removed/Postponed

**What-If Scenarios:** Removed (looks unpolished, projections not accurate enough)
**Historical Comparison Toggle:** Simplified (integrate naturally, not toggle for every chart)

### 5. Proprietary Language (Konstantin Method)

**No external framework mentions:**
- Don't mention: Trust Formula, Drama Triangle, 5 Dysfunctions, CEO Test
- Use instead: Konstantin Method proprietary concepts

**Proprietary terminology:**

**Leading Yourself:**
- Energy Architecture, Purpose & Direction, Self-Awareness
- Leading above the Line, Emotional Intelligence, Grounded Presence

**Leading Teams:**
- Trust Scaffolding, Delegation Load, Feedback Loops
- Multiplier Behavior, Team Health, Communication Rhythm

**Leading Organizations:**
- Strategic Clarity, Execution Rigor, Systems Thinking
- Culture as System, Organizational Design, Governance Alignment

### 6. Section Structure (V3 Final)

1. Hero (score card + 3 rings + peer comparison bar)
2. Konstantin Method Map (proprietary concepts, domain cards)
3. Territory Scores (progress bars + insights)
4. Sub-Dimension Heatmap (clickable cells with drill-down)
5. Leadership Signature (radar chart with peer overlay option)
6. Hidden Patterns (punchier AI insights)
7. **Decision Friction Index** (new)
8. **Leadership Debt** (new)
9. Question Drivers (with click-to-explore)
10. 12-Week Trends (line charts)
11. Benchmark Distribution (enhanced peer comparison)
12. **Leadership Wrapped** (new)
13. Metrics Library (12 KPI tiles)
14. Leverage Matrix (Impact vs Control)
15. **"If I Were Your Coach"** (new)
16. Your Next 30 Days (3 priority actions)

**Total:** 16 sections (4 new, 12 enhanced)

---

## Implementation Notes

**Design Base:**
- Use ChatGPT's spacing and hierarchy as foundation
- Apply to all existing visual components
- No custom inline styles - use design system
- Card-based layout throughout

**Interactive Features to Keep:**
- Click any heatmap cell → modal with details
- Click question drivers → see contributing questions
- Hover states with contextual info
- Smooth animations and transitions

**Interactive Features to Remove:**
- What-if scenario sliders
- Historical comparison toggles
- Excessive hover states

**Technical:**
- Keep all canvas/SVG visualizations
- Enhance modal system for drill-downs
- Better loading states and animations
- Responsive design for mobile

---

## Success Metrics

**User feedback should be:**
- "This is sophisticated" (design quality)
- "I can explore everything" (interactivity)
- "I didn't know that about myself" (insights)
- "I know exactly what to work on" (actionability)

**Technical metrics:**
- Dashboard load time: <2 seconds
- Mobile responsive: All sections usable on phone
- Accessibility: WCAG AA compliant

---

## MVP Priority

| Must Have (Launch) | Next (Month 2) | Later |
|---|---|---|
| 1. Hero Score Card | 6. Hidden Patterns | 7. Decision Friction Index |
| 3. Territory Scores | 9. Question Drivers | 11. Benchmark Distribution |
| 4. Sub-Dimension Heatmap | 10. 12-Week Trends | 12. Leadership Wrapped |
| 5. Leadership Signature | 13. Metrics Library | 14. Leverage Matrix |
| 8. Leadership Debt | | |
| 15. "If I Were Your Coach" | | |
| 16. Your Next 30 Days | | |
