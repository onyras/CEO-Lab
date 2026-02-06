'use client'

const TERRITORY_CONFIG = {
  leading_yourself: { label: 'Leading Yourself', color: '#7FABC8' },
  leading_teams: { label: 'Leading Teams', color: '#A6BEA4' },
  leading_organizations: { label: 'Leading Organizations', color: '#E08F6A' },
} as const

interface TerritoryBarsProps {
  territories: {
    territory: 'leading_yourself' | 'leading_teams' | 'leading_organizations'
    score: number
    verbalLabel: string
  }[]
}

export function TerritoryBars({ territories }: TerritoryBarsProps) {
  return (
    <div className="w-full space-y-5 font-[Inter]">
      {territories.map((item) => {
        const config = TERRITORY_CONFIG[item.territory]
        const clampedScore = Math.max(0, Math.min(100, item.score))

        return (
          <div key={item.territory} className="flex items-center gap-4">
            {/* Territory label */}
            <div className="w-48 shrink-0 text-sm font-medium text-black">
              {config.label}
            </div>

            {/* Bar */}
            <div className="relative flex-1 h-7 rounded-full bg-[#F7F3ED] overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${clampedScore}%`,
                  backgroundColor: config.color,
                }}
              />
            </div>

            {/* Score + verbal label */}
            <div className="w-40 shrink-0 text-right">
              <span className="text-sm font-semibold text-black">
                {clampedScore}%
              </span>
              <span className="ml-2 text-xs text-black/60">
                {item.verbalLabel}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
