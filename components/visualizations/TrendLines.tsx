'use client'

const TREND_CONFIG = {
  improving: { color: '#81C784', label: 'Improving' },
  stable: { color: '#9CA3AF', label: 'Stable' },
  declining: { color: '#E57373', label: 'Declining' },
  insufficient_data: { color: '#D1D5DB', label: 'Insufficient data' },
} as const

interface TrendLinesProps {
  dimensions: {
    dimensionId: string
    dimensionName: string
    scores: number[]
    trend: 'improving' | 'stable' | 'declining' | 'insufficient_data'
  }[]
}

function Sparkline({
  scores,
  color,
  width = 160,
  height = 28,
}: {
  scores: number[]
  color: string
  width?: number
  height?: number
}) {
  if (scores.length < 2) {
    return (
      <svg width={width} height={height} className="block">
        <line
          x1={4}
          y1={height / 2}
          x2={width - 4}
          y2={height / 2}
          stroke={color}
          strokeWidth="1.5"
          strokeDasharray="4 3"
          opacity="0.4"
        />
      </svg>
    )
  }

  const padding = 4
  const innerW = width - padding * 2
  const innerH = height - padding * 2

  const minVal = Math.min(...scores)
  const maxVal = Math.max(...scores)
  const range = maxVal - minVal || 1

  const points = scores.map((score, i) => {
    const x = padding + (i / (scores.length - 1)) * innerW
    const y = padding + innerH - ((score - minVal) / range) * innerH
    return `${x},${y}`
  })

  const polyline = points.join(' ')

  // Area fill path
  const firstX = padding
  const lastX = padding + innerW
  const areaPath = `M${firstX},${height - padding} L${points
    .map((p) => p)
    .join(' L')} L${lastX},${height - padding} Z`

  return (
    <svg width={width} height={height} className="block">
      {/* Area fill */}
      <path d={areaPath} fill={color} opacity="0.08" />
      {/* Line */}
      <polyline
        points={polyline}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* End dot */}
      {scores.length > 0 && (
        <circle
          cx={padding + ((scores.length - 1) / (scores.length - 1)) * innerW}
          cy={
            padding +
            innerH -
            ((scores[scores.length - 1] - minVal) / range) * innerH
          }
          r="2.5"
          fill={color}
        />
      )}
    </svg>
  )
}

export function TrendLines({ dimensions }: TrendLinesProps) {
  return (
    <div className="w-full space-y-2 font-[Inter]">
      {dimensions.map((dim) => {
        const config = TREND_CONFIG[dim.trend]

        return (
          <div
            key={dim.dimensionId}
            className="flex items-center gap-3"
          >
            {/* Dimension name */}
            <div className="w-44 shrink-0 text-xs font-medium text-black/80 truncate">
              {dim.dimensionName}
            </div>

            {/* Sparkline */}
            <div className="flex-1 flex items-center">
              <Sparkline scores={dim.scores} color={config.color} />
            </div>

            {/* Trend label */}
            <div className="w-32 shrink-0 text-right">
              <span
                className="text-[10px] font-medium uppercase tracking-wide"
                style={{ color: config.color }}
              >
                {config.label}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
