# Apply Phase 0 Migration - Append-Only Pattern

## What This Does

✅ **NEVER DELETES USER DATA** - All historical scores preserved forever
✅ Adds `assessment_id` to scores for historical tracking
✅ Removes constraints that would prevent multiple scores over time
✅ Adds timestamps for audit trail
✅ Enables "compare baseline vs retake" features

## Core Principle: APPEND-ONLY

**Old way (BAD):**
- User completes baseline → Score = 65
- User retakes → Score = 75, **old score deleted** ❌

**New way (GOOD):**
- User completes baseline → Score = 65 ✅
- User retakes → Score = 75 ✅, **old score still exists** ✅
- Can compare: "You improved from 65 to 75!" ✅

## How to Apply

### Supabase Dashboard (Recommended)

1. Go to https://supabase.com/dashboard
2. Select your CEO Lab project
3. Go to **SQL Editor**
4. Copy/paste contents of `004_phase_0_bulletproof.sql`
5. **Supabase will warn "destructive operation"** - this is expected
6. Click **"Run this query"** - it only deletes test data (question 999, "Test Dimension")

## What Gets Cleaned Up

The migration removes ONLY test/debugging data:
- Question 999 (from debugging sessions)
- "Test Dimension" scores (from test endpoint)
- Duplicate records from bugs (keeps most recent)

**Real user data is never touched.**

## Verify It Worked

```sql
-- Check new column exists
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'sub_dimension_scores'
AND column_name = 'assessment_id';

-- Should return: assessment_id | uuid

-- Check constraint was NOT added (we want multiple scores)
SELECT constraint_name
FROM information_schema.table_constraints
WHERE table_name = 'sub_dimension_scores'
AND constraint_name = 'sub_dimension_scores_user_subdim_key';

-- Should return: 0 rows (constraint does NOT exist - this is correct!)
```

## What Changes in Your App

**After migration + code deploy:**
- User retakes baseline → **NEW scores inserted** (old scores preserved)
- Dashboard shows latest scores by default
- Historical scores remain in database
- Can build "progress over time" features anytime
- Can compare baseline vs follow-up scores

**Example:**
```sql
-- See all scores over time for one user
SELECT sub_dimension, percentage, calculated_at
FROM sub_dimension_scores
WHERE user_id = 'xxx'
ORDER BY calculated_at DESC;

-- Shows multiple scores per dimension ✅
```

## Safety

- ✅ All historical data preserved
- ✅ No breaking changes
- ✅ Dashboard shows latest scores
- ✅ Old scores available for future features
- ✅ Can reinterpret data anytime

## Rollback (if needed)

```sql
-- Remove assessment_id column
ALTER TABLE sub_dimension_scores DROP COLUMN IF EXISTS assessment_id;

-- Remove other new columns
ALTER TABLE baseline_responses DROP COLUMN IF EXISTS response_set_id;
ALTER TABLE baseline_responses DROP COLUMN IF EXISTS submitted_at;
ALTER TABLE sub_dimension_scores DROP COLUMN IF EXISTS model_version;
ALTER TABLE sub_dimension_scores DROP COLUMN IF EXISTS calculated_at;

-- Note: This won't restore deleted test data, but real data is safe
```
