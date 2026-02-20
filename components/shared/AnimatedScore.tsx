'use client'

import { useEffect, useState } from 'react'

interface AnimatedScoreProps {
  value: number
  duration?: number
  suffix?: string
  className?: string
}

export function AnimatedScore({
  value,
  duration = 1000,
  suffix = '%',
  className = ''
}: AnimatedScoreProps) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    let startTime: number
    let animationFrame: number

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const current = Math.floor(value * easeOutQuart)

      setDisplayValue(current)

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [value, duration])

  return (
    <span
      className={`animate-fadeIn opacity-0 ${className}`}
    >
      {displayValue}{suffix}
    </span>
  )
}
