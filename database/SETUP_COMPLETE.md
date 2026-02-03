# CEO Lab - Supabase Setup Checklist

## Database Setup ✅

- [x] Created Supabase project: `ceo-lab-production`
- [x] Ran migration 001_initial_schema.sql
- [x] Ran migration 002_weekly_checkins.sql
- [x] (Optional) Ran migration 003_phase2_features.sql
- [x] Copied Project URL: `https://xatnfohmmarlrmpjgt.supabase.co`
- [ ] Copied anon public key to `.env.local`
- [ ] Copied service_role key to `.env.local`
- [ ] Verified .env.local file has all 3 values filled in
- [ ] Confirmed .env.local is in .gitignore (already done ✅)

## Verify Your Setup

After pasting your keys into `.env.local`, check that the file looks like this:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xatnfohmmarlrmpjgt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6...
```

**Important:**
- Keys should start with `eyJ...`
- Keys are VERY long (hundreds of characters)
- No quotes needed around the values
- No spaces after the `=` sign

## Database Tables Created (10 total)

1. ✅ user_profiles
2. ✅ hook_assessments
3. ✅ hook_responses
4. ✅ baseline_assessments
5. ✅ baseline_responses
6. ✅ sub_dimension_scores
7. ✅ quarterly_focus
8. ✅ weekly_check_ins
9. ✅ weekly_responses
10. ✅ user_streaks

## What's Next?

After your `.env.local` is complete:

1. **Install Supabase client:**
   ```bash
   cd /Users/acai/Documents/AI\ Agent/nk/projects/09_ceo_lab
   npm install @supabase/supabase-js
   ```

2. **Set up Next.js project** (if not already done)

3. **Build hook assessment** (12 free questions)

4. **Build dashboard** (score visualization)

5. **Test authentication** (signup/login flow)

---

## Troubleshooting

### .env.local file not found
```bash
# Create it manually:
touch /Users/acai/Documents/AI\ Agent/nk/projects/09_ceo_lab/.env.local
```

### Keys don't work / "Invalid API key" error
- Make sure you copied the FULL key (they're very long)
- No extra spaces or line breaks
- Try clicking "Reveal" then "Copy" again in Supabase

### Can't find service_role key
- It's below the `anon public` key on the same page
- Might need to scroll down
- Has a ⚠️ warning about bypassing RLS

---

**Status:** Database setup complete! 🎉
**Next:** Configure Next.js and connect to Supabase.
