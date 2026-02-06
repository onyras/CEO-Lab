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
    <div className="min-h-screen bg-[#F7F3ED]">
      {/* Header */}
      <header className="border-b border-black/10 bg-white">
        <div className="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-black tracking-tight">CEO Lab</h1>
          <a
            href="/dashboard"
            className="text-sm font-medium text-black/60 hover:text-black transition-colors"
          >
            Back to Dashboard
          </a>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 text-black leading-tight tracking-tight">Your Leadership Snapshot</h1>
          <p className="text-lg text-black/60">Here's where you stand across 3 territories of leadership</p>
        </div>

        {/* Score Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg p-8 shadow-sm border border-black/5 text-center">
            <div className="w-12 h-1 bg-[#7FABC8] rounded-full mx-auto mb-4"></div>
            <div className="text-sm text-black/50 uppercase tracking-wide mb-2 font-semibold">Leading Yourself</div>
            <div className="text-5xl font-bold mb-2 text-black">{scoreYourself}</div>
            <div className="text-black/60">out of {maxPerTerritory} ({yourselfPercent}%)</div>
          </div>

          <div className="bg-white rounded-lg p-8 shadow-sm border border-black/5 text-center">
            <div className="w-12 h-1 bg-[#A6BEA4] rounded-full mx-auto mb-4"></div>
            <div className="text-sm text-black/50 uppercase tracking-wide mb-2 font-semibold">Leading Teams</div>
            <div className="text-5xl font-bold mb-2 text-black">{scoreTeams}</div>
            <div className="text-black/60">out of {maxPerTerritory} ({teamsPercent}%)</div>
          </div>

          <div className="bg-white rounded-lg p-8 shadow-sm border border-black/5 text-center">
            <div className="w-12 h-1 bg-[#E08F6A] rounded-full mx-auto mb-4"></div>
            <div className="text-sm text-black/50 uppercase tracking-wide mb-2 font-semibold">Leading Organizations</div>
            <div className="text-5xl font-bold mb-2 text-black">{scoreOrganizations}</div>
            <div className="text-black/60">out of {maxPerTerritory} ({organizationsPercent}%)</div>
          </div>
        </div>

        {/* Insights */}
        <div className="bg-white rounded-lg p-8 shadow-sm border border-black/5 mb-12">
          <h2 className="text-2xl font-bold mb-8 text-black">Key Insights</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm text-black/50 uppercase tracking-wide mb-2 font-semibold">Overall Score</h3>
              <p className="text-xl font-semibold text-black">{totalScore} out of {maxTotal} points ({totalPercent}%)</p>
            </div>

            <div>
              <h3 className="text-sm text-black/50 uppercase tracking-wide mb-2 font-semibold">Your Top Strength</h3>
              <p className="text-xl font-semibold text-black">{topStrength}</p>
            </div>

            <div>
              <h3 className="text-sm text-black/50 uppercase tracking-wide mb-2 font-semibold">Your Biggest Blind Spot</h3>
              <p className="text-xl font-semibold text-black">{biggestGap}</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-white rounded-lg p-12 shadow-sm border border-black/5 text-center">
          <h2 className="text-3xl font-bold mb-4 text-black">This is Your Snapshot.</h2>
          <p className="text-lg text-black/60 mb-8 max-w-2xl mx-auto leading-relaxed">
            Get your full CEO Profile with 100 questions across 18 dimensions.
            Track your progress with weekly check-ins and see measurable growth over time.
          </p>
          <button className="px-8 py-4 bg-black text-white text-lg font-semibold rounded-lg hover:bg-black/90 transition-colors mb-4">
            Get Your Full Profile - €100/month
          </button>
          <p className="text-sm text-black/50">
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
