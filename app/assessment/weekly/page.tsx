'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import { weeklyItems } from '@/lib/weekly-questions'
import { DIMENSIONS, getDimension } from '@/lib/constants'
import type { WeeklyItem, DimensionId, Territory } from '@/types/assessment'

// ─── Territory accent colors ──────────────────────────────────────

const TERRITORY_COLORS: Record<Territory, string> = {
  leading_yourself: '#7FABC8',
  leading_teams: '#A6BEA4',
  leading_organizations: '#E08F6A',
}

// ─── Types ────────────────────────────────────────────────────────

type Phase = 'loading' | 'checkin' | 'submitting' | 'confirmation'

interface WeeklyResponse {
  dimensionId: DimensionId
  value: string | number
}

interface TrendResult {
  [dimensionId: string]: string
}

// ─── Helpers ──────────────────────────────────────────────────────

function getCurrentQuarter(): string {
  const now = new Date()
  const quarter = Math.ceil((now.getMonth() + 1) / 3)
  return `${now.getFullYear()}-Q${quarter}`
}

/**
 * Parse responseFormat to determine input type and options.
 * Formats: 'number', 'percentage', 'select:Option1/Option2/...'
 */
function parseResponseFormat(format: string): {
  type: 'number' | 'percentage' | 'select'
  options?: string[]
} {
  if (format === 'number') return { type: 'number' }
  if (format === 'percentage') return { type: 'percentage' }
  if (format.startsWith('select:')) {
    const options = format.slice('select:'.length).split('/')
    return { type: 'select', options }
  }
  return { type: 'number' }
}

/**
 * Convert a weekly response value to a 1-5 score for storage.
 * - number: clip to 1-5 range, or use heuristic
 * - percentage: map 0-100 to 1-5
 * - select: map option index to evenly-spaced 1-5 score
 */
function toScore(value: string | number, format: string): number {
  const parsed = parseResponseFormat(format)

  if (parsed.type === 'number') {
    const num = typeof value === 'string' ? parseFloat(value) : value
    // Heuristic: clamp to 0-7 range, then map to 1-5
    const clamped = Math.max(0, Math.min(7, num))
    return Math.max(1, Math.min(5, Math.round((clamped / 7) * 4 + 1)))
  }

  if (parsed.type === 'percentage') {
    const pct = typeof value === 'string' ? parseFloat(value) : value
    const clamped = Math.max(0, Math.min(100, pct))
    return Math.max(1, Math.min(5, Math.round((clamped / 100) * 4 + 1)))
  }

  if (parsed.type === 'select' && parsed.options) {
    const index = typeof value === 'string'
      ? parsed.options.indexOf(value)
      : value
    if (index < 0) return 3 // Default to middle
    const optionCount = parsed.options.length
    if (optionCount <= 1) return 3
    // Map option index to 1-5 scale evenly
    return Math.round((index / (optionCount - 1)) * 4 + 1)
  }

  return 3
}

// ─── Component ────────────────────────────────────────────────────

export default function WeeklyPulsePage() {
  const router = useRouter()
  const [phase, setPhase] = useState<Phase>('loading')
  const [error, setError] = useState<string | null>(null)
  const [responses, setResponses] = useState<Map<string, string | number>>(new Map())
  const [trends, setTrends] = useState<TrendResult | null>(null)
  const [savedCount, setSavedCount] = useState(0)

  // Auth check on mount
  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient()
      const { data: { user }, error: authError } = await supabase.auth.getUser()

      if (authError || !user) {
        router.push('/auth')
        return
      }

      setPhase('checkin')
    }

    checkAuth()
  }, [router])

  // ─── Handlers ──────────────────────────────────────────────────

  const handleResponseChange = useCallback((itemId: string, value: string | number) => {
    setResponses((prev: Map<string, string | number>) => {
      const next = new Map(prev)
      next.set(itemId, value)
      return next
    })
  }, [])

  const handleSubmit = useCallback(async () => {
    setError(null)

    // Check minimum 3 responses
    if (responses.size < 3) {
      setError('Please answer at least 3 questions before submitting.')
      return
    }

    setPhase('submitting')

    try {
      // Build response payload
      const quarter = getCurrentQuarter()
      const responsePayload: { dimensionId: DimensionId; score: number }[] = []

      for (const [itemId, value] of responses.entries()) {
        const item = weeklyItems.find(w => w.id === itemId)
        if (!item) continue

        const score = toScore(value, item.responseFormat)
        responsePayload.push({
          dimensionId: item.dimensionId,
          score,
        })
      }

      const res = await fetch('/api/v4/weekly', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          responses: responsePayload,
          quarter,
        }),
      })

      const json = await res.json()

      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to submit check-in')
      }

      setSavedCount(json.saved || responsePayload.length)
      setTrends(json.trends || null)
      setPhase('confirmation')
    } catch (err: any) {
      console.error('Weekly submission error:', err)
      setError(err.message || 'Something went wrong. Please try again.')
      setPhase('checkin')
    }
  }, [responses])

  // ─── Loading ────────────────────────────────────────────────────

  if (phase === 'loading') {
    return (
      <div className="min-h-screen bg-[#F7F3ED] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 border-2 border-black/20 border-t-black rounded-full animate-spin" />
          <p className="text-black/50 text-sm font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  // ─── Submitting ─────────────────────────────────────────────────

  if (phase === 'submitting') {
    return (
      <div className="min-h-screen bg-[#F7F3ED] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 border-2 border-black/20 border-t-black rounded-full animate-spin" />
          <p className="text-black/50 text-sm font-medium">Saving your responses...</p>
        </div>
      </div>
    )
  }

  // ─── Confirmation ───────────────────────────────────────────────

  if (phase === 'confirmation') {
    const trendLabels: Record<string, string> = {
      improving: 'Improving',
      stable: 'Stable',
      declining: 'Declining',
      insufficient_data: 'Needs 8+ weeks',
    }

    const trendColors: Record<string, string> = {
      improving: '#A6BEA4',
      stable: '#7FABC8',
      declining: '#E08F6A',
      insufficient_data: '#000000',
    }

    return (
      <div className="min-h-screen bg-[#F7F3ED] flex items-center justify-center px-6">
        <div className="max-w-xl w-full">
          <div className="bg-white rounded-2xl p-10 border border-black/5 text-center">
            <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center mx-auto mb-6">
              <svg className="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>

            <h1 className="text-2xl font-bold text-black mb-2">Check-in Logged</h1>
            <p className="text-black/50 text-sm mb-8">
              {savedCount} response{savedCount !== 1 ? 's' : ''} saved for {getCurrentQuarter()}
            </p>

            {/* Trend Data */}
            {trends && Object.keys(trends).length > 0 && (
              <div className="text-left mb-8">
                <h3 className="text-sm font-semibold text-black mb-4">Dimension Trends</h3>
                <div className="space-y-3">
                  {(Object.entries(trends) as [string, string][]).map(([dimId, trend]) => {
                    const dim = getDimension(dimId as DimensionId)
                    const territoryColor = TERRITORY_COLORS[dim.territory]

                    return (
                      <div key={dimId} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ backgroundColor: territoryColor }}
                          />
                          <span className="text-sm text-black">{dim.name}</span>
                        </div>
                        <span
                          className="text-xs font-medium px-2.5 py-1 rounded-full"
                          style={{
                            backgroundColor: `${trendColors[trend] || '#000000'}15`,
                            color: trendColors[trend] || '#000000',
                          }}
                        >
                          {trendLabels[trend] || trend}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Trend explanation */}
            <p className="text-xs text-black/40 leading-relaxed mb-8">
              Trends appear after 8 weekly check-ins. Keep going — each week sharpens the picture.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="/ceolab"
                className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-black text-white rounded-lg text-sm font-medium hover:bg-black/90 transition-colors"
              >
                Back to CEO Lab
              </a>
              <a
                href="/ceolab"
                className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-white text-black border border-black/15 rounded-lg text-sm font-medium hover:border-black/30 transition-colors"
              >
                View Full Report
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ─── Check-in Form ──────────────────────────────────────────────

  const answeredCount = responses.size
  const canSubmit = answeredCount >= 3

  // Group items by territory
  const itemsByTerritory: { territory: Territory; label: string; items: WeeklyItem[] }[] = [
    {
      territory: 'leading_yourself',
      label: 'Leading Yourself',
      items: weeklyItems.filter(w => getDimension(w.dimensionId).territory === 'leading_yourself'),
    },
    {
      territory: 'leading_teams',
      label: 'Leading Teams',
      items: weeklyItems.filter(w => getDimension(w.dimensionId).territory === 'leading_teams'),
    },
    {
      territory: 'leading_organizations',
      label: 'Leading Organizations',
      items: weeklyItems.filter(w => getDimension(w.dimensionId).territory === 'leading_organizations'),
    },
  ]

  return (
    <div className="min-h-screen bg-[#F7F3ED] px-6 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <a
            href="/ceolab"
            className="inline-flex items-center gap-1 text-sm text-black/40 hover:text-black/70 transition-colors mb-4"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Dashboard
          </a>
          <h1 className="text-3xl font-bold text-black tracking-tight mb-2">Accountability Agent</h1>
          <p className="text-black/50">
            Answer the questions relevant to your focus this week. Minimum 3 required.
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
            {error}
          </div>
        )}

        {/* Progress indicator */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-black/40">
            {answeredCount} of {weeklyItems.length} answered
            {answeredCount < 3 && <span className="text-black/30"> (min 3)</span>}
          </p>
          <div className="w-32 bg-black/5 rounded-full h-1.5">
            <div
              className="h-1.5 bg-black rounded-full transition-all duration-300 ease-out"
              style={{ width: `${(answeredCount / weeklyItems.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Questions grouped by territory */}
        <div className="space-y-8">
          {itemsByTerritory.map(group => (
            <div key={group.territory}>
              {/* Territory Header */}
              <div className="flex items-center gap-2 mb-4">
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: TERRITORY_COLORS[group.territory] }}
                />
                <h2 className="text-sm font-semibold tracking-wide uppercase text-black/50">
                  {group.label}
                </h2>
              </div>

              {/* Items */}
              <div className="space-y-4">
                {group.items.map(item => (
                  <WeeklyQuestionCard
                    key={item.id}
                    item={item}
                    value={responses.get(item.id)}
                    onChange={(val) => handleResponseChange(item.id, val)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Submit */}
        <div className="mt-10 pb-8">
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={`w-full px-8 py-4 rounded-lg text-base font-semibold transition-all duration-150 ${
              canSubmit
                ? 'bg-black text-white hover:bg-black/90'
                : 'bg-black/10 text-black/30 cursor-not-allowed'
            }`}
          >
            Submit ({answeredCount} response{answeredCount !== 1 ? 's' : ''})
          </button>
          {!canSubmit && (
            <p className="text-center text-xs text-black/30 mt-3">
              Answer at least 3 questions to submit
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Weekly Question Card Component ────────────────────────────────

function WeeklyQuestionCard({
  item,
  value,
  onChange,
}: {
  item: WeeklyItem
  value: string | number | undefined
  onChange: (value: string | number) => void
}) {
  const dimension = getDimension(item.dimensionId)
  const territoryColor = TERRITORY_COLORS[dimension.territory]
  const format = parseResponseFormat(item.responseFormat)
  const isAnswered = value !== undefined && value !== ''

  return (
    <div
      className={`bg-white rounded-xl p-6 border transition-colors ${
        isAnswered ? 'border-black/15' : 'border-black/5'
      }`}
    >
      {/* Dimension label */}
      <span
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium mb-3"
        style={{
          backgroundColor: `${territoryColor}15`,
          color: territoryColor,
        }}
      >
        {dimension.name}
      </span>

      {/* Question text */}
      <p className="text-sm font-medium text-black leading-relaxed mb-4">
        {item.text}
      </p>

      {/* Response input based on format */}
      {format.type === 'number' && (
        <input
          type="number"
          min="0"
          step="1"
          value={value !== undefined ? value : ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value === '' ? '' : parseInt(e.target.value))}
          placeholder="Enter a number"
          className="w-full px-4 py-3 rounded-lg border border-black/10 bg-black/[0.02] text-black text-sm placeholder:text-black/30 focus:outline-none focus:border-black/30 focus:ring-1 focus:ring-black/10 transition-colors"
        />
      )}

      {format.type === 'percentage' && (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={typeof value === 'number' ? value : 50}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(parseInt(e.target.value))}
              className="flex-1 h-2 bg-black/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:cursor-pointer"
            />
            <span className="text-sm font-bold text-black w-12 text-right">
              {typeof value === 'number' ? value : 50}%
            </span>
          </div>
          <div className="flex justify-between text-xs text-black/30">
            <span>0%</span>
            <span>100%</span>
          </div>
        </div>
      )}

      {format.type === 'select' && format.options && (
        <div className="flex flex-wrap gap-2">
          {format.options.map(option => {
            const isSelected = value === option

            return (
              <button
                key={option}
                onClick={() => onChange(option)}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isSelected
                    ? 'bg-black text-white'
                    : 'bg-black/[0.03] text-black/70 hover:bg-black/[0.06] hover:text-black'
                }`}
              >
                {option}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
