'use client'

import { motion } from 'framer-motion'
import { SubDimensionScore } from '@/lib/scoring'

interface LeadershipDebtProps {
  subdimensions: SubDimensionScore[]
}

export function LeadershipDebt({ subdimensions }: LeadershipDebtProps) {
  // Find highest and lowest scoring subdimensions
  const sorted = [...subdimensions].sort((a, b) => b.percentage - a.percentage)
  const highest = sorted[0]
  const lowest = sorted[sorted.length - 1]
  const gap = highest.percentage - lowest.percentage

  const getDebtLevel = (gap: number): { label: string; color: string; severity: string } => {
    if (gap < 20) return { label: 'Low', color: 'green', severity: 'Balanced profile' }
    if (gap < 40) return { label: 'Moderate', color: 'yellow', severity: 'Some areas need attention' }
    return { label: 'High', color: 'red', severity: 'Significant imbalances' }
  }

  const debtLevel = getDebtLevel(gap)

  const colorClasses = {
    green: 'bg-green-100 text-green-700 border-green-200',
    yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    red: 'bg-red-100 text-red-700 border-red-200'
  }

  return (
    <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
      <h3 className="text-xl font-bold text-gray-900 mb-2">Leadership Debt</h3>
      <p className="text-sm text-gray-600 mb-6">
        The gap between your strongest and weakest leadership dimensions
      </p>

      {/* Debt Level Indicator */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-4xl font-bold text-gray-900">{gap}%</div>
          <div className="text-sm text-gray-600">Gap between high and low</div>
        </div>
        <div className={`px-4 py-2 rounded-lg border ${colorClasses[debtLevel.color as keyof typeof colorClasses]}`}>
          <div className="text-lg font-bold">{debtLevel.label} Debt</div>
          <div className="text-xs">{debtLevel.severity}</div>
        </div>
      </div>

      {/* Visual comparison */}
      <div className="space-y-4">
        {/* Strongest dimension */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Strongest</span>
            <span className="text-sm font-bold text-green-600">{highest.percentage}%</span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-green-500"
              initial={{ width: 0 }}
              animate={{ width: `${highest.percentage}%` }}
              transition={{ duration: 1, delay: 0.2 }}
            />
          </div>
          <div className="mt-1 text-xs text-gray-600">{highest.subdimension}</div>
        </div>

        {/* Weakest dimension */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Weakest</span>
            <span className="text-sm font-bold text-red-600">{lowest.percentage}%</span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-red-500"
              initial={{ width: 0 }}
              animate={{ width: `${lowest.percentage}%` }}
              transition={{ duration: 1, delay: 0.4 }}
            />
          </div>
          <div className="mt-1 text-xs text-gray-600">{lowest.subdimension}</div>
        </div>
      </div>

      {/* Interpretation */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-700">
          {gap < 20 && (
            <>Your leadership profile is well-balanced across dimensions. Continue maintaining this equilibrium while pushing all areas higher.</>
          )}
          {gap >= 20 && gap < 40 && (
            <>You have notable strengths but some underdeveloped areas. Focus on bringing up your weakest dimensions to reduce vulnerability.</>
          )}
          {gap >= 40 && (
            <>Significant imbalances detected. Your weakest areas may be creating bottlenecks. Prioritize closing the gap to build comprehensive leadership capability.</>
          )}
        </p>
      </div>
    </div>
  )
}
