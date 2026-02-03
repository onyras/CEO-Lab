-- CEO Lab Database Schema - Initial Migration
-- Run this in Supabase SQL Editor after creating project

-- ============================================================================
-- USER PROFILES
-- ============================================================================

CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT,
  baseline_stage INTEGER DEFAULT 0,
  baseline_completed BOOLEAN DEFAULT FALSE,
  hook_completed BOOLEAN DEFAULT FALSE,
  subscription_status TEXT DEFAULT 'inactive',
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- HOOK ASSESSMENT (Free 12-question entry point)
-- ============================================================================

CREATE TABLE hook_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  score_yourself INTEGER,
  score_teams INTEGER,
  score_organizations INTEGER,
  total_score INTEGER,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE hook_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID REFERENCES hook_assessments ON DELETE CASCADE,
  question_number INTEGER,
  answer_value INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- BASELINE ASSESSMENT (100-question staged assessment)
-- ============================================================================

CREATE TABLE baseline_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  stage INTEGER,
  score_yourself INTEGER,
  score_teams INTEGER,
  score_organizations INTEGER,
  total_score INTEGER,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE baseline_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  assessment_id UUID REFERENCES baseline_assessments ON DELETE CASCADE,
  question_number INTEGER,
  sub_dimension TEXT,
  territory TEXT,
  answer_value INTEGER,
  stage INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- SUB-DIMENSION SCORES (Dashboard heatmap data)
-- ============================================================================

CREATE TABLE sub_dimension_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  sub_dimension TEXT,
  territory TEXT,
  current_score INTEGER,
  max_possible_score INTEGER,
  percentage DECIMAL,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, sub_dimension)
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE hook_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE hook_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE baseline_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE baseline_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE sub_dimension_scores ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES - User Profiles
-- ============================================================================

CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================================================
-- RLS POLICIES - Hook Assessments (Allow anonymous for free assessment)
-- ============================================================================

CREATE POLICY "Anyone can create hook assessment"
  ON hook_assessments FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view own hook assessments"
  ON hook_assessments FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Anyone can create hook responses"
  ON hook_responses FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view hook responses"
  ON hook_responses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM hook_assessments
      WHERE hook_assessments.id = hook_responses.assessment_id
      AND (hook_assessments.user_id = auth.uid() OR hook_assessments.user_id IS NULL)
    )
  );

-- ============================================================================
-- RLS POLICIES - Baseline Assessments
-- ============================================================================

CREATE POLICY "Users can view own assessments"
  ON baseline_assessments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own assessments"
  ON baseline_assessments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- RLS POLICIES - Baseline Responses
-- ============================================================================

CREATE POLICY "Users can view own responses"
  ON baseline_responses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own responses"
  ON baseline_responses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- RLS POLICIES - Sub-Dimension Scores
-- ============================================================================

CREATE POLICY "Users can view own scores"
  ON sub_dimension_scores FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own scores"
  ON sub_dimension_scores FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own scores"
  ON sub_dimension_scores FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Auto-create user_profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- INDEXES for Performance
-- ============================================================================

CREATE INDEX idx_user_profiles_subscription ON user_profiles(subscription_status);
CREATE INDEX idx_hook_assessments_user ON hook_assessments(user_id);
CREATE INDEX idx_baseline_assessments_user ON baseline_assessments(user_id);
CREATE INDEX idx_baseline_responses_user ON baseline_responses(user_id);
CREATE INDEX idx_baseline_responses_subdim ON baseline_responses(sub_dimension);
CREATE INDEX idx_sub_dimension_scores_user ON sub_dimension_scores(user_id);
