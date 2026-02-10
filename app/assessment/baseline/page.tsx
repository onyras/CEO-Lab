'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import { behavioralItems, sjiItems, imItems } from '@/lib/baseline-questions'
import { STAGE_ITEMS } from '@/lib/constants'
import type { BehavioralItem, SjiItem, ImItem } from '@/types/assessment'
import { BreathingAnimation } from '@/components/shared/BreathingAnimation'

// ─── Scale Definitions ────────────────────────────────────────────

const SCALE_LABELS: Record<string, string[]> = {
  frequency: ['Almost Never', 'Rarely', 'Sometimes', 'Often', 'Almost Always'],
  degree: ['Not at all', 'Slightly', 'Moderately', 'Mostly', 'Completely'],
  confidence: ['Very Uncertain', 'Somewhat Uncertain', 'Neutral', 'Somewhat Confident', 'Very Confident'],
}

// ─── Types ────────────────────────────────────────────────────────

type Phase = 'loading' | 'assessment' | 'stage-complete' | 'saving' | 'done'

interface ItemResponse {
  rawResponse: number
  responseTimeMs: number
}

type ItemData =
  | { type: 'behavioral'; item: BehavioralItem }
  | { type: 'sji'; item: SjiItem }
  | { type: 'im'; item: ImItem }

// ─── Helpers ──────────────────────────────────────────────────────

function getItemData(itemId: string): ItemData | null {
  if (itemId.startsWith('B')) {
    const item = behavioralItems.find(b => b.id === itemId)
    if (item) return { type: 'behavioral', item }
  }
  if (itemId.startsWith('SJ')) {
    const item = sjiItems.find(s => s.id === itemId)
    if (item) return { type: 'sji', item }
  }
  if (itemId.startsWith('IM')) {
    const item = imItems.find(i => i.id === itemId)
    if (item) return { type: 'im', item }
  }
  return null
}

function getScaleLabels(item: BehavioralItem): string[] {
  if (item.scaleType === 'custom' && item.customScale) {
    return item.customScale
  }
  return SCALE_LABELS[item.scaleType] || SCALE_LABELS.frequency
}

/** Fisher-Yates shuffle, returns a new array */
function shuffle<T>(array: T[]): T[] {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

// ─── Component ────────────────────────────────────────────────────

export default function BaselineAssessment() {
  const router = useRouter()

  // Core state
  const [phase, setPhase] = useState<Phase>('loading')
  const [error, setError] = useState<string | null>(null)
  const [sessionId, setSessionId] = useState<string>('')
  const [currentStage, setCurrentStage] = useState<1 | 2 | 3>(1)
  const [stageItems, setStageItems] = useState<string[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [responses, setResponses] = useState<Map<string, ItemResponse>>(new Map())
  const [displayedAt, setDisplayedAt] = useState<number>(Date.now())
  const [answeredItems, setAnsweredItems] = useState<Set<string>>(new Set())
  const [saveError, setSaveError] = useState<string | null>(null)

  // Track whether init has run
  const initRef = useRef(false)

  // ─── Initialize Session ──────────────────────────────────────

  const initSession = useCallback(async () => {
    if (initRef.current) return
    initRef.current = true

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/auth')
        return
      }

      // Create or resume session
      const res = await fetch('/api/v4/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })

      if (!res.ok) {
        const text = await res.text()
        let errorMsg: string
        try {
          const data = JSON.parse(text)
          errorMsg = data.error || `Session creation failed (${res.status})`
        } catch {
          errorMsg = `Session creation failed (${res.status}): ${text.substring(0, 200)}`
        }
        setError(errorMsg)
        setPhase('loading')
        return
      }

      const data = await res.json()
      const sid = data.session?.id || data.sessionId
      const stageReached = data.session?.stageReached || data.stageReached
      const items = data.stageItems
      const answered = data.answeredItems

      setSessionId(sid)

      // Determine which stage to work on
      const stage = (stageReached || 1) as 1 | 2 | 3
      setCurrentStage(stage)

      // Get stage item IDs and shuffle
      const stageItemIds: string[] = items || STAGE_ITEMS[stage] || []
      const answeredSet = new Set<string>(answered || [])
      setAnsweredItems(answeredSet)

      // Build shuffled queue, filter out already answered items
      const unanswered = stageItemIds.filter((id: string) => !answeredSet.has(id))
      const shuffled = shuffle(unanswered)
      setStageItems(shuffled)
      setCurrentIndex(0)

      // Restore any existing responses as empty map (we only need to track new ones)
      setResponses(new Map())

      if (shuffled.length === 0) {
        // All items in this stage already answered
        if (stage >= 3) {
          setPhase('done')
          router.push('/ceolab')
        } else {
          setPhase('stage-complete')
        }
      } else {
        setDisplayedAt(Date.now())
        setPhase('assessment')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize assessment')
      setPhase('loading')
    }
  }, [router])

  useEffect(() => {
    initSession()
  }, [initSession])

  // ─── Reset display timer when index changes ──────────────────

  useEffect(() => {
    if (phase === 'assessment') {
      setDisplayedAt(Date.now())
    }
  }, [currentIndex, phase])

  // ─── Handle Answer ───────────────────────────────────────────

  const handleAnswer = useCallback((itemId: string, rawResponse: number) => {
    const responseTimeMs = Date.now() - displayedAt

    setResponses((prev: Map<string, ItemResponse>) => {
      const next = new Map(prev)
      next.set(itemId, { rawResponse, responseTimeMs })
      return next
    })
  }, [displayedAt])

  // ─── Save Stage Responses ────────────────────────────────────

  const saveStageResponses = useCallback(async () => {
    setPhase('saving')
    setSaveError(null)

    try {
      const responsesArray = [...responses.entries()].map(([itemId, data]) => ({
        itemId,
        rawResponse: data.rawResponse,
        responseTimeMs: data.responseTimeMs,
      }))

      const res = await fetch('/api/v4/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          stage: currentStage,
          responses: responsesArray,
        }),
      })

      if (!res.ok) {
        const text = await res.text()
        let errorMsg: string
        try {
          const data = JSON.parse(text)
          errorMsg = data.error || `Save failed (${res.status})`
        } catch {
          errorMsg = `Save failed (${res.status}): ${text.substring(0, 200)}`
        }
        setSaveError(errorMsg)
        setPhase('assessment')
        return
      }

      // Determine next step
      if (currentStage >= 3) {
        setPhase('done')
      } else {
        setPhase('stage-complete')
      }
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save responses')
      setPhase('assessment')
    }
  }, [responses, sessionId, currentStage, router])

  // ─── Navigation ──────────────────────────────────────────────

  const handleNext = useCallback(() => {
    if (currentIndex < stageItems.length - 1) {
      setCurrentIndex((prev: number) => prev + 1)
    } else {
      // Last item in stage -- save
      saveStageResponses()
    }
  }, [currentIndex, stageItems.length, saveStageResponses])

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev: number) => prev - 1)
    }
  }, [currentIndex])

  const handleContinueToNextStage = useCallback(async () => {
    const nextStage = (currentStage + 1) as 1 | 2 | 3
    setCurrentStage(nextStage)

    // Get items for next stage and shuffle
    const nextItems = STAGE_ITEMS[nextStage] || []
    const shuffled = shuffle(nextItems)
    setStageItems(shuffled)
    setCurrentIndex(0)
    setResponses(new Map())
    setAnsweredItems(new Set())
    setDisplayedAt(Date.now())
    setPhase('assessment')
  }, [currentStage])

  // ─── Current Item Data ───────────────────────────────────────

  const currentItemId = stageItems[currentIndex]
  const currentItemData = currentItemId ? getItemData(currentItemId) : null
  const currentResponse = currentItemId ? responses.get(currentItemId) : undefined
  const isAnswered = currentResponse !== undefined
  const isLastItem = currentIndex === stageItems.length - 1

  // ─── Progress Calculation ────────────────────────────────────

  const totalInStage = stageItems.length
  const answeredInStage = Array.from(responses.keys()).length
  const progressPercent = totalInStage > 0 ? ((currentIndex + 1) / totalInStage) * 100 : 0

  // ─── Render: Loading ─────────────────────────────────────────

  if (phase === 'loading') {
    return (
      <div className="min-h-screen bg-[#F7F3ED] flex items-center justify-center">
        <div className="text-center">
          {error ? (
            <div className="max-w-md mx-auto">
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-black/5">
                <h2 className="text-xl font-semibold text-black mb-3">Something went wrong</h2>
                <p className="text-black/60 text-sm mb-6">{error}</p>
                <button
                  onClick={() => {
                    setError(null)
                    initRef.current = false
                    initSession()
                  }}
                  className="px-6 py-2.5 bg-black text-white rounded-lg text-sm font-medium hover:bg-black/90 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="h-8 w-8 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              <p className="text-black/50 text-sm font-medium">Preparing your assessment...</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  // ─── Render: Saving ──────────────────────────────────────────

  if (phase === 'saving') {
    return (
      <div className="min-h-screen bg-[#F7F3ED] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 border-2 border-black/20 border-t-black rounded-full animate-spin" />
          <p className="text-black/50 text-sm font-medium">Saving your responses...</p>
        </div>
      </div>
    )
  }

  // ─── Render: Stage Complete ──────────────────────────────────

  if (phase === 'stage-complete') {
    return (
      <BreathingAnimation
        variant="stage-complete"
        stageNumber={currentStage}
        onContinue={handleContinueToNextStage}
        onBreak={() => router.push('/dashboard')}
      />
    )
  }

  // ─── Render: Done (Congratulations) ──────────────────────────

  if (phase === 'done') {
    return (
      <BreathingAnimation
        variant="assessment-complete"
        stageNumber={3}
        onContinue={() => router.push('/dashboard')}
      />
    )
  }

  // ─── Render: Assessment ──────────────────────────────────────

  if (!currentItemData) {
    return (
      <div className="min-h-screen bg-[#F7F3ED] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-black/5">
            <h2 className="text-xl font-semibold text-black mb-3">Item not found</h2>
            <p className="text-black/60 text-sm mb-6">
              Could not load question {currentItemId}. Please try refreshing.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-black text-white rounded-lg text-sm font-medium hover:bg-black/90 transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F7F3ED]">
      {/* ─── Header ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-10 bg-[#F7F3ED]/95 backdrop-blur-sm border-b border-black/5">
        <div className="max-w-2xl mx-auto px-4 py-4">
          {/* Stage indicator */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-black/40 tracking-wide uppercase">
              Stage {currentStage} of 3
            </span>
            <span className="text-xs font-medium text-black/40">
              {currentIndex + 1} / {totalInStage}
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-black/5 rounded-full h-1.5">
            <div
              className="bg-black h-1.5 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Stage dots */}
          <div className="flex items-center justify-center gap-2 mt-3">
            {[1, 2, 3].map(s => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-colors ${
                  s === currentStage ? 'w-6 bg-black' : s < currentStage ? 'w-1.5 bg-black' : 'w-1.5 bg-black/15'
                }`}
              />
            ))}
          </div>
        </div>
      </header>

      {/* ─── Save Error Banner ──────────────────────────────── */}
      {saveError && (
        <div className="max-w-2xl mx-auto px-4 mt-4">
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 flex items-start gap-3">
            <span className="text-red-500 text-sm mt-0.5">!</span>
            <div className="flex-1">
              <p className="text-red-800 text-sm font-medium">Failed to save</p>
              <p className="text-red-600 text-xs mt-0.5">{saveError}</p>
            </div>
            <button
              onClick={() => setSaveError(null)}
              className="text-red-400 hover:text-red-600 text-sm"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* ─── Question Card ──────────────────────────────────── */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-black/5">
          {/* Render based on item type */}
          {currentItemData.type === 'sji' ? (
            <SjiQuestion
              item={currentItemData.item}
              selectedValue={currentResponse?.rawResponse}
              onSelect={(value) => handleAnswer(currentItemData.item.id, value)}
            />
          ) : currentItemData.type === 'behavioral' ? (
            <LikertQuestion
              itemId={currentItemData.item.id}
              text={currentItemData.item.text}
              labels={getScaleLabels(currentItemData.item)}
              selectedValue={currentResponse?.rawResponse}
              onSelect={(value) => handleAnswer(currentItemData.item.id, value)}
            />
          ) : (
            // IM items -- render as frequency Likert (indistinguishable from behavioral)
            <LikertQuestion
              itemId={currentItemData.item.id}
              text={currentItemData.item.text}
              labels={SCALE_LABELS.frequency}
              selectedValue={currentResponse?.rawResponse}
              onSelect={(value) => handleAnswer(currentItemData.item.id, value)}
            />
          )}
        </div>

        {/* ─── Navigation ────────────────────────────────────── */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              currentIndex === 0
                ? 'text-black/20 cursor-not-allowed'
                : 'text-black/60 hover:text-black hover:bg-white'
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          <button
            onClick={handleNext}
            disabled={!isAnswered}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isAnswered
                ? 'bg-black text-white hover:bg-black/90'
                : 'bg-black/10 text-black/30 cursor-not-allowed'
            }`}
          >
            {isLastItem ? 'Complete Stage' : 'Next'}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* ─── Keyboard hint ────────────────────────────────── */}
        <p className="text-center text-[11px] text-black/25 mt-6">
          Press 1-5 to answer, Enter to continue
        </p>
      </main>

      {/* ─── Keyboard Shortcuts ─────────────────────────────── */}
      <KeyboardHandler
        itemData={currentItemData}
        isAnswered={isAnswered}
        onAnswer={(value) => {
          if (currentItemData) handleAnswer(currentItemData.item.id, value)
        }}
        onNext={handleNext}
        onPrevious={handlePrevious}
        currentIndex={currentIndex}
      />
    </div>
  )
}

// ─── Likert Question Component ──────────────────────────────────

function LikertQuestion({
  itemId,
  text,
  labels,
  selectedValue,
  onSelect,
}: {
  itemId: string
  text: string
  labels: string[]
  selectedValue?: number
  onSelect: (value: number) => void
}) {
  return (
    <div>
      <p className="text-lg font-medium text-black leading-relaxed mb-8">
        {text}
      </p>

      <div className="grid grid-cols-5 gap-2">
        {labels.map((label, index) => {
          const value = index + 1
          const isSelected = selectedValue === value

          return (
            <button
              key={`${itemId}-${value}`}
              onClick={() => onSelect(value)}
              className={`flex flex-col items-center justify-center px-2 py-4 rounded-xl text-center transition-all duration-150 ${
                isSelected
                  ? 'bg-black text-white shadow-sm'
                  : 'bg-black/[0.03] text-black/70 hover:bg-black/[0.06] hover:text-black'
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
    </div>
  )
}

// ─── SJI Question Component ─────────────────────────────────────

function SjiQuestion({
  item,
  selectedValue,
  onSelect,
}: {
  item: SjiItem
  selectedValue?: number
  onSelect: (value: number) => void
}) {
  const optionLetters = ['a', 'b', 'c', 'd']

  return (
    <div>
      {/* Scenario */}
      <p className="text-lg font-medium text-black leading-relaxed mb-8">
        {item.scenario}
      </p>

      {/* Options */}
      <div className="space-y-3">
        {Array.from(item.options).map((option, index) => {
          const isSelected = selectedValue === option.maturityScore

          // We need to track which specific option was selected, not just the score
          // since multiple options could theoretically have the same score.
          // Use index-based selection to handle this correctly.
          return (
            <SjiOptionCard
              key={`${item.id}-opt-${index}`}
              letter={optionLetters[index]}
              text={option.text}
              isSelected={isSelected && selectedValue === option.maturityScore}
              onClick={() => onSelect(option.maturityScore)}
            />
          )
        })}
      </div>
    </div>
  )
}

function SjiOptionCard({
  letter,
  text,
  isSelected,
  onClick,
}: {
  letter: string
  text: string
  isSelected: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left flex items-start gap-4 px-5 py-4 rounded-xl transition-all duration-150 ${
        isSelected
          ? 'bg-black text-white shadow-sm'
          : 'bg-black/[0.03] text-black hover:bg-black/[0.06]'
      }`}
    >
      <span
        className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold mt-0.5 ${
          isSelected
            ? 'bg-white/20 text-white'
            : 'bg-black/[0.06] text-black/40'
        }`}
      >
        {letter}
      </span>
      <span className="text-sm leading-relaxed font-medium">
        {text}
      </span>
    </button>
  )
}

// ─── Keyboard Handler Component ─────────────────────────────────

function KeyboardHandler({
  itemData,
  isAnswered,
  onAnswer,
  onNext,
  onPrevious,
  currentIndex,
}: {
  itemData: ItemData | null
  isAnswered: boolean
  onAnswer: (value: number) => void
  onNext: () => void
  onPrevious: () => void
  currentIndex: number
}) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Ignore if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

      // Number keys 1-5 for Likert (behavioral/IM)
      if (itemData && (itemData.type === 'behavioral' || itemData.type === 'im')) {
        const num = parseInt(e.key)
        if (num >= 1 && num <= 5) {
          e.preventDefault()
          onAnswer(num)
          return
        }
      }

      // Number keys 1-4 for SJI
      if (itemData && itemData.type === 'sji') {
        const num = parseInt(e.key)
        if (num >= 1 && num <= 4) {
          e.preventDefault()
          const option = itemData.item.options[num - 1]
          if (option) {
            onAnswer(option.maturityScore)
          }
          return
        }
      }

      // Enter = next
      if (e.key === 'Enter' && isAnswered) {
        e.preventDefault()
        onNext()
        return
      }

      // Left arrow = previous
      if (e.key === 'ArrowLeft' && currentIndex > 0) {
        e.preventDefault()
        onPrevious()
        return
      }

      // Right arrow = next (if answered)
      if (e.key === 'ArrowRight' && isAnswered) {
        e.preventDefault()
        onNext()
        return
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [itemData, isAnswered, onAnswer, onNext, onPrevious, currentIndex])

  return null
}
