'use client'

import { TERRITORY_COLORS, TERRITORY_CONFIG, getDimension } from '@/lib/constants'
import { getVerbalLabel } from '@/lib/scoring'
import {
  buildHeadlineText,
  buildBsiHeadlineText,
  IM_HANDLING,
  ARCHETYPE_DESCRIPTIONS,
} from '@/lib/report-content'
import dynamic from 'next/dynamic'
import { ScoreRing } from '@/components/visualizations/ScoreRing'
import { ArchetypeBadge } from '@/components/visualizations/ArchetypeBadge'
import type { ArchetypeMatch, DimensionScore, MirrorGap, TerritoryScore, Territory } from '@/types/assessment'

const RadarChart = dynamic(
  () => import('@/components/visualizations/RadarChart').then(m => ({ default: m.RadarChart })),
  { ssr: false, loading: () => <div className="h-64 bg-black/5 rounded-lg animate-pulse" /> }
)

interface OverviewTabProps {
  clmi: number
  bsi?: number
  hasMirrorData: boolean
  territoryScores: TerritoryScore[]
  dimensionScores: DimensionScore[]
  archetypes: ArchetypeMatch[]
  mirrorGaps?: MirrorGap[]
  imFlagged: boolean
  onNavigateToTab: (tab: string) => void
}

function getClmiInterpretation(score: number): string {
  if (score <= 20) return 'Foundational stage — significant growth opportunities ahead'
  if (score <= 40) return 'Early foundations are forming across your leadership territories'
  if (score <= 60) return 'Solid mid-range capability with clear areas to develop further'
  if (score <= 80) return 'Strong leadership maturity across your three territories'
  return 'Exceptional leadership maturity — focus on sustaining and mentoring'
}

const TERRITORY_TAB_MAP: Record<Territory, string> = {
  leading_yourself: 'leading-yourself',
  leading_teams: 'leading-teams',
  leading_organizations: 'leading-organizations',
}

export function OverviewTab({
  clmi,
  bsi,
  hasMirrorData,
  territoryScores,
  dimensionScores,
  archetypes,
  mirrorGaps,
  imFlagged,
  onNavigateToTab,
}: OverviewTabProps) {
  const label = getVerbalLabel(clmi)

  const headlineText = buildHeadlineText(
    clmi,
    label,
    territoryScores.map((ts) => ({
      territory: ts.territory,
      score: ts.score,
      label: ts.verbalLabel,
    }))
  )

  const radarData = dimensionScores.map((ds) => {
    const def = getDimension(ds.dimensionId)
    return {
      dimensionId: ds.dimensionId,
      name: def.name,
      territory: def.territory,
      percentage: Math.round(ds.percentage),
    }
  })

  const significantGaps = (mirrorGaps ?? []).filter(
    (g) => g.severity === 'significant' || g.severity === 'critical'
  )

  return (
    <div className="space-y-8">
      {/* CLMI Score + Territory Breakdown */}
      <section className="bg-white rounded-lg p-8 md:p-12 border border-black/10">
        <p className="font-mono text-sm uppercase tracking-[0.12em] text-black/50 mb-2 text-center">
          Your Overall Score
        </p>
        <h2 className="text-3xl font-bold text-black mb-2 text-center">
          CEO Leadership Maturity Index
        </h2>
        <p className="text-base text-black/60 text-center mb-10 max-w-lg mx-auto">
          Your CLMI reflects how consistently your leadership shows up across all three territories. It is not a grade — it is a starting point.
        </p>

        <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-center">
          <div className="flex flex-col items-center text-center flex-shrink-0">
            <ScoreRing value={clmi} size={220} strokeWidth={16} color="#000" label={label} />
            <p className="text-base text-black/60 mt-5 max-w-[260px]">{getClmiInterpretation(clmi)}</p>
          </div>

          <div className="flex-1 w-full space-y-4">
            {territoryScores.map((ts) => (
              <button
                key={ts.territory}
                onClick={() => onNavigateToTab(TERRITORY_TAB_MAP[ts.territory])}
                className="w-full flex items-center gap-5 p-5 rounded-lg bg-[#F7F3ED]/50 hover:bg-[#F7F3ED]/80 transition-colors text-left group"
              >
                <ScoreRing value={ts.score} size={56} strokeWidth={4} color={TERRITORY_COLORS[ts.territory]} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-black">{TERRITORY_CONFIG[ts.territory].displayLabel}</p>
                  <p className="text-base text-black/60">{ts.verbalLabel}</p>
                </div>
                <span className="text-lg font-bold text-black">
                  {Math.round(ts.score)}%
                  <span className="text-xs font-medium text-black/40 ml-1">capacity</span>
                </span>
                <svg className="w-4 h-4 text-black/20 group-hover:text-black/50 transition-colors flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>
        </div>

        <p className="text-base text-black/60 max-w-2xl mx-auto leading-relaxed text-center mt-8">{headlineText}</p>

        {hasMirrorData && bsi != null && (
          <p className="text-base text-black/60 mt-3 max-w-2xl mx-auto text-center">{buildBsiHeadlineText(bsi)}</p>
        )}

        {imFlagged && (
          <div className="mt-6 bg-[#F7F3ED] rounded-lg p-5 max-w-2xl mx-auto text-left">
            <p className="text-xs font-semibold text-black/40 uppercase tracking-wider mb-1">A Note on Your Responses</p>
            <p className="text-base text-black/70 leading-relaxed">{IM_HANDLING.headlineAdvisory}</p>
          </div>
        )}
      </section>

      {/* Leadership Archetypes */}
      <section className="bg-white rounded-lg p-8 md:p-12 border border-black/10">
        <p className="font-mono text-sm uppercase tracking-[0.12em] text-black/50 mb-2">
          Your Leadership Pattern
        </p>
        <h2 className="text-3xl font-bold text-black mb-2">Archetypes</h2>
        <p className="text-base text-black/60 mb-8 max-w-lg">
          Archetypes are not labels. They are patterns — recurring combinations of strengths and blind spots that shape how you lead.
        </p>

        {imFlagged && (
          <div className="bg-[#F7F3ED] rounded-lg p-5 mb-8">
            <p className="text-base text-black/70 leading-relaxed">{IM_HANDLING.archetypeNote}</p>
          </div>
        )}

        {archetypes.length > 0 ? (
          <>
            {/* Large archetype badges */}
            <div className="grid md:grid-cols-3 gap-6 mb-10">
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

            {/* Archetype detail cards */}
            <div className="space-y-6">
              {archetypes.map((arch) => {
                const desc = ARCHETYPE_DESCRIPTIONS[arch.name]
                if (!desc) return null

                return (
                  <div key={arch.name} className="border border-black/10 rounded-lg p-8">
                    <div className="mb-5">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-black">{desc.name}</h3>
                        <span className="text-xs font-medium text-black/40 px-2 py-0.5 bg-[#F7F3ED] rounded-full">
                          {arch.matchType === 'full' ? 'Full match' : 'Partial match'}
                        </span>
                      </div>
                      <p className="text-base text-black/70 leading-relaxed font-medium italic">{desc.oneSentence}</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-5">
                      <div>
                        <p className="font-mono text-sm uppercase tracking-[0.12em] text-black/50 mb-2">What This Looks Like</p>
                        <p className="text-base text-black/70 leading-relaxed">{desc.whatThisLooksLike}</p>
                      </div>
                      <div>
                        <p className="font-mono text-sm uppercase tracking-[0.12em] text-black/50 mb-2">What This Is Costing You</p>
                        <p className="text-base text-black/70 leading-relaxed">{desc.whatThisIsCostingYou}</p>
                      </div>
                    </div>

                    <div className="mb-5">
                      <p className="font-mono text-sm uppercase tracking-[0.12em] text-black/50 mb-2">The Shift</p>
                      <p className="text-base text-black/70 leading-relaxed">{desc.theShift}</p>
                    </div>

                    {desc.frameworkReferences.length > 0 && (
                      <div>
                        <p className="font-mono text-sm uppercase tracking-[0.12em] text-black/50 mb-2">Key Frameworks</p>
                        <div className="flex flex-wrap gap-2">
                          {desc.frameworkReferences.map((fw) => (
                            <span key={fw} className="inline-block px-3 py-1.5 text-xs font-medium text-black bg-[#F7F3ED] rounded-full">{fw}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-black/60 text-sm max-w-md mx-auto leading-relaxed">
              Your profile doesn&apos;t match a single dominant pattern. This usually means a balanced profile or a transitional phase.
            </p>
          </div>
        )}
      </section>

      {/* Leadership Profile Radar */}
      <section className="bg-white rounded-lg p-8 md:p-12 border border-black/10">
        <p className="font-mono text-sm uppercase tracking-[0.12em] text-black/50 mb-2">
          Your Shape
        </p>
        <h2 className="text-3xl font-bold text-black mb-2">Leadership Profile</h2>
        <p className="text-base text-black/60 mb-8 max-w-lg">
          This radar shows your shape across all 15 dimensions. Spikes are strengths. Dips are where your growth lives.
        </p>
        <RadarChart dimensions={radarData} className="max-w-full" />
      </section>

      {/* Blind Spots Summary */}
      <section className="bg-white rounded-lg p-8 md:p-12 border border-black/10">
        <p className="font-mono text-sm uppercase tracking-[0.12em] text-black/50 mb-2">
          Self-Perception Gaps
        </p>
        <h2 className="text-3xl font-bold text-black mb-2">Blind Spots</h2>
        <p className="text-base text-black/60 mb-8 max-w-lg">
          Where others see your leadership differently from how you see it. These are not flaws — they are information gaps worth exploring.
        </p>

        {hasMirrorData && significantGaps.length > 0 ? (
          <div className="space-y-4 mb-8">
            {significantGaps.slice(0, 3).map((gap) => {
              const def = getDimension(gap.dimensionId)
              const gapSize = Math.abs(Math.round(gap.ceoPct - gap.raterPct))
              const territory = def.territory

              return (
                <div
                  key={gap.dimensionId}
                  className="flex items-start gap-4 p-5 rounded-lg border border-black/10"
                >
                  <div
                    className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                    style={{ backgroundColor: gap.severity === 'critical' ? '#E08F6A' : '#7FABC8' }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-black mb-1">{def.name}</p>
                    <p className="text-base text-black/70">
                      {gapSize}-point gap &middot; {gap.gapLabel} &middot; {TERRITORY_CONFIG[territory].displayLabel}
                    </p>
                  </div>
                  <button
                    onClick={() => onNavigateToTab(TERRITORY_TAB_MAP[territory])}
                    className="text-xs font-medium text-black/40 hover:text-black/70 transition-colors flex-shrink-0"
                  >
                    Explore &rarr;
                  </button>
                </div>
              )
            })}
          </div>
        ) : !hasMirrorData ? (
          <div className="text-center py-6 mb-6">
            <p className="text-black/60 text-sm max-w-md mx-auto leading-relaxed mb-6">
              Blind spot analysis requires a Mirror Check — a brief survey completed by someone who works closely with you.
            </p>
            <a
              href="/assessment/mirror"
              className="inline-block bg-black text-white px-10 py-4 rounded-lg text-base font-semibold hover:bg-black/90 transition-colors"
            >
              Invite a Trusted Colleague
            </a>
          </div>
        ) : (
          <p className="text-base text-black/60 text-center py-6">
            No significant blind spots detected. Your self-perception aligns well with how others see you.
          </p>
        )}
      </section>

      {/* Territory CTAs */}
      <section className="bg-white rounded-lg p-8 md:p-12 border border-black/10">
        <p className="font-mono text-sm uppercase tracking-[0.12em] text-black/50 mb-2 text-center">
          Dive Deeper
        </p>
        <h2 className="text-3xl font-bold text-black mb-2 text-center">Explore Each Territory</h2>
        <p className="text-base text-black/60 text-center mb-10 max-w-lg mx-auto">
          Each territory tab shows your dimension scores, impact areas, blind spots, and recommended frameworks.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {territoryScores.map((ts) => {
            const config = TERRITORY_CONFIG[ts.territory]
            const color = TERRITORY_COLORS[ts.territory]
            const dims = dimensionScores.filter(ds => getDimension(ds.dimensionId).territory === ts.territory)
            const lowestDim = dims.reduce((low, d) => d.percentage < low.percentage ? d : low, dims[0])
            const lowestDef = lowestDim ? getDimension(lowestDim.dimensionId) : null

            return (
              <button
                key={ts.territory}
                onClick={() => onNavigateToTab(TERRITORY_TAB_MAP[ts.territory])}
                className="text-left p-8 rounded-lg border border-black/10 hover:border-black/20 transition-all group"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-sm font-semibold text-black">{config.displayLabel}</span>
                </div>

                <div className="mb-4">
                  <span className="text-3xl font-bold text-black">{Math.round(ts.score)}%</span>
                  <span className="text-base text-black/50 ml-2">{ts.verbalLabel}</span>
                </div>

                {lowestDef && (
                  <p className="text-base text-black/60 mb-6">
                    Biggest opportunity: <span className="font-medium text-black/60">{lowestDef.name}</span>
                  </p>
                )}

                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-black group-hover:gap-2.5 transition-all">
                  Explore {config.displayLabel}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </button>
            )
          })}
        </div>
      </section>
    </div>
  )
}
