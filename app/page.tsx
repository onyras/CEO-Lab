export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--nk-off-white)' }}>
      {/* Header */}
      <header className="border-b" style={{ borderColor: 'rgba(0,0,0,0.1)' }}>
        <div className="container" style={{ padding: '24px' }}>
          <div className="flex justify-between items-center">
            <h1 className="font-serif text-3xl font-semibold" style={{ color: 'var(--nk-black)' }}>
              CEO Lab
            </h1>
            <a
              href="/auth"
              className="px-6 py-3 rounded-lg font-medium transition-all"
              style={{
                background: 'var(--nk-black)',
                color: 'white',
              }}
            >
              Sign In
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="section section--large">
        <div className="container text-center">
          <p className="section__title">&gt; ceo-lab --start</p>
          <h2 className="section__subtitle">
            The Only Mirror <em>Built for CEOs</em>
          </h2>
          <p className="section__description mx-auto mb-12">
            In times of extreme change, you don't know if you're actually getting better as a leader.
            Without measurement, anxiety drives every decision.
          </p>
          <a
            href="/assessment/hook"
            className="inline-block px-8 py-4 rounded-lg text-lg font-medium transition-all"
            style={{
              background: 'var(--nk-black)',
              color: 'white',
            }}
          >
            Take Free Assessment
          </a>
          <p style={{ marginTop: '16px', fontSize: '14px', color: 'var(--nk-text-muted)' }}>
            12 questions · 5 minutes · Get your leadership snapshot instantly
          </p>
        </div>
      </section>

      {/* Problem Cards */}
      <section className="section" style={{ background: 'white' }}>
        <div className="container">
          <p className="section__title text-center">&gt; ceo-lab --diagnose</p>
          <h3 className="section__subtitle text-center mb-16">
            Is This <em>You?</em>
          </h3>

          <div className="assessment-grid">
            <div className="assessment-card assessment-card--blue">
              <div className="assessment-card__content">
                <h4 className="assessment-card__title">You Don't Know Where You Stand</h4>
                <p className="assessment-card__desc">
                  You're shipping, you're busy, but have no objective measurement of your growth.
                  Success doesn't equal competence validation.
                </p>
              </div>
            </div>

            <div className="assessment-card assessment-card--orange">
              <div className="assessment-card__content">
                <h4 className="assessment-card__title">Everything Feels Urgent</h4>
                <p className="assessment-card__desc">
                  No clear priorities for self-development. Analysis paralysis.
                  You see AI tools and wonder: "Am I falling behind?"
                </p>
              </div>
            </div>

            <div className="assessment-card assessment-card--purple">
              <div className="assessment-card__content">
                <h4 className="assessment-card__title">Anxiety Drives Decisions</h4>
                <p className="assessment-card__desc">
                  Without frameworks to structure reality, you're comparing yourself to other founders.
                  Feeling like everyone's moving faster.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="section" style={{ background: 'var(--nk-off-white)' }}>
        <div className="container">
          <p className="section__title text-center">&gt; ceo-lab --edge</p>
          <h3 className="section__subtitle text-center mb-8">
            The Only Reliable Edge is <em>Continuous Adaptation</em>
          </h3>
          <p className="section__description mx-auto text-center mb-16">
            Not your product. Not your network. Not what you know today. Your ability to adapt.
            But you can't adapt if you don't have measurement.
          </p>

          <div className="grid md:grid-cols-3 gap-12 max-w-4xl mx-auto text-center">
            <div>
              <div className="font-serif text-6xl font-semibold mb-3" style={{ color: 'var(--nk-blue)' }}>
                100
              </div>
              <div style={{ fontSize: '16px', color: 'var(--nk-text-muted)' }}>
                Question Assessment
              </div>
            </div>
            <div>
              <div className="font-serif text-6xl font-semibold mb-3" style={{ color: 'var(--nk-green)' }}>
                18
              </div>
              <div style={{ fontSize: '16px', color: 'var(--nk-text-muted)' }}>
                Leadership Dimensions
              </div>
            </div>
            <div>
              <div className="font-serif text-6xl font-semibold mb-3" style={{ color: 'var(--nk-orange)' }}>
                Weekly
              </div>
              <div style={{ fontSize: '16px', color: 'var(--nk-text-muted)' }}>
                Progress Tracking
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section" style={{ background: 'white' }}>
        <div className="container">
          <p className="section__title text-center">&gt; ceo-lab --workflow</p>
          <h3 className="section__subtitle text-center mb-16">
            How It <em>Works</em>
          </h3>

          <div className="assessment-grid">
            <div className="assessment-card assessment-card--blue">
              <div className="assessment-card__content">
                <h4 className="assessment-card__title">1. Take the Assessment</h4>
                <p className="assessment-card__desc">
                  Complete our comprehensive baseline covering Leading Yourself, Teams, and Organizations.
                  Staged delivery makes it manageable.
                </p>
                <span className="assessment-card__time">30-40 min</span>
              </div>
            </div>

            <div className="assessment-card assessment-card--green">
              <div className="assessment-card__content">
                <h4 className="assessment-card__title">2. See Your Profile</h4>
                <p className="assessment-card__desc">
                  Get a visual heatmap of your 18 leadership dimensions.
                  Identify strengths and blind spots across all three territories.
                </p>
                <span className="assessment-card__time">Instant results</span>
              </div>
            </div>

            <div className="assessment-card assessment-card--orange">
              <div className="assessment-card__content">
                <h4 className="assessment-card__title">3. Track Progress</h4>
                <p className="assessment-card__desc">
                  Choose 3 focus areas per quarter. Complete weekly check-ins.
                  Watch your scores improve. Get frameworks prescribed based on gaps.
                </p>
                <span className="assessment-card__time">3 min/week</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Unique Value */}
      <section className="section" style={{ background: 'var(--nk-off-white)' }}>
        <div className="container container--narrow">
          <p className="section__title text-center">&gt; ceo-lab --method</p>
          <h3 className="section__subtitle text-center mb-8">
            Hard Measurement Meets <em>Spiritual Depth</em>
          </h3>
          <p className="section__description mx-auto text-center mb-12">
            CEO Lab bridges objective business metrics with nervous system awareness.
            Structure and stillness. Masculine accountability and feminine presence.
          </p>
          <div className="text-center">
            <p style={{ fontSize: '16px', color: 'var(--nk-text-muted)', fontStyle: 'italic' }}>
              Built on the Konstantin Method – 60+ battle-tested frameworks for leadership development
            </p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="section" style={{ background: 'white' }}>
        <div className="container text-center">
          <p className="section__title">&gt; ceo-lab --invest</p>
          <h3 className="section__subtitle mb-6">
            Premium <em>Accountability</em>
          </h3>
          <div className="font-serif text-7xl font-semibold mb-6" style={{ color: 'var(--nk-blue)' }}>
            €100/month
          </div>
          <p className="section__description mx-auto mb-12">
            Comprehensive assessment, weekly tracking, progress dashboard,
            and prescribed frameworks. For founders serious about their edge.
          </p>
          <a
            href="/assessment/hook"
            className="inline-block px-8 py-4 rounded-lg text-lg font-medium transition-all"
            style={{
              background: 'var(--nk-black)',
              color: 'white',
            }}
          >
            Start With Free Assessment
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12" style={{ borderColor: 'rgba(0,0,0,0.1)' }}>
        <div className="container text-center" style={{ color: 'var(--nk-text-muted)' }}>
          <p className="mb-4">© 2026 CEO Lab · Built on the Konstantin Method</p>
          <div className="flex justify-center gap-8 text-sm">
            <a href="/privacy" className="hover:underline">Privacy Policy</a>
            <a href="/terms" className="hover:underline">Terms of Service</a>
            <a href="/refund" className="hover:underline">Refund Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
