# CEO Lab

**The Only Subscription You Need to Stay at the Edge of Exceptional Leadership**

A subscription-based platform providing 50+ battle-tested frameworks, toolkits, and systems for CEOs and founders.

---

## Project Overview

CEO Lab is positioned as "the Every.to for founder/CEO tools and systems" - a curated library of proven leadership frameworks, comprehensive toolkits, meditation resources, and implementation support.

### Core Offering

**Three Pillars:**
1. **Leading Yourself** - Personal mastery, focus, burnout prevention
2. **Leading Teams** - Trust, communication, team dynamics
3. **Leading Organizations** - Strategy, culture, scaling

**What's Included:**
- 50+ Framework Library
- 4 Comprehensive Toolkits (Communication, Negotiations, Scaling, Strategy)
- Meditation Lab (e-book + guided recordings)
- Infographic Library
- Monthly Implementation Sessions

---

## Tech Stack

**Frontend:**
- Vanilla HTML/CSS/JS
- NK brand design system
- Responsive, mobile-first design

**Backend (Planned - Phase 2):**
- Supabase (auth + database + storage)
- Stripe (payments + subscriptions)
- Notion API (CMS for library content)

**Hosting:**
- Vercel or Netlify

---

## Project Structure

```
09_ceo_lab/
├── index.html              # Landing page
├── login.html              # Login page (to build)
├── signup.html             # Signup page (to build)
├── dashboard.html          # Member dashboard (to build)
├── styles.css              # Main stylesheet
├── landing.js              # Landing page interactions
├── auth.js                 # Authentication (to build)
├── dashboard.js            # Dashboard functionality (to build)
├── supabase-client.js      # Supabase config (to build)
├── assets/
│   ├── images/
│   │   └── nk_logo.png     # NK brand logo
│   └── icons/
└── README.md               # This file
```

---

## Development Status

### ✅ Phase 1: Complete
- [x] Project structure set up
- [x] Brand assets integrated
- [x] CSS foundation with NK design tokens
- [x] Landing page HTML structure
- [x] Landing page styling
- [x] Mobile navigation
- [x] Smooth scroll interactions

### 🚧 Phase 2: Next Steps
- [ ] Supabase project setup
- [ ] Auth pages (login, signup, password reset)
- [ ] Member dashboard
- [ ] Notion CMS integration
- [ ] Stripe payment integration
- [ ] PDF upload to Supabase Storage
- [ ] Content migration from Google Drive

---

## Pricing

**Free Tier:**
- 5 starter frameworks
- Sample from one toolkit
- Access to free resources

**CEO Lab Pro: $19/month or $190/year**
- Full library (50+ frameworks)
- All 4 comprehensive toolkits
- Meditation Lab
- Infographic library
- Monthly live implementation sessions
- New content added monthly

---

## Design System

Following NK brand guidelines:

**Colors:**
- Primary: #F7F3ED (off-white background)
- Text: #000000 (black)
- Accent: #7FABC8 (blue), #A6BEA4 (green)

**Typography:**
- Headings: Crimson Pro (serif)
- Body: DM Sans (sans-serif)

**Components:**
- BEM methodology for CSS
- Responsive breakpoints: 768px (tablet), 480px (mobile)
- Smooth transitions with cubic-bezier(0.4, 0, 0.2, 1)

---

## Launch Strategy

### Target Audience
3000 newsletter subscribers (warm audience for launch)

### Launch Goals
- Conservative: 30-60 paid subscribers (1-2% conversion)
- Optimistic: 90-150 paid subscribers (3-5% conversion)

### Launch Sequence
1. Publish landing page
2. Enable signups (free + paid tiers)
3. Announce to newsletter subscribers
4. Promote on LinkedIn
5. Optional: Founding member discount for first 100

---

## Local Development

1. Open `index.html` in a browser
2. For local server: `python -m http.server 8000` or use Live Server extension in VS Code
3. Test responsive design at 768px and 480px breakpoints

---

## Deployment

### Option 1: Vercel
```bash
vercel --prod
```

### Option 2: Netlify
```bash
netlify deploy --prod
```

---

## Next Immediate Tasks

1. **Create placeholder pages:**
   - login.html
   - signup.html
   - privacy.html
   - terms.html

2. **Set up Supabase:**
   - Create project
   - Configure database schema
   - Set up auth
   - Create storage bucket

3. **Stripe integration:**
   - Create products
   - Set up webhook
   - Build checkout flow

4. **Content migration:**
   - Download PDFs from Google Drive
   - Upload to Supabase Storage
   - Create Notion database
   - Populate with metadata

---

## Success Metrics

**Month 1:**
- 10 paid subscribers
- 100 PDF downloads
- <2% churn rate

**Month 3:**
- 50 paid subscribers
- Positive user feedback
- 1-2 new toolkits added
- 30%+ attendance at live sessions

---

## Contact

**Nikolas Konstantin**
- Email: nikolas@forchiefs.com
- Website: nikolaskonstantin.com
- LinkedIn: linkedin.com/in/nikolaskonstantin

---

Built with vanilla HTML/CSS/JS following NK brand guidelines.
