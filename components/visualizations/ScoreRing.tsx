'use client'

import { useEffect, useState } from 'react'

interface ScoreRingProps {
  value: number
  size?: number
  strokeWidth?: number
  color?: string
  label?: string
  trackColor?: string
  showValue?: boolean
  valuePrefix?: string
  valueSuffix?: string
  className?: string
}

export function ScoreRing({
  value,
  size = 120,
  strokeWidth = 8,
  color = '#000',
  label,
  trackColor = 'rgba(0,0,0,0.05)',
  showValue = true,
  valuePrefix = '',
  valueSuffix = '',
  className = '',
}: ScoreRingProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Small delay to trigger CSS transition on mount
    const timer = setTimeout(() => setMounted(true), 50)
    return () => clearTimeout(timer)
  }, [])

  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const clampedValue = Math.max(0, Math.min(100, value))
  const offset = circumference - (clampedValue / 100) * circumference

  const center = size / 2

  // Font size scales with ring size
  const valueFontSize = size * 0.28
  const labelFontSize = Math.max(10, size * 0.1)

  return (
    <div className={`inline-flex flex-col items-center ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-90"
        >
          {/* Track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={trackColor}
            strokeWidth={strokeWidth}
          />
          {/* Progress */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={mounted ? offset : circumference}
            className="score-ring-progress"
          />
        </svg>

        {/* Center content */}
        {showValue && (
          <div
            className="absolute inset-0 flex items-center justify-center"
          >
            <span
              className="font-bold text-black leading-none"
              style={{ fontSize: valueFontSize }}
            >
              {valuePrefix}{Math.round(clampedValue)}{valueSuffix}
            </span>
          </div>
        )}
      </div>

      {/* Label below ring */}
      {label && (
        <span
          className="text-black/50 font-medium mt-2 text-center"
          style={{ fontSize: labelFontSize }}
        >
          {label}
        </span>
      )}
    </div>
  )
}
