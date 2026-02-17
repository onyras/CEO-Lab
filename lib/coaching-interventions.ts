import { DIMENSIONS, FRAMEWORK_PRESCRIPTIONS } from '@/lib/constants'
import { DIMENSION_CONTENT } from '@/lib/report-content'
import { getFrameworkByName } from '@/lib/framework-content'
import type { DimensionId } from '@/types/assessment'

export interface CoachingIntervention {
  dimensionId: DimensionId
  dimensionName: string
  currentState: string
  targetState: string
  expectedImpact: string
  timeline: string
  framework: string
  frameworkSlug: string | null
}

/**
 * Generate "If I Were Your Coach" interventions for the 3 lowest-scoring dimensions.
 */
export function generateCoachingInterventions(
  dimensionScores: { dimensionId: DimensionId; percentage: number }[]
): CoachingIntervention[] {
  const sorted = [...dimensionScores].sort((a, b) => a.percentage - b.percentage)
  const bottom3 = sorted.slice(0, 3)

  return bottom3.map((ds) => {
    const dim = DIMENSIONS.find((d) => d.id === ds.dimensionId)
    const content = DIMENSION_CONTENT[ds.dimensionId]
    const prescriptions = FRAMEWORK_PRESCRIPTIONS[ds.dimensionId]

    const dimName = dim?.name ?? ds.dimensionId

    // Pick framework based on score tier
    const frameworkName =
      ds.percentage <= 40
        ? prescriptions?.critical[0]
        : ds.percentage <= 60
          ? prescriptions?.developing[0]
          : prescriptions?.strong[0]

    const fw = frameworkName ? getFrameworkByName(frameworkName) : undefined

    // Build current state from low indicator
    const currentState = content?.lowIndicator
      ? content.lowIndicator.split('.').slice(0, 2).join('.') + '.'
      : `Scoring ${Math.round(ds.percentage)}% in ${dimName}.`

    // Build target state from high indicator
    const targetState = content?.highIndicator
      ? content.highIndicator.split('.').slice(0, 2).join('.') + '.'
      : `Consistently strong performance in ${dimName}.`

    // Expected impact from cost of ignoring (inverted)
    const expectedImpact = content?.costOfIgnoring
      ? content.costOfIgnoring.split('.').slice(0, 1).join('.') + '.'
      : `Significant improvement in ${dimName.toLowerCase()}.`

    // Timeline based on score gap
    const gap = 100 - ds.percentage
    const timeline =
      gap > 50 ? '90 days focused work' : gap > 30 ? '60 days focused work' : '30 days focused work'

    return {
      dimensionId: ds.dimensionId,
      dimensionName: dimName,
      currentState,
      targetState,
      expectedImpact,
      timeline,
      framework: frameworkName ?? 'No framework available',
      frameworkSlug: fw?.id ?? null,
    }
  })
}
