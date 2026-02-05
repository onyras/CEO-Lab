'use client'

import { motion } from 'framer-motion'
import { AnimatedScore } from '@/components/shared/AnimatedScore'

interface DecisionFrictionIndexProps {
  yourScore: number
  healthyBenchmark?: number
}

export function DecisionFrictionIndex({ yourScore, healthyBenchmark = 75 }: DecisionFrictionIndexProps) {
  const isHealthy = yourScore >= healthyBenchmark
  const gap = Math.abs(yourScore - healthyBenchmark)

  return (
    <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
      <h3 className="text-xl font-bold text-gray-900 mb-2">Decision Friction Index</h3>
      <p className="text-sm text-gray-600 mb-6">
        Measures the ease with which decisions are made and executed in your leadership
      </p>

      {/* Horizontal bar visualization */}
      <div className="relative h-16 bg-gray-100 rounded-lg overflow-hidden mb-4">
        {/* Benchmark marker */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-gray-400 z-10"
          style={{ left: `${healthyBenchmark}%` }}
        >
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 whitespace-nowrap">
            Healthy ({healthyBenchmark}%)
          </div>
        </div>

        {/* Your score bar */}
        <motion.div
          className={`h-full ${isHealthy ? 'bg-green-500' : 'bg-yellow-500'}`}
          initial={{ width: 0 }}
          animate={{ width: `${yourScore}%` }}
          transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white font-bold text-lg">
            <AnimatedScore value={yourScore} />
          </div>
        </motion.div>
      </div>

      {/* Interpretation */}
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
          isHealthy ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
        }`}>
          {isHealthy ? '✓' : '!'}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900 mb-1">
            {isHealthy
              ? 'Healthy Decision-Making Flow'
              : 'Decision Friction Detected'}
          </p>
          <p className="text-sm text-gray-600">
            {isHealthy
              ? `You're ${gap}% above the healthy benchmark. Your team likely makes decisions with clarity and speed.`
              : `You're ${gap}% below the healthy benchmark. Consider examining bottlenecks in your decision-making processes.`}
          </p>
        </div>
      </div>

      {/* Recommendations */}
      {!isHealthy && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="text-sm font-semibold text-yellow-900 mb-2">Quick Fixes</h4>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• Define decision rights clearly (who decides what)</li>
            <li>• Reduce approval layers for routine decisions</li>
            <li>• Improve psychological safety for upward communication</li>
          </ul>
        </div>
      )}
    </div>
  )
}
