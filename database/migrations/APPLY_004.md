# Apply Phase 0 Migration

## What This Does

✅ Stops all data deletion (uses upsert instead)
✅ Adds unique constraints for data safety
✅ Adds future-ready columns (nullable, no breaking changes)
✅ Adds timestamps for audit tracking

## How to Apply

### Option 1: Supabase Dashboard (Recommended)

1. Go to https://supabase.com/dashboard
2. Select your CEO Lab project
3. Go to **SQL Editor**
4. Copy/paste contents of `004_phase_0_bulletproof.sql`
5. Click **Run**

### Option 2: Supabase CLI

```bash
# If you have Supabase CLI installed
supabase db push
```

### Option 3: Direct SQL

```bash
# Connect to your database and run:
psql YOUR_DATABASE_URL < database/migrations/004_phase_0_bulletproof.sql
```

## Verify It Worked

After running the migration, check:

```sql
-- Should show the new columns
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'baseline_responses'
AND column_name IN ('response_set_id', 'submitted_at');

-- Should show 2 rows
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'sub_dimension_scores'
AND column_name IN ('model_version', 'calculated_at');
```

## Safety

- **No data is deleted** - all existing records remain unchanged
- **All new columns are nullable** - existing data stays valid
- **Backwards compatible** - old code still works

## What Changes in Your App

After migration + code deploy:
- Baseline saves will use upsert (no more deletes)
- New responses get `submitted_at` timestamp
- New scores get `model_version` and `calculated_at`
- Everything else works exactly the same

## Rollback (if needed)

```sql
-- Remove new columns (only if needed)
ALTER TABLE baseline_responses DROP COLUMN IF EXISTS response_set_id;
ALTER TABLE baseline_responses DROP COLUMN IF EXISTS submitted_at;
ALTER TABLE sub_dimension_scores DROP COLUMN IF EXISTS model_version;
ALTER TABLE sub_dimension_scores DROP COLUMN IF EXISTS calculated_at;

-- Remove constraints
ALTER TABLE baseline_responses DROP CONSTRAINT IF EXISTS baseline_responses_user_assessment_question_key;
ALTER TABLE sub_dimension_scores DROP CONSTRAINT IF EXISTS sub_dimension_scores_user_subdim_key;
```
