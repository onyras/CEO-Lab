// Weekly signature questions - one per sub-dimension
// Users choose 3 per quarter and answer the same 3 every week

export interface WeeklyQuestion {
  subdimension: string
  question: string
  inputType: 'number' | 'select' | 'yesno'
  options?: { text: string; value: string | number }[]
}

export const weeklyQuestions: WeeklyQuestion[] = [
  // LEADING YOURSELF
  {
    subdimension: 'Energy Management',
    question: 'This week, how many hours of Deep Work did you complete?',
    inputType: 'number'
  },
  {
    subdimension: 'Self-Awareness',
    question: 'How many times did you catch yourself mid-pattern this week?',
    inputType: 'number'
  },
  {
    subdimension: 'Above the Line',
    question: 'When problems arose this week, did you respond with blame or curiosity?',
    inputType: 'select',
    options: [
      { text: 'Always blame', value: 1 },
      { text: 'Mostly blame', value: 2 },
      { text: '50/50', value: 3 },
      { text: 'Mostly curiosity', value: 4 },
      { text: 'Always curiosity', value: 5 }
    ]
  },
  {
    subdimension: 'Emotional Fluidity',
    question: 'How many times did you name your emotion in real-time this week?',
    inputType: 'number'
  },
  {
    subdimension: 'Contemplative Practice',
    question: 'How many days did you practice this week?',
    inputType: 'number'
  },
  {
    subdimension: 'Stress Design',
    question: 'What was your stress zone this week?',
    inputType: 'select',
    options: [
      { text: 'Burnout (exhausted)', value: 1 },
      { text: 'Overload (too much)', value: 2 },
      { text: 'Under-stimulated (bored)', value: 2 },
      { text: 'Optimal (stretched well)', value: 5 }
    ]
  },

  // LEADING TEAMS
  {
    subdimension: 'Trust Formula',
    question: 'How many commitments did you keep vs. break this week?',
    inputType: 'select',
    options: [
      { text: 'Less than 50%', value: 1 },
      { text: '50-70%', value: 2 },
      { text: '70-85%', value: 3 },
      { text: '85-95%', value: 4 },
      { text: '95%+ or renegotiated early', value: 5 }
    ]
  },
  {
    subdimension: 'Psychological Safety',
    question: 'How fast did bad news reach you this week?',
    inputType: 'select',
    options: [
      { text: 'Weeks later or never', value: 1 },
      { text: 'Several days', value: 2 },
      { text: 'Within 24-48 hours', value: 3 },
      { text: 'Same day', value: 4 },
      { text: 'Immediately - people sought me out', value: 5 }
    ]
  },
  {
    subdimension: 'Multiplier Behavior',
    question: 'In meetings this week, did you ask more questions or give more answers?',
    inputType: 'select',
    options: [
      { text: 'All answers', value: 1 },
      { text: 'Mostly answers (70/30)', value: 2 },
      { text: 'Balanced (50/50)', value: 3 },
      { text: 'Mostly questions (70/30)', value: 4 },
      { text: 'All questions', value: 5 }
    ]
  },
  {
    subdimension: 'Communication Rhythm',
    question: 'Did you hold your weekly tactical meeting this week?',
    inputType: 'yesno'
  },
  {
    subdimension: 'Team Health',
    question: 'Did your team have healthy conflict this week?',
    inputType: 'yesno'
  },
  {
    subdimension: 'Accountability & Delegation',
    question: 'What % of decisions required your approval this week?',
    inputType: 'select',
    options: [
      { text: '80%+ (bottleneck)', value: 1 },
      { text: '60-80%', value: 2 },
      { text: '40-60%', value: 3 },
      { text: '20-40%', value: 4 },
      { text: '<20% (fully empowered)', value: 5 }
    ]
  },

  // LEADING ORGANIZATIONS
  {
    subdimension: 'Strategic Clarity',
    question: 'Did you review your strategy this week?',
    inputType: 'yesno'
  },
  {
    subdimension: 'Culture as System',
    question: 'Did you actively shape culture this week?',
    inputType: 'yesno'
  },
  {
    subdimension: 'Three Transitions',
    question: 'This week, what % of time did you spend working ON vs. IN the business?',
    inputType: 'select',
    options: [
      { text: '80% IN, 20% ON (operator)', value: 1 },
      { text: '60% IN, 40% ON (transitioning)', value: 2 },
      { text: '50% IN, 50% ON (balanced)', value: 3 },
      { text: '40% IN, 60% ON (leading)', value: 4 },
      { text: '20% IN, 80% ON (architecting)', value: 5 }
    ]
  },
  {
    subdimension: 'Systems Thinking',
    question: 'When problems arose this week, did you see patterns or isolated incidents?',
    inputType: 'select',
    options: [
      { text: 'Everything felt random', value: 1 },
      { text: 'Saw incidents', value: 2 },
      { text: 'Starting to see patterns', value: 3 },
      { text: 'Saw clear patterns', value: 4 },
      { text: 'Diagnosed root systems', value: 5 }
    ]
  },
  {
    subdimension: 'Organizational Design',
    question: 'Did your org structure support or hinder execution this week?',
    inputType: 'select',
    options: [
      { text: 'Major hindrance', value: 1 },
      { text: 'Some friction', value: 2 },
      { text: 'Neutral', value: 3 },
      { text: 'Mostly supported', value: 4 },
      { text: 'Fully enabled execution', value: 5 }
    ]
  },
  {
    subdimension: 'Board & Governance',
    question: 'Did you proactively use your board this week?',
    inputType: 'yesno'
  }
]

export function getQuestionBySubdimension(subdimension: string): WeeklyQuestion | undefined {
  return weeklyQuestions.find(q => q.subdimension === subdimension)
}
