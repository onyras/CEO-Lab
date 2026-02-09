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
  ClipboardCheck,
  TrendingUp,
  LineChart,
  Star,
} from 'lucide-react'

// ─── Animation Variants ─────────────────────────────────────────

const EASE = [0.25, 0.1, 0.25, 1] as [number, number, number, number]

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.3 },
  },
}

const staggerScroll = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE },
  },
}

// ─── Data ──────────────────────────────────────────────────────────

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
      {/* Grid + dots background — fades out at bottom */}
      <div className="hero-bg absolute inset-0" style={{ maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)' }} />

      <div
        ref={containerRef}
        className="min-h-[50rem] md:min-h-[80rem] flex items-start justify-center relative pt-48 md:pt-48 px-4 md:px-8 pb-4 md:pb-20 w-full"
      >
        <div className="w-full max-w-[1280px] mx-auto relative perspective-1000">
          {/* Header text */}
          <motion.div
            className="relative w-full text-center"
            variants={stagger}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={fadeUp}>
              <h1 className="text-[48px] md:text-[52px] lg:text-[56px] font-bold text-black mb-6 leading-[1.1] tracking-tight">
                A measurement system for your
                <br />
                leadership development
              </h1>
            </motion.div>

            <motion.div variants={fadeUp}>
              <p className="text-base md:text-lg text-black/60 leading-relaxed max-w-[42rem] mx-auto mb-10">
                CEO Lab tracks your growth across 15 leadership dimensions. Get
                instant scores, spot blind spots, and see what&apos;s really
                driving or blocking your growth.
              </p>
            </motion.div>

            <motion.div variants={fadeUp}>
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
            </motion.div>

            <motion.div variants={fadeUp}>
              <p className="text-sm text-black/40 mb-16">
                Free assessment &middot; No credit card required
              </p>
            </motion.div>
          </motion.div>

          {/* 3D Dashboard Card */}
          <motion.div
            className="w-full max-w-[1280px] mx-auto h-[25rem] md:h-[40rem] relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            style={{
              rotateX,
              scale,
              transformStyle: 'preserve-3d',
            }}
          >
            <div className="hero-3d-card-inner h-full w-full border-4 border-[#6C6C6C] bg-[#222] rounded-[30px] shadow-lg shadow-black/10 overflow-hidden flex items-center justify-center">
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
        <motion.div
          className="mb-24"
          variants={staggerScroll}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.div variants={fadeUp}>
            <h2 className="text-[42px] font-bold leading-[1.1] text-center mb-12 max-w-[900px] mx-auto">
              Athletes Have Post-Game Analysis.
              <br />
              What Do CEOs Have?
            </h2>
          </motion.div>

          {/* Comparison cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[56rem] mx-auto">
            {/* Athletes card */}
            <motion.div variants={fadeUp}>
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
            </motion.div>

            {/* CEOs card */}
            <motion.div variants={fadeUp}>
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
            </motion.div>
          </div>
        </motion.div>

        {/* Punchline */}
        <motion.div
          variants={staggerScroll}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.div variants={fadeUp}>
            <div className="text-center max-w-[56rem] mx-auto">
              <h2 className="text-[32px] font-bold leading-[1.2] mb-4">
                You can&apos;t improve what you don&apos;t measure.
              </h2>
              <p className="text-base text-black/60">
                CEO Lab gives you the scoreboard.
              </p>
            </div>
          </motion.div>
        </motion.div>
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

      <motion.div
        className="max-w-[1000px] mx-auto relative"
        variants={staggerScroll}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-100px' }}
      >
        <motion.div variants={fadeUp}>
          <h2 className="text-[42px] font-bold leading-[1.1] text-center mb-8">
            Your Leadership Scoreboard
          </h2>
        </motion.div>

        <motion.div variants={fadeUp}>
          <p className="text-base text-black/60 leading-relaxed text-center max-w-[48rem] mx-auto mb-12">
            Built on the Konstantin Method — 60+ frameworks from 15 years
            working with Series A-C founders. We give you what athletes have:
            a baseline, systematic tracking, and objective feedback on whether
            you&apos;re actually improving.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <motion.div variants={fadeUp}>
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
        </motion.div>
      </motion.div>
    </section>
  )
}

// ─── Dimensions Accordion ─────────────────────────────────────────

function DimensionsSection() {
  const territoryAccents = ['#7FABC8', '#A6BEA4', '#E08F6A']

  return (
    <section className="bg-white py-16 px-8">
      <div className="max-w-[1000px] mx-auto">
        <motion.div
          variants={staggerScroll}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          className="mb-16"
        >
          <motion.h2 variants={fadeUp} className="text-[42px] font-bold leading-[1.1] text-center mb-4">
            15 Leadership Dimensions
          </motion.h2>
          <motion.p variants={fadeUp} className="text-base text-black/60 text-center max-w-[48rem] mx-auto">
            Three territories. Five dimensions each. The assessment reveals the depth.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={staggerScroll}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
        >
          {DIMENSIONS.map((section, idx) => (
            <motion.div
              key={section.territory}
              variants={fadeUp}
              className="bg-white border border-black/8 rounded-xl p-8 relative overflow-hidden"
            >
              <div
                className="absolute top-0 left-0 right-0 h-1"
                style={{ backgroundColor: territoryAccents[idx] }}
              />
              <h3 className="text-xl font-bold mb-6 mt-2">{section.territory}</h3>
              <ul className="flex flex-col gap-3">
                {section.items.map((item) => (
                  <li
                    key={item.name}
                    className="text-[15px] text-black/70 flex items-center gap-2.5"
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: territoryAccents[idx] }}
                    />
                    {item.name}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
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
        <motion.h2
          className="text-[42px] font-bold leading-[1.1] text-center mb-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          Three Steps to Measurable Growth
        </motion.h2>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8"
          variants={staggerScroll}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
        >
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              variants={fadeUp}
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
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ─── Testimonial Carousel ─────────────────────────────────────────

function CredentialsSection() {
  const stats = [
    { value: '15', label: 'Years', desc: 'Working with founders and CEOs' },
    { value: '60+', label: 'Frameworks', desc: 'Synthesized into the Konstantin Method' },
    { value: 'Series A-C', label: 'Founders', desc: 'The leaders we build this for' },
  ]

  return (
    <section className="bg-white py-16 px-8">
      <div className="max-w-[1000px] mx-auto">
        <motion.div
          variants={staggerScroll}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          className="mb-16"
        >
          <motion.h2 variants={fadeUp} className="text-[42px] font-bold leading-[1.1] text-center mb-4">
            Built on Real Experience
          </motion.h2>
          <motion.p variants={fadeUp} className="text-base text-black/60 text-center max-w-[48rem] mx-auto">
            Not theory. Not AI-generated advice. A measurement system built from
            thousands of hours coaching the people who build companies.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={staggerScroll}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={fadeUp}
              className="bg-white border border-black/8 rounded-xl p-8 text-center"
            >
              <p className="text-[40px] font-bold text-black mb-1">{stat.value}</p>
              <p className="text-sm font-semibold text-[#7FABC8] uppercase tracking-wider mb-3">
                {stat.label}
              </p>
              <p className="text-sm text-black/60">{stat.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ─── Pricing ──────────────────────────────────────────────────────

function PricingSection() {
  return (
    <section className="bg-white py-16 px-8">
      <div className="max-w-[1000px] mx-auto">
        <motion.div
          className="text-center max-w-[900px] mx-auto"
          variants={staggerScroll}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.h2 variants={fadeUp} className="text-[42px] font-bold leading-[1.2] mb-6">
            &euro;100/Month for Complete Leadership Tracking
          </motion.h2>
          <motion.p variants={fadeUp} className="text-lg text-black/60 leading-[1.8] max-w-[800px] mx-auto mb-12">
            Baseline assessment, weekly accountability, progress dashboard,
            prescribed frameworks, AI insights, and priority support.
          </motion.p>
          <motion.div variants={fadeUp} className="flex gap-4 justify-center flex-wrap mb-4">
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
          </motion.div>
          <motion.p variants={fadeUp} className="text-sm text-black/50">
            No credit card required &middot; Cancel anytime
          </motion.p>
        </motion.div>
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
          <motion.div
            variants={staggerScroll}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-100px' }}
            className="mb-16"
          >
            <motion.p variants={fadeUp} className="text-sm font-medium text-[#7FABC8] text-center mb-4 tracking-[0.1em] uppercase">
              Questions
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-[48px] font-bold text-center leading-[1.1]">
              Frequently Asked
            </motion.h2>
          </motion.div>

          <motion.div
            className="flex flex-col gap-4"
            variants={staggerScroll}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-100px' }}
          >
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = activeIndex === idx
              return (
                <motion.div
                  key={idx}
                  variants={fadeUp}
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
                </motion.div>
              )
            })}
          </motion.div>
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
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12"
          variants={staggerScroll}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.div variants={fadeUp} className="p-12 rounded-xl border border-black/8 bg-black/[0.02]">
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
          </motion.div>
          <motion.div variants={fadeUp} className="p-12 rounded-xl border-2 border-[#7FABC8] bg-gradient-to-br from-[#7FABC8]/8 to-[#A6BEA4]/8">
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
          </motion.div>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center"
          variants={staggerScroll}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.h2 variants={fadeUp} className="text-4xl font-bold mb-8">
            Ready to Measure What Matters?
          </motion.h2>
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
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
          </motion.div>
        </motion.div>
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
      <CredentialsSection />
      <PricingSection />
      <FAQSection />
      <FinalCTA />
      <Footer />
    </div>
  )
}
