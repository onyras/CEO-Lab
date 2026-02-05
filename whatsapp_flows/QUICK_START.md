# Quick Start - Get Running in 30 Minutes

## What We Built

A system that sends personalized 3-question weekly check-ins to each CEO Lab user via WhatsApp based on their unique focus areas.

## Files Created

```
whatsapp_flows/
├── README.md              # Full documentation
├── SETUP.md              # Detailed setup guide
├── QUICK_START.md        # This file
├── package.json          # Dependencies
├── config.js             # Configuration
├── .env.example          # Environment template
├── flow-generator.js     # Generates personalized flows
├── send-weekly.js        # Cron job to send weekly
├── webhook-handler.js    # Receives user responses
└── database-schema.sql   # Database tables
```

## 30-Minute Setup

### Step 1: Install (2 min)

```bash
cd whatsapp_flows
npm install
cp .env.example .env
```

### Step 2: Configure .env (3 min)

Edit `.env`:
```env
WHATSAPP_ACCESS_TOKEN=<your_token_from_earlier>
WHATSAPP_PHONE_NUMBER_ID=1006501509209512
WHATSAPP_BUSINESS_ACCOUNT_ID=949849144886496
SUPABASE_URL=<your_ceo_lab_supabase_url>
SUPABASE_KEY=<your_supabase_key>
```

### Step 3: Database Setup (5 min)

```bash
# Connect to Supabase
psql <your_supabase_connection_string>

# Run migration
\i database-schema.sql

# Verify
\dt
```

### Step 4: Test Flow Generation (2 min)

```bash
node flow-generator.js test
```

Should output Flow JSON. ✅

### Step 5: Start Webhook (2 min)

```bash
npm run dev
```

Webhook running on `http://localhost:3000/webhook` ✅

### Step 6: Expose Webhook (3 min)

```bash
# New terminal
ngrok http 3000
```

Copy HTTPS URL (e.g., `https://abc123.ngrok.io`) ✅

### Step 7: Configure Meta Webhook (5 min)

1. Go to [Meta App Dashboard](https://developers.facebook.com/apps/)
2. Your App → WhatsApp → Configuration
3. **Callback URL:** `https://abc123.ngrok.io/webhook`
4. **Verify Token:** `ceo_lab_verify_token_2026`
5. Click "Verify and Save"
6. Subscribe to `messages` field

### Step 8: Create Test User (3 min)

```sql
-- In Supabase SQL Editor
INSERT INTO user_weekly_questions (
  user_id,
  quarter,
  quarter_start_date,
  category_1, category_2, category_3,
  question_1,
  question_2,
  question_3,
  active
) VALUES (
  (SELECT id FROM users WHERE email = 'your-email@example.com'),
  'Q1',
  '2026-02-03',
  'Energy Management', 'Trust Formula', 'Strategic Clarity',
  'This week, how many hours of Deep Work did you complete?',
  'How many commitments did you keep vs. break this week?',
  'Did you review your strategy this week?',
  true
);
```

### Step 9: Add Your WhatsApp as Test Number (2 min)

Meta Dashboard → WhatsApp → API Setup:
- Add your phone number: `+1234567890` (your number with country code)

### Step 10: Send Test Flow (3 min)

```bash
# In .env, add:
TEST_MODE=true
TEST_USERS=<your-user-id-from-step-8>

# Send
node send-weekly.js
```

Check your WhatsApp! 📱

### Done! ✅

You should receive a WhatsApp message with your personalized 3 questions.

## What Happens Next?

1. **User completes flow** → Answers submitted
2. **Webhook receives** → Parses responses
3. **Database saves** → Stores answers
4. **Confirmation sent** → User gets "✅ Week X complete!"
5. **Dashboard updates** → Progress visible

## Deploy to Production

**Fastest: Vercel (5 minutes)**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel deploy --prod

# Add environment variables
vercel env add WHATSAPP_ACCESS_TOKEN
# ... add all others

# Update Meta webhook URL to Vercel URL
```

**Set up weekly cron:**
- Vercel Dashboard → Your Project → Settings → Cron Jobs
- Add: `0 9 * * 1` → Runs every Monday 9am
- Command: `/api/send-weekly`

## Verify It's Working

### Check sends:
```sql
SELECT * FROM weekly_send_log
ORDER BY sent_at DESC
LIMIT 10;
```

### Check responses:
```sql
SELECT * FROM weekly_responses
ORDER BY submitted_at DESC
LIMIT 10;
```

### Check errors:
```sql
SELECT * FROM webhook_errors
ORDER BY timestamp DESC
LIMIT 10;
```

## Costs

- **WhatsApp:** $0/month (free tier covers 100-500 users)
- **Vercel:** $0/month (free tier)
- **Total:** **$0/month**

## Next Actions

1. ✅ Test with 5 beta users first
2. Monitor completion rates daily (Week 1)
3. Review data quality (answers parsing correctly?)
4. Roll out to all CEO Lab users
5. Add analytics dashboard for completion trends

## Need Help?

- **Webhook not receiving?** Check SETUP.md troubleshooting section
- **Flows not sending?** Verify WhatsApp token is valid
- **Responses not saving?** Check database connection
- **Questions?** Review README.md for full documentation

---

**You're ready to go!** 🚀

Test with yourself first, then 5 beta users, then roll out to everyone.
