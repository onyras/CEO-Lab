# CEO Lab - Development Guide

## 🚀 Quick Start

### Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
app/
├── layout.tsx                    # Root layout
├── globals.css                   # Global styles
├── page.tsx                      # Landing page (/)
└── assessment/
    ├── page.tsx                  # Assessment form (/assessment)
    └── results/
        └── page.tsx              # Results page (/assessment/results)

lib/
├── supabase.ts                   # Supabase client
└── hook-questions.ts             # 12 hook questions data

types/
└── assessment.ts                 # TypeScript types

database/
├── README.md                     # Database setup guide
├── SETUP.md                      # Step-by-step instructions
├── SCHEMA.md                     # Complete schema documentation
└── migrations/
    ├── 001_initial_schema.sql    # Core tables
    ├── 002_weekly_checkins.sql   # Weekly tracking
    └── 003_phase2_features.sql   # Phase 2 (optional)
```

---

## ✨ What's Built (Hook Assessment MVP)

### 1. Landing Page (`/`)
- Hero section with value proposition
- CTA button to start assessment
- Clean, minimal design

### 2. Assessment Form (`/assessment`)
- 12 questions across 3 territories:
  - **Leading Yourself** (4 questions)
  - **Leading Teams** (4 questions)
  - **Leading Organizations** (4 questions)
- Navigation: Back/Next buttons
- Progress indicator
- Answer selection with visual feedback
- Saves to Supabase automatically

### 3. Results Page (`/assessment/results`)
- Score breakdown per territory
- Overall score and percentage
- Top strength identified
- Biggest blind spot identified
- CTA to sign up for full assessment (€100/month)

### 4. Database Integration
- Saves anonymous hook assessments to Supabase
- Stores individual question responses
- Ready for user authentication (Phase 2)

---

## 🗄️ Database Schema (Already Set Up)

### Tables Used by Hook Assessment:
- `hook_assessments` - Assessment records
- `hook_responses` - Individual question answers

### Tables Ready for Next Phase:
- `user_profiles` - User accounts
- `baseline_assessments` - Full 100-question assessment
- `baseline_responses` - Individual baseline answers
- `sub_dimension_scores` - 18 dimension scores
- `quarterly_focus` - User's weekly tracking focus
- `weekly_check_ins` - Weekly session records
- `weekly_responses` - Weekly answers
- `user_streaks` - Completion streak tracking

See `database/SCHEMA.md` for complete documentation.

---

## 🔐 Environment Variables

Already configured in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xatnfohmnmarllrmpjgt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...
```

**Important:** Never commit `.env.local` to git (already in `.gitignore`)

---

## 🧪 Testing the Hook Assessment

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Open browser:** http://localhost:3000

3. **Test flow:**
   - Click "Start Free Assessment"
   - Answer all 12 questions
   - Click "See Results"
   - Verify scores are calculated correctly
   - Check Supabase to confirm data was saved

4. **Verify in Supabase:**
   ```sql
   -- Check saved assessments
   SELECT * FROM hook_assessments ORDER BY created_at DESC LIMIT 5;

   -- Check individual responses
   SELECT * FROM hook_responses ORDER BY created_at DESC LIMIT 20;
   ```

---

## 📊 Hook Assessment Scoring

### Questions per Territory:
- Leading Yourself: Questions 1-4
- Leading Teams: Questions 5-8
- Leading Organizations: Questions 9-12

### Scoring:
- Each question: 1-4 points
- Max per territory: 16 points (4 questions × 4 points)
- Max total: 48 points (3 territories × 16 points)

### Calculations:
- **Top Strength:** Territory with highest score
- **Biggest Blind Spot:** Territory with lowest score
- **Overall %:** (Total score / 48) × 100

---

## 🎨 Styling

Using custom CSS in `app/globals.css`:
- Dark theme (#0a0a0a background)
- White text on dark
- Minimal, clean design
- Responsive (mobile-friendly)
- Focus on readability

**No Tailwind or component library yet** - vanilla CSS for speed.

---

## 🚧 Next Steps (Phase 2)

### Immediate:
- [ ] Add authentication (Supabase Auth)
- [ ] Build user dashboard
- [ ] Implement Stripe for €100/month subscriptions
- [ ] Build baseline assessment (100 questions, staged)

### Soon:
- [ ] Weekly check-ins (dashboard form)
- [ ] Quarterly focus selection
- [ ] Dashboard heatmap (18 dimensions)
- [ ] Weekly tracking charts

### Later:
- [ ] WhatsApp integration for weekly check-ins
- [ ] AI-generated reports (monthly/quarterly)
- [ ] Framework prescription system
- [ ] Shareable snapshots ("Spotify Wrapped")

See `PRODUCT_STRATEGY.md` for full roadmap.

---

## 📝 Available Scripts

```bash
npm run dev      # Start development server (port 3000)
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint (when configured)
```

---

## 🐛 Troubleshooting

### "Module not found" errors
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Supabase connection errors
- Check `.env.local` has correct values
- Verify Supabase project is running
- Check browser console for specific errors

### Port 3000 already in use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev -- -p 3001
```

### TypeScript errors
```bash
# Regenerate Next.js types
rm -rf .next
npm run dev
```

---

## 📚 Documentation

- `README.md` - Project overview
- `PRODUCT_STRATEGY.md` - Full product strategy and roadmap
- `database/SETUP.md` - Database setup instructions
- `database/SCHEMA.md` - Complete database schema
- `DEVELOPMENT.md` - This file (development guide)

---

## 🎯 Success Metrics

### For Hook Assessment:
- **Completion rate:** % of users who finish all 12 questions
- **Time to complete:** Target ~5 minutes
- **Conversion rate:** % who click "Get Your Full Profile"
- **Data quality:** All assessments saving to Supabase correctly

### Target (MVP):
- 80%+ completion rate
- 10-15% conversion to paid signup interest
- <5 minutes average completion time

---

**Status:** Hook Assessment MVP Complete ✅

**Next:** Test in browser, then build authentication + dashboard.
