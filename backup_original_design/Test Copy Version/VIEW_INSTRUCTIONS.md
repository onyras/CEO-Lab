# How to View the V2 Landing Page

## Quick Start

1. **Open the HTML file:**
   ```
   /Users/acai/Documents/AI Agent/nk/projects/09_ceo_lab/Test Copy Version/index-v2.html
   ```

2. **Open in browser:**
   - Double-click the file, or
   - Right-click → Open With → Chrome/Firefox/Safari

3. **Or run a local server:**
   ```bash
   cd "/Users/acai/Documents/AI Agent/nk/projects/09_ceo_lab/Test Copy Version"
   python3 -m http.server 8000
   ```
   Then visit: `http://localhost:8000/index-v2.html`

---

## What's Different in V2

### ✅ NEW SECTIONS:
1. **Stats Bar** - Under hero (100+ founders, $15K engagements)
2. **Differentiation Table** - "Other Solutions vs CEO Lab"
3. **5-Step Process** - Clear how-it-works flow
4. **Social Proof** - 3 testimonials with names/companies
5. **Value Stack** - Shows $4,000+ value for $15
6. **Free Trial Option** - 7-day trial pricing tier
7. **FAQ Section** - Addresses all objections
8. **Enhanced Final CTA** - What happens next, trust badges

### 🔄 IMPROVED SECTIONS:
- **Hero** - Dual CTAs (Free Trial + How It Works)
- **Problem Section** - Kept (it's already strong)
- **Pricing** - Now shows trial vs. pro with value breakdown
- **Assessments** - Same cards, updated CTAs

### 📊 FRAMEWORK ELEMENTS:
✓ Clarity (hero value prop)
✓ Relevance (problem/pain)
✓ Value (what you get)
✓ Social Proof (testimonials)
✓ Differentiation (contrast table)
✓ How It Works (5 steps)
✓ Pricing (with value stack)
✓ FAQ (objection handling)
✓ Multiple CTAs throughout

---

## Key Features

### Free Trial Emphasis:
- Hero CTA: "Start Free Trial"
- Pricing section: Dedicated free trial card
- FAQ: Addresses trial concerns
- Final CTA: Emphasizes no credit card required

### Social Proof:
- 3 detailed testimonials with:
  - Specific before/after scores
  - Company names and funding stages
  - Concrete transformations
- Beta transparency badge

### Value Anchoring:
- Pricing breakdown showing $4,000+ value
- Individual item values listed
- Visual comparison: $4,025 → $15

### Trust Building:
- Trust badges (security, cancel anytime, no CC)
- Transparency about beta status
- Privacy assurance in FAQ

---

## Mobile Responsive

The page uses the existing NK design system and should be fully responsive. Test at:
- Desktop: 1920px
- Tablet: 768px
- Mobile: 375px

---

## Assets Required

The page references these assets (already in main project):
- `../assets/images/nk_logo.png`
- `../assets/images/dashboard-preview.svg`
- `../assets/images/assessments/*.svg`
- `../styles.css`
- `../js/hero-scroll.js`
- `../landing.js`
- `../favicon.svg`

---

## Compare to Original

**Original:** `/Users/acai/Documents/AI Agent/nk/projects/09_ceo_lab/index.html`
**V2:** `/Users/acai/Documents/AI Agent/nk/projects/09_ceo_lab/Test Copy Version/index-v2.html`

Open both side-by-side to compare.

---

## Next Steps

1. **Review the page** - Check copy, flow, design
2. **Test all links** - Make sure CTAs point correctly
3. **Get feedback** - Show to trusted advisors
4. **Decide on launch strategy:**
   - Option A: Replace current index.html with V2
   - Option B: A/B test current vs. V2
   - Option C: Launch V2 on subdomain first (beta.ceolab.com)

---

## Deployment Options

### Option 1: Direct Replacement
```bash
cd "/Users/acai/Documents/AI Agent/nk/projects/09_ceo_lab"
mv index.html index-v1-backup.html
cp "Test Copy Version/index-v2.html" index.html
git add .
git commit -m "Launch V2 landing page with conversion framework"
git push
```

### Option 2: Keep Both (A/B Test)
- Deploy V2 to `/beta` subdirectory
- Split traffic 50/50
- Track conversions for 2 weeks
- Choose winner

### Option 3: Gradual Rollout
- Launch V2 to email list only (custom link)
- Collect feedback for 1 week
- Iterate based on feedback
- Then replace main landing page

---

## Notes

- **Testimonials:** Currently using example transformations with transparency badge
- **Stats:** "100+ founders" is aspirational for beta launch
- **Free Trial:** Requires Stripe/payment setup to be functional
- **Links:** All CTAs point to ../subscribe.html (needs to be updated for trial flow)

---

**Ready to launch?** Review the page, test the flow, and decide your deployment strategy.
