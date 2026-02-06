'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import { getDimension, TERRITORY_CONFIG } from '@/lib/constants'
import { getTerritoryArcNarrative, DIMENSION_CONTENT, ARCHETYPE_DESCRIPTIONS, STAGE1_CTA } from '@/lib/report-content'
import { TerritoryBars } from '@/components/visualizations/TerritoryBars'
import type {
  FullResults,
  DimensionScore,
  TerritoryScore,
  ArchetypeMatch,
  DimensionId,
  Territory,
} from '@/types/assessment'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const TERRITORY_COLORS: Record<Territory, string> = {
  leading_yourself: '#7FABC8',
  leading_teams: '#A6BEA4',
  leading_organizations: '#E08F6A',
}

function getSectionNumber(n: number): string {
  return n.toString().padStart(2, '0')
}

// ---------------------------------------------------------------------------
// Shared Section Card (matches full results page)
// ---------------------------------------------------------------------------

function SectionCard({
  number,
  title,
  children,
}: {
  number: number
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="bg-white rounded-lg p-8 md:p-10 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="mb-6">
        <span className="text-xs font-medium text-black/30 tracking-wider uppercase">
          {getSectionNumber(number)}
        </span>
        <h2 className="text-2xl md:text-3xl font-bold text-black mt-1 leading-tight">
          {title}
        </h2>
      </div>
      {children}
    </section>
  )
}

// ---------------------------------------------------------------------------
// Section 01 — Territory Overview
// ---------------------------------------------------------------------------

function TerritoryOverviewSection({
  territoryScores,
}: {
  territoryScores: TerritoryScore[]
}) {
  return (
    <SectionCard number={1} title="Territory Overview">
      <p className="text-black/60 mb-6 text-sm">
        Your leadership across the three territories, based on your Stage 1
        responses. These scores are preliminary and will become more precise as
        you complete the full assessment.
      </p>

      <TerritoryBars
        territories={territoryScores.map((ts) => ({
          territory: ts.territory,
          score: Math.round(ts.score),
          verbalLabel: ts.verbalLabel,
        }))}
      />

      {/* One-sentence arc narrative per territory */}
      <div className="mt-8 space-y-4">
        {territoryScores.map((ts) => {
          const config = TERRITORY_CONFIG[ts.territory]
          const narrative = getTerritoryArcNarrative(ts.territory, ts.score)

          return (
            <div
              key={ts.territory}
              className="flex items-start gap-3"
            >
              <div
                className="w-1 shrink-0 rounded-full mt-1"
                style={{
                  backgroundColor: TERRITORY_COLORS[ts.territory],
                  height: '1rem',
                }}
              />
              <div>
                <p className="text-sm font-semibold text-black mb-0.5">
                  {config.displayLabel}
                </p>
                <p className="text-sm text-black/70 leading-relaxed">
                  {narrative}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </SectionCard>
  )
}

// ---------------------------------------------------------------------------
// Section 02 — Top 3 Signals
// ---------------------------------------------------------------------------

function TopSignalsSection({
  dimensionScores,
}: {
  dimensionScores: DimensionScore[]
}) {
  // Get the 3 lowest-scoring dimensions
  const sorted = [...dimensionScores].sort((a, b) => a.percentage - b.percentage)
  const topThree = sorted.slice(0, 3)

  return (
    <SectionCard number={2} title="Top 3 Signals">
      <p className="text-black/60 mb-6 text-sm">
        The three dimensions where your initial responses suggest the sharpest
        development opportunity. Each represents a pattern worth paying attention to.
      </p>

      <div className="space-y-4">
        {topThree.map((ds, index) => {
          const def = getDimension(ds.dimensionId)
          const content = DIMENSION_CONTENT[ds.dimensionId]
          const percentage = Math.round(ds.percentage)

          return (
            <div
              key={ds.dimensionId}
              className="border border-black/10 rounded-lg p-6"
            >
              {/* Header row */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs font-medium text-black/40 mb-0.5">
                    {def.id} &middot;{' '}
                    {TERRITORY_CONFIG[def.territory].displayLabel}
                  </p>
                  <h3 className="text-lg font-semibold text-black">
                    {def.name}
                  </h3>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <span className="text-2xl font-bold text-black">
                    {percentage}%
                  </span>
                  <p className="text-xs text-black/50 mt-0.5">
                    {ds.verbalLabel}
                  </p>
                </div>
              </div>

              {/* Score bar */}
              <div className="h-2 w-full rounded-full bg-[#F7F3ED] overflow-hidden mb-4">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: TERRITORY_COLORS[def.territory],
                  }}
                />
              </div>

              {/* Core question + behavioral definition */}
              <p className="text-sm font-medium text-black mb-2">
                {def.coreQuestion}
              </p>
              <p className="text-sm text-black/60 leading-relaxed">
                {content.behavioralDefinition}
              </p>
            </div>
          )
        })}
      </div>
    </SectionCard>
  )
}

// ---------------------------------------------------------------------------
// Section 03 — Archetype Preview
// ---------------------------------------------------------------------------

function ArchetypePreviewSection({
  archetypes,
}: {
  archetypes: ArchetypeMatch[]
}) {
  // Show the top archetype if one exists
  const topArchetype = archetypes.length > 0 ? archetypes[0] : null
  const description = topArchetype
    ? ARCHETYPE_DESCRIPTIONS[topArchetype.name]
    : null

  return (
    <SectionCard number={3} title="Archetype Preview">
      {topArchetype && description ? (
        <div>
          <div className="border border-black/10 rounded-lg p-6 mb-4">
            {/* Archetype name */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#F7F3ED] flex items-center justify-center">
                <span className="text-sm font-bold text-black">
                  {topArchetype.displayRank}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-black">
                  {topArchetype.name}
                </h3>
                <p className="text-xs text-black/40">
                  {topArchetype.matchType === 'full' ? 'Strong match' : 'Partial match'}
                </p>
              </div>
            </div>

            {/* One-sentence description */}
            <p className="text-sm text-black/70 leading-relaxed">
              {description.oneSentence}
            </p>
          </div>

          <p className="text-sm text-black/50 leading-relaxed">
            Based on your initial responses, you may match the{' '}
            <span className="font-semibold text-black">{topArchetype.name}</span>
            {' '}pattern. Complete the full assessment for your detailed pattern
            analysis, including what this archetype is costing you and the
            specific shift that unlocks growth.
          </p>
        </div>
      ) : (
        <div className="text-center py-6">
          <p className="text-sm text-black/60 max-w-md mx-auto leading-relaxed">
            Your initial responses do not yet indicate a single dominant pattern.
            Complete the full assessment for your detailed archetype analysis.
          </p>
        </div>
      )}
    </SectionCard>
  )
}

// ---------------------------------------------------------------------------
// Section 04 — CTA
// ---------------------------------------------------------------------------

function CtaSection() {
  return (
    <SectionCard number={4} title="Continue Your Assessment">
      <div className="text-center py-4">
        <p className="text-lg text-black/70 max-w-lg mx-auto leading-relaxed mb-8">
          {STAGE1_CTA}
        </p>

        <a
          href="/assessment/baseline"
          className="inline-block bg-black text-white px-8 py-4 rounded-lg text-base font-semibold hover:bg-black/90 transition-colors"
        >
          Continue to Stage 2
        </a>

        <p className="text-xs text-black/40 mt-4">
          Stages 2 &amp; 3 add behavioral depth across all 15 dimensions,
          unlocking your full archetype analysis, priority deep-dives, and
          90-day development roadmap.
        </p>
      </div>
    </SectionCard>
  )
}

// ---------------------------------------------------------------------------
// Loading State
// ---------------------------------------------------------------------------

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-[#F7F3ED]">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="space-y-6">
          {/* Header skeleton */}
          <div className="text-center mb-12">
            <div className="h-8 w-56 bg-black/5 rounded mx-auto mb-3 animate-pulse" />
            <div className="h-4 w-80 bg-black/5 rounded mx-auto animate-pulse" />
          </div>

          {/* Card skeletons */}
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
            >
              <div className="h-4 w-8 bg-black/5 rounded mb-3 animate-pulse" />
              <div className="h-6 w-40 bg-black/5 rounded mb-6 animate-pulse" />
              <div className="space-y-3">
                <div className="h-3 w-full bg-black/5 rounded animate-pulse" />
                <div className="h-3 w-4/5 bg-black/5 rounded animate-pulse" />
                <div className="h-3 w-3/5 bg-black/5 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Error State
// ---------------------------------------------------------------------------

function ErrorState({ message }: { message: string }) {
  return (
    <div className="min-h-screen bg-[#F7F3ED] flex items-center justify-center px-6">
      <div className="bg-white rounded-lg p-10 max-w-md w-full text-center shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <h2 className="text-xl font-bold text-black mb-3">
          Unable to Load Preview
        </h2>
        <p className="text-sm text-black/60 mb-6 leading-relaxed">{message}</p>
        <a
          href="/dashboard"
          className="inline-block bg-black text-white px-8 py-4 rounded-lg text-base font-semibold hover:bg-black/90 transition-colors"
        >
          Return to Dashboard
        </a>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main Page Component
// ---------------------------------------------------------------------------

export default function PreviewResultsPage() {
  const router = useRouter()
  const [results, setResults] = useState<FullResults | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadResults() {
      try {
        // Check authentication
        const supabase = createClient()
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session) {
          router.replace('/auth')
          return
        }

        // Fetch results from API
        const response = await fetch('/api/v4/results')

        if (!response.ok) {
          if (response.status === 401) {
            router.replace('/auth')
            return
          }
          if (response.status === 404) {
            setError(
              'No assessment results found. Complete Stage 1 of the assessment first to view your preview report.'
            )
            setLoading(false)
            return
          }
          throw new Error(`Failed to load results (${response.status})`)
        }

        const data = await response.json()
        const fetchedResults: FullResults = data.results

        // If the session is fully completed (all 3 stages), redirect to
        // the full results page instead of showing the preview.
        if (fetchedResults.session.stageReached === 3 && fetchedResults.session.completedAt) {
          router.replace('/results')
          return
        }

        setResults(fetchedResults)
      } catch (err) {
        console.error('Error loading preview results:', err)
        setError(
          'Something went wrong while loading your preview. Please try again.'
        )
      } finally {
        setLoading(false)
      }
    }

    loadResults()
  }, [router])

  // Loading
  if (loading) {
    return <LoadingSkeleton />
  }

  // Error
  if (error || !results) {
    return (
      <ErrorState
        message={
          error ??
          'No assessment results found. Complete Stage 1 of the assessment to view your preview report.'
        }
      />
    )
  }

  return (
    <div className="min-h-screen bg-[#F7F3ED] font-[Inter]">
      {/* Page header */}
      <header className="pt-12 pb-6 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-medium text-black/40 uppercase tracking-wider mb-2">
            CEO Lab Assessment
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-black">
            Your Preview Report
          </h1>
          <p className="text-sm text-black/50 mt-3 max-w-md mx-auto leading-relaxed">
            Based on your Stage 1 responses. Complete the full assessment to
            unlock your complete leadership profile.
          </p>
        </div>
      </header>

      {/* Preliminary badge */}
      <div className="max-w-4xl mx-auto px-6 mb-4">
        <div className="flex items-center gap-2 px-4 py-2.5 bg-white/60 rounded-lg border border-black/5">
          <div className="w-2 h-2 rounded-full bg-[#E08F6A]" />
          <p className="text-xs text-black/50">
            <span className="font-semibold text-black/70">Preliminary scores</span>
            {' '}&mdash; based on Stage 1 only. Scores will become more accurate
            with Stages 2 and 3.
          </p>
        </div>
      </div>

      {/* Report sections */}
      <main className="max-w-4xl mx-auto px-6 pb-20 space-y-6">
        {/* 01 — Territory Overview */}
        <TerritoryOverviewSection territoryScores={results.territoryScores} />

        {/* 02 — Top 3 Signals */}
        <TopSignalsSection dimensionScores={results.dimensionScores} />

        {/* 03 — Archetype Preview */}
        <ArchetypePreviewSection archetypes={results.archetypes} />

        {/* 04 — CTA */}
        <CtaSection />
      </main>
    </div>
  )
}
