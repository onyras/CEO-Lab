import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: '#F7F3ED' }}>
      {/* Header */}
      <header className="bg-white border-b border-black/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="text-xl font-bold text-black">nk</span>
              <span className="text-xl font-bold text-black">CEO Lab</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/auth" className="text-black/70 hover:text-black transition-colors px-4 py-2">
                Sign In
              </Link>
              <Link href="/assessment/hook" className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-black/90 transition-colors">
                Start Free Assessment
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-8 py-20 text-center">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-black mb-6">
          Are you getting better as a leader?
        </h1>
        <p className="text-xl text-black/60 mb-8 max-w-3xl mx-auto">
          Most CEOs don't know. CEO Lab measures your leadership across 18 dimensions so you can lead with data, not anxiety.
        </p>
        <Link href="/assessment/hook" className="inline-block bg-black text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-black/90 transition-colors mb-4">
          Take the Free Leadership Snapshot
        </Link>
        <p className="text-sm text-black/50">
          5 minutes. See what matters most in your leadership.
        </p>
      </section>

      {/* Problem Section */}
      <section className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-black text-center mb-8">
            Athletes Have Post-Game Analysis. What Do CEOs Have?
          </h2>

          <div className="space-y-6 text-lg text-black/70 leading-relaxed">
            <p>
              Professional athletes review game footage. They track performance metrics. They know exactly where they're improving and where they're stuck.
            </p>
            <p>
              You're running a company. Leading a team. Making decisions that affect people's lives and livelihoods. But when was the last time you objectively measured your own leadership?
            </p>
            <p>
              Most CEOs operate without a scoreboard. You read books. Listen to podcasts. Maybe work with a coach. But you have no systematic way to know if you're actually getting better.
            </p>
            <p>
              Without measurement, anxiety fills the gap. Every win feels like luck. Every challenge feels like proof you're not cut out for this. And the question that wakes you up at 3am: "Am I really the right person to lead this?"
            </p>
            <p>
              You can't improve what you don't measure. And in 2026, with AI disrupting every industry and the pace of change accelerating, guessing isn't good enough anymore.
            </p>
          </div>

          <div className="mt-12 p-8 rounded-lg border-l-4" style={{ background: '#F7F3ED', borderColor: '#7FABC8' }}>
            <p className="text-2xl font-semibold text-black italic">
              "You can't improve what you don't measure. And guessing isn't good enough anymore."
            </p>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20" style={{ background: '#F7F3ED' }}>
        <div className="max-w-5xl mx-auto px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-black text-center mb-6">
            Introducing CEO Lab: Your Leadership Scoreboard
          </h2>

          <div className="space-y-6 text-lg text-black/70 leading-relaxed mb-12 max-w-3xl mx-auto">
            <p>
              CEO Lab is a leadership measurement platform built on the Konstantin Method - 60+ frameworks synthesized from 15 years of work with Series A-C founders.
            </p>
            <p>
              We give you what athletes have: a baseline, systematic tracking, and objective feedback on whether you're improving.
            </p>
            <p>
              Not another content library. Not more frameworks to browse. A scoreboard that shows you - with data - where you stand and where to focus next.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-black mb-3">Baseline Assessment</h3>
              <p className="text-black/60 mb-4">100 questions measuring 18 leadership dimensions. Where you are right now, honestly.</p>
            </div>

            <div className="bg-white p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-black mb-3">Weekly Tracking</h3>
              <p className="text-black/60 mb-4">Three questions via WhatsApp. Two minutes. Tracks real behavioral change over time.</p>
            </div>

            <div className="bg-white p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-black mb-3">Your Dashboard</h3>
              <p className="text-black/60 mb-4">Visual progress across all dimensions. See your growth. Know what's working.</p>
            </div>

            <div className="bg-white p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-black mb-3">Prescribed Frameworks</h3>
              <p className="text-black/60 mb-4">Based on your scores, we tell you exactly which frameworks to focus on. No guessing. No overwhelm.</p>
            </div>

            <div className="bg-white p-8 rounded-lg md:col-span-2">
              <h3 className="text-2xl font-bold text-black mb-3">AI-Generated Insights</h3>
              <p className="text-black/60 mb-4">Monthly, quarterly, and annual reports showing patterns, breakthroughs, and what to work on next.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
            Simple Pricing
          </h2>
          <p className="text-lg text-black/60 mb-12">
            One price. Everything included. Cancel anytime.
          </p>

          <div className="bg-white border-2 border-black rounded-lg p-8 max-w-md mx-auto">
            <h3 className="text-3xl font-bold text-black mb-4">€100 / month</h3>
            <ul className="text-left space-y-3 mb-8">
              <li className="flex items-start gap-2">
                <span className="text-black">✓</span>
                <span className="text-black/70">Full baseline assessment</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-black">✓</span>
                <span className="text-black/70">Weekly check-ins via WhatsApp</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-black">✓</span>
                <span className="text-black/70">Complete dashboard & analytics</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-black">✓</span>
                <span className="text-black/70">AI-generated progress reports</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-black">✓</span>
                <span className="text-black/70">Access to all frameworks & tools</span>
              </li>
            </ul>
            <Link href="/assessment/hook" className="block bg-black text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-black/90 transition-colors">
              Start Free Trial
            </Link>
            <p className="text-sm text-black/50 mt-4">7-day free trial. No credit card required.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-bold mb-4">CEO Lab</h3>
              <p className="text-white/60 text-sm">
                Leadership measurement built on the Konstantin Method.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <div className="space-y-2 text-sm">
                <Link href="/privacy" className="block text-white/60 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="block text-white/60 hover:text-white transition-colors">
                  Terms of Service
                </Link>
                <Link href="/refund" className="block text-white/60 hover:text-white transition-colors">
                  Refund Policy
                </Link>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4">Connect</h4>
              <div className="space-y-2 text-sm">
                <a href="https://www.nikolaskonstantin.com" target="_blank" rel="noopener noreferrer" className="block text-white/60 hover:text-white transition-colors">
                  Nikolas Konstantin
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-sm text-white/40">
            © 2026 CEO Lab. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
