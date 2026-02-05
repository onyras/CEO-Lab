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
  const [canRedo, setCanRedo] = useState(false)
  const [daysSinceCompletion, setDaysSinceCompletion] = useState(0)
  const [redoUsed, setRedoUsed] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [currentStage, setCurrentStage] = useState<1 | 2 | 3>(1)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [responses, setResponses] = useState<Record<number, number>>({})
  const [saving, setSaving] = useState(false)

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
      .select('subscription_status, baseline_completed, baseline_stage')
      .eq('id', user.id)
      .single()

    if (profile?.subscription_status === 'active') {
      setHasAccess(true)
    } else {
      setHasAccess(false)
    }

    // Check if baseline completed and when
    if (profile?.baseline_completed) {
      setAlreadyCompleted(true)

      // Check when last baseline was completed (for redo logic)
      const { data: latestComplete } = await supabase
        .from('baseline_assessments')
        .select('completed_at, redo_count')
        .eq('user_id', user.id)
        .not('completed_at', 'is', null)
        .order('completed_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (latestComplete?.completed_at) {
        const daysSince = (Date.now() - new Date(latestComplete.completed_at).getTime()) / (1000 * 60 * 60 * 24)
        const redoCount = latestComplete.redo_count || 0

        setDaysSinceCompletion(Math.round(daysSince))
        setRedoUsed(redoCount >= 1)
        setCanRedo(daysSince < 90 && redoCount < 1)
      }
    }

    // Load existing assessment progress
    const { data: assessment } = await supabase
      .from('baseline_assessments')
      .select('id, stage')
      .eq('user_id', user.id)
      .is('completed_at', null) // Only incomplete assessments
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    // Determine completed stage: assessment first, profile baseline_stage as fallback
    const completedStage = assessment?.stage || profile?.baseline_stage || 0

    // Load responses if we have an assessment
    let savedResponses: Record<number, number> = {}
    if (assessment) {
      const { data: responseRows } = await supabase
        .from('baseline_responses')
        .select('question_number, answer_value')
        .eq('assessment_id', assessment.id)

      if (responseRows && responseRows.length > 0) {
        responseRows.forEach(row => {
          savedResponses[row.question_number] = row.answer_value
        })
        setResponses(savedResponses)
      }
    }

    // Fallback: if no responses found via assessment, load by user_id directly
    if (Object.keys(savedResponses).length === 0 && completedStage > 0) {
      const { data: responseRows } = await supabase
        .from('baseline_responses')
        .select('question_number, answer_value')
        .eq('user_id', user.id)
        .order('question_number', { ascending: true })

      if (responseRows && responseRows.length > 0) {
        responseRows.forEach(row => {
          savedResponses[row.question_number] = row.answer_value
        })
        setResponses(savedResponses)
      }
    }

    // Set correct stage based on completed stage (outside response check)
    if (completedStage === 1) {
      setCurrentStage(2)
      setCurrentQuestionIndex(30)
    } else if (completedStage === 2) {
      setCurrentStage(3)
      setCurrentQuestionIndex(60)
    } else if (completedStage === 0) {
      // In progress within stage 1, resume from last answered question
      const answerCount = Object.keys(savedResponses).length
      if (answerCount > 0 && answerCount < 30) {
        setCurrentQuestionIndex(answerCount)
      }
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
      setSaving(true)
      const result = await saveProgress()

      if (!result || !result.success) {
        const errorMsg = result?.error || 'Unknown error occurred'
        alert(`Failed to save your progress.\n\nError: ${errorMsg}\n\nPlease screenshot this message and send to support.`)
        setSaving(false)
        return
      }

      setSaving(false)
      router.push(`/results?stage=${currentStage}`)
    } else {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    setCurrentQuestionIndex(prev => Math.max(0, prev - 1))
  }

  const saveProgress = async () => {
    try {
      console.log('Saving:', { stage: currentStage, responseCount: Object.keys(responses).length })

      const response = await fetch('/api/baseline/save-v2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stage: currentStage,
          responses
        })
      })

      console.log('Response status:', response.status, response.statusText)

      if (!response.ok) {
        const text = await response.text()
        console.error('API error response:', text)
        try {
          const data = JSON.parse(text)
          return { success: false, error: data.error || `HTTP ${response.status}: ${response.statusText}` }
        } catch {
          return { success: false, error: `HTTP ${response.status}: ${text.substring(0, 200)}` }
        }
      }

      const data = await response.json()
      console.log('Save successful:', data)
      return data
    } catch (error) {
      console.error('Save error:', error)
      return { success: false, error: error instanceof Error ? error.message : String(error) }
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
    let buttonText = 'Start New Baseline (Quarterly Retake)'
    let buttonDescription = `It's been ${daysSinceCompletion} days since your last baseline. Time for your quarterly retake! This creates a new baseline and preserves your previous one for comparison.`
    let buttonDisabled = false

    if (daysSinceCompletion < 90) {
      if (canRedo) {
        // Can still redo
        buttonText = 'Redo Baseline (Overwrites Current)'
        buttonDescription = `It's been ${daysSinceCompletion} days since your last baseline. You have ONE redo opportunity to update your scores (overwrites previous answers).`
      } else if (redoUsed) {
        // Already used redo
        buttonText = `Next Baseline Available in ${90 - daysSinceCompletion} Days`
        buttonDescription = `You've already used your one redo opportunity. Your next quarterly baseline will be available in ${90 - daysSinceCompletion} days.`
        buttonDisabled = true
      }
    }

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
            <h1 className="text-4xl font-bold mb-4 text-gray-900">Baseline Assessment Completed</h1>
            <p className="text-xl text-gray-600 mb-4">
              You completed your baseline assessment {daysSinceCompletion} days ago.
            </p>
            <p className="text-lg text-gray-500 mb-12">
              {buttonDescription}
            </p>

            <div className="flex gap-4 justify-center">
              <a
                href="/results"
                className="px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-black/90 transition-colors"
              >
                View Results
              </a>
              <button
                onClick={handleRestart}
                disabled={buttonDisabled}
                className={`px-6 py-3 border-2 rounded-lg font-semibold transition-colors ${
                  buttonDisabled
                    ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                    : 'border-black/20 text-black hover:border-black'
                }`}
              >
                {buttonText}
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
            {currentQuestion.options.map((option, index) => (
              <button
                key={`${currentQuestion.id}-${index}`}
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
              disabled={!responses[currentQuestion.id] || saving}
              className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : currentQuestionIndex === currentQuestions.length - 1 ? 'Complete Stage' : 'Next'} →
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
