'use client'

import { TERRITORY_COLORS, getDimension } from '@/lib/constants'
import { getFrameworkPrescription } from '@/lib/scoring'
import { DIMENSION_CONTENT, CLOSING_TEXT } from '@/lib/report-content'
import { buildRoadmapEntries } from '@/lib/results-helpers'
import { RoadmapTimeline } from '@/components/visualizations/RoadmapTimeline'
import type { DimensionScore, DimensionId } from '@/types/assessment'

interface RoadmapTabProps {
  priorityDimensions: DimensionId[]
  dimensionScores: DimensionScore[]
}

export function RoadmapTab({ priorityDimensions, dimensionScores }: RoadmapTabProps) {
  const entries = buildRoadmapEntries(priorityDimensions, dimensionScores)
  const top3 = priorityDimensions.slice(0, 3)

  return (
    <div className="space-y-6">
      {/* Roadmap timeline */}
      <div className="bg-white rounded-lg p-8 md:p-10 border border-black/10">
        <h2 className="text-xl font-bold text-black mb-1">Your Growth Path</h2>
        <p className="text-sm text-black/50 mb-6">Your 90-day leadership growth plan</p>
        <RoadmapTimeline priorityDimensions={entries} />

        {/* First moves */}
        <div className="mt-8 space-y-6">
          <p className="text-xs font-semibold text-black/40 uppercase tracking-wider">Your First Moves</p>

          {top3.map((dimId) => {
            const def = getDimension(dimId)
            const score = dimensionScores.find((ds) => ds.dimensionId === dimId)
            const percentage = score?.percentage ?? 0
            const frameworks = getFrameworkPrescription(dimId, percentage)
            const content = DIMENSION_CONTENT[dimId]
            const primaryFramework = frameworks.length > 0 ? frameworks[0] : 'See framework list above'

            return (
              <div key={dimId} className="border border-black/10 rounded-lg p-5">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="text-base font-semibold text-black">{def.name}</h4>
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded-full text-white shrink-0 ml-3"
                    style={{ backgroundColor: TERRITORY_COLORS[def.territory] }}
                  >
                    {primaryFramework}
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-semibold text-black/50 mb-1">This week:</p>
                    <p className="text-sm text-black/70 leading-relaxed">{content.highIndicator.split('.')[0]}.</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-black/50 mb-1">Observable shift:</p>
                    <p className="text-sm text-black/70 leading-relaxed">
                      {percentage <= 40
                        ? `You will notice moments where you catch the old pattern before it completes. That noticing is the first sign of growth in ${def.name}.`
                        : percentage <= 60
                          ? `You will begin to see consistency where there was previously inconsistency. ${def.name} will shift from something you do sometimes to something others can count on.`
                          : `The shift will be subtle but others will notice: ${def.name} will move from a personal practice to something that shapes how your team operates.`}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Reassessment reminder */}
        <div className="mt-8 bg-[#F7F3ED] rounded-lg p-5 text-center">
          <p className="text-xs font-semibold text-black/40 uppercase tracking-wider mb-2">Quarterly Reassessment</p>
          <p className="text-sm text-black/60 leading-relaxed max-w-lg mx-auto">
            Retake the full assessment in 90 days to measure your progress. Meaningful shift in leadership behavior takes 8-12 weeks of deliberate practice.
          </p>
        </div>
      </div>

      {/* Closing */}
      <div className="bg-white rounded-lg p-8 md:p-10 border border-black/10">
        <h2 className="text-xl font-bold text-black mb-4">What Comes Next</h2>
        <div className="text-center py-4">
          <div className="max-w-lg mx-auto mb-8">
            {CLOSING_TEXT.split('\n\n').map((paragraph, i) => (
              <p key={i} className="text-lg text-black/70 leading-relaxed mb-4 last:mb-0">{paragraph}</p>
            ))}
          </div>
          <a
            href="/dashboard"
            className="inline-block bg-black text-white px-8 py-4 rounded-lg text-base font-semibold hover:bg-black/90 transition-colors"
          >
            Go to Plan
          </a>
        </div>
      </div>
    </div>
  )
}
