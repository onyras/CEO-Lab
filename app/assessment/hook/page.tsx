'use client'

import { useState, useEffect, useCallback } from 'react'
import { hookItems } from '@/lib/hook-questions'
import { getDimension } from '@/lib/constants'
import { getTerritoryArcNarrative, buildHookInsight, HOOK_NEXT_STEP } from '@/lib/report-content'
import type { DimensionId, Territory } from '@/types/assessment'

// ─── Territory display config ────────────────────────────────────────

const TERRITORY_DISPLAY: Record<Territory, { label: string; color: string }> = {
  leading_yourself: { label: 'Leading Yourself', color: '#7FABC8' },
  leading_teams: { label: 'Leading Teams', color: '#A6BEA4' },
  leading_organizations: { label: 'Leading Organizations', color: '#E08F6A' },
}

// ─── Types ───────────────────────────────────────────────────────────

type Phase = 'intro' | 'questions' | 'submitting' | 'results'

interface ResponseData {
  value: number
  responseTimeMs: number
}

interface HookResults {
  lyScore: number
  ltScore: number
  loScore: number
  sharpestDimension: DimensionId
}

// ─── Component ───────────────────────────────────────────────────────

export default function HookAssessmentPage() {
  const [phase, setPhase] = useState<Phase>('intro')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [responses, setResponses] = useState<Map<string, ResponseData>>(new Map())
  const [displayedAt, setDisplayedAt] = useState<number>(Date.now())
  const [submitting, setSubmitting] = useState(false)
  const [results, setResults] = useState<HookResults | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Track when a new question is shown
  useEffect(() => {
    if (phase === 'questions') {
      setDisplayedAt(Date.now())
    }
  }, [currentIndex, phase])

  // Current item
  const item = hookItems[currentIndex]
  const totalItems = hookItems.length
  const currentResponse = item ? responses.get(item.id) : undefined
  const hasAnswer = currentResponse !== undefined
  const isLastItem = currentIndex === totalItems - 1

  // Count completed items
  const completedCount = responses.size

  // ─── Handlers ────────────────────────────────────────────────────

  const handleStart = useCallback(() => {
    setPhase('questions')
    setDisplayedAt(Date.now())
  }, [])

  const handleSelectOption = useCallback((value: number) => {
    const now = Date.now()
    const responseTimeMs = now - displayedAt

    setResponses((prev: Map<string, ResponseData>) => {
      const next = new Map(prev)
      next.set(item.id, { value, responseTimeMs })
      return next
    })
  }, [displayedAt, item])

  const handleNext = useCallback(async () => {
    if (!hasAnswer) return

    if (isLastItem) {
      // Submit
      await handleSubmit()
    } else {
      setCurrentIndex((prev: number) => prev + 1)
    }
  }, [hasAnswer, isLastItem, currentIndex])

  const handleBack = useCallback(() => {
    if (currentIndex === 0) return
    setCurrentIndex((prev: number) => prev - 1)
  }, [currentIndex])

  const handleSubmit = useCallback(async () => {
    setPhase('submitting')
    setSubmitting(true)
    setError(null)

    try {
      const responsePayload = [...responses.entries()].map(([itemId, data]) => ({
        itemId,
        value: data.value,
      }))

      const res = await fetch('/api/v4/hook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ responses: responsePayload }),
      })

      const json = await res.json()

      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to submit assessment')
      }

      setResults({
        lyScore: json.scores.lyScore,
        ltScore: json.scores.ltScore,
        loScore: json.scores.loScore,
        sharpestDimension: json.scores.sharpestDimension,
      })
      setPhase('results')
    } catch (err: any) {
      console.error('Hook submission error:', err)
      setError(err.message || 'Something went wrong. Please try again.')
      setPhase('questions')
    } finally {
      setSubmitting(false)
    }
  }, [responses])

  // ─── Intro Screen ────────────────────────────────────────────────

  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-[#F7F3ED] flex items-center justify-center px-6">
        <div className="max-w-xl w-full text-center">
          <div className="mb-8">
            <p className="text-sm font-semibold tracking-widest uppercase text-black/40 mb-4">
              Free Assessment
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-black tracking-tight mb-4">
              CEO Leadership Snapshot
            </h1>
            <p className="text-lg text-black/60 leading-relaxed max-w-md mx-auto">
              10 questions across three territories of leadership.
              Get an instant read on where you stand as a CEO.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 mb-8 border border-black/10">
            <div className="flex items-center justify-between text-sm text-black/50">
              <span>10 questions</span>
              <span className="w-1 h-1 rounded-full bg-black/20" />
              <span>About 5 minutes</span>
              <span className="w-1 h-1 rounded-full bg-black/20" />
              <span>No account needed</span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 mb-12">
            <div className="flex gap-3">
              {(['leading_yourself', 'leading_teams', 'leading_organizations'] as Territory[]).map(t => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-black/60"
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: TERRITORY_DISPLAY[t].color }}
                  />
                  {TERRITORY_DISPLAY[t].label}
                </span>
              ))}
            </div>
          </div>

          <button
            onClick={handleStart}
            className="bg-black text-white px-10 py-4 rounded-lg text-lg font-semibold hover:bg-black/90 transition-colors"
          >
            Start Assessment
          </button>
        </div>
      </div>
    )
  }

  // ─── Submitting Screen ───────────────────────────────────────────

  if (phase === 'submitting') {
    return (
      <div className="min-h-screen bg-[#F7F3ED] flex items-center justify-center px-6">
        <div className="text-center">
          <div className="mb-4">
            <div className="w-8 h-8 border-2 border-black/20 border-t-black rounded-full animate-spin mx-auto" />
          </div>
          <p className="text-black/60 text-lg">Calculating your results...</p>
        </div>
      </div>
    )
  }

  // ─── Results Screen ──────────────────────────────────────────────

  if (phase === 'results' && results) {
    const sharpestDim = getDimension(results.sharpestDimension)
    const sharpestTerritory = TERRITORY_DISPLAY[sharpestDim.territory]

    // Determine if the sharpest dimension is a low score by checking
    // the actual response value for the hook item that maps to it
    const sharpestHookItem = hookItems.find(hi =>
      hi.dimensions.includes(results.sharpestDimension)
    )
    const sharpestResponseValue = sharpestHookItem
      ? responses.get(sharpestHookItem.id)?.value ?? 2.5
      : 2.5
    const isLow = sharpestResponseValue < 2.5

    const territories: { key: Territory; label: string; score: number; color: string }[] = [
      {
        key: 'leading_yourself' as Territory,
        label: 'Leading Yourself',
        score: results.lyScore,
        color: '#7FABC8',
      },
      {
        key: 'leading_teams' as Territory,
        label: 'Leading Teams',
        score: results.ltScore,
        color: '#A6BEA4',
      },
      {
        key: 'leading_organizations' as Territory,
        label: 'Leading Organizations',
        score: results.loScore,
        color: '#E08F6A',
      },
    ]

    return (
      <div className="min-h-screen bg-[#F7F3ED] px-6 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <p className="text-sm font-semibold tracking-widest uppercase text-black/40 mb-3">
              Your Results
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-black tracking-tight mb-3">
              Leadership Snapshot
            </h1>
            <p className="text-black/60 text-lg">
              Here is how you scored across the three territories.
            </p>
          </div>

          {/* Section 1: Your Territory Snapshot */}
          <div className="bg-white rounded-lg p-8 border border-black/10 mb-6">
            <h2 className="text-lg font-bold text-black mb-6">Your Territory Snapshot</h2>

            {/* Territory bar chart */}
            <div className="space-y-6 mb-8">
              {territories.map(t => (
                <div key={t.key}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: t.color }}
                      />
                      <span className="text-sm font-semibold text-black">{t.label}</span>
                    </div>
                    <span className="text-sm font-bold text-black">{Math.round(t.score)}%</span>
                  </div>
                  <div className="w-full bg-black/5 rounded-full h-3">
                    <div
                      className="h-3 rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: `${Math.max(2, t.score)}%`,
                        backgroundColor: t.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Territory arc narratives */}
            <div className="space-y-4">
              {territories.map(t => (
                <div key={t.key} className="flex gap-3">
                  <span
                    className="w-1 flex-shrink-0 rounded-full mt-1"
                    style={{ backgroundColor: t.color }}
                  />
                  <p className="text-sm text-black/70 leading-relaxed">
                    <span className="font-semibold text-black">{t.label}:</span>{' '}
                    {getTerritoryArcNarrative(t.key, t.score)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Your Sharpest Insight */}
          <div className="bg-white rounded-lg p-8 border border-black/10 mb-6">
            <h2 className="text-lg font-bold text-black mb-4">Your Sharpest Insight</h2>

            <div className="flex items-center gap-2 mb-4">
              <span
                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold text-white"
                style={{ backgroundColor: sharpestTerritory.color }}
              >
                {sharpestTerritory.label}
              </span>
            </div>

            <h3 className="text-xl font-bold text-black mb-3">{sharpestDim.name}</h3>

            <p className="text-black/70 leading-relaxed mb-4">
              {buildHookInsight(sharpestDim.name, sharpestResponseValue, isLow)}
            </p>

            <div className="bg-[#F7F3ED] rounded-lg p-4">
              <p className="text-xs font-semibold tracking-widest uppercase text-black/40 mb-1">
                Core Question
              </p>
              <p className="text-sm text-black/80 italic leading-relaxed">
                {sharpestDim.coreQuestion}
              </p>
            </div>
          </div>

          {/* Section 3: Your Next Step */}
          <div className="bg-white rounded-lg p-8 border border-black/10 mb-8">
            <h2 className="text-lg font-bold text-black mb-4">Your Next Step</h2>
            <p className="text-black/70 leading-relaxed mb-6">
              {HOOK_NEXT_STEP}
            </p>
            <div className="text-center">
              <a
                href="/auth"
                className="inline-block bg-black text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-black/90 transition-colors"
              >
                Take the Full Assessment
              </a>
            </div>
          </div>

          {/* Retake */}
          <div className="text-center mt-6">
            <button
              onClick={() => {
                setPhase('intro')
                setCurrentIndex(0)
                setResponses(new Map())
                setResults(null)
                setError(null)
              }}
              className="text-sm text-black/40 hover:text-black/70 transition-colors"
            >
              Retake assessment
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ─── Questions Screen ────────────────────────────────────────────

  const territory = TERRITORY_DISPLAY[item.territory]

  return (
    <div className="min-h-screen bg-[#F7F3ED] flex flex-col">
      {/* Progress Bar */}
      <div className="w-full bg-black/5 h-1">
        <div
          className="h-1 bg-black transition-all duration-300 ease-out"
          style={{ width: `${(completedCount / totalItems) * 100}%` }}
        />
      </div>

      {/* Header */}
      <div className="px-6 pt-6 pb-2">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <p className="text-sm text-black/40 font-medium">
            {currentIndex + 1} of {totalItems}
          </p>
          <p className="text-sm text-black/40 font-medium">
            CEO Leadership Snapshot
          </p>
        </div>
      </div>

      {/* Question Area */}
      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="max-w-2xl w-full">
          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
              {error}
            </div>
          )}

          {/* Territory Badge */}
          <div className="mb-6">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{
                backgroundColor: `${territory.color}20`,
                color: territory.color,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: territory.color }}
              />
              {territory.label}
            </span>
          </div>

          {/* Question Text */}
          <h2 className="text-2xl md:text-3xl font-bold text-black leading-tight mb-8">
            {item.text}
          </h2>

          {/* Option Cards */}
          <div className="space-y-3 mb-10">
            {item.options.map((option) => {
              const isSelected = currentResponse?.value === option.value

              return (
                <button
                  key={option.value}
                  onClick={() => handleSelectOption(option.value)}
                  className={`
                    w-full text-left p-5 rounded-lg border-2 transition-all duration-150
                    ${isSelected
                      ? 'border-black bg-black text-white'
                      : 'border-black/10 bg-white hover:border-black/30 text-black'
                    }
                  `}
                >
                  <span className={`text-base leading-relaxed ${isSelected ? 'text-white' : 'text-black'}`}>
                    {option.text}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              disabled={currentIndex === 0}
              className={`
                flex items-center gap-1 px-4 py-3 text-sm font-medium transition-colors
                ${currentIndex === 0
                  ? 'text-black/20 cursor-not-allowed'
                  : 'text-black/50 hover:text-black'
                }
              `}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="flex-shrink-0"
              >
                <path
                  d="M10 12L6 8L10 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Back
            </button>

            <button
              onClick={handleNext}
              disabled={!hasAnswer || submitting}
              className={`
                px-8 py-3 rounded-lg text-base font-semibold transition-all duration-150
                ${hasAnswer
                  ? 'bg-black text-white hover:bg-black/90'
                  : 'bg-black/10 text-black/30 cursor-not-allowed'
                }
              `}
            >
              {isLastItem ? 'See Results' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
