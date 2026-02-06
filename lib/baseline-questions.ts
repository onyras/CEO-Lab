import type { BehavioralItem, SjiItem, ImItem } from '@/types/assessment'

// ─── Behavioral Items (B01-B75) ──────────────────────────────────────
// 75 items: 5 per dimension, 15 dimensions
// Scoring direction per spec V4: (F) = forward, (R) = reverse — per item
// Stage assignment:
//   1st item per dimension = Stage 1  (15 items)
//   2nd + 3rd items = Stage 2         (30 items)
//   4th + 5th items = Stage 3         (30 items)

export const behavioralItems: BehavioralItem[] = [
  // ═══════════════════════════════════════════════
  // LEADING YOURSELF
  // ═══════════════════════════════════════════════

  // ─── LY.1 Self-Awareness (See) ────────────────
  {
    id: 'B01',
    dimensionId: 'LY.1',
    text: 'In the past 30 days, when a situation triggered a strong reaction in me, I noticed the pattern before it fully played out.',
    scoringDirection: 'forward',
    scaleType: 'frequency',
    stage: 1,
  },
  {
    id: 'B02',
    dimensionId: 'LY.1',
    text: 'In the past 30 days, I found myself in the same type of conflict or frustration with different people.',
    scoringDirection: 'reverse',
    scaleType: 'frequency',
    stage: 2,
  },
  {
    id: 'B03',
    dimensionId: 'LY.1',
    text: 'In the past 30 days, I actively sought honest feedback about my leadership from someone who would tell me the truth.',
    scoringDirection: 'forward',
    scaleType: 'frequency',
    stage: 2,
  },
  {
    id: 'B04',
    dimensionId: 'LY.1',
    text: 'In the past 30 days, feedback I received about my leadership genuinely surprised me.',
    scoringDirection: 'reverse',
    scaleType: 'frequency',
    stage: 3,
  },
  {
    id: 'B05',
    dimensionId: 'LY.1',
    text: 'I can name my top two reactive tendencies under pressure and I watch for them in real time.',
    scoringDirection: 'forward',
    scaleType: 'degree',
    stage: 3,
  },

  // ─── LY.2 Emotional Mastery (Feel) ────────────
  {
    id: 'B06',
    dimensionId: 'LY.2',
    text: 'In the past 30 days, when I experienced a difficult emotion at work, I could name the specific emotion (beyond \u201cstressed\u201d or \u201cfrustrated\u201d) and what triggered it.',
    scoringDirection: 'forward',
    scaleType: 'frequency',
    stage: 1,
  },
  {
    id: 'B07',
    dimensionId: 'LY.2',
    text: 'In the past 30 days, I suppressed a strong emotion at work and it came out later in an unintended way (irritability, withdrawal, sarcasm, or snapping).',
    scoringDirection: 'reverse',
    scaleType: 'frequency',
    stage: 2,
  },
  {
    id: 'B08',
    dimensionId: 'LY.2',
    text: 'In the past 30 days, when I needed to express frustration or disappointment to a colleague, I did so without blame, sarcasm, or passive-aggression.',
    scoringDirection: 'forward',
    scaleType: 'frequency',
    stage: 2,
  },
  {
    id: 'B09',
    dimensionId: 'LY.2',
    text: 'In the past 30 days, when I felt fear or anxiety about a decision, I acknowledged the feeling and acted on the decision anyway.',
    scoringDirection: 'forward',
    scaleType: 'frequency',
    stage: 3,
  },
  {
    id: 'B10',
    dimensionId: 'LY.2',
    text: 'In the past 30 days, I avoided giving someone honest feedback because I was worried about how they would feel.',
    scoringDirection: 'reverse',
    scaleType: 'frequency',
    stage: 3,
  },

  // ─── LY.3 Grounded Presence (Ground) ──────────
  {
    id: 'B11',
    dimensionId: 'LY.3',
    text: 'How often do you currently practice deliberate stillness, meditation, or structured reflection?',
    scoringDirection: 'forward',
    scaleType: 'custom',
    stage: 1,
    customScale: [
      'Rarely or never',
      'A few times per month',
      '1-2 times per week',
      '3-4 times per week',
      'Daily or near-daily',
    ],
  },
  {
    id: 'B12',
    dimensionId: 'LY.3',
    text: 'In the past 30 days, when I tried to rest or disconnect from work, my mind kept racing about tasks, problems, or unfinished business.',
    scoringDirection: 'reverse',
    scaleType: 'frequency',
    stage: 2,
  },
  {
    id: 'B13',
    dimensionId: 'LY.3',
    text: 'In the past 30 days, when someone was speaking to me in an important conversation, I listened with full attention without planning my response, checking my phone, or mentally drifting.',
    scoringDirection: 'forward',
    scaleType: 'frequency',
    stage: 2,
  },
  {
    id: 'B14',
    dimensionId: 'LY.3',
    text: 'In the past 30 days, before making an important decision, I deliberately created space (a walk, a pause, sleeping on it) rather than deciding immediately.',
    scoringDirection: 'forward',
    scaleType: 'frequency',
    stage: 3,
  },
  {
    id: 'B15',
    dimensionId: 'LY.3',
    text: 'In the past 30 days, during high-pressure moments (board calls, crises, difficult conversations), I felt genuinely present rather than on autopilot.',
    scoringDirection: 'forward',
    scaleType: 'frequency',
    stage: 3,
  },

  // ─── LY.4 Purpose & Mastery (Direct) ──────────
  {
    id: 'B16',
    dimensionId: 'LY.4',
    text: 'In a typical week, the majority of my working hours fall within my zone of genius: activities where my deepest talent and genuine passion intersect.',
    scoringDirection: 'forward',
    scaleType: 'frequency',
    stage: 1,
  },
  {
    id: 'B17',
    dimensionId: 'LY.4',
    text: 'In the past 30 days, I spent significant time on work that someone else could handle, because I hadn\'t delegated it or let go of it.',
    scoringDirection: 'reverse',
    scaleType: 'frequency',
    stage: 2,
  },
  {
    id: 'B18',
    dimensionId: 'LY.4',
    text: 'My daily decisions and priorities consistently connect to a long-term direction that matters deeply to me beyond financial outcomes.',
    scoringDirection: 'forward',
    scaleType: 'degree',
    stage: 2,
  },
  {
    id: 'B19',
    dimensionId: 'LY.4',
    text: 'In the past 30 days, I deliberately practiced or refined a specific skill I consider essential to my craft as a leader.',
    scoringDirection: 'forward',
    scaleType: 'frequency',
    stage: 3,
  },
  {
    id: 'B20',
    dimensionId: 'LY.4',
    text: 'In the past 30 days, I felt pulled in directions that don\'t align with what I actually care about most.',
    scoringDirection: 'reverse',
    scaleType: 'frequency',
    stage: 3,
  },

  // ─── LY.5 Peak Performance (Sustain) ──────────
  {
    id: 'B21',
    dimensionId: 'LY.5',
    text: 'In a typical week, how many hours of uninterrupted, deep-focus work do you complete on your highest-priority tasks?',
    scoringDirection: 'forward',
    scaleType: 'custom',
    stage: 1,
    customScale: [
      'Less than 1 hour',
      '1-3 hours',
      '3-6 hours',
      '6-10 hours',
      '10+ hours',
    ],
  },
  {
    id: 'B22',
    dimensionId: 'LY.5',
    text: 'In the past 30 days, I worked through obvious signs of exhaustion (physical tiredness, difficulty concentrating, irritability) rather than stopping to recover.',
    scoringDirection: 'reverse',
    scaleType: 'frequency',
    stage: 2,
  },
  {
    id: 'B23',
    dimensionId: 'LY.5',
    text: 'In the past 30 days, I said no to a request, meeting, or opportunity specifically because it was low-leverage relative to my top priorities.',
    scoringDirection: 'forward',
    scaleType: 'frequency',
    stage: 2,
  },
  {
    id: 'B24',
    dimensionId: 'LY.5',
    text: 'I currently maintain non-negotiable recovery practices (exercise, sleep boundaries, time off) that I protect even when work pressure increases.',
    scoringDirection: 'forward',
    scaleType: 'degree',
    stage: 3,
  },
  {
    id: 'B25',
    dimensionId: 'LY.5',
    text: 'In the past 30 days, I spent the majority of my time in reactive mode (responding to emails, attending meetings others scheduled, firefighting) rather than proactive deep work.',
    scoringDirection: 'reverse',
    scaleType: 'frequency',
    stage: 3,
  },

  // ═══════════════════════════════════════════════
  // LEADING TEAMS
  // ═══════════════════════════════════════════════

  // ─── LT.1 Building Trust (Trust) ──────────────
  {
    id: 'B26',
    dimensionId: 'LT.1',
    text: 'In the past 30 days, when I made a commitment to someone on my team and couldn\'t deliver, I proactively renegotiated before the deadline rather than letting it slide.',
    scoringDirection: 'forward',
    scaleType: 'frequency',
    stage: 1,
  },
  {
    id: 'B27',
    dimensionId: 'LT.1',
    text: 'In the past 30 days, a team member brought me bad news or admitted a mistake without me having to ask or discover it myself.',
    scoringDirection: 'forward',
    scaleType: 'frequency',
    stage: 2,
  },
  {
    id: 'B28',
    dimensionId: 'LT.1',
    text: 'In the past 30 days, I learned about a significant problem from a back channel (rumor, third party, Slack thread) rather than directly from the person responsible.',
    scoringDirection: 'reverse',
    scaleType: 'frequency',
    stage: 2,
  },
  {
    id: 'B29',
    dimensionId: 'LT.1',
    text: 'In the past 30 days, I said \u201cI don\u2019t know\u201d or \u201cI was wrong\u201d in front of my team.',
    scoringDirection: 'forward',
    scaleType: 'frequency',
    stage: 3,
  },
  {
    id: 'B30',
    dimensionId: 'LT.1',
    text: 'If I asked my direct reports right now whether they believe I have their genuine interests at heart (not just the company\u2019s), they would say yes.',
    scoringDirection: 'forward',
    scaleType: 'confidence',
    stage: 3,
  },

  // ─── LT.2 Hard Conversations (Truth) ──────────
  {
    id: 'B31',
    dimensionId: 'LT.2',
    text: 'In the past 30 days, when I needed to address a difficult topic with someone, I had the conversation within a few days rather than postponing it.',
    scoringDirection: 'forward',
    scaleType: 'frequency',
    stage: 1,
  },
  {
    id: 'B32',
    dimensionId: 'LT.2',
    text: 'In the past 30 days, I avoided an uncomfortable conversation by telling myself \u201cthe timing isn\u2019t right\u201d or \u201cit will resolve itself.\u201d',
    scoringDirection: 'reverse',
    scaleType: 'frequency',
    stage: 2,
  },
  {
    id: 'B33',
    dimensionId: 'LT.2',
    text: 'In the past 30 days, when someone told me something I didn\u2019t want to hear, I focused on understanding their perspective before responding with my own.',
    scoringDirection: 'forward',
    scaleType: 'frequency',
    stage: 2,
  },
  {
    id: 'B34',
    dimensionId: 'LT.2',
    text: 'In the past 30 days, I gave feedback to a direct report that was honest enough to be uncomfortable but delivered with enough care that they could hear it.',
    scoringDirection: 'forward',
    scaleType: 'frequency',
    stage: 3,
  },
  {
    id: 'B35',
    dimensionId: 'LT.2',
    text: 'In the past 30 days, I softened feedback so much that the other person walked away without understanding the seriousness of the issue.',
    scoringDirection: 'reverse',
    scaleType: 'frequency',
    stage: 3,
  },

  // ─── LT.3 Diagnosing the Real Problem (Diagnosis) ─
  {
    id: 'B36',
    dimensionId: 'LT.3',
    text: 'In the past 30 days, when a team member came to me with a problem, I asked questions that deepened their thinking rather than jumping to my solution.',
    scoringDirection: 'forward',
    scaleType: 'frequency',
    stage: 1,
  },
  {
    id: 'B37',
    dimensionId: 'LT.3',
    text: 'In the past 30 days, I provided my answer or solution before giving the team adequate time to develop their own.',
    scoringDirection: 'reverse',
    scaleType: 'frequency',
    stage: 2,
  },
  {
    id: 'B38',
    dimensionId: 'LT.3',
    text: 'In the past 30 days, when something went wrong on my team, I considered my own contribution to the problem (not just what others did wrong).',
    scoringDirection: 'forward',
    scaleType: 'frequency',
    stage: 2,
  },
  {
    id: 'B39',
    dimensionId: 'LT.3',
    text: 'In the past 30 days, people on my team came to me for decisions they had the information and authority to make themselves.',
    scoringDirection: 'reverse',
    scaleType: 'frequency',
    stage: 3,
  },
  {
    id: 'B40',
    dimensionId: 'LT.3',
    text: 'In the past 30 days, I identified a recurring team problem and traced it to a structural or behavioral root cause rather than just addressing the symptom.',
    scoringDirection: 'forward',
    scaleType: 'frequency',
    stage: 3,
  },

  // ─── LT.4 Team Operating System (System) ──────
  {
    id: 'B41',
    dimensionId: 'LT.4',
    text: 'Does your leadership team have a consistent weekly meeting that reliably produces clear decisions and accountability?',
    scoringDirection: 'forward',
    scaleType: 'custom',
    stage: 1,
    customScale: [
      'No regular meeting',
      'Inconsistently',
      'Yes, but often unfocused',
      'Yes, mostly effective',
      'Yes, consistently effective',
    ],
  },
  {
    id: 'B42',
    dimensionId: 'LT.4',
    text: 'In the past 30 days, meetings I led ended without clear outcomes, owners, or next steps.',
    scoringDirection: 'reverse',
    scaleType: 'frequency',
    stage: 2,
  },
  {
    id: 'B43',
    dimensionId: 'LT.4',
    text: 'My team currently has a clear, shared understanding of who decides what, without needing to check with me.',
    scoringDirection: 'forward',
    scaleType: 'degree',
    stage: 2,
  },
  {
    id: 'B44',
    dimensionId: 'LT.4',
    text: 'In the past 30 days, important information reached the people who needed it through deliberate channels (meetings, updates, dashboards) rather than through chance or hallway conversations.',
    scoringDirection: 'forward',
    scaleType: 'frequency',
    stage: 3,
  },
  {
    id: 'B45',
    dimensionId: 'LT.4',
    text: 'In the past 30 days, my team\u2019s way of working was mostly improvised rather than following a designed rhythm of check-ins, reviews, and planning.',
    scoringDirection: 'reverse',
    scaleType: 'frequency',
    stage: 3,
  },

  // ─── LT.5 Leader Identity (Identity) ──────────
  {
    id: 'B46',
    dimensionId: 'LT.5',
    text: 'In a typical week, the majority of my time goes to working ON the team and organization (strategy, people development, system design) rather than IN the day-to-day operations.',
    scoringDirection: 'forward',
    scaleType: 'frequency',
    stage: 1,
  },
  {
    id: 'B47',
    dimensionId: 'LT.5',
    text: 'In the past 30 days, I took back a task or responsibility I had delegated because the quality wasn\u2019t up to my standards.',
    scoringDirection: 'reverse',
    scaleType: 'frequency',
    stage: 2,
  },
  {
    id: 'B48',
    dimensionId: 'LT.5',
    text: 'My leadership team currently functions as genuine peers who collaborate with each other, not as individuals who each relate to me separately.',
    scoringDirection: 'forward',
    scaleType: 'degree',
    stage: 2,
  },
  {
    id: 'B49',
    dimensionId: 'LT.5',
    text: 'If I left for a two-week vacation with no contact, my company would continue to function effectively.',
    scoringDirection: 'forward',
    scaleType: 'confidence',
    stage: 3,
  },
  {
    id: 'B50',
    dimensionId: 'LT.5',
    text: 'In the past 30 days, I attended a meeting or made a decision in an area I should have let go of by now, because I still felt I needed to be involved.',
    scoringDirection: 'reverse',
    scaleType: 'frequency',
    stage: 3,
  },

  // ═══════════════════════════════════════════════
  // LEADING ORGANIZATIONS
  // ═══════════════════════════════════════════════

  // ─── LO.1 Strategic Clarity (See) ─────────────
  {
    id: 'B51',
    dimensionId: 'LO.1',
    text: 'I can articulate my company\u2019s strategy in one clear sentence, including what we have chosen NOT to do.',
    scoringDirection: 'forward',
    scaleType: 'degree',
    stage: 1,
  },
  {
    id: 'B52',
    dimensionId: 'LO.1',
    text: 'In the past 30 days, I pursued or seriously considered an opportunity that didn\u2019t fit our stated strategy.',
    scoringDirection: 'reverse',
    scaleType: 'frequency',
    stage: 2,
  },
  {
    id: 'B53',
    dimensionId: 'LO.1',
    text: 'In the past 30 days, when a team member made an operational decision, they were able to use our strategic priorities as the filter without consulting me.',
    scoringDirection: 'forward',
    scaleType: 'frequency',
    stage: 2,
  },
  {
    id: 'B54',
    dimensionId: 'LO.1',
    text: 'My company currently has three or fewer strategic priorities that every team member could name if asked.',
    scoringDirection: 'forward',
    scaleType: 'degree',
    stage: 3,
  },
  {
    id: 'B55',
    dimensionId: 'LO.1',
    text: 'In the past 30 days, I caught myself or my leadership team confusing a business plan or list of initiatives with an actual strategy (a set of integrated choices about where to play and how to win).',
    scoringDirection: 'reverse',
    scaleType: 'frequency',
    stage: 3,
  },

  // ─── LO.2 Culture Design (Shape) ──────────────
  {
    id: 'B56',
    dimensionId: 'LO.2',
    text: 'My company\u2019s culture is currently defined as specific, observable behaviors (not abstract values like \u201cinnovation\u201d or \u201cexcellence\u201d) that people can be held accountable to.',
    scoringDirection: 'forward',
    scaleType: 'degree',
    stage: 1,
  },
  {
    id: 'B57',
    dimensionId: 'LO.2',
    text: 'In the past 30 days, I tolerated behavior from a high performer that violated our cultural norms because they were delivering strong results.',
    scoringDirection: 'reverse',
    scaleType: 'frequency',
    stage: 2,
  },
  {
    id: 'B58',
    dimensionId: 'LO.2',
    text: 'In the past 30 days, when someone acted against our cultural expectations, it was addressed directly and promptly, regardless of their seniority or performance.',
    scoringDirection: 'forward',
    scaleType: 'frequency',
    stage: 2,
  },
  {
    id: 'B59',
    dimensionId: 'LO.2',
    text: 'In the past 30 days, I noticed a gap between what we say our culture is and how people actually behave day to day.',
    scoringDirection: 'reverse',
    scaleType: 'frequency',
    stage: 3,
  },
  {
    id: 'B60',
    dimensionId: 'LO.2',
    text: 'Cultural criteria are currently weighted equally with competence in our hiring, promotion, and separation decisions.',
    scoringDirection: 'forward',
    scaleType: 'degree',
    stage: 3,
  },

  // ─── LO.3 Organizational Architecture (Build) ─
  {
    id: 'B61',
    dimensionId: 'LO.3',
    text: 'My company\u2019s organizational structure was deliberately designed for our current size and strategy, not inherited from an earlier stage.',
    scoringDirection: 'forward',
    scaleType: 'degree',
    stage: 1,
  },
  {
    id: 'B62',
    dimensionId: 'LO.3',
    text: 'In the past 30 days, my organizational structure created bottlenecks, confusion, or duplicated effort that slowed the team down.',
    scoringDirection: 'reverse',
    scaleType: 'frequency',
    stage: 2,
  },
  {
    id: 'B63',
    dimensionId: 'LO.3',
    text: 'Decision rights in my organization are currently documented and clear: for any significant decision, people know who owns it.',
    scoringDirection: 'forward',
    scaleType: 'degree',
    stage: 2,
  },
  {
    id: 'B64',
    dimensionId: 'LO.3',
    text: 'In the past 30 days, people worked around the formal structure (going directly to someone outside the reporting line, escalating to me to bypass a process) to get things done.',
    scoringDirection: 'reverse',
    scaleType: 'frequency',
    stage: 3,
  },
  {
    id: 'B65',
    dimensionId: 'LO.3',
    text: 'In the past 30 days, my organization made a structural or process improvement based on a systematic review, not just in response to a crisis.',
    scoringDirection: 'forward',
    scaleType: 'frequency',
    stage: 3,
  },

  // ─── LO.4 CEO Evolution (Evolve) ──────────────
  {
    id: 'B66',
    dimensionId: 'LO.4',
    text: 'My role today looks meaningfully different from my role 12 months ago, reflecting the company\u2019s growth and changing needs.',
    scoringDirection: 'forward',
    scaleType: 'degree',
    stage: 1,
  },
  {
    id: 'B67',
    dimensionId: 'LO.4',
    text: 'In the past 30 days, I found myself doing work that I should have transitioned away from given the company\u2019s current size.',
    scoringDirection: 'reverse',
    scaleType: 'frequency',
    stage: 2,
  },
  {
    id: 'B68',
    dimensionId: 'LO.4',
    text: 'In the past 30 days, I deliberately assessed whether my current skills and approach still match what the company needs from its CEO at this stage.',
    scoringDirection: 'forward',
    scaleType: 'frequency',
    stage: 2,
  },
  {
    id: 'B69',
    dimensionId: 'LO.4',
    text: 'If I honestly evaluated myself against the job description of \u201cCEO of this company at its current stage,\u201d I would be a strong fit.',
    scoringDirection: 'forward',
    scaleType: 'confidence',
    stage: 3,
  },
  {
    id: 'B70',
    dimensionId: 'LO.4',
    text: 'In the past 30 days, I held onto a functional area or set of decisions because letting go felt like losing my relevance, even though someone else could handle it.',
    scoringDirection: 'reverse',
    scaleType: 'frequency',
    stage: 3,
  },

  // ─── LO.5 Leading Change (Change) ─────────────
  {
    id: 'B71',
    dimensionId: 'LO.5',
    text: 'In the past 30 days, I proactively reached out to a board member between formal meetings to share an update, concern, or question.',
    scoringDirection: 'forward',
    scaleType: 'frequency',
    stage: 1,
  },
  {
    id: 'B72',
    dimensionId: 'LO.5',
    text: 'In the past 30 days, I withheld or softened bad news when communicating with my board.',
    scoringDirection: 'reverse',
    scaleType: 'frequency',
    stage: 2,
  },
  {
    id: 'B73',
    dimensionId: 'LO.5',
    text: 'In the past 30 days, I evaluated a risk or opportunity using a structured approach (scenario analysis, pre-mortem, staged rollout) rather than relying on gut instinct alone.',
    scoringDirection: 'forward',
    scaleType: 'frequency',
    stage: 2,
  },
  {
    id: 'B74',
    dimensionId: 'LO.5',
    text: 'My organization currently balances investing in what works today (exploitation) with experimenting on what could work tomorrow (exploration).',
    scoringDirection: 'forward',
    scaleType: 'degree',
    stage: 3,
  },
  {
    id: 'B75',
    dimensionId: 'LO.5',
    text: 'In the past 30 days, I avoided making a needed organizational change because the disruption felt too risky or uncomfortable.',
    scoringDirection: 'reverse',
    scaleType: 'frequency',
    stage: 3,
  },
]

// ─── Situational Judgment Items (SJ01-SJ15) ──────────────────────────
// 15 items: 1 per dimension
// Each has 4 options with maturityScore (1-4) and behavioralTag

export const sjiItems: SjiItem[] = [
  // ─── SJ01 — Self-Awareness (LY.1) ────────────
  {
    id: 'SJ01',
    dimensionId: 'LY.1',
    scenario: 'You\u2019re in a leadership team meeting. A direct report presents a proposal you immediately dislike. You notice your jaw tightening and an urge to shut it down. You:',
    options: [
      {
        text: 'Voice your concerns directly and explain why it won\u2019t work.',
        maturityScore: 2,
        behavioralTag: 'Controller',
      },
      {
        text: 'Ask the team what they think first, giving yourself time to examine your reaction.',
        maturityScore: 4,
        behavioralTag: 'Facilitator',
      },
      {
        text: 'Stay quiet, planning to address it privately afterward.',
        maturityScore: 1,
        behavioralTag: 'Avoider',
      },
      {
        text: 'Share that you\u2019re having a strong reaction and want to understand it before responding.',
        maturityScore: 3,
        behavioralTag: 'Facilitator',
      },
    ],
  },

  // ─── SJ02 — Emotional Mastery (LY.2) ─────────
  {
    id: 'SJ02',
    dimensionId: 'LY.2',
    scenario: 'Your co-founder just told you they\u2019re considering leaving. You feel a wave of anger, betrayal, and fear. You:',
    options: [
      {
        text: 'Tell them you understand and ask them to take the weekend to think about it, while you do the same.',
        maturityScore: 4,
        behavioralTag: 'Facilitator',
      },
      {
        text: 'Ask immediately what it would take for them to stay.',
        maturityScore: 2,
        behavioralTag: 'Rescuer',
      },
      {
        text: 'Tell them how their leaving would affect the company and the team.',
        maturityScore: 1,
        behavioralTag: 'Controller',
      },
      {
        text: 'Acknowledge the emotions you\u2019re feeling out loud and ask what\u2019s driving their consideration.',
        maturityScore: 3,
        behavioralTag: 'Facilitator',
      },
    ],
  },

  // ─── SJ03 — Grounded Presence (LY.3) ─────────
  {
    id: 'SJ03',
    dimensionId: 'LY.3',
    scenario: 'You\u2019ve just received a threatening legal notice 30 minutes before an important all-hands meeting. Your team will read your energy. You:',
    options: [
      {
        text: 'Postpone the all-hands to deal with the legal issue first.',
        maturityScore: 2,
        behavioralTag: 'Avoider',
      },
      {
        text: 'Take 5 minutes alone to settle yourself, then run the all-hands as planned, addressing the legal issue separately afterward.',
        maturityScore: 4,
        behavioralTag: 'Facilitator',
      },
      {
        text: 'Run the all-hands but mention the legal situation briefly so people don\u2019t sense unaddressed tension.',
        maturityScore: 3,
        behavioralTag: 'Controller',
      },
      {
        text: 'Push through the all-hands, trusting yourself to compartmentalize.',
        maturityScore: 1,
        behavioralTag: 'Controller',
      },
    ],
  },

  // ─── SJ04 — Purpose & Mastery (LY.4) ─────────
  {
    id: 'SJ04',
    dimensionId: 'LY.4',
    scenario: 'A major investor offers you a board seat at a prestigious company. It would expand your network significantly but consume 10+ hours per month that currently go to deep work on your company and personal development. You:',
    options: [
      {
        text: 'Accept immediately; the network benefits are too valuable to pass up.',
        maturityScore: 1,
        behavioralTag: 'Controller',
      },
      {
        text: 'Decline; it doesn\u2019t align with your current priorities and would dilute your focus.',
        maturityScore: 3,
        behavioralTag: 'Facilitator',
      },
      {
        text: 'Ask what specifically you\u2019d contribute and how it connects to your own development as a leader, then decide.',
        maturityScore: 4,
        behavioralTag: 'Facilitator',
      },
      {
        text: 'Accept but plan to reduce the time commitment once you\u2019re established.',
        maturityScore: 2,
        behavioralTag: 'Avoider',
      },
    ],
  },

  // ─── SJ05 — Peak Performance (LY.5) ──────────
  {
    id: 'SJ05',
    dimensionId: 'LY.5',
    scenario: 'It\u2019s Thursday evening. You\u2019ve been in meetings since 8am. You have a strategic document to write that requires deep thinking, and the deadline is tomorrow morning. You:',
    options: [
      {
        text: 'Power through tonight; you can rest this weekend.',
        maturityScore: 1,
        behavioralTag: 'Controller',
      },
      {
        text: 'Send a message moving the deadline to Monday and go home. You know you won\u2019t produce your best work exhausted.',
        maturityScore: 4,
        behavioralTag: 'Facilitator',
      },
      {
        text: 'Do a rough draft tonight and finish it fresh tomorrow morning before the meeting.',
        maturityScore: 3,
        behavioralTag: 'Facilitator',
      },
      {
        text: 'Delegate it to someone on your team with a clear brief.',
        maturityScore: 2,
        behavioralTag: 'Avoider',
      },
    ],
  },

  // ─── SJ06 — Building Trust (LT.1) ────────────
  {
    id: 'SJ06',
    dimensionId: 'LT.1',
    scenario: 'During a 1-on-1, your VP of Engineering admits they shipped a feature with a known bug because they were afraid of missing the deadline you set. You:',
    options: [
      {
        text: 'Thank them for telling you, then ask what about the dynamic between you made them feel the deadline was more important than quality.',
        maturityScore: 4,
        behavioralTag: 'Facilitator',
      },
      {
        text: 'Reassure them that you value honesty and discuss how to fix the bug.',
        maturityScore: 3,
        behavioralTag: 'Rescuer',
      },
      {
        text: 'Express disappointment that they didn\u2019t raise this earlier and set a new standard for flagging risks.',
        maturityScore: 2,
        behavioralTag: 'Controller',
      },
      {
        text: 'Note it and move on; the bug can be fixed in the next sprint.',
        maturityScore: 1,
        behavioralTag: 'Avoider',
      },
    ],
  },

  // ─── SJ07 — Hard Conversations (LT.2) ────────
  {
    id: 'SJ07',
    dimensionId: 'LT.2',
    scenario: 'Your Head of Sales has been underperforming for two quarters. You\u2019ve hinted at concerns but haven\u2019t had a direct conversation. They seem unaware of the severity. A board member just asked about sales leadership. You:',
    options: [
      {
        text: 'Have the direct conversation this week, acknowledging you should have raised it sooner, and set clear expectations with a timeline.',
        maturityScore: 4,
        behavioralTag: 'Facilitator',
      },
      {
        text: 'Ask the board member for patience and plan to address it at the next quarterly review.',
        maturityScore: 1,
        behavioralTag: 'Avoider',
      },
      {
        text: 'Hire a sales consultant to \u201csupport\u201d the Head of Sales, hoping the consultant identifies and addresses the gap.',
        maturityScore: 2,
        behavioralTag: 'Avoider',
      },
      {
        text: 'Have the conversation but focus on understanding what support they need before setting expectations.',
        maturityScore: 3,
        behavioralTag: 'Rescuer',
      },
    ],
  },

  // ─── SJ08 — Diagnosing the Real Problem (LT.3) ─
  {
    id: 'SJ08',
    dimensionId: 'LT.3',
    scenario: 'Your product team keeps missing sprint commitments. The engineering lead says they need more developers. The product lead says the scope keeps changing. They each blame the other\u2019s function. You:',
    options: [
      {
        text: 'Hire more developers; if the engineering lead says they\u2019re under-resourced, that\u2019s probably true.',
        maturityScore: 1,
        behavioralTag: 'Rescuer',
      },
      {
        text: 'Bring both leads together and facilitate a conversation where they diagnose the root cause together, including any contribution from your own decisions.',
        maturityScore: 4,
        behavioralTag: 'Facilitator',
      },
      {
        text: 'Implement a more rigorous sprint planning process with stricter scope controls.',
        maturityScore: 2,
        behavioralTag: 'Controller',
      },
      {
        text: 'Observe two sprint cycles without intervening, tracking where breakdowns actually occur, then share your diagnosis with both leads.',
        maturityScore: 3,
        behavioralTag: 'Facilitator',
      },
    ],
  },

  // ─── SJ09 — Team Operating System (LT.4) ─────
  {
    id: 'SJ09',
    dimensionId: 'LT.4',
    scenario: 'You realize your leadership team meetings have become status update sessions. People share what\u2019s happening in their function but rarely make decisions, debate priorities, or hold each other accountable. You:',
    options: [
      {
        text: 'Redesign the meeting format: pre-reads for status, meeting time reserved for decisions and debate. Announce the change and explain why.',
        maturityScore: 4,
        behavioralTag: 'Facilitator',
      },
      {
        text: 'Raise it at the next meeting and ask the team to suggest improvements.',
        maturityScore: 3,
        behavioralTag: 'Facilitator',
      },
      {
        text: 'Start attending less frequently, hoping the team will step up and make the meetings more productive without you.',
        maturityScore: 1,
        behavioralTag: 'Avoider',
      },
      {
        text: 'Add a new monthly strategic meeting for \u201creal\u201d discussions and keep the weekly as-is.',
        maturityScore: 2,
        behavioralTag: 'Controller',
      },
    ],
  },

  // ─── SJ10 — Leader Identity (LT.5) ───────────
  {
    id: 'SJ10',
    dimensionId: 'LT.5',
    scenario: 'Your VP of Marketing presents a campaign direction you think is wrong. You have deep marketing experience from earlier in your career. You:',
    options: [
      {
        text: 'Share your concerns, overrule the direction, and provide your recommended approach.',
        maturityScore: 1,
        behavioralTag: 'Controller',
      },
      {
        text: 'Ask probing questions about the strategy and data behind the choice, then say \u201cI trust your judgment, let\u2019s run with it\u201d if the logic holds.',
        maturityScore: 4,
        behavioralTag: 'Facilitator',
      },
      {
        text: 'Approve it but privately ask another team member to monitor the results.',
        maturityScore: 2,
        behavioralTag: 'Avoider',
      },
      {
        text: 'Share your experience-based perspective, then ask the VP to weigh it against their analysis and make the final call.',
        maturityScore: 3,
        behavioralTag: 'Facilitator',
      },
    ],
  },

  // ─── SJ11 — Strategic Clarity (LO.1) ─────────
  {
    id: 'SJ11',
    dimensionId: 'LO.1',
    scenario: 'A large potential customer offers a lucrative deal, but serving them would require building a feature set that pulls your product team away from your core strategic direction for 6+ months. The revenue would cover two quarters of burn. You:',
    options: [
      {
        text: 'Take the deal; the revenue provides runway and optionality.',
        maturityScore: 1,
        behavioralTag: 'Controller',
      },
      {
        text: 'Decline the deal. The strategic cost outweighs the financial benefit.',
        maturityScore: 3,
        behavioralTag: 'Facilitator',
      },
      {
        text: 'Propose a limited version of the engagement that serves the customer without derailing your roadmap, and be willing to walk away if they won\u2019t accept it.',
        maturityScore: 4,
        behavioralTag: 'Facilitator',
      },
      {
        text: 'Take the deal but plan to return to the strategic roadmap once the engagement ends.',
        maturityScore: 2,
        behavioralTag: 'Avoider',
      },
    ],
  },

  // ─── SJ12 — Culture Design (LO.2) ────────────
  {
    id: 'SJ12',
    dimensionId: 'LO.2',
    scenario: 'Your best salesperson consistently hits 150% of quota. They\u2019re also dismissive to support staff, take credit for team efforts, and several people have quietly complained. You:',
    options: [
      {
        text: 'Have a direct conversation: their behavior violates cultural expectations and must change regardless of their sales numbers, with clear consequences if it doesn\u2019t.',
        maturityScore: 4,
        behavioralTag: 'Facilitator',
      },
      {
        text: 'Pair them with a coach to work on interpersonal skills.',
        maturityScore: 2,
        behavioralTag: 'Rescuer',
      },
      {
        text: 'Raise it gently in their next performance review alongside their strong numbers.',
        maturityScore: 1,
        behavioralTag: 'Avoider',
      },
      {
        text: 'Move them to a role with less team interaction so their talent is preserved but their impact on culture is reduced.',
        maturityScore: 3,
        behavioralTag: 'Controller',
      },
    ],
  },

  // ─── SJ13 — Organizational Architecture (LO.3) ─
  {
    id: 'SJ13',
    dimensionId: 'LO.3',
    scenario: 'Your company has doubled to 120 people, but the org structure hasn\u2019t changed since you were 60. Decision-making is slow, teams step on each other\u2019s work, and middle managers escalate everything. You:',
    options: [
      {
        text: 'Add a COO to sort out the operational complexity.',
        maturityScore: 2,
        behavioralTag: 'Rescuer',
      },
      {
        text: 'Block a full day to map current decision bottlenecks and overlaps, then redesign the structure with your leadership team based on your current strategy and the decisions that need to be made.',
        maturityScore: 4,
        behavioralTag: 'Facilitator',
      },
      {
        text: 'Ask each department head to propose structural improvements for their area.',
        maturityScore: 3,
        behavioralTag: 'Facilitator',
      },
      {
        text: 'Implement a project management tool and clearer processes within the existing structure.',
        maturityScore: 1,
        behavioralTag: 'Controller',
      },
    ],
  },

  // ─── SJ14 — CEO Evolution (LO.4) ─────────────
  {
    id: 'SJ14',
    dimensionId: 'LO.4',
    scenario: 'You realize that the company needs a world-class CFO for the next funding round, but you\u2019ve been handling finance yourself since founding. A board member suggests that your involvement in finance is creating a bottleneck. You:',
    options: [
      {
        text: 'Agree it\u2019s time and begin a search immediately, committing to a full handover.',
        maturityScore: 4,
        behavioralTag: 'Facilitator',
      },
      {
        text: 'Agree in principle but decide to wait until after the current quarter closes.',
        maturityScore: 2,
        behavioralTag: 'Avoider',
      },
      {
        text: 'Hire a Head of Finance but keep final approval on all major financial decisions during a transition period.',
        maturityScore: 3,
        behavioralTag: 'Controller',
      },
      {
        text: 'Push back; you know the numbers better than anyone and an outsider would take months to ramp up.',
        maturityScore: 1,
        behavioralTag: 'Controller',
      },
    ],
  },

  // ─── SJ15 — Leading Change (LO.5) ────────────
  {
    id: 'SJ15',
    dimensionId: 'LO.5',
    scenario: 'Your company needs to pivot its go-to-market strategy. This will affect every team, require letting go of some customers, and create 3-6 months of uncertainty. Your board supports the direction. You:',
    options: [
      {
        text: 'Announce the pivot to the entire company at the next all-hands with a clear rationale and timeline.',
        maturityScore: 2,
        behavioralTag: 'Controller',
      },
      {
        text: 'Roll it out in phases: align the leadership team first, develop a communication plan together, then cascade to the organization with each leader owning their team\u2019s transition.',
        maturityScore: 4,
        behavioralTag: 'Facilitator',
      },
      {
        text: 'Start implementing changes quietly in one team as a pilot before announcing company-wide.',
        maturityScore: 1,
        behavioralTag: 'Avoider',
      },
      {
        text: 'Share the strategic rationale with the full company and create structured forums for questions, concerns, and input before finalizing the implementation plan.',
        maturityScore: 3,
        behavioralTag: 'Facilitator',
      },
    ],
  },
]

// ─── Impression Management Items (IM01-IM06) ─────────────────────────
// 6 items. Scored: response 4-5 = 1 (implausibly positive), 1-3 = 0 (realistic).
// Total IM >= 4 triggers validity flag.

export const imItems: ImItem[] = [
  {
    id: 'IM01',
    text: 'When I receive feedback I disagree with, I carefully consider it before responding.',
  },
  {
    id: 'IM02',
    text: 'In meetings, I make sure everyone has a chance to speak before sharing my own opinion.',
  },
  {
    id: 'IM03',
    text: 'When someone on my team makes an error, I focus entirely on how to fix it rather than feeling any frustration.',
  },
  {
    id: 'IM04',
    text: 'I follow through on every commitment I make, no matter how small.',
  },
  {
    id: 'IM05',
    text: 'When I\u2019m under extreme pressure, I remain completely calm and clearheaded.',
  },
  {
    id: 'IM06',
    text: 'I give equal weight to every person\u2019s input, regardless of their seniority or my prior opinion of their judgment.',
  },
]

// ─── Combined Export ─────────────────────────────────────────────────

export const allBaselineItems = [
  ...behavioralItems,
  ...sjiItems,
  ...imItems,
]
