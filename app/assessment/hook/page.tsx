'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { hookQuestions } from '@/lib/hook-questions'
import { HookAnswer } from '@/types/assessment'
import { supabase } from '@/lib/supabase'
import { createClient } from '@/lib/supabase-browser'

export default function Assessment() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<HookAnswer[]>([])
  const [selectedValue, setSelectedValue] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [alreadyCompleted, setAlreadyCompleted] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const checkCompletion = async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()

      if (session?.user) {
        setUserId(session.user.id)

        // Check if user has completed this assessment
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('hook_completed')
          .eq('id', session.user.id)
          .single()

        if (profile?.hook_completed) {
          setAlreadyCompleted(true)
        }
      }

      setLoading(false)
    }

    checkCompletion()
  }, [])

  const question = hookQuestions[currentQuestion]
  const isLastQuestion = currentQuestion === hookQuestions.length - 1
  const hasAnswer = selectedValue !== null

  const handleSelectOption = (value: number) => {
    setSelectedValue(value)
  }

  const handleNext = () => {
    if (selectedValue === null) return

    // Save answer
    const newAnswers = [
      ...answers.filter(a => a.questionId !== question.id),
      { questionId: question.id, value: selectedValue }
    ]
    setAnswers(newAnswers)

    if (isLastQuestion) {
      // Submit and go to results
      handleSubmit(newAnswers)
    } else {
      // Go to next question
      setCurrentQuestion(prev => prev + 1)
      // Check if next question already has an answer
      const nextQuestion = hookQuestions[currentQuestion + 1]
      const existingAnswer = newAnswers.find(a => a.questionId === nextQuestion.id)
      setSelectedValue(existingAnswer?.value ?? null)
    }
  }

  const handleBack = () => {
    if (currentQuestion === 0) return

    setCurrentQuestion(prev => prev - 1)
    const prevQuestion = hookQuestions[currentQuestion - 1]
    const existingAnswer = answers.find(a => a.questionId === prevQuestion.id)
    setSelectedValue(existingAnswer?.value ?? null)
  }

  const handleRestart = async () => {
    if (!userId) return

    const supabase = createClient()

    // Update user profile to mark as not completed
    await supabase
      .from('user_profiles')
      .update({ hook_completed: false })
      .eq('id', userId)

    setAlreadyCompleted(false)
    setCurrentQuestion(0)
    setAnswers([])
    setSelectedValue(null)
  }

  const handleSubmit = async (finalAnswers: HookAnswer[]) => {
    // Calculate scores
    const scoreYourself = finalAnswers
      .filter(a => hookQuestions.find(q => q.id === a.questionId)?.territory === 'yourself')
      .reduce((sum, a) => sum + a.value, 0)

    const scoreTeams = finalAnswers
      .filter(a => hookQuestions.find(q => q.id === a.questionId)?.territory === 'teams')
      .reduce((sum, a) => sum + a.value, 0)

    const scoreOrganizations = finalAnswers
      .filter(a => hookQuestions.find(q => q.id === a.questionId)?.territory === 'organizations')
      .reduce((sum, a) => sum + a.value, 0)

    const totalScore = scoreYourself + scoreTeams + scoreOrganizations

    // Save to Supabase
    try {
      const supabase = createClient()

      const { data: assessment, error: assessmentError } = await supabase
        .from('hook_assessments')
        .insert({
          user_id: userId,
          score_yourself: scoreYourself,
          score_teams: scoreTeams,
          score_organizations: scoreOrganizations,
          total_score: totalScore,
          completed_at: new Date().toISOString()
        })
        .select()
        .single()

      if (assessmentError) throw assessmentError

      // Save individual responses
      const responses = finalAnswers.map(answer => ({
        assessment_id: assessment.id,
        question_number: answer.questionId,
        answer_value: answer.value
      }))

      const { error: responsesError } = await supabase
        .from('hook_responses')
        .insert(responses)

      if (responsesError) throw responsesError

      // Mark assessment as completed in user profile
      await supabase
        .from('user_profiles')
        .update({ hook_completed: true })
        .eq('id', userId)

      // Navigate to results with scores
      const params = new URLSearchParams({
        yourself: scoreYourself.toString(),
        teams: scoreTeams.toString(),
        organizations: scoreOrganizations.toString(),
        total: totalScore.toString()
      })
      router.push(`/assessment/results?${params.toString()}`)

    } catch (error) {
      console.error('Error saving assessment:', error)
      // Still navigate to results even if save fails
      const params = new URLSearchParams({
        yourself: scoreYourself.toString(),
        teams: scoreTeams.toString(),
        organizations: scoreOrganizations.toString(),
        total: totalScore.toString()
      })
      router.push(`/assessment/results?${params.toString()}`)
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
            <h1 className="text-4xl font-bold mb-4 text-gray-900">You've Already Completed This Assessment</h1>
            <p className="text-xl text-gray-600 mb-12">
              You can view your results or restart the assessment to update your answers.
            </p>

            <div className="flex gap-4 justify-center">
              <a
                href="/assessment/results"
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

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">CEO Lab</h1>
        </div>
      </header>

      {/* Assessment Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">CEO Leadership Assessment</h1>
          <p className="text-xl text-gray-600">12 questions across 3 territories of leadership</p>
        </div>

        {/* Question Card */}
        <div className="bg-white border-2 border-gray-200 rounded-lg p-8 mb-8">
          <div className="text-sm text-gray-500 uppercase tracking-wide mb-4">
            Question {currentQuestion + 1} of {hookQuestions.length}
          </div>

          <h2 className="text-2xl font-bold mb-6 text-gray-900">
            {question.question}
          </h2>

          {/* Options */}
          <div className="space-y-3">
            {question.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelectOption(option.value)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  selectedValue === option.value
                    ? 'border-black bg-gray-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="text-gray-900">{option.text}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={currentQuestion === 0}
            className="px-6 py-3 border-2 border-gray-200 rounded-md text-gray-900 hover:border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Back
          </button>

          <div className="text-sm text-gray-500">
            Territory: {question.territory === 'yourself' ? 'Leading Yourself' :
                       question.territory === 'teams' ? 'Leading Teams' :
                       'Leading Organizations'}
          </div>

          <button
            onClick={handleNext}
            disabled={!hasAnswer}
            className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {isLastQuestion ? 'See Results' : 'Next'}
          </button>
        </div>
      </main>
    </div>
  )
}
