export default function ElegantPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--nk-off-white)' }}>
      {/* Navigation - Refined */}
      <nav className="border-b" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
        <div className="max-w-6xl mx-auto px-12 py-8 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="font-serif text-3xl" style={{ color: 'var(--nk-black)' }}>
              CEO Lab
            </span>
          </div>
          <a
            href="/assessment/hook"
            className="text-sm uppercase tracking-widest px-6 py-3 border hover:bg-black hover:text-white transition-all duration-300"
            style={{ borderColor: 'var(--nk-black)', color: 'var(--nk-black)' }}
          >
            Enter
          </a>
        </div>
      </nav>

      {/* Hero - Maximum White Space */}
      <section className="px-12 py-32">
        <div className="max-w-5xl mx-auto">
          <div className="mb-16">
            <div className="h-px w-16 mb-8" style={{ backgroundColor: 'var(--nk-black)' }}></div>
            <h1 className="font-serif text-7xl md:text-8xl mb-12 leading-none" style={{ color: 'var(--nk-black)' }}>
              Know Where
              <br />
              You Stand.
              <br />
              <span className="italic font-light">Always.</span>
            </h1>
            <div className="max-w-xl">
              <p className="text-xl mb-8 leading-relaxed" style={{ color: 'rgba(0,0,0,0.6)' }}>
                Most CEOs navigate by intuition. The exceptional ones navigate by data.
                Measure your leadership. Track your growth. Lead with certainty.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <a
              href="/assessment/hook"
              className="text-sm uppercase tracking-widest px-8 py-4 bg-black text-white hover:bg-gray-900 transition-colors duration-300"
            >
              Begin Assessment
            </a>
            <span className="text-sm" style={{ color: 'rgba(0,0,0,0.4)' }}>
              12 questions · 5 minutes
            </span>
          </div>
        </div>
      </section>

      {/* Stats - Minimalist */}
      <section className="px-12 py-24 border-t border-b" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-16">
          <div>
            <div className="font-serif text-6xl mb-4" style={{ color: 'var(--nk-black)' }}>100</div>
            <div className="text-sm uppercase tracking-wider" style={{ color: 'rgba(0,0,0,0.6)' }}>
              Assessment Questions
            </div>
          </div>
          <div>
            <div className="font-serif text-6xl mb-4" style={{ color: 'var(--nk-black)' }}>18</div>
            <div className="text-sm uppercase tracking-wider" style={{ color: 'rgba(0,0,0,0.6)' }}>
              Leadership Dimensions
            </div>
          </div>
          <div>
            <div className="font-serif text-6xl mb-4" style={{ color: 'var(--nk-black)' }}>∞</div>
            <div className="text-sm uppercase tracking-wider" style={{ color: 'rgba(0,0,0,0.6)' }}>
              Continuous Growth
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy - Spacious */}
      <section className="px-12 py-32">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <span className="text-xs uppercase tracking-[0.3em]" style={{ color: 'rgba(0,0,0,0.4)' }}>
              Philosophy
            </span>
          </div>
          <h2 className="font-serif text-5xl mb-16 leading-tight" style={{ color: 'var(--nk-black)' }}>
            In the age of AI,<br />
            self-knowledge is<br />
            the only sustainable edge.
          </h2>
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <p className="text-lg leading-relaxed mb-6" style={{ color: 'rgba(0,0,0,0.7)' }}>
                Every athlete tracks performance metrics. Every artist studies their craft with precision.
                Yet most leaders operate on intuition alone.
              </p>
              <p className="text-lg leading-relaxed" style={{ color: 'rgba(0,0,0,0.7)' }}>
                CEO Lab brings rigorous measurement to the practice of leadership.
              </p>
            </div>
            <div>
              <p className="text-lg leading-relaxed mb-6" style={{ color: 'rgba(0,0,0,0.7)' }}>
                Not through guesswork. Not through hope. Through systematic assessment,
                continuous tracking, and reflective practice.
              </p>
              <p className="text-lg leading-relaxed" style={{ color: 'rgba(0,0,0,0.7)' }}>
                The result: clarity in chaos, confidence in uncertainty.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Process - Clean Grid */}
      <section className="px-12 py-24 border-t" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="mb-20">
            <span className="text-xs uppercase tracking-[0.3em]" style={{ color: 'rgba(0,0,0,0.4)' }}>
              How It Works
            </span>
          </div>

          <div className="space-y-24">
            <div className="grid md:grid-cols-12 gap-8">
              <div className="md:col-span-2">
                <div className="font-serif text-2xl" style={{ color: 'rgba(0,0,0,0.3)' }}>01</div>
              </div>
              <div className="md:col-span-10">
                <h3 className="font-serif text-4xl mb-6" style={{ color: 'var(--nk-black)' }}>
                  Baseline Assessment
                </h3>
                <p className="text-lg leading-relaxed max-w-2xl" style={{ color: 'rgba(0,0,0,0.6)' }}>
                  100 questions across three territories: Leading Yourself, Leading Teams,
                  Leading Organizations. Establish where you stand today.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-12 gap-8">
              <div className="md:col-span-2">
                <div className="font-serif text-2xl" style={{ color: 'rgba(0,0,0,0.3)' }}>02</div>
              </div>
              <div className="md:col-span-10">
                <h3 className="font-serif text-4xl mb-6" style={{ color: 'var(--nk-black)' }}>
                  Weekly Tracking
                </h3>
                <p className="text-lg leading-relaxed max-w-2xl" style={{ color: 'rgba(0,0,0,0.6)' }}>
                  Choose three focus areas each quarter. Weekly check-ins maintain momentum.
                  Watch your leadership heatmap evolve from red to green.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-12 gap-8">
              <div className="md:col-span-2">
                <div className="font-serif text-2xl" style={{ color: 'rgba(0,0,0,0.3)' }}>03</div>
              </div>
              <div className="md:col-span-10">
                <h3 className="font-serif text-4xl mb-6" style={{ color: 'var(--nk-black)' }}>
                  Continuous Insight
                </h3>
                <p className="text-lg leading-relaxed max-w-2xl" style={{ color: 'rgba(0,0,0,0.6)' }}>
                  AI-generated reports reveal patterns you couldn't see. Monthly reflections.
                  Quarterly reviews. Annual retrospectives.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial - Refined */}
      <section className="px-12 py-32 border-t" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <div className="flex gap-1 text-black">
              {[...Array(5)].map((_, i) => (
                <span key={i}>—</span>
              ))}
            </div>
          </div>
          <blockquote className="font-serif text-4xl mb-12 leading-tight italic" style={{ color: 'var(--nk-black)' }}>
            "The first time I could see my leadership evolution in data rather than feelings."
          </blockquote>
          <div style={{ color: 'rgba(0,0,0,0.6)' }}>
            <div className="text-sm uppercase tracking-wider mb-1">Michael Zhang</div>
            <div className="text-xs">Series A Founder, Enterprise AI</div>
          </div>
        </div>
      </section>

      {/* Pricing - Premium */}
      <section className="px-12 py-32 border-t" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <div className="mb-8">
                <span className="text-xs uppercase tracking-[0.3em]" style={{ color: 'rgba(0,0,0,0.4)' }}>
                  Investment
                </span>
              </div>
              <div className="flex items-baseline gap-3 mb-8">
                <span className="font-serif text-7xl" style={{ color: 'var(--nk-black)' }}>€100</span>
                <span className="text-xl" style={{ color: 'rgba(0,0,0,0.4)' }}>/month</span>
              </div>
              <p className="text-lg leading-relaxed mb-12" style={{ color: 'rgba(0,0,0,0.6)' }}>
                For leaders committed to measurable growth. Cancel anytime.
              </p>
              <a
                href="/assessment/hook"
                className="inline-block text-sm uppercase tracking-widest px-8 py-4 bg-black text-white hover:bg-gray-900 transition-colors duration-300"
              >
                Begin Assessment
              </a>
            </div>

            <div>
              <div className="space-y-6">
                {[
                  'Complete baseline assessment',
                  '18 leadership dimensions tracked',
                  'Weekly check-ins via WhatsApp',
                  'Monthly AI-generated insights',
                  'Quarterly progress reports',
                  'Annual retrospective',
                  '50+ frameworks prescribed to gaps',
                  'Beautiful Mind meditation access'
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-1 h-1 mt-3 rounded-full" style={{ backgroundColor: 'var(--nk-black)' }}></div>
                    <span style={{ color: 'rgba(0,0,0,0.7)' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA - Understated */}
      <section className="px-12 py-40 border-t" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="font-serif text-6xl mb-12 leading-tight" style={{ color: 'var(--nk-black)' }}>
            The leaders who measure
            <br />
            are the ones who matter.
          </h2>
          <a
            href="/assessment/hook"
            className="inline-block text-sm uppercase tracking-widest px-12 py-5 bg-black text-white hover:bg-gray-900 transition-colors duration-300"
          >
            Begin
          </a>
        </div>
      </section>

      {/* Footer - Minimal */}
      <footer className="px-12 py-12 border-t" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
        <div className="max-w-6xl mx-auto text-center text-xs uppercase tracking-wider" style={{ color: 'rgba(0,0,0,0.4)' }}>
          <p>© 2026 CEO Lab · Konstantin Method</p>
        </div>
      </footer>
    </div>
  );
}
