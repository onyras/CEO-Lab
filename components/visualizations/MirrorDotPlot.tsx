'use client'

const SEVERITY_COLORS = {
  aligned: '#D1D5DB',
  mild: '#FFB74D',
  significant: '#E08F6A',
  critical: '#E57373',
} as const

interface MirrorDotPlotProps {
  gaps: {
    dimensionId: string
    dimensionName: string
    ceoPct: number
    raterPct: number
    gapLabel: string
    severity: 'aligned' | 'mild' | 'significant' | 'critical'
  }[]
  bsi?: number
  bsiLabel?: string
}

export function MirrorDotPlot({ gaps, bsi, bsiLabel }: MirrorDotPlotProps) {
  const plotWidth = 400
  const plotPadding = 16

  function pctToX(pct: number): number {
    const clamped = Math.max(0, Math.min(100, pct))
    return plotPadding + (clamped / 100) * (plotWidth - plotPadding * 2)
  }

  return (
    <div className="w-full font-[Inter]">
      {/* BSI summary */}
      {bsi !== undefined && (
        <div className="flex items-center gap-3 mb-5 p-3 rounded-lg bg-[#F7F3ED]">
          <span className="text-sm font-semibold text-black">
            Blind Spot Index: {bsi}
          </span>
          {bsiLabel && (
            <span className="text-xs text-black/60">{bsiLabel}</span>
          )}
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-5 mb-4">
        <div className="flex items-center gap-1.5">
          <svg width="10" height="10">
            <circle cx="5" cy="5" r="5" fill="#000000" />
          </svg>
          <span className="text-xs text-black/70">You</span>
        </div>
        <div className="flex items-center gap-1.5">
          <svg width="10" height="10">
            <circle cx="5" cy="5" r="5" fill="#9CA3AF" />
          </svg>
          <span className="text-xs text-black/70">Rater</span>
        </div>
      </div>

      {/* Scale header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-44 shrink-0" />
        <div className="flex-1">
          <div className="flex justify-between px-4">
            <span className="text-[10px] text-black/40">0</span>
            <span className="text-[10px] text-black/40">25</span>
            <span className="text-[10px] text-black/40">50</span>
            <span className="text-[10px] text-black/40">75</span>
            <span className="text-[10px] text-black/40">100</span>
          </div>
        </div>
        <div className="w-28 shrink-0" />
      </div>

      {/* Dimension rows */}
      <div className="space-y-1.5">
        {gaps.map((gap) => {
          const ceoX = pctToX(gap.ceoPct)
          const raterX = pctToX(gap.raterPct)
          const lineColor = SEVERITY_COLORS[gap.severity]
          const minX = Math.min(ceoX, raterX)
          const maxX = Math.max(ceoX, raterX)

          return (
            <div
              key={gap.dimensionId}
              className="flex items-center gap-3"
            >
              {/* Dimension name */}
              <div className="w-44 shrink-0 text-xs font-medium text-black/80 truncate">
                {gap.dimensionName}
              </div>

              {/* Dot plot */}
              <div className="flex-1">
                <svg
                  viewBox={`0 0 ${plotWidth} 24`}
                  className="w-full h-6"
                  preserveAspectRatio="none"
                >
                  {/* Background line */}
                  <line
                    x1={plotPadding}
                    y1={12}
                    x2={plotWidth - plotPadding}
                    y2={12}
                    stroke="#E5E7EB"
                    strokeWidth="1"
                  />

                  {/* Gap connector line */}
                  {Math.abs(gap.ceoPct - gap.raterPct) > 0 && (
                    <line
                      x1={minX}
                      y1={12}
                      x2={maxX}
                      y2={12}
                      stroke={lineColor}
                      strokeWidth="3"
                      strokeLinecap="round"
                      opacity="0.7"
                    />
                  )}

                  {/* Rater dot (gray, behind) */}
                  <circle
                    cx={raterX}
                    cy={12}
                    r="5"
                    fill="#9CA3AF"
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                  />

                  {/* CEO dot (black, on top) */}
                  <circle
                    cx={ceoX}
                    cy={12}
                    r="5"
                    fill="#000000"
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>

              {/* Gap label */}
              <div className="w-28 shrink-0 text-right">
                <span
                  className="text-[10px] font-medium uppercase tracking-wide"
                  style={{ color: lineColor }}
                >
                  {gap.gapLabel}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
