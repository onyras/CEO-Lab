# Coupon Codes Setup Guide

## ✅ Implementation Complete

Stripe promotion codes are now enabled in the checkout flow. Users will see a "Add promotion code" link on the payment page.

---

## How to Create Promotion Codes in Stripe

### Step 1: Create a Coupon
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/coupons)
2. Click **"Create coupon"**
3. Choose coupon type:

**For FREE access (100% off):**
- Name: `Free Beta Access` (internal name)
- Type: `Percentage discount`
- Percentage off: `100%`
- Duration: `Forever` (or `Once`, `Repeating`)

**For discounts:**
- Name: `50% Launch Discount` (internal name)
- Type: `Percentage discount`
- Percentage off: `50%`
- Duration: `Repeating` → `3 months` (or `Forever`)

4. Click **"Create coupon"**

### Step 2: Create Promotion Code
1. After creating the coupon, click **"Add promotion code"**
2. Enter the code users will type:
   - `BETA100` (for free access)
   - `LAUNCH50` (for 50% off)
   - `FRIEND25` (for 25% off)
3. Set options:
   - **Max redemptions:** Leave blank for unlimited, or set a limit (e.g., 100)
   - **Expiration date:** Optional
   - **First-time customers only:** Optional
   - **Minimum amount:** Optional
4. Click **"Create promotion code"**

---

## Recommended Codes to Create

### 1. BETA100 (Free Forever)
- **Coupon:** 100% off, Forever
- **Use case:** Beta testers, advisors, partners
- **Max redemptions:** 50
- **Expiration:** None (or set a date)

### 2. LAUNCH50 (50% off for 3 months)
- **Coupon:** 50% off, Repeating for 3 months
- **Use case:** Launch promotion
- **Max redemptions:** Unlimited
- **Expiration:** 30 days from now

### 3. FRIEND25 (25% off Forever)
- **Coupon:** 25% off, Forever
- **Use case:** Referrals, community members
- **Max redemptions:** Unlimited
- **Expiration:** None

---

## How Users Apply Codes

1. User clicks **"Upgrade to Premium"** on dashboard
2. Stripe checkout page loads
3. User clicks **"Add promotion code"** link
4. Enters code (e.g., `BETA100`)
5. Stripe validates and applies discount automatically
6. User completes checkout (or pays €0 if 100% off)

---

## Tracking & Analytics

### View Usage:
1. Go to [Stripe Dashboard → Coupons](https://dashboard.stripe.com/coupons)
2. Click on any coupon to see:
   - Times redeemed
   - Revenue impact
   - Active subscriptions using this code

### Export Data:
1. Go to [Stripe Dashboard → Customers](https://dashboard.stripe.com/customers)
2. Filter by promotion code
3. Export to CSV

---

## Testing

### Test Mode:
1. Use Stripe test mode keys (already configured)
2. Create test promotion codes
3. Test checkout flow
4. Use test card: `4242 4242 4242 4242`, any future expiry

### Live Mode:
1. Switch to live mode in Stripe Dashboard
2. Create real promotion codes
3. Test with a real card (you can refund later)

---

## Important Notes

- **100% off coupons:** Users still create a Stripe subscription, but at €0. You can see them in your Stripe customer list.
- **Duration options:**
  - `Once`: Discount applies to first payment only
  - `Repeating`: Discount applies for X months
  - `Forever`: Discount applies to all future payments
- **Case sensitive:** Codes are case-insensitive by default (BETA100 = beta100)
- **Usage limits:** Set max redemptions to prevent abuse
- **Expiration:** Set expiry dates for time-limited promotions

---

## Next Steps

1. Go to Stripe Dashboard and create your first coupon
2. Create promotion code (e.g., `BETA100`)
3. Test it in checkout
4. Share codes with beta users

---

## Questions?

The implementation is complete. Stripe handles all validation, tracking, and billing automatically.
