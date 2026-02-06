# CEO Lab

A premium accountability platform for founders and CEOs, built on the Konstantin Method (60+ leadership frameworks). Measures 15 core leadership dimensions through assessments, tracks behavioral change via weekly check-ins, and delivers AI-generated insights through a progress dashboard.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Database:** Supabase (Postgres + Auth + RLS)
- **Payments:** Stripe
- **Styling:** Tailwind CSS + ShadCN/ui
- **Deployment:** Vercel
- **Messaging:** WhatsApp Business API

## Getting Started

```bash
npm install
npm run dev
```

Runs on `http://localhost:3000`. Requires `.env.local` with Supabase and Stripe keys.

## Folder Structure

```
09_ceo_lab/
├── app/                  Next.js routes (assessment, dashboard, auth, API)
├── components/           React components (ui/, blocks/, visualizations/, insights/)
├── lib/                  Business logic & utilities
├── types/                TypeScript definitions
├── public/               Static assets
├── database/migrations/  SQL migrations
├── supabase/             Supabase config
├── email-templates/      Auth email HTML templates
├── whatsapp_flows/       WhatsApp integration module
├── project_documents/    All docs (strategy, specs, design, features)
└── tests/                Design explorations & prototypes
```

## Documentation

All project documentation lives in `project_documents/`. Start with the index:

```
project_documents/README.md
```

Key docs: `PRODUCT_STRATEGY.md` (vision), `ROADMAP.md` (status), `DECISIONS_LOG.md` (history).

## AI Rules

See `CLAUDE.md` for project-specific rules when working with AI assistants.
