'use client'

import { getDimension, TERRITORY_COLORS, TERRITORY_CONFIG } from '@/lib/constants'
import type { DimensionId, Territory } from '@/types/assessment'

interface FocusDimensionCardsProps {
  focusDimensions: DimensionId[]
  latestWeeklyScores: Record<string, number>
}

export function FocusDimensionCards({ focusDimensions, latestWeeklyScores }: FocusDimensionCardsProps) {
  if (focusDimensions.length === 0) return null

  return (
    <div className="mb-16">
      <div className="pb-5 border-b border-black/10 mb-8">
        <p className="font-mono text-xs uppercase tracking-[0.12em] text-black/40 mb-2">Focus Areas</p>
        <h2 className="text-2xl font-semibold tracking-tight">Your 3 Dimensions</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {focusDimensions.map((dimId) => {
          const dim = getDimension(dimId)
          const color = TERRITORY_COLORS[dim.territory]
          const latestScore = latestWeeklyScores[dimId]
          const hasScore = latestScore !== undefined

          return (
            <a
              key={dimId}
              href="/assessment/weekly"
              className="bg-white border border-black/10 rounded-lg p-6 hover:border-black/20 transition-colors group"
            >
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: color }}
                />
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-black/40">
                  {TERRITORY_CONFIG[dim.territory].displayLabel.replace('Leading ', '')}
                </span>
              </div>

              <h3 className="text-base font-semibold text-black mb-2">{dim.name}</h3>

              {hasScore ? (
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-black/5 rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.max(4, latestScore)}%`,
                        backgroundColor: color,
                      }}
                    />
                  </div>
                  <span className="text-sm font-mono font-bold text-black">{Math.round(latestScore)}%</span>
                </div>
              ) : (
                <p className="text-xs text-black/30">No check-in data yet</p>
              )}

              <p className="text-xs text-black/30 mt-3 group-hover:text-black/50 transition-colors">
                Check in →
              </p>
            </a>
          )
        })}
      </div>
    </div>
  )
}
