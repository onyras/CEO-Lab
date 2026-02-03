'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { calculateBaselineScores, getScoreColor, getScoreLabel, type BaselineScores } from '@/lib/scoring'

function BaselineResultsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const stage = parseInt(searchParams.get('stage') || '1') as 1 | 2 | 3

  const [loading, setLoading] = useState(true)
  const [scores, setScores] = useState<BaselineScores | null>(null)

  useEffect(() => {
    loadResults()
  }, [])

  const loadResults = async () => {
    try {
      // Fetch responses from database
      const response = await fetch('/api/baseline/responses')
      const data = await response.json()

      if (data.responses && Object.keys(data.responses).length > 0) {
        // Use real responses from database
        const calculatedScores = calculateBaselineScores(data.responses)
        setScores(calculatedScores)
      } else {
        // No responses yet - generate mock for preview
        const mockResponses: Record<number, number> = {}
        for (let i = 1; i <= (stage === 1 ? 30 : stage === 2 ? 60 : 100); i++) {
          mockResponses[i] = Math.floor(Math.random() * 5) + 1
        }
        const calculatedScores = calculateBaselineScores(mockResponses)
        setScores(calculatedScores)
      }
    } catch (error) {
      console.error('Failed to load responses:', error)
    }

    setLoading(false)
  }

  if (loading || !scores) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-600">Calculating your scores...</div>
      </div>
    )
  }

  const yourselfTerritory = scores.territories.find(t => t.territory === 'yourself')
  const teamsTerritory = scores.territories.find(t => t.territory === 'teams')
  const orgsTerritory = scores.territories.find(t => t.territory === 'organizations')

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Your CEO Profile</h1>
          <p className="text-gray-600 mt-2">
            {stage === 1 && 'Stage 1 Complete (30%) - Foundation Baseline'}
            {stage === 2 && 'Stage 2 Complete (60%) - Depth Profile'}
            {stage === 3 && 'Stage 3 Complete (100%) - Comprehensive Assessment'}
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Overall Score */}
        <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-8 mb-8 text-center">
          <div className="inline-block px-4 py-2 bg-black text-white rounded-md mb-4">
            ✓ Assessment Complete
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            {scores.totalPercentage}%
          </h2>
          <p className="text-lg text-gray-600 mb-4">
            Overall Leadership Score
          </p>
          <div className="flex justify-center gap-4 text-sm">
            <div>
              <span className="text-gray-600">Leading Yourself: </span>
              <span className="font-bold">{yourselfTerritory?.percentage}%</span>
            </div>
            <div>
              <span className="text-gray-600">Leading Teams: </span>
              <span className="font-bold">{teamsTerritory?.percentage}%</span>
            </div>
            <div>
              <span className="text-gray-600">Leading Organizations: </span>
              <span className="font-bold">{orgsTerritory?.percentage}%</span>
            </div>
          </div>
        </div>

        {/* Top Strengths & Biggest Gaps */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="border-2 border-green-200 bg-green-50 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Top Strengths</h3>
            <div className="space-y-3">
              {scores.topStrengths.map((sd) => (
                <div key={sd.subdimension} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{sd.subdimension}</span>
                  <span className={`text-sm font-medium px-3 py-1 rounded ${getScoreColor(sd.percentage)}`}>
                    {sd.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-2 border-red-200 bg-red-50 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Growth Opportunities</h3>
            <div className="space-y-3">
              {scores.biggestGaps.map((sd) => (
                <div key={sd.subdimension} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{sd.subdimension}</span>
                  <span className={`text-sm font-medium px-3 py-1 rounded ${getScoreColor(sd.percentage)}`}>
                    {sd.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* All Sub-Dimensions by Territory */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Leading Yourself */}
          <div className="border-2 border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-1">Leading Yourself</h3>
            <p className="text-sm text-gray-600 mb-4">{yourselfTerritory?.percentage}% overall</p>
            <div className="space-y-3">
              {yourselfTerritory?.subdimensions.map((sd) => (
                <div key={sd.subdimension} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{sd.subdimension}</span>
                  <span className={`text-xs font-medium px-2 py-1 rounded ${getScoreColor(sd.percentage)}`}>
                    {sd.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Leading Teams */}
          <div className="border-2 border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-1">Leading Teams</h3>
            <p className="text-sm text-gray-600 mb-4">{teamsTerritory?.percentage}% overall</p>
            <div className="space-y-3">
              {teamsTerritory?.subdimensions.map((sd) => (
                <div key={sd.subdimension} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{sd.subdimension}</span>
                  <span className={`text-xs font-medium px-2 py-1 rounded ${getScoreColor(sd.percentage)}`}>
                    {sd.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Leading Organizations */}
          <div className="border-2 border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-1">Leading Organizations</h3>
            <p className="text-sm text-gray-600 mb-4">{orgsTerritory?.percentage}% overall</p>
            <div className="space-y-3">
              {orgsTerritory?.subdimensions.map((sd) => (
                <div key={sd.subdimension} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{sd.subdimension}</span>
                  <span className={`text-xs font-medium px-2 py-1 rounded ${getScoreColor(sd.percentage)}`}>
                    {sd.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="border-2 border-gray-200 rounded-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">What's Next?</h3>

          <div className="space-y-6">
            <div className="bg-black text-white rounded-lg p-6">
              <h4 className="font-bold text-white mb-2">Choose Your Focus Areas</h4>
              <p className="text-gray-200 mb-4">
                Based on your results, select 3 dimensions to work on this quarter. Start weekly check-ins to track your progress.
              </p>
              <button
                onClick={() => router.push('/focus')}
                className="px-6 py-3 bg-white text-black rounded-md hover:bg-gray-100"
              >
                Choose 3 Focus Areas →
              </button>
            </div>

            {stage < 3 && (
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Continue Your Assessment</h4>
                <p className="text-gray-600 mb-4">
                  {stage === 1 && 'Complete Stage 2 (30 more questions) for deeper insights and framework recommendations.'}
                  {stage === 2 && 'Complete Stage 3 (40 more questions) for your comprehensive profile and annual tracking.'}
                </p>
                <button
                  onClick={() => router.push('/assessment/baseline')}
                  className="px-6 py-3 border-2 border-gray-900 text-gray-900 rounded-md hover:bg-gray-50"
                >
                  Continue to Stage {stage + 1}
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default function BaselineResults() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    }>
      <BaselineResultsContent />
    </Suspense>
  )
}
