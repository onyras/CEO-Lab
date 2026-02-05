'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { SubDimensionScore } from '@/lib/scoring'

interface DimensionHeatmapProps {
  subdimensions: SubDimensionScore[]
  onCellClick?: (subdimension: SubDimensionScore) => void
}

const TERRITORY_CONFIG = {
  yourself: { label: 'Leading Yourself', color: '#7FABC8' },
  teams: { label: 'Leading Teams', color: '#A6BEA4' },
  organizations: { label: 'Leading Organizations', color: '#E08F6A' }
}

function getHeatmapColor(percentage: number): string {
  if (percentage >= 80) return '#4A90E2' // Blue - Mastery
  if (percentage >= 60) return '#7CB342' // Green - Proficient
  if (percentage >= 40) return '#FDD835' // Yellow - Developing
  return '#EF5350' // Red - Foundation
}

function getTextColor(percentage: number): string {
  return percentage >= 40 ? 'text-white' : 'text-gray-900'
}

export function DimensionHeatmap({ subdimensions, onCellClick }: DimensionHeatmapProps) {
  const [hoveredCell, setHoveredCell] = useState<string | null>(null)

  // Group subdimensions by territory
  const groupedByTerritory = subdimensions.reduce((acc, sd) => {
    if (!acc[sd.territory]) {
      acc[sd.territory] = []
    }
    acc[sd.territory].push(sd)
    return acc
  }, {} as Record<string, SubDimensionScore[]>)

  const territories: Array<'yourself' | 'teams' | 'organizations'> = ['yourself', 'teams', 'organizations']

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[768px]">
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">18 Leadership Dimensions</h3>
          <p className="text-gray-600">Hover over cells to see details. Click to drill down.</p>
        </div>

        {/* Heatmap Grid */}
        <div className="space-y-6">
          {territories.map((territory, territoryIndex) => {
            const config = TERRITORY_CONFIG[territory]
            const dimensions = groupedByTerritory[territory] || []

            return (
              <motion.div
                key={territory}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: territoryIndex * 0.1 }}
              >
                {/* Territory Header */}
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: config.color }}
                  />
                  <h4 className="text-lg font-semibold text-gray-900">{config.label}</h4>
                </div>

                {/* Dimension Cells */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                  {dimensions.map((dimension, index) => {
                    const isHovered = hoveredCell === dimension.subdimension
                    const bgColor = getHeatmapColor(dimension.percentage)

                    return (
                      <motion.button
                        key={dimension.subdimension}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: territoryIndex * 0.1 + index * 0.03 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onCellClick?.(dimension)}
                        onMouseEnter={() => setHoveredCell(dimension.subdimension)}
                        onMouseLeave={() => setHoveredCell(null)}
                        className={`
                          relative p-4 rounded-lg transition-all duration-200
                          ${isHovered ? 'ring-2 ring-gray-900 ring-offset-2 shadow-lg z-10' : 'shadow-sm'}
                          ${getTextColor(dimension.percentage)}
                        `}
                        style={{
                          backgroundColor: bgColor,
                          transform: isHovered ? 'scale(1.05)' : 'scale(1)'
                        }}
                      >
                        <div className="text-left">
                          <div className="text-xs font-medium mb-1 line-clamp-2">
                            {dimension.subdimension}
                          </div>
                          <div className="text-2xl font-bold">
                            {dimension.percentage}%
                          </div>
                        </div>

                        {/* Tooltip */}
                        {isHovered && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-gray-900 text-white text-xs rounded shadow-lg whitespace-nowrap z-20"
                          >
                            <div className="font-semibold">{dimension.subdimension}</div>
                            <div className="text-gray-300 mt-1">
                              Score: {dimension.score}/{dimension.maxScore} ({dimension.percentage}%)
                            </div>
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900" />
                          </motion.div>
                        )}
                      </motion.button>
                    )
                  })}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="mt-8 flex flex-wrap items-center gap-4 p-4 bg-gray-50 rounded-lg">
          <span className="text-sm font-medium text-gray-700">Score Range:</span>
          {[
            { label: 'Foundation', range: '0-40%', color: '#EF5350' },
            { label: 'Developing', range: '40-60%', color: '#FDD835' },
            { label: 'Proficient', range: '60-80%', color: '#7CB342' },
            { label: 'Mastery', range: '80-100%', color: '#4A90E2' }
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-gray-600">
                {item.label} ({item.range})
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
