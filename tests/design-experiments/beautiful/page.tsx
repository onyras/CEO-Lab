export default function BeautifulPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-amber-50/30 to-white">
      {/* Navigation - Minimal & Floating */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-amber-100/50">
        <div className="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-200 to-orange-300 flex items-center justify-center">
              <span className="text-white font-serif text-xl">C</span>
            </div>
            <span className="font-serif text-2xl text-gray-900">CEO Lab</span>
          </div>
          <a
            href="/assessment/hook"
            className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            Begin Your Journey
          </a>
        </div>
      </nav>

      {/* Hero - Expansive & Artistic */}
      <section className="pt-32 pb-24 px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8 inline-block">
            <span className="text-sm uppercase tracking-[0.3em] text-amber-700 font-light">
              For Visionary Leaders
            </span>
          </div>

          <h1 className="font-serif text-7xl md:text-8xl mb-8 leading-tight">
            Know Where You
            <br />
            <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600">
              Stand
            </span>
          </h1>

          <p className="text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
            In times of profound change, the clearest competitive edge
            is knowing yourself completely. Measure what matters.
            Track your evolution. Lead with certainty.
          </p>

          {/* Floating Cards - Visual Interest */}
          <div className="grid md:grid-cols-3 gap-8 mb-16 max-w-5xl mx-auto">
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-amber-100 hover:shadow-2xl transition-shadow duration-300">
              <div className="text-5xl font-serif mb-4 text-amber-600">100</div>
              <div className="text-gray-600 font-light">Questions That Reveal Everything</div>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-orange-100 hover:shadow-2xl transition-shadow duration-300">
              <div className="text-5xl font-serif mb-4 text-orange-600">18</div>
              <div className="text-gray-600 font-light">Dimensions of Leadership Mastery</div>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-amber-100 hover:shadow-2xl transition-shadow duration-300">
              <div className="text-5xl font-serif mb-4 text-amber-700">∞</div>
              <div className="text-gray-600 font-light">Growth Without Limits</div>
            </div>
          </div>

          <a
            href="/assessment/hook"
            className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-amber-600 to-orange-600 text-white text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            <span>Take the Free Assessment</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
          <p className="text-sm text-gray-500 mt-4 font-light">
            12 questions · 5 minutes · Instant insights into your leadership
          </p>
        </div>
      </section>

      {/* Philosophy Section - Spacious */}
      <section className="py-24 px-8 bg-gradient-to-b from-white to-amber-50/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-5xl mb-8 text-gray-900">
            The Age of Measurement
          </h2>
          <div className="prose prose-xl mx-auto text-gray-600 font-light leading-relaxed">
            <p className="mb-6">
              Athletes track every metric. Artists study every brushstroke.
              Musicians record every practice session.
            </p>
            <p className="mb-6 text-2xl text-gray-900 font-normal">
              Why should leadership be different?
            </p>
            <p>
              CEO Lab brings the precision of deliberate practice to the art of leadership.
              Not through guesswork. Not through hope. Through measurement, reflection,
              and continuous adaptation.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works - Visual Flow */}
      <section className="py-24 px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif text-5xl text-center mb-20 text-gray-900">
            Your Journey to Mastery
          </h2>

          <div className="space-y-16">
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1">
                <div className="inline-block px-4 py-2 bg-amber-100 rounded-full text-amber-800 text-sm mb-4">
                  Step One
                </div>
                <h3 className="font-serif text-4xl mb-4 text-gray-900">Begin with Truth</h3>
                <p className="text-xl text-gray-600 leading-relaxed font-light">
                  Take our comprehensive baseline assessment. 100 questions across three
                  territories: Leading Yourself, Leading Teams, Leading Organizations.
                  See yourself clearly for the first time.
                </p>
              </div>
              <div className="flex-1">
                <div className="aspect-square bg-gradient-to-br from-amber-100 to-orange-100 rounded-3xl flex items-center justify-center">
                  <span className="text-6xl">📊</span>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-12">
              <div className="flex-1">
                <div className="inline-block px-4 py-2 bg-orange-100 rounded-full text-orange-800 text-sm mb-4">
                  Step Two
                </div>
                <h3 className="font-serif text-4xl mb-4 text-gray-900">Track Your Evolution</h3>
                <p className="text-xl text-gray-600 leading-relaxed font-light">
                  Choose three focus areas each quarter. Weekly check-ins keep you honest.
                  Watch your heatmap transform from red to green as you grow.
                </p>
              </div>
              <div className="flex-1">
                <div className="aspect-square bg-gradient-to-br from-orange-100 to-amber-100 rounded-3xl flex items-center justify-center">
                  <span className="text-6xl">📈</span>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1">
                <div className="inline-block px-4 py-2 bg-amber-100 rounded-full text-amber-800 text-sm mb-4">
                  Step Three
                </div>
                <h3 className="font-serif text-4xl mb-4 text-gray-900">Receive Insight</h3>
                <p className="text-xl text-gray-600 leading-relaxed font-light">
                  AI-generated reports reveal patterns you couldn't see. Monthly insights.
                  Quarterly deep-dives. Annual retrospectives that read like your
                  leadership autobiography.
                </p>
              </div>
              <div className="flex-1">
                <div className="aspect-square bg-gradient-to-br from-amber-100 to-orange-100 rounded-3xl flex items-center justify-center">
                  <span className="text-6xl">✨</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial - Elegant */}
      <section className="py-24 px-8 bg-gradient-to-r from-amber-50 to-orange-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex gap-1 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
          <blockquote className="font-serif text-3xl mb-8 text-gray-900 italic leading-relaxed">
            "For the first time in my career as a CEO, I can see my blind spots
            before they become problems."
          </blockquote>
          <div className="text-gray-600">
            <div className="font-semibold">Sarah Chen</div>
            <div className="text-sm">Founder & CEO, Series B SaaS</div>
          </div>
        </div>
      </section>

      {/* Pricing - Luxurious */}
      <section className="py-24 px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-serif text-5xl mb-6 text-gray-900">Investment in Yourself</h2>
          <p className="text-xl text-gray-600 mb-12 font-light">
            The cost of not knowing where you stand is immeasurable.
          </p>

          <div className="bg-white rounded-3xl shadow-2xl border border-amber-100 overflow-hidden">
            <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white py-8 px-8">
              <div className="text-sm uppercase tracking-wider mb-2 opacity-90">Premium Access</div>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-6xl font-serif">€100</span>
                <span className="text-2xl opacity-90">/month</span>
              </div>
            </div>

            <div className="p-12">
              <ul className="space-y-4 text-left mb-8">
                {[
                  'Complete 100-question baseline assessment',
                  'Track 18 leadership dimensions',
                  'Weekly check-ins via WhatsApp',
                  'AI-generated monthly insights',
                  'Quarterly progress reports',
                  'Annual leadership retrospective',
                  '50+ frameworks from the Konstantin Method',
                  'Access to Beautiful Mind meditation app'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>

              <a
                href="/assessment/hook"
                className="block w-full px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Begin Your Assessment
              </a>
              <p className="text-sm text-gray-500 mt-4">
                Start with our free 12-question assessment
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA - Aspirational */}
      <section className="py-32 px-8 bg-gradient-to-b from-white to-amber-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-6xl mb-8 text-gray-900 leading-tight">
            The Leaders Who Measure
            <br />
            <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
              Are the Ones Who Lead
            </span>
          </h2>
          <p className="text-2xl text-gray-600 mb-12 font-light">
            Begin your journey today.
          </p>
          <a
            href="/assessment/hook"
            className="inline-flex items-center gap-3 px-12 py-6 bg-gradient-to-r from-amber-600 to-orange-600 text-white text-xl rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105"
          >
            <span>Take Free Assessment</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </section>

      {/* Footer - Minimal */}
      <footer className="border-t border-amber-100 py-12">
        <div className="max-w-7xl mx-auto px-8 text-center text-gray-600 text-sm">
          <p>© 2026 CEO Lab · Built on the Konstantin Method</p>
        </div>
      </footer>
    </div>
  );
}
