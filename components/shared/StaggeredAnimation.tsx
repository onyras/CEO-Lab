'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

/**
 * Reusable staggered animation wrapper
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
}

// Container animation variants
const containerVariants = (stagger = 0.15, delayChildren = 0.3) => ({
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: stagger,
      delayChildren: delayChildren,
    }
  }
})

// Item animation variants
const itemVariants = (delay = 0) => ({
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1],
      delay: delay,
    }
  }
})

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
  const animationProps = triggerOnScroll
    ? {
        initial: 'hidden',
        whileInView: 'show',
        viewport: { once: true, amount: 0.3 }
      }
    : {
        initial: 'hidden',
        animate: 'show'
      }

  return (
    <motion.div
      className={className}
      variants={containerVariants(stagger, delay)}
      {...animationProps}
    >
      {children}
    </motion.div>
  )
}

/**
 * Individual item within a staggered container
 */
export function StaggeredItem({ children, className = '', delay = 0 }: StaggeredItemProps) {
  return (
    <motion.div
      className={className}
      variants={itemVariants(delay)}
    >
      {children}
    </motion.div>
  )
}
