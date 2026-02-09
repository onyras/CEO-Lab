'use client'

import { useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import {
  Check,
  ClipboardCheck,
  LineChart,
  TrendingUp,
} from 'lucide-react'

// ─── Animation variants ─────────────────────────────────────────

const EASE = [0.25, 0.1, 0.25, 1] as [number, number, number, number]

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.3 },
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

const staggerScroll = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
}

// ─── Data ──────────────────────────────────────────────────────────

const DIMENSIONS = [
  {
    territory: 'Leading Yourself',
    items: ['Self-Awareness', 'Emotional Mastery', 'Grounded Presence', 'Purpose & Mastery', 'Peak Performance'],
  },
  {
    territory: 'Leading Teams',
    items: ['Building Trust', 'Hard Conversations', 'Diagnosing the Real Problem', 'Team Operating System', 'Leader Identity'],
  },
  {
    territory: 'Leading Organizations',
    items: ['Strategic Clarity', 'Culture Design', 'Organizational Architecture', 'CEO Evolution', 'Leading Change'],
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
      <div className="max-w-5xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link href="/test" className="flex items-center gap-2 text-black no-underline">
            <span className="text-xl font-bold">nk</span>
            <span className="text-xl font-light">CEO Lab</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/auth"
              className="text-sm text-black/60 hover:text-black transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/assessment/hook"
              className="bg-black text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-black/90 transition-colors"
            >
              Get My Free CEO Score
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────

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
      <div className="hero-bg absolute inset-0" style={{ maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)' }} />
      <div
        ref={containerRef}
        className="min-h-[50rem] md:min-h-[80rem] flex items-start justify-center relative pt-48 md:pt-48 px-4 md:px-8 pb-4 md:pb-20 w-full"
      >
        <div className="w-full max-w-[1280px] mx-auto relative perspective-1000">
          <motion.div
            className="relative w-full text-center"
            variants={stagger}
            initial="hidden"
            animate="show"
          >
            <motion.h1
              variants={fadeUp}
              className="text-[48px] md:text-[52px] lg:text-[56px] font-bold text-black mb-6 leading-[1.1] tracking-tight"
            >
              A measurement system for your
              <br />
              leadership development
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-base md:text-lg text-black/60 leading-relaxed max-w-[42rem] mx-auto mb-10"
            >
              CEO Lab tracks your growth across 15 leadership dimensions. Get
              instant scores, spot blind spots, and see what&apos;s really
              driving or blocking your growth.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6"
            >
              <Link
                href="/assessment/hook"
                className="w-full sm:w-auto bg-black text-white px-8 py-3.5 rounded-xl text-base font-medium hover:bg-black/90 transition-all duration-200 inline-flex items-center justify-center gap-2"
              >
                Get My Free CEO Score
              </Link>
              <Link
                href="#problem"
                className="w-full sm:w-auto text-black/70 hover:text-black px-8 py-3.5 text-base font-medium transition-colors text-center"
              >
                Learn more
              </Link>
            </motion.div>

            <motion.p variants={fadeUp} className="text-sm text-black/40 mb-16">
              Free assessment &middot; No credit card required
            </motion.p>
          </motion.div>

          <motion.div
            className="w-full max-w-[1280px] mx-auto h-[25rem] md:h-[40rem] relative"
            style={{ rotateX, scale, transformStyle: 'preserve-3d' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9, ease: EASE }}
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

// ─── Problem ──────────────────────────────────────────────────────

function ProblemSection() {
  return (
    <section id="problem" className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <motion.div
          className="mx-auto max-w-2xl text-center mb-16"
          variants={staggerScroll}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.h2
            variants={fadeUp}
            className="text-balance text-4xl font-semibold lg:text-5xl"
          >
            Athletes have post-game analysis. What do CEOs have?
          </motion.h2>
        </motion.div>

        <motion.div
          className="grid gap-8 md:grid-cols-2"
          variants={staggerScroll}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.div variants={fadeUp} className="rounded-2xl border p-8 md:p-10">
            <h3 className="text-xl font-semibold mb-6">Athletes</h3>
            <ul className="space-y-4">
              {[
                'Game footage review',
                'Performance metrics tracked',
                'Progress measured weekly',
                'Blind spots identified',
                'Improvement plan created',
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm">
                  <Check className="size-4 text-[#7FABC8] flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={fadeUp} className="rounded-2xl border border-dashed p-8 md:p-10">
            <h3 className="text-xl font-semibold mb-6">CEOs</h3>
            <ul className="space-y-4">
              {[
                'Read books',
                'Listen to podcasts',
                'Maybe have a coach',
                "Hope they're improving",
                'No systematic tracking',
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-black/40">
                  <span className="size-4 flex items-center justify-center text-black/20 flex-shrink-0">&mdash;</span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        <motion.div
          className="mx-auto max-w-xl mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <p className="text-2xl font-semibold">
            You can&apos;t improve what you don&apos;t measure.
          </p>
          <p className="mt-2 text-black/50">CEO Lab gives you the scoreboard.</p>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Solution ─────────────────────────────────────────────────────

function SolutionSection() {
  const features = [
    { title: 'Baseline Assessment', desc: '96 questions across 15 dimensions in three focused sessions.' },
    { title: 'Weekly Tracking', desc: 'Three questions via WhatsApp. Five minutes. Every week.' },
    { title: 'Personal Dashboard', desc: 'See your scores, track trends, and spot blind spots over time.' },
    { title: 'Prescribed Frameworks', desc: 'Specific tools from the Konstantin Method based on your scores.' },
    { title: 'AI Insights', desc: 'Monthly pattern analysis that connects the dots across dimensions.' },
    { title: 'Priority Support', desc: 'Direct access when you need guidance on your development.' },
  ]

  return (
    <section className="py-16 md:py-32 bg-zinc-50/50">
      <div className="mx-auto max-w-5xl px-6">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          variants={staggerScroll}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.h2 variants={fadeUp} className="text-balance text-4xl font-semibold lg:text-5xl">
            Your leadership scoreboard
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-4 text-black/60">
            Built on the Konstantin Method — 60+ frameworks from 15 years working with Series A-C founders.
            A scoreboard that shows you, with data, where you stand and where to focus next.
          </motion.p>
        </motion.div>

        <motion.div
          className="mx-auto mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          variants={staggerScroll}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
        >
          {features.map((f) => (
            <motion.div key={f.title} variants={fadeUp} className="rounded-2xl border bg-white p-6">
              <h3 className="font-medium mb-2">{f.title}</h3>
              <p className="text-sm text-black/50">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ─── Dimensions ───────────────────────────────────────────────────

function DimensionsSection() {
  const accents = ['border-[#7FABC8]', 'border-[#A6BEA4]', 'border-[#E08F6A]']
  const dots = ['bg-[#7FABC8]', 'bg-[#A6BEA4]', 'bg-[#E08F6A]']

  return (
    <section className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <motion.div
          className="mx-auto max-w-2xl text-center mb-16"
          variants={staggerScroll}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.h2 variants={fadeUp} className="text-balance text-4xl font-semibold lg:text-5xl">
            15 leadership dimensions
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-4 text-black/60">
            Three territories. Five dimensions each. The assessment reveals the depth.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid gap-6 md:grid-cols-3"
          variants={staggerScroll}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
        >
          {DIMENSIONS.map((section, idx) => (
            <motion.div
              key={section.territory}
              variants={fadeUp}
              className={`rounded-2xl border bg-white p-6 border-l-4 ${accents[idx]}`}
            >
              <h3 className="font-semibold text-lg mb-5">{section.territory}</h3>
              <ul className="space-y-3">
                {section.items.map((name) => (
                  <li key={name} className="flex items-center gap-2.5 text-sm text-black/70">
                    <span className={`size-1.5 rounded-full flex-shrink-0 ${dots[idx]}`} />
                    {name}
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
    { icon: <ClipboardCheck className="size-6" />, title: 'Assess', desc: '96 questions across 15 dimensions in three focused sessions. Honest, objective, comprehensive.' },
    { icon: <LineChart className="size-6" />, title: 'Track', desc: 'Choose 3 dimensions to focus on per quarter. Answer 3 questions weekly. Track your progress over time.' },
    { icon: <TrendingUp className="size-6" />, title: 'Improve', desc: 'Your dashboard shows exactly where to focus. Prescribed frameworks from the Konstantin Method. No guessing.' },
  ]

  return (
    <section className="py-16 md:py-32 bg-zinc-50/50">
      <div className="mx-auto max-w-5xl px-6">
        <motion.div
          className="mx-auto max-w-2xl text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <h2 className="text-balance text-4xl font-semibold lg:text-5xl">Three steps to measurable growth</h2>
        </motion.div>

        <motion.div
          className="grid gap-8 md:grid-cols-3"
          variants={staggerScroll}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
        >
          {steps.map((step) => (
            <motion.div key={step.title} variants={fadeUp} className="text-center">
              <div className="relative mx-auto size-36 mb-6 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.06)_1px,transparent_1px)] bg-[size:24px_24px]" />
                <div className="absolute inset-0 m-auto flex size-12 items-center justify-center bg-white border-l border-t border-black/10">
                  {step.icon}
                </div>
              </div>
              <h3 className="text-2xl font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-black/50 max-w-xs mx-auto">{step.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ─── Credentials ──────────────────────────────────────────────────

function CredentialsSection() {
  return (
    <section className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <motion.div
          className="mx-auto max-w-2xl text-center mb-16"
          variants={staggerScroll}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.h2 variants={fadeUp} className="text-balance text-4xl font-semibold lg:text-5xl">
            Built on real experience
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-4 text-black/60">
            Not theory. Not AI-generated advice. A measurement system built from
            thousands of hours coaching the people who build companies.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid gap-2 divide-y md:grid-cols-3 md:gap-8 md:divide-x md:divide-y-0"
          variants={staggerScroll}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
        >
          {[
            { value: '15', label: 'Years working with founders and CEOs' },
            { value: '60+', label: 'Frameworks synthesized into the Konstantin Method' },
            { value: 'A-C', label: 'Series stage founders we build this for' },
          ].map((stat) => (
            <motion.div key={stat.value} variants={fadeUp} className="py-8 md:py-0 text-center space-y-3">
              <div className="text-5xl font-bold">{stat.value}</div>
              <p className="text-sm text-black/50 max-w-[200px] mx-auto">{stat.label}</p>
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
    <section className="py-16 md:py-32 bg-zinc-50/50">
      <div className="mx-auto max-w-5xl px-6">
        <motion.div
          className="mx-auto max-w-xl text-center"
          variants={staggerScroll}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.h2 variants={fadeUp} className="text-balance text-4xl font-semibold lg:text-5xl mb-4">
            Simple pricing
          </motion.h2>
          <motion.p variants={fadeUp} className="text-black/60">
            Everything you need to measure and improve your leadership.
          </motion.p>
        </motion.div>

        <motion.div
          className="mx-auto mt-12 max-w-md rounded-2xl border bg-white p-8 md:p-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
        >
          <div className="text-center mb-8">
            <p className="text-sm font-medium text-black/50 mb-2">Complete Platform</p>
            <span className="text-4xl font-bold">&euro;100</span>
            <span className="text-black/50 ml-1">/month</span>
          </div>

          <hr className="border-dashed mb-8" />

          <ul className="space-y-3 mb-8">
            {[
              'Baseline assessment (15 dimensions)',
              'Weekly tracking via WhatsApp',
              'Personal progress dashboard',
              'Prescribed frameworks',
              'AI-generated insights',
              'Priority support',
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm">
                <Check className="size-4 text-[#7FABC8] flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-3">
            <Link
              href="/assessment/hook"
              className="bg-black text-white py-3 rounded-xl text-sm font-medium text-center hover:bg-black/90 transition-colors"
            >
              Get My Free CEO Score
            </Link>
            <Link
              href="/auth"
              className="border py-3 rounded-xl text-sm font-medium text-center text-black/70 hover:bg-zinc-50 transition-colors"
            >
              Book a Demo Call
            </Link>
          </div>

          <p className="text-xs text-center text-black/40 mt-4">
            No credit card required &middot; Cancel anytime
          </p>
        </motion.div>
      </div>
    </section>
  )
}

// ─── FAQ ──────────────────────────────────────────────────────────

function FAQSection() {
  return (
    <section className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <motion.div
          className="grid gap-y-12 lg:[grid-template-columns:1fr_auto]"
          variants={staggerScroll}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.div variants={fadeUp} className="text-center lg:text-left">
            <h2 className="text-3xl font-semibold md:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-black/50">Everything you need to know about CEO Lab.</p>
          </motion.div>

          <motion.div variants={fadeUp} className="divide-y divide-dashed sm:mx-auto sm:max-w-lg lg:mx-0">
            {FAQ_ITEMS.map((item, idx) => (
              <div key={idx} className="py-6">
                <h3 className="font-medium">{item.q}</h3>
                <p className="text-sm text-black/50 mt-3">{item.a}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Final CTA ────────────────────────────────────────────────────

function FinalCTA() {
  return (
    <section className="py-16 md:py-32 bg-zinc-50/50">
      <div className="mx-auto max-w-5xl px-6">
        <motion.div
          className="grid gap-8 md:grid-cols-2 mb-16"
          variants={staggerScroll}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.div variants={fadeUp} className="rounded-2xl border border-dashed p-8 md:p-10">
            <p className="text-xs font-medium uppercase tracking-widest text-black/40 mb-3">Without Measurement</p>
            <h3 className="text-2xl font-semibold mb-3">Invisible Decline</h3>
            <p className="text-sm text-black/50 leading-relaxed">
              Your team sees what you can&apos;t. Every week without data is a
              week of guessing. Competitors who measure are improving
              systematically while you operate blind.
            </p>
          </motion.div>
          <motion.div variants={fadeUp} className="rounded-2xl border-2 border-[#7FABC8] p-8 md:p-10">
            <p className="text-xs font-medium uppercase tracking-widest text-[#7FABC8] mb-3">With CEO Lab</p>
            <h3 className="text-2xl font-semibold mb-3">Systematic Improvement</h3>
            <p className="text-sm text-black/50 leading-relaxed">
              Athletes don&apos;t guess. They measure. They analyze. They
              improve. You deserve the same systematic approach to leadership
              development.
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          className="text-center"
          variants={staggerScroll}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.h2 variants={fadeUp} className="text-balance text-3xl font-semibold md:text-4xl mb-8">
            Ready to measure what matters?
          </motion.h2>
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link
              href="/assessment/hook"
              className="bg-black text-white px-8 py-3.5 rounded-xl text-sm font-medium hover:bg-black/90 transition-colors"
            >
              Get My Free CEO Score
            </Link>
            <Link
              href="/auth"
              className="text-sm font-medium text-black/60 hover:text-black px-8 py-3.5 transition-colors"
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
    <footer className="border-t py-8 px-6">
      <div className="mx-auto max-w-5xl flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-sm text-black/40">
          CEO Lab &middot; Built on the Konstantin Method
        </p>
        <div className="flex items-center gap-6">
          <Link href="/terms" className="text-sm text-black/40 hover:text-black transition-colors">Terms</Link>
          <Link href="/privacy" className="text-sm text-black/40 hover:text-black transition-colors">Privacy</Link>
          <Link href="/refund" className="text-sm text-black/40 hover:text-black transition-colors">Refunds</Link>
        </div>
      </div>
    </footer>
  )
}

// ─── Page ─────────────────────────────────────────────────────────

export default function TailarkTestPage() {
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
