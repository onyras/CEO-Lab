# CEO Lab - Database Schema Documentation

## Entity Relationship Diagram (ERD)

```
┌─────────────────┐
│   auth.users    │ (Supabase Auth)
│  (Built-in)     │
└────────┬────────┘
         │
         │ 1:1
         │
         ▼
┌─────────────────────────────────────────────┐
│          user_profiles                      │
├─────────────────────────────────────────────┤
│ id (PK, FK → auth.users)                   │
│ full_name                                   │
│ baseline_stage (0, 1, 2, 3)                │
│ baseline_completed                          │
│ hook_completed                              │
│ subscription_status                         │
│ stripe_customer_id                          │
│ stripe_subscription_id                      │
└──────────┬──────────────────────────────────┘
           │
           │ 1:many
           │
    ┌──────┴──────┬──────────┬────────────┬──────────┐
    │             │          │            │          │
    ▼             ▼          ▼            ▼          ▼
┌───────────┐ ┌────────┐ ┌────────┐ ┌─────────┐ ┌──────────┐
│   hook_   │ │baseline│ │quarterly│ │ weekly_ │ │  user_   │
│assessments│ │assess- │ │ _focus  │ │check_ins│ │ streaks  │
│           │ │ments   │ │         │ │         │ │          │
└─────┬─────┘ └───┬────┘ └────┬────┘ └────┬────┘ └──────────┘
      │           │           │            │
      │           │           │ 1:many     │
      │           │           │            │
      ▼           ▼           ▼            ▼
┌─────────┐ ┌─────────┐ ┌─────────┐ ┌──────────┐
│  hook_  │ │baseline_│ │(implicit)│ │ weekly_  │
│responses│ │responses│ │          │ │responses │
└─────────┘ └─────────┘ └─────────┘ └──────────┘
```

---

## Core Tables (Phase 1 MVP)

### 1. user_profiles
**Purpose:** Extended user data beyond Supabase Auth

| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | References auth.users.id |
| full_name | TEXT | User's display name |
| baseline_stage | INTEGER | Current stage: 0 (not started), 1 (30%), 2 (60%), 3 (100%) |
| baseline_completed | BOOLEAN | Has user completed full baseline? |
| hook_completed | BOOLEAN | Has user completed free hook assessment? |
| subscription_status | TEXT | 'inactive', 'active', 'cancelled', 'past_due' |
| stripe_customer_id | TEXT | Stripe customer ID for billing |
| stripe_subscription_id | TEXT | Stripe subscription ID |
| created_at | TIMESTAMP | Account creation time |
| updated_at | TIMESTAMP | Last profile update |

**Indexes:**
- `idx_user_profiles_subscription` on `subscription_status`

**Triggers:**
- Auto-created on user signup via `on_auth_user_created` trigger
- Auto-updates `updated_at` on changes

---

### 2. hook_assessments
**Purpose:** Free 12-question entry point assessment

| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Unique assessment ID |
| user_id | UUID (FK) | NULL for anonymous, or references auth.users |
| score_yourself | INTEGER | Total score for "Leading Yourself" (max 16) |
| score_teams | INTEGER | Total score for "Leading Teams" (max 16) |
| score_organizations | INTEGER | Total score for "Leading Organizations" (max 16) |
| total_score | INTEGER | Sum of all three territories (max 48) |
| completed_at | TIMESTAMP | When assessment was finished |
| created_at | TIMESTAMP | When assessment started |

**RLS:** Allows anonymous inserts (for pre-signup hook assessment)

---

### 3. hook_responses
**Purpose:** Individual answers to 12 hook questions

| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Unique response ID |
| assessment_id | UUID (FK) | References hook_assessments.id |
| question_number | INTEGER | 1-12 |
| answer_value | INTEGER | Points (1-4) |
| created_at | TIMESTAMP | Response time |

**Indexes:**
- `idx_hook_assessments_user` on `user_id`

---

### 4. baseline_assessments
**Purpose:** Track staged baseline assessment progress (30% → 60% → 100%)

| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Unique assessment ID |
| user_id | UUID (FK) | References auth.users.id |
| stage | INTEGER | 1 (30%), 2 (60%), 3 (100%) |
| score_yourself | INTEGER | Leading Yourself score (max 60) |
| score_teams | INTEGER | Leading Teams score (max 60) |
| score_organizations | INTEGER | Leading Organizations score (max 60) |
| total_score | INTEGER | Sum of all territories (max 180) |
| completed_at | TIMESTAMP | Stage completion time |
| created_at | TIMESTAMP | Stage start time |

**Key Logic:**
- User completes Stage 1 (30 questions) → stage = 1
- User completes Stage 2 (30 more questions) → stage = 2
- User completes Stage 3 (40 final questions) → stage = 3

**Indexes:**
- `idx_baseline_assessments_user` on `user_id`

---

### 5. baseline_responses
**Purpose:** Individual answers to 100 baseline questions

| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Unique response ID |
| user_id | UUID (FK) | References auth.users.id |
| assessment_id | UUID (FK) | References baseline_assessments.id |
| question_number | INTEGER | 1-100 |
| sub_dimension | TEXT | e.g., "Energy Management", "Trust Formula" |
| territory | TEXT | "Leading Yourself", "Leading Teams", "Leading Organizations" |
| answer_value | INTEGER | Points (1-5) |
| stage | INTEGER | Which stage this question belongs to (1, 2, or 3) |
| created_at | TIMESTAMP | Response time |

**Indexes:**
- `idx_baseline_responses_user` on `user_id`
- `idx_baseline_responses_subdim` on `sub_dimension`

---

### 6. sub_dimension_scores
**Purpose:** Calculated scores for dashboard heatmap (18 sub-dimensions)

| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Unique score ID |
| user_id | UUID (FK) | References auth.users.id |
| sub_dimension | TEXT | e.g., "Energy Management", "Psychological Safety" |
| territory | TEXT | "Leading Yourself", "Leading Teams", "Leading Organizations" |
| current_score | INTEGER | Sum of points earned |
| max_possible_score | INTEGER | Maximum points possible |
| percentage | DECIMAL | (current_score / max_possible_score) * 100 |
| last_updated | TIMESTAMP | When score was recalculated |
| created_at | TIMESTAMP | First calculation time |

**Unique Constraint:** `(user_id, sub_dimension)` - one score per user per dimension

**Indexes:**
- `idx_sub_dimension_scores_user` on `user_id`

**Color Coding for Dashboard:**
- Red: 0-30%
- Yellow: 30-60%
- Green: 60-80%
- Blue: 80-100%

---

### 7. quarterly_focus
**Purpose:** User's chosen 3 sub-dimensions to track per quarter

| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Unique focus record ID |
| user_id | UUID (FK) | References auth.users.id |
| year | INTEGER | e.g., 2026 |
| quarter | INTEGER | 1, 2, 3, or 4 |
| sub_dimension_1 | TEXT | First chosen dimension |
| sub_dimension_2 | TEXT | Second chosen dimension |
| sub_dimension_3 | TEXT | Third chosen dimension |
| created_at | TIMESTAMP | When focus was set |
| updated_at | TIMESTAMP | Last update time |

**Unique Constraint:** `(user_id, year, quarter)` - one focus selection per user per quarter

**Example:**
```
user_id: abc123
year: 2026
quarter: 1
sub_dimension_1: "Energy Management"
sub_dimension_2: "Trust Formula"
sub_dimension_3: "Strategic Clarity"
```

**Indexes:**
- `idx_quarterly_focus_user_period` on `(user_id, year, quarter)`

---

### 8. weekly_check_ins
**Purpose:** Weekly tracking session records

| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Unique check-in ID |
| user_id | UUID (FK) | References auth.users.id |
| week_start_date | DATE | Monday of the week (e.g., 2026-01-06) |
| year | INTEGER | 2026 |
| quarter | INTEGER | 1, 2, 3, or 4 |
| week_number | INTEGER | 1-12 (week within quarter) |
| completed | BOOLEAN | Has user answered all 3 questions? |
| completed_at | TIMESTAMP | When check-in was completed |
| created_at | TIMESTAMP | Check-in created time |

**Unique Constraint:** `(user_id, week_start_date)` - one check-in per week

**Indexes:**
- `idx_weekly_check_ins_user` on `user_id`
- `idx_weekly_check_ins_user_date` on `(user_id, week_start_date)`
- `idx_weekly_check_ins_completion` on `(user_id, completed)`

---

### 9. weekly_responses
**Purpose:** Individual answers to 3 weekly questions

| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Unique response ID |
| check_in_id | UUID (FK) | References weekly_check_ins.id |
| user_id | UUID (FK) | References auth.users.id |
| sub_dimension | TEXT | Which focus area this answers |
| question_text | TEXT | The actual question asked |
| answer_value | INTEGER | Numeric answer (if applicable) |
| answer_text | TEXT | Text answer (if applicable) |
| created_at | TIMESTAMP | Response time |

**Example:**
```
sub_dimension: "Energy Management"
question_text: "This week, how many hours of Deep Work did you complete?"
answer_value: 18
answer_text: NULL
```

**Indexes:**
- `idx_weekly_responses_checkin` on `check_in_id`
- `idx_weekly_responses_user` on `user_id`

---

### 10. user_streaks
**Purpose:** Track weekly completion streaks for motivation

| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Unique streak ID |
| user_id | UUID (FK) | References auth.users.id (UNIQUE) |
| current_streak | INTEGER | Consecutive weeks completed |
| longest_streak | INTEGER | Best streak ever achieved |
| total_weeks_completed | INTEGER | Lifetime total |
| last_completion_date | DATE | Most recent check-in week |
| updated_at | TIMESTAMP | Last update time |

**Unique Constraint:** `user_id` - one streak record per user

**Auto-Updated:** Trigger `on_weekly_checkin_completed` updates streaks automatically

**Streak Logic:**
- Week completed → current_streak++
- Gap of >14 days → current_streak resets to 1
- longest_streak = MAX(longest_streak, current_streak)

**Indexes:**
- `idx_user_streaks_user` on `user_id`

---

## Phase 2 Tables (Optional)

### 11. frameworks
**Purpose:** Content library (73 Konstantin Method playbooks)

| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Unique framework ID |
| name | TEXT | "Trust Formula", "Deep Work", etc. |
| slug | TEXT (UNIQUE) | URL-friendly: "trust-formula" |
| description | TEXT | Brief explanation |
| sub_dimension | TEXT | Maps to which dimension |
| territory | TEXT | "Leading Yourself", etc. |
| file_url | TEXT | Supabase Storage URL for PDF |
| video_url | TEXT | Optional 3-min video link |
| estimated_time_minutes | INTEGER | How long to complete |
| created_at | TIMESTAMP | Upload time |
| updated_at | TIMESTAMP | Last update |

---

### 12. framework_prescriptions
**Purpose:** Recommended frameworks based on low scores

| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Prescription ID |
| user_id | UUID (FK) | References auth.users.id |
| framework_id | UUID (FK) | References frameworks.id |
| sub_dimension | TEXT | Which area is weak |
| reason | TEXT | "Your Trust score is 12/30" |
| prescribed_at | TIMESTAMP | When recommended |
| viewed_at | TIMESTAMP | When user opened it |
| completed_at | TIMESTAMP | When user finished it |
| is_active | BOOLEAN | Still relevant? |

---

### 13. framework_engagement
**Purpose:** Track content usage

| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Engagement ID |
| user_id | UUID (FK) | References auth.users.id |
| framework_id | UUID (FK) | References frameworks.id |
| action | TEXT | 'viewed', 'downloaded', 'completed' |
| created_at | TIMESTAMP | Action time |

**Unique Constraint:** `(user_id, framework_id, action)`

---

### 14. ai_reports
**Purpose:** Monthly/Quarterly/Annual AI-generated insights

| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Report ID |
| user_id | UUID (FK) | References auth.users.id |
| report_type | TEXT | 'monthly', 'quarterly', 'annual' |
| period_year | INTEGER | 2026 |
| period_month | INTEGER | 1-12 (for monthly) |
| period_quarter | INTEGER | 1-4 (for quarterly) |
| content | JSONB | Full report data |
| patterns_observed | TEXT[] | Array of insights |
| key_insights | TEXT[] | Top takeaways |
| recommended_frameworks | TEXT[] | Suggested content |
| generated_at | TIMESTAMP | When AI created it |
| viewed_at | TIMESTAMP | When user opened it |

---

### 15. quarterly_reassessments
**Purpose:** Deep-dive retake of 3 focus areas after 12 weeks

| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Reassessment ID |
| user_id | UUID (FK) | References auth.users.id |
| year | INTEGER | 2026 |
| quarter | INTEGER | 1, 2, 3, 4 |
| sub_dimension | TEXT | Which dimension was reassessed |
| baseline_score | INTEGER | Score at start of quarter |
| reassessment_score | INTEGER | Score after 12 weeks |
| improvement | INTEGER | GENERATED: (reassessment - baseline) |
| completed_at | TIMESTAMP | Reassessment time |

**Unique Constraint:** `(user_id, year, quarter, sub_dimension)`

---

### 16. shareable_snapshots
**Purpose:** Public/shareable progress summaries ("Spotify Wrapped" style)

| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Snapshot ID |
| user_id | UUID (FK) | References auth.users.id |
| snapshot_type | TEXT | 'monthly', 'quarterly', 'annual' |
| title | TEXT | e.g., "My 2026 CEO Growth" |
| description | TEXT | User-written caption |
| data | JSONB | Anonymized scores/charts |
| share_url | TEXT (UNIQUE) | Public URL slug |
| is_public | BOOLEAN | Publicly viewable? |
| view_count | INTEGER | How many views |
| created_at | TIMESTAMP | Snapshot creation |

---

## Database Functions

### handle_new_user()
**Trigger:** AFTER INSERT on `auth.users`
**Purpose:** Auto-create `user_profiles` record on signup

### handle_updated_at()
**Trigger:** BEFORE UPDATE on `user_profiles`, `quarterly_focus`
**Purpose:** Auto-update `updated_at` timestamp

### update_user_streak()
**Trigger:** AFTER INSERT OR UPDATE on `weekly_check_ins`
**Purpose:** Auto-calculate and update streaks when check-in is completed

### generate_framework_prescriptions(user_id)
**Type:** Function (callable)
**Purpose:** Find sub-dimensions with <40% scores and recommend frameworks

### get_weekly_trends(user_id, year, quarter)
**Type:** Function (callable)
**Purpose:** Calculate weekly trends for AI report generation

---

## Views

### current_quarter_progress
**Purpose:** Quick view of user's current quarter status

Returns:
- user_id
- year, quarter
- sub_dimension_1, sub_dimension_2, sub_dimension_3
- weeks_completed (count of completed check-ins)
- current_streak
- longest_streak

---

## Security (Row Level Security)

All tables have RLS enabled with policies:
- Users can only view/edit their own data
- Hook assessments allow anonymous (pre-signup)
- Frameworks are public read-only
- Shareable snapshots can be public if `is_public = true`

**Service role key** bypasses RLS (use for admin operations only).

---

## Sample Queries

### Get user's dashboard data
```sql
-- Territory scores
SELECT territory, SUM(current_score) as score, SUM(max_possible_score) as max
FROM sub_dimension_scores
WHERE user_id = 'user-id'
GROUP BY territory;

-- Sub-dimension heatmap
SELECT sub_dimension, percentage
FROM sub_dimension_scores
WHERE user_id = 'user-id'
ORDER BY territory, sub_dimension;
```

### Get weekly progress for current quarter
```sql
SELECT
  wc.week_number,
  wr.sub_dimension,
  AVG(wr.answer_value) as avg_score
FROM weekly_check_ins wc
JOIN weekly_responses wr ON wr.check_in_id = wc.id
WHERE wc.user_id = 'user-id'
  AND wc.year = 2026
  AND wc.quarter = 1
  AND wc.completed = true
GROUP BY wc.week_number, wr.sub_dimension
ORDER BY wc.week_number;
```

### Check user's current streak
```sql
SELECT current_streak, longest_streak, total_weeks_completed
FROM user_streaks
WHERE user_id = 'user-id';
```

---

## Migration Order

1. **001_initial_schema.sql** - Core tables (hook, baseline, scores)
2. **002_weekly_checkins.sql** - Weekly tracking + streaks
3. **003_phase2_features.sql** - Frameworks, reports, sharing (optional for MVP)

Run in order. Do not skip migrations.
