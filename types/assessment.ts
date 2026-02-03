// Hook Assessment Types (12 questions, free entry point)

export interface HookQuestion {
  id: number
  territory: 'yourself' | 'teams' | 'organizations'
  subdimension: string
  question: string
  options: {
    text: string
    value: number
  }[]
}

export interface HookAnswer {
  questionId: number
  value: number
}

export interface HookResults {
  score_yourself: number
  score_teams: number
  score_organizations: number
  total_score: number
  top_strength: string
  biggest_gap: string
}

export interface HookAssessmentData {
  id?: string
  user_id?: string | null
  score_yourself: number
  score_teams: number
  score_organizations: number
  total_score: number
  completed_at: string
}

// Baseline Assessment Types (100 questions, comprehensive)

export interface BaselineQuestion {
  id: number
  territory: 'yourself' | 'teams' | 'organizations'
  subdimension: string
  question: string
  options: {
    text: string
    value: number
  }[]
}

export interface BaselineAnswer {
  questionId: number
  value: number
}

export interface BaselineResults {
  score_yourself: number
  score_teams: number
  score_organizations: number
  total_score: number
  subdimension_scores: {
    [subdimension: string]: number
  }
}
