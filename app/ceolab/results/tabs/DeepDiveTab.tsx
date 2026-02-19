'use client'

import { TERRITORY_COLORS, TERRITORY_CONFIG, getDimension } from '@/lib/constants'
import { getVerbalLabel } from '@/lib/scoring'
import { getTerritoryArcNarrative } from '@/lib/report-content'
import {
  buildHeatmapData,
  getDimPriorities,
  getQuarterlyProjection,
  PRIORITY_CONFIG,
  getScoreInsight,
} from '@/lib/results-helpers'
import { ScoreRing } from '@/components/visualizations/ScoreRing'
import { DimensionHeatmap } from '@/components/visualizations/DimensionHeatmap'
import { TerritoryRadar } from '@/components/visualizations/TerritoryRadar'
import { analyzeTerritoryShape } from '@/lib/shape-analysis'
import { DIMENSION_BENCHMARKS, getBenchmarkContext } from '@/lib/benchmarks'
import type { DimensionScore, TerritoryScore, Territory } from '@/types/assessment'

interface DeepDiveTabProps {
  dimensionScores: DimensionScore[]
  territoryScores: TerritoryScore[]
}

export function DeepDiveTab({ dimensionScores, territoryScores }: DeepDiveTabProps) {
  const enrichedScores = dimensionScores.map((ds) => {
    const def = getDimension(ds.dimensionId)
    return {
      dimensionId: ds.dimensionId,
      name: def.name,
      score: Math.round(ds.percentage),
      label: ds.verbalLabel,
      territory: def.territory,
    }
  })

  const priorities = getDimPriorities(enrichedScores)
  const territories: Territory[] = ['leading_yourself', 'leading_teams', 'leading_organizations']

  return (
    <div className="space-y-6">
      {/* Three Territories — bento cards */}
      <div className="grid md:grid-cols-3 gap-4">
        {territoryScores.map((ts) => {
          const config = TERRITORY_CONFIG[ts.territory]
          const color = TERRITORY_COLORS[ts.territory]
          const narrative = getTerritoryArcNarrative(ts.territory, ts.score)
          const score = Math.round(ts.score)

          return (
            <div
              key={ts.territory}
              className="bg-white rounded-lg border border-black/10 overflow-hidden"
            >
              {/* Headline */}
              <div className="px-6 pt-6 pb-0">
                <h3 className="text-lg font-bold text-black">{config.displayLabel}</h3>
                <p className="text-xs text-black/40 mt-0.5">{config.arcDescription}</p>
              </div>
              {/* Score area */}
              <div className="px-6 pt-4 pb-6 flex flex-col items-center">
                <ScoreRing
                  value={score}
                  size={100}
                  strokeWidth={6}
                  color={color}
                  valueSuffix="%"
                  showValue={true}
                />
                <p className="text-sm text-black/40 mt-3">{ts.verbalLabel} capacity</p>
              </div>
              {/* Narrative */}
              <div className="px-6 pb-6">
                <p className="text-sm text-black/60 leading-relaxed">{narrative}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Territory Deep Dives — 5 dimensions per territory */}
      {territories.map((t) => {
        const config = TERRITORY_CONFIG[t]
        const color = TERRITORY_COLORS[t]
        const terrScore = territoryScores.find((ts) => ts.territory === t)
        const dims = enrichedScores.filter((d) => d.territory === t)

        return (
          <div key={`deep-${t}`} className="bg-white rounded-lg p-6 md:p-8 border border-black/10">
            {/* Territory header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-black">{config.displayLabel}</h2>
                <p className="text-xs text-black/40 mt-0.5">{config.arcDescription}</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-black">{Math.round(terrScore?.score ?? 0)}%</span>
                <p className="text-xs text-black/40">{terrScore?.verbalLabel ?? ''} capacity</p>
              </div>
            </div>

            {/* Territory Shape Radar + Narrative */}
            {(() => {
              const radarDims = dims.map(d => ({ name: d.name, percentage: d.score }))
              const shape = analyzeTerritoryShape(radarDims, config.displayLabel)
              const shapeLabel = shape.shape === 'balanced' ? 'Balanced Profile'
                : shape.shape === 'developing' ? 'Developing Profile'
                : 'Spiky Profile'

              return (
                <div className="flex flex-col md:flex-row gap-6 mb-6">
                  <div className="md:w-1/2">
                    <TerritoryRadar dimensions={radarDims} territory={t} />
                  </div>
                  <div className="md:w-1/2 flex flex-col justify-center space-y-3">
                    <p className="text-xs font-semibold text-black/40 uppercase tracking-wider">{shapeLabel}</p>
                    <p className="text-sm text-black/60 leading-relaxed">{shape.narrative}</p>
                    <div className="flex gap-4">
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
              )
            })()}

            {/* 5 dimension bars */}
            <div className="space-y-4">
              {dims.map((dim) => {
                const score = dim.score
                const bench = DIMENSION_BENCHMARKS[dim.dimensionId]
                const benchCtx = getBenchmarkContext(dim.dimensionId, score)
                return (
                  <div key={dim.dimensionId}>
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-sm font-medium text-black">{dim.name}</p>
                      <span className="text-sm font-bold text-black">{score}%</span>
                    </div>
                    <div className="bg-black/[0.04] rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500 ease-out"
                        style={{
                          width: `${Math.max(2, score)}%`,
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
                )
              })}
            </div>
          </div>
        )
      })}

      {/* 15 Dimensions Heatmap */}
      <div className="bg-white rounded-lg p-8 md:p-10 border border-black/10">
        <h2 className="text-xl font-bold text-black mb-1">15 Dimensions</h2>
        <p className="text-sm text-black/50 mb-6">All dimensions color-coded by your score range</p>
        <DimensionHeatmap dimensions={buildHeatmapData(dimensionScores)} />
      </div>

      {/* Per-territory dimension rows */}
      {territories.map((t) => {
        const config = TERRITORY_CONFIG[t]
        const color = TERRITORY_COLORS[t]
        const terrScore = territoryScores.find((ts) => ts.territory === t)
        const dims = enrichedScores.filter((d) => d.territory === t)

        return (
          <div key={t} className="bg-white rounded-lg p-6 md:p-8 border border-black/10">
            {/* Territory header */}
            <div className="flex items-center gap-4 mb-6">
              <ScoreRing
                value={terrScore?.score ?? 0}
                size={56}
                strokeWidth={4}
                color={color}
              />
              <div>
                <h2 className="text-lg font-semibold text-black">{config.displayLabel}</h2>
                <p className="text-xs text-black/40">{terrScore?.verbalLabel ?? ''} · {Math.round(terrScore?.score ?? 0)}% capacity</p>
              </div>
            </div>

            {/* 5 dimension rows */}
            <div className="space-y-1">
              {dims.map((dim) => {
                const score = dim.score
                const priority = priorities[dim.dimensionId]
                const insight = getScoreInsight(dim.dimensionId, score)

                return (
                  <div key={dim.dimensionId}>
                    <div className="p-4 rounded-lg">
                      {/* Name + priority badge + score */}
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <div className="flex items-center gap-2 min-w-0 flex-wrap">
                          <p className="text-sm font-semibold text-black">{dim.name}</p>
                          {priority && (
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${PRIORITY_CONFIG[priority].color}`}>
                              {PRIORITY_CONFIG[priority].label}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-lg font-bold text-black">{score}%</span>
                        </div>
                      </div>

                      {/* Score bar */}
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex-1 bg-black/[0.04] rounded-full h-2.5 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500 ease-out"
                            style={{
                              width: `${Math.max(2, score)}%`,
                              backgroundColor: color,
                            }}
                          />
                        </div>
                        <span className={`text-[10px] font-semibold uppercase tracking-wide flex-shrink-0 ${
                          score >= 80 ? 'text-[#A6BEA4]'
                            : score >= 60 ? 'text-black/50'
                            : score >= 40 ? 'text-[#E08F6A]'
                            : 'text-red-400'
                        }`}>
                          {dim.label}
                        </span>
                      </div>

                      {/* Quarterly growth trajectory */}
                      <div className="flex gap-2 mt-3 mb-2">
                        {getQuarterlyProjection(score).map((qd, qi, arr) => {
                          const vLabel = getVerbalLabel(qd.score)
                          const delta = qi > 0 ? qd.score - arr[qi - 1].score : 0

                          if (qd.isNow) {
                            return (
                              <div
                                key={qd.q}
                                className="flex-1 rounded-[10px] py-3 px-2 text-center"
                                style={{ backgroundColor: color }}
                              >
                                <div className="text-[9px] font-bold text-white/70 uppercase tracking-wide mb-1">
                                  Q1 — Now
                                </div>
                                <div className="text-[22px] font-bold text-white leading-tight">{qd.score}%</div>
                                <div className="text-[9px] text-white/60 mt-0.5">{vLabel}</div>
                              </div>
                            )
                          }

                          const borderOpacity = qi === 1 ? 0.1 : qi === 2 ? 0.08 : 0.06
                          const textOpacity = qi === 1 ? 0.25 : qi === 2 ? 0.2 : 0.15
                          const scoreOpacity = qi === 1 ? 0.2 : qi === 2 ? 0.15 : 0.1
                          const labelOpacity = qi === 1 ? 0.15 : qi === 2 ? 0.12 : 0.08
                          const deltaOpacity = qi === 1 ? 1 : qi === 2 ? 0.5 : 0.35

                          return (
                            <div
                              key={qd.q}
                              className="flex-1 rounded-[10px] py-3 px-2 text-center relative"
                              style={{ border: `1.5px dashed rgba(0,0,0,${borderOpacity})` }}
                            >
                              <div
                                className="text-[9px] font-semibold uppercase tracking-wide mb-1"
                                style={{ color: `rgba(0,0,0,${textOpacity})` }}
                              >
                                {qd.q}
                              </div>
                              <div
                                className="text-[22px] font-bold leading-tight"
                                style={{ color: `rgba(0,0,0,${scoreOpacity})` }}
                              >
                                {qd.score}%
                              </div>
                              <div
                                className="text-[9px] mt-0.5"
                                style={{ color: `rgba(0,0,0,${labelOpacity})` }}
                              >
                                {vLabel}
                              </div>
                              {delta > 0 && (
                                <div
                                  className="absolute -top-2.5 right-2 text-[9px] font-semibold"
                                  style={{ color, opacity: deltaOpacity }}
                                >
                                  +{delta}
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>

                      {/* Score insight — always visible */}
                      <p className="text-xs text-black/50 leading-relaxed">
                        {insight}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
