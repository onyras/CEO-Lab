import type { DimensionId } from '@/types/assessment'

interface BenchmarkData {
  p25: number
  p50: number
  p75: number
}

/**
 * Hardcoded peer benchmarks based on coaching experience with Series A/B CEOs.
 * These represent approximate percentile breakpoints across dimensions.
 */
export const DIMENSION_BENCHMARKS: Record<DimensionId, BenchmarkData> = {
  'LY.1': { p25: 38, p50: 52, p75: 68 },
  'LY.2': { p25: 35, p50: 48, p75: 64 },
  'LY.3': { p25: 30, p50: 44, p75: 60 },
  'LY.4': { p25: 42, p50: 56, p75: 72 },
  'LY.5': { p25: 32, p50: 46, p75: 62 },
  'LT.1': { p25: 40, p50: 54, p75: 70 },
  'LT.2': { p25: 33, p50: 47, p75: 63 },
  'LT.3': { p25: 36, p50: 50, p75: 66 },
  'LT.4': { p25: 30, p50: 44, p75: 60 },
  'LT.5': { p25: 34, p50: 48, p75: 64 },
  'LO.1': { p25: 44, p50: 58, p75: 74 },
  'LO.2': { p25: 32, p50: 46, p75: 62 },
  'LO.3': { p25: 28, p50: 42, p75: 58 },
  'LO.4': { p25: 30, p50: 44, p75: 60 },
  'LO.5': { p25: 34, p50: 48, p75: 64 },
}

export function getBenchmarkContext(
  dimensionId: DimensionId,
  userScore: number
): { percentile: string; narrative: string } {
  const bench = DIMENSION_BENCHMARKS[dimensionId]

  if (userScore >= bench.p75) {
    return {
      percentile: 'Top 25%',
      narrative: 'Above typical for Series A CEOs',
    }
  }
  if (userScore >= bench.p50) {
    return {
      percentile: 'Above median',
      narrative: 'Stronger than most CEOs at this stage',
    }
  }
  if (userScore >= bench.p25) {
    return {
      percentile: 'Typical range',
      narrative: 'Common among Series A CEOs',
    }
  }
  return {
    percentile: 'Below typical',
    narrative: 'A clear development opportunity',
  }
}
