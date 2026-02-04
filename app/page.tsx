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
              <Link href="/auth" className="text-black/70 hover:text-black transition-colors px-4 py-2">Sign In</Link>
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
        <p className="text-sm text-black/50 mb-16">
          5 minutes. See what matters most in your leadership.
        </p>

        {/* Dashboard Preview */}
        <div className="mt-16 perspective-1000">
          <div className="transform transition-transform hover:scale-105 duration-300">
            <img
              src="/dashboard-preview.svg"
              alt="CEO Lab Dashboard Preview"
              className="w-full max-w-4xl mx-auto rounded-lg shadow-2xl"
            />
          </div>
        </div>
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

          <div className="mt-12 p-8 bg-[#F7F3ED] rounded-lg border-l-4" style={{ borderColor: '#7FABC8' }}>
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

      {/* 18 Dimensions Section */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-black text-center mb-6">
            What We Measure: 18 Leadership Dimensions
          </h2>
          <p className="text-lg text-black/60 text-center mb-16 max-w-3xl mx-auto">
            These aren't personality traits. They're measurable leadership capabilities mapped to the Konstantin Method. This is your scoreboard.
          </p>

          <div className="grid md:grid-cols-3 gap-12">
            {/* Leading Yourself */}
            <div>
              <h3 className="text-2xl font-bold text-black mb-8 pb-3 border-b-2" style={{ borderColor: '#7FABC8' }}>
                LEADING YOURSELF
              </h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-black mb-2">1. Energy Management</h4>
                  <p className="text-sm text-black/60">Protecting time for high-value deep work vs. reactive firefighting</p>
                </div>
                <div>
                  <h4 className="font-bold text-black mb-2">2. Self-Awareness</h4>
                  <p className="text-sm text-black/60">Recognizing your patterns, triggers, and unconscious motivations</p>
                </div>
                <div>
                  <h4 className="font-bold text-black mb-2">3. Above the Line</h4>
                  <p className="text-sm text-black/60">Responding with curiosity instead of blame, victim, or hero mindsets</p>
                </div>
                <div>
                  <h4 className="font-bold text-black mb-2">4. Emotional Fluidity</h4>
                  <p className="text-sm text-black/60">Identifying and navigating emotions in real-time without getting stuck</p>
                </div>
                <div>
                  <h4 className="font-bold text-black mb-2">5. Contemplative Practice</h4>
                  <p className="text-sm text-black/60">Daily rituals that create space for stillness and reflection</p>
                </div>
                <div>
                  <h4 className="font-bold text-black mb-2">6. Stress Design</h4>
                  <p className="text-sm text-black/60">Operating in your optimal stress zone, not burnout or boredom</p>
                </div>
              </div>
            </div>

            {/* Leading Teams */}
            <div>
              <h3 className="text-2xl font-bold text-black mb-8 pb-3 border-b-2" style={{ borderColor: '#A6BEA4' }}>
                LEADING TEAMS
              </h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-black mb-2">7. Trust Formula</h4>
                  <p className="text-sm text-black/60">Delivering on commitments and modeling reliability</p>
                </div>
                <div>
                  <h4 className="font-bold text-black mb-2">8. Psychological Safety</h4>
                  <p className="text-sm text-black/60">Creating an environment where bad news travels fast</p>
                </div>
                <div>
                  <h4 className="font-bold text-black mb-2">9. Multiplier Behavior</h4>
                  <p className="text-sm text-black/60">Expanding others' thinking rather than being the expert</p>
                </div>
                <div>
                  <h4 className="font-bold text-black mb-2">10. Communication Rhythm</h4>
                  <p className="text-sm text-black/60">Establishing consistent cadence for team alignment</p>
                </div>
                <div>
                  <h4 className="font-bold text-black mb-2">11. Team Health</h4>
                  <p className="text-sm text-black/60">Monitoring and improving team dynamics and effectiveness</p>
                </div>
                <div>
                  <h4 className="font-bold text-black mb-2">12. Accountability & Delegation</h4>
                  <p className="text-black/60 text-sm">Empowering decisions without being the bottleneck</p>
                </div>
              </div>
            </div>

            {/* Leading Organizations */}
            <div>
              <h3 className="text-2xl font-bold text-black mb-8 pb-3 border-b-2" style={{ borderColor: '#E08F6A' }}>
                LEADING ORGANIZATIONS
              </h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-black mb-2">13. Strategic Clarity</h4>
                  <p className="text-sm text-black/60">Ensuring leadership team can articulate strategy in one sentence</p>
                </div>
                <div>
                  <h4 className="font-bold text-black mb-2">14. Culture as System</h4>
                  <p className="text-sm text-black/60">Intentionally designing culture, not letting it happen by accident</p>
                </div>
                <div>
                  <h4 className="font-bold text-black mb-2">15. Three Transitions</h4>
                  <p className="text-sm text-black/60">Working ON the business (strategy, structure) not just IN it</p>
                </div>
                <div>
                  <h4 className="font-bold text-black mb-2">16. Systems Thinking</h4>
                  <p className="text-sm text-black/60">Seeing patterns and root causes, not isolated incidents</p>
                </div>
                <div>
                  <h4 className="font-bold text-black mb-2">17. Organizational Design</h4>
                  <p className="text-sm text-black/60">Structuring the company for current and future scale</p>
                </div>
                <div>
                  <h4 className="font-bold text-black mb-2">18. Board & Governance</h4>
                  <p className="text-sm text-black/60">Proactively leveraging your board as strategic partners</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20" style={{ background: '#F7F3ED' }}>
        <div className="max-w-5xl mx-auto px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-black text-center mb-16">
            Three Steps to Measurable Growth
          </h2>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-2xl font-bold text-black mb-4">Assess</h3>
              <p className="font-semibold text-black mb-3">Complete your baseline assessment</p>
              <p className="text-black/60">100 questions across 18 dimensions in three 20-minute sessions. Honest, objective, comprehensive.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-2xl font-bold text-black mb-4">Track</h3>
              <p className="font-semibold text-black mb-3">Weekly check-ins via WhatsApp</p>
              <p className="text-black/60">Choose 3 dimensions to focus on per quarter. Answer 3 questions weekly. Track your progress over time.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-2xl font-bold text-black mb-4">Improve</h3>
              <p className="font-semibold text-black mb-3">Get tailored insights and frameworks</p>
              <p className="text-black/60">Your dashboard shows exactly where to focus. We prescribe specific frameworks from the Konstantin Method based on your scores. No guessing.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-8">
          <div className="bg-[#F7F3ED] p-12 rounded-lg border-l-4" style={{ borderColor: '#7FABC8' }}>
            <p className="text-lg text-black/80 leading-relaxed mb-6 italic">
              "Before CEO Lab, I was making decisions based on anxiety, not data. I'd wake up at 3am wondering if I was actually growing as a leader or just getting lucky. The assessment showed me my blind spots in black and white - my delegation score was 32%. That was the wake-up call. Now, 90 days later, I'm at 68% and my team is making decisions without me. The anxiety is gone. I know exactly where I stand and where to focus next. That clarity alone is worth 10x the price."
            </p>
            <p className="font-bold text-black">
              — Sarah Chen, Founder & CEO, Series A SaaS (40-person team)
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20" style={{ background: '#F7F3ED' }}>
        <div className="max-w-4xl mx-auto px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-black text-center mb-6">
            €100/Month for Measurable Leadership Growth
          </h2>
          <p className="text-xl text-black/60 text-center mb-12">
            One bad leadership decision costs more than a year of CEO Lab. This is the scoreboard you've been missing.
          </p>

          <div className="bg-white p-10 rounded-lg border-2 border-black/10 mb-12">
            <h3 className="text-2xl font-bold text-black mb-8 text-center">What's Included</h3>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-sm">✓</div>
                <div>
                  <h4 className="font-bold text-black mb-1">Full 18-Dimension Assessment</h4>
                  <p className="text-black/60">Updated with every weekly check-in. Track your progress over time across all leadership capabilities.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-sm">✓</div>
                <div>
                  <h4 className="font-bold text-black mb-1">Weekly WhatsApp Check-Ins</h4>
                  <p className="text-black/60">Choose your focus areas. Answer 3 questions. Build systematic growth habits.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-sm">✓</div>
                <div>
                  <h4 className="font-bold text-black mb-1">Personal Dashboard</h4>
                  <p className="text-black/60">Visual progress tracking. See your trends. Know where you're improving and where you're stuck.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-sm">✓</div>
                <div>
                  <h4 className="font-bold text-black mb-1">Prescribed Frameworks</h4>
                  <p className="text-black/60">Automatic recommendations from the Konstantin Method based on your scores. Exactly what you need, when you need it.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-sm">✓</div>
                <div>
                  <h4 className="font-bold text-black mb-1">AI-Generated Insights</h4>
                  <p className="text-black/60">Monthly, quarterly, and annual reports showing patterns, breakthroughs, and next-level focus areas.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-sm">✓</div>
                <div>
                  <h4 className="font-bold text-black mb-1">Priority Support</h4>
                  <p className="text-black/60">Direct access to Niko's team for questions, guidance, and troubleshooting.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link href="/assessment/hook" className="inline-block bg-black text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-black/90 transition-colors mb-4">
              Start Your Free Assessment
            </Link>
            <p className="text-sm text-black/50">
              No credit card required for the free snapshot. Premium membership: €100/month, cancel anytime.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-black py-20">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Your Team Already Sees What You Can't
          </h2>
          <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto">
            Every week without measurement is a week of invisible decline while competitors systematically improve.
          </p>
          <p className="text-xl text-white/70 mb-10">
            Athletes don't guess. They measure. They analyze. They improve.
          </p>
          <p className="text-xl text-white mb-10">
            You deserve the same.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/assessment/hook" className="bg-white text-black px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white/90 transition-colors">
              Measure Your Leadership (Free)
            </Link>
            <Link href="/contact" className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white/10 transition-colors">
              Book a Demo Call
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
          <p className="text-sm text-black/50">CEO Lab · Built on the Konstantin Method</p>
        </div>
      </footer>
    </div>
  )
}
