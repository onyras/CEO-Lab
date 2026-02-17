# CEO Lab - Founding Member Offer

**Last Updated:** 2026-02-17

---

## The Offer

| | Standard | Founding Member |
|---|---|---|
| Monthly | €100/month | €80/month |
| Annual | €1,000/year | €800/year |
| Cap | Unlimited | First 50 members |
| Duration | — | Locked for life |

**Positioning:** "This isn't a discount. It's a thank you for being early."

---

## Stripe Setup

- [ ] Create `founding-monthly` promo code: 20% off, forever duration, max 50 redemptions
- [ ] Create `founding-annual` promo code: 20% off, forever duration, max 50 redemptions
- [ ] Set up redemption tracking (Stripe dashboard or webhook)
- [ ] Auto-expire codes when 50 spots filled

**Note:** CEO Lab already has a coupon code system (see `technical/COUPON_CODES_SETUP.md`). Founding member codes should use the same Stripe promotion code infrastructure.

---

## Tracking

- [ ] How to display remaining spots publicly (real-time or manually updated?)
- [ ] Webhook to notify when spots are running low (e.g., 10 remaining)
- [ ] Webhook to auto-close when 50 reached

---

## Rules

- Founding member pricing is the **only** discount, ever
- No countdown timers, no fake scarcity
- "24 founding member spots remaining" — only communicate if true
- Pricing closes Day 29 (Monday after launch week)
