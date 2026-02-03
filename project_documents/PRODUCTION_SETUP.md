# CEO Lab - Production Setup Guide

**Status:** In Progress
**Last Updated:** 2026-02-03

This document guides you through setting up CEO Lab for production launch.

---

## Checklist

- [ ] 1. Upgrade Supabase to Pro
- [ ] 2. Switch Stripe to Live Mode
- [ ] 3. Set up Email Service (Resend)
- [ ] 4. Add Error Tracking (Sentry)
- [ ] 5. Set up Analytics
- [ ] 6. Custom Domain (Optional)
- [ ] 7. Test End-to-End Flow

---

## 1. Upgrade Supabase to Pro

**Why:** Free tier limits (500MB database, 2GB bandwidth, 50K users) won't support growth.
**Cost:** $25/month

### Steps:

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your CEO Lab project
3. Click "Settings" → "Billing"
4. Choose "Pro Plan" ($25/month)
5. Enter payment details and confirm

### What You Get:
- 8GB database storage (vs 500MB)
- 50GB bandwidth (vs 2GB)
- 100K monthly active users (vs 50K)
- 2M edge function invocations (vs 500K)
- Daily automated backups
- Point-in-time recovery
- Priority support

### After Upgrade:
- No code changes needed
- Same connection strings and API keys
- Backups start automatically

---

## 2. Switch Stripe to Live Mode

**Why:** Currently using test mode. Need live mode to accept real payments.
**Cost:** 1.4% + €0.25 per transaction (EU)

### Steps:

#### A. Get Live API Keys

1. Go to Stripe Dashboard: https://dashboard.stripe.com
2. Toggle from "Test mode" to "Live mode" (top right)
3. Go to "Developers" → "API keys"
4. Copy:
   - **Publishable key** (starts with `pk_live_...`)
   - **Secret key** (starts with `sk_live_...`)

#### B. Update Vercel Environment Variables

1. Go to Vercel Dashboard: https://vercel.com
2. Select CEO Lab project
3. Settings → Environment Variables
4. Update these variables (change from test to live):
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` = `pk_live_...`
   - `STRIPE_SECRET_KEY` = `sk_live_...`
5. **Important:** Redeploy after updating env vars

#### C. Update Webhook Endpoint

1. In Stripe Dashboard (Live mode)
2. Developers → Webhooks
3. Add endpoint: `https://ceo-lab.vercel.app/api/webhooks`
4. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copy the **Signing secret** (starts with `whsec_...`)
6. Add to Vercel env vars:
   - `STRIPE_WEBHOOK_SECRET` = `whsec_...`
7. Redeploy

#### D. Test with Real Payment

1. Use real credit card (will charge €100)
2. Sign up → Upgrade → Complete payment
3. Verify:
   - Payment appears in Stripe Dashboard
   - Subscription status updates in database
   - Access granted to premium features
4. Cancel test subscription immediately if testing

---

## 3. Set up Email Service (Resend)

**Why:** Send transactional emails (welcome, weekly reminders, payment confirmations)
**Cost:** Free up to 3,000 emails/month, then $20/month for 50,000

### Steps:

#### A. Create Resend Account

1. Go to https://resend.com
2. Sign up with your email
3. Verify your email address

#### B. Add Domain

1. In Resend Dashboard → "Domains"
2. Add your domain (e.g., `ceo-lab.com`)
3. Add DNS records they provide to your domain registrar:
   - TXT record for SPF
   - CNAME for DKIM
4. Wait for verification (5-30 minutes)

#### C. Get API Key

1. In Resend Dashboard → "API Keys"
2. Create new API key: "CEO Lab Production"
3. Copy the API key (starts with `re_...`)

#### D. Add to Vercel

1. Vercel Dashboard → Environment Variables
2. Add: `RESEND_API_KEY` = `re_...`
3. Redeploy

#### E. Install Resend Package

```bash
cd /path/to/ceo-lab
npm install resend
```

#### F. Create Email Templates

(We'll implement these in the next phase)

---

## 4. Add Error Tracking (Sentry)

**Why:** Monitor production errors, get alerts when things break
**Cost:** Free for 5K errors/month, then $26/month for 50K

### Steps:

#### A. Create Sentry Account

1. Go to https://sentry.io
2. Sign up (use GitHub OAuth)
3. Create new project: "CEO Lab"
4. Select platform: "Next.js"

#### B. Install Sentry

```bash
cd /path/to/ceo-lab
npx @sentry/wizard@latest -i nextjs
```

This will:
- Install Sentry packages
- Create `sentry.client.config.ts` and `sentry.server.config.ts`
- Add `SENTRY_DSN` to `.env.local`

#### C. Add to Vercel

1. Copy `SENTRY_DSN` from `.env.local`
2. Add to Vercel Environment Variables:
   - `NEXT_PUBLIC_SENTRY_DSN` = `https://...@sentry.io/...`
3. Redeploy

#### D. Test Error Tracking

Trigger a test error to verify Sentry is working:
```javascript
// Add to any page temporarily
throw new Error("Test error for Sentry")
```

Check Sentry dashboard to see the error appear.

---

## 5. Set up Analytics

**Why:** Track user behavior, understand conversion funnels
**Cost:** Free (PostHog self-hosted or cloud free tier)

### Option A: PostHog (Recommended)

1. Go to https://posthog.com
2. Sign up for Cloud (free up to 1M events/month)
3. Create project: "CEO Lab"
4. Copy Project API Key and Host

#### Install PostHog:

```bash
npm install posthog-js
```

#### Add to Vercel:

```
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

### Option B: Google Analytics (Alternative)

1. Create GA4 property
2. Install `next-google-analytics`
3. Add tracking ID to Vercel env vars

---

## 6. Custom Domain (Optional)

**Why:** Professional branding (ceo-lab.com instead of ceo-lab.vercel.app)
**Cost:** ~€10-15/year for domain registration

### Steps:

1. Buy domain (Namecheap, Google Domains, etc.)
2. In Vercel Dashboard → Domains
3. Add your domain: `ceo-lab.com` and `www.ceo-lab.com`
4. Add DNS records from Vercel to your domain registrar:
   - A record: `76.76.21.21`
   - CNAME: `cname.vercel-dns.com`
5. Wait for propagation (5-60 minutes)
6. Update Stripe webhook URL to new domain
7. Update email links/domain in Resend

---

## 7. Test End-to-End Flow

Before launching, test the complete user journey:

### Test Checklist:

- [ ] **Signup**
  - [ ] Sign up with Google OAuth
  - [ ] Sign up with Magic Link
  - [ ] Verify email received (if applicable)

- [ ] **Hook Assessment**
  - [ ] Complete 12 questions
  - [ ] See results page
  - [ ] Scores calculate correctly

- [ ] **Upgrade to Premium**
  - [ ] Click upgrade button
  - [ ] Stripe checkout loads
  - [ ] Complete payment with real card
  - [ ] Webhook fires and updates database
  - [ ] Subscription status = "active"
  - [ ] Premium features unlock

- [ ] **Baseline Assessment**
  - [ ] Access granted (premium only)
  - [ ] Complete Stage 1 (30 questions)
  - [ ] Responses save to database
  - [ ] Continue to Stage 2, Stage 3
  - [ ] See full results after completion

- [ ] **Focus Selection**
  - [ ] Choose 3 dimensions from results page
  - [ ] Selections save to database
  - [ ] Redirect to dashboard

- [ ] **Weekly Check-in**
  - [ ] See 3 questions based on focus areas
  - [ ] Submit responses
  - [ ] Streak counter updates
  - [ ] Check-in recorded in database

- [ ] **Cancellation**
  - [ ] Cancel subscription in Stripe
  - [ ] Webhook fires
  - [ ] Access continues until period end
  - [ ] Then reverts to free tier

---

## Environment Variables Summary

Make sure all these are set in Vercel Production:

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://...supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJh...

# Stripe (LIVE mode)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email
RESEND_API_KEY=re_...

# Error Tracking
NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...

# Analytics
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

---

## Monthly Costs Summary

| Service | Cost | Purpose |
|---------|------|---------|
| Vercel | $0 | Hosting (Hobby tier) |
| Supabase Pro | $25 | Database, auth, storage |
| Stripe | 1.4% + €0.25 per transaction | Payment processing |
| Resend | $0-20 | Email (free up to 3K/month) |
| Sentry | $0-26 | Error tracking (free up to 5K errors) |
| PostHog | $0 | Analytics (free up to 1M events) |
| Domain | €1-2 | Domain registration (annual) |
| **Total** | **~€50-75/month** | Before revenue |

---

## Next Steps After Production Setup

1. [ ] Soft launch to 10-20 beta users
2. [ ] Monitor errors in Sentry
3. [ ] Track key metrics in PostHog:
   - Signups
   - Assessment completions
   - Upgrade conversion rate
   - Weekly check-in completion rate (target: 80%+)
4. [ ] Gather feedback
5. [ ] Iterate on UX based on data
6. [ ] Public launch to newsletter (3000 subscribers)

---

## Support Contacts

- **Supabase:** support@supabase.com
- **Stripe:** https://support.stripe.com
- **Resend:** support@resend.com
- **Sentry:** support@sentry.io
- **Vercel:** support@vercel.com
