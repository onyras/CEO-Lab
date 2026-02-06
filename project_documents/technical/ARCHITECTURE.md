# CEO Lab - Technical Architecture

**Last Updated:** 2026-02-06
**Source:** Extracted from PRODUCT_STRATEGY.md and MVP_BUILD_PLAN.md

---

## Tech Stack

### Frontend
- **Next.js 14** - Full-stack React framework with App Router
- **React** - UI library with Server Components + Client Components
- **TypeScript** - Type-safe development
- **ShadCN + Tailwind CSS** - Component library + utility-first styling
- **React Query (TanStack Query)** - Client-side data management, caching, and real-time sync

### Backend
- **Supabase** - Backend-as-a-service platform
  - PostgreSQL database
  - Real-time subscriptions
  - Row-level security (RLS)
  - Authentication (email/password, OAuth)
  - Storage (framework PDFs)
- **Supabase Edge Functions** - Serverless functions for webhooks and background jobs

### Integrations
- **Stripe** - Payment processing (€100/month subscriptions)
- **Twilio WhatsApp API** - Weekly check-in delivery
- **Vercel** - Hosting and deployment

### Data Management Pattern
- React Query wraps Supabase queries for caching and optimistic updates
- Supabase real-time invalidates React Query cache on data changes
- Best of both: Supabase handles backend + real-time, React Query handles client-side data layer

### Why This Stack?
- **Next.js:** SSR for landing page SEO, one codebase for frontend/API routes
- **ShadCN + Tailwind:** Pre-built accessible components, rapid UI development
- **React Query + Supabase:** Eliminates state management boilerplate, automatic cache invalidation on real-time updates
- **Supabase:** Zero backend code, instant API, real-time out of the box
- **Total cost:** ~$25-50/month until significant scale

---

## Deployment Strategy

### 1. Staging Environment
- **Purpose:** Internal testing during development and updates
- **Access:** Niko + development team only
- **Vercel:** `staging.ceolab.app` (auto-deploy from `develop` branch)
- **Supabase:** Separate staging project (isolated database)
- **Stripe:** Test mode with test cards
- **Twilio:** Sandbox WhatsApp number

### 2. Production Environment
- **Purpose:** Stable environment for users
- **Access:** Public (paying subscribers)
- **Vercel:** `ceolab.app` (manual deploy from `main` branch)
- **Supabase:** Production project (live database)
- **Stripe:** Live mode (real payments)
- **Twilio:** Production WhatsApp number
- **Update policy:** Only deploy when fully tested in staging

### Workflow
1. Develop feature in `develop` branch → auto-deploys to staging
2. Test thoroughly in staging environment
3. When stable, create PR: `develop` → `main`
4. Review and approve PR
5. Merge to `main` → manual deploy to production

**Cost:** ~$50-75/month total (2 Supabase projects, 2 Vercel deployments, 1 Twilio account)

---

## Project Structure

```
ceo-lab/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (marketing)/
│   │   ├── page.tsx (landing page)
│   │   └── layout.tsx
│   ├── assessment/
│   │   ├── hook/
│   │   │   ├── page.tsx
│   │   │   └── results/page.tsx
│   │   └── baseline/
│   │       ├── stage-1/page.tsx
│   │       ├── stage-2/page.tsx
│   │       ├── stage-3/page.tsx
│   │       └── complete/page.tsx
│   ├── dashboard/
│   │   ├── page.tsx
│   │   ├── layout.tsx
│   │   └── profile/page.tsx
│   ├── api/
│   │   ├── assessment/
│   │   ├── scores/route.ts
│   │   └── webhooks/stripe/route.ts
│   └── checkout/page.tsx
├── components/
│   ├── ui/ (ShadCN)
│   ├── assessment/
│   ├── dashboard/
│   ├── marketing/
│   └── layout/
├── lib/
│   ├── supabase/
│   ├── stripe/
│   ├── scoring/
│   ├── questions/
│   └── utils.ts
├── hooks/
├── types/
└── public/
```

---

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_ID=

# Twilio WhatsApp
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_WHATSAPP_NUMBER=

# Email
RESEND_API_KEY=

# Error Tracking
NEXT_PUBLIC_SENTRY_DSN=

# Analytics
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=

# App
NEXT_PUBLIC_URL=https://ceolab.app
```

---

## Monthly Costs

| Service | Cost | Purpose |
|---------|------|---------|
| Vercel | $0 | Hosting (Hobby tier) |
| Supabase Pro | $25 | Database, auth, storage |
| Stripe | 1.4% + €0.25/txn | Payment processing |
| Resend | $0-20 | Email |
| Sentry | $0-26 | Error tracking |
| PostHog | $0 | Analytics |
| Domain | €1-2 | Domain registration |
| **Total** | **~€50-75/month** | Before revenue |
