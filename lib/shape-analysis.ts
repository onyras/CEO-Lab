// CEO Lab — Territory Shape Analysis
// Analyzes the 5-dimension profile within a territory to identify
// balanced, developing, or spiky patterns.

export interface TerritoryShapeAnalysis {
  shape: 'balanced' | 'developing' | 'spiky'
  range: number
  anchor: { name: string; percentage: number }
  bottleneck: { name: string; percentage: number }
  narrative: string
}

export function analyzeTerritoryShape(
  dimensions: { name: string; percentage: number }[],
  territoryLabel: string
): TerritoryShapeAnalysis {
  if (dimensions.length === 0) {
    return {
      shape: 'balanced',
      range: 0,
      anchor: { name: '', percentage: 0 },
      bottleneck: { name: '', percentage: 0 },
      narrative: '',
    }
  }

  const sorted = [...dimensions].sort((a, b) => b.percentage - a.percentage)
  const highest = sorted[0]
  const lowest = sorted[sorted.length - 1]
  const range = highest.percentage - lowest.percentage

  let shape: TerritoryShapeAnalysis['shape']
  if (range < 15) {
    shape = 'balanced'
  } else if (range <= 30) {
    shape = 'developing'
  } else {
    shape = 'spiky'
  }

  const narrative = buildNarrative(shape, highest, lowest, territoryLabel)

  return {
    shape,
    range: Math.round(range),
    anchor: { name: highest.name, percentage: Math.round(highest.percentage) },
    bottleneck: { name: lowest.name, percentage: Math.round(lowest.percentage) },
    narrative,
  }
}

function buildNarrative(
  shape: TerritoryShapeAnalysis['shape'],
  anchor: { name: string; percentage: number },
  bottleneck: { name: string; percentage: number },
  territoryLabel: string
): string {
  const anchorName = anchor.name
  const bottleneckName = bottleneck.name

  switch (shape) {
    case 'balanced':
      return `Your ${territoryLabel} profile is balanced — dimensions are developing at a similar pace. ${anchorName} leads slightly, with ${bottleneckName} closest behind.`
    case 'developing':
      return `Your ${territoryLabel} profile is developing unevenly. ${anchorName} is your anchor at ${Math.round(anchor.percentage)}%, while ${bottleneckName} at ${Math.round(bottleneck.percentage)}% is holding the territory back.`
    case 'spiky':
      return `Your ${territoryLabel} profile is spiky — a ${Math.round(anchor.percentage - bottleneck.percentage)}-point gap between ${anchorName} and ${bottleneckName}. The strength in ${anchorName} isn't translating to ${bottleneckName} yet.`
  }
}
