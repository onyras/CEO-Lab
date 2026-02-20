'use client'

import React, { useState, useEffect, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import { mirrorItems } from '@/lib/mirror-questions'
import { DIMENSIONS, getDimension, TERRITORY_COLORS } from '@/lib/constants'
import type { MirrorItem, DimensionId, Territory, ScaleType } from '@/types/assessment'

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
type RaterPhase = 'loading' | 'intro' | 'assessment' | 'submitting' | 'thank-you' | 'error'

interface MirrorResponseData {
  dimensionId: DimensionId
  rawResponse: number
}

// ═══════════════════════════════════════════════════════════════════
// Main component — detects mode from URL params
// ═══════════════════════════════════════════════════════════════════

function MirrorPageInner() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  if (token) {
    return <RaterMode token={token} />
  }

  return <CeoMode />
}

export default function MirrorPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#F7F3ED]"><p className="text-black/40">Loading...</p></div>}>
      <MirrorPageInner />
    </Suspense>
  )
}

// ─── Invite record type ───────────────────────────────────────────

interface InviteRecord {
  id: string
  email: string
  name: string
  isCompleted: boolean
}

// ═══════════════════════════════════════════════════════════════════
// CEO Mode: Invite a mirror rater
// ═══════════════════════════════════════════════════════════════════

const UNLOCK_THRESHOLD = 5
const GOAL_THRESHOLD = 15

function CeoMode() {
  const router = useRouter()
  const [phase, setPhase] = useState<CeoPhase>('loading')
  const [error, setError] = useState<string | null>(null)
  const [raterEmail, setRaterEmail] = useState('')
  const [raterName, setRaterName] = useState('')
  const [mirrorLink, setMirrorLink] = useState('')
  const [copied, setCopied] = useState(false)
  const [copiedMessage, setCopiedMessage] = useState(false)
  const [existingInvites, setExistingInvites] = useState<InviteRecord[]>([])
  const [sessionId, setSessionId] = useState<string>('')

  const completedCount = existingInvites.filter(i => i.isCompleted).length
  const isUnlocked = completedCount >= UNLOCK_THRESHOLD

  // Auth check + load existing invites on mount
  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient()
      const { data: { user }, error: authError } = await supabase.auth.getUser()

      if (authError || !user) {
        router.push('/auth')
        return
      }

      // Load latest completed session
      const { data: sessions } = await supabase
        .from('assessment_sessions')
        .select('id')
        .eq('ceo_id', user.id)
        .not('completed_at', 'is', null)
        .order('completed_at', { ascending: false })
        .limit(1)

      if (sessions && sessions.length > 0) {
        const sid = sessions[0].id
        setSessionId(sid)

        // Load existing mirror invites
        const { data: invites } = await supabase
          .from('mirror_sessions')
          .select('id, rater_email, rater_relationship, completed_at')
          .eq('session_id', sid)

        if (invites) {
          setExistingInvites(invites.map(i => ({
            id: i.id,
            email: i.rater_email,
            name: i.rater_relationship || '',
            isCompleted: !!i.completed_at,
          })))
        }
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

      // Use already-loaded sessionId if available, otherwise look it up
      let sid = sessionId
      if (!sid) {
        const { data: sessions, error: sessionError } = await supabase
          .from('assessment_sessions')
          .select('id')
          .eq('ceo_id', user.id)
          .not('completed_at', 'is', null)
          .order('completed_at', { ascending: false })
          .limit(1)

        if (sessionError || !sessions || sessions.length === 0) {
          throw new Error('You need to complete the baseline assessment before inviting a mirror rater.')
        }
        sid = sessions[0].id
        setSessionId(sid)
      }

      // Create the mirror session
      const { data: mirrorSession, error: createError } = await supabase
        .from('mirror_sessions')
        .insert({
          session_id: sid,
          rater_email: raterEmail.trim().toLowerCase(),
          rater_relationship: raterName.trim(),
        })
        .select('id')
        .single()

      if (createError) {
        throw new Error(`Failed to create mirror session: ${createError.message}`)
      }

      // Add to existing invites list
      setExistingInvites(prev => [{
        id: mirrorSession.id,
        email: raterEmail.trim().toLowerCase(),
        name: raterName.trim(),
        isCompleted: false,
      }, ...prev])

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
  }, [raterEmail, raterName, router, sessionId])

  // ─── Copy helpers ───────────────────────────────────────────────

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const el = document.createElement('textarea')
      el.value = text
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    }
  }, [])

  const handleCopy = useCallback(async () => {
    await copyToClipboard(mirrorLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [mirrorLink, copyToClipboard])

  const handleCopyMessage = useCallback(async (message: string) => {
    await copyToClipboard(`${message}\n\n${mirrorLink}`)
    setCopiedMessage(true)
    setTimeout(() => setCopiedMessage(false), 2000)
  }, [mirrorLink, copyToClipboard])

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
    const greeting = raterName.trim() ? `Hey ${raterName.trim()} —` : 'Hey —'
    const inviteMessage = `${greeting} I'm going through a leadership development program and as part of it I'm collecting feedback from people who work closely with me.\n\nIt's 15 short questions about what you actually observe in how I lead — takes about 5 minutes, completely anonymous, no account needed. Your honest take is more useful than a positive one.\n\nWould mean a lot if you'd fill it out:`

    return (
      <div className="min-h-screen bg-[#F7F3ED] px-6 py-12">
        <div className="max-w-xl mx-auto">
          <a
            href="/ceolab"
            className="inline-flex items-center gap-1 text-sm text-black/40 hover:text-black/70 transition-colors mb-6"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Dashboard
          </a>

          <div className="bg-white rounded-lg p-8 border border-black/5 mb-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <div>
                <p className="text-base font-semibold text-black">Link created{raterName.trim() ? ` for ${raterName.trim()}` : ''}</p>
                <p className="text-sm text-black/40">Copy the message below and send it directly</p>
              </div>
            </div>

            {/* Message block */}
            <div className="bg-[#F7F3ED] rounded-lg p-5 mb-4">
              <p className="text-sm text-black/60 leading-relaxed whitespace-pre-line">
                {inviteMessage}
              </p>
              <p className="text-sm text-black/40 mt-3 break-all font-mono">{mirrorLink}</p>
            </div>

            {/* One-click copy */}
            <button
              onClick={() => handleCopyMessage(inviteMessage)}
              className={`w-full py-3.5 rounded-lg text-sm font-semibold transition-all duration-150 ${
                copiedMessage
                  ? 'bg-black/5 text-black/40'
                  : 'bg-black text-white hover:bg-black/90'
              }`}
            >
              {copiedMessage ? 'Copied to clipboard' : 'Copy message + link'}
            </button>
          </div>

          {/* Link-only fallback */}
          <div className="bg-white rounded-lg p-5 border border-black/5 mb-6">
            <p className="text-xs font-medium text-black/40 mb-2">Or copy link only</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 px-3 py-2.5 rounded-lg bg-black/[0.03] border border-black/8 text-xs text-black/50 truncate font-mono select-all">
                {mirrorLink}
              </div>
              <button
                onClick={handleCopy}
                className={`px-4 py-2.5 rounded-lg text-xs font-medium transition-all duration-150 flex-shrink-0 ${
                  copied ? 'bg-black/5 text-black/40' : 'bg-black/8 text-black hover:bg-black/12'
                }`}
              >
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                setPhase('invite')
                setRaterEmail('')
                setRaterName('')
                setMirrorLink('')
              }}
              className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-black text-white rounded-lg text-sm font-medium hover:bg-black/90 transition-colors"
            >
              Invite another rater
            </button>
            <a
              href="/ceolab"
              className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-white text-black border border-black/15 rounded-lg text-sm font-medium hover:border-black/30 transition-colors"
            >
              Back to dashboard
            </a>
          </div>
        </div>
      </div>
    )
  }

  // ─── Invite Form ────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#F7F3ED] px-6 py-12">
      <div className="max-w-xl mx-auto">
        {/* Back link */}
        <a
          href="/ceolab"
          className="inline-flex items-center gap-1 text-sm text-black/40 hover:text-black/70 transition-colors mb-6"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Dashboard
        </a>

        <p className="font-mono text-sm uppercase tracking-[0.12em] text-black/40 mb-2">Mirror Check</p>
        <h1 className="text-3xl font-bold text-black mb-8">Invite Raters</h1>

        {/* Progress card — only shown when there are invites */}
        {existingInvites.length > 0 && (
          <div className="bg-white rounded-lg p-8 border border-black/5 mb-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-2xl font-bold font-mono text-black">
                  {completedCount}<span className="text-sm font-normal text-black/35"> / {UNLOCK_THRESHOLD} to unlock</span>
                </p>
                <p className="text-sm text-black/50 mt-0.5">responses received</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold font-mono text-black">
                  {existingInvites.length}<span className="text-sm font-normal text-black/35"> invited</span>
                </p>
                <p className="text-sm text-black/40">goal: {GOAL_THRESHOLD}</p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mb-4">
              <div className="w-full bg-black/5 rounded-full h-2 relative">
                <div
                  className="absolute top-0 h-2 border-l-2 border-black/20 rounded-none"
                  style={{ left: `${(UNLOCK_THRESHOLD / GOAL_THRESHOLD) * 100}%` }}
                />
                <div
                  className="h-2 rounded-full bg-black transition-all duration-700 ease-out"
                  style={{ width: `${Math.min(100, (completedCount / GOAL_THRESHOLD) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-black/30 mt-1.5">
                <span>0</span>
                <span style={{ marginLeft: `calc(${(UNLOCK_THRESHOLD / GOAL_THRESHOLD) * 100}% - 20px)` }}>
                  {UNLOCK_THRESHOLD} unlock
                </span>
                <span>{GOAL_THRESHOLD}</span>
              </div>
            </div>

            {isUnlocked ? (
              <a href="/ceolab/results" className="inline-flex items-center gap-2 text-sm font-semibold text-black hover:text-black/70 transition-colors">
                View Mirror Check results
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </a>
            ) : (
              <p className="text-sm text-black/40">
                {UNLOCK_THRESHOLD - completedCount} more {UNLOCK_THRESHOLD - completedCount === 1 ? 'response' : 'responses'} needed to unlock your results.
              </p>
            )}
          </div>
        )}

        {/* Invite form */}
        <div className="bg-white rounded-lg p-8 border border-black/5 mb-6">
          <h2 className="text-lg font-semibold text-black mb-1">
            {existingInvites.length === 0 ? 'Invite your first rater' : 'Invite another rater'}
          </h2>
          <p className="text-black/50 text-sm mb-6">
            Choose someone who sees your leadership directly. They answer 15 questions — no account needed.
          </p>

          {/* Error Banner */}
          {error && (
            <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
              {error}
            </div>
          )}

          {/* Name Input */}
          <div className="mb-5">
            <label htmlFor="rater-name" className="block text-sm font-medium text-black mb-2">
              Their name
            </label>
            <input
              id="rater-name"
              type="text"
              value={raterName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRaterName(e.target.value)}
              placeholder="Alex"
              className="w-full px-4 py-3 rounded-lg border border-black/10 bg-black/[0.02] text-black text-sm placeholder:text-black/30 focus:outline-none focus:border-black/30 focus:ring-1 focus:ring-black/10 transition-colors"
            />
          </div>

          {/* Email Input */}
          <div className="mb-6">
            <label htmlFor="rater-email" className="block text-sm font-medium text-black mb-2">
              Their email
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

          <button
            onClick={handleCreateInvite}
            className="w-full px-8 py-4 bg-black text-white rounded-lg text-base font-semibold hover:bg-black/90 transition-colors"
          >
            Generate Mirror Link
          </button>
        </div>

        {/* Existing invites list */}
        {existingInvites.length > 0 && (
          <div className="bg-white rounded-lg border border-black/5 overflow-hidden">
            <div className="px-8 py-5 border-b border-black/5">
              <p className="text-sm font-semibold text-black">Invited Raters</p>
            </div>
            <div className="divide-y divide-black/5">
              {existingInvites.map((invite) => (
                <div key={invite.id} className="px-8 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-black">{invite.name || invite.email}</p>
                    {invite.name && <p className="text-xs text-black/40 mt-0.5">{invite.email}</p>}
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                    invite.isCompleted
                      ? 'bg-black/5 text-black/60'
                      : 'bg-black/[0.03] text-black/35'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${invite.isCompleted ? 'bg-black/40' : 'bg-black/20'}`} />
                    {invite.isCompleted ? 'Completed' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
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
  const [ceoFirstName, setCeoFirstName] = useState<string>('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [responses, setResponses] = useState<Map<string, number>>(new Map())

  // Load mirror session on mount
  useEffect(() => {
    async function loadSession() {
      try {
        const supabase = createClient()

        // Load mirror session + session_id for CEO lookup
        const { data: session, error: sessionError } = await supabase
          .from('mirror_sessions')
          .select('id, completed_at, session_id')
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

        // Try to get CEO's first name — fail silently if RLS blocks it
        try {
          const { data: assessmentSession } = await supabase
            .from('assessment_sessions')
            .select('ceo_id')
            .eq('id', session.session_id)
            .single()

          if (assessmentSession?.ceo_id) {
            const { data: profile } = await supabase
              .from('user_profiles')
              .select('full_name')
              .eq('id', assessmentSession.ceo_id)
              .single()

            if (profile?.full_name) {
              setCeoFirstName(profile.full_name.split(' ')[0])
            }
          }
        } catch {
          // Name is cosmetic — swallow silently
        }

        setPhase('intro')
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

  // ─── Intro ──────────────────────────────────────────────────────

  if (phase === 'intro') {
    const inviterLabel = ceoFirstName ? `${ceoFirstName} has invited you` : 'You've been invited'

    return (
      <div className="min-h-screen bg-[#F7F3ED] flex items-center justify-center px-6 py-12">
        <div className="max-w-lg w-full">
          <div className="bg-white rounded-lg p-10 border border-black/5">
            {/* Header */}
            <p className="font-mono text-xs uppercase tracking-[0.12em] text-black/40 mb-4">Mirror Check</p>
            <h1 className="text-3xl font-bold text-black mb-3 leading-tight">
              {inviterLabel} to share your perspective
            </h1>
            <p className="text-base text-black/50 leading-relaxed mb-8">
              {ceoFirstName ? `${ceoFirstName} is` : 'This person is'} working on their leadership development and wants to understand how their leadership actually lands — not just how they think it does.
            </p>

            {/* What you'll do */}
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-4">
                <span className="w-7 h-7 rounded-full bg-black/5 flex items-center justify-center flex-shrink-0 mt-0.5 font-mono text-xs font-bold text-black/50">1</span>
                <div>
                  <p className="text-sm font-semibold text-black">15 short questions</p>
                  <p className="text-sm text-black/50 mt-0.5">Each one asks what you actually observe in how they lead — not what you think they intend or aspire to.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="w-7 h-7 rounded-full bg-black/5 flex items-center justify-center flex-shrink-0 mt-0.5 font-mono text-xs font-bold text-black/50">2</span>
                <div>
                  <p className="text-sm font-semibold text-black">Takes about 5 minutes</p>
                  <p className="text-sm text-black/50 mt-0.5">Rate each statement on a 5-point scale. No long answers, no trick questions.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="w-7 h-7 rounded-full bg-black/5 flex items-center justify-center flex-shrink-0 mt-0.5 font-mono text-xs font-bold text-black/50">3</span>
                <div>
                  <p className="text-sm font-semibold text-black">Your responses are anonymous</p>
                  <p className="text-sm text-black/50 mt-0.5">Results are shown as aggregate data. No account, no login, nothing stored about you.</p>
                </div>
              </div>
            </div>

            {/* Note */}
            <div className="bg-[#F7F3ED] rounded-lg p-4 mb-8">
              <p className="text-sm text-black/50 leading-relaxed">
                The most useful feedback is honest feedback. Don&apos;t rate based on how you think they want to be seen — rate based on what you&apos;ve observed.
              </p>
            </div>

            <button
              onClick={() => setPhase('assessment')}
              className="w-full py-4 bg-black text-white rounded-lg text-base font-semibold hover:bg-black/90 transition-colors"
            >
              Begin
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ─── Error ──────────────────────────────────────────────────────

  if (phase === 'error') {
    return (
      <div className="min-h-screen bg-[#F7F3ED] flex items-center justify-center px-6">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg p-10 border border-black/5 text-center">
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
          <div className="bg-white rounded-lg p-10 border border-black/5 text-center">
            <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center mx-auto mb-6">
              <svg className="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-black mb-3">Thank You</h1>
            <p className="text-black/60 text-sm leading-relaxed mb-6">
              Your feedback has been submitted. It will be used in this leader&apos;s Mirror Check
              to compare their self-perception with how others experience their leadership.
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
                  className={`flex flex-col items-center justify-center px-2 py-5 rounded-lg text-center transition-all duration-150 ${
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
