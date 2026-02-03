import { baselineQuestions } from './baseline-questions'

// Map questions to sub-dimensions for scoring
const DIMENSION_QUESTIONS: Record<string, number[]> = {
  'Energy Management': [1, 2, 3, 4, 5],
  'Self-Awareness': [6, 7, 8, 9, 10, 11],
  'Above the Line': [12, 13, 14, 15, 16],
  'Emotional Fluidity': [17, 18, 19, 20, 21, 22],
  'Contemplative Practice': [23, 24, 25, 26, 27],
  'Stress Design': [28, 29, 30, 31, 32],

  'Trust Formula': [33, 34, 35, 36, 37, 38],
  'Psychological Safety': [39, 40, 41, 42, 43, 44],
  'Multiplier Behavior': [45, 46, 47, 48, 49, 50],
  'Communication Rhythm': [51, 52, 53, 54, 55, 56],
  'Team Health': [57, 58, 59, 60, 61, 62],
  'Accountability & Delegation': [63, 64, 65, 66, 67],

  'Strategic Clarity': [68, 69, 70, 71, 72, 73],
  'Culture as System': [74, 75, 76, 77, 78, 79],
  'Three Transitions': [80, 81, 82, 83, 84, 85],
  'Systems Thinking': [86, 87, 88, 89, 90],
  'Organizational Design': [91, 92, 93, 94, 95],
  'Board & Governance': [96, 97, 98, 99, 100]
}

export interface SubDimensionScore {
  subdimension: string
  territory: 'yourself' | 'teams' | 'organizations'
  score: number
  maxScore: number
  percentage: number
  questionCount: number
}

export interface TerritoryScore {
  territory: 'yourself' | 'teams' | 'organizations'
  score: number
  maxScore: number
  percentage: number
  subdimensions: SubDimensionScore[]
}

export interface BaselineScores {
  totalScore: number
  totalMaxScore: number
  totalPercentage: number
  territories: TerritoryScore[]
  allSubdimensions: SubDimensionScore[]
  topStrengths: SubDimensionScore[]
  biggestGaps: SubDimensionScore[]
}

export function calculateBaselineScores(responses: Record<number, number>): BaselineScores {
  const subdimensionScores: SubDimensionScore[] = []

  // Calculate score for each sub-dimension
  Object.entries(DIMENSION_QUESTIONS).forEach(([subdimension, questionIds]) => {
    const answeredQuestions = questionIds.filter(id => responses[id] !== undefined)
    const score = answeredQuestions.reduce((sum, id) => sum + (responses[id] || 0), 0)
    const maxScore = answeredQuestions.length * 5 // Each question max is 5 points
    const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0

    // Determine territory
    const question = baselineQuestions.find(q => q.id === questionIds[0])
    const territory = question?.territory || 'yourself'

    subdimensionScores.push({
      subdimension,
      territory,
      score,
      maxScore,
      percentage,
      questionCount: answeredQuestions.length
    })
  })

  // Calculate territory scores
  const territories: TerritoryScore[] = [
    {
      territory: 'yourself',
      score: 0,
      maxScore: 0,
      percentage: 0,
      subdimensions: []
    },
    {
      territory: 'teams',
      score: 0,
      maxScore: 0,
      percentage: 0,
      subdimensions: []
    },
    {
      territory: 'organizations',
      score: 0,
      maxScore: 0,
      percentage: 0,
      subdimensions: []
    }
  ]

  subdimensionScores.forEach(sd => {
    const territory = territories.find(t => t.territory === sd.territory)
    if (territory) {
      territory.score += sd.score
      territory.maxScore += sd.maxScore
      territory.subdimensions.push(sd)
    }
  })

  territories.forEach(t => {
    t.percentage = t.maxScore > 0 ? Math.round((t.score / t.maxScore) * 100) : 0
  })

  // Calculate total score
  const totalScore = subdimensionScores.reduce((sum, sd) => sum + sd.score, 0)
  const totalMaxScore = subdimensionScores.reduce((sum, sd) => sum + sd.maxScore, 0)
  const totalPercentage = totalMaxScore > 0 ? Math.round((totalScore / totalMaxScore) * 100) : 0

  // Identify top strengths (highest percentages)
  const topStrengths = [...subdimensionScores]
    .filter(sd => sd.questionCount > 0)
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 3)

  // Identify biggest gaps (lowest percentages)
  const biggestGaps = [...subdimensionScores]
    .filter(sd => sd.questionCount > 0)
    .sort((a, b) => a.percentage - b.percentage)
    .slice(0, 3)

  return {
    totalScore,
    totalMaxScore,
    totalPercentage,
    territories,
    allSubdimensions: subdimensionScores,
    topStrengths,
    biggestGaps
  }
}

export function getScoreLabel(percentage: number): string {
  if (percentage >= 80) return 'Mastery'
  if (percentage >= 60) return 'Proficient'
  if (percentage >= 40) return 'Developing'
  return 'Foundation'
}

export function getScoreColor(percentage: number): string {
  if (percentage >= 80) return 'text-blue-600 bg-blue-50'
  if (percentage >= 60) return 'text-green-600 bg-green-50'
  if (percentage >= 40) return 'text-yellow-600 bg-yellow-50'
  return 'text-red-600 bg-red-50'
}
