'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import { mirrorItems } from '@/lib/mirror-questions'
import { DIMENSIONS, getDimension } from '@/lib/constants'
import type { MirrorItem, DimensionId, Territory, ScaleType } from '@/types/assessment'

// ─── Territory accent colors ──────────────────────────────────────

const TERRITORY_COLORS: Record<Territory, string> = {
  leading_yourself: '#7FABC8',
  leading_teams: '#A6BEA4',
  leading_organizations: '#E08F6A',
}

// ─── Likert Scale Labels ──────────────────────────────────────────

const SCALE_LABELS: Record<string, string[]> = {
  frequency: ['Almost Never', 'Rarely', 'Sometimes', 'Often', 'Almost Always'],
  degree: ['Not at all', 'Slightly', 'Moderately', 'Mostly', 'Completely'],
}

// ─── Relationship Options ─────────────────────────────────────────

const RELATIONSHIP_OPTIONS = [
  'Direct report',
  'Peer',
  'Board member',
  'Coach/mentor',
  'Other',
]

// ─── Types ────────────────────────────────────────────────────────

type CeoPhase = 'loading' | 'invite' | 'creating' | 'link-ready'
type RaterPhase = 'loading' | 'assessment' | 'submitting' | 'thank-you' | 'error'

interface MirrorResponseData {
  dimensionId: DimensionId
  rawResponse: number
}

// ═══════════════════════════════════════════════════════════════════
// Main component — detects mode from URL params
// ═══════════════════════════════════════════════════════════════════

export default function MirrorPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  if (token) {
    return <RaterMode token={token} />
  }

  return <CeoMode />
}

// ═══════════════════════════════════════════════════════════════════
// CEO Mode: Invite a mirror rater
// ═══════════════════════════════════════════════════════════════════

function CeoMode() {
  const router = useRouter()
  const [phase, setPhase] = useState<CeoPhase>('loading')
  const [error, setError] = useState<string | null>(null)
  const [raterEmail, setRaterEmail] = useState('')
  const [raterRelationship, setRaterRelationship] = useState('')
  const [mirrorLink, setMirrorLink] = useState('')
  const [copied, setCopied] = useState(false)

  // Auth check on mount
  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient()
      const { data: { user }, error: authError } = await supabase.auth.getUser()

      if (authError || !user) {
        router.push('/auth')
        return
      }

      setPhase('invite')
    }

    checkAuth()
  }, [router])

  // ─── Create Mirror Session ──────────────────────────────────────

  const handleCreateInvite = useCallback(async () => {
    setError(null)

    if (!raterEmail.trim()) {
      setError('Please enter the rater\'s email address.')
      return
    }

    if (!raterRelationship) {
      setError('Please select the rater\'s relationship to you.')
      return
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raterEmail.trim())) {
      setError('Please enter a valid email address.')
      return
    }

    setPhase('creating')

    try {
      const supabase = createClient()

      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth')
        return
      }

      // Find the user's latest completed assessment session
      const { data: sessions, error: sessionError } = await supabase
        .from('assessment_sessions')
        .select('id')
        .eq('ceo_id', user.id)
        .not('completed_at', 'is', null)
        .order('completed_at', { ascending: false })
        .limit(1)

      if (sessionError) {
        throw new Error(`Failed to find assessment: ${sessionError.message}`)
      }

      if (!sessions || sessions.length === 0) {
        throw new Error('You need to complete the baseline assessment before inviting a mirror rater.')
      }

      const sessionId = sessions[0].id

      // Create the mirror session
      const { data: mirrorSession, error: createError } = await supabase
        .from('mirror_sessions')
        .insert({
          session_id: sessionId,
          rater_email: raterEmail.trim().toLowerCase(),
          rater_relationship: raterRelationship,
        })
        .select('id')
        .single()

      if (createError) {
        throw new Error(`Failed to create mirror session: ${createError.message}`)
      }

      // Build the shareable link
      const baseUrl = window.location.origin
      const link = `${baseUrl}/assessment/mirror?token=${mirrorSession.id}`
      setMirrorLink(link)
      setPhase('link-ready')
    } catch (err: any) {
      console.error('Mirror invite error:', err)
      setError(err.message || 'Something went wrong. Please try again.')
      setPhase('invite')
    }
  }, [raterEmail, raterRelationship, router])

  // ─── Copy to clipboard ─────────────────────────────────────────

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(mirrorLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
      const textArea = document.createElement('textarea')
      textArea.value = mirrorLink
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [mirrorLink])

  // ─── Loading ────────────────────────────────────────────────────

  if (phase === 'loading' || phase === 'creating') {
    return (
      <div className="min-h-screen bg-[#F7F3ED] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 border-2 border-black/20 border-t-black rounded-full animate-spin" />
          <p className="text-black/50 text-sm font-medium">
            {phase === 'creating' ? 'Creating mirror session...' : 'Loading...'}
          </p>
        </div>
      </div>
    )
  }

  // ─── Link Ready ─────────────────────────────────────────────────

  if (phase === 'link-ready') {
    return (
      <div className="min-h-screen bg-[#F7F3ED] flex items-center justify-center px-6">
        <div className="max-w-xl w-full">
          <div className="bg-white rounded-2xl p-10 border border-black/5">
            <div className="text-center mb-8">
              <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-black mb-2">Mirror Session Created</h1>
              <p className="text-black/50 text-sm">
                Share this link with <strong className="text-black">{raterEmail}</strong> to collect their feedback.
              </p>
            </div>

            {/* Link display */}
            <div className="mb-6">
              <label className="block text-xs font-medium text-black/50 mb-2">Shareable Link</label>
              <div className="flex items-center gap-2">
                <div className="flex-1 px-4 py-3 rounded-lg bg-black/[0.03] border border-black/10 text-sm text-black/70 truncate select-all">
                  {mirrorLink}
                </div>
                <button
                  onClick={handleCopy}
                  className={`px-5 py-3 rounded-lg text-sm font-medium transition-all duration-150 flex-shrink-0 ${
                    copied
                      ? 'bg-black/5 text-black/50'
                      : 'bg-black text-white hover:bg-black/90'
                  }`}
                >
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>

            <div className="bg-black/[0.02] rounded-lg p-4 mb-8">
              <p className="text-xs text-black/50 leading-relaxed">
                The rater will answer 15 questions about your leadership. They do not need an account.
                Their responses are anonymous and will be compared against your self-assessment to identify blind spots.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="/dashboard"
                className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-black text-white rounded-lg text-sm font-medium hover:bg-black/90 transition-colors"
              >
                Back to Dashboard
              </a>
              <button
                onClick={() => {
                  setPhase('invite')
                  setRaterEmail('')
                  setRaterRelationship('')
                  setMirrorLink('')
                }}
                className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-white text-black border border-black/15 rounded-lg text-sm font-medium hover:border-black/30 transition-colors"
              >
                Invite Another Rater
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ─── Invite Form ────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#F7F3ED] flex items-center justify-center px-6">
      <div className="max-w-xl w-full">
        {/* Back link */}
        <a
          href="/dashboard"
          className="inline-flex items-center gap-1 text-sm text-black/40 hover:text-black/70 transition-colors mb-6"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Dashboard
        </a>

        <div className="bg-white rounded-2xl p-10 border border-black/5">
          <h1 className="text-2xl font-bold text-black mb-2">Invite a Mirror Rater</h1>
          <p className="text-black/50 text-sm mb-8">
            Choose someone who knows your leadership well. They will answer 15 questions about how they experience your leadership.
          </p>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
              {error}
            </div>
          )}

          {/* Email Input */}
          <div className="mb-6">
            <label htmlFor="rater-email" className="block text-sm font-medium text-black mb-2">
              Rater&apos;s email
            </label>
            <input
              id="rater-email"
              type="email"
              value={raterEmail}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRaterEmail(e.target.value)}
              placeholder="colleague@company.com"
              className="w-full px-4 py-3 rounded-lg border border-black/10 bg-black/[0.02] text-black text-sm placeholder:text-black/30 focus:outline-none focus:border-black/30 focus:ring-1 focus:ring-black/10 transition-colors"
            />
          </div>

          {/* Relationship Dropdown */}
          <div className="mb-8">
            <label htmlFor="rater-relationship" className="block text-sm font-medium text-black mb-2">
              Their relationship to you
            </label>
            <select
              id="rater-relationship"
              value={raterRelationship}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setRaterRelationship(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-black/10 bg-black/[0.02] text-black text-sm focus:outline-none focus:border-black/30 focus:ring-1 focus:ring-black/10 transition-colors appearance-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23999' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 12px center',
                backgroundSize: '20px',
              }}
            >
              <option value="">Select relationship...</option>
              {RELATIONSHIP_OPTIONS.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* Submit */}
          <button
            onClick={handleCreateInvite}
            className="w-full px-8 py-4 bg-black text-white rounded-lg text-base font-semibold hover:bg-black/90 transition-colors"
          >
            Generate Mirror Link
          </button>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// Rater Mode: Answer mirror questions (token-based, no auth)
// ═══════════════════════════════════════════════════════════════════

function RaterMode({ token }: { token: string }) {
  const [phase, setPhase] = useState<RaterPhase>('loading')
  const [error, setError] = useState<string | null>(null)
  const [mirrorSessionId, setMirrorSessionId] = useState<string>('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [responses, setResponses] = useState<Map<string, number>>(new Map())

  // Load mirror session on mount
  useEffect(() => {
    async function loadSession() {
      try {
        const supabase = createClient()

        // Load mirror session by token (which is the mirror_session ID)
        const { data: session, error: sessionError } = await supabase
          .from('mirror_sessions')
          .select('id, completed_at')
          .eq('id', token)
          .single()

        if (sessionError || !session) {
          setError('This mirror link is invalid or has expired.')
          setPhase('error')
          return
        }

        if (session.completed_at) {
          setError('This mirror assessment has already been completed. Thank you for your feedback.')
          setPhase('error')
          return
        }

        setMirrorSessionId(session.id)
        setPhase('assessment')
      } catch (err: any) {
        console.error('Mirror load error:', err)
        setError('Failed to load the mirror assessment. Please try again.')
        setPhase('error')
      }
    }

    loadSession()
  }, [token])

  // ─── Handlers ──────────────────────────────────────────────────

  const item = mirrorItems[currentIndex]
  const totalItems = mirrorItems.length
  const currentResponse = item ? responses.get(item.id) : undefined
  const hasAnswer = currentResponse !== undefined
  const isLastItem = currentIndex === totalItems - 1
  const completedCount = responses.size

  const handleSelectValue = useCallback((value: number) => {
    setResponses((prev: Map<string, number>) => {
      const next = new Map(prev)
      next.set(item.id, value)
      return next
    })
  }, [item])

  const handleNext = useCallback(async () => {
    if (!hasAnswer) return

    if (isLastItem) {
      await handleSubmit()
    } else {
      setCurrentIndex((prev: number) => prev + 1)
    }
  }, [hasAnswer, isLastItem])

  const handleBack = useCallback(() => {
    if (currentIndex === 0) return
    setCurrentIndex((prev: number) => prev - 1)
  }, [currentIndex])

  const handleSubmit = useCallback(async () => {
    setPhase('submitting')
    setError(null)

    try {
      // Build the response payload
      const responsePayload: { dimensionId: DimensionId; rawResponse: number }[] = []

      for (const mirrorItem of mirrorItems) {
        const value = responses.get(mirrorItem.id)
        if (value !== undefined) {
          responsePayload.push({
            dimensionId: mirrorItem.dimensionId,
            rawResponse: value,
          })
        }
      }

      const res = await fetch('/api/v4/mirror', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mirrorSessionId,
          responses: responsePayload,
        }),
      })

      const json = await res.json()

      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to submit mirror assessment')
      }

      setPhase('thank-you')
    } catch (err: any) {
      console.error('Mirror submission error:', err)
      setError(err.message || 'Something went wrong. Please try again.')
      setPhase('assessment')
    }
  }, [responses, mirrorSessionId])

  // ─── Loading ────────────────────────────────────────────────────

  if (phase === 'loading') {
    return (
      <div className="min-h-screen bg-[#F7F3ED] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 border-2 border-black/20 border-t-black rounded-full animate-spin" />
          <p className="text-black/50 text-sm font-medium">Loading mirror assessment...</p>
        </div>
      </div>
    )
  }

  // ─── Error ──────────────────────────────────────────────────────

  if (phase === 'error') {
    return (
      <div className="min-h-screen bg-[#F7F3ED] flex items-center justify-center px-6">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl p-10 border border-black/5 text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6">
              <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-black mb-3">Unable to Load</h1>
            <p className="text-black/60 text-sm">{error}</p>
          </div>
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
          <p className="text-black/50 text-sm font-medium">Submitting your feedback...</p>
        </div>
      </div>
    )
  }

  // ─── Thank You ──────────────────────────────────────────────────

  if (phase === 'thank-you') {
    return (
      <div className="min-h-screen bg-[#F7F3ED] flex items-center justify-center px-6">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl p-10 border border-black/5 text-center">
            <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center mx-auto mb-6">
              <svg className="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-black mb-3">Thank You</h1>
            <p className="text-black/60 text-sm leading-relaxed mb-6">
              Your feedback has been submitted. It will be used to help this leader identify blind spots
              and strengthen their leadership across 15 dimensions.
            </p>
            <p className="text-black/40 text-xs">
              Your responses are confidential and will be shown as aggregate data only.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // ─── Assessment (one question at a time) ────────────────────────

  if (!item) {
    return (
      <div className="min-h-screen bg-[#F7F3ED] flex items-center justify-center">
        <p className="text-black/50 text-sm">No questions available.</p>
      </div>
    )
  }

  const dimension = getDimension(item.dimensionId)
  const territoryColor = TERRITORY_COLORS[dimension.territory]
  const scaleLabels = SCALE_LABELS[item.scaleType] || SCALE_LABELS.frequency

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
            Mirror Assessment
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

          {/* Dimension Badge */}
          <div className="mb-6">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{
                backgroundColor: `${territoryColor}20`,
                color: territoryColor,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: territoryColor }}
              />
              {dimension.name}
            </span>
          </div>

          {/* Question Text */}
          <h2 className="text-2xl md:text-3xl font-bold text-black leading-tight mb-10">
            {item.text}
          </h2>

          {/* 5-Point Likert Scale */}
          <div className="grid grid-cols-5 gap-2 mb-10">
            {scaleLabels.map((label, index) => {
              const value = index + 1
              const isSelected = currentResponse === value

              return (
                <button
                  key={`${item.id}-${value}`}
                  onClick={() => handleSelectValue(value)}
                  className={`flex flex-col items-center justify-center px-2 py-5 rounded-xl text-center transition-all duration-150 ${
                    isSelected
                      ? 'bg-black text-white shadow-sm'
                      : 'bg-white text-black/70 border border-black/10 hover:border-black/20 hover:text-black'
                  }`}
                >
                  <span className={`text-xs font-semibold mb-1.5 ${isSelected ? 'text-white/60' : 'text-black/30'}`}>
                    {value}
                  </span>
                  <span className="text-[11px] leading-tight font-medium">
                    {label}
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
              className={`flex items-center gap-1 px-4 py-3 text-sm font-medium transition-colors ${
                currentIndex === 0
                  ? 'text-black/20 cursor-not-allowed'
                  : 'text-black/50 hover:text-black'
              }`}
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
              disabled={!hasAnswer}
              className={`px-8 py-3 rounded-lg text-base font-semibold transition-all duration-150 ${
                hasAnswer
                  ? 'bg-black text-white hover:bg-black/90'
                  : 'bg-black/10 text-black/30 cursor-not-allowed'
              }`}
            >
              {isLastItem ? 'Submit Feedback' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
