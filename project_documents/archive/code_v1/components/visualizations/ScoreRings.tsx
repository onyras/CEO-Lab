'use client'

import { motion } from 'framer-motion'
import { AnimatedScore } from '@/components/shared/AnimatedScore'

interface ScoreRing {
  label: string
  percentage: number
  color: string
  radius: number
  strokeWidth: number
}

interface ScoreRingsProps {
  overall: number
  territories: {
    yourself: number
    teams: number
    organizations: number
  }
}

const TERRITORY_COLORS = {
  yourself: '#7FABC8',
  teams: '#A6BEA4',
  organizations: '#E08F6A'
}

export function ScoreRings({ overall, territories }: ScoreRingsProps) {
  const rings: ScoreRing[] = [
    {
      label: 'Overall',
      percentage: overall,
      color: '#4A4A4A',
      radius: 140,
      strokeWidth: 24
    },
    {
      label: 'Leading Yourself',
      percentage: territories.yourself,
      color: TERRITORY_COLORS.yourself,
      radius: 110,
      strokeWidth: 20
    },
    {
      label: 'Leading Teams',
      percentage: territories.teams,
      color: TERRITORY_COLORS.teams,
      radius: 82,
      strokeWidth: 16
    },
    {
      label: 'Leading Organizations',
      percentage: territories.organizations,
      color: TERRITORY_COLORS.organizations,
      radius: 56,
      strokeWidth: 12
    }
  ]

  const centerX = 160
  const centerY = 160

  return (
    <div className="flex flex-col items-center gap-8">
      <svg width="320" height="320" viewBox="0 0 320 320" className="max-w-full">
        <defs>
          {rings.map((ring, index) => (
            <linearGradient
              key={`gradient-${index}`}
              id={`gradient-${index}`}
              gradientTransform="rotate(90)"
            >
              <stop offset="0%" stopColor={ring.color} stopOpacity="0.4" />
              <stop offset="100%" stopColor={ring.color} stopOpacity="1" />
            </linearGradient>
          ))}
        </defs>

        {rings.map((ring, index) => {
          const circumference = 2 * Math.PI * ring.radius
          const offset = circumference - (ring.percentage / 100) * circumference

          return (
            <g key={index}>
              {/* Background circle */}
              <circle
                cx={centerX}
                cy={centerY}
                r={ring.radius}
                fill="none"
                stroke="#E5E5E5"
                strokeWidth={ring.strokeWidth}
                strokeLinecap="round"
              />

              {/* Animated progress circle */}
              <motion.circle
                cx={centerX}
                cy={centerY}
                r={ring.radius}
                fill="none"
                stroke={`url(#gradient-${index})`}
                strokeWidth={ring.strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference}
                transform={`rotate(-90 ${centerX} ${centerY})`}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: offset }}
                transition={{
                  duration: 1.5,
                  delay: index * 0.15,
                  ease: [0.4, 0, 0.2, 1]
                }}
              />
            </g>
          )
        })}

        {/* Center score */}
        <text
          x={centerX}
          y={centerY - 10}
          textAnchor="middle"
          className="text-4xl font-bold fill-gray-900"
        >
          {overall}%
        </text>
        <text
          x={centerX}
          y={centerY + 15}
          textAnchor="middle"
          className="text-sm fill-gray-600"
        >
          Overall
        </text>
      </svg>

      {/* Legend */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl">
        {rings.slice(1).map((ring, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200"
          >
            <div
              className="w-4 h-4 rounded-full flex-shrink-0"
              style={{ backgroundColor: ring.color }}
            />
            <div className="flex-1 min-w-0">
              <div className="text-sm text-gray-600 truncate">{ring.label}</div>
              <div className="text-2xl font-bold text-gray-900">
                <AnimatedScore value={ring.percentage} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
