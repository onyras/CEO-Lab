-- CEO Lab Database Schema - Phase 2 Features
-- Run this when implementing framework prescriptions and AI reports
-- OPTIONAL for MVP - can deploy Phase 1 without this

-- ============================================================================
-- FRAMEWORKS (Content library mapped to sub-dimensions)
-- ============================================================================

CREATE TABLE frameworks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  sub_dimension TEXT NOT NULL,
  territory TEXT NOT NULL,
  file_url TEXT, -- Supabase Storage URL for PDF
  video_url TEXT, -- Optional 3-min video summary
  estimated_time_minutes INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- FRAMEWORK PRESCRIPTIONS (Recommended based on low scores)
-- ============================================================================

CREATE TABLE framework_prescriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  framework_id UUID REFERENCES frameworks ON DELETE CASCADE,
  sub_dimension TEXT NOT NULL,
  reason TEXT, -- e.g., "Your Trust Formula score is 12/30"
  prescribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  viewed_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE
);

-- ============================================================================
-- USER FRAMEWORK ENGAGEMENT (Track what content users interact with)
-- ============================================================================

CREATE TABLE framework_engagement (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  framework_id UUID REFERENCES frameworks ON DELETE CASCADE,
  action TEXT NOT NULL, -- 'viewed', 'downloaded', 'completed'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, framework_id, action)
);

-- ============================================================================
-- AI REPORTS (Monthly/Quarterly/Annual generated insights)
-- ============================================================================

CREATE TABLE ai_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  report_type TEXT NOT NULL, -- 'monthly', 'quarterly', 'annual'
  period_year INTEGER NOT NULL,
  period_month INTEGER, -- For monthly reports
  period_quarter INTEGER, -- For quarterly reports
  content JSONB NOT NULL, -- Full AI-generated report content
  patterns_observed TEXT[],
  key_insights TEXT[],
  recommended_frameworks TEXT[],
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  viewed_at TIMESTAMP WITH TIME ZONE
);

-- ============================================================================
-- QUARTERLY REASSESSMENTS (Deep-dive on 3 focus areas)
-- ============================================================================

CREATE TABLE quarterly_reassessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  year INTEGER NOT NULL,
  quarter INTEGER NOT NULL CHECK (quarter BETWEEN 1 AND 4),
  sub_dimension TEXT NOT NULL,
  baseline_score INTEGER, -- Score at start of quarter
  reassessment_score INTEGER, -- Score after 12 weeks
  improvement INTEGER GENERATED ALWAYS AS (reassessment_score - baseline_score) STORED,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, year, quarter, sub_dimension)
);

-- ============================================================================
-- SHAREABLE SNAPSHOTS (Optional social sharing)
-- ============================================================================

CREATE TABLE shareable_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  snapshot_type TEXT NOT NULL, -- 'monthly', 'quarterly', 'annual'
  title TEXT,
  description TEXT,
  data JSONB NOT NULL, -- Anonymized score data
  share_url TEXT UNIQUE,
  is_public BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE frameworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE framework_prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE framework_engagement ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE quarterly_reassessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE shareable_snapshots ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES - Frameworks (Public read, admin write)
-- ============================================================================

CREATE POLICY "Anyone can view frameworks"
  ON frameworks FOR SELECT
  USING (true);

-- Admin insert/update would be handled via service role key

-- ============================================================================
-- RLS POLICIES - Framework Prescriptions
-- ============================================================================

CREATE POLICY "Users can view own prescriptions"
  ON framework_prescriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own prescriptions"
  ON framework_prescriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own prescriptions"
  ON framework_prescriptions FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================================================
-- RLS POLICIES - Framework Engagement
-- ============================================================================

CREATE POLICY "Users can view own engagement"
  ON framework_engagement FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own engagement"
  ON framework_engagement FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- RLS POLICIES - AI Reports
-- ============================================================================

CREATE POLICY "Users can view own reports"
  ON ai_reports FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reports"
  ON ai_reports FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reports"
  ON ai_reports FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================================================
-- RLS POLICIES - Quarterly Reassessments
-- ============================================================================

CREATE POLICY "Users can view own reassessments"
  ON quarterly_reassessments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reassessments"
  ON quarterly_reassessments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- RLS POLICIES - Shareable Snapshots
-- ============================================================================

CREATE POLICY "Users can view own snapshots"
  ON shareable_snapshots FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view public snapshots"
  ON shareable_snapshots FOR SELECT
  USING (is_public = true);

CREATE POLICY "Users can insert own snapshots"
  ON shareable_snapshots FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own snapshots"
  ON shareable_snapshots FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================================================
-- FUNCTIONS - Prescription Logic
-- ============================================================================

-- Function to auto-generate framework prescriptions based on scores
CREATE OR REPLACE FUNCTION public.generate_framework_prescriptions(p_user_id UUID)
RETURNS TABLE(sub_dimension TEXT, framework_name TEXT, score INTEGER) AS $$
BEGIN
  -- Find sub-dimensions with scores below 40%
  -- Recommend frameworks for those areas
  RETURN QUERY
  SELECT
    sds.sub_dimension,
    f.name as framework_name,
    sds.current_score as score
  FROM sub_dimension_scores sds
  JOIN frameworks f ON f.sub_dimension = sds.sub_dimension
  WHERE sds.user_id = p_user_id
    AND sds.percentage < 40
    AND NOT EXISTS (
      -- Don't prescribe if already prescribed and active
      SELECT 1 FROM framework_prescriptions fp
      WHERE fp.user_id = p_user_id
        AND fp.framework_id = f.id
        AND fp.is_active = true
    )
  ORDER BY sds.percentage ASC
  LIMIT 5;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- FUNCTIONS - Report Generation Helpers
-- ============================================================================

-- Get weekly trends for a user's focus areas
CREATE OR REPLACE FUNCTION public.get_weekly_trends(
  p_user_id UUID,
  p_year INTEGER,
  p_quarter INTEGER
)
RETURNS TABLE(
  sub_dimension TEXT,
  week_number INTEGER,
  avg_score DECIMAL,
  trend TEXT
) AS $$
BEGIN
  RETURN QUERY
  WITH weekly_avgs AS (
    SELECT
      wr.sub_dimension,
      wc.week_number,
      AVG(wr.answer_value::DECIMAL) as avg_value
    FROM weekly_responses wr
    JOIN weekly_check_ins wc ON wc.id = wr.check_in_id
    WHERE wr.user_id = p_user_id
      AND wc.year = p_year
      AND wc.quarter = p_quarter
    GROUP BY wr.sub_dimension, wc.week_number
  ),
  trends AS (
    SELECT
      wa.sub_dimension,
      wa.week_number,
      wa.avg_value,
      CASE
        WHEN LAG(wa.avg_value) OVER (PARTITION BY wa.sub_dimension ORDER BY wa.week_number) IS NULL THEN 'stable'
        WHEN wa.avg_value > LAG(wa.avg_value) OVER (PARTITION BY wa.sub_dimension ORDER BY wa.week_number) THEN 'improving'
        WHEN wa.avg_value < LAG(wa.avg_value) OVER (PARTITION BY wa.sub_dimension ORDER BY wa.week_number) THEN 'declining'
        ELSE 'stable'
      END as trend_direction
    FROM weekly_avgs wa
  )
  SELECT
    t.sub_dimension,
    t.week_number,
    t.avg_value,
    t.trend_direction
  FROM trends t
  ORDER BY t.sub_dimension, t.week_number;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- INDEXES for Performance
-- ============================================================================

CREATE INDEX idx_frameworks_subdimension ON frameworks(sub_dimension);
CREATE INDEX idx_frameworks_slug ON frameworks(slug);
CREATE INDEX idx_prescriptions_user ON framework_prescriptions(user_id);
CREATE INDEX idx_prescriptions_active ON framework_prescriptions(user_id, is_active);
CREATE INDEX idx_engagement_user_framework ON framework_engagement(user_id, framework_id);
CREATE INDEX idx_ai_reports_user_type ON ai_reports(user_id, report_type);
CREATE INDEX idx_ai_reports_period ON ai_reports(period_year, period_month, period_quarter);
CREATE INDEX idx_reassessments_user_period ON quarterly_reassessments(user_id, year, quarter);
CREATE INDEX idx_snapshots_share_url ON shareable_snapshots(share_url);
CREATE INDEX idx_snapshots_public ON shareable_snapshots(is_public);

-- ============================================================================
-- SAMPLE DATA - Insert Framework Library (Example)
-- ============================================================================

-- Uncomment to insert sample frameworks (update file_url with real Supabase Storage URLs)

/*
INSERT INTO frameworks (name, slug, sub_dimension, territory, description, estimated_time_minutes) VALUES
  ('Trust Formula', 'trust-formula', 'Trust Formula', 'Leading Teams', 'Build credibility, reliability, and intimacy while reducing self-orientation', 20),
  ('Deep Work', 'deep-work', 'Energy Management', 'Leading Yourself', 'Protect focus time and eliminate shallow work', 30),
  ('Above the Line', 'above-the-line', 'Above the Line', 'Leading Yourself', 'Move from blame/victim/hero to curiosity and learning', 25),
  ('Psychological Safety', 'psychological-safety', 'Psychological Safety', 'Leading Teams', 'Create environment where teams speak up without fear', 20),
  ('Multipliers', 'multipliers', 'Multiplier Behavior', 'Leading Teams', 'Amplify intelligence and capability of your team', 30),
  ('Strategic Clarity', 'strategic-clarity', 'Strategic Clarity', 'Leading Organizations', 'Define and communicate clear strategy', 25);
*/
