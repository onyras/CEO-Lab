'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import {
  CheckSquare,
  Calendar,
  BarChart3,
  BookOpen,
  Info,
  ChevronDown,
  ClipboardCheck,
  TrendingUp,
  LineChart,
  Star,
} from 'lucide-react'

// ─── Data ──────────────────────────────────────────────────────────

const TESTIMONIALS = [
  {
    quote:
      "Before CEO Lab, I was making decisions based on anxiety, not data. I'd wake up at 3am wondering if I was actually growing as a leader or just getting lucky. The assessment showed me my blind spots in black and white - my delegation score was 32%. That was the wake-up call. Now, 90 days later, I'm at 68% and my team is making decisions without me. The anxiety is gone. I know exactly where I stand and where to focus next. That clarity alone is worth 10x the price.",
    author: 'Sarah Chen',
    role: 'Founder & CEO, Series A SaaS (40-person team)',
    avatar:
      'https://images.unsplash.com/photo-1701615004837-40d8573b6652?q=80&w=1480&auto=format&fit=crop',
  },
  {
    quote:
      "The 15 dimensions framework finally gave me a language to talk about leadership with my team. Before, it was all fuzzy concepts. Now we measure, track, and improve systematically. Our investor asked how we scaled culture so well - it's because we stopped guessing and started measuring.",
    author: 'Marcus Johnson',
    role: 'Co-Founder & CEO, Series B Fintech (120-person team)',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1287&auto=format&fit=crop',
  },
  {
    quote:
      "I hired three executive coaches over two years and never knew if I was actually getting better. CEO Lab gave me the dashboard I needed. Seeing my 'Grounded Presence' score go from 45% to 82% over six months wasn't just satisfying—it was proof that the work was working. That's powerful.",
    author: 'Elena Rodriguez',
    role: 'Founder & CEO, Series A EdTech (55-person team)',
    avatar:
      'https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=2670&auto=format&fit=crop',
  },
]

const DIMENSIONS = [
  {
    territory: 'Leading Yourself',
    subtitle: '5 dimensions focused on personal mastery',
    items: [
      {
        name: 'Self-Awareness',
        desc: 'Recognizing your patterns, triggers, and blind spots before they drive your behavior',
      },
      {
        name: 'Emotional Mastery',
        desc: 'Navigating emotions with precision without being hijacked or going numb',
      },
      {
        name: 'Grounded Presence',
        desc: 'Cultivating inner stillness for clear perception under pressure',
      },
      {
        name: 'Purpose & Mastery',
        desc: 'Clarity about what drives you and deliberate pursuit of your zone of genius',
      },
      {
        name: 'Peak Performance',
        desc: 'Protecting capacity for deep work and sustaining excellence over decades',
      },
    ],
  },
  {
    territory: 'Leading Teams',
    subtitle: '5 dimensions focused on people leadership',
    items: [
      {
        name: 'Building Trust',
        desc: 'Creating conditions where truth travels fast and mistakes surface early',
      },
      {
        name: 'Hard Conversations',
        desc: 'Saying what needs to be said while preserving the relationship',
      },
      {
        name: 'Diagnosing the Real Problem',
        desc: "Seeing what's actually broken beneath the surface symptoms",
      },
      {
        name: 'Team Operating System',
        desc: 'Designing the rhythms, cadences, and structures your team runs on',
      },
      {
        name: 'Leader Identity',
        desc: 'Knowing where you end and your team begins',
      },
    ],
  },
  {
    territory: 'Leading Organizations',
    subtitle: '5 dimensions focused on organizational impact',
    items: [
      {
        name: 'Strategic Clarity',
        desc: 'Making clear choices about where to play and how to win',
      },
      {
        name: 'Culture Design',
        desc: 'Designing culture as observable behaviors, not aspirational values',
      },
      {
        name: 'Organizational Architecture',
        desc: "Structuring the company for where you're going, not where you've been",
      },
      {
        name: 'CEO Evolution',
        desc: "Growing into what your company needs next, letting go of what it doesn't",
      },
      {
        name: 'Leading Change',
        desc: "Protecting what works while building what's next",
      },
    ],
  },
]

const FAQ_ITEMS = [
  {
    q: 'What is CEO Lab?',
    a: "CEO Lab is a leadership measurement platform that tracks your development across 15 dimensions. We give you what athletes have: a baseline, systematic tracking, and objective feedback on whether you're improving.",
  },
  {
    q: 'How is this different from other leadership assessments?',
    a: "Most assessments give you a one-time snapshot. CEO Lab tracks you over time with weekly check-ins, shows you your trends, and prescribes specific frameworks based on your scores. It's systematic measurement, not a one-off quiz.",
  },
  {
    q: "What's included in the membership?",
    a: 'Full 15-dimension assessment, weekly WhatsApp check-ins, personal dashboard with progress tracking, prescribed frameworks from the Konstantin Method, AI-generated insights, and priority support.',
  },
  {
    q: 'How much time does this take?',
    a: "Initial assessment: three 20-minute sessions. Weekly check-ins: 5 minutes via WhatsApp. Dashboard review: whenever you want. It's designed to be systematic without being time-consuming.",
  },
  {
    q: 'Can I share my results with my team?',
    a: 'Your results are private by default. You control what you share. We also offer team and organization packages where you can compare scores and track collective progress.',
  },
]

// ─── Nav ───────────────────────────────────────────────────────────

function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b border-black/10 bg-white/80">
      <div className="max-w-[1100px] mx-auto px-8 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-black no-underline">
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
              Get My Free CEO Score
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

// ─── Hero ──────────────────────────────────────────────────────────

function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const rotateX = useTransform(scrollYProgress, [0, 0.5], [45, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1.05, 1])

  return (
    <section className="relative bg-white overflow-hidden">
      {/* Grid + dots background */}
      <div className="hero-bg absolute inset-0" />

      <div
        ref={containerRef}
        className="min-h-[50rem] md:min-h-[80rem] flex items-start justify-center relative pt-48 md:pt-48 px-4 md:px-8 pb-4 md:pb-20 w-full"
      >
        <div className="w-full max-w-[1280px] mx-auto relative perspective-1000">
          {/* Header text */}
          <div className="relative w-full text-center">
            <h1 className="text-[48px] md:text-[52px] lg:text-[56px] font-bold text-black mb-6 leading-[1.1] tracking-tight">
              A measurement system for your
              <br />
              leadership development
            </h1>

            <p className="text-base md:text-lg text-black/60 leading-relaxed max-w-[42rem] mx-auto mb-10">
              CEO Lab tracks your growth across 15 leadership dimensions. Get
              instant scores, spot blind spots, and see what&apos;s really
              driving or blocking your growth.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
              <Link
                href="/assessment/hook"
                className="w-full sm:w-auto bg-black text-white px-8 py-3.5 rounded-lg text-base font-semibold hover:bg-black/90 transition-all duration-200 inline-flex items-center justify-center gap-2"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M10 4v12m-6-6h12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                Get My Free CEO Score
              </Link>
              <Link
                href="#problem"
                className="w-full sm:w-auto bg-transparent text-black border-2 border-black/10 px-8 py-3.5 rounded-lg text-base font-semibold hover:bg-black/5 hover:border-black/20 transition-all duration-200 text-center"
              >
                Learn more
              </Link>
            </div>

            <p className="text-sm text-black/40 mb-16">
              Free assessment &middot; No credit card required
            </p>
          </div>

          {/* Company logos */}
          <div className="max-w-[1100px] mx-auto mb-12 md:mb-16 px-8">
            <p className="text-xs text-black/40 text-center mb-6 uppercase tracking-widest">
              These companies use CEO Lab
            </p>
            <div className="flex justify-center items-center gap-12 flex-wrap opacity-40 grayscale">
              {[1, 2, 3, 4, 5].map((n) => (
                <Image
                  key={n}
                  src={`/logos/company${n}.svg`}
                  alt={`Company ${n}`}
                  width={120}
                  height={32}
                  className="h-8 w-auto"
                />
              ))}
            </div>
          </div>

          {/* 3D Dashboard Card */}
          <motion.div
            className="w-full max-w-[1280px] mx-auto h-[25rem] md:h-[40rem] relative"
            style={{
              rotateX,
              scale,
              transformStyle: 'preserve-3d',
            }}
          >
            <div className="hero-3d-card-inner h-full w-full border-4 border-[#6C6C6C] bg-[#222] rounded-[30px] shadow-2xl overflow-hidden flex items-center justify-center">
              <Image
                src="/dashboard-preview.svg"
                alt="CEO Lab Dashboard"
                fill
                className="object-cover rounded-[26px]"
                priority
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ─── Problem Section ──────────────────────────────────────────────

function ProblemSection() {
  return (
    <section id="problem" className="bg-white py-32 md:py-40 px-8">
      <div className="max-w-[1100px] mx-auto">
        {/* Opening Contrast */}
        <div className="mb-24">
          <span className="section-label block text-sm font-medium text-[#7FABC8] text-center mb-4 tracking-wide">
            {'> '}ceo-lab --problem
          </span>
          <h2 className="text-[42px] font-bold leading-[1.1] text-center mb-12 max-w-[900px] mx-auto">
            Athletes Have Post-Game Analysis.
            <br />
            What Do CEOs Have?
          </h2>

          {/* Comparison cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[56rem] mx-auto">
            {/* Athletes card */}
            <div className="bg-white border border-black/8 rounded-xl p-10 relative overflow-hidden">
              <div className="accent-bar-blue absolute top-0 left-0 right-0 h-1" />
              <h3 className="text-2xl font-bold mb-8 mt-2">Athletes</h3>
              <ul className="flex flex-col gap-5">
                {[
                  'Game footage review',
                  'Performance metrics tracked',
                  'Progress measured weekly',
                  'Blind spots identified',
                  'Improvement plan created',
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-base text-black/80"
                  >
                    <span className="font-bold text-[#7FABC8] flex-shrink-0">
                      &#10003;
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* CEOs card */}
            <div className="bg-white border border-black/8 rounded-xl p-10 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-black/6" />
              <h3 className="text-2xl font-bold mb-8 mt-2">CEOs</h3>
              <ul className="flex flex-col gap-5">
                {[
                  'Read books',
                  'Listen to podcasts',
                  'Maybe have a coach',
                  "Hope they're improving",
                  'No systematic tracking',
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-base text-black/40"
                  >
                    <span className="text-black/20 flex-shrink-0">&mdash;</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* The Question highlight */}
        <div className="mb-24 p-12 bg-gradient-to-br from-[#7FABC8]/8 to-[#A6BEA4]/8 rounded-xl text-center max-w-[56rem] mx-auto">
          <h2 className="text-[32px] font-bold leading-[1.2] mb-6">
            When was the last time you objectively measured your own leadership?
          </h2>
          <p className="text-lg text-black/60 leading-relaxed">
            Not your company&apos;s performance. Not your team&apos;s output.
            <br />
            <strong className="text-black font-semibold">
              Your leadership.
            </strong>
          </p>
        </div>

        {/* Cost icons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {[
            {
              icon: '❓',
              title: 'No Data',
              desc: 'Every decision based on gut feeling, not evidence',
            },
            {
              icon: '⚠️',
              title: 'Anxiety Fills the Gap',
              desc: '"Am I really the right person to lead this?"',
            },
            {
              icon: '📉',
              title: 'Invisible Decline',
              desc: 'Competitors who measure are improving faster',
            },
          ].map((item) => (
            <div key={item.title} className="text-center px-8 py-12">
              <div className="text-7xl mb-4 opacity-15">{item.icon}</div>
              <h4 className="text-lg font-semibold mb-3">{item.title}</h4>
              <p className="text-sm text-black/50">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Solution Bento Grid ──────────────────────────────────────────

function SolutionSection() {
  return (
    <section className="relative overflow-hidden bg-[#fafafa] py-16 px-8">
      {/* Grid background */}
      <div className="absolute inset-0 opacity-50 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

      <div className="max-w-[1000px] mx-auto relative">
        <span className="section-label block text-sm font-medium text-[#7FABC8] text-center mb-4 tracking-wide">
          {'> '}ceo-lab --solution
        </span>
        <h2 className="text-[42px] font-bold leading-[1.1] text-center mb-8">
          Your Leadership Scoreboard
        </h2>
        <p className="text-base text-black/60 leading-relaxed text-center max-w-[48rem] mx-auto mb-12">
          CEO Lab is a leadership measurement platform built on the Konstantin
          Method — 60+ frameworks synthesized from 15 years of work with Series
          A-C founders.
          <br />
          <br />
          We give you what athletes have: a baseline, systematic tracking, and
          objective feedback on whether you&apos;re improving.
          <br />
          <br />
          Not another content library. Not more frameworks to browse. A
          scoreboard that shows you — with data — where you stand and where to
          focus next.
        </p>

        {/* Bento Grid */}
        <div className="bento-grid">
          {/* Baseline Assessment - span 3 */}
          <div className="bento-card span-3">
            <div className="pattern-bg" />
            <div className="flex items-start gap-3 mb-4">
              <div className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-[#7FABC8]/15 to-[#A6BEA4]/15">
                <CheckSquare className="w-4 h-4 text-[#7FABC8]" />
              </div>
              <div>
                <h3 className="text-lg font-bold leading-tight">
                  Baseline Assessment
                </h3>
                <p className="text-sm text-black/60">
                  96 questions across 15 dimensions
                </p>
              </div>
            </div>
            <div className="mt-auto pt-5">
              <div className="assessment-grid">
                {Array.from({ length: 15 }, (_, i) => (
                  <div
                    key={i}
                    className={`dimension-dot ${i < 5 ? 'filled' : ''}`}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Weekly Tracking - span 3 */}
          <div className="bento-card span-3">
            <div className="pattern-bg" />
            <div className="flex items-start gap-3 mb-4">
              <div className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-[#7FABC8]/15 to-[#A6BEA4]/15">
                <Calendar className="w-4 h-4 text-[#7FABC8]" />
              </div>
              <div>
                <h3 className="text-lg font-bold leading-tight">
                  Weekly Tracking
                </h3>
                <p className="text-sm text-black/60">
                  Three questions via WhatsApp
                </p>
              </div>
            </div>
            <div className="mt-auto pt-5">
              <div className="streak-display">
                <div>
                  <div className="streak-number">8</div>
                  <div className="streak-label">Weeks</div>
                </div>
                <div className="streak-boxes">
                  {['✓', '✓', '✓', '○'].map((s, i) => (
                    <div
                      key={i}
                      className={`streak-box ${s === '✓' ? 'active' : ''}`}
                    >
                      {s}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard - span 2 */}
          <div className="bento-card span-2">
            <div className="pattern-bg" />
            <div className="flex items-start gap-3 mb-4">
              <div className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-[#7FABC8]/15 to-[#A6BEA4]/15">
                <BarChart3 className="w-4 h-4 text-[#7FABC8]" />
              </div>
              <div>
                <h3 className="text-lg font-bold leading-tight">Dashboard</h3>
                <p className="text-sm text-black/60">Track progress</p>
              </div>
            </div>
            <div className="mt-auto pt-5">
              <div className="flex flex-col gap-2.5">
                {[
                  { label: 'Self', pct: 85 },
                  { label: 'Teams', pct: 68 },
                  { label: 'Org', pct: 42 },
                ].map((row) => (
                  <div key={row.label} className="flex items-center gap-2.5">
                    <span className="text-[11px] font-semibold text-black/70 min-w-[60px]">
                      {row.label}
                    </span>
                    <div className="flex-1 h-1.5 bg-black/4 rounded-full overflow-hidden">
                      <div
                        className="progress-bar h-full rounded-full"
                        style={{ width: `${row.pct}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-bold text-[#7FABC8] min-w-[28px] text-right">
                      {row.pct}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Frameworks - span 5 */}
          <div className="bento-card span-5">
            <div className="pattern-bg" />
            <div className="flex items-start gap-3 mb-4">
              <div className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-[#7FABC8]/15 to-[#A6BEA4]/15">
                <BookOpen className="w-4 h-4 text-[#7FABC8]" />
              </div>
              <div>
                <h3 className="text-lg font-bold leading-tight">
                  Prescribed Frameworks
                </h3>
                <p className="text-sm text-black/60">
                  Exactly what to focus on based on your scores
                </p>
              </div>
            </div>
            <div className="mt-auto pt-5">
              <div className="framework-grid">
                {Array.from({ length: 20 }, (_, i) => (
                  <div key={i} className="framework-item" />
                ))}
              </div>
              <span className="inline-block mt-4 px-2.5 py-1 bg-[#7FABC8]/10 text-[#7FABC8] text-[10px] font-semibold rounded-full">
                60+ Proven Frameworks
              </span>
            </div>
          </div>

          {/* AI Insights - span 3 */}
          <div className="bento-card span-3">
            <div className="pattern-bg" />
            <div className="flex items-start gap-3 mb-4">
              <div className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-[#7FABC8]/15 to-[#A6BEA4]/15">
                <Info className="w-4 h-4 text-[#7FABC8]" />
              </div>
              <div>
                <h3 className="text-lg font-bold leading-tight">AI Insights</h3>
                <p className="text-sm text-black/60">Monthly pattern analysis</p>
              </div>
            </div>
            <div className="mt-auto pt-5">
              <div className="bg-gradient-to-br from-[#F7F3ED] to-[#F9F6F0] rounded-md p-4 border-l-2 border-[#7FABC8]">
                <div className="inline-flex items-center gap-1.5 text-[9px] font-bold text-[#7FABC8] tracking-wide mb-2.5">
                  <Star className="w-2.5 h-2.5 fill-[#7FABC8] text-[#7FABC8]" />
                  AI INSIGHT
                </div>
                <p className="text-xs leading-relaxed text-black/70">
                  Trust scores high but delegation low. Focus on Multiplier
                  framework.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Dimensions Accordion ─────────────────────────────────────────

function DimensionsSection() {
  const [openSections, setOpenSections] = useState<number[]>([])

  function toggleSection(idx: number) {
    setOpenSections((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    )
  }

  let dimCounter = 0

  return (
    <section className="bg-white py-16 px-8">
      <div className="max-w-[1000px] mx-auto">
        <span className="section-label block text-sm font-medium text-[#7FABC8] text-center mb-4 tracking-wide">
          {'> '}ceo-lab --dimensions
        </span>
        <h2 className="text-[42px] font-bold leading-[1.1] text-center mb-4">
          15 Leadership Dimensions
        </h2>
        <p className="text-lg text-black/60 text-center mb-16 max-w-[48rem] mx-auto">
          Click to explore each category of leadership
        </p>

        <div className="max-w-[900px] mx-auto flex flex-col gap-6">
          {DIMENSIONS.map((section, sectionIdx) => {
            const isOpen = openSections.includes(sectionIdx)
            const startNum = dimCounter
            dimCounter += section.items.length

            return (
              <div
                key={section.territory}
                className={`rounded-xl border overflow-hidden relative transition-all duration-300 ${
                  isOpen ? 'border-black/8' : 'border-black/8'
                }`}
              >
                {/* Left accent bar */}
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-[#7FABC8] to-[#A6BEA4] transition-opacity duration-300 ${
                    isOpen ? 'opacity-100' : 'opacity-0'
                  }`}
                />

                {/* Header */}
                <button
                  onClick={() => toggleSection(sectionIdx)}
                  className="w-full py-8 px-8 pl-10 bg-white hover:bg-black/[0.02] transition-all duration-300 flex justify-between items-center cursor-pointer text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#7FABC8]/10 to-[#A6BEA4]/10 rounded-xl flex items-center justify-center text-lg font-bold text-[#7FABC8]">
                      {sectionIdx + 1}
                    </div>
                    <div>
                      <h3 className="text-[22px] font-bold mb-1">
                        {section.territory}
                      </h3>
                      <p className="text-sm text-black/60">
                        {section.subtitle}
                      </p>
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-black/30 transition-all duration-300 flex-shrink-0 ${
                      isOpen ? 'rotate-180 text-[#7FABC8]' : ''
                    }`}
                  />
                </button>

                {/* Content */}
                <div
                  className={`overflow-hidden transition-all duration-400 ${
                    isOpen ? 'max-h-[2000px]' : 'max-h-0'
                  }`}
                >
                  <div className="px-8 pl-10 pb-8 flex flex-col gap-3">
                    {section.items.map((item, itemIdx) => (
                      <div
                        key={item.name}
                        className="flex gap-4 p-4 bg-black/[0.02] rounded-lg"
                      >
                        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-[#7FABC8] to-[#A6BEA4] text-white rounded-md flex items-center justify-center text-sm font-bold">
                          {startNum + itemIdx + 1}
                        </div>
                        <div>
                          <h4 className="text-[15px] font-semibold mb-1">
                            {item.name}
                          </h4>
                          <p className="text-[13px] text-black/60">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ─── How It Works ─────────────────────────────────────────────────

function HowItWorks() {
  const steps = [
    {
      icon: <ClipboardCheck className="w-6 h-6" />,
      title: 'Assess',
      subtitle: 'Complete your baseline assessment',
      desc: '96 questions across 15 dimensions in three focused sessions. Honest, objective, comprehensive.',
    },
    {
      icon: <LineChart className="w-6 h-6" />,
      title: 'Track',
      subtitle: 'Weekly check-ins via WhatsApp',
      desc: 'Choose 3 dimensions to focus on per quarter. Answer 3 questions weekly. Track your progress over time.',
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Improve',
      subtitle: 'Get tailored insights and frameworks',
      desc: 'Your dashboard shows exactly where to focus. We prescribe specific frameworks from the Konstantin Method based on your scores. No guessing.',
    },
  ]

  return (
    <section className="bg-white py-16 px-8">
      <div className="max-w-[1000px] mx-auto">
        <span className="section-label block text-sm font-medium text-[#7FABC8] text-center mb-4 tracking-wide">
          {'> '}ceo-lab --process
        </span>
        <h2 className="text-[42px] font-bold leading-[1.1] text-center mb-8">
          Three Steps to Measurable Growth
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="bg-white p-8 rounded-xl border border-black/10 text-center"
            >
              {/* Decorator */}
              <div className="relative w-36 h-36 mx-auto mb-4 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,black_1px,transparent_1px),linear-gradient(to_bottom,black_1px,transparent_1px)] bg-[size:24px_24px] opacity-10" />
                <div className="absolute inset-0 m-auto flex w-12 h-12 items-center justify-center bg-white border-t border-l border-black/10">
                  {step.icon}
                </div>
              </div>

              <h3 className="text-[28px] font-bold mb-3">{step.title}</h3>
              <p className="text-base font-semibold text-black/70 mb-6">
                {step.subtitle}
              </p>
              <p className="text-black/70 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Testimonial Carousel ─────────────────────────────────────────

function TestimonialSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  function handleSelect(index: number) {
    if (index === activeIndex || isAnimating) return
    setIsAnimating(true)

    // After fade-out duration, swap content
    setTimeout(() => {
      setActiveIndex(index)
      // After tiny delay, fade back in
      setTimeout(() => {
        setIsAnimating(false)
      }, 50)
    }, 200)
  }

  const current = TESTIMONIALS[activeIndex]

  return (
    <section className="bg-white py-16 px-8">
      <div className="max-w-[56rem] mx-auto">
        <div className="flex flex-col items-center gap-10 py-16">
          {/* Quote */}
          <div className="relative px-8">
            <span className="absolute -left-2 -top-12 text-[7rem] font-bold text-black/6 select-none pointer-events-none leading-none">
              &ldquo;
            </span>
            <p
              className={`text-xl md:text-2xl font-normal text-center max-w-[32rem] leading-relaxed text-black transition-all duration-400 ${
                isAnimating
                  ? 'opacity-0 blur-[4px] scale-[0.98]'
                  : 'opacity-100 blur-0 scale-100'
              }`}
            >
              {current.quote}
            </p>
            <span className="absolute -right-2 -bottom-16 text-[7rem] font-bold text-black/6 select-none pointer-events-none leading-none">
              &rdquo;
            </span>
          </div>

          {/* Footer */}
          <div className="flex flex-col items-center gap-6 mt-2">
            <p
              className={`text-xs text-black/50 tracking-[0.2em] uppercase transition-all duration-500 ${
                isAnimating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
              }`}
            >
              {current.role}
            </p>

            {/* Avatars */}
            <div className="flex items-center gap-2">
              {TESTIMONIALS.map((t, idx) => {
                const isActive = idx === activeIndex
                const isHovered = idx === hoveredIndex

                return (
                  <button
                    key={t.author}
                    onClick={() => handleSelect(idx)}
                    onMouseEnter={() => {
                      if (!isActive) setHoveredIndex(idx)
                    }}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className={`relative flex items-center rounded-full transition-all duration-500 border-none cursor-pointer overflow-hidden ${
                      isActive
                        ? 'bg-black shadow-lg px-4 py-2 pl-2'
                        : isHovered
                          ? 'bg-black/5 px-4 py-2 pl-2'
                          : 'bg-transparent p-0.5'
                    }`}
                  >
                    <div
                      className={`relative flex-shrink-0 w-8 h-8 rounded-full overflow-hidden transition-all duration-500 ${
                        isActive ? 'shadow-[0_0_0_2px_rgba(255,255,255,0.3)]' : ''
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={t.avatar}
                        alt={t.author}
                        className={`w-full h-full object-cover transition-transform duration-500 ${
                          !isActive && isHovered ? 'scale-105' : ''
                        }`}
                      />
                    </div>
                    <span
                      className={`text-sm font-medium whitespace-nowrap transition-all duration-500 overflow-hidden ${
                        isActive
                          ? 'max-w-[10rem] opacity-100 ml-2 text-white'
                          : isHovered
                            ? 'max-w-[10rem] opacity-100 ml-2 text-black'
                            : 'max-w-0 opacity-0 ml-0'
                      }`}
                    >
                      {t.author}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Pricing ──────────────────────────────────────────────────────

function PricingSection() {
  return (
    <section className="bg-white py-16 px-8">
      <div className="max-w-[1000px] mx-auto">
        <span className="section-label block text-sm font-medium text-[#7FABC8] text-center mb-4 tracking-wide">
          {'> '}ceo-lab --pricing
        </span>
        <div className="text-center max-w-[900px] mx-auto">
          <h2 className="text-[42px] font-bold leading-[1.2] mb-6">
            &euro;100/Month for Complete Leadership Tracking
          </h2>
          <p className="text-lg text-black/60 leading-[1.8] max-w-[800px] mx-auto mb-12">
            Baseline assessment, weekly accountability, progress dashboard,
            prescribed frameworks, AI insights, and priority support.
          </p>
          <div className="flex gap-4 justify-center flex-wrap mb-4">
            <Link
              href="/assessment/hook"
              className="bg-black text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-black/90 transition-colors"
            >
              Get My Free CEO Score
            </Link>
            <Link
              href="/auth"
              className="bg-transparent text-black border-2 border-black/10 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-black/5 transition-colors"
            >
              Book a Demo Call
            </Link>
          </div>
          <p className="text-sm text-black/50">
            No credit card required &middot; Cancel anytime
          </p>
        </div>
      </div>
    </section>
  )
}

// ─── FAQ Accordion ────────────────────────────────────────────────

function FAQSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  function toggleFAQ(idx: number) {
    setActiveIndex((prev) => (prev === idx ? null : idx))
  }

  return (
    <section className="bg-white py-16 px-8">
      <div className="max-w-[1000px] mx-auto">
        <div className="max-w-[800px] mx-auto">
          <p className="text-sm font-medium text-[#7FABC8] text-center mb-4 tracking-[0.1em] uppercase">
            Questions
          </p>
          <h2 className="text-[48px] font-bold text-center mb-16 leading-[1.1]">
            Frequently Asked
          </h2>

          <div className="flex flex-col gap-4">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = activeIndex === idx
              return (
                <div
                  key={idx}
                  className="bg-black/[0.02] rounded-xl overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => toggleFAQ(idx)}
                    className="w-full p-8 flex justify-between items-center cursor-pointer hover:bg-black/[0.03] transition-all duration-200 text-left bg-transparent border-none"
                  >
                    <p className="text-lg font-medium leading-relaxed flex-1 pr-8 text-black/90">
                      {item.q}
                    </p>
                    <div
                      className={`w-8 h-8 bg-[#7FABC8] text-white rounded-full flex items-center justify-center text-xl font-semibold flex-shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-45' : ''
                      }`}
                    >
                      +
                    </div>
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      isOpen ? 'max-h-[500px]' : 'max-h-0'
                    }`}
                  >
                    <div className="px-8 pb-8 text-base leading-relaxed text-black/60">
                      {item.a}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Final CTA ────────────────────────────────────────────────────

function FinalCTA() {
  return (
    <section className="bg-white py-16 px-8">
      <div className="max-w-[1000px] mx-auto">
        {/* Comparison cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="p-12 rounded-xl border border-black/8 bg-black/[0.02]">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-black/40 mb-4">
              Without Measurement
            </p>
            <h3 className="text-[28px] font-bold leading-[1.2] mb-4">
              Invisible Decline
            </h3>
            <p className="text-base text-black/60 leading-relaxed">
              Your team sees what you can&apos;t. Every week without data is a
              week of guessing. Competitors who measure are improving
              systematically while you operate blind.
            </p>
          </div>
          <div className="p-12 rounded-xl border-2 border-[#7FABC8] bg-gradient-to-br from-[#7FABC8]/8 to-[#A6BEA4]/8">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#7FABC8] mb-4">
              With CEO Lab
            </p>
            <h3 className="text-[28px] font-bold leading-[1.2] mb-4">
              Systematic Improvement
            </h3>
            <p className="text-base text-black/60 leading-relaxed">
              Athletes don&apos;t guess. They measure. They analyze. They
              improve. You deserve the same systematic approach to leadership
              development.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-8">
            Ready to Measure What Matters?
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/assessment/hook"
              className="bg-black text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-black/90 transition-colors"
            >
              Get My Free CEO Score
            </Link>
            <Link
              href="/auth"
              className="bg-transparent text-black border-2 border-black/10 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-black/5 transition-colors"
            >
              Book a Demo Call
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="bg-white border-t border-black/10 py-12 px-8">
      <div className="max-w-7xl mx-auto text-center">
        <div className="flex justify-center items-center gap-8 mb-4 flex-wrap">
          <Link
            href="/terms"
            className="text-black/60 hover:text-black text-sm"
          >
            Terms of Service
          </Link>
          <Link
            href="/privacy"
            className="text-black/60 hover:text-black text-sm"
          >
            Privacy Policy
          </Link>
          <Link
            href="/refund"
            className="text-black/60 hover:text-black text-sm"
          >
            Refund Policy
          </Link>
        </div>
        <p className="text-sm text-black/50">
          CEO Lab &middot; Built on the Konstantin Method
        </p>
      </div>
    </footer>
  )
}

// ─── Page ─────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-[Inter]">
      <Nav />
      <Hero />
      <ProblemSection />
      <SolutionSection />
      <DimensionsSection />
      <HowItWorks />
      <TestimonialSection />
      <PricingSection />
      <FAQSection />
      <FinalCTA />
      <Footer />
    </div>
  )
}
