'use client'

import Link from 'next/link'

// ─── Nav ────────────────────────────────────────────────────────────

function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-black/10 bg-white/80">
      <div className="max-w-7xl mx-auto px-8 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-black">
            <span className="text-xl font-bold">nk</span>
            <span className="text-xl font-light">CEO Lab</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/auth"
              className="text-sm font-medium text-black/70 hover:text-black transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/assessment/hook"
              className="bg-black text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-black/90 transition-all duration-200"
            >
              Start Free Assessment
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

// ─── Hero ───────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative bg-white px-8 pt-32 pb-20 text-center">
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="mb-12 min-h-[80px]" />

        <h1 className="text-[48px] md:text-[52px] lg:text-[56px] font-bold text-black mb-6 leading-[1.1] tracking-tight">
          A measurement system for your
          <br />
          leadership development
        </h1>

        <p className="text-base md:text-lg text-black/60 mb-10 max-w-2xl mx-auto leading-relaxed">
          CEO Lab tracks your growth across 15 leadership dimensions.
          No preconception, just space for your development to take shape.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
          <Link
            href="/assessment/hook"
            className="w-full sm:w-auto bg-black text-white px-7 py-3.5 rounded-lg text-base font-semibold hover:bg-black/90 transition-all duration-200"
          >
            Start Free Assessment
          </Link>
          <Link
            href="/auth"
            className="w-full sm:w-auto bg-transparent text-black border-2 border-black/10 px-7 py-3.5 rounded-lg text-base font-semibold hover:bg-black/5 hover:border-black/20 transition-all duration-200"
          >
            Sign In
          </Link>
        </div>

        <p className="text-sm text-black/40">
          Built on the Konstantin Method &middot; 60+ leadership frameworks
        </p>
      </div>
    </section>
  )
}

// ─── Page ───────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F7F3ED] font-[Inter]">
      <Nav />
      <Hero />

      {/* Problem Section */}
      <section className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-black text-center mb-8">
            Athletes Have Post-Game Analysis. What Do CEOs Have?
          </h2>

          <div className="space-y-6 text-lg text-black/70 leading-relaxed">
            <p>
              Professional athletes review game footage. They track performance metrics. They know exactly where they&apos;re improving and where they&apos;re stuck.
            </p>
            <p>
              You&apos;re running a company. Leading a team. Making decisions that affect people&apos;s lives and livelihoods. But when was the last time you objectively measured your own leadership?
            </p>
            <p>
              Most CEOs operate without a scoreboard. You read books. Listen to podcasts. Maybe work with a coach. But you have no systematic way to know if you&apos;re actually getting better.
            </p>
            <p>
              You can&apos;t improve what you don&apos;t measure. And in 2026, with AI disrupting every industry and the pace of change accelerating, guessing isn&apos;t good enough anymore.
            </p>
          </div>

          <div className="mt-12 p-8 bg-[#F7F3ED] rounded-lg border-l-4 border-[#7FABC8]">
            <p className="text-2xl font-semibold text-black italic">
              &ldquo;You can&apos;t improve what you don&apos;t measure. And guessing isn&apos;t good enough anymore.&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 bg-[#F7F3ED]">
        <div className="max-w-5xl mx-auto px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-black text-center mb-6">
            Your Leadership Scoreboard
          </h2>

          <div className="space-y-6 text-lg text-black/70 leading-relaxed mb-12 max-w-3xl mx-auto">
            <p>
              CEO Lab is a leadership measurement platform built on the Konstantin Method &mdash; 60+ frameworks synthesized from 15 years of work with Series A-C founders.
            </p>
            <p>
              We give you what athletes have: a baseline, systematic tracking, and objective feedback on whether you&apos;re improving.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-black mb-3">Baseline Assessment</h3>
              <p className="text-black/60">96 questions measuring 15 leadership dimensions across 3 stages. Where you are right now, honestly.</p>
            </div>
            <div className="bg-white p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-black mb-3">Accountability Agent</h3>
              <p className="text-black/60">Weekly check-ins on your focus dimensions. Track real behavioral change over time.</p>
            </div>
            <div className="bg-white p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-black mb-3">Your Dashboard</h3>
              <p className="text-black/60">Visual progress across all dimensions. See your growth. Know what&apos;s working.</p>
            </div>
            <div className="bg-white p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-black mb-3">Mirror Check</h3>
              <p className="text-black/60">Get anonymous feedback from your team. Discover blind spots between self-perception and reality.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 15 Dimensions Section */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-black text-center mb-6">
            15 Leadership Dimensions
          </h2>
          <p className="text-lg text-black/60 text-center mb-16 max-w-3xl mx-auto">
            Measurable leadership capabilities mapped to the Konstantin Method. This is your scoreboard.
          </p>

          <div className="grid md:grid-cols-3 gap-12">
            {/* Leading Yourself */}
            <div>
              <h3 className="text-2xl font-bold text-black mb-8 pb-3 border-b-2 border-[#7FABC8]">
                LEADING YOURSELF
              </h3>
              <div className="space-y-6">
                {[
                  ['Self-Awareness', 'Recognizing your patterns, triggers, and unconscious motivations'],
                  ['Emotional Mastery', 'Navigating emotions in real-time without getting stuck'],
                  ['Grounded Presence', 'Operating from calm clarity instead of reactive anxiety'],
                  ['Purpose & Mastery', 'Connecting daily work to long-term vision and growth'],
                  ['Peak Performance', 'Sustaining energy and focus at the highest level'],
                ].map(([name, desc]) => (
                  <div key={name}>
                    <h4 className="font-bold text-black mb-1">{name}</h4>
                    <p className="text-sm text-black/60">{desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Leading Teams */}
            <div>
              <h3 className="text-2xl font-bold text-black mb-8 pb-3 border-b-2 border-[#A6BEA4]">
                LEADING TEAMS
              </h3>
              <div className="space-y-6">
                {[
                  ['Building Trust', 'Delivering on commitments and modeling reliability'],
                  ['Hard Conversations', 'Addressing conflict directly with compassion and clarity'],
                  ['Diagnosing the Real Problem', 'Seeing root causes, not just symptoms'],
                  ['Team Operating System', 'Establishing rhythms and structures that scale'],
                  ['Leader Identity', 'Evolving how you show up as the company grows'],
                ].map(([name, desc]) => (
                  <div key={name}>
                    <h4 className="font-bold text-black mb-1">{name}</h4>
                    <p className="text-sm text-black/60">{desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Leading Organizations */}
            <div>
              <h3 className="text-2xl font-bold text-black mb-8 pb-3 border-b-2 border-[#E08F6A]">
                LEADING ORGANIZATIONS
              </h3>
              <div className="space-y-6">
                {[
                  ['Strategic Clarity', 'Everyone can articulate the strategy in one sentence'],
                  ['Culture Design', 'Intentionally shaping culture, not letting it happen by accident'],
                  ['Organizational Architecture', 'Structuring the company for current and future scale'],
                  ['CEO Evolution', 'Working ON the business, not just IN it'],
                  ['Leading Change', 'Driving transformation without burning people out'],
                ].map(([name, desc]) => (
                  <div key={name}>
                    <h4 className="font-bold text-black mb-1">{name}</h4>
                    <p className="text-sm text-black/60">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-[#F7F3ED]">
        <div className="max-w-5xl mx-auto px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-black text-center mb-16">
            Three Steps to Measurable Growth
          </h2>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">1</div>
              <h3 className="text-2xl font-bold text-black mb-4">Assess</h3>
              <p className="text-black/60">Complete your baseline assessment. 96 questions across 15 dimensions in three stages.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">2</div>
              <h3 className="text-2xl font-bold text-black mb-4">Track</h3>
              <p className="text-black/60">Weekly check-ins on your focus dimensions. Choose 3 areas to improve per quarter.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">3</div>
              <h3 className="text-2xl font-bold text-black mb-4">Improve</h3>
              <p className="text-black/60">Your dashboard shows exactly where to focus. Prescribed frameworks from the Konstantin Method based on your scores.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
            &euro;100/Month
          </h2>
          <p className="text-xl text-black/60 mb-12">
            One bad leadership decision costs more than a year of CEO Lab.
          </p>

          <div className="bg-[#F7F3ED] p-10 rounded-lg text-left mb-12 max-w-2xl mx-auto">
            <div className="space-y-4">
              {[
                'Full 15-dimension baseline assessment',
                'Weekly accountability check-ins',
                'Personal leadership dashboard',
                'Mirror check (anonymous team feedback)',
                'Prescribed frameworks from the Konstantin Method',
                'Priority support',
              ].map((item) => (
                <div key={item} className="flex gap-3 items-start">
                  <div className="flex-shrink-0 w-5 h-5 bg-black text-white rounded-full flex items-center justify-center text-xs mt-0.5">&check;</div>
                  <p className="text-black/80">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <Link
            href="/assessment/hook"
            className="inline-block bg-black text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-black/90 transition-colors mb-4"
          >
            Start Your Free Assessment
          </Link>
          <p className="text-sm text-black/50">
            No credit card required for the free snapshot. Cancel anytime.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-black py-20">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Your Team Already Sees What You Can&apos;t
          </h2>
          <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto">
            Athletes don&apos;t guess. They measure. They analyze. They improve. You deserve the same.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/assessment/hook" className="bg-white text-black px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white/90 transition-colors">
              Measure Your Leadership (Free)
            </Link>
            <Link href="/auth" className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white/10 transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-black/10 py-8">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <div className="flex justify-center items-center gap-8 mb-4">
            <Link href="/terms" className="text-black/60 hover:text-black text-sm">Terms of Service</Link>
            <Link href="/privacy" className="text-black/60 hover:text-black text-sm">Privacy Policy</Link>
            <Link href="/refund" className="text-black/60 hover:text-black text-sm">Refund Policy</Link>
          </div>
          <p className="text-sm text-black/50">CEO Lab &middot; Built on the Konstantin Method</p>
        </div>
      </footer>
    </div>
  )
}
