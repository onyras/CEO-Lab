import { BaselineQuestion } from '@/types/assessment'

export const baselineQuestions: BaselineQuestion[] = [
  // ============================================
  // TERRITORY 1: LEADING YOURSELF (32 questions)
  // ============================================

  // 1.1 ENERGY MANAGEMENT (5 questions)
  {
    id: 1,
    territory: 'yourself',
    subdimension: 'Energy Management',
    question: 'In the last month, how many hours per week did you spend in deep work (uninterrupted focus on high-value work)?',
    options: [
      { text: '0-2 hours (constantly interrupted)', value: 1 },
      { text: '3-5 hours (some focus)', value: 2 },
      { text: '6-10 hours (regular focus blocks)', value: 3 },
      { text: '11-15 hours (protected time)', value: 4 },
      { text: '15+ hours (mastery)', value: 5 }
    ]
  },
  {
    id: 2,
    territory: 'yourself',
    subdimension: 'Energy Management',
    question: 'How do you protect your deep work time from interruptions?',
    options: [
      { text: 'I don\'t - anyone can interrupt me anytime', value: 1 },
      { text: 'I try to focus but get pulled into meetings', value: 2 },
      { text: 'I block calendar time but it often gets overridden', value: 3 },
      { text: 'I guard specific blocks and turn off notifications', value: 4 },
      { text: 'It\'s sacred - team knows not to interrupt during these hours', value: 5 }
    ]
  },
  {
    id: 3,
    territory: 'yourself',
    subdimension: 'Energy Management',
    question: 'Do you know when during the day you do your best thinking?',
    options: [
      { text: 'No idea - I just work whenever', value: 1 },
      { text: 'I have a vague sense', value: 2 },
      { text: 'Yes, and I sometimes protect that time', value: 3 },
      { text: 'Yes, and I schedule important work then', value: 4 },
      { text: 'Yes, and I design my entire day around my energy peaks', value: 5 }
    ]
  },
  {
    id: 4,
    territory: 'yourself',
    subdimension: 'Energy Management',
    question: 'How often do you take intentional breaks to recharge (walks, exercise, rest)?',
    options: [
      { text: 'Never - I push through', value: 1 },
      { text: 'Rarely - only when exhausted', value: 2 },
      { text: 'Sometimes - when I remember', value: 3 },
      { text: 'Regularly - a few times a week', value: 4 },
      { text: 'Daily - it\'s part of my system', value: 5 }
    ]
  },
  {
    id: 5,
    territory: 'yourself',
    subdimension: 'Energy Management',
    question: 'How many hours of sleep do you average per night, and how consistent is it?',
    options: [
      { text: 'Less than 5 hours, erratic schedule', value: 1 },
      { text: '5-6 hours, somewhat consistent', value: 2 },
      { text: '6-7 hours, mostly consistent', value: 3 },
      { text: '7-8 hours, very consistent', value: 4 },
      { text: '8+ hours, locked in routine', value: 5 }
    ]
  },

  // 1.2 SELF-AWARENESS (6 questions)
  {
    id: 6,
    territory: 'yourself',
    subdimension: 'Self-Awareness',
    question: 'Can you name your primary driver (what unconsciously motivates your behavior)?',
    options: [
      { text: 'I don\'t know what that means', value: 1 },
      { text: 'I\'ve heard of it but couldn\'t name mine', value: 2 },
      { text: 'I have a guess', value: 3 },
      { text: 'Yes, I\'ve identified it', value: 4 },
      { text: 'Yes, and I understand where it came from', value: 5 }
    ]
  },
  {
    id: 7,
    territory: 'yourself',
    subdimension: 'Self-Awareness',
    question: 'Do you know the origin story of your primary driver (where it came from in your life)?',
    options: [
      { text: 'No', value: 1 },
      { text: 'I have some vague ideas', value: 2 },
      { text: 'Yes, I can trace it back', value: 3 },
      { text: 'Yes, and I see how it shapes my decisions', value: 4 },
      { text: 'Yes, and I\'ve worked through it with a therapist/coach', value: 5 }
    ]
  },
  {
    id: 8,
    territory: 'yourself',
    subdimension: 'Self-Awareness',
    question: 'How often do you catch yourself mid-pattern (noticing when your driver is running you)?',
    options: [
      { text: 'Never - I don\'t see it happening', value: 1 },
      { text: 'Rarely - only in hindsight', value: 2 },
      { text: 'Sometimes - maybe once a week', value: 3 },
      { text: 'Often - a few times a week', value: 4 },
      { text: 'Daily - I notice it in real-time', value: 5 }
    ]
  },
  {
    id: 9,
    territory: 'yourself',
    subdimension: 'Self-Awareness',
    question: 'Can you articulate your Zone of Genius (the work only you can do, that energizes you)?',
    options: [
      { text: 'I don\'t know what that is', value: 1 },
      { text: 'I have a vague idea', value: 2 },
      { text: 'I could describe it in general terms', value: 3 },
      { text: 'Yes, I can name it clearly', value: 4 },
      { text: 'Yes, and I\'ve designed my role around it', value: 5 }
    ]
  },
  {
    id: 10,
    territory: 'yourself',
    subdimension: 'Self-Awareness',
    question: 'What percentage of your time do you spend in your Zone of Genius?',
    options: [
      { text: '0-10% (I\'m doing everything else)', value: 1 },
      { text: '10-30% (occasionally)', value: 2 },
      { text: '30-50% (some of the time)', value: 3 },
      { text: '50-70% (most days)', value: 4 },
      { text: '70%+ (I\'ve designed my role for this)', value: 5 }
    ]
  },
  {
    id: 11,
    territory: 'yourself',
    subdimension: 'Self-Awareness',
    question: 'Which cognitive biases do you regularly fall for?',
    options: [
      { text: 'I don\'t know what cognitive biases are', value: 1 },
      { text: 'I know what they are but can\'t name mine', value: 2 },
      { text: 'I can name 1-2 that affect me', value: 3 },
      { text: 'I know several and catch them sometimes', value: 4 },
      { text: 'I actively track my biases and correct for them', value: 5 }
    ]
  },

  // 1.3 ABOVE THE LINE (5 questions)
  {
    id: 12,
    territory: 'yourself',
    subdimension: 'Above the Line',
    question: 'When you\'re reactive (below the line), can you recognize it in the moment?',
    options: [
      { text: 'No - I don\'t notice until much later', value: 1 },
      { text: 'Rarely - usually realize hours later', value: 2 },
      { text: 'Sometimes - maybe 30 minutes after', value: 3 },
      { text: 'Often - within a few minutes', value: 4 },
      { text: 'Yes - I catch myself in real-time', value: 5 }
    ]
  },
  {
    id: 13,
    territory: 'yourself',
    subdimension: 'Above the Line',
    question: 'How quickly can you recover and get back above the line?',
    options: [
      { text: 'Hours or days - I stay stuck', value: 1 },
      { text: '1-2 hours with effort', value: 2 },
      { text: '30-60 minutes', value: 3 },
      { text: '10-20 minutes', value: 4 },
      { text: '1-5 minutes - I have a practice for this', value: 5 }
    ]
  },
  {
    id: 14,
    territory: 'yourself',
    subdimension: 'Above the Line',
    question: 'When you go below the line, which drama triangle role do you default to?',
    options: [
      { text: 'I don\'t know the drama triangle', value: 1 },
      { text: 'I know it but don\'t see my pattern', value: 2 },
      { text: 'I default to Victim ("Why me?")', value: 3 },
      { text: 'I default to Villain ("Who screwed up?")', value: 3 },
      { text: 'I default to Hero ("I\'ll fix it")', value: 3 },
      { text: 'I recognize all three and catch myself early', value: 5 }
    ]
  },
  {
    id: 15,
    territory: 'yourself',
    subdimension: 'Above the Line',
    question: 'When something goes wrong, do you respond with blame or curiosity?',
    options: [
      { text: 'Always blame - "Who screwed up?"', value: 1 },
      { text: 'Mostly blame with some curiosity', value: 2 },
      { text: '50/50 - depends on the situation', value: 3 },
      { text: 'Mostly curiosity - "What did I miss?"', value: 4 },
      { text: 'Always curiosity - "What can we learn?"', value: 5 }
    ]
  },
  {
    id: 16,
    territory: 'yourself',
    subdimension: 'Above the Line',
    question: 'When someone criticizes you, how defensive do you get?',
    options: [
      { text: 'Very - I immediately justify or counterattack', value: 1 },
      { text: 'Moderately - I get defensive but try to hide it', value: 2 },
      { text: 'Sometimes defensive, sometimes open', value: 3 },
      { text: 'Rarely defensive - I listen first', value: 4 },
      { text: 'Never defensive - I seek criticism actively', value: 5 }
    ]
  },

  // 1.4 EMOTIONAL FLUIDITY (6 questions)
  {
    id: 17,
    territory: 'yourself',
    subdimension: 'Emotional Fluidity',
    question: 'Can you identify and name the emotion you\'re feeling in real-time?',
    options: [
      { text: 'No - I\'m disconnected from my emotions', value: 1 },
      { text: 'Rarely - only the obvious ones (anger, joy)', value: 2 },
      { text: 'Sometimes - basic emotions only', value: 3 },
      { text: 'Often - I can name nuanced emotions', value: 4 },
      { text: 'Always - I track emotional states continuously', value: 5 }
    ]
  },
  {
    id: 18,
    territory: 'yourself',
    subdimension: 'Emotional Fluidity',
    question: 'When you feel an emotion, do you suppress it or allow it to move through you?',
    options: [
      { text: 'Always suppress - emotions are weakness', value: 1 },
      { text: 'Mostly suppress - I push them down', value: 2 },
      { text: 'Sometimes allow, sometimes suppress', value: 3 },
      { text: 'Mostly allow - I let them move', value: 4 },
      { text: 'Fully allow - emotions are information', value: 5 }
    ]
  },
  {
    id: 19,
    territory: 'yourself',
    subdimension: 'Emotional Fluidity',
    question: 'Do you know your implicit contracts (unconscious agreements about how you should behave)?',
    options: [
      { text: 'I don\'t know what that means', value: 1 },
      { text: 'I\'ve heard of it but don\'t know mine', value: 2 },
      { text: 'I\'m starting to see some patterns', value: 3 },
      { text: 'Yes, I can name several', value: 4 },
      { text: 'Yes, and I actively renegotiate them', value: 5 }
    ]
  },
  {
    id: 20,
    territory: 'yourself',
    subdimension: 'Emotional Fluidity',
    question: 'What is your relationship with fear?',
    options: [
      { text: 'I avoid it or pretend it\'s not there', value: 1 },
      { text: 'I feel it but don\'t acknowledge it', value: 2 },
      { text: 'I notice it but don\'t know what to do with it', value: 3 },
      { text: 'I feel it and name it', value: 4 },
      { text: 'I welcome it as information and guidance', value: 5 }
    ]
  },
  {
    id: 21,
    territory: 'yourself',
    subdimension: 'Emotional Fluidity',
    question: 'How do you handle anger - suppress it or express it cleanly?',
    options: [
      { text: 'I suppress it and it leaks out sideways', value: 1 },
      { text: 'I explode when it builds up too much', value: 2 },
      { text: 'I feel it but don\'t know how to express it', value: 3 },
      { text: 'I express it but sometimes messily', value: 4 },
      { text: 'I express it cleanly and directly', value: 5 }
    ]
  },
  {
    id: 22,
    territory: 'yourself',
    subdimension: 'Emotional Fluidity',
    question: 'Can you show vulnerability appropriately with your team?',
    options: [
      { text: 'Never - I must appear strong', value: 1 },
      { text: 'Rarely - only in crisis', value: 2 },
      { text: 'Sometimes - with people I trust', value: 3 },
      { text: 'Often - I model it regularly', value: 4 },
      { text: 'Always - it\'s how I build trust', value: 5 }
    ]
  },

  // 1.5 CONTEMPLATIVE PRACTICE (5 questions)
  {
    id: 23,
    territory: 'yourself',
    subdimension: 'Contemplative Practice',
    question: 'Do you have a contemplative practice (meditation, journaling, prayer, walking)?',
    options: [
      { text: 'No - I don\'t have time for that', value: 1 },
      { text: 'I tried but it didn\'t stick', value: 2 },
      { text: 'Yes, but sporadic (once a week or less)', value: 3 },
      { text: 'Yes, regular (3-5 times per week)', value: 4 },
      { text: 'Yes, daily non-negotiable', value: 5 }
    ]
  },
  {
    id: 24,
    territory: 'yourself',
    subdimension: 'Contemplative Practice',
    question: 'How often do you practice?',
    options: [
      { text: 'Never', value: 1 },
      { text: 'A few times a month', value: 2 },
      { text: 'Once a week', value: 3 },
      { text: '3-5 times per week', value: 4 },
      { text: 'Daily', value: 5 }
    ]
  },
  {
    id: 25,
    territory: 'yourself',
    subdimension: 'Contemplative Practice',
    question: 'What type of practice do you engage in?',
    options: [
      { text: 'None', value: 1 },
      { text: 'Awareness (noticing thoughts without judgment)', value: 3 },
      { text: 'Cultivation (developing specific qualities like compassion)', value: 3 },
      { text: 'Self-reflection (examining patterns and behaviors)', value: 3 },
      { text: 'Multiple types - I rotate based on what I need', value: 5 }
    ]
  },
  {
    id: 26,
    territory: 'yourself',
    subdimension: 'Contemplative Practice',
    question: 'Do you take annual retreats (1+ days away for reflection)?',
    options: [
      { text: 'Never - I can\'t afford the time', value: 1 },
      { text: 'I\'ve thought about it but never done it', value: 2 },
      { text: 'Once in the past few years', value: 3 },
      { text: 'Once per year', value: 4 },
      { text: 'Multiple times per year', value: 5 }
    ]
  },
  {
    id: 27,
    territory: 'yourself',
    subdimension: 'Contemplative Practice',
    question: 'How do you listen in conversations?',
    options: [
      { text: 'Habitually - waiting to speak, distracted', value: 1 },
      { text: 'Factual - listening for information', value: 2 },
      { text: 'Empathic - listening for feeling and meaning', value: 3 },
      { text: 'Generative - listening for what wants to emerge', value: 4 },
      { text: 'I shift between all levels based on context', value: 5 }
    ]
  },

  // 1.6 STRESS DESIGN (5 questions)
  {
    id: 28,
    territory: 'yourself',
    subdimension: 'Stress Design',
    question: 'Which stress zone are you operating in right now?',
    options: [
      { text: 'Under-stimulated (bored, not challenged)', value: 2 },
      { text: 'Optimal (stretched but not overwhelmed)', value: 5 },
      { text: 'Overload (too much, unsustainable)', value: 2 },
      { text: 'Burnout (exhausted, cynical, ineffective)', value: 1 },
      { text: 'I don\'t know', value: 1 }
    ]
  },
  {
    id: 29,
    territory: 'yourself',
    subdimension: 'Stress Design',
    question: 'Can you intentionally adjust your stress level (dial it up or down)?',
    options: [
      { text: 'No - I\'m at the mercy of circumstances', value: 1 },
      { text: 'Rarely - I don\'t know how', value: 2 },
      { text: 'Sometimes - with effort', value: 3 },
      { text: 'Often - I have tools for this', value: 4 },
      { text: 'Always - I design stress strategically', value: 5 }
    ]
  },
  {
    id: 30,
    territory: 'yourself',
    subdimension: 'Stress Design',
    question: 'Do you know your early warning signs of burnout?',
    options: [
      { text: 'No - I usually crash without warning', value: 1 },
      { text: 'Vaguely - I notice when it\'s too late', value: 2 },
      { text: 'Yes - I can name 2-3 signals', value: 3 },
      { text: 'Yes - I track them actively', value: 4 },
      { text: 'Yes - and I adjust before hitting burnout', value: 5 }
    ]
  },
  {
    id: 31,
    territory: 'yourself',
    subdimension: 'Stress Design',
    question: 'How well do you balance fast thinking (reactive, intuitive) and slow thinking (deliberate, analytical)?',
    options: [
      { text: 'All fast - I\'m constantly reactive', value: 1 },
      { text: 'Mostly fast with occasional slow', value: 2 },
      { text: '50/50 - depends on the situation', value: 3 },
      { text: 'I intentionally choose based on context', value: 4 },
      { text: 'I design my environment to support both modes', value: 5 }
    ]
  },
  {
    id: 32,
    territory: 'yourself',
    subdimension: 'Stress Design',
    question: 'What is your time horizon - how far ahead do you think?',
    options: [
      { text: 'Today/this week (survival mode)', value: 1 },
      { text: 'This month/quarter (operational)', value: 2 },
      { text: 'This year (tactical)', value: 3 },
      { text: '1-3 years (strategic)', value: 4 },
      { text: '3-10+ years (visionary)', value: 5 }
    ]
  },

  // ============================================
  // TERRITORY 2: LEADING TEAMS (35 questions)
  // ============================================

  // 2.1 TRUST FORMULA (6 questions)
  {
    id: 33,
    territory: 'teams',
    subdimension: 'Trust Formula',
    question: 'Do your team members believe you know what you\'re talking about (credibility)?',
    options: [
      { text: 'No - they question my expertise regularly', value: 1 },
      { text: 'Sometimes - in some areas but not others', value: 2 },
      { text: 'Mostly - in most areas', value: 3 },
      { text: 'Yes - they trust my judgment', value: 4 },
      { text: 'Yes - and I\'m honest when I don\'t know', value: 5 }
    ]
  },
  {
    id: 34,
    territory: 'teams',
    subdimension: 'Trust Formula',
    question: 'How often do you keep your commitments?',
    options: [
      { text: 'Less than 50% - I overcommit', value: 1 },
      { text: '50-70% - I try but often miss', value: 2 },
      { text: '70-85% - most of the time', value: 3 },
      { text: '85-95% - almost always', value: 4 },
      { text: '95%+ or I renegotiate early', value: 5 }
    ]
  },
  {
    id: 35,
    territory: 'teams',
    subdimension: 'Trust Formula',
    question: 'Do you track your commitments to others?',
    options: [
      { text: 'No - I rely on memory', value: 1 },
      { text: 'Sometimes - in email or notes', value: 2 },
      { text: 'Yes - I have a system but don\'t always use it', value: 3 },
      { text: 'Yes - I track them systematically', value: 4 },
      { text: 'Yes - and I review them weekly', value: 5 }
    ]
  },
  {
    id: 36,
    territory: 'teams',
    subdimension: 'Trust Formula',
    question: 'Do people feel emotionally safe with you (intimacy)?',
    options: [
      { text: 'No - people are guarded around me', value: 1 },
      { text: 'Rarely - only a few people open up', value: 2 },
      { text: 'Sometimes - with effort', value: 3 },
      { text: 'Often - most people feel safe', value: 4 },
      { text: 'Always - people bring me their real problems', value: 5 }
    ]
  },
  {
    id: 37,
    territory: 'teams',
    subdimension: 'Trust Formula',
    question: 'When making decisions, do you default to team-first or self-first?',
    options: [
      { text: 'Always self-first - I protect my interests', value: 1 },
      { text: 'Mostly self-first with some team consideration', value: 2 },
      { text: '50/50 - depends on the situation', value: 3 },
      { text: 'Mostly team-first', value: 4 },
      { text: 'Always team-first - I sacrifice for the team', value: 5 }
    ]
  },
  {
    id: 38,
    territory: 'teams',
    subdimension: 'Trust Formula',
    question: 'How often do you say "I don\'t know" in front of your team?',
    options: [
      { text: 'Never - I must have all the answers', value: 1 },
      { text: 'Rarely - only when absolutely necessary', value: 2 },
      { text: 'Sometimes - a few times a month', value: 3 },
      { text: 'Often - weekly', value: 4 },
      { text: 'Regularly - I model intellectual humility', value: 5 }
    ]
  },

  // 2.2 PSYCHOLOGICAL SAFETY (6 questions)
  {
    id: 39,
    territory: 'teams',
    subdimension: 'Psychological Safety',
    question: 'How long does it take for bad news to reach you?',
    options: [
      { text: 'Weeks or never - I find out through back channels', value: 1 },
      { text: 'Several days - people are hesitant', value: 2 },
      { text: 'Within 24-48 hours', value: 3 },
      { text: 'Within hours - same day', value: 4 },
      { text: 'Immediately - people seek me out first', value: 5 }
    ]
  },
  {
    id: 40,
    territory: 'teams',
    subdimension: 'Psychological Safety',
    question: 'When bad news arrives, how do you respond?',
    options: [
      { text: 'Shoot the messenger - people regret telling me', value: 1 },
      { text: 'Visibly upset - people see me react negatively', value: 2 },
      { text: 'Neutral - I don\'t react visibly', value: 3 },
      { text: 'Appreciate it - I thank them for telling me', value: 4 },
      { text: 'Reward it - I explicitly celebrate truth-telling', value: 5 }
    ]
  },
  {
    id: 41,
    territory: 'teams',
    subdimension: 'Psychological Safety',
    question: 'Can people disagree with you in meetings?',
    options: [
      { text: 'No - disagreement is seen as disloyalty', value: 1 },
      { text: 'Rarely - people are nervous to push back', value: 2 },
      { text: 'Sometimes - with the right people', value: 3 },
      { text: 'Often - I invite dissenting views', value: 4 },
      { text: 'Always - I explicitly ask "Who disagrees?"', value: 5 }
    ]
  },
  {
    id: 42,
    territory: 'teams',
    subdimension: 'Psychological Safety',
    question: 'When someone makes a mistake, do you blame or learn?',
    options: [
      { text: 'Always blame - "Who screwed up?"', value: 1 },
      { text: 'Mostly blame with some learning', value: 2 },
      { text: '50/50 - depends on severity', value: 3 },
      { text: 'Mostly learn - "What can we learn?"', value: 4 },
      { text: 'Always learn - mistakes are celebrated as data', value: 5 }
    ]
  },
  {
    id: 43,
    territory: 'teams',
    subdimension: 'Psychological Safety',
    question: 'Do you have a 360-degree feedback system in place?',
    options: [
      { text: 'No - I don\'t want feedback from below', value: 1 },
      { text: 'No - but I\'ve thought about it', value: 2 },
      { text: 'Informally - I ask for feedback sometimes', value: 3 },
      { text: 'Yes - annual 360 reviews', value: 4 },
      { text: 'Yes - continuous feedback culture', value: 5 }
    ]
  },
  {
    id: 44,
    territory: 'teams',
    subdimension: 'Psychological Safety',
    question: 'When someone is struggling, do you show idiot compassion (enable) or wise compassion (support + accountability)?',
    options: [
      { text: 'Idiot compassion - I rescue and enable', value: 1 },
      { text: 'Mostly idiot - I avoid hard conversations', value: 2 },
      { text: 'Mixed - sometimes wise, sometimes idiot', value: 3 },
      { text: 'Mostly wise - I hold them accountable with care', value: 4 },
      { text: 'Always wise - I support AND challenge', value: 5 }
    ]
  },

  // 2.3 MULTIPLIER BEHAVIOR (6 questions)
  {
    id: 45,
    territory: 'teams',
    subdimension: 'Multiplier Behavior',
    question: 'In meetings, do you ask more questions or give more answers?',
    options: [
      { text: 'All answers - I\'m the expert', value: 1 },
      { text: 'Mostly answers - 70/30', value: 2 },
      { text: 'Balanced - 50/50', value: 3 },
      { text: 'Mostly questions - 70/30', value: 4 },
      { text: 'All questions - I expand their thinking', value: 5 }
    ]
  },
  {
    id: 46,
    territory: 'teams',
    subdimension: 'Multiplier Behavior',
    question: 'Do A-players want to work for you (talent magnet)?',
    options: [
      { text: 'No - top talent leaves', value: 1 },
      { text: 'Rarely - we struggle to attract top talent', value: 2 },
      { text: 'Sometimes - we get some good people', value: 3 },
      { text: 'Often - top talent seeks us out', value: 4 },
      { text: 'Always - we have a waitlist of A-players', value: 5 }
    ]
  },
  {
    id: 47,
    territory: 'teams',
    subdimension: 'Multiplier Behavior',
    question: 'Do you require people\'s best thinking or accept mediocrity (liberator)?',
    options: [
      { text: 'Diminisher - I tell them what to think', value: 1 },
      { text: 'Mostly diminisher - I dominate conversations', value: 2 },
      { text: 'Mixed - depends on the person', value: 3 },
      { text: 'Mostly liberator - I create space for thinking', value: 4 },
      { text: 'Full liberator - I demand their best thinking', value: 5 }
    ]
  },
  {
    id: 48,
    territory: 'teams',
    subdimension: 'Multiplier Behavior',
    question: 'Do you stretch people beyond their comfort zone (challenger)?',
    options: [
      { text: 'Never - I protect them from hard things', value: 1 },
      { text: 'Rarely - only when necessary', value: 2 },
      { text: 'Sometimes - for key people', value: 3 },
      { text: 'Often - I give challenging assignments', value: 4 },
      { text: 'Always - I believe in them more than they do', value: 5 }
    ]
  },
  {
    id: 49,
    territory: 'teams',
    subdimension: 'Multiplier Behavior',
    question: 'Do you foster healthy debate or make decisions unilaterally (debate maker)?',
    options: [
      { text: 'Always unilateral - my way or highway', value: 1 },
      { text: 'Mostly unilateral - I listen but decide alone', value: 2 },
      { text: 'Some debate but I ultimately decide', value: 3 },
      { text: 'Healthy debate - I facilitate rigorous discussion', value: 4 },
      { text: 'Full debate - best idea wins regardless of source', value: 5 }
    ]
  },
  {
    id: 50,
    territory: 'teams',
    subdimension: 'Multiplier Behavior',
    question: 'Do you instill ownership or do people wait for your direction (investor)?',
    options: [
      { text: 'Full micromanager - they wait for my direction', value: 1 },
      { text: 'Mostly micromanage - I check everything', value: 2 },
      { text: 'Mixed - some ownership, some direction', value: 3 },
      { text: 'Mostly investor - they own their domains', value: 4 },
      { text: 'Full investor - they act like owners', value: 5 }
    ]
  },

  // 2.4 COMMUNICATION RHYTHM (6 questions)
  {
    id: 51,
    territory: 'teams',
    subdimension: 'Communication Rhythm',
    question: 'Do you have a daily check-in with your leadership team?',
    options: [
      { text: 'No - we connect ad hoc', value: 1 },
      { text: 'Rarely - a few times a week', value: 2 },
      { text: 'Sometimes - most days', value: 3 },
      { text: 'Yes - every day, 15 minutes', value: 4 },
      { text: 'Yes - sacred daily ritual', value: 5 }
    ]
  },
  {
    id: 52,
    territory: 'teams',
    subdimension: 'Communication Rhythm',
    question: 'Do you have a weekly tactical meeting (90 min, agenda-driven)?',
    options: [
      { text: 'No weekly meeting', value: 1 },
      { text: 'Yes but irregular and ineffective', value: 2 },
      { text: 'Yes but often cancelled or rushed', value: 3 },
      { text: 'Yes - consistent and structured', value: 4 },
      { text: 'Yes - locked in, highly effective', value: 5 }
    ]
  },
  {
    id: 53,
    territory: 'teams',
    subdimension: 'Communication Rhythm',
    question: 'Do you have a monthly strategic meeting (half-day, one topic deep-dive)?',
    options: [
      { text: 'No', value: 1 },
      { text: 'We try but it doesn\'t happen', value: 2 },
      { text: 'Sometimes - every 2-3 months', value: 3 },
      { text: 'Yes - monthly', value: 4 },
      { text: 'Yes - sacred and productive', value: 5 }
    ]
  },
  {
    id: 54,
    territory: 'teams',
    subdimension: 'Communication Rhythm',
    question: 'Do you have quarterly offsites (2-3 days, strategy + team building)?',
    options: [
      { text: 'No - never done one', value: 1 },
      { text: 'We did one once', value: 2 },
      { text: 'Sometimes - every 6-12 months', value: 3 },
      { text: 'Yes - every quarter', value: 4 },
      { text: 'Yes - essential rhythm', value: 5 }
    ]
  },
  {
    id: 55,
    territory: 'teams',
    subdimension: 'Communication Rhythm',
    question: 'How comfortable are you having difficult conversations?',
    options: [
      { text: 'I avoid them at all costs', value: 1 },
      { text: 'Very uncomfortable - I delay as long as possible', value: 2 },
      { text: 'Uncomfortable but I do them', value: 3 },
      { text: 'Comfortable - I have them promptly', value: 4 },
      { text: 'Seek them out - I use NVC or similar framework', value: 5 }
    ]
  },
  {
    id: 56,
    territory: 'teams',
    subdimension: 'Communication Rhythm',
    question: 'How often do you repeat the company vision to your team?',
    options: [
      { text: 'Rarely - maybe once a year', value: 1 },
      { text: 'A few times a year', value: 2 },
      { text: 'Monthly', value: 3 },
      { text: 'Weekly', value: 4 },
      { text: 'Every meeting - it\'s relentless', value: 5 }
    ]
  },

  // 2.5 TEAM HEALTH (6 questions)
  {
    id: 57,
    territory: 'teams',
    subdimension: 'Team Health',
    question: 'Does your leadership team have vulnerability-based trust?',
    options: [
      { text: 'No - we\'re guarded and political', value: 1 },
      { text: 'Rarely - occasional openness', value: 2 },
      { text: 'Sometimes - with some people', value: 3 },
      { text: 'Often - most people are vulnerable', value: 4 },
      { text: 'Yes - we share weaknesses openly', value: 5 }
    ]
  },
  {
    id: 58,
    territory: 'teams',
    subdimension: 'Team Health',
    question: 'Does your team engage in healthy conflict or maintain artificial harmony?',
    options: [
      { text: 'Artificial harmony - we avoid all conflict', value: 1 },
      { text: 'Mostly harmony - conflict is rare', value: 2 },
      { text: 'Some conflict but uncomfortable', value: 3 },
      { text: 'Regular healthy conflict', value: 4 },
      { text: 'Passionate debates - best idea wins', value: 5 }
    ]
  },
  {
    id: 59,
    territory: 'teams',
    subdimension: 'Team Health',
    question: 'After decisions are made, does the team commit fully (even if they disagreed)?',
    options: [
      { text: 'No - people undermine decisions', value: 1 },
      { text: 'Rarely - passive resistance', value: 2 },
      { text: 'Sometimes - depends on the decision', value: 3 },
      { text: 'Often - most people commit', value: 4 },
      { text: 'Always - disagree and commit', value: 5 }
    ]
  },
  {
    id: 60,
    territory: 'teams',
    subdimension: 'Team Health',
    question: 'Do team members hold each other accountable or wait for you to do it?',
    options: [
      { text: 'No peer accountability - I\'m the only one', value: 1 },
      { text: 'Rare peer accountability', value: 2 },
      { text: 'Some peer accountability', value: 3 },
      { text: 'Regular peer accountability', value: 4 },
      { text: 'Full peer accountability - they police themselves', value: 5 }
    ]
  },
  {
    id: 61,
    territory: 'teams',
    subdimension: 'Team Health',
    question: 'Do team members prioritize team results over individual results?',
    options: [
      { text: 'No - everyone protects their turf', value: 1 },
      { text: 'Rarely - silos are strong', value: 2 },
      { text: 'Sometimes - depends on the situation', value: 3 },
      { text: 'Often - team-first mentality', value: 4 },
      { text: 'Always - we win or lose as a team', value: 5 }
    ]
  },
  {
    id: 62,
    territory: 'teams',
    subdimension: 'Team Health',
    question: 'Is your leadership team your "first team" (higher loyalty than their functional teams)?',
    options: [
      { text: 'No - they see themselves as department heads', value: 1 },
      { text: 'Rarely - functional loyalty dominates', value: 2 },
      { text: 'Sometimes - situational', value: 3 },
      { text: 'Often - leadership team is primary', value: 4 },
      { text: 'Always - leadership team comes first', value: 5 }
    ]
  },

  // 2.6 ACCOUNTABILITY & DELEGATION (5 questions)
  {
    id: 63,
    territory: 'teams',
    subdimension: 'Accountability & Delegation',
    question: 'What percentage of decisions require your final approval?',
    options: [
      { text: '80%+ (I\'m the bottleneck)', value: 1 },
      { text: '60-80% (I\'m involved in most)', value: 2 },
      { text: '40-60% (shared ownership)', value: 3 },
      { text: '20-40% (team owns most)', value: 4 },
      { text: '<20% (team is fully empowered)', value: 5 }
    ]
  },
  {
    id: 64,
    territory: 'teams',
    subdimension: 'Accountability & Delegation',
    question: 'When someone on your team struggles, do you rescue them or coach them through it?',
    options: [
      { text: 'Always rescue - I take it over', value: 1 },
      { text: 'Usually rescue - I can\'t help myself', value: 2 },
      { text: 'Sometimes rescue, sometimes coach', value: 3 },
      { text: 'Usually coach - I support but don\'t do', value: 4 },
      { text: 'Always coach - struggle builds capability', value: 5 }
    ]
  },
  {
    id: 65,
    territory: 'teams',
    subdimension: 'Accountability & Delegation',
    question: 'When you delegate, is ownership crystal clear or ambiguous?',
    options: [
      { text: 'Always ambiguous - people are confused', value: 1 },
      { text: 'Often ambiguous - overlap and gaps', value: 2 },
      { text: 'Sometimes clear, sometimes fuzzy', value: 3 },
      { text: 'Usually clear - defined ownership', value: 4 },
      { text: 'Always clear - no ambiguity', value: 5 }
    ]
  },
  {
    id: 66,
    territory: 'teams',
    subdimension: 'Accountability & Delegation',
    question: 'Do you have the right people in the right seats?',
    options: [
      { text: 'No - major mismatches', value: 1 },
      { text: 'Some people are in wrong seats', value: 2 },
      { text: 'Mostly right but some adjustments needed', value: 3 },
      { text: 'Yes - good fit across the board', value: 4 },
      { text: 'Yes - exceptional fit, people in their genius', value: 5 }
    ]
  },
  {
    id: 67,
    territory: 'teams',
    subdimension: 'Accountability & Delegation',
    question: 'How often do you give feedback to your team?',
    options: [
      { text: 'Annual reviews only', value: 1 },
      { text: 'Quarterly', value: 2 },
      { text: 'Monthly', value: 3 },
      { text: 'Weekly', value: 4 },
      { text: 'Continuous real-time feedback', value: 5 }
    ]
  },

  // ============================================
  // TERRITORY 3: LEADING ORGANIZATIONS (33 questions)
  // ============================================

  // 3.1 STRATEGIC CLARITY (6 questions)
  {
    id: 68,
    territory: 'organizations',
    subdimension: 'Strategic Clarity',
    question: 'Can you articulate your mission in one sentence?',
    options: [
      { text: 'No - it\'s fuzzy', value: 1 },
      { text: 'Sort of - it takes a paragraph', value: 2 },
      { text: 'Yes but it\'s not compelling', value: 3 },
      { text: 'Yes - clear and compelling', value: 4 },
      { text: 'Yes - everyone can repeat it', value: 5 }
    ]
  },
  {
    id: 69,
    territory: 'organizations',
    subdimension: 'Strategic Clarity',
    question: 'Can you clearly define who your customer is?',
    options: [
      { text: 'No - we serve everyone', value: 1 },
      { text: 'Vaguely - "small businesses" or similar', value: 2 },
      { text: 'Yes - defined but broad', value: 3 },
      { text: 'Yes - specific ICP defined', value: 4 },
      { text: 'Yes - razor-sharp focus', value: 5 }
    ]
  },
  {
    id: 70,
    territory: 'organizations',
    subdimension: 'Strategic Clarity',
    question: 'Do you know what your customer values most?',
    options: [
      { text: 'No idea', value: 1 },
      { text: 'Vague sense', value: 2 },
      { text: 'We think we know', value: 3 },
      { text: 'Yes - validated through research', value: 4 },
      { text: 'Yes - we measure it continuously', value: 5 }
    ]
  },
  {
    id: 71,
    territory: 'organizations',
    subdimension: 'Strategic Clarity',
    question: 'How do you measure success as an organization?',
    options: [
      { text: 'We don\'t - no clear metrics', value: 1 },
      { text: 'Revenue only', value: 2 },
      { text: 'A few metrics but not aligned', value: 3 },
      { text: 'Clear KPIs across the org', value: 4 },
      { text: 'Aligned metrics everyone tracks daily', value: 5 }
    ]
  },
  {
    id: 72,
    territory: 'organizations',
    subdimension: 'Strategic Clarity',
    question: 'How many strategic priorities do you have?',
    options: [
      { text: '10+ (everything is a priority)', value: 1 },
      { text: '5-10 (too many)', value: 2 },
      { text: '3-5 (reasonable)', value: 3 },
      { text: '1-3 (focused)', value: 4 },
      { text: '1 (ruthlessly focused)', value: 5 }
    ]
  },
  {
    id: 73,
    territory: 'organizations',
    subdimension: 'Strategic Clarity',
    question: 'Which strategy traps are you falling into?',
    options: [
      { text: 'Don\'t know what strategy traps are', value: 1 },
      { text: 'Know them but don\'t see ours', value: 2 },
      { text: 'We\'re falling into 3+ traps', value: 3 },
      { text: 'We\'re falling into 1-2 traps', value: 4 },
      { text: 'We actively avoid all major traps', value: 5 }
    ]
  },

  // 3.2 CULTURE AS SYSTEM (6 questions)
  {
    id: 74,
    territory: 'organizations',
    subdimension: 'Culture as System',
    question: 'What type of culture do you have?',
    options: [
      { text: 'No idea', value: 1 },
      { text: 'Vague sense', value: 2 },
      { text: 'Caring / Apathetic / Driver / Inclusive - not sure which', value: 3 },
      { text: 'I can name our dominant culture type', value: 4 },
      { text: 'I know our culture and it\'s intentional', value: 5 }
    ]
  },
  {
    id: 75,
    territory: 'organizations',
    subdimension: 'Culture as System',
    question: 'Is your culture designed intentionally or accidental?',
    options: [
      { text: 'Totally accidental - it just happened', value: 1 },
      { text: 'Mostly accidental - we have values on wall', value: 2 },
      { text: 'Partially designed - working on it', value: 3 },
      { text: 'Mostly designed - clear intentions', value: 4 },
      { text: 'Fully designed - systematic culture work', value: 5 }
    ]
  },
  {
    id: 76,
    territory: 'organizations',
    subdimension: 'Culture as System',
    question: 'Can you name 3 specific behaviors that are rewarded and 3 that are not tolerated?',
    options: [
      { text: 'No - it\'s all implicit', value: 1 },
      { text: 'I could name 1-2', value: 2 },
      { text: 'I could name 3-4', value: 3 },
      { text: 'Yes - all 6 are clear to me', value: 4 },
      { text: 'Yes - and everyone on the team can name them', value: 5 }
    ]
  },
  {
    id: 77,
    territory: 'organizations',
    subdimension: 'Culture as System',
    question: 'Do you have a growth mindset culture or genius/fixed mindset culture?',
    options: [
      { text: 'Fixed mindset - talent is everything', value: 1 },
      { text: 'Mostly fixed - some growth talk', value: 2 },
      { text: 'Mixed - inconsistent', value: 3 },
      { text: 'Mostly growth - we value learning', value: 4 },
      { text: 'Full growth - failure is learning', value: 5 }
    ]
  },
  {
    id: 78,
    territory: 'organizations',
    subdimension: 'Culture as System',
    question: 'Do you hire and fire based on culture fit?',
    options: [
      { text: 'No - we hire for skills only', value: 1 },
      { text: 'Rarely - culture is secondary', value: 2 },
      { text: 'Sometimes - we consider it', value: 3 },
      { text: 'Often - culture is important filter', value: 4 },
      { text: 'Always - culture fit is non-negotiable', value: 5 }
    ]
  },
  {
    id: 79,
    territory: 'organizations',
    subdimension: 'Culture as System',
    question: 'Do your stated values match daily behavior?',
    options: [
      { text: 'No - values on wall don\'t match reality', value: 1 },
      { text: 'Rarely - big gap between words and actions', value: 2 },
      { text: 'Sometimes - inconsistent', value: 3 },
      { text: 'Mostly - behavior matches values', value: 4 },
      { text: 'Yes - perfect alignment', value: 5 }
    ]
  },

  // 3.3 THREE TRANSITIONS (6 questions)
  {
    id: 80,
    territory: 'organizations',
    subdimension: 'Three Transitions',
    question: 'Which of the three transitions are you currently in?',
    options: [
      { text: 'Don\'t know the three transitions', value: 1 },
      { text: 'Know them but unsure where I am', value: 2 },
      { text: 'Founder to Leadership Team', value: 3 },
      { text: 'Expert to Generalist', value: 3 },
      { text: 'Product to Organization', value: 3 },
      { text: 'I\'ve completed all three', value: 5 }
    ]
  },
  {
    id: 81,
    territory: 'organizations',
    subdimension: 'Three Transitions',
    question: 'Does your leadership team lead, or do you still lead everything?',
    options: [
      { text: 'I lead everything - no real leadership team', value: 1 },
      { text: 'I lead most things - they execute', value: 2 },
      { text: '50/50 - shared leadership', value: 3 },
      { text: 'They lead most things - I support', value: 4 },
      { text: 'They fully lead - I architect', value: 5 }
    ]
  },
  {
    id: 82,
    territory: 'organizations',
    subdimension: 'Three Transitions',
    question: 'Are you still the smartest person in the room or the conductor?',
    options: [
      { text: 'I\'m the expert - I have all answers', value: 1 },
      { text: 'I\'m usually the smartest in the room', value: 2 },
      { text: 'I\'m smart in some areas, others in others', value: 3 },
      { text: 'Others are smarter - I connect dots', value: 4 },
      { text: 'I\'m the conductor - I elevate everyone', value: 5 }
    ]
  },
  {
    id: 83,
    territory: 'organizations',
    subdimension: 'Three Transitions',
    question: 'What percentage of your time do you work ON the business vs IN the business?',
    options: [
      { text: '80% IN, 20% ON (I\'m an operator)', value: 1 },
      { text: '60% IN, 40% ON (transitioning)', value: 2 },
      { text: '50% IN, 50% ON (balanced)', value: 3 },
      { text: '40% IN, 60% ON (leading)', value: 4 },
      { text: '20% IN, 80% ON (architecting)', value: 5 }
    ]
  },
  {
    id: 84,
    territory: 'organizations',
    subdimension: 'Three Transitions',
    question: 'Which "death" are you experiencing (Competence, Connection, or Self)?',
    options: [
      { text: 'Don\'t know the three deaths', value: 1 },
      { text: 'Know them but not sure which I\'m in', value: 2 },
      { text: 'Death of Competence (no longer the expert)', value: 3 },
      { text: 'Death of Connection (can\'t be close with everyone)', value: 3 },
      { text: 'Death of Self (who am I without this role?)', value: 3 },
      { text: 'I\'ve integrated all three', value: 5 }
    ]
  },
  {
    id: 85,
    territory: 'organizations',
    subdimension: 'Three Transitions',
    question: 'Are you clear on what only the CEO can do vs what others should do?',
    options: [
      { text: 'No - I do everything', value: 1 },
      { text: 'Vaguely - lots of overlap', value: 2 },
      { text: 'Somewhat - working on boundaries', value: 3 },
      { text: 'Mostly clear - defined CEO role', value: 4 },
      { text: 'Crystal clear - I only do CEO work', value: 5 }
    ]
  },

  // 3.4 SYSTEMS THINKING (5 questions)
  {
    id: 86,
    territory: 'organizations',
    subdimension: 'Systems Thinking',
    question: 'When diagnosing problems, do you look at mindset, leadership, culture, or process?',
    options: [
      { text: 'Only process - "fix the workflow"', value: 1 },
      { text: 'Mostly process with some leadership', value: 2 },
      { text: 'Process and leadership', value: 3 },
      { text: 'Leadership, culture, and process', value: 4 },
      { text: 'All four layers - mindset to process', value: 5 }
    ]
  },
  {
    id: 87,
    territory: 'organizations',
    subdimension: 'Systems Thinking',
    question: 'When problems repeat, do you see isolated incidents or systemic patterns?',
    options: [
      { text: 'Everything feels random', value: 1 },
      { text: 'I see incidents', value: 2 },
      { text: 'Starting to see some patterns', value: 3 },
      { text: 'I see patterns clearly', value: 4 },
      { text: 'I diagnose root systems', value: 5 }
    ]
  },
  {
    id: 88,
    territory: 'organizations',
    subdimension: 'Systems Thinking',
    question: 'Do you understand the layers of risk in your business (onion theory)?',
    options: [
      { text: 'Don\'t know onion theory', value: 1 },
      { text: 'Know it but don\'t apply it', value: 2 },
      { text: 'I see some layers', value: 3 },
      { text: 'I see most layers clearly', value: 4 },
      { text: 'I actively manage all risk layers', value: 5 }
    ]
  },
  {
    id: 89,
    territory: 'organizations',
    subdimension: 'Systems Thinking',
    question: 'How do you balance exploit (efficiency) and explore (innovation)?',
    options: [
      { text: 'All exploit - no innovation', value: 1 },
      { text: 'Mostly exploit (80/20)', value: 2 },
      { text: 'Somewhat balanced (60/40)', value: 3 },
      { text: 'Well balanced (70/30 exploit/explore)', value: 4 },
      { text: 'Ambidextrous - separate teams for each', value: 5 }
    ]
  },
  {
    id: 90,
    territory: 'organizations',
    subdimension: 'Systems Thinking',
    question: 'Do you know your flywheel (compounding loops that drive growth)?',
    options: [
      { text: 'Don\'t know what a flywheel is', value: 1 },
      { text: 'Know what it is but haven\'t defined ours', value: 2 },
      { text: 'We have a vague sense', value: 3 },
      { text: 'Yes - clearly defined', value: 4 },
      { text: 'Yes - and we optimize it actively', value: 5 }
    ]
  },

  // 3.5 ORGANIZATIONAL DESIGN (5 questions)
  {
    id: 91,
    territory: 'organizations',
    subdimension: 'Organizational Design',
    question: 'Do you know which organizational model you\'re running?',
    options: [
      { text: 'No idea - we\'re winging it', value: 1 },
      { text: 'Vague sense', value: 2 },
      { text: 'Yes - functional / divisional / matrix / network / holacracy', value: 3 },
      { text: 'Yes - and it\'s intentional', value: 4 },
      { text: 'Yes - and we evolve it as we scale', value: 5 }
    ]
  },
  {
    id: 92,
    territory: 'organizations',
    subdimension: 'Organizational Design',
    question: 'Does your organizational model fit your company DNA?',
    options: [
      { text: 'No - major mismatch', value: 1 },
      { text: 'Poor fit - causing friction', value: 2 },
      { text: 'Okay fit - some alignment', value: 3 },
      { text: 'Good fit - mostly aligned', value: 4 },
      { text: 'Perfect fit - structure enables strategy', value: 5 }
    ]
  },
  {
    id: 93,
    territory: 'organizations',
    subdimension: 'Organizational Design',
    question: 'Are you clear on the three levels (Communication, Unification, Operations)?',
    options: [
      { text: 'Don\'t know what that means', value: 1 },
      { text: 'Know it but not applied', value: 2 },
      { text: 'Partially clear', value: 3 },
      { text: 'Clear - we have all three', value: 4 },
      { text: 'Crystal clear - all three levels work', value: 5 }
    ]
  },
  {
    id: 94,
    territory: 'organizations',
    subdimension: 'Organizational Design',
    question: 'Do you have a separate structure for innovation?',
    options: [
      { text: 'No - no innovation happening', value: 1 },
      { text: 'No - innovation is everyone\'s job (so no one\'s)', value: 2 },
      { text: 'Partially - some skunkworks projects', value: 3 },
      { text: 'Yes - dedicated innovation team', value: 4 },
      { text: 'Yes - ambidextrous design with clear boundaries', value: 5 }
    ]
  },
  {
    id: 95,
    territory: 'organizations',
    subdimension: 'Organizational Design',
    question: 'Is your structure ready for your next stage of growth?',
    options: [
      { text: 'No - we\'ll break at current size', value: 1 },
      { text: 'No - major redesign needed', value: 2 },
      { text: 'Partially - some adjustments needed', value: 3 },
      { text: 'Mostly - minor tweaks needed', value: 4 },
      { text: 'Yes - built to scale 2-3x', value: 5 }
    ]
  },

  // 3.6 BOARD & GOVERNANCE (5 questions)
  {
    id: 96,
    territory: 'organizations',
    subdimension: 'Board & Governance',
    question: 'Is your board an asset or a liability?',
    options: [
      { text: 'Major liability - they block progress', value: 1 },
      { text: 'Minor liability - more burden than help', value: 2 },
      { text: 'Neutral - neither help nor hinder', value: 3 },
      { text: 'Asset - they provide real value', value: 4 },
      { text: 'Major asset - I couldn\'t do this without them', value: 5 }
    ]
  },
  {
    id: 97,
    territory: 'organizations',
    subdimension: 'Board & Governance',
    question: 'What is your relationship with your board like?',
    options: [
      { text: 'Adversarial - we don\'t trust each other', value: 1 },
      { text: 'Transactional - minimum required interaction', value: 2 },
      { text: 'Professional - respectful but distant', value: 3 },
      { text: 'Collaborative - we work well together', value: 4 },
      { text: 'Partnership - high trust, strategic allies', value: 5 }
    ]
  },
  {
    id: 98,
    territory: 'organizations',
    subdimension: 'Board & Governance',
    question: 'Do you use your board strategically or just report to them?',
    options: [
      { text: 'Just report - they\'re a checkbox', value: 1 },
      { text: 'Mostly report - occasional advice', value: 2 },
      { text: 'Some strategic use - for big decisions', value: 3 },
      { text: 'Often strategic - I leverage their expertise', value: 4 },
      { text: 'Always strategic - they\'re my secret weapon', value: 5 }
    ]
  },
  {
    id: 99,
    territory: 'organizations',
    subdimension: 'Board & Governance',
    question: 'Are decision rights clear (what board decides vs what you decide)?',
    options: [
      { text: 'No - constant confusion', value: 1 },
      { text: 'Mostly unclear - frequent overreach', value: 2 },
      { text: 'Somewhat clear - some grey areas', value: 3 },
      { text: 'Mostly clear - rare confusion', value: 4 },
      { text: 'Crystal clear - perfect governance', value: 5 }
    ]
  },
  {
    id: 100,
    territory: 'organizations',
    subdimension: 'Board & Governance',
    question: 'Are your key stakeholders aligned (investors, board, leadership team)?',
    options: [
      { text: 'No - major misalignment', value: 1 },
      { text: 'Rarely aligned - lots of friction', value: 2 },
      { text: 'Sometimes aligned - depends on issue', value: 3 },
      { text: 'Mostly aligned - shared vision', value: 4 },
      { text: 'Fully aligned - everyone pulling same direction', value: 5 }
    ]
  }
]
