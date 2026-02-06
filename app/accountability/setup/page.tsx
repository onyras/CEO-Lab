'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import { DIMENSIONS, getDimension, getDimensionsByTerritory, TERRITORY_CONFIG } from '@/lib/constants'
import { selectPriorityDimensions } from '@/lib/scoring'
import type { DimensionId, DimensionScore, Territory, VerbalLabel } from '@/types/assessment'

// ─── Territory accent colors ──────────────────────────────────────

const TERRITORY_COLORS: Record<Territory, string> = {
  leading_yourself: '#7FABC8',
  leading_teams: '#A6BEA4',
  leading_organizations: '#E08F6A',
}

const TERRITORY_ORDER: Territory[] = [
  'leading_yourself',
  'leading_teams',
  'leading_organizations',
]

// ─── Types ────────────────────────────────────────────────────────

type Phase = 'loading' | 'intro' | 'select' | 'icebreaker' | 'done'

interface DimensionWithScore {
  dimensionId: DimensionId
  name: string
  territory: Territory
  percentage: number
  verbalLabel: VerbalLabel
}

// ─── Progress Indicator ───────────────────────────────────────────

function ProgressSteps({ currentStep }: { currentStep: number }) {
  const steps = ['Intro', 'Select', 'Ready']

  return (
    <div className="flex items-center justify-center gap-3 mb-10">
      {steps.map((label, i) => {
        const stepNum = i + 1
        const isActive = stepNum === currentStep
        const isComplete = stepNum < currentStep

        return (
          <div key={label} className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 ${
                  isComplete
                    ? 'bg-black text-white'
                    : isActive
                      ? 'border-2 border-black text-black'
                      : 'border border-black/15 text-black/30'
                }`}
              >
                {isComplete ? (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                ) : (
                  stepNum
                )}
              </div>
              <span
                className={`text-xs font-medium transition-colors duration-300 ${
                  isActive ? 'text-black' : isComplete ? 'text-black/60' : 'text-black/30'
                }`}
              >
                {label}
              </span>
            </div>

            {i < steps.length - 1 && (
              <div
                className={`w-10 h-px transition-colors duration-300 ${
                  isComplete ? 'bg-black' : 'bg-black/10'
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Loading Skeleton ─────────────────────────────────────────────

function SetupSkeleton() {
  return (
    <div className="min-h-screen bg-[#F7F3ED] px-6 py-12 font-[Inter]">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-center gap-3 mb-10">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-black/5 animate-pulse" />
              <div className="w-10 h-3 bg-black/5 rounded animate-pulse" />
              {i < 3 && <div className="w-10 h-px bg-black/5" />}
            </div>
          ))}
        </div>
        <div className="bg-white rounded-2xl p-10 border border-black/5">
          <div className="h-8 w-64 bg-black/5 rounded animate-pulse mx-auto mb-4" />
          <div className="h-4 w-96 bg-black/5 rounded animate-pulse mx-auto mb-8" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-black/[0.02] rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────

export default function AccountabilitySetupPage() {
  const router = useRouter()
  const [phase, setPhase] = useState<Phase>('loading')
  const [error, setError] = useState<string | null>(null)

  // Data from assessment
  const [allDimensions, setAllDimensions] = useState<DimensionWithScore[]>([])
  const [suggestedIds, setSuggestedIds] = useState<DimensionId[]>([])

  // User selections
  const [selectedIds, setSelectedIds] = useState<DimensionId[]>([])
  const [selectionMessage, setSelectionMessage] = useState<string | null>(null)

  // Ice-breaker
  const [excitement, setExcitement] = useState<number | null>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)

  // ── Load assessment data ──

  const loadData = useCallback(async () => {
    try {
      const supabase = createClient()

      // Check auth
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        router.push('/auth')
        return
      }

      // Get latest completed assessment session
      const { data: session, error: sessionError } = await supabase
        .from('assessment_sessions')
        .select('id, completed_at')
        .eq('ceo_id', user.id)
        .eq('version', '4.0')
        .not('completed_at', 'is', null)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (sessionError) {
        throw new Error(`Failed to load assessment session: ${sessionError.message}`)
      }

      if (!session) {
        // No completed assessment -- redirect to dashboard
        router.push('/dashboard')
        return
      }

      // Load dimension scores
      const { data: dimScores, error: dimError } = await supabase
        .from('dimension_scores')
        .select('dimension, percentage, verbal_label, composite, behavioral_mean, sji_scaled')
        .eq('session_id', session.id)

      if (dimError) {
        throw new Error(`Failed to load dimension scores: ${dimError.message}`)
      }

      if (!dimScores || dimScores.length === 0) {
        throw new Error('No dimension scores found for your assessment.')
      }

      // Build dimension score objects for the scoring function
      const dimensionScoreObjects: DimensionScore[] = dimScores.map((ds: {
        dimension: string
        percentage: number
        verbal_label: string
        composite: number
        behavioral_mean: number
        sji_scaled: number | null
      }) => ({
        dimensionId: ds.dimension as DimensionId,
        behavioralMean: ds.behavioral_mean ?? 0,
        sjiScaled: ds.sji_scaled ?? undefined,
        composite: ds.composite ?? 0,
        percentage: ds.percentage ?? 0,
        verbalLabel: (ds.verbal_label as VerbalLabel) ?? 'Building',
        confidence: 'full' as const,
      }))

      // Get priority dimensions using the scoring engine
      const priorities = selectPriorityDimensions(dimensionScoreObjects)
      const suggested3 = priorities.slice(0, 3)

      // Build display data for all 15 dimensions
      const allDims: DimensionWithScore[] = DIMENSIONS.map((dim) => {
        const score = dimScores.find((ds: { dimension: string }) => ds.dimension === dim.id)
        return {
          dimensionId: dim.id,
          name: dim.name,
          territory: dim.territory,
          percentage: score?.percentage ?? 0,
          verbalLabel: (score?.verbal_label as VerbalLabel) ?? 'Building',
        }
      })

      setAllDimensions(allDims)
      setSuggestedIds(suggested3)
      setSelectedIds(suggested3)
      setPhase('intro')
    } catch (err: any) {
      console.error('Setup load error:', err)
      setError(err.message || 'Failed to load your assessment data.')
      setPhase('intro')
    }
  }, [router])

  useEffect(() => {
    loadData()
  }, [loadData])

  // ── Selection logic ──

  const toggleDimension = (dimId: DimensionId) => {
    setSelectionMessage(null)

    if (selectedIds.includes(dimId)) {
      // Deselect
      setSelectedIds(prev => prev.filter(id => id !== dimId))
    } else {
      // Try to select
      if (selectedIds.length >= 3) {
        setSelectionMessage('Deselect one dimension first to choose a different one.')
        setTimeout(() => setSelectionMessage(null), 3000)
        return
      }
      setSelectedIds(prev => [...prev, dimId])
    }
  }

  // ── Save and complete ──

  const handleComplete = () => {
    // Save focus dimensions to localStorage
    localStorage.setItem('aa_focus_dimensions', JSON.stringify(selectedIds))
    localStorage.setItem('aa_icebreaker_completed', 'true')
    localStorage.setItem('aa_setup_completed_at', new Date().toISOString())

    setShowConfirmation(true)
    setTimeout(() => {
      router.push('/dashboard')
    }, 2000)
  }

  // ── Render ──

  if (phase === 'loading') {
    return <SetupSkeleton />
  }

  if (error && allDimensions.length === 0) {
    return (
      <div className="min-h-screen bg-[#F7F3ED] flex items-center justify-center px-6 font-[Inter]">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl p-8 border border-black/5">
            <h2 className="text-xl font-semibold text-black mb-3">Something went wrong</h2>
            <p className="text-black/60 text-sm mb-6">{error}</p>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-6 py-2.5 bg-black text-white rounded-lg text-sm font-medium hover:bg-black/90 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F7F3ED] px-6 py-12 font-[Inter]">
      <div className="max-w-2xl mx-auto">

        {/* Progress Steps */}
        <ProgressSteps
          currentStep={
            phase === 'intro' ? 1
            : phase === 'select' ? 2
            : 3
          }
        />

        {/* ═══ PHASE 1: Intro ═══ */}
        {phase === 'intro' && (
          <div className="bg-white rounded-2xl p-8 md:p-10 border border-black/5 text-center">
            {/* Decorative territory dots */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#7FABC8' }} />
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#A6BEA4' }} />
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#E08F6A' }} />
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-black tracking-tight mb-3">
              Set Up Your Accountability Agent
            </h1>
            <p className="text-base text-black/60 leading-relaxed max-w-lg mx-auto mb-8">
              Choose 3 dimensions to focus on this quarter. Every Monday, you'll get 3 questions to track your growth.
            </p>

            {/* Suggested dimensions preview */}
            <div className="mb-8">
              <p className="text-sm font-medium text-black/40 uppercase tracking-wider mb-4">
                Your assessment suggests these based on your results
              </p>

              <div className="space-y-3 max-w-md mx-auto">
                {suggestedIds.map((dimId) => {
                  const dim = allDimensions.find(d => d.dimensionId === dimId)
                  if (!dim) return null
                  const color = TERRITORY_COLORS[dim.territory]

                  return (
                    <div
                      key={dimId}
                      className="flex items-center gap-3 px-5 py-3.5 bg-[#F7F3ED] rounded-xl text-left"
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: color }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-black">{dim.name}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-sm font-bold text-black">{Math.round(dim.percentage)}%</span>
                        <span className="text-xs text-black/40">{dim.verbalLabel}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <button
              onClick={() => setPhase('select')}
              className="inline-block bg-black text-white px-10 py-4 rounded-lg text-base font-semibold hover:bg-black/90 transition-colors"
            >
              Continue
            </button>
          </div>
        )}

        {/* ═══ PHASE 2: Dimension Selection ═══ */}
        {phase === 'select' && (
          <div>
            {/* Header card */}
            <div className="bg-white rounded-2xl p-8 border border-black/5 mb-6 text-center">
              <h1 className="text-2xl font-bold text-black tracking-tight mb-2">
                Choose Your 3 Focus Dimensions
              </h1>
              <p className="text-sm text-black/50 mb-4">
                These will shape your weekly accountability check-ins. You can always change them later.
              </p>

              {/* Selection counter */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#F7F3ED] rounded-full">
                <span
                  className={`text-sm font-semibold transition-colors ${
                    selectedIds.length === 3 ? 'text-black' : 'text-black/50'
                  }`}
                >
                  {selectedIds.length} of 3 selected
                </span>
                {selectedIds.length === 3 && (
                  <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                )}
              </div>

              {/* Selection message */}
              {selectionMessage && (
                <p className="text-sm text-[#E08F6A] mt-3 transition-opacity duration-300">
                  {selectionMessage}
                </p>
              )}
            </div>

            {/* Territory groups */}
            {TERRITORY_ORDER.map((territory) => {
              const config = TERRITORY_CONFIG[territory]
              const color = TERRITORY_COLORS[territory]
              const dims = allDimensions.filter(d => d.territory === territory)

              return (
                <div key={territory} className="mb-6">
                  {/* Territory header */}
                  <div className="flex items-center gap-2.5 mb-3 px-1">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    <h2
                      className="text-sm font-semibold tracking-wide"
                      style={{ color }}
                    >
                      {config.displayLabel}
                    </h2>
                  </div>

                  {/* Dimension cards */}
                  <div className="space-y-2">
                    {dims.map((dim) => {
                      const isSelected = selectedIds.includes(dim.dimensionId)
                      const isSuggested = suggestedIds.includes(dim.dimensionId)

                      return (
                        <button
                          key={dim.dimensionId}
                          onClick={() => toggleDimension(dim.dimensionId)}
                          className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl border text-left transition-all duration-200 ${
                            isSelected
                              ? 'bg-white border-black/20 scale-[1.01] shadow-sm'
                              : 'bg-white border-black/5 hover:border-black/10'
                          }`}
                        >
                          {/* Checkbox */}
                          <div
                            className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                              isSelected
                                ? 'bg-black'
                                : 'border-2 border-black/15'
                            }`}
                          >
                            {isSelected && (
                              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                              </svg>
                            )}
                          </div>

                          {/* Dimension info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold text-black">{dim.name}</p>
                              {isSuggested && (
                                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#F7F3ED] text-black/40">
                                  Suggested
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Score */}
                          <div className="flex items-center gap-3 flex-shrink-0">
                            {/* Mini progress bar */}
                            <div className="w-16 bg-black/5 rounded-full h-1.5 hidden sm:block">
                              <div
                                className="h-1.5 rounded-full transition-all duration-500"
                                style={{
                                  width: `${Math.max(4, dim.percentage)}%`,
                                  backgroundColor: color,
                                }}
                              />
                            </div>
                            <span className="text-sm font-bold text-black w-10 text-right">
                              {Math.round(dim.percentage)}%
                            </span>
                            <span className="text-xs text-black/40 w-24 text-right hidden sm:block">
                              {dim.verbalLabel}
                            </span>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}

            {/* Confirm button */}
            <div className="mt-8 text-center">
              <button
                onClick={() => setPhase('icebreaker')}
                disabled={selectedIds.length !== 3}
                className={`inline-block px-10 py-4 rounded-lg text-base font-semibold transition-all duration-200 ${
                  selectedIds.length === 3
                    ? 'bg-black text-white hover:bg-black/90'
                    : 'bg-black/10 text-black/30 cursor-not-allowed'
                }`}
              >
                Confirm Selection
              </button>
              <p className="text-xs text-black/30 mt-3">
                You can change your focus dimensions at any time from the dashboard.
              </p>
            </div>
          </div>
        )}

        {/* ═══ PHASE 3: Ice-breaker ═══ */}
        {phase === 'icebreaker' && !showConfirmation && (
          <div className="bg-white rounded-2xl p-8 md:p-10 border border-black/5 text-center">
            <p className="text-sm font-medium text-black/40 uppercase tracking-wider mb-6">
              One more thing
            </p>

            <h2 className="text-2xl font-bold text-black tracking-tight mb-2">
              On a scale of 1-5, how excited are you to start this journey?
            </h2>
            <p className="text-sm text-black/50 mb-10">
              No wrong answers here.
            </p>

            {/* 1-5 Scale */}
            <div className="flex items-center justify-center gap-4 md:gap-6 mb-10">
              {[
                { value: 1, emoji: '\ud83d\ude10', label: 'Meh' },
                { value: 2, emoji: '\ud83e\udd14', label: 'Curious' },
                { value: 3, emoji: '\ud83d\ude42', label: 'Ready' },
                { value: 4, emoji: '\ud83d\ude04', label: 'Excited' },
                { value: 5, emoji: '\ud83d\udd25', label: "Let's go" },
              ].map((option) => {
                const isActive = excitement === option.value
                return (
                  <button
                    key={option.value}
                    onClick={() => setExcitement(option.value)}
                    className={`flex flex-col items-center gap-2 px-3 py-3 rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-[#F7F3ED] scale-110'
                        : 'hover:bg-[#F7F3ED]/50'
                    }`}
                  >
                    <span className={`text-3xl transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}>
                      {option.emoji}
                    </span>
                    <span className={`text-xs font-medium transition-colors ${
                      isActive ? 'text-black' : 'text-black/30'
                    }`}>
                      {option.label}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Summary of selected dimensions */}
            {excitement !== null && (
              <div className="mb-8 opacity-0 animate-fadeIn">
                <p className="text-sm text-black/40 mb-3">Your focus dimensions this quarter:</p>
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  {selectedIds.map((dimId) => {
                    const dim = allDimensions.find(d => d.dimensionId === dimId)
                    if (!dim) return null
                    return (
                      <span
                        key={dimId}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F7F3ED] rounded-full text-xs font-medium text-black"
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: TERRITORY_COLORS[dim.territory] }}
                        />
                        {dim.name}
                      </span>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Go to Dashboard */}
            <button
              onClick={handleComplete}
              disabled={excitement === null}
              className={`inline-block px-10 py-4 rounded-lg text-base font-semibold transition-all duration-200 ${
                excitement !== null
                  ? 'bg-black text-white hover:bg-black/90'
                  : 'bg-black/10 text-black/30 cursor-not-allowed'
              }`}
            >
              Go to Dashboard
            </button>
          </div>
        )}

        {/* ═══ Confirmation animation ═══ */}
        {showConfirmation && (
          <div className="bg-white rounded-2xl p-10 md:p-14 border border-black/5 text-center">
            {/* Animated check circle */}
            <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center mx-auto mb-6 animate-scaleIn">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-black mb-2">You're all set.</h2>
            <p className="text-sm text-black/50">
              Your Accountability Agent is ready. First check-in arrives next Monday.
            </p>
          </div>
        )}
      </div>

      {/* CSS animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.5);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-scaleIn {
          animation: scaleIn 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
