'use client'

import { useEffect, useState } from 'react'
import type { Territory } from '@/types/assessment'

interface RadarChartProps {
  dimensions: {
    dimensionId: string
    name: string
    territory: Territory
    percentage: number
  }[]
  size?: number
  className?: string
}

const TERRITORY_COLORS: Record<Territory, string> = {
  leading_yourself: '#7FABC8',
  leading_teams: '#A6BEA4',
  leading_organizations: '#E08F6A',
}

const TERRITORY_LABELS: Record<Territory, string> = {
  leading_yourself: 'Leading Yourself',
  leading_teams: 'Leading Teams',
  leading_organizations: 'Leading Orgs',
}

const RING_COUNT = 5
const AXIS_COUNT = 15

function polarToCartesian(cx: number, cy: number, radius: number, angleDeg: number) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180
  return {
    x: cx + radius * Math.cos(angleRad),
    y: cy + radius * Math.sin(angleRad),
  }
}

function buildPolygonPoints(cx: number, cy: number, radius: number, count: number): string {
  const step = 360 / count
  return Array.from({ length: count }, (_, i) => {
    const { x, y } = polarToCartesian(cx, cy, radius, i * step)
    return `${x},${y}`
  }).join(' ')
}

export function RadarChart({ dimensions, size = 400, className = '' }: RadarChartProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50)
    return () => clearTimeout(timer)
  }, [])

  const labelPadding = 80
  const maxRadius = size / 2 - labelPadding
  const cx = size / 2
  const cy = size / 2
  const step = 360 / AXIS_COUNT

  // Build score polygon points
  const scorePoints = dimensions.map((dim, i) => {
    const pct = Math.max(0, Math.min(100, dim.percentage))
    const r = mounted ? (pct / 100) * maxRadius : 0
    return polarToCartesian(cx, cy, r, i * step)
  })

  const scorePolygon = scorePoints.map((p) => `${p.x},${p.y}`).join(' ')

  // Center polygon (for animation start)
  const centerPolygon = dimensions.map(() => `${cx},${cy}`).join(' ')

  // Territory wedge paths (subtle background)
  const territories: Territory[] = ['leading_yourself', 'leading_teams', 'leading_organizations']
  const wedgePaths = territories.map((territory, tIdx) => {
    const startIdx = tIdx * 5
    const endIdx = startIdx + 4
    const startAngle = startIdx * step
    const endAngle = (endIdx + 1) * step

    // Build wedge as a filled polygon from center through the arc
    const wedgePoints: string[] = [`${cx},${cy}`]
    for (let angle = startAngle; angle <= endAngle; angle += step / 2) {
      const { x, y } = polarToCartesian(cx, cy, maxRadius + 4, angle)
      wedgePoints.push(`${x},${y}`)
    }
    // Ensure we hit the exact end angle
    const last = polarToCartesian(cx, cy, maxRadius + 4, endAngle)
    wedgePoints.push(`${last.x},${last.y}`)

    return (
      <polygon
        key={territory}
        points={wedgePoints.join(' ')}
        fill={TERRITORY_COLORS[territory]}
        opacity={0.04}
      />
    )
  })

  // Territory group labels at midpoint of each 5-axis segment
  const territoryLabels = territories.map((territory, tIdx) => {
    const midIdx = tIdx * 5 + 2
    const angle = midIdx * step
    const labelR = maxRadius + 56
    const { x, y } = polarToCartesian(cx, cy, labelR, angle)

    return (
      <text
        key={territory}
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="central"
        fill={TERRITORY_COLORS[territory]}
        fontSize={11}
        fontWeight={600}
        fontFamily="Inter, sans-serif"
      >
        {TERRITORY_LABELS[territory]}
      </text>
    )
  })

  return (
    <div className={`inline-flex justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="overflow-visible"
      >
        {/* Territory background wedges */}
        {wedgePaths}

        {/* Concentric grid rings (15-sided polygons) */}
        {Array.from({ length: RING_COUNT }, (_, i) => {
          const r = ((i + 1) / RING_COUNT) * maxRadius
          return (
            <polygon
              key={i}
              points={buildPolygonPoints(cx, cy, r, AXIS_COUNT)}
              fill="none"
              stroke="rgba(0,0,0,0.06)"
              strokeWidth={1}
            />
          )
        })}

        {/* Axis lines from center to each vertex */}
        {dimensions.map((dim, i) => {
          const { x, y } = polarToCartesian(cx, cy, maxRadius, i * step)
          return (
            <line
              key={dim.dimensionId}
              x1={cx}
              y1={cy}
              x2={x}
              y2={y}
              stroke="rgba(0,0,0,0.08)"
              strokeWidth={1}
            />
          )
        })}

        {/* Score polygon */}
        <polygon
          points={mounted ? scorePolygon : centerPolygon}
          fill="rgba(0,0,0,0.06)"
          stroke="rgba(0,0,0,0.5)"
          strokeWidth={2}
          strokeLinejoin="round"
          className="transition-all duration-700 ease-out"
        />

        {/* Data point dots */}
        {dimensions.map((dim, i) => {
          const pct = Math.max(0, Math.min(100, dim.percentage))
          const r = mounted ? (pct / 100) * maxRadius : 0
          const { x, y } = polarToCartesian(cx, cy, r, i * step)
          return (
            <circle
              key={`dot-${dim.dimensionId}`}
              cx={mounted ? x : cx}
              cy={mounted ? y : cy}
              r={3}
              fill={TERRITORY_COLORS[dim.territory]}
              className="transition-all duration-700 ease-out"
            />
          )
        })}

        {/* Dimension labels around perimeter */}
        {dimensions.map((dim, i) => {
          const angle = i * step
          const labelR = maxRadius + 18
          const { x, y } = polarToCartesian(cx, cy, labelR, angle)

          // Determine text anchor based on position
          const normalizedAngle = ((angle - 90 + 360) % 360)
          let anchor: 'start' | 'middle' | 'end' = 'middle'
          if (normalizedAngle > 20 && normalizedAngle < 160) anchor = 'start'
          else if (normalizedAngle > 200 && normalizedAngle < 340) anchor = 'end'

          return (
            <text
              key={`label-${dim.dimensionId}`}
              x={x}
              y={y}
              textAnchor={anchor}
              dominantBaseline="central"
              fill="rgba(0,0,0,0.5)"
              fontSize={10}
              fontFamily="Inter, sans-serif"
            >
              {dim.name}
            </text>
          )
        })}

        {/* Territory group labels */}
        {territoryLabels}
      </svg>
    </div>
  )
}
