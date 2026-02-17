-- ============================================================================
-- Migration 007: UX Overhaul
-- ============================================================================
-- Adds reveal_seen flag to user_profiles and index for weekly_pulse queries.
-- ============================================================================

-- Add reveal_seen column to user_profiles
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS reveal_seen BOOLEAN DEFAULT FALSE;

-- Add index for weekly_pulse streak queries
CREATE INDEX IF NOT EXISTS idx_weekly_pulse_ceo_responded ON weekly_pulse(ceo_id, responded_at);
