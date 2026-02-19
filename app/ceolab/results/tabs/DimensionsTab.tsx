'use client'

import { TERRITORY_COLORS, TERRITORY_CONFIG, getDimension } from '@/lib/constants'
import { getFrameworkPrescription } from '@/lib/scoring'
import { IM_HANDLING, DIMENSION_CONTENT } from '@/lib/report-content'
import type { DimensionScore, DimensionId } from '@/types/assessment'

interface DimensionsTabProps {
  dimensionScores: DimensionScore[]
  priorityDimensions: DimensionId[]
  imFlagged: boolean
}

export function DimensionsTab({ dimensionScores, priorityDimensions, imFlagged }: DimensionsTabProps) {
  return (
    <div className="space-y-6">
      {/* Priority Dimensions (Mirror/Meaning/Move) */}
      <div className="bg-white rounded-lg p-8 md:p-10 border border-black/10">
        <h2 className="text-xl font-bold text-black mb-1">Priority Dimensions</h2>
        <p className="text-sm text-black/50 mb-6">
          Your most impactful development areas. Mirror the gap, understand the meaning, then move.
        </p>

        {imFlagged && (
          <div className="bg-[#F7F3ED] rounded-lg p-5 mb-6">
            <p className="text-sm text-black/70 leading-relaxed">
              {IM_HANDLING.priorityFrameworkNote}
            </p>
          </div>
        )}

        <div className="space-y-8">
          {priorityDimensions.map((dimId) => {
            const def = getDimension(dimId)
            const score = dimensionScores.find((ds) => ds.dimensionId === dimId)
            if (!score) return null

            const percentage = Math.round(score.percentage)
            const frameworks = getFrameworkPrescription(dimId, score.percentage)
            const content = DIMENSION_CONTENT[dimId]
            const isLow = score.percentage <= 50

            return (
              <div key={dimId} className="border border-black/10 rounded-lg p-6 hover:border-black/20 transition-colors">
                {/* Header row */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-xs font-medium text-black/40 mb-0.5">
                      {def.id} &middot; {TERRITORY_CONFIG[def.territory].displayLabel}
                    </p>
                    <h3 className="text-lg font-semibold text-black">{def.name}</h3>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <span className="text-2xl font-bold text-black">{score.verbalLabel}</span>
                    <p className="text-xs text-black/50 mt-0.5">{percentage}% capacity</p>
                  </div>
                </div>

                {/* Score bar */}
                <div className="h-2 w-full rounded-full bg-[#F7F3ED] overflow-hidden mb-6">
                  <div
                    className="h-full rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: TERRITORY_COLORS[def.territory],
                    }}
                  />
                </div>

                {/* MIRROR */}
                <div className="mb-6">
                  <p className="text-xs font-semibold text-black/40 uppercase tracking-wider mb-2">Mirror</p>
                  <p className="text-sm text-black/70 leading-relaxed mb-2">
                    <span className="font-semibold text-black">{def.name}</span>: {content.behavioralDefinition}
                  </p>
                  <p className="text-sm text-black/60 leading-relaxed">
                    At {percentage}% capacity ({score.verbalLabel}), this dimension is{' '}
                    {percentage <= 40 ? 'operating reactively'
                      : percentage <= 60 ? 'being practiced — showing up, not yet reliable'
                      : percentage <= 80 ? 'consistent — a genuine strength'
                      : 'mastered — rare and visible to others'}.
                    {' '}In practice: {isLow
                      ? content.lowIndicator.split('.')[0] + '.'
                      : content.highIndicator.split('.')[0] + '.'}
                  </p>
                </div>

                {/* CREATIVE / REACTIVE */}
                <div className="mb-6">
                  <p className="text-xs font-semibold text-black/40 uppercase tracking-wider mb-3">Creative / Reactive</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-lg p-4" style={{ backgroundColor: 'rgba(166, 190, 164, 0.08)' }}>
                      <p className="text-xs font-semibold text-[#6B8E6B] uppercase tracking-wider mb-1.5">When this is working</p>
                      <p className="text-sm text-black/70 leading-relaxed">{content.highIndicator}</p>
                    </div>
                    <div className="rounded-lg p-4" style={{ backgroundColor: 'rgba(224, 143, 106, 0.08)' }}>
                      <p className="text-xs font-semibold text-[#C0714E] uppercase tracking-wider mb-1.5">When this isn&apos;t</p>
                      <p className="text-sm text-black/70 leading-relaxed">{content.lowIndicator}</p>
                    </div>
                  </div>
                </div>

                {/* WHY THIS MATTERS */}
                <div className="mb-6">
                  <p className="text-xs font-semibold text-black/40 uppercase tracking-wider mb-2">Why This Matters</p>
                  <p className="text-sm text-black/70 leading-relaxed mb-3">{content.costOfIgnoring}</p>
                  <div className="bg-[#F7F3ED] rounded-lg p-4">
                    <p className="text-xs font-semibold text-black/40 uppercase tracking-wider mb-1">The Question to Sit With</p>
                    <p className="text-sm font-medium text-black/80 italic leading-relaxed">{def.coreQuestion}</p>
                  </div>
                </div>

                {/* MOVE */}
                <div>
                  <p className="text-xs font-semibold text-black/40 uppercase tracking-wider mb-2">Move</p>
                  {frameworks.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs font-medium text-black/50 mb-2">Recommended frameworks:</p>
                      <div className="flex flex-wrap gap-2">
                        {frameworks.map((fw) => (
                          <span key={fw} className="inline-block px-3 py-1.5 text-xs font-medium text-black bg-[#F7F3ED] rounded-full">{fw}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="mt-3">
                    <p className="text-xs font-medium text-black/50 mb-2">Full framework library for {def.name}:</p>
                    <div className="flex flex-wrap gap-2">
                      {content.frameworks.map((fw) => (
                        <span key={fw} className="inline-block px-3 py-1.5 text-xs text-black/60 border border-black/10 rounded-full">{fw}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
