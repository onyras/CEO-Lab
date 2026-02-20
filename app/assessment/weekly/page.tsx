'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import { weeklyItems } from '@/lib/weekly-questions'
import { DIMENSIONS, getDimension, TERRITORY_COLORS } from '@/lib/constants'
import { AppShell } from '@/components/layout/AppShell'
import type { WeeklyItem, DimensionId, Territory } from '@/types/assessment'

// ─── Types ────────────────────────────────────────────────────────

type Phase = 'loading' | 'locked' | 'checkin' | 'submitting' | 'confirmation'

interface WeeklyResponse {
  dimensionId: DimensionId
  value: string | number
}

interface TrendResult {
  [dimensionId: string]: string
}

interface PreviousResponses {
  [dimensionId: string]: number // score 1-5
}

// ─── Helpers ──────────────────────────────────────────────────────

function getISOWeek(date: Date): number {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7))
  const week1 = new Date(d.getFullYear(), 0, 4)
  const weekNum = 1 + Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7)
  return Math.max(1, Math.min(53, weekNum))
}

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
  const [focusItems, setFocusItems] = useState<WeeklyItem[]>([])
  const [previousResponses, setPreviousResponses] = useState<PreviousResponses>({})
  const [streakWeek, setStreakWeek] = useState<number>(0)

  // Auth check + load focus dimensions on mount
  useEffect(() => {
    async function init() {
      const supabase = createClient()
      const { data: { user }, error: authError } = await supabase.auth.getUser()

      if (authError || !user) {
        router.push('/auth')
        return
      }

      // Check subscription
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('subscription_status')
        .eq('id', user.id)
        .single()

      const subStatus = profile?.subscription_status || 'inactive'
      const isSubscribed = subStatus === 'active' || subStatus === 'trialing'

      if (!isSubscribed) {
        setPhase('locked')
        return
      }

      // Load focus dimensions from API
      try {
        const res = await fetch('/api/v4/focus')
        const json = await res.json()

        if (json.success && json.dimensions && json.dimensions.length > 0) {
          // Filter weekly items to only focus dimensions
          const focusDimSet = new Set(json.dimensions as DimensionId[])
          const filtered = weeklyItems.filter(w => focusDimSet.has(w.dimensionId))
          setFocusItems(filtered)
        } else {
          // No focus dimensions set — redirect to setup
          router.push('/accountability/setup')
          return
        }
      } catch (e) {
        console.warn('Failed to load focus dimensions, showing all items:', e)
        setFocusItems(weeklyItems)
      }

      // Load previous week's responses + streak count
      try {
        const { data: pulseRows } = await supabase
          .from('weekly_pulse')
          .select('responded_at, dimension, score')
          .eq('ceo_id', user.id)
          .order('responded_at', { ascending: true })

        if (pulseRows && pulseRows.length > 0) {
          // Count unique weeks for streak
          const weekSet = new Set<string>()
          for (const row of pulseRows) {
            const d = new Date(row.responded_at)
            const weekNum = getISOWeek(d)
            weekSet.add(`${d.getFullYear()}-W${String(weekNum).padStart(2, '0')}`)
          }
          setStreakWeek(weekSet.size + 1) // This submission will be the next week

          // Get the most recent week's responses (excluding current week)
          const now = new Date()
          const currentWeekKey = `${now.getFullYear()}-W${String(getISOWeek(now)).padStart(2, '0')}`
          const previousRows = pulseRows.filter(row => {
            const d = new Date(row.responded_at)
            const weekKey = `${d.getFullYear()}-W${String(getISOWeek(d)).padStart(2, '0')}`
            return weekKey !== currentWeekKey
          })

          // Get latest score per dimension from previous weeks
          const prev: PreviousResponses = {}
          for (const row of previousRows) {
            prev[row.dimension] = row.score
          }
          setPreviousResponses(prev)
        } else {
          setStreakWeek(1) // First ever check-in
        }
      } catch (e) {
        console.warn('Failed to load previous responses:', e)
        setStreakWeek(1)
      }

      setPhase('checkin')
    }

    init()
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

    // All focus questions must be answered
    if (responses.size < focusItems.length) {
      setError('Please answer all questions before submitting.')
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
  }, [responses, focusItems])

  // ─── Loading ────────────────────────────────────────────────────

  if (phase === 'loading') {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="h-8 w-8 border-2 border-black/20 border-t-black rounded-full animate-spin" />
            <p className="text-black/50 text-sm font-medium">Loading...</p>
          </div>
        </div>
      </AppShell>
    )
  }

  // ─── Locked ────────────────────────────────────────────────────

  if (phase === 'locked') {
    return (
      <AppShell>
        <div className="flex items-center justify-center px-6 min-h-[80vh]">
        <div className="max-w-md w-full">
          <div className="bg-black/[0.02] border border-black/10 rounded-lg flex flex-col items-center justify-center py-12 px-6 text-center">
            <svg
              className="w-8 h-8 text-black/20 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
              />
            </svg>
            <p className="text-base text-black/50 mb-6">Subscribe to access weekly check-ins</p>
            <a
              href="/api/checkout"
              className="inline-block bg-black text-white px-8 py-3.5 rounded-lg text-sm font-semibold hover:bg-black/90 transition-colors"
            >
              Subscribe &mdash; &euro;100/mo
            </a>
          </div>
        </div>
        </div>
      </AppShell>
    )
  }

  // ─── Submitting ─────────────────────────────────────────────────

  if (phase === 'submitting') {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="h-8 w-8 border-2 border-black/20 border-t-black rounded-full animate-spin" />
            <p className="text-black/50 text-sm font-medium">Saving your responses...</p>
          </div>
        </div>
      </AppShell>
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
      <AppShell>
        <div className="flex items-center justify-center px-6 min-h-[80vh]">
        <div className="max-w-xl w-full">
          <div className="bg-white rounded-lg p-10 border border-black/10 text-center">
            <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center mx-auto mb-6">
              <svg className="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>

            <h1 className="text-3xl font-bold text-black mb-2">Check-in Logged</h1>
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
            <p className="text-base text-black/60 leading-relaxed mb-8">
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
                href="/ceolab/results"
                className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-white text-black border border-black/15 rounded-lg text-sm font-medium hover:border-black/30 transition-colors"
              >
                View Full Report
              </a>
            </div>
          </div>
        </div>
        </div>
      </AppShell>
    )
  }

  // ─── Check-in Form ──────────────────────────────────────────────

  const answeredCount = responses.size
  const canSubmit = answeredCount >= focusItems.length

  // Group focus items by territory
  const allGroups: { territory: Territory; label: string; items: WeeklyItem[] }[] = [
    {
      territory: 'leading_yourself' as Territory,
      label: 'Leading Yourself',
      items: focusItems.filter(w => getDimension(w.dimensionId).territory === 'leading_yourself'),
    },
    {
      territory: 'leading_teams' as Territory,
      label: 'Leading Teams',
      items: focusItems.filter(w => getDimension(w.dimensionId).territory === 'leading_teams'),
    },
    {
      territory: 'leading_organizations' as Territory,
      label: 'Leading Organizations',
      items: focusItems.filter(w => getDimension(w.dimensionId).territory === 'leading_organizations'),
    },
  ]
  const itemsByTerritory = allGroups.filter(g => g.items.length > 0)

  return (
    <AppShell>
      <div className="px-6 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <a
            href="/ceolab"
            className="inline-flex items-center gap-1 text-base text-black/50 hover:text-black/70 transition-colors mb-4"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Dashboard
          </a>
          <h1 className="text-3xl font-bold text-black tracking-tight mb-2">Weekly Check-In</h1>
          {streakWeek > 0 && (
            <p className="font-mono text-sm uppercase tracking-[0.12em] text-black/50 mb-1">
              Week {streakWeek} of your journey
            </p>
          )}
          <p className="text-black/50">
            {focusItems.length} questions on your focus areas
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
          <p className="text-base text-black/50">
            {answeredCount} of {focusItems.length} answered
          </p>
          <div className="w-32 bg-black/5 rounded-full h-1.5">
            <div
              className="h-1.5 bg-black rounded-full transition-all duration-300 ease-out"
              style={{ width: `${focusItems.length > 0 ? (answeredCount / focusItems.length) * 100 : 0}%` }}
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
                    previousScore={previousResponses[item.dimensionId]}
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
            <p className="text-center text-base text-black/50 mt-3">
              Answer all {focusItems.length} questions to submit
            </p>
          )}
        </div>
      </div>
      </div>
    </AppShell>
  )
}

// ─── Weekly Question Card Component ────────────────────────────────

const SCORE_LABELS: Record<number, string> = {
  1: 'Very Low',
  2: 'Low',
  3: 'Moderate',
  4: 'High',
  5: 'Very High',
}

const WeeklyQuestionCard = React.memo(function WeeklyQuestionCard({
  item,
  value,
  previousScore,
  onChange,
}: {
  item: WeeklyItem
  value: string | number | undefined
  previousScore?: number
  onChange: (value: string | number) => void
}) {
  const dimension = getDimension(item.dimensionId)
  const territoryColor = TERRITORY_COLORS[dimension.territory]
  const format = parseResponseFormat(item.responseFormat)
  const isAnswered = value !== undefined && value !== ''

  return (
    <div
      className={`bg-white rounded-lg p-6 border transition-colors ${
        isAnswered ? 'border-black/15' : 'border-black/5'
      }`}
    >
      {/* Dimension label + previous response */}
      <div className="flex items-center justify-between mb-3">
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
          style={{
            backgroundColor: `${territoryColor}15`,
            color: territoryColor,
          }}
        >
          {dimension.name}
        </span>
        {previousScore != null && (
          <span className="text-base text-black/50">
            Last week: {SCORE_LABELS[previousScore] || `${previousScore}/5`}
          </span>
        )}
      </div>

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
          {value === undefined ? (
            <button
              onClick={() => onChange(50)}
              className="w-full px-4 py-3 rounded-lg border border-black/10 bg-black/[0.02] text-black/30 text-sm text-left hover:border-black/20 transition-colors"
            >
              Tap to set percentage
            </button>
          ) : (
            <>
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
              <div className="flex justify-between text-base text-black/50">
                <span>0%</span>
                <span>100%</span>
              </div>
            </>
          )}
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
})
