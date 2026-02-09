'use client'

const TERRITORY_CONFIG = {
  leading_yourself: { label: 'Leading Yourself', accent: '#7FABC8' },
  leading_teams: { label: 'Leading Teams', accent: '#A6BEA4' },
  leading_organizations: { label: 'Leading Organizations', accent: '#E08F6A' },
} as const

type Territory = keyof typeof TERRITORY_CONFIG

function getOpacity(percentage: number): number {
  // Map 0-100% to 0.2-1.0 opacity for territory accent color
  return 0.2 + (Math.max(0, Math.min(100, percentage)) / 100) * 0.8
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
              const clamped = Math.max(0, Math.min(100, dim.percentage))
              const opacity = getOpacity(dim.percentage)

              return (
                <div
                  key={dim.dimensionId}
                  className="flex items-center gap-3"
                >
                  {/* Dimension name */}
                  <div className="w-44 shrink-0 text-xs font-medium text-black/80 truncate">
                    {dim.name}
                  </div>

                  {/* Heat bar — territory accent color at varying opacity */}
                  <div className="relative flex-1 h-6 rounded bg-[#F7F3ED] overflow-hidden">
                    <div
                      className="h-full rounded transition-all duration-500 ease-out"
                      style={{
                        width: `${clamped}%`,
                        backgroundColor: group.config.accent,
                        opacity,
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

      {/* Legend — simplified with territory colors */}
      <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-black/10">
        <span className="text-[10px] text-black/40">Opacity indicates score level:</span>
        {[
          { range: '0-20%', label: 'Critical gap' },
          { range: '21-40%', label: 'Early development' },
          { range: '41-60%', label: 'Building' },
          { range: '61-80%', label: 'Strong' },
          { range: '81-100%', label: 'Mastery' },
        ].map((item) => (
          <span key={item.range} className="text-[10px] text-black/50">
            {item.range} {item.label}
          </span>
        ))}
      </div>
    </div>
  )
}
