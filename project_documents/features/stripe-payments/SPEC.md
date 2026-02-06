# Stripe Payments - Feature Spec

**Status:** Implemented
**Source:** Extracted from MVP_BUILD_PLAN.md

---

## Overview

€100/month subscription via Stripe. Includes coupon code support via Stripe Promotion Codes.

---

## Checkout Flow

1. User clicks "Get Full Profile" after hook assessment
2. Creates Stripe Checkout Session (subscription mode)
3. User completes payment
4. Webhook fires → updates user profile → grants access

---

## Coupon Codes

Uses Stripe Promotion Codes (no custom implementation needed):
- **Beta testers:** 100% off forever (e.g., BETA100)
- **Launch promotions:** 50% off for 3 months (e.g., LAUNCH50)
- **Referrals:** 25% off forever (e.g., FRIEND25)

All tracking via Stripe Dashboard.

---

## Webhook Events

| Event | Action |
|---|---|
| `checkout.session.completed` | Set subscription_status = 'active', save stripe_customer_id |
| `customer.subscription.updated` | Update subscription_status |
| `customer.subscription.deleted` | Set subscription_status = 'canceled' |

---

## Pricing Strategy

| Tier | Price | What's Included |
|---|---|---|
| Free | €0 | Hook assessment (12 questions) |
| Premium | €100/month | Full baseline + weekly check-ins + dashboard + frameworks + reports |

**Upsell:** 1-on-1 coaching with Niko (€15k)

---

## Environment Variables

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID=price_...
```
