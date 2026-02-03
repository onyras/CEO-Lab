import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--nk-off-white)' }}>
      {/* Header */}
      <header className="border-b" style={{ borderColor: 'rgba(0,0,0,0.1)', background: 'white' }}>
        <div className="container" style={{ padding: '24px' }}>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="text-xl font-bold">nk</span>
              <span className="text-xl font-bold">CEO Lab</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/auth" className="text-black/70 hover:text-black transition-colors px-4 py-2">
                Sign In
              </Link>
              <Link href="/assessment/hook" className="px-6 py-3 rounded-lg font-medium transition-colors" style={{ background: 'var(--nk-black)', color: 'white' }}>
                Start Free Assessment
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="section section--large">
        <div className="container text-center">
          <p className="section__title">&gt; ceo-lab --measure</p>
          <h1 className="section__subtitle" style={{ fontSize: '64px', maxWidth: '900px', margin: '0 auto 24px' }}>
            Are You Getting <em>Better</em> as a Leader?
          </h1>
          <p className="section__description mx-auto mb-12">
            Most CEOs don't know. CEO Lab measures your leadership across 18 dimensions so you can lead with data, not anxiety.
          </p>
          <Link href="/assessment/hook" className="inline-block px-8 py-4 rounded-lg text-lg font-medium transition-colors" style={{ background: 'var(--nk-black)', color: 'white' }}>
            Take Free Leadership Snapshot
          </Link>
          <p style={{ marginTop: '16px', fontSize: '14px', color: 'var(--nk-text-muted)' }}>
            5 minutes · See what matters most in your leadership
          </p>
        </div>
      </section>

      {/* Problem Section */}
      <section className="section" style={{ background: 'white' }}>
        <div className="container container--narrow">
          <p className="section__title text-center">&gt; ceo-lab --reality</p>
          <h2 className="section__subtitle text-center mb-16">
            Athletes Have <em>Post-Game Analysis</em>
          </h2>

          <div className="assessment-grid">
            <div className="assessment-card assessment-card--blue">
              <div className="assessment-card__content">
                <h3 className="assessment-card__title">CEOs Guess</h3>
                <p className="assessment-card__desc">
                  You read books. Listen to podcasts. But you have no scoreboard for your leadership growth.
                </p>
              </div>
            </div>

            <div className="assessment-card assessment-card--orange">
              <div className="assessment-card__content">
                <h3 className="assessment-card__title">Anxiety Fills the Gap</h3>
                <p className="assessment-card__desc">
                  Without measurement, every win feels like luck. Every challenge feels like proof you're not cut out for this.
                </p>
              </div>
            </div>

            <div className="assessment-card assessment-card--purple">
              <div className="assessment-card__content">
                <h3 className="assessment-card__title">Guessing Isn't Enough</h3>
                <p className="assessment-card__desc">
                  In 2026, with AI disrupting every industry, you need data on your own development.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="section">
        <div className="container">
          <p className="section__title text-center">&gt; ceo-lab --scoreboard</p>
          <h2 className="section__subtitle text-center mb-16">
            Your Leadership <em>Scoreboard</em>
          </h2>

          <div className="assessment-grid">
            <div className="assessment-card assessment-card--blue">
              <div className="assessment-card__content">
                <h3 className="assessment-card__title">Baseline Assessment</h3>
                <p className="assessment-card__desc">
                  100 questions measuring 18 leadership dimensions. Where you are right now, honestly.
                </p>
                <span className="assessment-card__time">30-40 min</span>
              </div>
            </div>

            <div className="assessment-card assessment-card--green">
              <div className="assessment-card__content">
                <h3 className="assessment-card__title">Weekly Tracking</h3>
                <p className="assessment-card__desc">
                  Three questions via WhatsApp. Tracks real behavioral change over time.
                </p>
                <span className="assessment-card__time">2 min/week</span>
              </div>
            </div>

            <div className="assessment-card assessment-card--orange">
              <div className="assessment-card__content">
                <h3 className="assessment-card__title">Your Dashboard</h3>
                <p className="assessment-card__desc">
                  Visual progress across all dimensions. See your growth. Know what's working.
                </p>
                <span className="assessment-card__time">Real-time</span>
              </div>
            </div>

            <div className="assessment-card assessment-card--yellow">
              <div className="assessment-card__content">
                <h3 className="assessment-card__title">Prescribed Frameworks</h3>
                <p className="assessment-card__desc">
                  Based on your scores, we tell you exactly which frameworks to focus on.
                </p>
                <span className="assessment-card__time">Personalized</span>
              </div>
            </div>

            <div className="assessment-card assessment-card--purple">
              <div className="assessment-card__content">
                <h3 className="assessment-card__title">AI-Generated Insights</h3>
                <p className="assessment-card__desc">
                  Monthly, quarterly, and annual reports showing patterns and breakthroughs.
                </p>
                <span className="assessment-card__time">Automated</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Method Section */}
      <section className="section" style={{ background: 'white' }}>
        <div className="container container--narrow text-center">
          <p className="section__title">&gt; ceo-lab --method</p>
          <h2 className="section__subtitle">
            Built on the <em>Konstantin Method</em>
          </h2>
          <p className="section__description mx-auto">
            60+ frameworks synthesized from 15 years of work with Series A-C founders.
          </p>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="section">
        <div className="container text-center">
          <p className="section__title">&gt; ceo-lab --invest</p>
          <h2 className="section__subtitle mb-6">
            Premium <em>Accountability</em>
          </h2>
          <div className="font-serif text-7xl font-semibold mb-6" style={{ color: 'var(--nk-blue)' }}>
            €100/month
          </div>
          <p className="section__description mx-auto mb-12">
            Comprehensive assessment, weekly tracking, progress dashboard, and prescribed frameworks.
          </p>
          <Link href="/assessment/hook" className="inline-block px-8 py-4 rounded-lg text-lg font-medium transition-colors" style={{ background: 'var(--nk-black)', color: 'white' }}>
            Start With Free Assessment
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12" style={{ borderColor: 'rgba(0,0,0,0.1)' }}>
        <div className="container text-center" style={{ color: 'var(--nk-text-muted)' }}>
          <p className="mb-4">© 2026 CEO Lab · Built on the Konstantin Method</p>
          <div className="flex justify-center gap-8 text-sm">
            <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
            <Link href="/terms" className="hover:underline">Terms of Service</Link>
            <Link href="/refund" className="hover:underline">Refund Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
