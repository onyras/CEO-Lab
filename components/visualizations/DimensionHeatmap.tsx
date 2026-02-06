'use client'

const TERRITORY_CONFIG = {
  leading_yourself: { label: 'Leading Yourself', accent: '#7FABC8' },
  leading_teams: { label: 'Leading Teams', accent: '#A6BEA4' },
  leading_organizations: { label: 'Leading Organizations', accent: '#E08F6A' },
} as const

type Territory = keyof typeof TERRITORY_CONFIG

function getHeatColor(percentage: number): { bg: string; label: string } {
  if (percentage <= 20) return { bg: '#E57373', label: 'Critical gap' }
  if (percentage <= 40) return { bg: '#FFB74D', label: 'Early development' }
  if (percentage <= 60) return { bg: '#AED581', label: 'Building' }
  if (percentage <= 80) return { bg: '#81C784', label: 'Strong' }
  return { bg: '#7FABC8', label: 'Mastery' }
}

interface DimensionHeatmapProps {
  dimensions: {
    dimensionId: string
    name: string
    territory: Territory
    percentage: number
    verbalLabel: string
  }[]
}

export function DimensionHeatmap({ dimensions }: DimensionHeatmapProps) {
  const territories: Territory[] = [
    'leading_yourself',
    'leading_teams',
    'leading_organizations',
  ]

  const grouped = territories.map((t) => ({
    territory: t,
    config: TERRITORY_CONFIG[t],
    items: dimensions.filter((d) => d.territory === t),
  }))

  return (
    <div className="w-full space-y-6 font-[Inter]">
      {grouped.map((group) => (
        <div key={group.territory}>
          {/* Territory group header */}
          <div className="flex items-center gap-2 mb-3">
            <div
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: group.config.accent }}
            />
            <h3 className="text-sm font-semibold text-black">
              {group.config.label}
            </h3>
          </div>

          {/* Dimension rows */}
          <div className="space-y-2">
            {group.items.map((dim) => {
              const heat = getHeatColor(dim.percentage)
              const clamped = Math.max(0, Math.min(100, dim.percentage))

              return (
                <div
                  key={dim.dimensionId}
                  className="flex items-center gap-3"
                >
                  {/* Dimension name */}
                  <div className="w-44 shrink-0 text-xs font-medium text-black/80 truncate">
                    {dim.name}
                  </div>

                  {/* Heat bar */}
                  <div className="relative flex-1 h-6 rounded bg-[#F7F3ED] overflow-hidden">
                    <div
                      className="h-full rounded transition-all duration-500 ease-out"
                      style={{
                        width: `${clamped}%`,
                        backgroundColor: heat.bg,
                      }}
                    />
                  </div>

                  {/* Percentage + verbal label */}
                  <div className="w-44 shrink-0 flex items-center justify-end gap-2">
                    <span className="text-xs font-semibold text-black">
                      {clamped}%
                    </span>
                    <span className="text-[10px] text-black/50 uppercase tracking-wide">
                      {dim.verbalLabel}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-black/10">
        {[
          { range: '0-20%', color: '#E57373', label: 'Critical gap' },
          { range: '21-40%', color: '#FFB74D', label: 'Early development' },
          { range: '41-60%', color: '#AED581', label: 'Building' },
          { range: '61-80%', color: '#81C784', label: 'Strong' },
          { range: '81-100%', color: '#7FABC8', label: 'Mastery' },
        ].map((item) => (
          <div key={item.range} className="flex items-center gap-1.5">
            <div
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-[10px] text-black/60">
              {item.range} {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
