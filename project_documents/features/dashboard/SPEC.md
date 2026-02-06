# Dashboard - Feature Spec

**Status:** Design complete (V3), ready for implementation
**Full specification:** See `design/DASHBOARD_SPEC.md` for complete section-by-section design.

---

## Overview

Two main views:
1. **Baseline Profile** — Heatmap of all dimensions, color-coded by score
2. **Weekly Tracking** — Line graphs for focus areas over 12-week quarter

---

## MVP Sections (7 of 16)

1. **Hero Score Card** — Overall score + 3 territory rings + peer comparison
2. **Territory Scores** — 3 territories with progress bars + insights
3. **Sub-Dimension Heatmap** — Clickable cells with drill-down modals
4. **Leadership Signature** — Radar chart with optional peer overlay
5. **Leadership Debt** — Gap between highest and lowest dimensions
6. **"If I Were Your Coach"** — 3 specific interventions ranked by leverage
7. **Your Next 30 Days** — 3 priority actions based on scores

---

## Color Coding

| Score Range | Color | Label |
|---|---|---|
| 0-20% | Red | Critical gap |
| 21-40% | Orange | Early development |
| 41-60% | Yellow | Building |
| 61-80% | Green | Strong |
| 81-100% | Blue | Mastery |

---

## Technical

- React Query for data fetching + caching
- Recharts or D3.js for visualizations
- Modal system for drill-downs
- Dashboard load time target: <2 seconds
- Mobile responsive: all sections usable on phone
