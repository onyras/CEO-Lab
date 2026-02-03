# CEO Lab - Database

Complete Supabase database schema for CEO Lab platform.

## Quick Start

1. **Create Supabase project:** Go to [supabase.com](https://supabase.com) → New Project → `ceo-lab-production`
2. **Run migrations:** SQL Editor → Copy/paste from `migrations/` folder in order
3. **Get API keys:** Settings → API → Copy project URL and anon key
4. **Connect to Next.js:** Add keys to `.env.local`

**Full setup instructions:** See [SETUP.md](SETUP.md)

---

## Files in This Directory

### 📄 SETUP.md
Step-by-step guide to setting up Supabase project and running migrations. Start here if this is your first time.

### 📄 SCHEMA.md
Complete database schema documentation with:
- Entity Relationship Diagram (ERD)
- Table definitions and column descriptions
- Indexes and constraints
- RLS policies
- Functions and triggers
- Sample queries

### 📂 migrations/

#### 001_initial_schema.sql ✅ **Required for MVP**
Core tables for assessments and scoring:
- `user_profiles` - User account data
- `hook_assessments` + `hook_responses` - Free 12-question entry
- `baseline_assessments` + `baseline_responses` - Paid 100-question assessment
- `sub_dimension_scores` - Dashboard heatmap data
- RLS policies and triggers

#### 002_weekly_checkins.sql ✅ **Required for MVP**
Weekly tracking and streaks:
- `quarterly_focus` - User's 3 chosen dimensions per quarter
- `weekly_check_ins` - Weekly session records
- `weekly_responses` - Individual answers
- `user_streaks` - Streak tracking with auto-calculation

#### 003_phase2_features.sql ⏳ **Optional - Phase 2**
Framework prescriptions and AI reports:
- `frameworks` - Content library
- `framework_prescriptions` - Auto-recommendations
- `framework_engagement` - Usage tracking
- `ai_reports` - Monthly/quarterly/annual AI insights
- `quarterly_reassessments` - Deep-dive retakes
- `shareable_snapshots` - Social sharing

---

## Migration Checklist

For production deployment:

- [ ] Create Supabase project (`ceo-lab-production`)
- [ ] Run `001_initial_schema.sql`
- [ ] Run `002_weekly_checkins.sql`
- [ ] Verify tables created (10 tables minimum)
- [ ] Check RLS policies enabled
- [ ] Test auth signup (should auto-create user_profile)
- [ ] Copy API keys to `.env.local`
- [ ] (Optional) Create staging project (`ceo-lab-staging`)
- [ ] (Optional) Run same migrations on staging

**Phase 2:**
- [ ] Run `003_phase2_features.sql`
- [ ] Upload framework PDFs to Supabase Storage
- [ ] Insert framework metadata into `frameworks` table

---

## Database Stats

**Total Tables (MVP):** 10
- user_profiles
- hook_assessments
- hook_responses
- baseline_assessments
- baseline_responses
- sub_dimension_scores
- quarterly_focus
- weekly_check_ins
- weekly_responses
- user_streaks

**Total Tables (Phase 2):** +6 (16 total)
- frameworks
- framework_prescriptions
- framework_engagement
- ai_reports
- quarterly_reassessments
- shareable_snapshots

**Functions:** 4
- `handle_new_user()` - Auto-create profile
- `handle_updated_at()` - Auto-update timestamps
- `update_user_streak()` - Calculate streaks
- `generate_framework_prescriptions()` - Recommend content
- `get_weekly_trends()` - Calculate trends for reports

**Views:** 1
- `current_quarter_progress` - Quick dashboard query

---

## Environment Setup

After running migrations, add these to your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci... # SECRET - backend only
```

Get these from: Supabase Dashboard → Settings → API

---

## Testing the Database

### Verify setup
```sql
-- Should return 10 tables for MVP
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

### Test RLS
```sql
-- Should show RLS enabled on all tables
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';
```

### Test trigger (auto-create user_profile)
Create a test user via Supabase Auth, then:
```sql
SELECT * FROM user_profiles;
-- Should show auto-created profile with user's ID
```

### Test streak calculation
```sql
-- Insert a completed check-in
INSERT INTO weekly_check_ins (user_id, week_start_date, year, quarter, week_number, completed, completed_at)
VALUES ('user-id', '2026-01-06', 2026, 1, 1, true, NOW());

-- Check if streak updated
SELECT * FROM user_streaks WHERE user_id = 'user-id';
-- Should show current_streak = 1, total_weeks_completed = 1
```

---

## Support

**Issues with migrations?** See [SETUP.md](SETUP.md) → Troubleshooting section

**Questions about schema?** See [SCHEMA.md](SCHEMA.md) for full documentation

**Need sample queries?** See [SCHEMA.md](SCHEMA.md) → Sample Queries section

---

## Next Steps After Database Setup

1. ✅ Database configured
2. 🔄 Set up Next.js project
3. 🔄 Install Supabase client library
4. 🔄 Configure authentication
5. 🔄 Build hook assessment form
6. 🔄 Build dashboard

See `/project_documents/PRODUCT_STRATEGY.md` for full roadmap.
