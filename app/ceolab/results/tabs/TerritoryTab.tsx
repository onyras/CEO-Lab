'use client'

import { TERRITORY_COLORS, TERRITORY_CONFIG, getDimension, getDimensionsByTerritory } from '@/lib/constants'
import { getVerbalLabel, getFrameworkPrescription } from '@/lib/scoring'
import {
  getTerritoryArcNarrative,
  DIMENSION_CONTENT,
  BLIND_SPOT_CLOSING,
  IM_HANDLING,
} from '@/lib/report-content'
import { getScoreInsight } from '@/lib/results-helpers'
import { analyzeTerritoryShape } from '@/lib/shape-analysis'
import { DIMENSION_BENCHMARKS, getBenchmarkContext } from '@/lib/benchmarks'
import dynamic from 'next/dynamic'
import { ScoreRing } from '@/components/visualizations/ScoreRing'
import type { DimensionScore, MirrorGap, TerritoryScore, Territory } from '@/types/assessment'

const TerritoryRadar = dynamic(
  () => import('@/components/visualizations/TerritoryRadar').then(m => ({ default: m.TerritoryRadar })),
  { ssr: false, loading: () => <div className="h-64 bg-black/5 rounded-lg animate-pulse" /> }
)

const MirrorDotPlot = dynamic(
  () => import('@/components/visualizations/MirrorDotPlot').then(m => ({ default: m.MirrorDotPlot })),
  { ssr: false, loading: () => <div className="h-48 bg-black/5 rounded-lg animate-pulse" /> }
)

interface TerritoryTabProps {
  territory: Territory
  territoryScores: TerritoryScore[]
  dimensionScores: DimensionScore[]
  mirrorGaps?: MirrorGap[]
  hasMirrorData: boolean
  imFlagged: boolean
}

export function TerritoryTab({
  territory,
  territoryScores,
  dimensionScores,
  mirrorGaps,
  hasMirrorData,
  imFlagged,
}: TerritoryTabProps) {
  const config = TERRITORY_CONFIG[territory]
  const color = TERRITORY_COLORS[territory]
  const terrScore = territoryScores.find(ts => ts.territory === territory)
  const score = Math.round(terrScore?.score ?? 0)
  const narrative = getTerritoryArcNarrative(territory, score)

  // Get the 5 dimensions for this territory
  const territoryDimDefs = getDimensionsByTerritory(territory)
  const dims = territoryDimDefs.map(def => {
    const ds = dimensionScores.find(d => d.dimensionId === def.id)
    return {
      def,
      score: ds,
      percentage: Math.round(ds?.percentage ?? 0),
      verbalLabel: ds?.verbalLabel ?? getVerbalLabel(ds?.percentage ?? 0),
    }
  })

  // Radar data for this territory
  const radarDims = dims.map(d => ({ name: d.def.name, percentage: d.percentage }))
  const shape = analyzeTerritoryShape(radarDims, config.displayLabel)
  const shapeLabel = shape.shape === 'balanced' ? 'Balanced Profile'
    : shape.shape === 'developing' ? 'Developing Profile'
    : 'Spiky Profile'

  // Blind spots for this territory
  const territoryGaps = (mirrorGaps ?? []).filter(g => {
    const def = getDimension(g.dimensionId)
    return def.territory === territory
  })
  const significantGaps = territoryGaps.filter(
    g => g.severity === 'significant' || g.severity === 'critical'
  )

  return (
    <div className="space-y-8">
      {/* Territory Header */}
      <section className="bg-white rounded-lg p-8 md:p-12 border border-black/10">
        <p className="font-mono text-xs uppercase tracking-[0.12em] text-black/40 mb-2">
          Territory
        </p>
        <h2 className="text-2xl font-bold text-black mb-2">{config.displayLabel}</h2>
        <p className="text-xs text-black/40 mb-6">{config.arcDescription}</p>

        <div className="flex flex-col md:flex-row gap-10 items-center">
          {/* Score ring */}
          <div className="flex flex-col items-center text-center flex-shrink-0">
            <ScoreRing
              value={score}
              size={160}
              strokeWidth={12}
              color={color}
              valueSuffix="%"
              showValue={true}
            />
            <p className="text-sm text-black/40 mt-4">{terrScore?.verbalLabel ?? ''} capacity</p>
          </div>

          {/* Narrative + shape */}
          <div className="flex-1 space-y-6">
            <p className="text-base text-black/60 leading-relaxed">{narrative}</p>

            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/2">
                <TerritoryRadar dimensions={radarDims} territory={territory} />
              </div>
              <div className="md:w-1/2 flex flex-col justify-center space-y-3">
                <p className="font-mono text-xs uppercase tracking-[0.12em] text-black/40">{shapeLabel}</p>
                <p className="text-sm text-black/60 leading-relaxed">{shape.narrative}</p>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                    <span className="text-xs text-black/50">Anchor: <span className="font-medium text-black/70">{shape.anchor.name} ({shape.anchor.percentage}%)</span></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-black/20" />
                    <span className="text-xs text-black/50">Bottleneck: <span className="font-medium text-black/70">{shape.bottleneck.name} ({shape.bottleneck.percentage}%)</span></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dimension Detail Cards */}
      <section>
        <div className="mb-6">
          <p className="font-mono text-xs uppercase tracking-[0.12em] text-black/40 mb-2 px-1">
            Your 5 Dimensions
          </p>
          <p className="text-sm text-black/50 px-1 max-w-xl">
            Each dimension represents a specific leadership capability. Below you will find your score, what it looks like when working and when not, and why it matters.
          </p>
        </div>

        <div className="space-y-6">
          {dims.map(({ def, score: dimScore, percentage, verbalLabel }) => {
            const content = DIMENSION_CONTENT[def.id]
            const insight = getScoreInsight(def.id, percentage)
            const bench = DIMENSION_BENCHMARKS[def.id]
            const benchCtx = getBenchmarkContext(def.id, percentage)
            const frameworks = getFrameworkPrescription(def.id, percentage)

            return (
              <div
                key={def.id}
                className="bg-white rounded-lg p-8 border border-black/10"
                style={{ borderLeftWidth: 3, borderLeftColor: color }}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-xs text-black/40 mb-0.5">{def.id}</p>
                    <h3 className="text-lg font-semibold text-black">{def.name}</h3>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <span className="text-2xl font-bold text-black">{percentage}%</span>
                    <p className="text-xs text-black/40 mt-0.5">{verbalLabel}</p>
                  </div>
                </div>

                {/* Score bar */}
                <div className="mb-2">
                  <div className="h-2.5 w-full rounded-full bg-black/[0.04] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500 ease-out"
                      style={{
                        width: `${Math.max(2, percentage)}%`,
                        backgroundColor: color,
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[10px] text-black/30">
                      Typical: {bench.p25}–{bench.p75}%
                    </span>
                    <span className="text-[10px] text-black/30">
                      {benchCtx.narrative}
                    </span>
                  </div>
                </div>

                {/* Insight */}
                {insight && (
                  <p className="text-sm text-black/60 leading-relaxed mt-4 mb-6">{insight}</p>
                )}

                {/* Behavioral definition */}
                <div className="mb-6">
                  <p className="font-mono text-xs uppercase tracking-[0.12em] text-black/40 mb-2">What This Means</p>
                  <p className="text-sm text-black/70 leading-relaxed">{content.behavioralDefinition}</p>
                </div>

                {/* Impact Areas — When Working / When Not */}
                <div className="mb-6">
                  <p className="font-mono text-xs uppercase tracking-[0.12em] text-black/40 mb-3">Impact Areas</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-lg p-5" style={{ backgroundColor: 'rgba(166, 190, 164, 0.08)' }}>
                      <p className="text-xs font-semibold text-[#6B8E6B] uppercase tracking-wider mb-2">When this is working</p>
                      <p className="text-sm text-black/70 leading-relaxed">{content.highIndicator}</p>
                    </div>
                    <div className="rounded-lg p-5" style={{ backgroundColor: 'rgba(224, 143, 106, 0.08)' }}>
                      <p className="text-xs font-semibold text-[#C0714E] uppercase tracking-wider mb-2">When this isn&apos;t</p>
                      <p className="text-sm text-black/70 leading-relaxed">{content.lowIndicator}</p>
                    </div>
                  </div>
                </div>

                {/* Cost of Ignoring */}
                <div className="mb-6">
                  <p className="font-mono text-xs uppercase tracking-[0.12em] text-black/40 mb-2">Why This Matters</p>
                  <p className="text-sm text-black/70 leading-relaxed mb-3">{content.costOfIgnoring}</p>
                  <div className="bg-[#F7F3ED] rounded-lg p-4">
                    <p className="font-mono text-xs uppercase tracking-[0.12em] text-black/40 mb-1">The Question to Sit With</p>
                    <p className="text-sm font-medium text-black/80 italic leading-relaxed">{def.coreQuestion}</p>
                  </div>
                </div>

                {/* Frameworks */}
                {frameworks.length > 0 && (
                  <div>
                    <p className="font-mono text-xs uppercase tracking-[0.12em] text-black/40 mb-2">Recommended Frameworks</p>
                    <div className="flex flex-wrap gap-2">
                      {frameworks.map((fw) => (
                        <span key={fw} className="inline-block px-3 py-1.5 text-xs font-medium text-black bg-[#F7F3ED] rounded-full">{fw}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* Territory Blind Spots */}
      <section className="bg-white rounded-lg p-8 md:p-12 border border-black/10">
        <p className="font-mono text-xs uppercase tracking-[0.12em] text-black/40 mb-2">
          Self-Perception Gaps
        </p>
        <h2 className="text-2xl font-bold text-black mb-2">
          Blind Spots in {config.displayLabel}
        </h2>
        <p className="text-sm text-black/50 mb-8 max-w-lg">
          How others experience your {config.displayLabel.toLowerCase()} capabilities compared to how you see them.
        </p>

        {hasMirrorData && territoryGaps.length > 0 ? (
          <>
            {imFlagged && (
              <div className="bg-[#F7F3ED] rounded-lg p-5 mb-6">
                <p className="text-sm text-black/70 leading-relaxed">{IM_HANDLING.mirrorElevation}</p>
              </div>
            )}

            <MirrorDotPlot
              gaps={territoryGaps.map((gap) => ({
                dimensionId: gap.dimensionId,
                dimensionName: getDimension(gap.dimensionId).name,
                ceoPct: gap.ceoPct,
                raterPct: gap.raterPct,
                gapLabel: gap.gapLabel,
                severity: gap.severity,
              }))}
            />

            {significantGaps.length > 0 && (
              <div className="mt-8 space-y-4">
                {significantGaps.map((gap) => {
                  const gapDef = getDimension(gap.dimensionId)
                  const gapDirection = gap.ceoPct > gap.raterPct ? 'higher than your rater' : 'lower than your rater'
                  const gapSize = Math.abs(Math.round(gap.ceoPct - gap.raterPct))

                  return (
                    <div
                      key={gap.dimensionId}
                      className="border-l-2 pl-5 py-3"
                      style={{ borderColor: gap.severity === 'critical' ? '#E08F6A' : '#7FABC8' }}
                    >
                      <p className="text-xs font-semibold text-black/40 uppercase tracking-wider mb-1">
                        {gapDef.name} <span className="normal-case font-normal">&mdash; {gap.gapLabel}</span>
                      </p>
                      <p className="text-sm text-black/70 leading-relaxed">
                        You rated yourself {gapSize} points {gapDirection} on {gapDef.name}. This gap suggests that your experience of your own leadership differs meaningfully from how it lands with others.
                      </p>
                    </div>
                  )
                })}
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-black/10">
              <p className="text-sm text-black/60 leading-relaxed">{BLIND_SPOT_CLOSING}</p>
            </div>
          </>
        ) : (
          <div className="text-center py-6">
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
        )}
      </section>
    </div>
  )
}
