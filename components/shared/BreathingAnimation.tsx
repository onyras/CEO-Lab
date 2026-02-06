'use client'

import { useState, useEffect, useCallback } from 'react'

interface BreathingAnimationProps {
  variant: 'stage-complete' | 'assessment-complete'
  stageNumber?: number
  onContinue: () => void
  onBreak?: () => void
}

const BREATHING_DURATION_MS = 8000

export function BreathingAnimation({
  variant,
  stageNumber,
  onContinue,
  onBreak,
}: BreathingAnimationProps) {
  const [showMessage, setShowMessage] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMessage(true)
    }, BREATHING_DURATION_MS)

    return () => clearTimeout(timer)
  }, [])

  const handleSkip = useCallback(() => {
    setShowMessage(true)
  }, [])

  const isStageComplete = variant === 'stage-complete'
  const nextStage = stageNumber ? stageNumber + 1 : 2

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#F7F3ED] font-[Inter]">
      {/* Skip link */}
      <button
        onClick={handleSkip}
        className={`absolute top-6 right-6 text-sm text-black/30 transition-opacity hover:text-black/50 ${
          showMessage ? 'pointer-events-none opacity-0' : 'opacity-100'
        }`}
      >
        Skip
      </button>

      <div className="flex flex-col items-center gap-10">
        {/* Breathing circle */}
        <div
          className={`breathing-circle h-32 w-32 rounded-full border border-black/15 transition-opacity duration-700 ${
            showMessage ? 'opacity-0' : 'opacity-100'
          }`}
        />

        {/* Breathing prompt */}
        <p
          className={`text-base text-black/40 transition-opacity duration-700 ${
            showMessage ? 'opacity-0' : 'opacity-100'
          }`}
        >
          Take a deep breath...
        </p>

        {/* Message and buttons */}
        <div
          className={`flex flex-col items-center gap-6 transition-opacity duration-700 ${
            showMessage ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
        >
          <h1 className="text-4xl font-semibold tracking-tight text-black">
            {isStageComplete ? 'Good job.' : 'Congratulations.'}
          </h1>

          <p className="text-base text-black/50">
            {isStageComplete
              ? `Stage ${stageNumber} complete`
              : 'Your assessment is complete'}
          </p>

          <div className="mt-4 flex items-center gap-4">
            <button
              onClick={onContinue}
              className="rounded-lg bg-black px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-black/85"
            >
              {isStageComplete
                ? `Continue to Stage ${nextStage}`
                : 'See Your Results'}
            </button>

            {isStageComplete && onBreak && (
              <button
                onClick={onBreak}
                className="rounded-lg border border-black/20 bg-transparent px-6 py-3 text-sm font-medium text-black transition-colors hover:border-black/40"
              >
                Take a break
              </button>
            )}
          </div>
        </div>
      </div>

      {/* CSS animation */}
      <style jsx>{`
        .breathing-circle {
          animation: breathe 4s ease-in-out infinite;
          background-color: rgba(0, 0, 0, 0.02);
        }

        @keyframes breathe {
          0%,
          100% {
            transform: scale(1);
            border-color: rgba(0, 0, 0, 0.1);
          }
          50% {
            transform: scale(1.35);
            border-color: rgba(0, 0, 0, 0.2);
          }
        }
      `}</style>
    </div>
  )
}
