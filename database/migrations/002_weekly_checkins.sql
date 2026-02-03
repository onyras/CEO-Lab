-- CEO Lab Database Schema - Weekly Check-Ins & Tracking
-- Run this AFTER 001_initial_schema.sql

-- ============================================================================
-- QUARTERLY FOCUS (User's chosen 3 sub-dimensions per quarter)
-- ============================================================================

CREATE TABLE quarterly_focus (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  year INTEGER NOT NULL,
  quarter INTEGER NOT NULL CHECK (quarter BETWEEN 1 AND 4),
  sub_dimension_1 TEXT NOT NULL,
  sub_dimension_2 TEXT NOT NULL,
  sub_dimension_3 TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, year, quarter)
);

-- ============================================================================
-- WEEKLY CHECK-INS (3 questions answered weekly)
-- ============================================================================

CREATE TABLE weekly_check_ins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  week_start_date DATE NOT NULL,
  year INTEGER NOT NULL,
  quarter INTEGER NOT NULL CHECK (quarter BETWEEN 1 AND 4),
  week_number INTEGER NOT NULL CHECK (week_number BETWEEN 1 AND 12),
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, week_start_date)
);

-- ============================================================================
-- WEEKLY RESPONSES (Individual answers to the 3 weekly questions)
-- ============================================================================

CREATE TABLE weekly_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  check_in_id UUID REFERENCES weekly_check_ins ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  sub_dimension TEXT NOT NULL,
  question_text TEXT NOT NULL,
  answer_value INTEGER,
  answer_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- STREAK TRACKING (Weekly completion streaks for motivation)
-- ============================================================================

CREATE TABLE user_streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE UNIQUE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  total_weeks_completed INTEGER DEFAULT 0,
  last_completion_date DATE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE quarterly_focus ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_check_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_streaks ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES - Quarterly Focus
-- ============================================================================

CREATE POLICY "Users can view own quarterly focus"
  ON quarterly_focus FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quarterly focus"
  ON quarterly_focus FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own quarterly focus"
  ON quarterly_focus FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================================================
-- RLS POLICIES - Weekly Check-Ins
-- ============================================================================

CREATE POLICY "Users can view own check-ins"
  ON weekly_check_ins FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own check-ins"
  ON weekly_check_ins FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own check-ins"
  ON weekly_check_ins FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================================================
-- RLS POLICIES - Weekly Responses
-- ============================================================================

CREATE POLICY "Users can view own responses"
  ON weekly_responses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own responses"
  ON weekly_responses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- RLS POLICIES - User Streaks
-- ============================================================================

CREATE POLICY "Users can view own streaks"
  ON user_streaks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own streaks"
  ON user_streaks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own streaks"
  ON user_streaks FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Auto-update updated_at timestamp for quarterly_focus
CREATE TRIGGER set_quarterly_focus_updated_at
  BEFORE UPDATE ON quarterly_focus
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Function to update streak when weekly check-in is completed
CREATE OR REPLACE FUNCTION public.update_user_streak()
RETURNS TRIGGER AS $$
DECLARE
  last_date DATE;
  current_streak_count INTEGER;
  longest_streak_count INTEGER;
BEGIN
  -- Only proceed if check-in is being marked as completed
  IF NEW.completed = TRUE AND (OLD.completed IS NULL OR OLD.completed = FALSE) THEN

    -- Get current streak data
    SELECT
      last_completion_date,
      current_streak,
      longest_streak
    INTO
      last_date,
      current_streak_count,
      longest_streak_count
    FROM user_streaks
    WHERE user_id = NEW.user_id;

    -- If no streak record exists, create one
    IF NOT FOUND THEN
      INSERT INTO user_streaks (
        user_id,
        current_streak,
        longest_streak,
        total_weeks_completed,
        last_completion_date
      )
      VALUES (
        NEW.user_id,
        1,
        1,
        1,
        NEW.week_start_date
      );
    ELSE
      -- Check if this continues the streak (within 7-14 days of last completion)
      IF last_date IS NOT NULL AND
         NEW.week_start_date >= last_date + INTERVAL '7 days' AND
         NEW.week_start_date <= last_date + INTERVAL '14 days' THEN
        -- Continue streak
        current_streak_count := current_streak_count + 1;
        longest_streak_count := GREATEST(longest_streak_count, current_streak_count);
      ELSIF last_date IS NOT NULL AND NEW.week_start_date > last_date + INTERVAL '14 days' THEN
        -- Streak broken, restart
        current_streak_count := 1;
      ELSIF last_date IS NULL THEN
        -- First completion
        current_streak_count := 1;
        longest_streak_count := 1;
      END IF;

      -- Update streak record
      UPDATE user_streaks
      SET
        current_streak = current_streak_count,
        longest_streak = longest_streak_count,
        total_weeks_completed = total_weeks_completed + 1,
        last_completion_date = NEW.week_start_date,
        updated_at = NOW()
      WHERE user_id = NEW.user_id;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update streak on weekly check-in completion
CREATE TRIGGER on_weekly_checkin_completed
  AFTER INSERT OR UPDATE ON weekly_check_ins
  FOR EACH ROW EXECUTE FUNCTION public.update_user_streak();

-- ============================================================================
-- INDEXES for Performance
-- ============================================================================

CREATE INDEX idx_quarterly_focus_user_period ON quarterly_focus(user_id, year, quarter);
CREATE INDEX idx_weekly_check_ins_user ON weekly_check_ins(user_id);
CREATE INDEX idx_weekly_check_ins_user_date ON weekly_check_ins(user_id, week_start_date);
CREATE INDEX idx_weekly_check_ins_completion ON weekly_check_ins(user_id, completed);
CREATE INDEX idx_weekly_responses_checkin ON weekly_responses(check_in_id);
CREATE INDEX idx_weekly_responses_user ON weekly_responses(user_id);
CREATE INDEX idx_user_streaks_user ON user_streaks(user_id);

-- ============================================================================
-- HELPER VIEWS (Optional - for easier queries)
-- ============================================================================

-- View to show current quarter's focus areas with check-in status
CREATE OR REPLACE VIEW current_quarter_progress AS
SELECT
  qf.user_id,
  qf.year,
  qf.quarter,
  qf.sub_dimension_1,
  qf.sub_dimension_2,
  qf.sub_dimension_3,
  COUNT(DISTINCT wc.id) FILTER (WHERE wc.completed = TRUE) as weeks_completed,
  us.current_streak,
  us.longest_streak
FROM quarterly_focus qf
LEFT JOIN weekly_check_ins wc ON
  wc.user_id = qf.user_id AND
  wc.year = qf.year AND
  wc.quarter = qf.quarter
LEFT JOIN user_streaks us ON us.user_id = qf.user_id
WHERE qf.year = EXTRACT(YEAR FROM CURRENT_DATE)
  AND qf.quarter = EXTRACT(QUARTER FROM CURRENT_DATE)
GROUP BY
  qf.user_id,
  qf.year,
  qf.quarter,
  qf.sub_dimension_1,
  qf.sub_dimension_2,
  qf.sub_dimension_3,
  us.current_streak,
  us.longest_streak;
