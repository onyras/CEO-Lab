import { HookQuestion } from '@/types/assessment'

export const hookQuestions: HookQuestion[] = [
  // LEADING YOURSELF (4 questions)
  {
    id: 1,
    territory: 'yourself',
    subdimension: 'Energy Management',
    question: 'In the last week, how many hours did you spend on work that only you could do (not meetings, emails, or fire-fighting)?',
    options: [
      { text: '0-2 hours (I\'m drowning)', value: 1 },
      { text: '3-5 hours (I\'m surviving)', value: 2 },
      { text: '6-10 hours (I\'m managing)', value: 3 },
      { text: '10+ hours (I\'m thriving)', value: 4 }
    ]
  },
  {
    id: 2,
    territory: 'yourself',
    subdimension: 'Self-Awareness',
    question: 'When was the last time you said "I don\'t know" in front of your team?',
    options: [
      { text: 'Can\'t remember (I\'m the expert)', value: 1 },
      { text: 'More than a month ago', value: 2 },
      { text: 'In the last 2 weeks', value: 3 },
      { text: 'This week (I model vulnerability)', value: 4 }
    ]
  },
  {
    id: 3,
    territory: 'yourself',
    subdimension: 'Above the Line',
    question: 'When something goes wrong, what\'s your first internal reaction?',
    options: [
      { text: '"Who screwed this up?" (Blame)', value: 1 },
      { text: '"Why does this always happen?" (Victim)', value: 2 },
      { text: '"I\'ll fix it myself" (Hero)', value: 3 },
      { text: '"What did I miss? What can we learn?" (Curiosity)', value: 4 }
    ]
  },
  {
    id: 4,
    territory: 'yourself',
    subdimension: 'Contemplative Practice',
    question: 'Do you have a daily practice that creates space for stillness (meditation, journaling, walking)?',
    options: [
      { text: 'No, I don\'t have time', value: 1 },
      { text: 'I try, but it\'s sporadic', value: 2 },
      { text: 'Yes, a few times a week', value: 3 },
      { text: 'Yes, it\'s non-negotiable', value: 4 }
    ]
  },

  // LEADING TEAMS (4 questions)
  {
    id: 5,
    territory: 'teams',
    subdimension: 'Psychological Safety',
    question: 'How long does it take for bad news to reach you?',
    options: [
      { text: 'I find out weeks later (or never)', value: 1 },
      { text: 'Days, through back channels', value: 2 },
      { text: 'Within 24 hours', value: 3 },
      { text: 'Immediately, people seek me out', value: 4 }
    ]
  },
  {
    id: 6,
    territory: 'teams',
    subdimension: 'Multiplier Behavior',
    question: 'In your last team meeting, did you ask more questions or give more answers?',
    options: [
      { text: 'All answers (I\'m the expert)', value: 1 },
      { text: 'Mostly answers, some questions', value: 2 },
      { text: 'Balanced', value: 3 },
      { text: 'Mostly questions (I expand their thinking)', value: 4 }
    ]
  },
  {
    id: 7,
    territory: 'teams',
    subdimension: 'Trust Formula',
    question: 'When you commit to something, how often do you deliver on time?',
    options: [
      { text: 'I overcommit and underdeliver', value: 1 },
      { text: '50-70% of the time', value: 2 },
      { text: '80-90% of the time', value: 3 },
      { text: '95%+, or I renegotiate early', value: 4 }
    ]
  },
  {
    id: 8,
    territory: 'teams',
    subdimension: 'Delegation',
    question: 'What percentage of decisions require your final approval?',
    options: [
      { text: '80%+ (I\'m the bottleneck)', value: 1 },
      { text: '50-70% (I\'m involved in most)', value: 2 },
      { text: '30-50% (Team owns a lot)', value: 3 },
      { text: '<20% (Team is empowered)', value: 4 }
    ]
  },

  // LEADING ORGANIZATIONS (4 questions)
  {
    id: 9,
    territory: 'organizations',
    subdimension: 'Strategic Clarity',
    question: 'Can every person on your leadership team explain your strategy in one sentence, and would they all say the same thing?',
    options: [
      { text: 'No, we\'re not aligned', value: 1 },
      { text: 'Probably not', value: 2 },
      { text: 'Most could', value: 3 },
      { text: 'Yes, we\'re crystal clear', value: 4 }
    ]
  },
  {
    id: 10,
    territory: 'organizations',
    subdimension: 'Culture as System',
    question: 'Is your culture designed intentionally, or did it just happen?',
    options: [
      { text: 'It just happened (we\'re winging it)', value: 1 },
      { text: 'We have values on a wall', value: 2 },
      { text: 'We\'re actively shaping it', value: 3 },
      { text: 'It\'s designed and enforced', value: 4 }
    ]
  },
  {
    id: 11,
    territory: 'organizations',
    subdimension: 'Three Transitions',
    question: 'Are you working IN the business (execution) or ON the business (strategy, structure, culture)?',
    options: [
      { text: '80% IN, 20% ON (I\'m an operator)', value: 1 },
      { text: '60% IN, 40% ON (I\'m transitioning)', value: 2 },
      { text: '40% IN, 60% ON (I\'m leading)', value: 3 },
      { text: '80% ON, 20% IN (I\'m architecting)', value: 4 }
    ]
  },
  {
    id: 12,
    territory: 'organizations',
    subdimension: 'Systems Thinking',
    question: 'When problems repeat, do you see isolated incidents or systemic patterns?',
    options: [
      { text: 'Everything feels random', value: 1 },
      { text: 'I see incidents', value: 2 },
      { text: 'I\'m starting to see patterns', value: 3 },
      { text: 'I diagnose systems', value: 4 }
    ]
  }
]
