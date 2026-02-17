'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DIMENSIONS, ARCHETYPE_SIGNATURES, FRAMEWORK_PRESCRIPTIONS } from '@/lib/constants'
import { buildHookInsight, HOOK_NEXT_STEP, DIMENSION_CONTENT } from '@/lib/report-content'
import type { DimensionId, Territory } from '@/types/assessment'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TERRITORY_DISPLAY: Record<Territory, { label: string; color: string }> = {
  leading_yourself: { label: 'Leading Yourself', color: '#7FABC8' },
  leading_teams: { label: 'Leading Teams', color: '#A6BEA4' },
  leading_organizations: { label: 'Leading Organizations', color: '#E08F6A' },
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface HookData {
  hookSessionId: string
  lyScore: number
  ltScore: number
  loScore: number
  sharpestDimension: DimensionId
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function guessArchetypeFromScores(ly: number, lt: number, lo: number): string | null {
  // Map territory scores to a likely archetype based on highest/lowest territory
  const territories = [
    { key: 'leading_yourself' as Territory, score: ly },
    { key: 'leading_teams' as Territory, score: lt },
    { key: 'leading_organizations' as Territory, score: lo },
  ]
  const sorted = [...territories].sort((a, b) => b.score - a.score)
  const highest = sorted[0].key
  const lowest = sorted[2].key

  // Simple mapping based on strongest/weakest territory patterns
  if (highest === 'leading_yourself' && lowest === 'leading_organizations') {
    return 'Conscious Leader, Stuck'
  }
  if (highest === 'leading_yourself' && lowest === 'leading_teams') {
    return 'Lonely Operator'
  }
  if (highest === 'leading_teams' && lowest === 'leading_organizations') {
    return 'Scaling Wall'
  }
  if (highest === 'leading_organizations' && lowest === 'leading_yourself') {
    return 'Strategy Monk'
  }
  if (highest === 'leading_organizations' && lowest === 'leading_teams') {
    return 'Visionary Without Vehicle'
  }
  if (highest === 'leading_teams' && lowest === 'leading_yourself') {
    return 'Democratic Idealist'
  }

  return null
}

function getFrameworkForDimension(dimId: DimensionId, score: number): string | null {
  const prescriptions = FRAMEWORK_PRESCRIPTIONS[dimId]
  if (!prescriptions) return null
  if (score <= 40) return prescriptions.critical[0] || null
  if (score <= 60) return prescriptions.developing[0] || null
  return prescriptions.strong[0] || null
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function HookResultsPage() {
  const router = useRouter()
  const [hookData, setHookData] = useState<HookData | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('ceolab_hook_results')
    if (!stored) {
      router.push('/assessment/hook')
      return
    }
    try {
      setHookData(JSON.parse(stored))
    } catch {
      router.push('/assessment/hook')
    }
  }, [router])

  if (!hookData) {
    return (
      <div className="min-h-screen bg-[#F7F3ED] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-black/10 border-t-black rounded-full animate-spin" />
      </div>
    )
  }

  const { lyScore, ltScore, loScore, sharpestDimension } = hookData

  // Territory bars data
  const territories = [
    { key: 'leading_yourself' as Territory, score: lyScore },
    { key: 'leading_teams' as Territory, score: ltScore },
    { key: 'leading_organizations' as Territory, score: loScore },
  ]

  // Sharpest dimension info
  const sharpestDim = DIMENSIONS.find((d) => d.id === sharpestDimension)
  const sharpestScore = (() => {
    if (!sharpestDim) return 50
    if (sharpestDim.territory === 'leading_yourself') return lyScore
    if (sharpestDim.territory === 'leading_teams') return ltScore
    return loScore
  })()
  const isLow = sharpestScore < 50
  const insightText = sharpestDim
    ? buildHookInsight(sharpestDim.name, sharpestScore, isLow)
    : null

  // Archetype hint
  const archetypeHint = guessArchetypeFromScores(lyScore, ltScore, loScore)

  // Framework teaser
  const framework = getFrameworkForDimension(sharpestDimension, sharpestScore)

  return (
    <div className="min-h-screen bg-[#F7F3ED]">
      <div className="max-w-xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-sm text-black/40 uppercase tracking-wider mb-3">
            Your Leadership Snapshot
          </p>
          <h1 className="text-3xl font-bold text-black tracking-tight">
            Here's what we see
          </h1>
        </div>

        {/* Territory Scores */}
        <div className="bg-white rounded-lg p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] mb-4">
          <p className="text-xs text-black/40 uppercase tracking-wider mb-4">
            Three Territories of Leadership
          </p>
          <div className="space-y-4">
            {territories.map((t) => {
              const display = TERRITORY_DISPLAY[t.key]
              return (
                <div key={t.key}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-black">{display.label}</span>
                    <span className="text-sm font-bold" style={{ color: display.color }}>
                      {Math.round(t.score)}%
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-black/5 rounded-full">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${t.score}%`, backgroundColor: display.color }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Sharpest Dimension Insight */}
        {insightText && sharpestDim && (
          <div className="bg-white rounded-lg p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] mb-4">
            <p className="text-xs text-black/40 uppercase tracking-wider mb-2">
              {isLow ? 'Your Sharpest Gap' : 'Your Strongest Signal'}
            </p>
            <p className="text-base font-semibold text-black mb-2">
              {sharpestDim.name}
            </p>
            <p className="text-sm text-black/60 leading-relaxed">
              {insightText}
            </p>
          </div>
        )}

        {/* Archetype Hint */}
        {archetypeHint && (
          <div className="bg-white rounded-lg p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] mb-4">
            <p className="text-xs text-black/40 uppercase tracking-wider mb-2">
              Possible Archetype
            </p>
            <div className="inline-flex items-center px-4 py-2 bg-black/5 rounded-full mb-2">
              <span className="text-sm font-semibold text-black">{archetypeHint}</span>
            </div>
            <p className="text-xs text-black/50 leading-relaxed">
              Based on your territory pattern. The full assessment confirms this across 15 dimensions and reveals your complete leadership profile.
            </p>
          </div>
        )}

        {/* Framework Teaser */}
        {framework && sharpestDim && (
          <div className="bg-white rounded-lg p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] mb-8">
            <p className="text-xs text-black/40 uppercase tracking-wider mb-2">
              Recommended Framework
            </p>
            <p className="text-base font-semibold text-black mb-1">
              {framework}
            </p>
            <p className="text-xs text-black/50 leading-relaxed">
              This is the starting framework we'd recommend for {sharpestDim.name.toLowerCase()}.
              The full assessment unlocks your personalized 90-day development roadmap with framework prescriptions for all 15 dimensions.
            </p>
          </div>
        )}

        {/* CTA */}
        <div className="bg-black rounded-lg p-6 text-center">
          <p className="text-sm text-white/70 leading-relaxed mb-5">
            {HOOK_NEXT_STEP}
          </p>
          <a
            href="/auth"
            className="inline-block bg-white text-black px-8 py-4 rounded-lg text-base font-semibold hover:bg-white/90 transition-colors"
          >
            Get Your Full Profile
          </a>
        </div>

        {/* Fine print */}
        <p className="text-center text-xs text-black/30 mt-6">
          Create a free account to continue. Your snapshot data will be preserved.
        </p>
      </div>
    </div>
  )
}
