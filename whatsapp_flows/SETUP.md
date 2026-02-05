# WhatsApp Flows Setup Guide

Complete setup instructions for deploying CEO Lab WhatsApp Dynamic Flows.

## Prerequisites

- [x] WhatsApp Business API access
- [x] WhatsApp credentials (Access Token, Phone Number ID, Business Account ID)
- [x] Supabase project with CEO Lab database
- [x] Node.js 18+ installed
- [ ] Hosting platform account (Vercel, Railway, or AWS)

## Step 1: Database Setup

### 1.1 Run Database Migration

```bash
# Connect to your Supabase database
psql postgresql://[your-supabase-connection-string]

# Run the schema file
\i database-schema.sql
```

### 1.2 Verify Tables Created

```sql
-- Check tables exist
\dt

-- Should show:
-- user_weekly_questions
-- weekly_responses
-- weekly_send_log
-- weekly_send_summary
-- webhook_errors
```

### 1.3 Add Test User Data

```sql
-- Insert test user questions (replace user_id with real user)
INSERT INTO user_weekly_questions (
  user_id,
  quarter,
  quarter_start_date,
  category_1,
  category_2,
  category_3,
  question_1,
  question_2,
  question_3,
  active
) VALUES (
  'your-test-user-id',
  'Q1',
  '2026-02-03',
  'Energy Management',
  'Trust Formula',
  'Strategic Clarity',
  'This week, how many hours of Deep Work did you complete?',
  'How many commitments did you keep vs. break this week?',
  'Did you review your strategy this week?',
  true
);
```

## Step 2: Local Setup

### 2.1 Install Dependencies

```bash
cd /Users/acai/Documents/AI\ Agent/nk/projects/09_ceo_lab/whatsapp_flows
npm install
```

### 2.2 Configure Environment

```bash
# Copy example env file
cp .env.example .env

# Edit .env with your credentials
nano .env
```

Fill in:
```env
WHATSAPP_ACCESS_TOKEN=EAANKKZBEOjasBQmYZAnCJBjYyVXg0gXCgUyHopEwJZCX1c6fELBNkZBcNG0Th5n3xuYSLYWkWKlYFEWPfEwh8NVHwig7eZBHOXjDnp8GcZCs1zHxYgzR4ZABpVnwinBFLORbq4GTijZBi2oZAwOZBo6zKPKgSIYnOTs0YUxVpZCeMqymxgnXhZBTZBMQ3ZBnTb64UUMui4fmYeUczF9dDokeZCTZCAwkQbqWZBDDNWcrlpYNJSfe3DZCDLFBGtvPK48RiSMUly2wnXVTSbKFhAQ5wWyZAbZAXZBNXQNApEgZDZD
WHATSAPP_PHONE_NUMBER_ID=1006501509209512
WHATSAPP_BUSINESS_ACCOUNT_ID=949849144886496
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
```

### 2.3 Test Flow Generation

```bash
# Generate test flow
node flow-generator.js test

# Should output Flow JSON
```

## Step 3: Webhook Setup

### 3.1 Start Webhook Locally

```bash
npm run dev
```

### 3.2 Expose with ngrok

```bash
# Install ngrok if needed
brew install ngrok

# Expose port 3000
ngrok http 3000

# Copy the HTTPS URL (e.g., https://abc123.ngrok.io)
```

### 3.3 Configure in Meta Dashboard

1. Go to Meta App Dashboard → WhatsApp → Configuration
2. **Callback URL:** `https://abc123.ngrok.io/webhook`
3. **Verify Token:** `ceo_lab_verify_token_2026` (from your .env)
4. Click "Verify and Save"
5. Subscribe to `messages` webhook field

### 3.4 Test Webhook

Send a test message via WhatsApp to your business number.
Check terminal for webhook activity.

## Step 4: Test End-to-End

### 4.1 Add Your Number as Test User

In Meta App Dashboard → WhatsApp → API Setup:
- Add your phone number to test recipients
- Format: `+1234567890` (with country code, no spaces)

### 4.2 Send Test Flow

```bash
# Set test mode
echo "TEST_MODE=true" >> .env
echo "TEST_USERS=your-test-user-id" >> .env

# Send test flow
node send-weekly.js
```

### 4.3 Complete Flow on WhatsApp

1. Open WhatsApp on your phone
2. Check for message from CEO Lab number
3. Tap to open Flow
4. Answer 3 questions
5. Submit

### 4.4 Verify Response Saved

```sql
-- Check database
SELECT * FROM weekly_responses
WHERE user_id = 'your-test-user-id'
ORDER BY submitted_at DESC
LIMIT 1;
```

## Step 5: Production Deployment

### Option A: Vercel (Recommended)

#### 5.1 Install Vercel CLI

```bash
npm i -g vercel
```

#### 5.2 Create vercel.json

```json
{
  "version": 2,
  "builds": [
    {
      "src": "webhook-handler.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/webhook",
      "dest": "webhook-handler.js"
    }
  ],
  "env": {
    "WHATSAPP_ACCESS_TOKEN": "@whatsapp-token",
    "WHATSAPP_PHONE_NUMBER_ID": "@whatsapp-phone-id",
    "WHATSAPP_BUSINESS_ACCOUNT_ID": "@whatsapp-account-id",
    "SUPABASE_URL": "@supabase-url",
    "SUPABASE_KEY": "@supabase-key",
    "WEBHOOK_VERIFY_TOKEN": "@webhook-verify-token"
  },
  "crons": [{
    "path": "/api/send-weekly",
    "schedule": "0 9 * * 1"
  }]
}
```

#### 5.3 Deploy

```bash
vercel deploy --prod
```

#### 5.4 Add Environment Variables

```bash
vercel env add WHATSAPP_ACCESS_TOKEN
vercel env add WHATSAPP_PHONE_NUMBER_ID
# ... add all others
```

#### 5.5 Update Webhook URL in Meta

Change callback URL to: `https://your-project.vercel.app/webhook`

### Option B: Railway

#### 5.1 Create railway.json

```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "node webhook-handler.js",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

#### 5.2 Deploy

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

#### 5.3 Add Cron Job

In Railway dashboard:
- Go to your service → Settings
- Add cron job: `0 9 * * 1 node send-weekly.js`

## Step 6: Monitor & Maintain

### 6.1 Check Logs

**Vercel:**
```bash
vercel logs --follow
```

**Railway:**
```bash
railway logs
```

### 6.2 Monitor Completion Rates

```sql
-- Check weekly completion rates
SELECT * FROM user_completion_stats
ORDER BY completion_rate_percent DESC;
```

### 6.3 Review Send Performance

```sql
-- Check send success rates
SELECT * FROM weekly_send_performance
ORDER BY send_date DESC
LIMIT 10;
```

### 6.4 Debug Failed Sends

```sql
-- Check webhook errors
SELECT * FROM webhook_errors
ORDER BY timestamp DESC
LIMIT 20;
```

## Troubleshooting

### Flows Not Sending

**Check 1:** Access token valid?
```bash
curl -X GET "https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}?access_token=${ACCESS_TOKEN}"
```

**Check 2:** User has WhatsApp number?
```sql
SELECT id, name, whatsapp_number
FROM users
WHERE whatsapp_number IS NOT NULL;
```

**Check 3:** Review send logs
```sql
SELECT * FROM weekly_send_log
WHERE status = 'failed'
ORDER BY sent_at DESC;
```

### Webhook Not Receiving

**Check 1:** Webhook URL publicly accessible?
```bash
curl https://your-webhook-url/health
```

**Check 2:** Verify token matches?
- Compare .env WEBHOOK_VERIFY_TOKEN with Meta dashboard setting

**Check 3:** Messages subscribed?
- Meta Dashboard → WhatsApp → Configuration → Webhook Fields
- Ensure `messages` is checked

### Responses Not Saving

**Check 1:** Database connection working?
```bash
node -e "const {createClient} = require('@supabase/supabase-js'); const client = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY); client.from('users').select('count').then(console.log);"
```

**Check 2:** Check webhook error logs
```sql
SELECT * FROM webhook_errors
WHERE type = 'flow_response_error'
ORDER BY timestamp DESC;
```

## Next Steps

1. **Week 1:** Monitor closely, check completion rates daily
2. **Week 2:** Review user feedback, adjust question format if needed
3. **Week 3:** Analyze data quality, ensure answers are being parsed correctly
4. **Month 2:** Add analytics dashboard for completion trends
5. **Month 3:** Build automated reminders for users who haven't completed

## Support

For issues:
1. Check logs first (Vercel/Railway)
2. Review database error tables
3. Test with single user in test mode
4. Contact Niko for product questions
