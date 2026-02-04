'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import { baselineQuestions } from '@/lib/baseline-questions'

export default function BaselineAssessment() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [hasAccess, setHasAccess] = useState(false)
  const [alreadyCompleted, setAlreadyCompleted] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [currentStage, setCurrentStage] = useState<1 | 2 | 3>(1)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [responses, setResponses] = useState<Record<number, number>>({})

  // Stage boundaries
  const stageQuestions = {
    1: baselineQuestions.slice(0, 30),   // Q1-30
    2: baselineQuestions.slice(0, 60),   // Q1-60
    3: baselineQuestions.slice(0, 100)   // Q1-100
  }

  const currentQuestions = stageQuestions[currentStage]
  const currentQuestion = currentQuestions[currentQuestionIndex]
  const questionsAnsweredInStage = Object.keys(responses).length
  const totalQuestionsInStage = currentQuestions.length

  useEffect(() => {
    checkSubscription()
  }, [])

  const checkSubscription = async () => {
    const supabase = createClient()

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push('/auth')
      return
    }

    setUserId(user.id)

    // Check subscription status and completion
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('subscription_status, baseline_completed')
      .eq('id', user.id)
      .single()

    if (profile?.subscription_status === 'active') {
      setHasAccess(true)
    } else {
      setHasAccess(false)
    }

    if (profile?.baseline_completed) {
      setAlreadyCompleted(true)
    }

    setLoading(false)
  }

  const handleRestart = async () => {
    if (!userId) return

    const supabase = createClient()

    // Update user profile to mark as not completed
    await supabase
      .from('user_profiles')
      .update({ baseline_completed: false })
      .eq('id', userId)

    setAlreadyCompleted(false)
    setCurrentStage(1)
    setCurrentQuestionIndex(0)
    setResponses({})
  }

  const handleAnswer = (questionId: number, value: number) => {
    setResponses(prev => ({ ...prev, [questionId]: value }))
  }

  const handleNext = async () => {
    // Check if stage complete
    if (currentQuestionIndex === currentQuestions.length - 1) {
      // Save progress and show results
      await saveProgress()
      router.push(`/assessment/baseline/results?stage=${currentStage}`)
    } else {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    setCurrentQuestionIndex(prev => Math.max(0, prev - 1))
  }

  const saveProgress = async () => {
    try {
      const response = await fetch('/api/baseline/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stage: currentStage,
          responses
        })
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('Failed to save:', data.error)
      }

      return data
    } catch (error) {
      console.error('Save error:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  if (alreadyCompleted) {
    return (
      <div className="min-h-screen bg-white">
        <header className="border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold text-gray-900">CEO Lab</h1>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center">
            <div className="mb-6">
              <span className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-lg font-semibold">
                ✓ Assessment Completed
              </span>
            </div>
            <h1 className="text-4xl font-bold mb-4 text-gray-900">You've Already Completed the Full Baseline</h1>
            <p className="text-xl text-gray-600 mb-12">
              You can view your results or restart the assessment to update your answers.
            </p>

            <div className="flex gap-4 justify-center">
              <a
                href="/assessment/baseline/results"
                className="px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-black/90 transition-colors"
              >
                View Results
              </a>
              <button
                onClick={handleRestart}
                className="px-6 py-3 border-2 border-black/20 text-black rounded-lg font-semibold hover:border-black transition-colors"
              >
                Restart Test
              </button>
              <a
                href="/dashboard"
                className="px-6 py-3 border-2 border-black/20 text-black rounded-lg font-semibold hover:border-black transition-colors"
              >
                Back to Dashboard
              </a>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-3xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4 text-gray-900">
              Premium Feature
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              The baseline assessment is available to CEO Lab members.
            </p>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-8 py-3 bg-black text-white rounded-md hover:bg-gray-800"
            >
              Upgrade to Premium - €100/month
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-600">Loading questions...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Baseline Assessment</h1>
          <p className="text-sm text-gray-600 mt-1">
            Stage {currentStage} of 3 • Question {currentQuestionIndex + 1} of {totalQuestionsInStage}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {currentQuestion.subdimension}
          </p>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-black h-2 rounded-full transition-all"
            style={{
              width: `${((currentQuestionIndex + 1) / totalQuestionsInStage) * 100}%`
            }}
          />
        </div>
      </div>

      {/* Question */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white border-2 border-gray-200 rounded-lg p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {currentQuestion.question}
            </h2>
          </div>

          {/* Answer Options */}
          <div className="space-y-3 mb-8">
            {currentQuestion.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(currentQuestion.id, option.value)}
                className={`w-full text-left px-6 py-4 rounded-lg border-2 transition-all ${
                  responses[currentQuestion.id] === option.value
                    ? 'border-black bg-gray-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="font-medium text-gray-900">
                  {option.text}
                </span>
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="px-6 py-2 text-gray-700 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>

            <button
              onClick={handleNext}
              disabled={!responses[currentQuestion.id]}
              className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentQuestionIndex === currentQuestions.length - 1 ? 'Complete Stage' : 'Next'} →
            </button>
          </div>
        </div>

        {/* Stage Progress */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-2 text-sm text-gray-600">
            <span className={currentStage >= 1 ? 'font-bold text-gray-900' : ''}>
              Stage 1 (30q)
            </span>
            <span>→</span>
            <span className={currentStage >= 2 ? 'font-bold text-gray-900' : ''}>
              Stage 2 (60q)
            </span>
            <span>→</span>
            <span className={currentStage === 3 ? 'font-bold text-gray-900' : ''}>
              Stage 3 (100q)
            </span>
          </div>
        </div>
      </main>
    </div>
  )
}
