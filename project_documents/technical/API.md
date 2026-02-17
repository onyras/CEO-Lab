# CEO Lab - API Endpoints

**Last Updated:** 2026-02-17
**Source:** Extracted from MVP_BUILD_PLAN.md and implementation files

---

## Assessment Endpoints

### POST `/api/assessment/hook`
Submit hook assessment responses.

**Request:**
```json
{
  "responses": [
    { "questionNumber": 1, "answerValue": 3 },
    { "questionNumber": 2, "answerValue": 4 }
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

### POST `/api/assessment/baseline`
Submit baseline assessment responses (per stage).

**Request:**
```json
{
  "stage": 1,
  "responses": [
    {
      "questionNumber": 1,
      "answerValue": 4,
      "subDimension": "energy_management",
      "territory": "yourself"
    }
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
    { "subDimension": "energy_management", "score": 8, "maxScore": 10 }
  ]
}
```

### POST `/api/baseline/save-v2`
Enhanced baseline save with UPSERT support for redo/resume.

**Logic:**
- Incomplete assessment + higher stage → RESUME (same assessment_id)
- Recent complete (<90 days) → REDO (UPSERT same assessment_id)
- No recent or >90 days → NEW BASELINE (new assessment_id)

---

## Score Endpoints

### GET `/api/scores`
Fetch user's current scores.

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
    }
  ]
}
```

---

## Payment Endpoints

### POST `/api/checkout`
Create Stripe checkout session for €100/month subscription.

### POST `/api/webhooks/stripe`
Handle Stripe webhook events:
- `checkout.session.completed` → Create/update subscription
- `customer.subscription.updated` → Update subscription status
- `customer.subscription.deleted` → Cancel subscription

---

## Focus & Check-In Endpoints

### GET `/api/v4/focus`
Load current quarter's focus dimensions for authenticated user.

**Response:**
```json
{
  "success": true,
  "dimensions": ["LY.1", "LT.2", "LO.3"],
  "quarter": 1,
  "year": 2026
}
```

### POST `/api/v4/focus`
Upsert focus dimensions for current quarter.

**Request:**
```json
{
  "dimensions": ["LY.1", "LT.2", "LO.3"]
}
```

### GET `/api/v4/reveal-seen`
Check if user has seen the first-time results reveal.

**Response:**
```json
{ "success": true, "revealSeen": false }
```

### POST `/api/v4/reveal-seen`
Mark the results reveal as seen for authenticated user.

### POST `/api/focus/save` *(legacy)*
Save user's quarterly focus area selections.

### POST `/api/checkin/save` *(legacy)*
Save weekly check-in responses + update streaks.

---

## WhatsApp Endpoints

### POST `/api/whatsapp/webhook`
Receive and process WhatsApp message responses.

### GET `/api/cron/weekly-checkins`
Cron job: triggers weekly check-in sends for all opted-in users.
```json
// vercel.json
{
  "crons": [{
    "path": "/api/cron/weekly-checkins",
    "schedule": "0 * * * *"
  }]
}
```

---

## Accountability Agent Endpoints

### POST `/api/accountability/setup`
Save user's 3 custom questions + measurement options.

### GET `/api/accountability/suggest`
Return low-scoring sub-dimensions as focus suggestions.

### POST `/api/accountability/webhook`
Receive WhatsApp responses for accountability check-ins.

### POST `/api/accountability/send`
Trigger weekly accountability send (cron-invoked).

---

## Authentication

### Middleware Protection
- `/dashboard/*` → Requires auth session
- `/assessment/baseline/*` → Requires auth + active subscription
- `/assessment/hook/*` → Public (anonymous allowed)
