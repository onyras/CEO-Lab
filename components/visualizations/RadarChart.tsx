'use client'

import { useEffect, useRef, useState } from 'react'
import type { Territory } from '@/types/assessment'

interface RadarChartProps {
  dimensions: {
    dimensionId: string
    name: string
    territory: Territory
    percentage: number
  }[]
  className?: string
}

const TERRITORY_COLORS: Record<Territory, string> = {
  leading_yourself: '#7FABC8',
  leading_teams: '#A6BEA4',
  leading_organizations: '#E08F6A',
}

const TERRITORY_LABELS: Record<Territory, string> = {
  leading_yourself: 'LEADING YOURSELF',
  leading_teams: 'LEADING TEAMS',
  leading_organizations: 'LEADING ORGS',
}

// Short display names to prevent label overlap
const SHORT_NAMES: Record<string, string> = {
  'Diagnosing the Real Problem': 'Diagnosis',
  'Team Operating System': 'Team OS',
  'Organizational Architecture': 'Org Architecture',
  'Hard Conversations': 'Hard Convos',
}

const RING_COUNT = 5
const AXIS_COUNT = 15

// Internal viewBox size — the SVG scales to fill its container
const VB = 700
const LABEL_MARGIN = 120
const MAX_RADIUS = VB / 2 - LABEL_MARGIN

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

export function RadarChart({ dimensions, className = '' }: RadarChartProps) {
  const [mounted, setMounted] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50)
    return () => clearTimeout(timer)
  }, [])

  const cx = VB / 2
  const cy = VB / 2
  const step = 360 / AXIS_COUNT

  // Score polygon
  const scorePoints = dimensions.map((dim, i) => {
    const pct = Math.max(0, Math.min(100, dim.percentage))
    const r = mounted ? (pct / 100) * MAX_RADIUS : 0
    return polarToCartesian(cx, cy, r, i * step)
  })
  const scorePolygon = scorePoints.map((p) => `${p.x},${p.y}`).join(' ')
  const centerPolygon = dimensions.map(() => `${cx},${cy}`).join(' ')

  const territories: Territory[] = ['leading_yourself', 'leading_teams', 'leading_organizations']

  // Territory wedge backgrounds
  const wedgePaths = territories.map((territory, tIdx) => {
    const startAngle = tIdx * 5 * step
    const endAngle = (tIdx * 5 + 5) * step
    const pts: string[] = [`${cx},${cy}`]
    for (let a = startAngle; a <= endAngle; a += step / 4) {
      const { x, y } = polarToCartesian(cx, cy, MAX_RADIUS, a)
      pts.push(`${x},${y}`)
    }
    const last = polarToCartesian(cx, cy, MAX_RADIUS, endAngle)
    pts.push(`${last.x},${last.y}`)
    return (
      <polygon
        key={territory}
        points={pts.join(' ')}
        fill={TERRITORY_COLORS[territory]}
        opacity={0.07}
      />
    )
  })

  // Territory boundary lines
  const boundaryLines = territories.map((_, tIdx) => {
    const angle = tIdx * 5 * step
    const { x, y } = polarToCartesian(cx, cy, MAX_RADIUS, angle)
    return (
      <line
        key={`boundary-${tIdx}`}
        x1={cx} y1={cy} x2={x} y2={y}
        stroke="rgba(0,0,0,0.08)"
        strokeWidth={1}
        strokeDasharray="6 4"
      />
    )
  })

  // Territory group labels inside the chart
  const territoryLabelElements = territories.map((territory, tIdx) => {
    const midAngle = (tIdx * 5 + 2) * step
    const labelR = MAX_RADIUS * 0.38
    const { x, y } = polarToCartesian(cx, cy, labelR, midAngle)
    return (
      <text
        key={territory}
        x={x} y={y}
        textAnchor="middle"
        dominantBaseline="central"
        fill={TERRITORY_COLORS[territory]}
        opacity={0.5}
        fontSize={13}
        fontWeight={700}
        fontFamily="Inter, sans-serif"
        letterSpacing="0.06em"
      >
        {TERRITORY_LABELS[territory]}
      </text>
    )
  })

  return (
    <div ref={containerRef} className={`w-full ${className}`}>
      <svg
        viewBox={`0 0 ${VB} ${VB}`}
        className="w-full h-auto overflow-visible"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Territory wedges */}
        {wedgePaths}
        {boundaryLines}

        {/* Concentric grid rings */}
        {Array.from({ length: RING_COUNT }, (_, i) => {
          const r = ((i + 1) / RING_COUNT) * MAX_RADIUS
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

        {/* Axis lines colored by territory */}
        {dimensions.map((dim, i) => {
          const { x, y } = polarToCartesian(cx, cy, MAX_RADIUS, i * step)
          return (
            <line
              key={dim.dimensionId}
              x1={cx} y1={cy} x2={x} y2={y}
              stroke={TERRITORY_COLORS[dim.territory]}
              strokeWidth={1}
              opacity={0.2}
            />
          )
        })}

        {/* Territory labels inside */}
        {territoryLabelElements}

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
          const r = mounted ? (pct / 100) * MAX_RADIUS : 0
          const { x, y } = polarToCartesian(cx, cy, r, i * step)
          return (
            <circle
              key={`dot-${dim.dimensionId}`}
              cx={mounted ? x : cx}
              cy={mounted ? y : cy}
              r={4}
              fill={TERRITORY_COLORS[dim.territory]}
              className="transition-all duration-700 ease-out"
            />
          )
        })}

        {/* Dimension labels around perimeter */}
        {dimensions.map((dim, i) => {
          const angle = i * step
          const labelR = MAX_RADIUS + 20
          const { x, y } = polarToCartesian(cx, cy, labelR, angle)
          const shortName = SHORT_NAMES[dim.name] ?? dim.name

          const normalizedAngle = ((angle - 90 + 360) % 360)
          let anchor: 'start' | 'middle' | 'end' = 'middle'
          if (normalizedAngle > 15 && normalizedAngle < 165) anchor = 'start'
          else if (normalizedAngle > 195 && normalizedAngle < 345) anchor = 'end'

          return (
            <text
              key={`label-${dim.dimensionId}`}
              x={x} y={y}
              textAnchor={anchor}
              dominantBaseline="central"
              fill={TERRITORY_COLORS[dim.territory]}
              fontSize={13}
              fontWeight={500}
              fontFamily="Inter, sans-serif"
            >
              {shortName}
            </text>
          )
        })}
      </svg>
    </div>
  )
}
