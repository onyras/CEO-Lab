-- Add table to track weekly response progress (for interactive questions)
CREATE TABLE IF NOT EXISTS weekly_response_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  week_number INTEGER NOT NULL,
  quarter TEXT NOT NULL,
  current_question INTEGER DEFAULT 1,
  answer_1 TEXT,
  answer_2 TEXT,
  answer_3 TEXT,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, week_number, quarter)
);

CREATE INDEX IF NOT EXISTS idx_response_progress_user ON weekly_response_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_response_progress_current ON weekly_response_progress(current_question) WHERE completed_at IS NULL;
