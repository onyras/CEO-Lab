-- CEO Lab WhatsApp Flows - Clean Install
-- This drops and recreates everything

-- ============================================
-- STEP 1: DROP EXISTING OBJECTS (cleanup)
-- ============================================

-- Drop views first (they depend on tables)
DROP VIEW IF EXISTS user_completion_stats CASCADE;
DROP VIEW IF EXISTS weekly_send_performance CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS increment_streak(UUID) CASCADE;
DROP FUNCTION IF EXISTS get_completion_rate(UUID, TEXT) CASCADE;

-- Drop tables (in reverse dependency order)
DROP TABLE IF EXISTS webhook_errors CASCADE;
DROP TABLE IF EXISTS weekly_send_summary CASCADE;
DROP TABLE IF EXISTS weekly_send_log CASCADE;
DROP TABLE IF EXISTS weekly_responses CASCADE;
DROP TABLE IF EXISTS user_weekly_questions CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================
-- STEP 2: CREATE TABLES
-- ============================================

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  whatsapp_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User weekly questions
CREATE TABLE user_weekly_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  quarter TEXT NOT NULL CHECK (quarter IN ('Q1', 'Q2', 'Q3', 'Q4')),
  quarter_start_date DATE NOT NULL,
  category_1 TEXT NOT NULL,
  category_2 TEXT NOT NULL,
  category_3 TEXT NOT NULL,
  question_1 TEXT NOT NULL,
  question_2 TEXT NOT NULL,
  question_3 TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  streak_weeks INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, quarter)
);

-- Weekly responses
CREATE TABLE weekly_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  week_number INTEGER NOT NULL CHECK (week_number >= 1 AND week_number <= 13),
  quarter TEXT NOT NULL CHECK (quarter IN ('Q1', 'Q2', 'Q3', 'Q4')),
  answer_1 TEXT NOT NULL,
  answer_2 TEXT NOT NULL,
  answer_3 TEXT NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  whatsapp_message_id TEXT,
  UNIQUE(user_id, week_number, quarter)
);

-- Weekly send log
CREATE TABLE weekly_send_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  week_number INTEGER NOT NULL,
  quarter TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'failed', 'skipped')),
  error_message TEXT
);

-- Weekly send summary
CREATE TABLE weekly_send_summary (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  total_users INTEGER NOT NULL,
  successful INTEGER NOT NULL,
  failed INTEGER NOT NULL,
  failed_details JSONB
);

-- Webhook errors
CREATE TABLE webhook_errors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL,
  message_id TEXT,
  from_number TEXT,
  error TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  raw_payload JSONB
);

-- ============================================
-- STEP 3: CREATE INDEXES
-- ============================================

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_whatsapp ON users(whatsapp_number);
CREATE INDEX idx_user_weekly_questions_user_id ON user_weekly_questions(user_id);
CREATE INDEX idx_user_weekly_questions_active ON user_weekly_questions(active) WHERE active = true;
CREATE INDEX idx_weekly_responses_user_id ON weekly_responses(user_id);
CREATE INDEX idx_weekly_responses_week ON weekly_responses(week_number);
CREATE INDEX idx_weekly_responses_submitted ON weekly_responses(submitted_at);
CREATE INDEX idx_weekly_send_log_user_id ON weekly_send_log(user_id);
CREATE INDEX idx_weekly_send_log_sent_at ON weekly_send_log(sent_at);
CREATE INDEX idx_webhook_errors_timestamp ON webhook_errors(timestamp);

-- ============================================
-- STEP 4: ENABLE RLS & CREATE POLICIES
-- ============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_weekly_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_send_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_send_summary ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_errors ENABLE ROW LEVEL SECURITY;

-- User policies
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Weekly questions policies
CREATE POLICY "Users can view own weekly questions" ON user_weekly_questions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service role full access user_weekly_questions" ON user_weekly_questions FOR ALL USING (auth.role() = 'service_role');

-- Weekly responses policies
CREATE POLICY "Users can view own responses" ON weekly_responses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service role full access weekly_responses" ON weekly_responses FOR ALL USING (auth.role() = 'service_role');

-- Send log policies
CREATE POLICY "Service role full access weekly_send_log" ON weekly_send_log FOR ALL USING (auth.role() = 'service_role');

-- Send summary policies
CREATE POLICY "Service role full access weekly_send_summary" ON weekly_send_summary FOR ALL USING (auth.role() = 'service_role');

-- Webhook errors policies
CREATE POLICY "Service role full access webhook_errors" ON webhook_errors FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- STEP 5: INSERT TEST DATA
-- ============================================

INSERT INTO users (id, email, name, whatsapp_number) VALUES
  ('00000000-0000-0000-0000-000000000001', 'test@ceolab.com', 'Test User', '+1234567890');

INSERT INTO user_weekly_questions (user_id, quarter, quarter_start_date, category_1, category_2, category_3, question_1, question_2, question_3, active) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Q1', '2026-02-03', 'Energy Management', 'Trust Formula', 'Strategic Clarity',
   'This week, how many hours of Deep Work did you complete?',
   'How many commitments did you keep vs. break this week?',
   'Did you review your strategy this week?',
   true);

-- ============================================
-- SUCCESS!
-- ============================================

SELECT 'Database setup complete!' as status;
SELECT COUNT(*) as users FROM users;
SELECT COUNT(*) as questions FROM user_weekly_questions;
SELECT COUNT(*) as responses FROM weekly_responses;
