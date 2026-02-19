'use client'

import { memo, useEffect, useState } from 'react'
import { TERRITORY_COLORS } from '@/lib/constants'
import type { Territory } from '@/types/assessment'

interface TerritoryRadarProps {
  dimensions: { name: string; percentage: number }[]
  territory: Territory
}

const VB = 300
const RING_COUNT = 5
const LABEL_MARGIN = 50
const MAX_RADIUS = VB / 2 - LABEL_MARGIN

function polarToCartesian(cx: number, cy: number, radius: number, angleDeg: number) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180
  return {
    x: cx + radius * Math.cos(angleRad),
    y: cy + radius * Math.sin(angleRad),
  }
}

function buildPentagonPoints(cx: number, cy: number, radius: number): string {
  const step = 360 / 5
  return Array.from({ length: 5 }, (_, i) => {
    const { x, y } = polarToCartesian(cx, cy, radius, i * step)
    return `${x},${y}`
  }).join(' ')
}

export const TerritoryRadar = memo(function TerritoryRadar({ dimensions, territory }: TerritoryRadarProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50)
    return () => clearTimeout(timer)
  }, [])

  const cx = VB / 2
  const cy = VB / 2
  const step = 360 / 5
  const color = TERRITORY_COLORS[territory]

  // Score polygon points
  const scorePoints = dimensions.map((dim, i) => {
    const pct = Math.max(0, Math.min(100, dim.percentage))
    const r = mounted ? (pct / 100) * MAX_RADIUS : 0
    return polarToCartesian(cx, cy, r, i * step)
  })
  const scorePolygon = scorePoints.map((p) => `${p.x},${p.y}`).join(' ')
  const centerPolygon = dimensions.map(() => `${cx},${cy}`).join(' ')

  return (
    <svg
      viewBox={`0 0 ${VB} ${VB}`}
      className="w-full h-auto max-w-[260px] mx-auto overflow-visible"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Concentric pentagon grid rings */}
      {Array.from({ length: RING_COUNT }, (_, i) => {
        const r = ((i + 1) / RING_COUNT) * MAX_RADIUS
        return (
          <polygon
            key={i}
            points={buildPentagonPoints(cx, cy, r)}
            fill="none"
            stroke="rgba(0,0,0,0.06)"
            strokeWidth={1}
          />
        )
      })}

      {/* Axis lines */}
      {dimensions.map((_, i) => {
        const { x, y } = polarToCartesian(cx, cy, MAX_RADIUS, i * step)
        return (
          <line
            key={`axis-${i}`}
            x1={cx} y1={cy} x2={x} y2={y}
            stroke="rgba(0,0,0,0.08)"
            strokeWidth={1}
          />
        )
      })}

      {/* Score fill area */}
      <polygon
        points={mounted ? scorePolygon : centerPolygon}
        fill={color}
        fillOpacity={0.2}
        stroke={color}
        strokeWidth={2}
        strokeLinejoin="round"
        className="transition-all duration-700 ease-out"
      />

      {/* Data point dots */}
      {dimensions.map((dim, i) => {
        const pct = Math.max(0, Math.min(100, dim.percentage))
        const r = mounted ? (pct / 100) * MAX_RADIUS : 0
        const { x, y } = polarToCartesian(cx, cy, r, i * step)
        return (
          <circle
            key={`dot-${i}`}
            cx={mounted ? x : cx}
            cy={mounted ? y : cy}
            r={3}
            fill={color}
            className="transition-all duration-700 ease-out"
          />
        )
      })}

      {/* Dimension labels around perimeter */}
      {dimensions.map((dim, i) => {
        const angle = i * step
        const labelR = MAX_RADIUS + 16
        const { x, y } = polarToCartesian(cx, cy, labelR, angle)

        const normalizedAngle = ((angle - 90 + 360) % 360)
        let anchor: 'start' | 'middle' | 'end' = 'middle'
        if (normalizedAngle > 15 && normalizedAngle < 165) anchor = 'start'
        else if (normalizedAngle > 195 && normalizedAngle < 345) anchor = 'end'

        // Shorten long names
        const shortName = dim.name.length > 16 ? dim.name.split(' ').slice(0, 2).join(' ') : dim.name

        return (
          <text
            key={`label-${i}`}
            x={x} y={y}
            textAnchor={anchor}
            dominantBaseline="central"
            fill="rgba(0,0,0,0.5)"
            fontSize={10}
            fontWeight={500}
            fontFamily="Inter, sans-serif"
          >
            {shortName}
          </text>
        )
      })}
    </svg>
  )
})
