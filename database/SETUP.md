# CEO Lab - Supabase Database Setup Guide

## Quick Start

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in:
   - **Name:** `ceo-lab-production`
   - **Database Password:** (generate strong password and save it)
   - **Region:** Choose closest to your users (EU for Europe, US East for US)
   - **Pricing Plan:** Free tier is fine for MVP
4. Click "Create new project"
5. Wait ~2 minutes for initialization

### 2. Run Database Migrations

Once your project is ready:

#### Step 1: Run Initial Schema
1. Go to **SQL Editor** in left sidebar
2. Click **"New query"**
3. Copy entire contents of `migrations/001_initial_schema.sql`
4. Paste into SQL Editor
5. Click **"Run"** (or press Cmd/Ctrl + Enter)
6. Verify: You should see "Success. No rows returned"

**What this creates:**
- `user_profiles` - User account data and subscription status
- `hook_assessments` + `hook_responses` - Free 12-question assessment
- `baseline_assessments` + `baseline_responses` - Paid 100-question assessment
- `sub_dimension_scores` - Calculated scores for dashboard heatmap
- Row Level Security (RLS) policies for data protection
- Auto-create user profile on signup

#### Step 2: Run Weekly Check-Ins Schema
1. Create another **"New query"**
2. Copy entire contents of `migrations/002_weekly_checkins.sql`
3. Paste and **"Run"**
4. Verify: Success message

**What this creates:**
- `quarterly_focus` - User's 3 chosen sub-dimensions per quarter
- `weekly_check_ins` - Weekly tracking sessions
- `weekly_responses` - Individual answers to weekly questions
- `user_streaks` - Streak tracking for motivation
- Automatic streak calculation on check-in completion

### 3. Verify Setup

#### Check Tables Created
1. Go to **Table Editor** in left sidebar
2. You should see these tables:
   - `user_profiles`
   - `hook_assessments`
   - `hook_responses`
   - `baseline_assessments`
   - `baseline_responses`
   - `sub_dimension_scores`
   - `quarterly_focus`
   - `weekly_check_ins`
   - `weekly_responses`
   - `user_streaks`

#### Test RLS Policies
1. Go to **Authentication** → **Policies**
2. Verify each table has policies enabled
3. Green checkmark = RLS is active ✅

### 4. Get Your API Keys

1. Go to **Settings** → **API**
2. Copy these values (you'll need them for your Next.js app):
   - **Project URL:** `https://xxxxx.supabase.co`
   - **anon public key:** `eyJhbG...` (safe for frontend)
   - **service_role key:** `eyJhbG...` (SECRET - backend only)

### 5. Enable Email Auth (Optional but Recommended)

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider
3. Configure email templates:
   - Go to **Authentication** → **Email Templates**
   - Customize "Confirm signup" and "Magic Link" templates with CEO Lab branding

### 6. Set Up Storage for Frameworks (Optional - Phase 2)

1. Go to **Storage**
2. Create new bucket: `frameworks`
3. Set to **Public** (or configure RLS for paid users only)
4. Upload framework PDFs here

---

## Database Schema Overview

### User Journey Tables

```
SIGNUP
└─> user_profiles (created automatically)

FREE ASSESSMENT
└─> hook_assessments
    └─> hook_responses (12 answers)

PAID SUBSCRIPTION
└─> user_profiles.subscription_status = 'active'

BASELINE ASSESSMENT (Staged)
├─> baseline_assessments (Stage 1: 30%, Stage 2: 60%, Stage 3: 100%)
├─> baseline_responses (100 individual answers)
└─> sub_dimension_scores (calculated scores for 18 dimensions)

QUARTERLY FOCUS
└─> quarterly_focus (user chooses 3 sub-dimensions to track)

WEEKLY CHECK-INS
├─> weekly_check_ins (session record)
├─> weekly_responses (3 answers per week)
└─> user_streaks (auto-updated on completion)
```

### Key Relationships

- `user_profiles.id` → `auth.users.id` (1:1)
- `hook_assessments.user_id` → `auth.users.id` (1:many, allows anonymous)
- `baseline_assessments.user_id` → `auth.users.id` (1:many, requires auth)
- `quarterly_focus` → unique per user/year/quarter
- `weekly_check_ins` → unique per user/week_start_date

---

## Sample Queries for Testing

### Check if user profile was auto-created
```sql
SELECT * FROM user_profiles;
```

### View hook assessment completion rate
```sql
SELECT
  COUNT(*) FILTER (WHERE completed_at IS NOT NULL) as completed,
  COUNT(*) as total
FROM hook_assessments
WHERE created_at > NOW() - INTERVAL '7 days';
```

### View user's baseline progress
```sql
SELECT
  user_id,
  stage,
  score_yourself,
  score_teams,
  score_organizations,
  total_score,
  completed_at
FROM baseline_assessments
WHERE user_id = 'your-user-id'
ORDER BY stage ASC;
```

### View user's current quarter focus
```sql
SELECT * FROM current_quarter_progress
WHERE user_id = 'your-user-id';
```

### View weekly completion streak
```sql
SELECT
  current_streak,
  longest_streak,
  total_weeks_completed,
  last_completion_date
FROM user_streaks
WHERE user_id = 'your-user-id';
```

---

## Environment Variables for Next.js

After setup, add these to your `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...

# Stripe (add later)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## Troubleshooting

### Migration fails with "relation already exists"
- Tables might already be created
- Drop tables manually: Go to Table Editor → Select table → Delete
- Or: Skip that specific CREATE TABLE statement

### RLS denies access even when logged in
- Check: Are you using `auth.uid()` correctly?
- Verify: User is actually authenticated (check `auth.users` table)
- Test: Temporarily disable RLS on one table to debug

### Function or Trigger errors
- Check: Does `public.handle_updated_at()` function exist?
- Created in: `001_initial_schema.sql`
- If missing: Run that migration again

### Can't insert user_profile
- Check: Is trigger `on_auth_user_created` active?
- Verify: Go to Database → Triggers → Should see trigger on `auth.users`

---

## Next Steps After Database Setup

1. ✅ Database schema created
2. 🔄 Configure authentication (email/password)
3. 🔄 Set up Stripe webhook for subscriptions
4. 🔄 Create Next.js app and connect to Supabase
5. 🔄 Build hook assessment (12 questions)
6. 🔄 Build dashboard to display scores

See `PRODUCT_STRATEGY.md` for full roadmap.

---

## Production vs Staging

**Recommendation:** Create TWO Supabase projects

### Staging Project
- Name: `ceo-lab-staging`
- For testing and development
- Break things safely
- Test migrations before production

### Production Project
- Name: `ceo-lab-production`
- For real users
- Only deploy tested features
- Careful with migrations (they can't be undone)

Run the same migrations on both projects to keep schemas in sync.
