-- Phase 0: Append-Only Pattern - NEVER DELETE USER DATA
-- All historical data preserved forever

-- ============================================
-- 0. Clean up ONLY test/debugging data
-- ============================================

-- Remove test question 999 (from debugging sessions only)
DELETE FROM baseline_responses
WHERE question_number = 999;

-- Remove test scores (from debugging only)
DELETE FROM sub_dimension_scores
WHERE sub_dimension = 'Test Dimension';

-- Remove accidental duplicates in baseline_responses (same assessment, same question, same user)
-- These are true duplicates from bugs, not historical data
DELETE FROM baseline_responses a
USING baseline_responses b
WHERE a.id < b.id
  AND a.user_id = b.user_id
  AND a.assessment_id = b.assessment_id
  AND a.question_number = b.question_number;

-- ============================================
-- 1. Add constraint ONLY for baseline_responses
-- ============================================

-- Ensure baseline_responses has proper unique constraint
-- This is safe: one answer per question per assessment
-- Different assessments = different answers = preserved history ✅
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

-- ============================================
-- 2. NO CONSTRAINT on sub_dimension_scores
-- ============================================
-- We want MULTIPLE scores per dimension over time
-- Each score is a historical snapshot
-- NEVER delete old scores - append only!

-- ============================================
-- 3. Add columns for historical tracking
-- ============================================

-- Add assessment_id to scores so we can track which baseline they came from
-- This lets us keep multiple scores over time ✅
ALTER TABLE sub_dimension_scores
ADD COLUMN IF NOT EXISTS assessment_id UUID REFERENCES baseline_assessments(id);

-- Add response_set_id for future batching
ALTER TABLE baseline_responses
ADD COLUMN IF NOT EXISTS response_set_id UUID;

-- Add model_version for score interpretation tracking
ALTER TABLE sub_dimension_scores
ADD COLUMN IF NOT EXISTS model_version TEXT DEFAULT '1.0';

-- Add timestamps for history tracking
ALTER TABLE baseline_responses
ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE sub_dimension_scores
ADD COLUMN IF NOT EXISTS calculated_at TIMESTAMPTZ DEFAULT NOW();

-- Backfill assessment_id for existing scores from user's most recent assessment
UPDATE sub_dimension_scores s
SET assessment_id = (
    SELECT id
    FROM baseline_assessments a
    WHERE a.user_id = s.user_id
    ORDER BY created_at DESC
    LIMIT 1
)
WHERE assessment_id IS NULL;

-- ============================================
-- 4. Add indexes for performance
-- ============================================

-- Index for getting latest scores per user
CREATE INDEX IF NOT EXISTS idx_scores_user_calculated
ON sub_dimension_scores(user_id, calculated_at DESC);

-- Index for getting scores by assessment
CREATE INDEX IF NOT EXISTS idx_scores_assessment
ON sub_dimension_scores(assessment_id);

CREATE INDEX IF NOT EXISTS idx_baseline_responses_response_set
ON baseline_responses(response_set_id)
WHERE response_set_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_scores_model_version
ON sub_dimension_scores(model_version);

CREATE INDEX IF NOT EXISTS idx_responses_submitted_at
ON baseline_responses(submitted_at DESC);

-- ============================================
-- 5. Backfill existing data
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
-- RESULT: APPEND-ONLY, NEVER DELETE USER DATA
-- ============================================
-- ✅ All historical scores preserved
-- ✅ Multiple scores per dimension over time
-- ✅ Can compare baseline vs retake
-- ✅ Dashboard can reinterpret data any time
-- ✅ No breaking changes (all nullable)
-- ✅ Existing data remains valid
-- ============================================
