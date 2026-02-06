# CEO Lab - Database Schema

**Last Updated:** 2026-02-06
**Source:** Extracted from MVP_BUILD_PLAN.md and implementation files

---

## Tables

### 1. `users` (Supabase Auth - built-in)
```sql
-- Managed by Supabase Auth
id: uuid (primary key)
email: string
created_at: timestamp
```

### 2. `user_profiles`
```sql
id: uuid (primary key, references auth.users)
full_name: string
created_at: timestamp
updated_at: timestamp
baseline_stage: integer (1, 2, or 3)
baseline_completed: boolean
hook_completed: boolean
subscription_status: string ('active', 'canceled', 'past_due')
stripe_customer_id: string
stripe_subscription_id: string
whatsapp_phone: text
whatsapp_opted_in: boolean default false
whatsapp_timezone: text default 'UTC'
```

### 3. `hook_assessments`
```sql
id: uuid (primary key)
user_id: uuid (references auth.users) -- nullable for anonymous
completed_at: timestamp
score_yourself: integer (0-16)
score_teams: integer (0-16)
score_organizations: integer (0-16)
total_score: integer (0-48)
created_at: timestamp
```

### 4. `hook_responses`
```sql
id: uuid (primary key)
assessment_id: uuid (references hook_assessments)
question_number: integer (1-12)
answer_value: integer (1-4 points)
created_at: timestamp
```

### 5. `baseline_assessments`
```sql
id: uuid (primary key)
user_id: uuid (references auth.users)
stage: integer (1, 2, or 3)
completed_at: timestamp
score_yourself: integer (0-60)
score_teams: integer (0-60)
score_organizations: integer (0-60)
total_score: integer (0-180)
created_at: timestamp
```

### 6. `baseline_responses`
```sql
id: uuid (primary key)
user_id: uuid (references auth.users)
assessment_id: uuid (references baseline_assessments)
question_number: integer (1-100)
sub_dimension: string
territory: string ('yourself', 'teams', 'organizations')
answer_value: integer (1-5 points)
stage: integer (1, 2, or 3)
created_at: timestamp
-- Unique constraint: (user_id, assessment_id, question_number) for UPSERT
```

### 7. `sub_dimension_scores`
```sql
id: uuid (primary key)
user_id: uuid (references auth.users)
sub_dimension: string
territory: string ('yourself', 'teams', 'organizations')
current_score: integer
max_possible_score: integer
percentage: decimal
last_updated: timestamp
created_at: timestamp
-- Unique constraint: (user_id, assessment_id, sub_dimension) for UPSERT
```

### 8. `whatsapp_conversations`
```sql
id: uuid primary key
user_id: uuid references auth.users
phone_number: text not null
conversation_state: text default 'IDLE'
current_question_index: integer default 0
week_number: integer
responses: jsonb default '{}'
expires_at: timestamp with time zone
created_at: timestamp with time zone default now()
updated_at: timestamp with time zone default now()
```

### 9. `accountability_agent_setup`
```sql
user_id: uuid
quarter: text (Q1, Q2, Q3, Q4)
focus_area_1, focus_area_2, focus_area_3: text (sub-dimension names)
question_1, question_2, question_3: text (user-written)
options_1, options_2, options_3: text[] (arrays)
created_at: timestamp
```

### 10. `accountability_agent_responses`
```sql
response_id: uuid
user_id: uuid
week_number: integer
quarter: text
question_1_answer: text[] (supports multi-select)
question_2_answer: text[]
question_3_answer: text[]
submitted_at: timestamp
```

---

## Row Level Security (RLS) Policies

```sql
-- user_profiles: Users can only read/update their own profile
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- baseline_assessments: Users can only access their own assessments
CREATE POLICY "Users can view own assessments"
  ON baseline_assessments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own assessments"
  ON baseline_assessments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- baseline_responses: Users can only access their own responses
CREATE POLICY "Users can view own responses"
  ON baseline_responses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own responses"
  ON baseline_responses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- sub_dimension_scores: Users can only read their own scores
CREATE POLICY "Users can view own scores"
  ON sub_dimension_scores FOR SELECT
  USING (auth.uid() = user_id);

-- Hook assessments: Anyone can create (anonymous), only owners can view
CREATE POLICY "Anyone can create hook assessment"
  ON hook_assessments FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view own hook assessments"
  ON hook_assessments FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);
```

---

## Data Patterns

### UPSERT for Redo/Resume
Baseline responses and scores use UPSERT with conflict resolution:
```sql
-- Responses: conflict on (user_id, assessment_id, question_number)
-- Scores: conflict on (user_id, assessment_id, sub_dimension)
```

### 90-Day Redo Window
- Within 90 days of `completed_at`: UPSERT same assessment_id (overwrites)
- After 90 days: Create new assessment_id (quarterly retake)

---

## Migrations Log

| Date | Migration | Description |
|------|-----------|-------------|
| 2026-02-01 | Initial | Core tables created |
| 2026-02-03 | WhatsApp | Added whatsapp fields to user_profiles, whatsapp_conversations table |
| 2026-02-04 | Coupon codes | Stripe promotion code support (no DB changes) |
| 2026-02-05 | Accountability | Added accountability_agent_setup and responses tables |
| 2026-02-05 | Baseline UPSERT | Added unique constraints for UPSERT support |
