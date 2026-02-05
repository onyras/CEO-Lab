'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { SubDimensionScore } from '@/lib/scoring'

interface RadarChartProps {
  subdimensions: SubDimensionScore[]
  showPeerMedian?: boolean
  peerMedianData?: number[] // Optional peer comparison data
}

const TERRITORY_COLORS = {
  yourself: '#7FABC8',
  teams: '#A6BEA4',
  organizations: '#E08F6A'
}

export function RadarChart({ subdimensions, showPeerMedian = false, peerMedianData }: RadarChartProps) {
  const [showOverlay, setShowOverlay] = useState(showPeerMedian)

  const size = 600
  const center = size / 2
  const maxRadius = size / 2 - 80
  const levels = 5 // 0%, 25%, 50%, 75%, 100%

  // Sort subdimensions to ensure consistent ordering
  const sortedDimensions = [...subdimensions].sort((a, b) => {
    const territoryOrder = { yourself: 0, teams: 1, organizations: 2 }
    if (territoryOrder[a.territory] !== territoryOrder[b.territory]) {
      return territoryOrder[a.territory] - territoryOrder[b.territory]
    }
    return a.subdimension.localeCompare(b.subdimension)
  })

  const numPoints = sortedDimensions.length
  const angleStep = (2 * Math.PI) / numPoints

  // Calculate points for the radar chart
  const getPoint = (index: number, percentage: number): { x: number; y: number } => {
    const angle = angleStep * index - Math.PI / 2 // Start from top
    const radius = (percentage / 100) * maxRadius
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle)
    }
  }

  // Create path string for the filled area
  const createPath = (percentages: number[]): string => {
    const points = percentages.map((p, i) => getPoint(i, p))
    return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ') + ' Z'
  }

  const userPath = createPath(sortedDimensions.map(d => d.percentage))
  const peerPath = peerMedianData ? createPath(peerMedianData) : null

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center justify-between w-full max-w-2xl">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Leadership Signature</h3>
          <p className="text-gray-600">Your unique leadership profile across 18 dimensions</p>
        </div>

        {peerMedianData && (
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showOverlay}
              onChange={(e) => setShowOverlay(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Show Peer Median</span>
          </label>
        )}
      </div>

      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="w-full max-w-2xl"
        style={{ maxHeight: '600px' }}
      >
        <defs>
          <filter id="shadow">
            <feDropShadow dx="0" dy="2" stdDeviation="4" floodOpacity="0.1" />
          </filter>
        </defs>

        {/* Background concentric circles */}
        {Array.from({ length: levels }).map((_, i) => {
          const radius = (maxRadius / (levels - 1)) * i
          return (
            <circle
              key={i}
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="#E5E5E5"
              strokeWidth="1"
            />
          )
        })}

        {/* Axis lines */}
        {sortedDimensions.map((_, index) => {
          const endPoint = getPoint(index, 100)
          return (
            <line
              key={index}
              x1={center}
              y1={center}
              x2={endPoint.x}
              y2={endPoint.y}
              stroke="#E5E5E5"
              strokeWidth="1"
            />
          )
        })}

        {/* Peer median overlay (if enabled) */}
        {showOverlay && peerPath && (
          <motion.path
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ duration: 0.3 }}
            d={peerPath}
            fill="#9CA3AF"
            stroke="#6B7280"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        )}

        {/* User data polygon */}
        <motion.path
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.4, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          d={userPath}
          fill="#7FABC8"
          filter="url(#shadow)"
        />

        <motion.path
          initial={{ opacity: 0, pathLength: 0 }}
          animate={{ opacity: 1, pathLength: 1 }}
          transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
          d={userPath}
          fill="none"
          stroke="#4A90E2"
          strokeWidth="3"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {sortedDimensions.map((dimension, index) => {
          const point = getPoint(index, dimension.percentage)
          return (
            <motion.g
              key={index}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.02, duration: 0.3 }}
            >
              <circle
                cx={point.x}
                cy={point.y}
                r="5"
                fill="white"
                stroke="#4A90E2"
                strokeWidth="2"
              />
            </motion.g>
          )
        })}

        {/* Labels */}
        {sortedDimensions.map((dimension, index) => {
          const labelPoint = getPoint(index, 115) // Position outside the chart
          const angle = angleStep * index - Math.PI / 2

          // Adjust text anchor based on position
          let textAnchor: 'start' | 'middle' | 'end' = 'middle'
          if (Math.cos(angle) > 0.5) textAnchor = 'start'
          if (Math.cos(angle) < -0.5) textAnchor = 'end'

          return (
            <motion.g
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 + index * 0.02 }}
            >
              <text
                x={labelPoint.x}
                y={labelPoint.y}
                textAnchor={textAnchor}
                className="text-xs fill-gray-700"
                style={{
                  fontSize: '11px',
                  fontWeight: 500
                }}
              >
                {dimension.subdimension}
              </text>
              <text
                x={labelPoint.x}
                y={labelPoint.y + 12}
                textAnchor={textAnchor}
                className="text-xs fill-gray-500"
                style={{ fontSize: '10px' }}
              >
                {dimension.percentage}%
              </text>
            </motion.g>
          )
        })}
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#7FABC8' }} />
          <span className="text-sm text-gray-700">Your Leadership Signature</span>
        </div>
        {showOverlay && peerMedianData && (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gray-400" />
            <span className="text-sm text-gray-700">Peer Median</span>
          </div>
        )}

        {/* Territory breakdown */}
        <div className="flex items-center gap-4 ml-auto">
          {Object.entries(TERRITORY_COLORS).map(([territory, color]) => (
            <div key={territory} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-xs text-gray-600 capitalize">{territory}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
