'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function ResultsContent() {
  const searchParams = useSearchParams()

  const scoreYourself = parseInt(searchParams.get('yourself') || '0')
  const scoreTeams = parseInt(searchParams.get('teams') || '0')
  const scoreOrganizations = parseInt(searchParams.get('organizations') || '0')
  const totalScore = parseInt(searchParams.get('total') || '0')

  // Calculate percentages
  const maxPerTerritory = 16
  const maxTotal = 48
  const yourselfPercent = Math.round((scoreYourself / maxPerTerritory) * 100)
  const teamsPercent = Math.round((scoreTeams / maxPerTerritory) * 100)
  const organizationsPercent = Math.round((scoreOrganizations / maxPerTerritory) * 100)
  const totalPercent = Math.round((totalScore / maxTotal) * 100)

  // Determine top strength and biggest gap
  const scores = [
    { name: 'Leading Yourself', score: scoreYourself, max: maxPerTerritory },
    { name: 'Leading Teams', score: scoreTeams, max: maxPerTerritory },
    { name: 'Leading Organizations', score: scoreOrganizations, max: maxPerTerritory }
  ]

  const sortedByScore = [...scores].sort((a, b) => b.score - a.score)
  const topStrength = sortedByScore[0].name
  const biggestGap = sortedByScore[2].name

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">CEO Lab</h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">Your Leadership Snapshot</h1>
          <p className="text-xl text-gray-600">Here's where you stand across 3 territories of leadership</p>
        </div>

        {/* Score Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="border-2 border-gray-200 rounded-lg p-6 text-center">
            <div className="text-sm text-gray-500 uppercase tracking-wide mb-2">Leading Yourself</div>
            <div className="text-5xl font-bold mb-2 text-gray-900">{scoreYourself}</div>
            <div className="text-gray-600">out of {maxPerTerritory} ({yourselfPercent}%)</div>
          </div>

          <div className="border-2 border-gray-200 rounded-lg p-6 text-center">
            <div className="text-sm text-gray-500 uppercase tracking-wide mb-2">Leading Teams</div>
            <div className="text-5xl font-bold mb-2 text-gray-900">{scoreTeams}</div>
            <div className="text-gray-600">out of {maxPerTerritory} ({teamsPercent}%)</div>
          </div>

          <div className="border-2 border-gray-200 rounded-lg p-6 text-center">
            <div className="text-sm text-gray-500 uppercase tracking-wide mb-2">Leading Organizations</div>
            <div className="text-5xl font-bold mb-2 text-gray-900">{scoreOrganizations}</div>
            <div className="text-gray-600">out of {maxPerTerritory} ({organizationsPercent}%)</div>
          </div>
        </div>

        {/* Insights */}
        <div className="border-2 border-gray-200 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Key Insights</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm text-gray-500 uppercase tracking-wide mb-2">Overall Score</h3>
              <p className="text-xl font-semibold text-gray-900">{totalScore} out of {maxTotal} points ({totalPercent}%)</p>
            </div>

            <div>
              <h3 className="text-sm text-gray-500 uppercase tracking-wide mb-2">Your Top Strength</h3>
              <p className="text-xl font-semibold text-gray-900">{topStrength}</p>
            </div>

            <div>
              <h3 className="text-sm text-gray-500 uppercase tracking-wide mb-2">Your Biggest Blind Spot</h3>
              <p className="text-xl font-semibold text-gray-900">{biggestGap}</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">This is Your Snapshot.</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Get your full CEO Profile with 100 questions across 18 dimensions.
            Track your progress with weekly check-ins and see measurable growth over time.
          </p>
          <button className="px-8 py-4 bg-black text-white text-lg rounded-md hover:bg-gray-800 mb-4">
            Get Your Full Profile - €100/month
          </button>
          <p className="text-sm text-gray-500">
            Join 3,000+ newsletter subscribers. Cancel anytime.
          </p>
        </div>
      </main>
    </div>
  )
}

export default function Results() {
  return (
    <Suspense fallback={<div>Loading results...</div>}>
      <ResultsContent />
    </Suspense>
  )
}
