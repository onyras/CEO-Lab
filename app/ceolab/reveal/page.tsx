'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import { DIMENSIONS } from '@/lib/constants'
import { getVerbalLabel } from '@/lib/scoring'
import {
  getTerritoryArcNarrative,
  ARCHETYPE_DESCRIPTIONS,
  DIMENSION_CONTENT,
} from '@/lib/report-content'
import type {
  FullResults,
  DimensionId,
  Territory,
} from '@/types/assessment'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TERRITORY_LABELS: Record<Territory, string> = {
  leading_yourself: 'Leading Yourself',
  leading_teams: 'Leading Teams',
  leading_organizations: 'Leading Organizations',
}

const TERRITORY_COLORS: Record<Territory, string> = {
  leading_yourself: '#7FABC8',
  leading_teams: '#A6BEA4',
  leading_organizations: '#E08F6A',
}

const STEPS = ['Your Score', 'Your Archetype', 'Three Territories', 'Where to Focus', "What's Next"] as const
type Step = (typeof STEPS)[number]

// ---------------------------------------------------------------------------
// Score Ring (simple animated version for reveal)
// ---------------------------------------------------------------------------

function AnimatedScoreRing({ score, size = 160 }: { score: number; size?: number }) {
  const [animatedScore, setAnimatedScore] = useState(0)

  useEffect(() => {
    let frame: number
    const duration = 1500
    const start = performance.now()

    function animate(now: number) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setAnimatedScore(Math.round(eased * score))
      if (progress < 1) {
        frame = requestAnimationFrame(animate)
      }
    }

    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [score])

  const strokeWidth = 10
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (animatedScore / 100) * circumference

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(0,0,0,0.05)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="black"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.05s linear' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold text-black">{animatedScore}%</span>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Step 1: Your Score
// ---------------------------------------------------------------------------

function StepScore({ results }: { results: FullResults }) {
  const clmi = results.session.clmi ?? 0
  const label = getVerbalLabel(clmi)

  return (
    <div className="flex flex-col items-center text-center">
      <p className="text-sm text-black/40 uppercase tracking-wider mb-8">
        CEO Leadership Maturity Index
      </p>
      <AnimatedScoreRing score={clmi} size={180} />
      <p className="mt-6 text-2xl font-bold text-black">{label}</p>
      <p className="mt-3 text-sm text-black/60 max-w-md leading-relaxed">
        This is your composite leadership maturity score across 15 dimensions.
        It reflects where you are right now — not a ceiling on where you can go.
      </p>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Step 2: Your Archetype
// ---------------------------------------------------------------------------

function StepArchetype({ results }: { results: FullResults }) {
  const primary = results.archetypes[0]
  if (!primary) return null

  const desc = ARCHETYPE_DESCRIPTIONS[primary.name]

  return (
    <div className="flex flex-col items-center text-center">
      <p className="text-sm text-black/40 uppercase tracking-wider mb-6">
        Your Primary Archetype
      </p>
      <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-full text-lg font-semibold mb-6">
        {primary.name}
      </div>
      {desc && (
        <>
          <p className="text-base text-black/80 max-w-lg leading-relaxed mb-6">
            {desc.oneSentence}
          </p>
          <div className="bg-black/[0.03] rounded-lg p-6 max-w-lg text-left">
            <p className="text-xs text-black/40 uppercase tracking-wider mb-2">
              What This Looks Like
            </p>
            <p className="text-sm text-black/70 leading-relaxed">
              {desc.whatThisLooksLike}
            </p>
          </div>
        </>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Step 3: Three Territories
// ---------------------------------------------------------------------------

function StepTerritories({ results }: { results: FullResults }) {
  const territories = results.territoryScores

  return (
    <div className="flex flex-col items-center">
      <p className="text-sm text-black/40 uppercase tracking-wider mb-8 text-center">
        The Three Territories of Leadership
      </p>
      <div className="w-full max-w-lg space-y-4">
        {territories.map((t) => {
          const label = TERRITORY_LABELS[t.territory]
          const color = TERRITORY_COLORS[t.territory]
          const narrative = getTerritoryArcNarrative(t.territory, t.score)

          return (
            <div
              key={t.territory}
              className="bg-white rounded-lg p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-black">{label}</span>
                <span className="text-sm font-bold" style={{ color }}>
                  {Math.round(t.score)}%
                </span>
              </div>
              <div className="w-full h-2 bg-black/5 rounded-full mb-3">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${t.score}%`, backgroundColor: color }}
                />
              </div>
              <p className="text-xs text-black/60 leading-relaxed">{narrative}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Step 4: Where to Focus
// ---------------------------------------------------------------------------

function StepFocus({ results }: { results: FullResults }) {
  const priorityIds = results.priorityDimensions.slice(0, 3)

  return (
    <div className="flex flex-col items-center">
      <p className="text-sm text-black/40 uppercase tracking-wider mb-3 text-center">
        Your Priority Dimensions
      </p>
      <p className="text-sm text-black/60 max-w-md text-center mb-8 leading-relaxed">
        These are the areas where focused work will have the greatest impact on your leadership right now.
      </p>
      <div className="w-full max-w-lg space-y-4">
        {priorityIds.map((dimId, i) => {
          const dim = DIMENSIONS.find((d) => d.id === dimId)
          const score = results.dimensionScores.find((ds) => ds.dimensionId === dimId)
          const content = DIMENSION_CONTENT[dimId]
          if (!dim || !score) return null

          const color = TERRITORY_COLORS[dim.territory]

          return (
            <div
              key={dimId}
              className="bg-white rounded-lg p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: color }}
                >
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-black">{dim.name}</span>
                    <span className="text-sm font-bold text-black/60">
                      {Math.round(score.percentage)}%
                    </span>
                  </div>
                  <p className="text-xs text-black/50 italic mb-2">{dim.coreQuestion}</p>
                  {content && (
                    <p className="text-xs text-black/60 leading-relaxed">
                      {content.costOfIgnoring.split('.').slice(0, 2).join('.') + '.'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Step 5: What's Next
// ---------------------------------------------------------------------------

function StepNext() {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mb-6">
        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-black mb-3">
        Set Up Your Weekly Check-In
      </h3>
      <p className="text-sm text-black/60 max-w-md leading-relaxed mb-2">
        Choose 3 focus dimensions for your weekly check-in.
        Every week, you'll answer 3 questions — 60 seconds — to track your progress.
      </p>
      <p className="text-xs text-black/40 max-w-sm leading-relaxed">
        This is the core habit that drives real change.
        CEOs who check in weekly see 2-3x faster improvement in their focus areas.
      </p>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main Reveal Page
// ---------------------------------------------------------------------------

export default function RevealPage() {
  const router = useRouter()
  const [results, setResults] = useState<FullResults | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth')
        return
      }

      // Check if reveal already seen
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('reveal_seen')
        .eq('id', user.id)
        .single()

      if (profile?.reveal_seen) {
        router.push('/ceolab')
        return
      }

      // Load results
      const res = await fetch('/api/v4/results')
      const json = await res.json()
      if (!json.success || !json.results) {
        setError('No assessment results found.')
        setLoading(false)
        return
      }

      setResults(json.results)
      setLoading(false)
    }
    load()
  }, [router])

  const markSeen = useCallback(async () => {
    try {
      await fetch('/api/v4/reveal-seen', { method: 'POST' })
    } catch {
      // Non-critical
    }
  }, [])

  const handleNext = useCallback(() => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((s) => s + 1)
    } else {
      // Final step — mark seen and go to accountability setup
      markSeen()
      router.push('/accountability/setup')
    }
  }, [currentStep, markSeen, router])

  const handleSkip = useCallback(() => {
    markSeen()
    router.push('/ceolab')
  }, [markSeen, router])

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F3ED] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-black/10 border-t-black rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-black/40">Preparing your results...</p>
        </div>
      </div>
    )
  }

  // Error
  if (error || !results) {
    return (
      <div className="min-h-screen bg-[#F7F3ED] flex items-center justify-center px-6">
        <div className="bg-white rounded-lg p-10 max-w-md w-full text-center shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <h2 className="text-xl font-bold text-black mb-3">Something went wrong</h2>
          <p className="text-sm text-black/60 mb-6">{error || 'Could not load results.'}</p>
          <button
            onClick={() => router.push('/ceolab')}
            className="bg-black text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-black/90 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    )
  }

  // Render current step
  const stepComponents = [
    <StepScore key="score" results={results} />,
    <StepArchetype key="archetype" results={results} />,
    <StepTerritories key="territories" results={results} />,
    <StepFocus key="focus" results={results} />,
    <StepNext key="next" />,
  ]

  const isLastStep = currentStep === STEPS.length - 1

  return (
    <div className="min-h-screen bg-[#F7F3ED] flex flex-col">
      {/* Skip button */}
      <div className="flex justify-end p-6">
        <button
          onClick={handleSkip}
          className="text-xs text-black/30 hover:text-black/60 transition-colors"
        >
          Skip to dashboard
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6 pb-8">
        <div className="w-full max-w-xl">
          {stepComponents[currentStep]}
        </div>
      </div>

      {/* Bottom navigation */}
      <div className="px-6 pb-10">
        <div className="max-w-xl mx-auto">
          {/* Progress dots */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === currentStep ? 'bg-black' : i < currentStep ? 'bg-black/30' : 'bg-black/10'
                }`}
              />
            ))}
          </div>

          {/* Next / CTA button */}
          <button
            onClick={handleNext}
            className="w-full bg-black text-white py-4 rounded-lg text-base font-semibold hover:bg-black/90 transition-colors"
          >
            {isLastStep ? 'Set Up Focus Dimensions' : 'Next'}
          </button>

          {/* Step counter */}
          <p className="text-center text-xs text-black/30 mt-3">
            {currentStep + 1} of {STEPS.length}
          </p>
        </div>
      </div>
    </div>
  )
}
