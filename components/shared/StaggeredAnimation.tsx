'use client'

import { useEffect, useRef, useState, ReactNode, Children, cloneElement, isValidElement } from 'react'

/**
 * Reusable staggered animation wrapper using CSS animations
 *
 * Usage:
 * <StaggeredContainer>
 *   <StaggeredItem>First element</StaggeredItem>
 *   <StaggeredItem>Second element</StaggeredItem>
 *   <StaggeredItem>Third element</StaggeredItem>
 * </StaggeredContainer>
 */

interface StaggeredContainerProps {
  children: ReactNode
  className?: string
  delay?: number
  stagger?: number
  triggerOnScroll?: boolean
}

interface StaggeredItemProps {
  children: ReactNode
  className?: string
  delay?: number
  /** Internal prop set by StaggeredContainer */
  _index?: number
  /** Internal prop set by StaggeredContainer */
  _stagger?: number
  /** Internal prop set by StaggeredContainer */
  _baseDelay?: number
  /** Internal prop set by StaggeredContainer */
  _visible?: boolean
}

/**
 * Container for staggered animations
 * Set triggerOnScroll={true} for scroll-triggered animations
 */
export function StaggeredContainer({
  children,
  className = '',
  delay = 0.3,
  stagger = 0.15,
  triggerOnScroll = false
}: StaggeredContainerProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(!triggerOnScroll)

  useEffect(() => {
    if (!triggerOnScroll) {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [triggerOnScroll])

  return (
    <div ref={ref} className={className}>
      {Children.map(children, (child, index) => {
        if (isValidElement<StaggeredItemProps>(child)) {
          return cloneElement(child, {
            _index: index,
            _stagger: stagger,
            _baseDelay: delay,
            _visible: isVisible,
          })
        }
        return child
      })}
    </div>
  )
}

/**
 * Individual item within a staggered container
 */
export function StaggeredItem({
  children,
  className = '',
  delay = 0,
  _index = 0,
  _stagger = 0.15,
  _baseDelay = 0.3,
  _visible = true,
}: StaggeredItemProps) {
  const totalDelay = _baseDelay + (_index * _stagger) + delay

  return (
    <div
      className={`${_visible ? 'animate-fadeUp' : ''} opacity-0 ${className}`}
      style={_visible ? { animationDelay: `${totalDelay}s` } : undefined}
    >
      {children}
    </div>
  )
}
