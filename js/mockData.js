/**
 * CEO Lab Dashboard - Mock Data
 * All mock data for Phase 1 development
 * This file will be replaced with Supabase calls in Phase 2
 */

export const mockData = {
  // ============================================
  // USER PROFILE
  // ============================================
  user: {
    id: 'user-001',
    firstName: 'Sarah',
    lastName: 'Chen',
    email: 'sarah.chen@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Sarah+Chen&background=7FABC8&color=fff&size=80',
    joinedDate: '2024-12-01',
    preferences: {
      emailNotifications: true,
      theme: 'dark',
      language: 'en'
    },
    stats: {
      currentStreak: 7,
      longestStreak: 14,
      totalSessions: 28,
      totalTimeMinutes: 645,
      assessmentsCompleted: 3,
      frameworksCompleted: 12,
      frameworksTotal: 60
    }
  },

  // ============================================
  // ASSESSMENTS
  // ============================================
  assessments: [
    {
      id: 'zone-of-genius',
      name: 'Zone of Genius',
      pillar: 'self',
      color: '#7FABC8',
      icon: '💎',
      description: 'Discover where your unique talents and passions intersect for maximum impact',
      estimatedMinutes: 8,
      sections: [
        {
          id: 'section-1',
          name: 'Skills & Competence',
          questions: [
            'I am highly skilled in this area and could teach others',
            'I learn new things in this area quickly and easily',
            'Others often ask for my help in this area',
            'I feel confident taking on complex challenges here',
            'I consistently produce excellent results in this area'
          ]
        },
        {
          id: 'section-2',
          name: 'Energy & Passion',
          questions: [
            'I lose track of time when working in this area',
            'I feel energized rather than drained by this work',
            'I would do this even if I wasn\'t paid',
            'I find myself thinking about this outside of work',
            'I seek out opportunities to engage in this area'
          ]
        },
        {
          id: 'section-3',
          name: 'Value & Impact',
          questions: [
            'This work creates meaningful value for others',
            'People are willing to pay for my expertise here',
            'My contributions in this area are recognized and appreciated',
            'I can clearly see the impact of my work',
            'This aligns with my personal values and purpose'
          ]
        }
      ],
      resultTemplate: {
        zones: ['Competence', 'Excellence', 'Passion', 'Genius'],
        interpretations: {
          genius: 'This is your Zone of Genius - where skill, passion, and value intersect',
          passion: 'Zone of Passion - you love it, but may need to develop more skills',
          excellence: 'Zone of Excellence - you\'re great at it, but it may drain you',
          competence: 'Zone of Competence - capable but not energizing or unique'
        }
      }
    },
    {
      id: 'five-drivers',
      name: 'Five Drivers',
      pillar: 'self',
      color: '#A6BEA4',
      icon: '⚡',
      description: 'Understand the core motivations that drive your leadership decisions',
      estimatedMinutes: 12,
      sections: [
        {
          id: 'achievement',
          name: 'Achievement',
          questions: [
            'I set ambitious goals and strive to exceed them',
            'I measure success by tangible results and outcomes',
            'I feel most satisfied when accomplishing difficult tasks'
          ]
        },
        {
          id: 'autonomy',
          name: 'Autonomy',
          questions: [
            'I prefer having control over how I work',
            'I value independence in decision-making',
            'I thrive when given freedom and flexibility'
          ]
        },
        {
          id: 'impact',
          name: 'Impact',
          questions: [
            'Making a meaningful difference is important to me',
            'I want my work to positively affect others',
            'I seek roles where I can create lasting change'
          ]
        },
        {
          id: 'connection',
          name: 'Connection',
          questions: [
            'Building strong relationships energizes me',
            'I value collaboration and teamwork',
            'I care deeply about team dynamics and culture'
          ]
        },
        {
          id: 'mastery',
          name: 'Mastery',
          questions: [
            'I love learning and developing new skills',
            'Becoming an expert is motivating to me',
            'I seek challenges that push my capabilities'
          ]
        }
      ]
    },
    {
      id: 'ceo-test',
      name: 'CEO Test',
      pillar: 'self',
      color: '#E08F6A',
      icon: '⭐',
      description: 'Comprehensive evaluation of your leadership capabilities across 7 key dimensions',
      estimatedMinutes: 15,
      sections: [
        {
          id: 'strategic-thinking',
          name: 'Strategic Thinking',
          questions: [
            'I regularly assess our competitive landscape and adjust strategy',
            'I can articulate a clear vision for where the company is headed',
            'I think 3-5 years ahead when making decisions',
            'I identify patterns and trends that others miss',
            'I can pivot strategy when circumstances change'
          ]
        },
        {
          id: 'communication',
          name: 'Communication',
          questions: [
            'I communicate vision and strategy clearly to all stakeholders',
            'I adapt my communication style to different audiences',
            'I actively listen and incorporate others\' perspectives',
            'I address difficult conversations directly and constructively',
            'I inspire and motivate through my words and actions'
          ]
        },
        {
          id: 'team-building',
          name: 'Team Building',
          questions: [
            'I hire people who are better than me in key areas',
            'I create an environment where top talent wants to work',
            'I develop people and help them grow their careers',
            'I build diverse teams with complementary skills',
            'I foster psychological safety and trust'
          ]
        },
        {
          id: 'decision-making',
          name: 'Decision Making',
          questions: [
            'I make tough decisions quickly with incomplete information',
            'I consider multiple perspectives before deciding',
            'I take responsibility for decisions even when they fail',
            'I know when to decide and when to delegate decisions',
            'I balance data analysis with intuition'
          ]
        },
        {
          id: 'execution',
          name: 'Execution',
          questions: [
            'I set clear priorities and say no to distractions',
            'I hold myself and others accountable for results',
            'I build systems and processes that scale',
            'I follow through on commitments consistently',
            'I balance speed with quality appropriately'
          ]
        },
        {
          id: 'innovation',
          name: 'Innovation',
          questions: [
            'I encourage experimentation and calculated risk-taking',
            'I challenge conventional thinking and status quo',
            'I create space for creative problem-solving',
            'I learn from failures and iterate quickly',
            'I stay curious and explore new ideas'
          ]
        },
        {
          id: 'financial-acumen',
          name: 'Financial Acumen',
          questions: [
            'I understand our unit economics and key financial metrics',
            'I make resource allocation decisions strategically',
            'I manage cash flow and runway effectively',
            'I balance growth investment with profitability',
            'I can explain our financial model clearly to investors'
          ]
        }
      ]
    },
    {
      id: 'trust-formula',
      name: 'Trust Formula',
      pillar: 'teams',
      color: '#C6A55B',
      icon: '🤝',
      description: 'Measure and strengthen the four pillars of trust in your leadership',
      estimatedMinutes: 10,
      sections: [
        {
          id: 'credibility',
          name: 'Credibility',
          questions: [
            'I have deep expertise in areas relevant to my role',
            'I stay current with industry trends and best practices',
            'My track record demonstrates consistent results'
          ]
        },
        {
          id: 'reliability',
          name: 'Reliability',
          questions: [
            'I consistently follow through on my commitments',
            'I meet deadlines and deliver on promises',
            'People can count on me to show up and do the work'
          ]
        },
        {
          id: 'intimacy',
          name: 'Intimacy',
          questions: [
            'I create safe spaces for vulnerable conversations',
            'I show genuine care for people as individuals',
            'I build deep, authentic relationships'
          ]
        },
        {
          id: 'self-orientation',
          name: 'Self-Orientation',
          questions: [
            'I prioritize others\' needs over my own agenda',
            'I listen more than I talk in conversations',
            'I focus on the team\'s success rather than personal credit'
          ]
        }
      ]
    },
    {
      id: 'culture-diagnostics',
      name: 'Culture Diagnostics',
      pillar: 'orgs',
      color: '#C7B9D3',
      icon: '🌱',
      description: 'Assess the health and alignment of your organizational culture',
      estimatedMinutes: 20,
      sections: [
        {
          id: 'values-alignment',
          name: 'Values Alignment',
          questions: [
            'Our stated values match how we actually operate',
            'Decisions are made consistently with our values',
            'We hire and promote based on cultural fit',
            'People can articulate our core values'
          ]
        },
        {
          id: 'psychological-safety',
          name: 'Psychological Safety',
          questions: [
            'People feel safe taking interpersonal risks',
            'Mistakes are viewed as learning opportunities',
            'Diverse opinions are welcomed and encouraged',
            'People challenge ideas without fear of retribution'
          ]
        },
        {
          id: 'accountability',
          name: 'Accountability',
          questions: [
            'Performance standards are clear and consistent',
            'People take ownership of their responsibilities',
            'We address underperformance directly',
            'Results matter more than effort or intentions'
          ]
        },
        {
          id: 'communication',
          name: 'Communication',
          questions: [
            'Information flows freely across the organization',
            'Leadership communicates transparently',
            'Feedback is given frequently and constructively',
            'People know what\'s happening and why'
          ]
        },
        {
          id: 'innovation',
          name: 'Innovation',
          questions: [
            'We experiment with new ideas regularly',
            'Failure is accepted as part of innovation',
            'Resources are allocated to exploratory projects',
            'Creative thinking is encouraged at all levels'
          ]
        }
      ]
    }
  ],

  // ============================================
  // ASSESSMENT HISTORY (User's completed/in-progress assessments)
  // ============================================
  assessmentHistory: [
    {
      id: 'history-001',
      assessmentId: 'zone-of-genius',
      userId: 'user-001',
      startedAt: '2025-01-15T09:00:00Z',
      completedAt: '2025-01-15T09:08:00Z',
      status: 'completed',
      answers: {
        'section-1': [5, 5, 4, 5, 4],
        'section-2': [5, 5, 5, 4, 5],
        'section-3': [4, 5, 5, 4, 5]
      },
      results: {
        totalScore: 69,
        maxScore: 75,
        percentage: 92,
        primaryZone: 'genius',
        breakdown: {
          skills: 23,
          energy: 24,
          value: 22
        },
        strengths: ['Creativity', 'Innovation', 'Strategic Thinking'],
        insights: 'You operate at your best when combining creative problem-solving with strategic vision.'
      }
    },
    {
      id: 'history-002',
      assessmentId: 'five-drivers',
      userId: 'user-001',
      startedAt: '2025-01-16T10:30:00Z',
      completedAt: '2025-01-16T10:42:00Z',
      status: 'completed',
      answers: {
        'achievement': [4, 5, 5],
        'autonomy': [5, 4, 4],
        'impact': [5, 5, 5],
        'connection': [4, 3, 4],
        'mastery': [5, 5, 4]
      },
      results: {
        totalScore: 66,
        maxScore: 75,
        percentage: 88,
        dominantDriver: 'impact',
        breakdown: {
          achievement: 14,
          autonomy: 13,
          impact: 15,
          connection: 11,
          mastery: 14
        },
        insights: 'You are primarily driven by Impact - making a meaningful difference energizes you most.'
      }
    },
    {
      id: 'history-003',
      assessmentId: 'ceo-test',
      userId: 'user-001',
      startedAt: '2025-01-17T14:00:00Z',
      completedAt: null,
      status: 'in_progress',
      currentSection: 'decision-making',
      answers: {
        'strategic-thinking': [5, 5, 4, 5, 4],
        'communication': [4, 5, 4, 5, 4],
        'team-building': [5, 4, 5, 4, 5]
      },
      progress: {
        sectionsCompleted: 3,
        totalSections: 7,
        questionsAnswered: 15,
        totalQuestions: 35,
        percentage: 43
      }
    }
  ],

  // ============================================
  // FRAMEWORKS
  // ============================================
  frameworks: [
    // Leading Self
    {
      id: 'emotional-regulation',
      name: 'Emotional Regulation',
      pillar: 'self',
      icon: '🧘',
      description: 'Master your emotional responses to lead with clarity and calm',
      estimatedMinutes: 15,
      completed: true,
      completedAt: '2025-01-10T12:00:00Z',
      relatedAssessments: ['zone-of-genius'],
      content: {
        overview: 'Master your emotional responses to lead with clarity and calm. This framework helps you recognize emotional triggers, pause before reacting, and choose intentional responses.',
        sections: [
          {
            title: 'The Framework',
            steps: [
              {
                number: 1,
                title: 'Recognize the Trigger',
                description: 'Notice what situations activate strong emotions. Common triggers include criticism, uncertainty, perceived disrespect, or high-stakes decisions.'
              },
              {
                number: 2,
                title: 'Name the Emotion',
                description: 'Label what you\'re feeling specifically. Instead of "I\'m upset," try "I feel frustrated and anxious." Naming emotions reduces their intensity.'
              },
              {
                number: 3,
                title: 'Pause and Breathe',
                description: 'Take 3 deep breaths before responding. Create space between stimulus and response. Even 10 seconds can shift your state.'
              },
              {
                number: 4,
                title: 'Choose Your Response',
                description: 'Decide how you want to show up. What would your best self do? What response aligns with your values and goals?'
              }
            ]
          },
          {
            title: 'How to Apply',
            practices: [
              'Daily Practice: Start each day with 5-minute meditation or journaling',
              'In Meetings: Before reacting to pushback, pause and take a breath',
              'After Conflict: Journal about the trigger, emotion, and your response',
              'Weekly Review: Reflect on your emotional patterns and growth'
            ]
          }
        ]
      }
    },
    {
      id: 'deep-work',
      name: 'Deep Work Mastery',
      pillar: 'self',
      icon: '🎯',
      description: 'Create conditions for focused, high-value cognitive work',
      estimatedMinutes: 20,
      completed: true,
      completedAt: '2025-01-14T09:00:00Z',
      relatedAssessments: ['zone-of-genius', 'five-drivers']
    },
    {
      id: '80-20-rule',
      name: '80/20 Rule',
      pillar: 'self',
      icon: '📊',
      description: 'Identify and focus on the 20% that produces 80% of results',
      estimatedMinutes: 12,
      completed: false,
      relatedAssessments: ['ceo-test']
    },
    {
      id: 'zone-application',
      name: 'Zone of Genius Application',
      pillar: 'self',
      icon: '💎',
      description: 'Apply your Zone of Genius assessment to daily decisions',
      estimatedMinutes: 18,
      completed: false,
      relatedAssessments: ['zone-of-genius']
    },
    {
      id: 'mental-biases',
      name: 'Mental Biases',
      pillar: 'self',
      icon: '🧠',
      description: 'Recognize and counteract common cognitive biases in decision-making',
      estimatedMinutes: 25,
      completed: false,
      relatedAssessments: ['ceo-test']
    },
    {
      id: 'five-drivers-application',
      name: 'Five Drivers Application',
      pillar: 'self',
      icon: '⚡',
      description: 'Use your motivational drivers to optimize your role and habits',
      estimatedMinutes: 20,
      completed: true,
      completedAt: '2025-01-12T15:00:00Z',
      relatedAssessments: ['five-drivers']
    },
    {
      id: 'burnout-prevention',
      name: 'Burnout Prevention',
      pillar: 'self',
      icon: '🔥',
      description: 'Recognize early warning signs and build sustainable work patterns',
      estimatedMinutes: 15,
      completed: false,
      relatedAssessments: ['five-drivers']
    },
    {
      id: 'focus-system',
      name: 'Focus System',
      pillar: 'self',
      icon: '⏰',
      description: 'Design your calendar and environment for deep work',
      estimatedMinutes: 20,
      completed: false,
      relatedAssessments: ['zone-of-genius']
    },

    // Leading Teams (8 frameworks)
    {
      id: 'delegation-framework',
      name: 'Delegation Framework',
      pillar: 'teams',
      icon: '🤲',
      description: 'Empower your team by delegating effectively',
      estimatedMinutes: 18,
      completed: true,
      completedAt: '2025-01-08T11:00:00Z',
      relatedAssessments: ['ceo-test']
    },
    {
      id: 'feedback-loops',
      name: 'Feedback Loops',
      pillar: 'teams',
      icon: '🔄',
      description: 'Create continuous feedback systems that drive performance',
      estimatedMinutes: 22,
      completed: true,
      completedAt: '2025-01-09T10:00:00Z',
      relatedAssessments: ['trust-formula']
    },
    {
      id: 'one-on-ones',
      name: '1-on-1 Mastery',
      pillar: 'teams',
      icon: '👥',
      description: 'Run effective one-on-one meetings that build trust and clarity',
      estimatedMinutes: 16,
      completed: false,
      relatedAssessments: ['trust-formula']
    },
    {
      id: 'hiring-playbook',
      name: 'Hiring Playbook',
      pillar: 'teams',
      icon: '🎯',
      description: 'Hire exceptional people consistently',
      estimatedMinutes: 30,
      completed: false,
      relatedAssessments: ['ceo-test']
    },
    {
      id: 'conflict-resolution',
      name: 'Conflict Resolution',
      pillar: 'teams',
      icon: '⚖️',
      description: 'Navigate team conflicts constructively',
      estimatedMinutes: 20,
      completed: false,
      relatedAssessments: ['trust-formula']
    },
    {
      id: 'team-motivation',
      name: 'Team Motivation',
      pillar: 'teams',
      icon: '🚀',
      description: 'Understand and activate intrinsic motivation',
      estimatedMinutes: 18,
      completed: false,
      relatedAssessments: ['five-drivers']
    },
    {
      id: 'psychological-safety',
      name: 'Psychological Safety',
      pillar: 'teams',
      icon: '🛡️',
      description: 'Build environments where people can take risks',
      estimatedMinutes: 25,
      completed: true,
      completedAt: '2025-01-11T14:00:00Z',
      relatedAssessments: ['culture-diagnostics']
    },
    {
      id: 'accountability-systems',
      name: 'Accountability Systems',
      pillar: 'teams',
      icon: '✓',
      description: 'Create clarity and ownership without micromanaging',
      estimatedMinutes: 20,
      completed: false,
      relatedAssessments: ['ceo-test']
    },

    // Leading Orgs (8 frameworks)
    {
      id: 'okr-framework',
      name: 'OKR Framework',
      pillar: 'orgs',
      icon: '🎯',
      description: 'Set and track objectives that align the organization',
      estimatedMinutes: 35,
      completed: true,
      completedAt: '2025-01-05T09:00:00Z',
      relatedAssessments: ['ceo-test']
    },
    {
      id: 'strategic-planning',
      name: 'Strategic Planning',
      pillar: 'orgs',
      icon: '🗺️',
      description: 'Develop clear strategy and execute effectively',
      estimatedMinutes: 40,
      completed: true,
      completedAt: '2025-01-06T13:00:00Z',
      relatedAssessments: ['ceo-test']
    },
    {
      id: 'culture-design',
      name: 'Culture Design',
      pillar: 'orgs',
      icon: '🌱',
      description: 'Intentionally shape organizational culture',
      estimatedMinutes: 30,
      completed: false,
      relatedAssessments: ['culture-diagnostics']
    },
    {
      id: 'decision-frameworks',
      name: 'Decision Frameworks',
      pillar: 'orgs',
      icon: '🧭',
      description: 'Create clarity on who decides what and how',
      estimatedMinutes: 25,
      completed: false,
      relatedAssessments: ['ceo-test']
    },
    {
      id: 'change-management',
      name: 'Change Management',
      pillar: 'orgs',
      icon: '🔄',
      description: 'Lead organizational transformation effectively',
      estimatedMinutes: 35,
      completed: false,
      relatedAssessments: ['culture-diagnostics']
    },
    {
      id: 'scaling-operations',
      name: 'Scaling Operations',
      pillar: 'orgs',
      icon: '📈',
      description: 'Build systems and processes that scale',
      estimatedMinutes: 30,
      completed: true,
      completedAt: '2025-01-07T16:00:00Z',
      relatedAssessments: ['ceo-test']
    },
    {
      id: 'board-management',
      name: 'Board Management',
      pillar: 'orgs',
      icon: '👔',
      description: 'Work effectively with your board of directors',
      estimatedMinutes: 28,
      completed: false,
      relatedAssessments: ['ceo-test']
    },
    {
      id: 'fundraising-strategy',
      name: 'Fundraising Strategy',
      pillar: 'orgs',
      icon: '💰',
      description: 'Plan and execute successful funding rounds',
      estimatedMinutes: 45,
      completed: false,
      relatedAssessments: ['ceo-test']
    }
  ],

  // ============================================
  // WEEKLY ACTIVITY DATA
  // ============================================
  weeklyActivity: {
    currentWeek: {
      sessions: 3,
      frameworksViewed: 2,
      assessmentProgress: 43,
      totalMinutes: 45,
      activities: [
        {
          type: 'assessment_started',
          assessmentId: 'ceo-test',
          timestamp: '2025-01-17T14:00:00Z',
          description: 'Started CEO Test'
        },
        {
          type: 'framework_viewed',
          frameworkId: 'deep-work',
          timestamp: '2025-01-16T11:00:00Z',
          description: 'Read Deep Work Mastery'
        },
        {
          type: 'assessment_completed',
          assessmentId: 'five-drivers',
          timestamp: '2025-01-16T10:42:00Z',
          description: 'Completed Five Drivers'
        }
      ],
      dailyMinutes: [12, 0, 15, 8, 10, 0, 0] // Last 7 days
    }
  },

  // ============================================
  // USER GOALS
  // ============================================
  goals: [
    {
      id: 'goal-001',
      title: 'Complete all 5 assessments',
      description: 'Finish Zone of Genius, Five Drivers, CEO Test, Trust Formula, and Culture Diagnostics',
      target: 5,
      current: 3,
      percentage: 60,
      dueDate: '2025-02-01'
    },
    {
      id: 'goal-002',
      title: 'Master 20 frameworks',
      description: 'Read and mark complete 20 leadership frameworks across all three pillars',
      target: 20,
      current: 8,
      percentage: 40,
      dueDate: '2025-03-01'
    },
    {
      id: 'goal-003',
      title: '7-day streak',
      description: 'Log in and engage with content for 7 consecutive days',
      target: 7,
      current: 7,
      percentage: 100,
      dueDate: null,
      achieved: true,
      achievedAt: '2025-01-17'
    }
  ],

  // ============================================
  // PERSONALIZED INSIGHTS (Mock AI recommendations)
  // ============================================
  insights: [
    {
      id: 'insight-001',
      type: 'framework_recommendation',
      title: 'Leverage Your Zone of Genius',
      description: 'Based on your Zone of Genius results, explore the Delegation framework to maximize your impact by focusing on creative strategy work.',
      icon: '💡',
      cta: 'Explore Delegation Framework',
      ctaLink: '/framework-view.html?id=delegation-framework',
      relatedAssessment: 'zone-of-genius',
      priority: 'high'
    },
    {
      id: 'insight-002',
      type: 'development_opportunity',
      title: 'Strengthen Financial Leadership',
      description: 'Your CEO Test shows room for growth in financial acumen. Consider the Board Management and Fundraising Strategy frameworks to build this capability.',
      icon: '📈',
      cta: 'View Recommended Frameworks',
      priority: 'medium'
    },
    {
      id: 'insight-003',
      type: 'completion_reminder',
      title: 'Finish Your CEO Test',
      description: 'You\'re 60% through the CEO Test! Complete the remaining 4 sections to get your comprehensive leadership profile.',
      icon: '⭐',
      cta: 'Continue Assessment',
      ctaLink: '/assessments.html?quiz=ceo-test',
      priority: 'high'
    },
    {
      id: 'insight-004',
      type: 'streak_celebration',
      title: '7-Day Streak Achieved!',
      description: 'Congratulations on your 7-day learning streak! Consistency is the foundation of mastery.',
      icon: '🔥',
      priority: 'low',
      dismissible: true
    }
  ]
};

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getAssessmentById(id) {
  return mockData.assessments.find(a => a.id === id);
}

export function getAssessmentHistory(assessmentId) {
  return mockData.assessmentHistory
    .filter(h => h.assessmentId === assessmentId)
    .sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt));
}

export function getFrameworksByPillar(pillar) {
  return mockData.frameworks.filter(f => f.pillar === pillar);
}

export function getCompletedFrameworks() {
  return mockData.frameworks.filter(f => f.completed);
}

export function getRecentActivity(limit = 5) {
  return mockData.weeklyActivity.currentWeek.activities
    .slice(0, limit)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

export function getHighPriorityInsights() {
  return mockData.insights.filter(i => i.priority === 'high');
}

export function getUserProgress() {
  const total = mockData.assessments.length;
  const completed = mockData.assessmentHistory.filter(h => h.status === 'completed').length;
  return {
    completed,
    total,
    percentage: Math.round((completed / total) * 100)
  };
}
