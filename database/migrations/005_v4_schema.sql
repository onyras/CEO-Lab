-- ============================================================================
-- Migration 005: V4 Schema for CEO Lab Assessment Platform
-- ============================================================================
-- Scoring Engine v4.0, Section 14
--
-- This migration creates all V4 tables. V3 tables remain completely untouched.
-- V4 introduces: multi-stage assessment sessions, SJI-composite scoring,
-- territory mapping, archetype matching, mirror/360 feedback, blind-spot
-- indexing, weekly pulse tracking, and a hook (lead-gen) flow.
--
-- Runs on Supabase (PostgreSQL). Requires pgcrypto / gen_random_uuid().
-- ============================================================================

-- --------------------------------------------------------------------------
-- 1. assessment_sessions  (replaces baseline_assessments for V4)
-- --------------------------------------------------------------------------
CREATE TABLE assessment_sessions (
    id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    ceo_id            UUID        REFERENCES auth.users(id),
    version           TEXT        DEFAULT '4.0',
    form              CHAR(1)     DEFAULT 'A',
    started_at        TIMESTAMPTZ DEFAULT now(),
    completed_at      TIMESTAMPTZ,
    stage_reached     INT         DEFAULT 1,
    im_total          INT,
    im_flagged        BOOLEAN     DEFAULT FALSE,
    clmi              NUMERIC(5,2),
    bsi               NUMERIC(5,2),
    total_time_seconds INT,
    created_at        TIMESTAMPTZ DEFAULT now()
);

-- --------------------------------------------------------------------------
-- 2. item_responses  (V4 item responses)
-- --------------------------------------------------------------------------
CREATE TABLE item_responses (
    id              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id      UUID          REFERENCES assessment_sessions(id) ON DELETE CASCADE,
    item_id         TEXT          NOT NULL,
    item_type       TEXT          NOT NULL,
    raw_response    NUMERIC(5,3)  NOT NULL,
    scored_value    NUMERIC(5,3),
    dimension       TEXT,
    stage           INT,
    response_time_ms INT,
    responded_at    TIMESTAMPTZ   DEFAULT now(),
    form            CHAR(1)       DEFAULT 'A',
    UNIQUE(session_id, item_id)
);

-- --------------------------------------------------------------------------
-- 3. dimension_scores  (V4 dimension scores)
-- --------------------------------------------------------------------------
CREATE TABLE dimension_scores (
    id              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id      UUID          REFERENCES assessment_sessions(id) ON DELETE CASCADE,
    dimension       TEXT          NOT NULL,
    behavioral_mean NUMERIC(5,3),
    sji_scaled      NUMERIC(5,3),
    composite       NUMERIC(5,3),
    percentage      NUMERIC(5,2),
    verbal_label    TEXT,
    confidence      TEXT          DEFAULT 'full',
    UNIQUE(session_id, dimension)
);

-- --------------------------------------------------------------------------
-- 4. territory_scores
-- --------------------------------------------------------------------------
CREATE TABLE territory_scores (
    id            UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id    UUID          REFERENCES assessment_sessions(id) ON DELETE CASCADE,
    territory     TEXT          NOT NULL,
    score         NUMERIC(5,2),
    verbal_label  TEXT,
    UNIQUE(session_id, territory)
);

-- --------------------------------------------------------------------------
-- 5. archetype_matches
-- --------------------------------------------------------------------------
CREATE TABLE archetype_matches (
    id                  UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id          UUID          REFERENCES assessment_sessions(id) ON DELETE CASCADE,
    archetype_name      TEXT          NOT NULL,
    match_type          TEXT          NOT NULL,
    signature_strength  NUMERIC(5,2),
    sji_confirmed       BOOLEAN,
    mirror_amplified    TEXT,
    display_rank        INT
);

-- --------------------------------------------------------------------------
-- 6. mirror_sessions
-- --------------------------------------------------------------------------
CREATE TABLE mirror_sessions (
    id                  UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id          UUID          REFERENCES assessment_sessions(id) ON DELETE CASCADE,
    rater_email         TEXT,
    rater_relationship  TEXT,
    completed_at        TIMESTAMPTZ
);

-- --------------------------------------------------------------------------
-- 7. mirror_responses
-- --------------------------------------------------------------------------
CREATE TABLE mirror_responses (
    id                UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    mirror_session_id UUID          REFERENCES mirror_sessions(id) ON DELETE CASCADE,
    dimension         TEXT          NOT NULL,
    raw_response      NUMERIC(5,3),
    percentage        NUMERIC(5,2)
);

-- --------------------------------------------------------------------------
-- 8. mirror_gaps
-- --------------------------------------------------------------------------
CREATE TABLE mirror_gaps (
    id          UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id  UUID          REFERENCES assessment_sessions(id) ON DELETE CASCADE,
    dimension   TEXT          NOT NULL,
    ceo_pct     NUMERIC(5,2),
    rater_pct   NUMERIC(5,2),
    gap_pct     NUMERIC(5,2),
    gap_label   TEXT,
    severity    TEXT,
    UNIQUE(session_id, dimension)
);

-- --------------------------------------------------------------------------
-- 9. blind_spot_index
-- --------------------------------------------------------------------------
CREATE TABLE blind_spot_index (
    id                UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id        UUID          REFERENCES assessment_sessions(id) ON DELETE CASCADE,
    bsi               NUMERIC(5,2),
    directional_bsi   NUMERIC(5,2)
);

-- --------------------------------------------------------------------------
-- 10. weekly_pulse  (replaces weekly_responses for V4)
-- --------------------------------------------------------------------------
CREATE TABLE weekly_pulse (
    id            UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    ceo_id        UUID          REFERENCES auth.users(id),
    dimension     TEXT          NOT NULL,
    score         NUMERIC(5,3),
    quarter       TEXT,
    responded_at  TIMESTAMPTZ   DEFAULT now()
);

-- --------------------------------------------------------------------------
-- 11. hook_sessions  (replaces hook_assessments)
-- --------------------------------------------------------------------------
CREATE TABLE hook_sessions (
    id                  UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    ceo_id              UUID          REFERENCES auth.users(id),
    completed_at        TIMESTAMPTZ   DEFAULT now(),
    ly_score            NUMERIC(5,2),
    lt_score            NUMERIC(5,2),
    lo_score            NUMERIC(5,2),
    sharpest_dimension  TEXT,
    converted           BOOLEAN       DEFAULT FALSE
);

-- --------------------------------------------------------------------------
-- 12. response_time_flags
-- --------------------------------------------------------------------------
CREATE TABLE response_time_flags (
    id          UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id  UUID    REFERENCES assessment_sessions(id) ON DELETE CASCADE,
    flag_type   TEXT    NOT NULL,
    item_id     TEXT,
    value_ms    INT,
    stage       INT
);


-- ============================================================================
-- INDEXES
-- ============================================================================
CREATE INDEX idx_assessment_sessions_ceo_id    ON assessment_sessions(ceo_id);
CREATE INDEX idx_item_responses_session_id     ON item_responses(session_id);
CREATE INDEX idx_dimension_scores_session_id   ON dimension_scores(session_id);
CREATE INDEX idx_weekly_pulse_ceo_dimension    ON weekly_pulse(ceo_id, dimension);
CREATE INDEX idx_hook_sessions_ceo_id          ON hook_sessions(ceo_id);


-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

-- Enable RLS on every V4 table
ALTER TABLE assessment_sessions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_responses       ENABLE ROW LEVEL SECURITY;
ALTER TABLE dimension_scores     ENABLE ROW LEVEL SECURITY;
ALTER TABLE territory_scores     ENABLE ROW LEVEL SECURITY;
ALTER TABLE archetype_matches    ENABLE ROW LEVEL SECURITY;
ALTER TABLE mirror_sessions      ENABLE ROW LEVEL SECURITY;
ALTER TABLE mirror_responses     ENABLE ROW LEVEL SECURITY;
ALTER TABLE mirror_gaps          ENABLE ROW LEVEL SECURITY;
ALTER TABLE blind_spot_index     ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_pulse         ENABLE ROW LEVEL SECURITY;
ALTER TABLE hook_sessions        ENABLE ROW LEVEL SECURITY;
ALTER TABLE response_time_flags  ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------------------------------------
-- Tables with direct ceo_id: own-row access
-- --------------------------------------------------------------------------

-- assessment_sessions
CREATE POLICY "assessment_sessions_select_own" ON assessment_sessions
    FOR SELECT USING (ceo_id = auth.uid());
CREATE POLICY "assessment_sessions_insert_own" ON assessment_sessions
    FOR INSERT WITH CHECK (ceo_id = auth.uid());
CREATE POLICY "assessment_sessions_update_own" ON assessment_sessions
    FOR UPDATE USING (ceo_id = auth.uid());

-- weekly_pulse
CREATE POLICY "weekly_pulse_select_own" ON weekly_pulse
    FOR SELECT USING (ceo_id = auth.uid());
CREATE POLICY "weekly_pulse_insert_own" ON weekly_pulse
    FOR INSERT WITH CHECK (ceo_id = auth.uid());
CREATE POLICY "weekly_pulse_update_own" ON weekly_pulse
    FOR UPDATE USING (ceo_id = auth.uid());

-- hook_sessions: INSERT open to anonymous (lead-gen hook), SELECT for own data
CREATE POLICY "hook_sessions_insert_anon" ON hook_sessions
    FOR INSERT WITH CHECK (true);
CREATE POLICY "hook_sessions_select_own" ON hook_sessions
    FOR SELECT USING (ceo_id = auth.uid());
CREATE POLICY "hook_sessions_update_own" ON hook_sessions
    FOR UPDATE USING (ceo_id = auth.uid());

-- --------------------------------------------------------------------------
-- Tables linked via session_id -> assessment_sessions
-- --------------------------------------------------------------------------

-- item_responses
CREATE POLICY "item_responses_select_own" ON item_responses
    FOR SELECT USING (
        session_id IN (SELECT id FROM assessment_sessions WHERE ceo_id = auth.uid())
    );
CREATE POLICY "item_responses_insert_own" ON item_responses
    FOR INSERT WITH CHECK (
        session_id IN (SELECT id FROM assessment_sessions WHERE ceo_id = auth.uid())
    );
CREATE POLICY "item_responses_update_own" ON item_responses
    FOR UPDATE USING (
        session_id IN (SELECT id FROM assessment_sessions WHERE ceo_id = auth.uid())
    );

-- dimension_scores
CREATE POLICY "dimension_scores_select_own" ON dimension_scores
    FOR SELECT USING (
        session_id IN (SELECT id FROM assessment_sessions WHERE ceo_id = auth.uid())
    );
CREATE POLICY "dimension_scores_insert_own" ON dimension_scores
    FOR INSERT WITH CHECK (
        session_id IN (SELECT id FROM assessment_sessions WHERE ceo_id = auth.uid())
    );
CREATE POLICY "dimension_scores_update_own" ON dimension_scores
    FOR UPDATE USING (
        session_id IN (SELECT id FROM assessment_sessions WHERE ceo_id = auth.uid())
    );

-- territory_scores
CREATE POLICY "territory_scores_select_own" ON territory_scores
    FOR SELECT USING (
        session_id IN (SELECT id FROM assessment_sessions WHERE ceo_id = auth.uid())
    );
CREATE POLICY "territory_scores_insert_own" ON territory_scores
    FOR INSERT WITH CHECK (
        session_id IN (SELECT id FROM assessment_sessions WHERE ceo_id = auth.uid())
    );
CREATE POLICY "territory_scores_update_own" ON territory_scores
    FOR UPDATE USING (
        session_id IN (SELECT id FROM assessment_sessions WHERE ceo_id = auth.uid())
    );

-- archetype_matches
CREATE POLICY "archetype_matches_select_own" ON archetype_matches
    FOR SELECT USING (
        session_id IN (SELECT id FROM assessment_sessions WHERE ceo_id = auth.uid())
    );
CREATE POLICY "archetype_matches_insert_own" ON archetype_matches
    FOR INSERT WITH CHECK (
        session_id IN (SELECT id FROM assessment_sessions WHERE ceo_id = auth.uid())
    );
CREATE POLICY "archetype_matches_update_own" ON archetype_matches
    FOR UPDATE USING (
        session_id IN (SELECT id FROM assessment_sessions WHERE ceo_id = auth.uid())
    );

-- mirror_sessions
CREATE POLICY "mirror_sessions_select_own" ON mirror_sessions
    FOR SELECT USING (
        session_id IN (SELECT id FROM assessment_sessions WHERE ceo_id = auth.uid())
    );
CREATE POLICY "mirror_sessions_insert_own" ON mirror_sessions
    FOR INSERT WITH CHECK (
        session_id IN (SELECT id FROM assessment_sessions WHERE ceo_id = auth.uid())
    );
CREATE POLICY "mirror_sessions_update_own" ON mirror_sessions
    FOR UPDATE USING (
        session_id IN (SELECT id FROM assessment_sessions WHERE ceo_id = auth.uid())
    );

-- mirror_gaps
CREATE POLICY "mirror_gaps_select_own" ON mirror_gaps
    FOR SELECT USING (
        session_id IN (SELECT id FROM assessment_sessions WHERE ceo_id = auth.uid())
    );
CREATE POLICY "mirror_gaps_insert_own" ON mirror_gaps
    FOR INSERT WITH CHECK (
        session_id IN (SELECT id FROM assessment_sessions WHERE ceo_id = auth.uid())
    );
CREATE POLICY "mirror_gaps_update_own" ON mirror_gaps
    FOR UPDATE USING (
        session_id IN (SELECT id FROM assessment_sessions WHERE ceo_id = auth.uid())
    );

-- blind_spot_index
CREATE POLICY "blind_spot_index_select_own" ON blind_spot_index
    FOR SELECT USING (
        session_id IN (SELECT id FROM assessment_sessions WHERE ceo_id = auth.uid())
    );
CREATE POLICY "blind_spot_index_insert_own" ON blind_spot_index
    FOR INSERT WITH CHECK (
        session_id IN (SELECT id FROM assessment_sessions WHERE ceo_id = auth.uid())
    );
CREATE POLICY "blind_spot_index_update_own" ON blind_spot_index
    FOR UPDATE USING (
        session_id IN (SELECT id FROM assessment_sessions WHERE ceo_id = auth.uid())
    );

-- response_time_flags
CREATE POLICY "response_time_flags_select_own" ON response_time_flags
    FOR SELECT USING (
        session_id IN (SELECT id FROM assessment_sessions WHERE ceo_id = auth.uid())
    );
CREATE POLICY "response_time_flags_insert_own" ON response_time_flags
    FOR INSERT WITH CHECK (
        session_id IN (SELECT id FROM assessment_sessions WHERE ceo_id = auth.uid())
    );
CREATE POLICY "response_time_flags_update_own" ON response_time_flags
    FOR UPDATE USING (
        session_id IN (SELECT id FROM assessment_sessions WHERE ceo_id = auth.uid())
    );

-- --------------------------------------------------------------------------
-- mirror_responses: linked via mirror_session_id -> mirror_sessions -> assessment_sessions
-- --------------------------------------------------------------------------
CREATE POLICY "mirror_responses_select_own" ON mirror_responses
    FOR SELECT USING (
        mirror_session_id IN (
            SELECT ms.id FROM mirror_sessions ms
            JOIN assessment_sessions a ON a.id = ms.session_id
            WHERE a.ceo_id = auth.uid()
        )
    );
CREATE POLICY "mirror_responses_insert_own" ON mirror_responses
    FOR INSERT WITH CHECK (
        mirror_session_id IN (
            SELECT ms.id FROM mirror_sessions ms
            JOIN assessment_sessions a ON a.id = ms.session_id
            WHERE a.ceo_id = auth.uid()
        )
    );
CREATE POLICY "mirror_responses_update_own" ON mirror_responses
    FOR UPDATE USING (
        mirror_session_id IN (
            SELECT ms.id FROM mirror_sessions ms
            JOIN assessment_sessions a ON a.id = ms.session_id
            WHERE a.ceo_id = auth.uid()
        )
    );
