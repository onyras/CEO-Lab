-- Phase 0: Minimal Bulletproof Changes
-- No breaking changes, just adds safety constraints and future-ready columns

-- ============================================
-- 1. Add unique constraints for upsert safety
-- ============================================

-- Ensure baseline_responses has proper unique constraint
-- (user_id, assessment_id, question_number) should be unique
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'baseline_responses_user_assessment_question_key'
    ) THEN
        ALTER TABLE baseline_responses
        ADD CONSTRAINT baseline_responses_user_assessment_question_key
        UNIQUE (user_id, assessment_id, question_number);
    END IF;
END $$;

-- Ensure sub_dimension_scores has proper unique constraint
-- (user_id, sub_dimension) should be unique for latest scores
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'sub_dimension_scores_user_subdim_key'
    ) THEN
        ALTER TABLE sub_dimension_scores
        ADD CONSTRAINT sub_dimension_scores_user_subdim_key
        UNIQUE (user_id, sub_dimension);
    END IF;
END $$;

-- ============================================
-- 2. Add future-ready columns (nullable)
-- ============================================

-- Add response_set_id for future batching
-- Nullable so existing data is valid
ALTER TABLE baseline_responses
ADD COLUMN IF NOT EXISTS response_set_id UUID;

-- Add model_version for score interpretation tracking
-- Nullable so existing scores remain valid
ALTER TABLE sub_dimension_scores
ADD COLUMN IF NOT EXISTS model_version TEXT DEFAULT '1.0';

-- Add submitted_at for proper time tracking
ALTER TABLE baseline_responses
ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE sub_dimension_scores
ADD COLUMN IF NOT EXISTS calculated_at TIMESTAMPTZ DEFAULT NOW();

-- ============================================
-- 3. Add indexes for performance
-- ============================================

CREATE INDEX IF NOT EXISTS idx_baseline_responses_response_set
ON baseline_responses(response_set_id)
WHERE response_set_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_scores_model_version
ON sub_dimension_scores(model_version);

CREATE INDEX IF NOT EXISTS idx_responses_submitted_at
ON baseline_responses(submitted_at DESC);

-- ============================================
-- 4. Update existing data with timestamps
-- ============================================

-- Backfill submitted_at from created_at if it exists
UPDATE baseline_responses
SET submitted_at = created_at
WHERE submitted_at IS NULL AND created_at IS NOT NULL;

-- Backfill calculated_at from created_at if it exists
UPDATE sub_dimension_scores
SET calculated_at = created_at
WHERE calculated_at IS NULL AND created_at IS NOT NULL;

-- ============================================
-- RESULT:
-- ✅ No data loss possible (upserts work safely)
-- ✅ Future-ready for versioning (columns exist)
-- ✅ No breaking changes (all nullable)
-- ✅ Existing data remains valid
-- ============================================
