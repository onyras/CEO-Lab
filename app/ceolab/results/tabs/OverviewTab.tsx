'use client'

import { TERRITORY_COLORS, TERRITORY_CONFIG, getDimension } from '@/lib/constants'
import { getVerbalLabel } from '@/lib/scoring'
import {
  buildHeadlineText,
  buildBsiHeadlineText,
  IM_HANDLING,
} from '@/lib/report-content'
import { ScoreRing } from '@/components/visualizations/ScoreRing'
import { LeadershipCircle } from '@/components/visualizations/LeadershipCircle'
import { RadarChart } from '@/components/visualizations/RadarChart'
import type { DimensionScore, TerritoryScore } from '@/types/assessment'

interface OverviewTabProps {
  clmi: number
  bsi?: number
  hasMirrorData: boolean
  territoryScores: TerritoryScore[]
  dimensionScores: DimensionScore[]
  imFlagged: boolean
}

function getClmiInterpretation(score: number): string {
  if (score <= 20) return 'Foundational stage — significant growth opportunities ahead'
  if (score <= 40) return 'Early foundations are forming across your leadership territories'
  if (score <= 60) return 'Solid mid-range capability with clear areas to develop further'
  if (score <= 80) return 'Strong leadership maturity across your three territories'
  return 'Exceptional leadership maturity — focus on sustaining and mentoring'
}

export function OverviewTab({ clmi, bsi, hasMirrorData, territoryScores, dimensionScores, imFlagged }: OverviewTabProps) {
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

  return (
    <>
      {/* CLMI Score + Territory Breakdown */}
      <div className="bg-white rounded-lg p-8 md:p-10 border border-black/10 mb-6">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
          <div className="flex flex-col items-center text-center flex-shrink-0">
            <p className="text-sm text-black/50 mb-4">CEO Leadership Maturity Index</p>
            <ScoreRing value={clmi} size={200} strokeWidth={14} color="#000" label={label} />
            <p className="text-sm text-black/50 mt-4 max-w-[240px]">{getClmiInterpretation(clmi)}</p>
          </div>

          <div className="flex-1 w-full space-y-3">
            {territoryScores.map((ts) => (
              <div key={ts.territory} className="flex items-center gap-4 p-4 rounded-lg bg-[#F7F3ED]/50">
                <ScoreRing value={ts.score} size={56} strokeWidth={4} color={TERRITORY_COLORS[ts.territory]} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-black">{TERRITORY_CONFIG[ts.territory].displayLabel}</p>
                  <p className="text-xs text-black/40">{ts.verbalLabel}</p>
                </div>
                <span className="text-lg font-bold text-black">{Math.round(ts.score)}%<span className="text-xs font-medium text-black/40 ml-1">capacity</span></span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-base text-black/60 max-w-xl mx-auto leading-relaxed text-center mt-6">{headlineText}</p>

        {hasMirrorData && bsi != null && (
          <p className="text-sm text-black/50 mt-3 max-w-xl mx-auto text-center">{buildBsiHeadlineText(bsi)}</p>
        )}

        {imFlagged && (
          <div className="mt-4 bg-[#F7F3ED] rounded-lg p-4 max-w-xl mx-auto text-left">
            <p className="text-xs font-semibold text-black/40 uppercase tracking-wider mb-1">A Note on Your Responses</p>
            <p className="text-sm text-black/70 leading-relaxed">{IM_HANDLING.headlineAdvisory}</p>
          </div>
        )}
      </div>

      {/* Leadership Profile */}
      <div className="bg-white rounded-lg p-8 md:p-10 border border-black/10 mb-6">
        <h2 className="text-xl font-bold text-black mb-1">Leadership Profile</h2>
        <p className="text-sm text-black/50 mb-4">Your shape across 15 dimensions</p>
        <div className="space-y-8">
          <LeadershipCircle dimensions={radarData} clmiScore={clmi} />
          <RadarChart dimensions={radarData} className="max-w-full" />
        </div>
      </div>
    </>
  )
}
