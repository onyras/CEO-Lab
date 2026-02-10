'use client'

import { useEffect, useState } from 'react'
import type { Territory } from '@/types/assessment'

interface LeadershipCircleProps {
  dimensions: {
    dimensionId: string
    name: string
    territory: Territory
    percentage: number
  }[]
  clmiScore?: number
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

const SHORT_NAMES: Record<string, string> = {
  'Diagnosing the Real Problem': 'Diagnosis',
  'Team Operating System': 'Team OS',
  'Organizational Architecture': 'Org Architecture',
  'Hard Conversations': 'Hard Convos',
}

const VB = 700
const CENTER = VB / 2
const INNER_RADIUS = 60
const MAX_RADIUS = 250
const LABEL_RADIUS = MAX_RADIUS + 35
const RING_COUNT = 5
const TOTAL_DIMS = 15
const GAP_DEG = 1.5 // gap between dimension wedges
const TERRITORY_GAP_DEG = 4 // gap between territories

function polarToXY(angleDeg: number, radius: number): [number, number] {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return [CENTER + radius * Math.cos(rad), CENTER + radius * Math.sin(rad)]
}

function arcPath(
  startAngle: number,
  endAngle: number,
  innerR: number,
  outerR: number,
): string {
  const [x1, y1] = polarToXY(startAngle, innerR)
  const [x2, y2] = polarToXY(endAngle, innerR)
  const [x3, y3] = polarToXY(endAngle, outerR)
  const [x4, y4] = polarToXY(startAngle, outerR)
  const large = endAngle - startAngle > 180 ? 1 : 0

  return [
    `M ${x1} ${y1}`,
    `A ${innerR} ${innerR} 0 ${large} 1 ${x2} ${y2}`,
    `L ${x3} ${y3}`,
    `A ${outerR} ${outerR} 0 ${large} 0 ${x4} ${y4}`,
    'Z',
  ].join(' ')
}

export function LeadershipCircle({ dimensions, clmiScore, className = '' }: LeadershipCircleProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50)
    return () => clearTimeout(timer)
  }, [])

  const territories: Territory[] = ['leading_yourself', 'leading_teams', 'leading_organizations']

  // Each territory gets 120° minus gaps
  const territorySpan = 360 / 3
  const dimSpanBase = (territorySpan - TERRITORY_GAP_DEG - (5 - 1) * GAP_DEG) / 5

  // Build dimension angles
  const dimAngles: { startAngle: number; endAngle: number; midAngle: number }[] = []
  let currentAngle = 0

  territories.forEach((_, tIdx) => {
    const tStart = tIdx * territorySpan + TERRITORY_GAP_DEG / 2
    for (let d = 0; d < 5; d++) {
      const start = tStart + d * (dimSpanBase + GAP_DEG)
      const end = start + dimSpanBase
      dimAngles.push({ startAngle: start, endAngle: end, midAngle: (start + end) / 2 })
    }
    currentAngle = tStart + 5 * (dimSpanBase + GAP_DEG)
  })

  return (
    <div className={`w-full ${className}`}>
      <svg
        viewBox={`0 0 ${VB} ${VB}`}
        className="w-full h-auto overflow-visible"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Concentric grid rings */}
        {Array.from({ length: RING_COUNT }, (_, i) => {
          const r = INNER_RADIUS + ((i + 1) / RING_COUNT) * (MAX_RADIUS - INNER_RADIUS)
          return (
            <circle
              key={`ring-${i}`}
              cx={CENTER}
              cy={CENTER}
              r={r}
              fill="none"
              stroke="rgba(0,0,0,0.06)"
              strokeWidth={1}
              strokeDasharray="4 3"
            />
          )
        })}

        {/* Inner circle */}
        <circle
          cx={CENTER}
          cy={CENTER}
          r={INNER_RADIUS}
          fill="none"
          stroke="rgba(0,0,0,0.08)"
          strokeWidth={1}
        />

        {/* Territory divider lines */}
        {territories.map((_, tIdx) => {
          const angle = tIdx * territorySpan
          const [x, y] = polarToXY(angle, MAX_RADIUS + 8)
          return (
            <line
              key={`div-${tIdx}`}
              x1={CENTER}
              y1={CENTER}
              x2={x}
              y2={y}
              stroke="rgba(0,0,0,0.06)"
              strokeWidth={1}
            />
          )
        })}

        {/* Territory background wedges */}
        {territories.map((territory, tIdx) => {
          const tStart = tIdx * territorySpan + 0.5
          const tEnd = (tIdx + 1) * territorySpan - 0.5
          return (
            <path
              key={`bg-${territory}`}
              d={arcPath(tStart, tEnd, INNER_RADIUS, MAX_RADIUS)}
              fill={TERRITORY_COLORS[territory]}
              opacity={0.04}
            />
          )
        })}

        {/* Dimension score bars */}
        {dimensions.map((dim, i) => {
          const { startAngle, endAngle } = dimAngles[i]
          const pct = Math.max(0, Math.min(100, dim.percentage))
          const scoreRadius = mounted
            ? INNER_RADIUS + (pct / 100) * (MAX_RADIUS - INNER_RADIUS)
            : INNER_RADIUS

          return (
            <path
              key={`bar-${dim.dimensionId}`}
              d={arcPath(startAngle, endAngle, INNER_RADIUS, scoreRadius)}
              fill={TERRITORY_COLORS[dim.territory]}
              opacity={0.55}
              className="transition-all duration-700 ease-out"
            />
          )
        })}

        {/* Dimension score bar outlines (full extent, subtle) */}
        {dimensions.map((dim, i) => {
          const { startAngle, endAngle } = dimAngles[i]
          return (
            <path
              key={`outline-${dim.dimensionId}`}
              d={arcPath(startAngle, endAngle, INNER_RADIUS, MAX_RADIUS)}
              fill="none"
              stroke="rgba(0,0,0,0.04)"
              strokeWidth={0.5}
            />
          )
        })}

        {/* Dimension labels */}
        {dimensions.map((dim, i) => {
          const { midAngle } = dimAngles[i]
          const [x, y] = polarToXY(midAngle, LABEL_RADIUS)
          const shortName = SHORT_NAMES[dim.name] ?? dim.name

          // Text rotation: keep labels readable
          const normalizedAngle = ((midAngle - 90 + 360) % 360)
          const isRightSide = normalizedAngle >= 0 && normalizedAngle <= 180
          const rotation = isRightSide ? midAngle - 90 : midAngle + 90

          return (
            <text
              key={`label-${dim.dimensionId}`}
              x={x}
              y={y}
              textAnchor={isRightSide ? 'start' : 'end'}
              dominantBaseline="central"
              fill="rgba(0,0,0,0.7)"
              fontSize={13}
              fontWeight={600}
              fontFamily="Inter, sans-serif"
              transform={`rotate(${rotation}, ${x}, ${y})`}
            >
              {shortName}
            </text>
          )
        })}

        {/* Dimension percentage labels (inside bar) */}
        {dimensions.map((dim, i) => {
          const { midAngle } = dimAngles[i]
          const pct = Math.max(0, Math.min(100, dim.percentage))
          const labelR = INNER_RADIUS + (Math.max(pct, 15) / 100) * (MAX_RADIUS - INNER_RADIUS) - 14
          const [x, y] = polarToXY(midAngle, mounted ? labelR : INNER_RADIUS)

          const normalizedAngle = ((midAngle - 90 + 360) % 360)
          const isRightSide = normalizedAngle >= 0 && normalizedAngle <= 180
          const rotation = isRightSide ? midAngle - 90 : midAngle + 90

          return (
            <text
              key={`pct-${dim.dimensionId}`}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="central"
              fill="rgba(0,0,0,0.5)"
              fontSize={11}
              fontWeight={700}
              fontFamily="Inter, sans-serif"
              transform={`rotate(${rotation}, ${x}, ${y})`}
              className="transition-all duration-700 ease-out"
            >
              {Math.round(pct)}%
            </text>
          )
        })}

        {/* Territory labels (outer arc) */}
        {territories.map((territory, tIdx) => {
          const midAngle = tIdx * territorySpan + territorySpan / 2
          const [x, y] = polarToXY(midAngle, MAX_RADIUS + 72)

          return (
            <text
              key={`terrLabel-${territory}`}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="central"
              fill={TERRITORY_COLORS[territory]}
              fontSize={13}
              fontWeight={700}
              fontFamily="Inter, sans-serif"
              letterSpacing="0.1em"
            >
              {TERRITORY_LABELS[territory]}
            </text>
          )
        })}

        {/* Center: CLMI score or label */}
        <circle
          cx={CENTER}
          cy={CENTER}
          r={INNER_RADIUS - 4}
          fill="white"
        />
        <circle
          cx={CENTER}
          cy={CENTER}
          r={INNER_RADIUS - 4}
          fill="rgba(0,0,0,0.03)"
        />
        {clmiScore !== undefined ? (
          <>
            <text
              x={CENTER}
              y={CENTER - 8}
              textAnchor="middle"
              dominantBaseline="central"
              fill="rgba(0,0,0,0.85)"
              fontSize={26}
              fontWeight={700}
              fontFamily="Inter, sans-serif"
            >
              {Math.round(clmiScore)}%
            </text>
            <text
              x={CENTER}
              y={CENTER + 12}
              textAnchor="middle"
              dominantBaseline="central"
              fill="rgba(0,0,0,0.4)"
              fontSize={10}
              fontWeight={600}
              fontFamily="Inter, sans-serif"
              letterSpacing="0.1em"
            >
              CLMI
            </text>
          </>
        ) : (
          <text
            x={CENTER}
            y={CENTER}
            textAnchor="middle"
            dominantBaseline="central"
            fill="rgba(0,0,0,0.3)"
            fontSize={10}
            fontWeight={600}
            fontFamily="Inter, sans-serif"
            letterSpacing="0.08em"
          >
            PROFILE
          </text>
        )}
      </svg>
    </div>
  )
}
