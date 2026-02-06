# CEO Lab - MVP Build Plan (Week 1)

**Launch Date:** Friday, 2026-02-07
**Team:** Niko + 1 Developer
**Timeline:** 5 days (Monday-Friday)
**Principle:** Quality over quantity. Fewer features, built well.

---

## What We're Building

**In Scope:**
- ✅ Landing page (professional, on-brand)
- ✅ Hook assessment (12 questions, free, immediate results)
- ✅ Stripe checkout (€100/month subscription)
- ✅ Full baseline assessment (100 questions, staged: 30→60→100)
- ✅ Dashboard (clean heatmap, 18 sub-dimensions)
- ✅ Auth & user profiles (Supabase)

**Out of Scope (Week 2+):**
- ❌ Weekly check-ins
- ❌ Trend charts
- ❌ Framework prescriptions
- ❌ Reports (monthly/quarterly/annual)
- ❌ Social features

---

## Tech Stack

- **Frontend:** Next.js 14 (App Router) + React + TypeScript
- **UI:** ShadCN + Tailwind CSS
- **Data:** React Query + Supabase
- **Auth:** Supabase Auth
- **Payments:** Stripe
- **Hosting:** Vercel

---

## Database Schema

### Tables

#### 1. `users` (Supabase Auth - built-in)
```sql
-- Managed by Supabase Auth
id: uuid (primary key)
email: string
created_at: timestamp
```

#### 2. `user_profiles`
```sql
id: uuid (primary key, references auth.users)
full_name: string
created_at: timestamp
updated_at: timestamp
baseline_stage: integer (1, 2, or 3) -- tracks which stage they're on
baseline_completed: boolean
hook_completed: boolean
subscription_status: string ('active', 'canceled', 'past_due')
stripe_customer_id: string
stripe_subscription_id: string
```

#### 3. `hook_assessments`
```sql
id: uuid (primary key)
user_id: uuid (references auth.users) -- nullable for anonymous users
completed_at: timestamp
score_yourself: integer (0-16)
score_teams: integer (0-16)
score_organizations: integer (0-16)
total_score: integer (0-48)
created_at: timestamp
```

#### 4. `hook_responses`
```sql
id: uuid (primary key)
assessment_id: uuid (references hook_assessments)
question_number: integer (1-12)
answer_value: integer (1-4 points)
created_at: timestamp
```

#### 5. `baseline_assessments`
```sql
id: uuid (primary key)
user_id: uuid (references auth.users)
stage: integer (1, 2, or 3)
completed_at: timestamp
score_yourself: integer (0-60)
score_teams: integer (0-60)
score_organizations: integer (0-60)
total_score: integer (0-180)
created_at: timestamp
```

#### 6. `baseline_responses`
```sql
id: uuid (primary key)
user_id: uuid (references auth.users)
assessment_id: uuid (references baseline_assessments)
question_number: integer (1-100)
sub_dimension: string ('energy_management', 'self_awareness', etc.)
territory: string ('yourself', 'teams', 'organizations')
answer_value: integer (1-5 points)
stage: integer (1, 2, or 3)
created_at: timestamp
```

#### 7. `sub_dimension_scores`
```sql
id: uuid (primary key)
user_id: uuid (references auth.users)
sub_dimension: string ('energy_management', 'self_awareness', etc.)
territory: string ('yourself', 'teams', 'organizations')
current_score: integer
max_possible_score: integer
percentage: decimal
last_updated: timestamp
created_at: timestamp
```

### Row Level Security (RLS) Policies

```sql
-- user_profiles: Users can only read/update their own profile
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- baseline_assessments: Users can only access their own assessments
CREATE POLICY "Users can view own assessments"
  ON baseline_assessments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own assessments"
  ON baseline_assessments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- baseline_responses: Users can only access their own responses
CREATE POLICY "Users can view own responses"
  ON baseline_responses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own responses"
  ON baseline_responses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- sub_dimension_scores: Users can only read their own scores
CREATE POLICY "Users can view own scores"
  ON sub_dimension_scores FOR SELECT
  USING (auth.uid() = user_id);

-- Hook assessments: Anyone can create (anonymous), only owners can view
CREATE POLICY "Anyone can create hook assessment"
  ON hook_assessments FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view own hook assessments"
  ON hook_assessments FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);
```

---

## Project Structure

```
ceo-lab/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── signup/
│   │       └── page.tsx
│   ├── (marketing)/
│   │   ├── page.tsx (landing page)
│   │   └── layout.tsx
│   ├── assessment/
│   │   ├── hook/
│   │   │   ├── page.tsx (12 questions)
│   │   │   └── results/
│   │   │       └── page.tsx
│   │   └── baseline/
│   │       ├── stage-1/
│   │       │   └── page.tsx (30 questions)
│   │       ├── stage-2/
│   │       │   └── page.tsx (30 questions)
│   │       ├── stage-3/
│   │       │   └── page.tsx (40 questions)
│   │       └── complete/
│   │           └── page.tsx
│   ├── dashboard/
│   │   ├── page.tsx (main dashboard)
│   │   ├── layout.tsx (dashboard layout with nav)
│   │   └── profile/
│   │       └── page.tsx
│   ├── api/
│   │   ├── assessment/
│   │   │   ├── hook/
│   │   │   │   └── route.ts
│   │   │   └── baseline/
│   │   │       └── route.ts
│   │   ├── scores/
│   │   │   └── route.ts
│   │   └── webhooks/
│   │       └── stripe/
│   │           └── route.ts
│   └── checkout/
│       └── page.tsx (Stripe checkout)
├── components/
│   ├── ui/ (ShadCN components)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── form.tsx
│   │   ├── progress.tsx
│   │   └── ...
│   ├── assessment/
│   │   ├── QuestionCard.tsx
│   │   ├── ProgressIndicator.tsx
│   │   └── ResultsCard.tsx
│   ├── dashboard/
│   │   ├── Heatmap.tsx
│   │   ├── ScoreCard.tsx
│   │   ├── TerritoryScore.tsx
│   │   └── SubDimensionCard.tsx
│   ├── marketing/
│   │   ├── Hero.tsx
│   │   ├── Features.tsx
│   │   └── Pricing.tsx
│   └── layout/
│       ├── Header.tsx
│       ├── Footer.tsx
│       └── DashboardNav.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts
│   ├── stripe/
│   │   └── client.ts
│   ├── scoring/
│   │   ├── hook.ts
│   │   └── baseline.ts
│   ├── questions/
│   │   ├── hook.ts (12 questions)
│   │   └── baseline.ts (100 questions)
│   └── utils.ts
├── hooks/
│   ├── useUser.ts
│   ├── useAssessment.ts
│   └── useScores.ts
├── types/
│   ├── database.ts
│   ├── assessment.ts
│   └── user.ts
└── public/
    ├── images/
    └── fonts/
```

---

## Component Architecture

### Key Components

#### 1. Assessment Components

**QuestionCard.tsx**
```tsx
interface QuestionCardProps {
  questionNumber: number;
  question: string;
  options: {
    label: string;
    description: string;
    value: number;
  }[];
  selectedValue: number | null;
  onSelect: (value: number) => void;
}
```

**ProgressIndicator.tsx**
```tsx
interface ProgressIndicatorProps {
  current: number;
  total: number;
  stage?: 1 | 2 | 3;
}
```

**ResultsCard.tsx**
```tsx
interface ResultsCardProps {
  territory: 'yourself' | 'teams' | 'organizations';
  score: number;
  maxScore: number;
  percentage: number;
}
```

#### 2. Dashboard Components

**Heatmap.tsx**
```tsx
interface HeatmapProps {
  scores: {
    subDimension: string;
    territory: string;
    percentage: number;
  }[];
}
```

**ScoreCard.tsx**
```tsx
interface ScoreCardProps {
  title: string;
  score: number;
  maxScore: number;
  percentage: number;
  territory: 'yourself' | 'teams' | 'organizations';
}
```

**SubDimensionCard.tsx**
```tsx
interface SubDimensionCardProps {
  name: string;
  score: number;
  maxScore: number;
  percentage: number;
  description?: string;
}
```

---

## API Routes

### 1. `/api/assessment/hook` (POST)
**Purpose:** Submit hook assessment responses

**Request:**
```json
{
  "responses": [
    { "questionNumber": 1, "answerValue": 3 },
    { "questionNumber": 2, "answerValue": 4 },
    ...
  ],
  "userId": "uuid" // optional for anonymous
}
```

**Response:**
```json
{
  "assessmentId": "uuid",
  "scores": {
    "yourself": 12,
    "teams": 14,
    "organizations": 10,
    "total": 36
  },
  "percentage": 75
}
```

### 2. `/api/assessment/baseline` (POST)
**Purpose:** Submit baseline assessment responses

**Request:**
```json
{
  "stage": 1,
  "responses": [
    { "questionNumber": 1, "answerValue": 4, "subDimension": "energy_management", "territory": "yourself" },
    ...
  ]
}
```

**Response:**
```json
{
  "assessmentId": "uuid",
  "stage": 1,
  "scores": {
    "yourself": 24,
    "teams": 28,
    "organizations": 22,
    "total": 74
  },
  "subDimensionScores": [
    { "subDimension": "energy_management", "score": 8, "maxScore": 10 },
    ...
  ]
}
```

### 3. `/api/scores` (GET)
**Purpose:** Fetch user's current scores

**Response:**
```json
{
  "baseline": {
    "stage": 2,
    "completed": false,
    "scores": {
      "yourself": 24,
      "teams": 28,
      "organizations": 22,
      "total": 74
    }
  },
  "subDimensions": [
    {
      "name": "energy_management",
      "territory": "yourself",
      "score": 8,
      "maxScore": 10,
      "percentage": 80
    },
    ...
  ]
}
```

### 4. `/api/webhooks/stripe` (POST)
**Purpose:** Handle Stripe webhook events

**Events to handle:**
- `checkout.session.completed` - Create/update subscription
- `customer.subscription.updated` - Update subscription status
- `customer.subscription.deleted` - Cancel subscription

---

## Data Flow

### Hook Assessment Flow

1. User visits landing page → clicks "Take Free Assessment"
2. Redirects to `/assessment/hook`
3. User answers 12 questions (client-side state)
4. On submit → POST `/api/assessment/hook`
5. API calculates scores, saves to DB
6. Redirects to `/assessment/hook/results` with scores
7. Results page shows scores + CTA to subscribe
8. Click "Get Full Profile" → `/checkout`

### Baseline Assessment Flow

1. User subscribes → Stripe redirects to success URL
2. Success URL triggers account setup → redirects to `/dashboard`
3. Dashboard shows "Complete Stage 1" CTA
4. Click → `/assessment/baseline/stage-1`
5. User answers 30 questions (client-side state, autosave every 5 questions)
6. On submit → POST `/api/assessment/baseline` with stage=1
7. API calculates scores, updates `user_profiles.baseline_stage = 1`
8. Redirects to `/dashboard` with updated scores
9. Dashboard shows "60% complete! Continue to Stage 2?"
10. Repeat for stages 2 and 3

### Dashboard Data Flow

1. User visits `/dashboard`
2. React Query fetches: GET `/api/scores`
3. Render:
   - Territory scores (3 cards)
   - Heatmap (18 sub-dimensions)
   - Progress indicator (30%, 60%, or 100%)
   - CTA to continue baseline if incomplete

---

## Scoring Logic

### Hook Assessment (12 questions, 48 points)

**Calculation:**
- 4 questions per territory
- Each question: 1-4 points
- Max per territory: 16 points
- Total max: 48 points

**Mapping:**
- Q1-Q4: Leading Yourself
- Q5-Q8: Leading Teams
- Q9-Q12: Leading Organizations

### Baseline Assessment (100 questions, 300 points)

**Stage 1: 30 questions**
- Leading Yourself: 10 questions (varies by sub-dimension)
- Leading Teams: 10 questions
- Leading Organizations: 10 questions

**Stage 2: 30 questions**
- Leading Yourself: 10 questions
- Leading Teams: 10 questions
- Leading Organizations: 10 questions

**Stage 3: 40 questions**
- Leading Yourself: 12 questions
- Leading Teams: 15 questions
- Leading Organizations: 13 questions

**Each question: 1-5 points (Likert scale or multiple choice)**

**Total possible:**
- Leading Yourself: 32 questions = 60 points (varies by question weight)
- Leading Teams: 35 questions = 60 points
- Leading Organizations: 33 questions = 60 points
- **Total: 180 points**

**Sub-dimension calculation:**
- Each sub-dimension has 5-6 questions
- Sum question scores for that sub-dimension
- Calculate percentage: (score / max_possible) * 100

---

## Authentication Flow

### Signup
1. User clicks "Sign Up" on landing page
2. Redirects to `/signup`
3. Enter email + password
4. Supabase creates auth user
5. Trigger: Create `user_profiles` row with default values
6. Redirect to `/dashboard`

### Login
1. User clicks "Log In"
2. Redirects to `/login`
3. Enter email + password
4. Supabase authenticates
5. Redirect to `/dashboard`

### Middleware Protection
```tsx
// middleware.ts
export async function middleware(request: NextRequest) {
  const supabase = createMiddlewareClient({ req: request })
  const { data: { session } } = await supabase.auth.getSession()

  // Protect dashboard routes
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Protect baseline assessment routes (require subscription)
  if (request.nextUrl.pathname.startsWith('/assessment/baseline')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Check subscription status
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('subscription_status')
      .eq('id', session.user.id)
      .single()

    if (profile?.subscription_status !== 'active') {
      return NextResponse.redirect(new URL('/checkout', request.url))
    }
  }

  return NextResponse.next()
}
```

---

## Stripe Integration

### 1. Create Checkout Session
```tsx
// app/checkout/page.tsx
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

async function createCheckoutSession(userId: string) {
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: process.env.STRIPE_PRICE_ID, // €100/month price ID
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/checkout`,
    client_reference_id: userId,
    metadata: {
      userId,
    },
  });

  return session.url;
}
```

### 2. Handle Webhook
```tsx
// app/api/webhooks/stripe/route.ts
import { headers } from 'next/headers';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return new Response('Webhook Error', { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;

      // Update user profile
      await supabase
        .from('user_profiles')
        .update({
          subscription_status: 'active',
          stripe_customer_id: session.customer,
          stripe_subscription_id: session.subscription,
        })
        .eq('id', session.client_reference_id);

      break;

    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
      const subscription = event.data.object as Stripe.Subscription;

      await supabase
        .from('user_profiles')
        .update({
          subscription_status: subscription.status,
        })
        .eq('stripe_subscription_id', subscription.id);

      break;
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
}
```

---

## Day-by-Day Build Plan

### Monday: Foundation & Infrastructure

**Morning:**
- [ ] Initialize Next.js 14 project with TypeScript
- [ ] Install dependencies (ShadCN, Tailwind, React Query, Supabase)
- [ ] Set up Supabase project (production only for now)
- [ ] Create database tables and RLS policies
- [ ] Configure environment variables

**Afternoon:**
- [ ] Build auth pages (login, signup)
- [ ] Set up Supabase auth client
- [ ] Create middleware for route protection
- [ ] Build landing page shell (header, hero, footer)
- [ ] Set up ShadCN components

**Evening:**
- [ ] Test auth flow (signup → login → dashboard redirect)
- [ ] Deploy to Vercel for first test

---

### Tuesday: Hook Assessment

**Morning:**
- [ ] Create hook assessment questions data (`lib/questions/hook.ts`)
- [ ] Build `QuestionCard` component
- [ ] Build `/assessment/hook` page with stepper UI
- [ ] Implement client-side state management for responses

**Afternoon:**
- [ ] Build scoring logic (`lib/scoring/hook.ts`)
- [ ] Create `/api/assessment/hook` route
- [ ] Save hook responses to database
- [ ] Build results page (`/assessment/hook/results`)

**Evening:**
- [ ] Polish hook assessment UI
- [ ] Add progress indicator
- [ ] Test complete flow: landing → hook → results
- [ ] Add CTA to results page ("Get Full Profile")

---

### Wednesday: Stripe & Baseline Start

**Morning:**
- [ ] Set up Stripe account and get API keys
- [ ] Create product and price (€100/month)
- [ ] Build `/checkout` page with Stripe checkout
- [ ] Test checkout flow

**Afternoon:**
- [ ] Create webhook endpoint (`/api/webhooks/stripe`)
- [ ] Handle `checkout.session.completed` event
- [ ] Update `user_profiles` on successful payment
- [ ] Create baseline assessment questions data (`lib/questions/baseline.ts`)

**Evening:**
- [ ] Build `/assessment/baseline/stage-1` page
- [ ] Implement question stepper (30 questions)
- [ ] Add autosave every 5 questions (save to local storage)
- [ ] Test Stripe webhook with Stripe CLI

---

### Thursday: Baseline Complete & Dashboard

**Morning:**
- [ ] Build scoring logic for baseline (`lib/scoring/baseline.ts`)
- [ ] Create `/api/assessment/baseline` route
- [ ] Calculate territory scores and sub-dimension scores
- [ ] Save to `baseline_assessments` and `sub_dimension_scores`

**Afternoon:**
- [ ] Build dashboard layout with navigation
- [ ] Create `ScoreCard` component (3 territory cards)
- [ ] Build `Heatmap` component (18 sub-dimensions)
- [ ] Fetch scores with React Query
- [ ] Display progress (30%, 60%, 100%)

**Evening:**
- [ ] Build Stage 2 and Stage 3 pages (copy Stage 1, update questions)
- [ ] Add "Continue to Stage 2" CTA on dashboard
- [ ] Test complete baseline flow (Stage 1 → 2 → 3)
- [ ] Polish dashboard UI

---

### Friday: Polish, Test & Launch

**Morning:**
- [ ] Final UI polish (spacing, colors, typography)
- [ ] Add loading states and error handling
- [ ] Test complete user journey:
  - Landing → Hook → Results → Checkout → Dashboard → Stage 1 → Dashboard → Stage 2 → Stage 3 → Complete
- [ ] Fix any bugs

**Afternoon:**
- [ ] Write launch email copy for newsletter
- [ ] Prepare launch assets (screenshots, social posts)
- [ ] Final staging test
- [ ] Deploy to production

**Evening:**
- [ ] Send newsletter announcement (3,000 subscribers)
- [ ] Post on LinkedIn
- [ ] Monitor signups and payments
- [ ] Be ready for support questions

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

# App
NEXT_PUBLIC_URL=https://ceolab.app
```

---

## Testing Checklist

### Pre-Launch Tests

**Auth:**
- [ ] Signup creates user and profile
- [ ] Login redirects to dashboard
- [ ] Logout clears session
- [ ] Protected routes redirect to login

**Hook Assessment:**
- [ ] All 12 questions display correctly
- [ ] Scoring calculates correctly
- [ ] Results page shows accurate scores
- [ ] CTA links to checkout

**Stripe:**
- [ ] Checkout session creates successfully
- [ ] Payment completes and webhook fires
- [ ] User profile updates with subscription
- [ ] Dashboard unlocks after payment

**Baseline Assessment:**
- [ ] Stage 1 saves responses correctly
- [ ] Scores calculate correctly
- [ ] Dashboard updates with new scores
- [ ] Progress indicator shows 30%
- [ ] Stage 2 unlocks after Stage 1
- [ ] Stage 3 unlocks after Stage 2
- [ ] 100% completion shows all scores

**Dashboard:**
- [ ] Territory scores display correctly
- [ ] Heatmap renders 18 sub-dimensions
- [ ] Colors match score ranges
- [ ] Data fetches with React Query
- [ ] Loading and error states work

---

## Launch Metrics to Track

**Week 1 Targets:**
- Hook assessments completed: 150-300
- Signups: 50-100
- Paid conversions: 30-60
- Conversion rate: 10-15%

**Monitor:**
- Checkout abandonment rate
- Baseline completion rate (Stage 1 → 2 → 3)
- Time to complete each stage
- User feedback and support questions

---

## Post-Launch (Week 2+)

**Immediate improvements:**
- Add weekly check-ins (dashboard form)
- Add trend charts
- Improve onboarding flow
- Add framework prescriptions

**Future phases:**
- WhatsApp automation
- Monthly reports
- Quarterly deep-dives
- Annual wrap-up

---

**Ready to build. Let's ship on Friday.**
