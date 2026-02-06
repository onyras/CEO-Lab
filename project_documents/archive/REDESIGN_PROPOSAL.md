# CEO Lab Redesign: Coaching-Focused Subscription Platform

## Current vs. Proposed

### Current Concept
- 50+ framework library (static PDFs)
- 4 comprehensive toolkits
- Meditation lab
- Monthly implementation sessions
- $19/month or $190/year

### Proposed Concept
- **One core coaching assessment** (repeated monthly)
- **Monthly progress reports** (automated)
- **Weekly insights & updates** (drip content)
- **Tools library for coaches** (interactive apps)
- Focus on continuous improvement tracking

---

## Information Architecture Changes

### BEFORE (Static Library Model)
```
Landing Page
  ├─ Features (50+ frameworks)
  ├─ Pricing (Free vs. Pro)
  └─ Library Preview

Dashboard
  ├─ Browse All Frameworks (50+)
  ├─ Browse Toolkits (4)
  ├─ Meditation Lab
  └─ Upcoming Sessions
```

### AFTER (Assessment-Driven Model)
```
Landing Page
  ├─ How It Works (Take Assessment → Weekly Updates → Monthly Reports)
  ├─ Live Preview (Dashboard demo)
  ├─ Pricing (3 tiers)
  └─ Start Free Trial

Member Dashboard
  ├─ Overview
  │   ├─ Your Progress Chart (monthly trends)
  │   ├─ Next Assessment: [Date]
  │   ├─ Latest Report: [Link]
  │   └─ This Week's Insight: [Preview]
  │
  ├─ Assessment Center
  │   ├─ Take Monthly Assessment (CTA)
  │   ├─ Assessment History (timeline)
  │   └─ Score Trends (chart)
  │
  ├─ Reports
  │   ├─ Latest Report (featured)
  │   ├─ Report Archive (by month)
  │   └─ Download All Data
  │
  ├─ Weekly Updates
  │   ├─ This Week's Content (featured)
  │   ├─ Update Archive (chronological feed)
  │   └─ Mark as Read
  │
  ├─ Tools Library
  │   ├─ Search & Filter
  │   ├─ Categories (Strategy, Communication, Team, etc.)
  │   ├─ Recently Used
  │   └─ Favorites
  │
  └─ Community (optional)
      ├─ Discussion Forum
      ├─ Member Directory
      └─ Upcoming Events
```

---

## Page-by-Page Breakdown

### 1. Landing Page (index.html)

**New Hero Section:**
```
[Hero]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Your Leadership Growth,
  Measured & Accelerated

  One monthly assessment.
  Weekly insights.
  Continuous improvement tracking.

  [Start Free Trial - 14 Days] [See How It Works ↓]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**How It Works (3 Steps):**
```
┌─────────────────────────────────────────────┐
│ 1. Take Your Monthly Assessment             │
│    15-minute leadership evaluation          │
│    [Screenshot: Assessment interface]       │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ 2. Get Weekly Insights                      │
│    Bite-sized content delivered every Monday│
│    [Screenshot: Weekly update card]         │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ 3. Review Your Monthly Report               │
│    See your progress, trends, and next steps│
│    [Screenshot: Report dashboard]           │
└─────────────────────────────────────────────┘
```

**Live Dashboard Demo:**
- Embedded interactive preview (read-only demo account)
- "Try the demo →" CTA
- Shows real data flow

**Pricing (3 Tiers):**
```
┌─────────────┬─────────────┬─────────────┐
│   FREE      │    PRO      │  PREMIUM    │
├─────────────┼─────────────┼─────────────┤
│ $0          │ $19/mo      │ $49/mo      │
│             │ $190/yr     │ $470/yr     │
├─────────────┼─────────────┼─────────────┤
│ • Sample    │ • Monthly   │ • Everything│
│   assessment│   assessment│   in Pro    │
│ • 3 weekly  │ • Full      │ • Priority  │
│   insights  │   reports   │   support   │
│ • 5 tools   │ • Weekly    │ • 1:1 review│
│             │   insights  │   call/month│
│             │ • Full tools│ • Custom    │
│             │   library   │   reports   │
│             │ • Community │ • API access│
└─────────────┴─────────────┴─────────────┘
```

**Social Proof:**
- "Join 500+ CEOs tracking their growth"
- Testimonials with progress charts
- Logo bar of companies

---

### 2. Dashboard (dashboard.html)

**Overview Section:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Welcome back, Nikolas

  [Progress Chart: Last 6 Months]
  ┌─────────────────────────────────────────┐
  │ Leadership Score                        │
  │                                     ╱   │
  │                                 ╱       │
  │                         ╱               │
  │                 ╱                       │
  │         ╱                               │
  │ Oct  Nov  Dec  Jan  Feb  Mar           │
  │ 7.2  7.4  7.8  8.1  8.3  8.6           │
  └─────────────────────────────────────────┘

  ↗ +19% improvement since October
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Quick Actions Grid]
┌──────────────────────┬──────────────────────┐
│ 📋 Next Assessment   │ 📊 Latest Report     │
│ Due: Feb 1, 2026     │ January 2026         │
│ [Take Now →]         │ [View Report →]      │
└──────────────────────┴──────────────────────┘

┌──────────────────────┬──────────────────────┐
│ 💡 This Week         │ 🔧 Tools             │
│ Managing Energy in   │ 12 tools available   │
│ High-Stakes Meetings │ [Browse →]           │
│ [Read Update →]      │                      │
└──────────────────────┴──────────────────────┘
```

**Notification Center:**
```
🔔 Notifications
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Your January report is ready to view
• New weekly update: "The 3 Types of Delegation"
• Assessment due in 5 days
• 3 new tools added to library
```

---

### 3. Assessment Center

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Monthly Leadership Assessment

  Next assessment due: February 1, 2026

  [Take Assessment Now] (15 minutes)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Assessment History]
┌────────────────────────────────────────────┐
│ January 2026         Score: 8.6 ↗          │
│ December 2025        Score: 8.3 ↗          │
│ November 2025        Score: 8.1 →          │
│ October 2025         Score: 7.8 ↗          │
└────────────────────────────────────────────┘

[Trends Over Time]
Three pillars tracked:
• Leading Yourself: 8.9 ↗
• Leading Teams: 8.5 ↗
• Leading Organizations: 8.4 →
```

**During Assessment:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Leadership Assessment - February 2026

  Progress: ████████░░░░░░░░ 12 of 20 questions

  Question 12:
  How often do you block dedicated time for
  strategic thinking without interruptions?

  ○ Rarely or never
  ○ Once a month
  ○ Once a week
  ● Multiple times per week
  ○ Daily

  [← Previous]              [Next →]

  [Save & Exit]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### 4. Monthly Report View

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  January 2026 Leadership Report
  Generated: January 31, 2026

  [Download PDF] [Share] [Print]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Executive Summary]
┌────────────────────────────────────────────┐
│ Overall Leadership Score: 8.6 / 10         │
│ Change from last month: +0.3 (↗ 3.6%)     │
│                                            │
│ Top Strength: Team Communication           │
│ Growth Opportunity: Strategic Planning     │
└────────────────────────────────────────────┘

[Three Pillars Breakdown]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Leading Yourself: 8.9 / 10 (↗ +0.4)
   ✓ Energy management improved
   ✓ Focus routines consistent
   ⚠ Strategic thinking time decreased

2. Leading Teams: 8.5 / 10 (↗ +0.2)
   ✓ 1:1 quality improved
   ✓ Feedback frequency increased
   ⚠ Delegation could improve

3. Leading Organizations: 8.4 / 10 (→ 0.0)
   → Culture initiatives maintained
   ⚠ Long-term planning needs attention
   ⚠ Stakeholder communication gaps

[Recommended Focus Areas]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Based on your scores, focus on:

1. Block 2 hours/week for strategic planning
   → Tool: Strategic Thinking Framework

2. Improve delegation practices
   → Tool: Delegation Decision Matrix

3. Establish stakeholder communication rhythm
   → Tool: Stakeholder Mapping Template

[Progress Chart: 6-Month View]
[Comparison to peer benchmarks]
[Next month's focus recommendations]
```

---

### 5. Weekly Updates Feed

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Weekly Leadership Insights

  New content delivered every Monday at 8 AM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[This Week - January 27, 2026]
┌────────────────────────────────────────────┐
│ 💡 The Energy Audit: Finding Your Peak    │
│    Performance Windows                     │
│                                            │
│    Most CEOs schedule back-to-back meetings│
│    without considering their natural energy│
│    patterns. Here's how to...             │
│                                            │
│    ⏱ 5 min read | [Read More →]          │
└────────────────────────────────────────────┘

[Previous Updates]
┌────────────────────────────────────────────┐
│ ✓ Jan 20: Three Types of Delegation       │
│ ✓ Jan 13: Running Effective Board Meetings│
│ ✓ Jan 6: Q1 Planning Framework            │
│   [View All Updates →]                     │
└────────────────────────────────────────────┘
```

---

### 6. Tools Library

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Tools & Frameworks

  [Search tools...]               [Filter ▼]

  Recently Used | Favorites | All Tools
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Categories]
┌──────────────┬──────────────┬──────────────┐
│ 📊 Strategy  │ 💬 Communic. │ 👥 Team      │
│ 12 tools     │ 8 tools      │ 15 tools     │
└──────────────┴──────────────┴──────────────┘
┌──────────────┬──────────────┬──────────────┐
│ 🎯 Focus     │ 🤝 Negotiat. │ 📈 Scaling   │
│ 6 tools      │ 5 tools      │ 9 tools      │
└──────────────┴──────────────┴──────────────┘

[Featured Tools]
┌────────────────────────────────────────────┐
│ ⭐ Decision-Making Matrix                  │
│    Interactive tool for complex decisions  │
│    🔧 Launch Tool →                        │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│ 📋 1:1 Meeting Template                    │
│    Structure high-impact conversations     │
│    📄 Download PDF →                       │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│ 🎯 OKR Planning Worksheet                  │
│    Quarterly goal-setting framework        │
│    📄 Download PDF | 🔧 Interactive →      │
└────────────────────────────────────────────┘
```

---

### 7. Account Settings

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Account Settings
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Subscription]
┌────────────────────────────────────────────┐
│ Current Plan: Pro ($19/month)              │
│ Next billing: February 1, 2026             │
│                                            │
│ [Upgrade to Premium] [Cancel Subscription] │
└────────────────────────────────────────────┘

[Notifications]
┌────────────────────────────────────────────┐
│ ☑ Assessment reminders (3 days before)    │
│ ☑ Weekly update notifications (Monday 8AM)│
│ ☑ Monthly report ready                    │
│ ☐ Community activity                      │
│ ☑ New tools added                         │
└────────────────────────────────────────────┘

[Data & Privacy]
┌────────────────────────────────────────────┐
│ [Download All Data]                        │
│ [Export Assessment History]               │
│ [Delete Account]                           │
└────────────────────────────────────────────┘
```

---

## Mobile Experience

### Key Mobile Screens:

**Dashboard (Mobile):**
```
┌─────────────────────┐
│ ☰  CEO Lab      🔔 │
├─────────────────────┤
│ Welcome back,       │
│ Nikolas            │
│                    │
│ ┌─────────────────┐│
│ │ Your Progress   ││
│ │    [Chart]      ││
│ │                 ││
│ │ 8.6 ↗ +0.3     ││
│ └─────────────────┘│
│                    │
│ Next Assessment    │
│ ┌─────────────────┐│
│ │ Due: Feb 1      ││
│ │ [Take Now →]    ││
│ └─────────────────┘│
│                    │
│ This Week          │
│ ┌─────────────────┐│
│ │ 💡 Energy Audit ││
│ │ [Read (5min) →] ││
│ └─────────────────┘│
│                    │
│ Latest Report      │
│ ┌─────────────────┐│
│ │ January 2026    ││
│ │ [View →]        ││
│ └─────────────────┘│
│                    │
└─────────────────────┘
```

---

## New File Structure

```
09_ceo_lab/
├── index.html                    # Landing (redesigned)
├── dashboard.html                # Member dashboard (redesigned)
├── assessment.html               # NEW: Assessment interface
├── assessment-results.html       # NEW: Post-assessment
├── reports.html                  # NEW: Monthly reports
├── report-view.html             # NEW: Individual report
├── updates.html                  # NEW: Weekly updates feed
├── update-view.html             # NEW: Individual update
├── tools.html                    # Tools library (redesigned)
├── tool-view.html               # NEW: Individual tool page
├── login.html                    # Login (existing)
├── signup.html                   # NEW: Signup flow
├── account.html                  # NEW: Account settings
├── profile.html                  # Profile (existing)
│
├── styles/
│   ├── main.css                 # Global styles
│   ├── dashboard.css            # Dashboard-specific
│   ├── assessment.css           # Assessment interface
│   ├── reports.css              # Report styling
│   └── mobile.css               # Mobile overrides
│
├── js/
│   ├── auth.js                  # Authentication
│   ├── dashboard.js             # Dashboard logic
│   ├── assessment.js            # NEW: Assessment flow
│   ├── reports.js               # NEW: Report generation
│   ├── charts.js                # NEW: Chart visualization
│   ├── tools.js                 # Tools library
│   └── notifications.js         # NEW: Notification system
│
├── assets/
│   ├── images/
│   ├── icons/
│   └── sample-data/             # NEW: Demo data
│       ├── sample-report.json
│       └── sample-assessment.json
│
└── README.md
```

---

## Key Implementation Changes

### 1. Data Architecture

**New Database Schema:**
```
Users
  ├── id
  ├── email
  ├── subscription_tier (free, pro, premium)
  ├── subscription_status
  └── created_at

Assessments
  ├── id
  ├── user_id
  ├── month
  ├── year
  ├── score_overall
  ├── score_self
  ├── score_teams
  ├── score_org
  ├── responses (JSON)
  └── completed_at

Reports
  ├── id
  ├── user_id
  ├── assessment_id
  ├── generated_at
  ├── content (JSON)
  └── pdf_url

Weekly_Updates
  ├── id
  ├── title
  ├── content
  ├── publish_date
  └── category

User_Progress
  ├── user_id
  ├── read_updates (array)
  ├── used_tools (array)
  └── last_login

Tools
  ├── id
  ├── title
  ├── category
  ├── type (pdf, interactive, template)
  ├── file_url
  └── description
```

### 2. Automated Workflows

**Monthly Assessment Reminder:**
- Email 3 days before due date
- In-app notification
- SMS (Premium tier only)

**Weekly Update Delivery:**
- Every Monday 8 AM user timezone
- Email notification
- In-app badge

**Monthly Report Generation:**
- Auto-generates 24 hours after assessment
- Email with PDF attachment
- In-app notification

### 3. Interactive Components

**Assessment Interface:**
- Progress bar
- Save & resume
- Visual scale (1-10)
- Optional comments per question

**Report Charts:**
- Chart.js for visualizations
- 6-month trend line
- Pillar breakdown (radar chart)
- Month-over-month comparison

**Tools:**
- PDF viewer in-browser
- Interactive calculators
- Downloadable templates
- Favorites system

---

## Migration Path from Current CEO Lab

### Option A: Pivot Completely
Replace framework library with assessment-focused model

### Option B: Hybrid Model
Keep framework library + add assessment feature
- Assessment becomes new core feature
- Frameworks become "supplementary resources"
- Tools library = existing toolkits + new interactive tools

### Option C: Two Products
- **CEO Lab** = Framework library (current)
- **CEO Tracker** = Assessment platform (new product)

---

## Next Steps to Implement

1. **Validate concept with target users**
   - Survey existing newsletter subscribers
   - Run prototype test with 5-10 CEOs

2. **Build assessment questionnaire**
   - Design 20-question assessment
   - Validate scoring methodology
   - Test with pilot group

3. **Design report template**
   - Create report structure
   - Build scoring algorithm
   - Design visual components

4. **Develop interactive dashboard**
   - Build React/Vue components
   - Integrate Chart.js
   - Connect to Supabase

5. **Set up automation**
   - Email notification system
   - Report generation pipeline
   - Weekly content scheduling

6. **Create 12 weeks of content**
   - Write 12 weekly updates
   - Build initial tools library (10-15 tools)
   - Prepare sample reports

---

Would you like me to start building any of these pages?
