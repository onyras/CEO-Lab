import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: 'white' }}>
      {/* Header */}
      <header className="border-b" style={{ borderColor: 'var(--ceo-gray-light)', background: 'white' }}>
        <div className="container" style={{ padding: '24px' }}>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="text-xl font-bold" style={{ color: 'var(--ceo-navy)' }}>nk</span>
              <span className="text-xl font-bold" style={{ color: 'var(--ceo-navy)' }}>CEO Lab</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/auth" className="text-sm transition-colors px-4 py-2" style={{ color: 'var(--ceo-gray)' }}>
                Sign In
              </Link>
              <Link href="/assessment/hook" className="btn-primary">
                Start Free Assessment
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* SECTION 1: HERO - White Background */}
      <section className="section section--large">
        <div className="container text-center">
          <h1 className="section__subtitle" style={{ fontSize: '64px', maxWidth: '900px', margin: '0 auto 24px' }}>
            Are you getting <em>better</em> as a leader?
          </h1>
          <p className="section__description mx-auto mb-12">
            Most CEOs don't know. CEO Lab measures your leadership across 18 dimensions so you can lead with data, not anxiety.
          </p>
          <Link href="/assessment/hook" className="btn-primary" style={{ fontSize: '18px', padding: '18px 36px' }}>
            Take the Free Leadership Snapshot
          </Link>
          <p style={{ marginTop: '16px', fontSize: '14px', color: 'var(--ceo-gray)' }}>
            5 minutes. See what matters most in your leadership.
          </p>
        </div>
      </section>

      {/* SECTION 2: THE PROBLEM - Off-white Background */}
      <section className="section section--off-white">
        <div className="container container--narrow">
          <p className="section__title text-center">ATHLETES HAVE POST-GAME ANALYSIS</p>
          <h2 className="section__subtitle text-center mb-16">
            What Do <em>CEOs</em> Have?
          </h2>

          <div className="prose">
            <p>Professional athletes review game footage. They track performance metrics. They know exactly where they're improving and where they're stuck.</p>

            <p>You're running a company. Leading a team. Making decisions that affect people's lives and livelihoods. But when was the last time you objectively measured your own leadership?</p>

            <p>Most CEOs operate without a scoreboard. You read books. Listen to podcasts. Maybe work with a coach. But you have no systematic way to know if you're actually getting better.</p>

            <p>Without measurement, anxiety fills the gap. Every win feels like luck. Every challenge feels like proof you're not cut out for this. And the question that wakes you up at 3am: "Am I really the right person to lead this?"</p>

            <p>You can't improve what you don't measure. And in 2026, with AI disrupting every industry and the pace of change accelerating, guessing isn't good enough anymore.</p>
          </div>

          <blockquote className="pull-quote">
            You can't improve what you don't measure. And guessing isn't good enough anymore.
          </blockquote>
        </div>
      </section>

      {/* SECTION 3: THE SOLUTION - White Background */}
      <section className="section">
        <div className="container">
          <p className="section__title text-center">INTRODUCING CEO LAB</p>
          <h2 className="section__subtitle text-center mb-8">
            Your Leadership <em>Scoreboard</em>
          </h2>
          <p className="section__description mx-auto text-center mb-12">
            CEO Lab is a leadership measurement platform built on the Konstantin Method—60+ frameworks synthesized from 15 years of work with Series A-C founders.
          </p>

          <div className="assessment-grid">
            <div className="assessment-card">
              <div className="assessment-card__content">
                <h3 className="assessment-card__title">Baseline Assessment</h3>
                <p className="assessment-card__desc">
                  100 questions measuring 18 leadership dimensions. Where you are right now, honestly.
                </p>
                <span className="assessment-card__time">30-40 min</span>
              </div>
            </div>

            <div className="assessment-card">
              <div className="assessment-card__content">
                <h3 className="assessment-card__title">Weekly Tracking</h3>
                <p className="assessment-card__desc">
                  Three questions via WhatsApp. Two minutes. Tracks real behavioral change over time.
                </p>
                <span className="assessment-card__time">2 min/week</span>
              </div>
            </div>

            <div className="assessment-card">
              <div className="assessment-card__content">
                <h3 className="assessment-card__title">Your Dashboard</h3>
                <p className="assessment-card__desc">
                  Visual progress across all dimensions. See your growth. Know what's working.
                </p>
                <span className="assessment-card__time">Real-time</span>
              </div>
            </div>

            <div className="assessment-card">
              <div className="assessment-card__content">
                <h3 className="assessment-card__title">Prescribed Frameworks</h3>
                <p className="assessment-card__desc">
                  Based on your scores, we tell you exactly which frameworks to focus on. No guessing. No overwhelm.
                </p>
                <span className="assessment-card__time">Personalized</span>
              </div>
            </div>

            <div className="assessment-card">
              <div className="assessment-card__content">
                <h3 className="assessment-card__title">AI-Generated Insights</h3>
                <p className="assessment-card__desc">
                  Monthly, quarterly, and annual reports showing patterns, breakthroughs, and what to work on next.
                </p>
                <span className="assessment-card__time">Automated</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: THE 18 DIMENSIONS - Off-white Background */}
      <section className="section section--off-white">
        <div className="container container--wide">
          <p className="section__title text-center">WHAT WE MEASURE</p>
          <h2 className="section__subtitle text-center mb-8">
            18 Leadership <em>Dimensions</em>
          </h2>
          <p className="section__description mx-auto text-center mb-16">
            These aren't personality traits. They're measurable leadership capabilities mapped to the Konstantin Method. This is your scoreboard.
          </p>

          {/* Leading Yourself */}
          <div className="dimension-group">
            <h3 className="dimension-group__title">LEADING YOURSELF</h3>
            <div className="dimension-grid">
              <div className="dimension-card">
                <div className="dimension-card__number">01</div>
                <h4 className="dimension-card__title">Energy Management</h4>
                <p className="dimension-card__desc">Protecting time for high-value deep work vs. reactive firefighting</p>
              </div>

              <div className="dimension-card">
                <div className="dimension-card__number">02</div>
                <h4 className="dimension-card__title">Self-Awareness</h4>
                <p className="dimension-card__desc">Recognizing your patterns, triggers, and unconscious motivations</p>
              </div>

              <div className="dimension-card">
                <div className="dimension-card__number">03</div>
                <h4 className="dimension-card__title">Above the Line</h4>
                <p className="dimension-card__desc">Responding with curiosity instead of blame, victim, or hero mindsets</p>
              </div>

              <div className="dimension-card">
                <div className="dimension-card__number">04</div>
                <h4 className="dimension-card__title">Emotional Fluidity</h4>
                <p className="dimension-card__desc">Identifying and navigating emotions in real-time without getting stuck</p>
              </div>

              <div className="dimension-card">
                <div className="dimension-card__number">05</div>
                <h4 className="dimension-card__title">Contemplative Practice</h4>
                <p className="dimension-card__desc">Daily rituals that create space for stillness and reflection</p>
              </div>

              <div className="dimension-card">
                <div className="dimension-card__number">06</div>
                <h4 className="dimension-card__title">Stress Design</h4>
                <p className="dimension-card__desc">Operating in your optimal stress zone, not burnout or boredom</p>
              </div>
            </div>
          </div>

          {/* Leading Teams */}
          <div className="dimension-group">
            <h3 className="dimension-group__title">LEADING TEAMS</h3>
            <div className="dimension-grid">
              <div className="dimension-card">
                <div className="dimension-card__number">07</div>
                <h4 className="dimension-card__title">Trust Formula</h4>
                <p className="dimension-card__desc">Delivering on commitments and modeling reliability</p>
              </div>

              <div className="dimension-card">
                <div className="dimension-card__number">08</div>
                <h4 className="dimension-card__title">Psychological Safety</h4>
                <p className="dimension-card__desc">Creating an environment where bad news travels fast</p>
              </div>

              <div className="dimension-card">
                <div className="dimension-card__number">09</div>
                <h4 className="dimension-card__title">Multiplier Behavior</h4>
                <p className="dimension-card__desc">Expanding others' thinking rather than being the expert</p>
              </div>

              <div className="dimension-card">
                <div className="dimension-card__number">10</div>
                <h4 className="dimension-card__title">Communication Rhythm</h4>
                <p className="dimension-card__desc">Establishing consistent cadence for team alignment</p>
              </div>

              <div className="dimension-card">
                <div className="dimension-card__number">11</div>
                <h4 className="dimension-card__title">Team Health</h4>
                <p className="dimension-card__desc">Monitoring and improving team dynamics and effectiveness</p>
              </div>

              <div className="dimension-card">
                <div className="dimension-card__number">12</div>
                <h4 className="dimension-card__title">Accountability & Delegation</h4>
                <p className="dimension-card__desc">Empowering decisions without being the bottleneck</p>
              </div>
            </div>
          </div>

          {/* Leading Organizations */}
          <div className="dimension-group">
            <h3 className="dimension-group__title">LEADING ORGANIZATIONS</h3>
            <div className="dimension-grid">
              <div className="dimension-card">
                <div className="dimension-card__number">13</div>
                <h4 className="dimension-card__title">Strategic Clarity</h4>
                <p className="dimension-card__desc">Ensuring leadership team can articulate strategy in one sentence</p>
              </div>

              <div className="dimension-card">
                <div className="dimension-card__number">14</div>
                <h4 className="dimension-card__title">Culture as System</h4>
                <p className="dimension-card__desc">Intentionally designing culture, not letting it happen by accident</p>
              </div>

              <div className="dimension-card">
                <div className="dimension-card__number">15</div>
                <h4 className="dimension-card__title">Three Transitions</h4>
                <p className="dimension-card__desc">Working ON the business (strategy, structure) not just IN it</p>
              </div>

              <div className="dimension-card">
                <div className="dimension-card__number">16</div>
                <h4 className="dimension-card__title">Systems Thinking</h4>
                <p className="dimension-card__desc">Seeing patterns and root causes, not isolated incidents</p>
              </div>

              <div className="dimension-card">
                <div className="dimension-card__number">17</div>
                <h4 className="dimension-card__title">Organizational Design</h4>
                <p className="dimension-card__desc">Structuring the company for current and future scale</p>
              </div>

              <div className="dimension-card">
                <div className="dimension-card__number">18</div>
                <h4 className="dimension-card__title">Board & Governance</h4>
                <p className="dimension-card__desc">Proactively leveraging your board as strategic partners</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: HOW IT WORKS - White Background */}
      <section className="section">
        <div className="container">
          <p className="section__title text-center">HOW IT WORKS</p>
          <h2 className="section__subtitle text-center mb-8">
            Three Steps to <em>Measurable Growth</em>
          </h2>

          <div className="step-grid">
            <div className="step-card">
              <div className="step-card__number">1</div>
              <h3 className="step-card__title">Assess</h3>
              <p className="step-card__desc">
                Complete your baseline assessment. 100 questions across 18 dimensions in three 20-minute sessions. Honest, objective, comprehensive.
              </p>
            </div>

            <div className="step-card">
              <div className="step-card__number">2</div>
              <h3 className="step-card__title">Track</h3>
              <p className="step-card__desc">
                Weekly check-ins via WhatsApp. Choose 3 dimensions to focus on per quarter. Answer 3 questions weekly. Track your progress over time.
              </p>
            </div>

            <div className="step-card">
              <div className="step-card__number">3</div>
              <h3 className="step-card__title">Improve</h3>
              <p className="step-card__desc">
                Get tailored insights and frameworks. Your dashboard shows exactly where to focus. We prescribe specific frameworks based on your scores. No guessing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: SOCIAL PROOF - Navy Background */}
      <section className="section section--dark">
        <div className="container">
          <p className="section__title text-center">TRUSTED BY SERIES A-C CEOS</p>
          <h2 className="section__subtitle text-center mb-16">
            Real Results from <em>Real Leaders</em>
          </h2>

          <div className="testimonial">
            <p className="testimonial__quote">
              Before CEO Lab, I was making decisions based on anxiety, not data. I'd wake up at 3am wondering if I was actually growing as a leader or just getting lucky. The assessment showed me my blind spots in black and white—my delegation score was 32%. That was the wake-up call. Now, 90 days later, I'm at 68% and my team is making decisions without me. The anxiety is gone. I know exactly where I stand and where to focus next. That clarity alone is worth 10x the price.
            </p>
            <div className="testimonial__author">Sarah Chen</div>
            <div className="testimonial__role">Founder & CEO, Series A SaaS (40-person team)</div>
          </div>
        </div>
      </section>

      {/* SECTION 7: PRICING - White Background */}
      <section className="section">
        <div className="container text-center">
          <p className="section__title">SIMPLE, TRANSPARENT PRICING</p>
          <h2 className="section__subtitle mb-6">
            €100/Month for <em>Measurable Leadership Growth</em>
          </h2>
          <p className="section__description mx-auto mb-12">
            One bad leadership decision costs more than a year of CEO Lab. This is the scoreboard you've been missing.
          </p>

          <div className="font-serif text-7xl font-semibold mb-12" style={{ color: 'var(--ceo-gold)' }}>
            €100/month
          </div>

          <div className="assessment-grid" style={{ maxWidth: '1000px', margin: '0 auto 48px' }}>
            <div className="assessment-card">
              <div className="assessment-card__content">
                <h3 className="assessment-card__title">Full 18-Dimension Assessment</h3>
                <p className="assessment-card__desc">
                  Updated with every weekly check-in. Track your progress over time across all leadership capabilities.
                </p>
              </div>
            </div>

            <div className="assessment-card">
              <div className="assessment-card__content">
                <h3 className="assessment-card__title">Weekly WhatsApp Check-Ins</h3>
                <p className="assessment-card__desc">
                  Choose your focus areas. Answer 3 questions. Build systematic growth habits.
                </p>
              </div>
            </div>

            <div className="assessment-card">
              <div className="assessment-card__content">
                <h3 className="assessment-card__title">Personal Dashboard</h3>
                <p className="assessment-card__desc">
                  Visual progress tracking. See your trends. Know where you're improving and where you're stuck.
                </p>
              </div>
            </div>

            <div className="assessment-card">
              <div className="assessment-card__content">
                <h3 className="assessment-card__title">Prescribed Frameworks</h3>
                <p className="assessment-card__desc">
                  Automatic recommendations from the Konstantin Method based on your scores. Exactly what you need, when you need it.
                </p>
              </div>
            </div>

            <div className="assessment-card">
              <div className="assessment-card__content">
                <h3 className="assessment-card__title">AI-Generated Insights</h3>
                <p className="assessment-card__desc">
                  Monthly, quarterly, and annual reports showing patterns, breakthroughs, and next-level focus areas.
                </p>
              </div>
            </div>

            <div className="assessment-card">
              <div className="assessment-card__content">
                <h3 className="assessment-card__title">Priority Support</h3>
                <p className="assessment-card__desc">
                  Direct access to Niko's team for questions, guidance, and troubleshooting.
                </p>
              </div>
            </div>
          </div>

          <Link href="/assessment/hook" className="btn-primary" style={{ fontSize: '18px', padding: '18px 36px' }}>
            Start Your Free Assessment
          </Link>
          <p style={{ marginTop: '16px', fontSize: '14px', color: 'var(--ceo-gray)' }}>
            No credit card required for the free snapshot. Premium membership: €100/month, cancel anytime.
          </p>
        </div>
      </section>

      {/* SECTION 8: FINAL CTA - Off-white Background */}
      <section className="section section--large section--off-white">
        <div className="container container--narrow text-center">
          <p className="section__title">DON'T GUESS. MEASURE.</p>
          <h2 className="section__subtitle mb-8">
            Your Team Already Sees <em>What You Can't</em>
          </h2>
          <p className="section__description mx-auto mb-8">
            Every week without measurement is a week of invisible decline while competitors systematically improve. Athletes don't guess. They measure. They analyze. They improve. You deserve the same.
          </p>

          <div className="cta-group">
            <Link href="/assessment/hook" className="btn-primary" style={{ fontSize: '18px', padding: '18px 36px' }}>
              Measure Your Leadership (Free)
            </Link>
            <Link href="/contact" className="btn-secondary" style={{ fontSize: '18px', padding: '18px 36px' }}>
              Book a Demo Call
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12" style={{ borderColor: 'var(--ceo-gray-light)', background: 'white' }}>
        <div className="container text-center" style={{ color: 'var(--ceo-gray)' }}>
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
