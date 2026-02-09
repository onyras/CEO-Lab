'use client'

interface StreakIndicatorProps {
  total?: number
  filled: number
  className?: string
}

export function StreakIndicator({
  total = 12,
  filled,
  className = '',
}: StreakIndicatorProps) {
  const clampedFilled = Math.max(0, Math.min(total, filled))

  return (
    <div className={`flex gap-1.5 ${className}`}>
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`w-6 h-6 rounded-sm transition-colors ${
            i < clampedFilled ? 'bg-black' : 'bg-black/5'
          }`}
        />
      ))}
    </div>
  )
}
