-- Migration 008: Add created_at to mirror_sessions
-- The mirror_sessions table was created without a created_at column.
-- Adding it here so ordering and standard Supabase column expectations work.

ALTER TABLE mirror_sessions
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();
