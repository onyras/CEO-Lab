'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import { DIMENSIONS, TERRITORY_CONFIG, getDimension } from '@/lib/constants'
import { getFrameworkPrescription, getBsiLabel, getVerbalLabel } from '@/lib/scoring'
import { TerritoryBars } from '@/components/visualizations/TerritoryBars'
import { DimensionHeatmap } from '@/components/visualizations/DimensionHeatmap'
import { ArchetypeBadge } from '@/components/visualizations/ArchetypeBadge'
import { MirrorDotPlot } from '@/components/visualizations/MirrorDotPlot'
import { RoadmapTimeline } from '@/components/visualizations/RoadmapTimeline'
import { AnimatedScore } from '@/components/shared/AnimatedScore'
import type {
  FullResults,
  DimensionScore,
  TerritoryScore,
  ArchetypeMatch,
  MirrorGap,
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

/** Build the heatmap data the DimensionHeatmap component expects. */
function buildHeatmapData(dimensionScores: DimensionScore[]) {
  return dimensionScores.map((ds) => {
    const def = getDimension(ds.dimensionId)
    return {
      dimensionId: ds.dimensionId,
      name: def.name,
      territory: def.territory,
      percentage: Math.round(ds.percentage),
      verbalLabel: ds.verbalLabel,
    }
  })
}

/** Build roadmap entries from priority dimensions. */
function buildRoadmapEntries(
  priorityDimensions: DimensionId[],
  dimensionScores: DimensionScore[]
) {
  return priorityDimensions.map((dimId, index) => {
    const def = getDimension(dimId)
    const score = dimensionScores.find((ds) => ds.dimensionId === dimId)
    const percentage = score?.percentage ?? 0
    const frameworks = getFrameworkPrescription(dimId, percentage)

    // Spread priorities across a 90-day window
    const startDay = index * 14 + 1
    const endDay = startDay + 20

    return {
      dimensionId: dimId,
      dimensionName: def.name,
      territory: def.territory,
      percentage,
      verbalLabel: score?.verbalLabel ?? getVerbalLabel(percentage),
      frameworks,
      startDay: Math.min(startDay, 90),
      endDay: Math.min(endDay, 90),
    }
  })
}

// ---------------------------------------------------------------------------
// Section Components
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
// Section 01 — The Headline
// ---------------------------------------------------------------------------

function HeadlineSection({
  clmi,
  bsi,
  hasMirrorData,
}: {
  clmi: number
  bsi?: number
  hasMirrorData: boolean
}) {
  const rounded = Math.round(clmi)
  const label = getVerbalLabel(clmi)

  return (
    <SectionCard number={1} title="The Headline">
      <div className="text-center">
        {/* CLMI Score */}
        <div className="mb-4">
          <AnimatedScore
            value={rounded}
            suffix="%"
            className="text-[72px] md:text-[96px] font-bold text-black leading-none tracking-tight"
          />
        </div>

        {/* Interpretation */}
        <p className="text-lg md:text-xl text-black/70 max-w-xl mx-auto leading-relaxed">
          Your Conscious Leadership Maturity Index places you in the{' '}
          <span className="font-semibold text-black">{label}</span> range.
        </p>

        {/* BSI — only if mirror data available */}
        {hasMirrorData && bsi != null && (
          <div className="mt-6 pt-6 border-t border-black/10">
            <p className="text-base text-black/60">
              Your Blind Spot Index is{' '}
              <span className="font-semibold text-black">{bsi.toFixed(1)}</span>
              {' '}&mdash;{' '}
              <span className="text-black/80">{getBsiLabel(bsi)}</span>.
            </p>
          </div>
        )}
      </div>
    </SectionCard>
  )
}

// ---------------------------------------------------------------------------
// Section 02 — Three Territories
// ---------------------------------------------------------------------------

function TerritoriesSection({
  territoryScores,
}: {
  territoryScores: TerritoryScore[]
}) {
  return (
    <SectionCard number={2} title="Three Territories">
      <TerritoryBars
        territories={territoryScores.map((ts) => ({
          territory: ts.territory,
          score: Math.round(ts.score),
          verbalLabel: ts.verbalLabel,
        }))}
      />

      {/* Arc narratives */}
      <div className="mt-6 grid md:grid-cols-3 gap-4">
        {territoryScores.map((ts) => {
          const config = TERRITORY_CONFIG[ts.territory]
          return (
            <div
              key={ts.territory}
              className="text-center py-3 px-4 rounded-lg bg-[#F7F3ED]"
            >
              <p className="text-xs font-medium text-black/40 mb-1">
                {config.displayLabel}
              </p>
              <p
                className="text-sm font-medium"
                style={{ color: TERRITORY_COLORS[ts.territory] }}
              >
                {config.arcDescription}
              </p>
            </div>
          )
        })}
      </div>
    </SectionCard>
  )
}

// ---------------------------------------------------------------------------
// Section 03 — 15 Dimensions
// ---------------------------------------------------------------------------

function DimensionsSection({
  dimensionScores,
}: {
  dimensionScores: DimensionScore[]
}) {
  return (
    <SectionCard number={3} title="15 Dimensions">
      <p className="text-black/60 mb-6 text-sm">
        All 15 leadership dimensions, grouped by territory and color-coded by
        your score range.
      </p>
      <DimensionHeatmap dimensions={buildHeatmapData(dimensionScores)} />
    </SectionCard>
  )
}

// ---------------------------------------------------------------------------
// Section 04 — Priority Dimensions (Mirror / Meaning / Move)
// ---------------------------------------------------------------------------

function PriorityDimensionsSection({
  priorityDimensions,
  dimensionScores,
}: {
  priorityDimensions: DimensionId[]
  dimensionScores: DimensionScore[]
}) {
  return (
    <SectionCard number={4} title="Priority Dimensions">
      <p className="text-black/60 mb-6 text-sm">
        Your 3-5 most impactful development areas. Mirror the gap, understand
        the meaning, then move.
      </p>

      <div className="space-y-4">
        {priorityDimensions.map((dimId) => {
          const def = getDimension(dimId)
          const score = dimensionScores.find((ds) => ds.dimensionId === dimId)
          if (!score) return null

          const percentage = Math.round(score.percentage)
          const frameworks = getFrameworkPrescription(dimId, score.percentage)

          return (
            <div
              key={dimId}
              className="border border-black/10 rounded-lg p-6 hover:border-black/20 transition-colors"
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
                    {score.verbalLabel}
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

              {/* What this means */}
              <p className="text-sm text-black/70 mb-4 leading-relaxed">
                {def.coreQuestion}
              </p>

              {/* Framework prescriptions */}
              {frameworks.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-black/40 uppercase tracking-wider mb-2">
                    Recommended Frameworks
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {frameworks.map((fw) => (
                      <span
                        key={fw}
                        className="inline-block px-3 py-1.5 text-xs font-medium text-black bg-[#F7F3ED] rounded-full"
                      >
                        {fw}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </SectionCard>
  )
}

// ---------------------------------------------------------------------------
// Section 05 — Archetypes
// ---------------------------------------------------------------------------

function ArchetypesSection({
  archetypes,
}: {
  archetypes: ArchetypeMatch[]
}) {
  const hasMatches = archetypes.length > 0

  return (
    <SectionCard number={5} title="Archetypes">
      {hasMatches ? (
        <>
          <p className="text-black/60 mb-6 text-sm">
            Your leadership profile matches the following pattern
            {archetypes.length > 1 ? 's' : ''}.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {archetypes.map((arch) => (
              <ArchetypeBadge
                key={arch.name}
                name={arch.name}
                matchType={arch.matchType}
                signatureStrength={arch.signatureStrength}
                sjiConfirmed={arch.sjiConfirmed}
                displayRank={arch.displayRank}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-black/60 text-sm max-w-md mx-auto leading-relaxed">
            Your profile does not match a single dominant pattern. This is not
            unusual &mdash; focus on your priority dimensions for the most
            targeted development path.
          </p>
        </div>
      )}
    </SectionCard>
  )
}

// ---------------------------------------------------------------------------
// Section 06 — Blind Spots
// ---------------------------------------------------------------------------

function BlindSpotsSection({
  mirrorGaps,
  hasMirrorData,
}: {
  mirrorGaps?: MirrorGap[]
  hasMirrorData: boolean
}) {
  return (
    <SectionCard number={6} title="Blind Spots">
      {hasMirrorData && mirrorGaps && mirrorGaps.length > 0 ? (
        <>
          <p className="text-black/60 mb-6 text-sm">
            How others see your leadership compared to how you see yourself.
            Larger gaps signal blind spots worth exploring.
          </p>
          <MirrorDotPlot gaps={mirrorGaps.map(gap => ({
            dimensionId: gap.dimensionId,
            dimensionName: getDimension(gap.dimensionId).name,
            ceoPct: gap.ceoPct,
            raterPct: gap.raterPct,
            gapLabel: gap.gapLabel,
            severity: gap.severity,
          }))} />
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-black/60 text-sm max-w-md mx-auto leading-relaxed mb-6">
            Blind spot analysis requires a Mirror Check &mdash; a brief survey
            completed by someone who works closely with you.
          </p>
          <a
            href="/dashboard"
            className="inline-block bg-black text-white px-8 py-4 rounded-lg text-base font-semibold hover:bg-black/90 transition-colors"
          >
            Invite a Trusted Colleague
          </a>
        </div>
      )}
    </SectionCard>
  )
}

// ---------------------------------------------------------------------------
// Section 07 — Development Roadmap
// ---------------------------------------------------------------------------

function RoadmapSection({
  priorityDimensions,
  dimensionScores,
}: {
  priorityDimensions: DimensionId[]
  dimensionScores: DimensionScore[]
}) {
  const entries = buildRoadmapEntries(priorityDimensions, dimensionScores)

  return (
    <SectionCard number={7} title="Development Roadmap">
      <p className="text-black/60 mb-6 text-sm">
        Your 90-day plan based on priority dimensions and their framework
        prescriptions.
      </p>
      <RoadmapTimeline priorityDimensions={entries} />
    </SectionCard>
  )
}

// ---------------------------------------------------------------------------
// Section 08 — Closing
// ---------------------------------------------------------------------------

function ClosingSection() {
  return (
    <SectionCard number={8} title="What Comes Next">
      <div className="text-center py-4">
        <p className="text-lg text-black/70 max-w-lg mx-auto leading-relaxed mb-6">
          Leadership growth is not a destination &mdash; it is a practice.
          Return weekly to track your progress.
        </p>
        <a
          href="/dashboard"
          className="inline-block bg-black text-white px-8 py-4 rounded-lg text-base font-semibold hover:bg-black/90 transition-colors"
        >
          Go to Dashboard
        </a>
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
            <div className="h-8 w-48 bg-black/5 rounded mx-auto mb-3 animate-pulse" />
            <div className="h-4 w-72 bg-black/5 rounded mx-auto animate-pulse" />
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
          Unable to Load Results
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

export default function ResultsPage() {
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
              'No assessment results found. Complete the assessment first to view your results.'
            )
            setLoading(false)
            return
          }
          throw new Error(`Failed to load results (${response.status})`)
        }

        const data = await response.json()
        setResults(data.results)
      } catch (err) {
        console.error('Error loading results:', err)
        setError(
          'Something went wrong while loading your results. Please try again.'
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
          'No assessment results found. Complete the assessment first to view your results.'
        }
      />
    )
  }

  // Derived data
  const clmi = results.session.clmi ?? 0
  const hasMirrorData =
    results.mirrorGaps != null && results.mirrorGaps.length > 0
  const bsi = results.bsi

  return (
    <div className="min-h-screen bg-[#F7F3ED] print:bg-white">
      {/* Page header */}
      <header className="pt-12 pb-6 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-medium text-black/40 uppercase tracking-wider mb-2">
            CEO Lab Assessment
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-black">
            Your Leadership Report
          </h1>
        </div>
      </header>

      {/* Report sections */}
      <main className="max-w-4xl mx-auto px-6 pb-20 space-y-6">
        {/* 01 — The Headline */}
        <HeadlineSection
          clmi={clmi}
          bsi={bsi}
          hasMirrorData={hasMirrorData}
        />

        {/* 02 — Three Territories */}
        <TerritoriesSection territoryScores={results.territoryScores} />

        {/* 03 — 15 Dimensions */}
        <DimensionsSection dimensionScores={results.dimensionScores} />

        {/* 04 — Priority Dimensions */}
        <PriorityDimensionsSection
          priorityDimensions={results.priorityDimensions}
          dimensionScores={results.dimensionScores}
        />

        {/* 05 — Archetypes */}
        <ArchetypesSection archetypes={results.archetypes} />

        {/* 06 — Blind Spots */}
        <BlindSpotsSection
          mirrorGaps={results.mirrorGaps}
          hasMirrorData={hasMirrorData}
        />

        {/* 07 — Development Roadmap */}
        <RoadmapSection
          priorityDimensions={results.priorityDimensions}
          dimensionScores={results.dimensionScores}
        />

        {/* 08 — Closing */}
        <ClosingSection />
      </main>

      {/* Print styles (inline for portability) */}
      <style jsx global>{`
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          header,
          main {
            max-width: 100% !important;
          }
          section {
            break-inside: avoid;
            page-break-inside: avoid;
          }
        }
      `}</style>
    </div>
  )
}
