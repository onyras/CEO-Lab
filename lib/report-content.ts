// CEO Lab V4 — Report Narrative Content
// All narrative text from CEO_LAB_REPORT_DESIGN_V4.md and CEO_LAB_ASSESSMENT_V4.md
// IMPORTANT: Territory arc narratives and closing text are VERBATIM from the Report Design spec.
// Dimension content (definitions, high/low indicators, cost of ignoring) is VERBATIM from the Assessment spec.

import type { DimensionId, Territory, VerbalLabel } from '@/types/assessment'

// ─── Territory Arc Narratives ────────────────────────────────────
// Report Design Spec, Section 2: "The Three Territories"
// 4 score ranges x 3 territories = 12 narratives

export const TERRITORY_ARC_NARRATIVES: Record<Territory, Record<string, string>> = {
  leading_yourself: {
    critical:  'The inner foundation needs attention. Without this, everything else is built on shifting ground.',
    building:  "You're building self-knowledge, but it hasn't yet become consistent practice under pressure.",
    strong:    'You have a solid inner foundation. The opportunity is deepening it into the kind of presence your team can feel.',
    mastery:   'Your inner work is genuinely strong. This is rare among CEOs and it shows in how people experience you.',
  },
  leading_teams: {
    critical:  'Your team likely feels the gap between your intentions and their daily experience.',
    building:  "You care about your team and it shows, but the systems and conversations that make teams great aren't yet in place.",
    strong:    "Your team is well-led. The next level is the difference between a team that performs and a team that thrives without you.",
    mastery:   "You've built something rare: a team that functions as a genuine leadership collective.",
  },
  leading_organizations: {
    critical:  "Your organization has outgrown its operating system. The structure that got you here won't take you there.",
    building:  "You're beginning to think like an organizational architect, but the blueprints are still incomplete.",
    strong:    "Your organization has real infrastructure. The opportunity now is in the places where strategy, culture, and structure don't yet align.",
    mastery:   "You're building an organization that can outlast any individual, including you. That's the ultimate test of a CEO.",
  },
}

export function getTerritoryArcNarrative(territory: Territory, score: number): string {
  const narratives = TERRITORY_ARC_NARRATIVES[territory]
  if (score <= 40) return narratives.critical
  if (score <= 60) return narratives.building
  if (score <= 80) return narratives.strong
  return narratives.mastery
}

// ─── Dimension Content ───────────────────────────────────────────
// Verbatim from CEO_LAB_ASSESSMENT_V4.md, dimension definitions

export interface DimensionContent {
  behavioralDefinition: string
  highIndicator: string
  lowIndicator: string
  costOfIgnoring: string
  frameworks: string[]
}

export const DIMENSION_CONTENT: Record<DimensionId, DimensionContent> = {
  'LY.1': {
    behavioralDefinition: 'The ability to recognize your own patterns, triggers, reactive tendencies, and blind spots in real time, before they drive your behavior.',
    highIndicator: 'Catches reactive patterns mid-stream. Actively seeks feedback and is rarely surprised by it. Can name their default stress behaviors and watches for them. Recognizes their own contribution to recurring conflicts.',
    lowIndicator: 'Repeatedly ends up in the same type of conflict with different people. Surprised by 360 feedback. Rationalizes reactive behavior as "just how I am." Attributes problems primarily to others or circumstances.',
    costOfIgnoring: "CEOs with low self-awareness make the same leadership mistakes on rotation. They build organizations that reflect their blind spots, and because they can't see those blind spots, they can't diagnose why the same problems keep recurring despite changing personnel.",
    frameworks: ['The Five Drivers', 'The Drama Triangle', 'Above the Line', 'Reactive Patterns Playbook', "Dunning-Kruger / Munger's Inversion"],
  },
  'LY.2': {
    behavioralDefinition: 'The ability to navigate emotions with precision in real time, without being hijacked by them, suppressing them, or confusing empathy with compassion.',
    highIndicator: 'Names specific emotions accurately (not just "stressed" or "fine"). Expresses difficult feelings without blame or sarcasm. Recovers quickly from emotional activation. Offers genuine compassion without absorbing others\' suffering.',
    lowIndicator: 'Suppresses emotions that leak out as irritability, withdrawal, or passive-aggression. Avoids giving honest feedback to protect others\' feelings (idiot compassion). Gets emotionally hijacked and regrets what they said or did. Uses "I\'m fine" as a default.',
    costOfIgnoring: 'Emotional suppression erodes trust (people sense the gap between words and energy), leads to poor decisions under pressure, and eventually manifests as burnout, cynicism, or explosive episodes that damage relationships permanently.',
    frameworks: ['The Wheel of Emotions', 'The 50 Rules of Emotional Mastery', 'The 4 Stages to Compassionate Leadership', 'Emotional Fluidity', 'The Idiot Compassion Trap'],
  },
  'LY.3': {
    behavioralDefinition: 'The cultivation of inner stillness that enables clear perception, full-attention listening, and wise action under pressure, rather than reactive autopilot.',
    highIndicator: 'Maintains a regular contemplative practice. Listens without planning a response. Creates space before important decisions. Remains mentally present during high-stakes conversations. Can distinguish between urgency and importance in real time.',
    lowIndicator: 'Mind races during rest. Constantly multitasks during conversations. Decides immediately under pressure without pausing. Feels mentally scattered. Confuses busyness with productivity.',
    costOfIgnoring: 'Without grounded presence, a CEO is perpetually reactive: making decisions from the last email rather than from strategic intent. The quality of every interaction, every decision, every relationship degrades when the leader cannot be fully present.',
    frameworks: ['The 3 Styles of Meditation', 'The Wheel of Awareness', 'The 5 Enemies of Focus', 'The Wisdom Quadrant', 'The Flywheel of Leadership', 'The Bandwidth Framework'],
  },
  'LY.4': {
    behavioralDefinition: 'Clarity about what drives you, commitment to working from your zone of genius, and deliberate pursuit of mastery on the path only you can walk.',
    highIndicator: 'Spends majority of time on work that uses their deepest talents. Can articulate what they\'re building and why it matters to them personally. Actively practices and refines their craft. Makes life and work decisions from a coherent sense of direction.',
    lowIndicator: "Spends most time on work others could do. Feels pulled in directions that don't align with what matters. Has lost connection to why they started. Confuses being busy with being purposeful. Neglects personal development and relationships.",
    costOfIgnoring: 'A CEO without clear purpose makes decisions by default rather than by design. They drift into roles and responsibilities that don\'t match their strengths, building a company that succeeds financially but feels hollow personally. This is the most common driver of post-exit depression.',
    frameworks: ['Zone of Genius', 'Kodawari', 'The Four Relationships', 'The Dartboard Method', "Musashi's 22 Rules for Mastery"],
  },
  'LY.5': {
    behavioralDefinition: 'The discipline to protect capacity for deep work, manage energy strategically, and sustain excellence over decades rather than sprinting toward burnout.',
    highIndicator: 'Regularly completes deep, uninterrupted work on highest priorities. Manages energy proactively (not just time). Has non-negotiable recovery practices. Says no to low-leverage activities. Operates near optimal stress levels, not too comfortable, not overwhelmed.',
    lowIndicator: 'Calendar is 90% meetings and reactive tasks. Works through exhaustion. No boundaries between work and recovery. Optimizes for output volume rather than output quality. Has been "about to start taking care of myself" for months.',
    costOfIgnoring: "Burnout doesn't arrive as exhaustion. It arrives as cynicism, detachment, and loss of meaning. CEOs who sacrifice sustainability for intensity lose 6-12 months of effective leadership when they inevitably crash, and the recovery period damages the organization more than the slower pace would have.",
    frameworks: ['Deep Work', 'The 80:20 Rule', 'Zurcher Resource Model', 'The 5 Non-Negotiables', 'Yerkes-Dodson Curve'],
  },
  'LT.1': {
    behavioralDefinition: "Creating the conditions where people feel safe enough to tell the truth, bring mistakes forward, and show vulnerability, because trust has been earned through consistent reliability, honesty, and genuine care.",
    highIndicator: 'Team brings bad news early. Direct reports admit mistakes without fear. CEO follows through on commitments or renegotiates proactively. Says "I don\'t know" and "I was wrong" naturally. People believe the CEO has their genuine interests at heart.',
    lowIndicator: "Learns about problems through back channels or too late. People agree in meetings and disagree in hallways. Team members filter what they share. CEO overpromises and under-delivers. Trust is performative rather than felt.",
    costOfIgnoring: "Without trust, everything else is theater. Meetings produce compliance, not truth. Feedback is sanitized. Decisions are made on incomplete information because people withhold what they think the CEO doesn't want to hear. The organization becomes a system optimized for managing the CEO's emotions rather than solving real problems.",
    frameworks: ['The Trust Formula', 'Turn Mistakes Into Trust', "Lencioni's Pyramid", 'Psychological Safety Framework'],
  },
  'LT.2': {
    behavioralDefinition: 'The ability to say what needs to be said, when it needs to be said, in a way that preserves the relationship while addressing the issue honestly.',
    highIndicator: 'Addresses difficult topics within days, not months. Delivers feedback that lands without defensiveness. Listens to understand before responding. Can hold space for someone\'s pain without rescuing them from it. Team members feel challenged and supported simultaneously.',
    lowIndicator: 'Avoids uncomfortable conversations for weeks or months. Feedback is either too blunt (damages relationship) or too soft (doesn\'t land). Listens to respond, not to understand. Uses "the timing isn\'t right" as a recurring excuse. Conversations that should take 10 minutes take 10 weeks of avoidance.',
    costOfIgnoring: 'Every difficult conversation you avoid becomes a more difficult conversation later. The 3-month delay turns a coaching conversation into a performance conversation into a termination conversation. Meanwhile, the rest of the team watches, and learns that avoidance is the cultural norm.',
    frameworks: ['Nonviolent Communication (NVC)', 'The 4 Ways of Listening', 'The Honest Mirror Playbook', 'Radical Candor'],
  },
  'LT.3': {
    behavioralDefinition: "The ability to see beneath surface symptoms to identify what's actually broken in your team, including your own contribution to the dysfunction.",
    highIndicator: "Asks questions that deepen thinking rather than jumping to solutions. Recognizes team dysfunction patterns. Sees own role in team problems. Multiplies rather than diminishes team intelligence.",
    lowIndicator: "Gives answers faster than the team can think. Diagnoses every problem as a people problem or a process problem, never both. Creates dependency rather than capability. Team members come to the CEO for decisions they should make themselves. Treats symptoms repeatedly without addressing root causes.",
    costOfIgnoring: "A CEO who can't diagnose team dysfunction accurately will cycle through the same interventions (hire better people, restructure, add a process) without resolving the underlying pattern. Meanwhile, the best people leave because they can feel that something is off, even if nobody names it.",
    frameworks: ['The 5 Dysfunctions of a Team', 'The 4 Relationship Killers', 'The Self-Reliance Spiral', 'The Multiplier Effect'],
  },
  'LT.4': {
    behavioralDefinition: 'The invisible rules, rhythms, meeting cadences, and accountability structures that define how your team actually works, designed deliberately rather than inherited by default.',
    highIndicator: 'Has a consistent weekly leadership team meeting that produces decisions and accountability. Team knows what "good" looks like for meetings. Off-sites are designed for outcomes, not just bonding. Information flows to the right people at the right time. Decision rights are clear.',
    lowIndicator: "Meetings are unfocused, too frequent, or too rare. No consistent rhythm; everything is ad hoc. Off-sites are annual retreats with no follow-through. Information hoarding or information overload. Nobody is quite sure who decides what.",
    costOfIgnoring: "Without an operating system, a team runs on heroics and habit. Everything depends on the CEO being in the room. Good people waste energy navigating ambiguity that should have been designed away. The team functions at 60% of its potential because the infrastructure for collaboration doesn't exist.",
    frameworks: ['The 4 Meetings Framework', 'Off-Site Design'],
  },
  'LT.5': {
    behavioralDefinition: "Knowing where you end and your team begins. The shift from being the best individual contributor to being the person who builds the conditions for others to do their best work.",
    highIndicator: 'Spends the majority of time working ON the team rather than IN the operations. Leadership team functions as genuine peers who co-lead, not as individual contributors who report upward. Has clearly let go of areas they used to own. Team prioritizes company results over departmental wins.',
    lowIndicator: 'Still the smartest person in every room and acts like it. Leadership team relates to the CEO individually, not to each other. Takes back delegated work when quality drops. Identity is still "the person who does the work" rather than "the person who builds the team." Confuses management with leadership.',
    costOfIgnoring: "This is the most common ceiling for scaling founders. The company cannot grow beyond what the CEO can personally oversee. Every new hire adds coordination cost rather than capacity because the organizational design still assumes the CEO is the hub of every spoke.",
    frameworks: ["Founder's Clarity Framework", 'The 3 Levels of High-Performing Organizations', 'The Team One Principle'],
  },
  'LO.1': {
    behavioralDefinition: 'The ability to make clear choices about where to play and how to win, and to use those choices as a daily decision filter that the entire organization can follow.',
    highIndicator: "Can articulate strategy in one sentence including what they're NOT doing. Declines off-strategy opportunities consistently. Team knows the top 3 priorities and can make decisions against them independently. Strategy is examined and refreshed regularly, not set and forgotten.",
    lowIndicator: "Strategy is vague (\"be the best X\") or absent. Pursues every opportunity. Team members can't articulate priorities consistently. Strategy exists in the CEO's head but hasn't been translated into operational choices. Confuses a business plan with a strategy.",
    costOfIgnoring: 'Without strategic clarity, an organization optimizes in every direction simultaneously, which means it optimizes in no direction. Resources are spread thin, teams make contradictory decisions, and the company wins by luck rather than by design. This is the silent killer of scaling companies.',
    frameworks: ['Organizational Maturity Analysis', 'The 6 Strategy Traps', 'Playing to Win', 'Strategy Masks', "Drucker's Five Questions"],
  },
  'LO.2': {
    behavioralDefinition: 'Designing culture as a system of specific, observable behaviors rather than aspirational values on a wall, and enforcing those behaviors even when it\'s costly.',
    highIndicator: "Culture is defined as behaviors, not abstract values. Addresses culture violations even from high performers. Hires and fires on cultural criteria, not just capability. Understands which of the four culture types their organization inhabits and whether it's the right one. Growth mindset is modeled, not just stated.",
    lowIndicator: "Values exist on the website but nobody references them in decisions. High performers get away with toxic behavior because they deliver results. Culture is \"whatever happened\" rather than \"what we designed.\" Different teams have different cultures based on whoever leads them. New hires absorb norms by osmosis, not by design.",
    costOfIgnoring: "Culture debt compounds like technical debt. Every month of tolerating misaligned behavior teaches the organization that stated values are fiction. The best culture-carriers leave. The most toxic high performers stay. Eventually, the median behavior in the company bears no resemblance to what the founder intended.",
    frameworks: ['The 4 Cultures Model', 'The Ajaz Spectrum of Inclusion', 'Growth Mindset Cultures', 'The Four Quadrants of Organizational Leadership', 'Decision Architecture Playbook'],
  },
  'LO.3': {
    behavioralDefinition: "Choosing and evolving the structures, roles, and systems that allow the organization to scale, matching design to strategy rather than inheriting design from the past.",
    highIndicator: 'Organizational structure has been deliberately redesigned for current size and strategy. Roles are clear with defined decision rights. Continuous improvement is systematic, not episodic. Works effectively with external advisors without creating dependency.',
    lowIndicator: "Org chart reflects the company of 2 years ago. Roles overlap and decision rights are fuzzy. People work around the formal structure to get things done. Has never redesigned reporting lines or team structures. When something breaks, adds a person rather than fixing the design.",
    costOfIgnoring: 'Structure shapes behavior more than strategy does. A company with brilliant strategy and broken structure will execute poorly. People will consistently struggle, not because they lack talent, but because the organizational design creates friction, duplication, and confusion at every turn.',
    frameworks: ['The Five Organizational Paradigms', 'The Role Radar', 'The Kaizen Method', 'Consultant Readiness Playbook'],
  },
  'LO.4': {
    behavioralDefinition: "The awareness that the version of you that built this company must evolve, and the willingness to let go of competencies and identities that no longer serve the organization's growth.",
    highIndicator: "Role looks meaningfully different from 12 months ago. Has successfully navigated at least one major identity transition (operator to manager to leader). Can leave for 2 weeks without the company breaking. Regularly assesses own fitness for the company's current needs. Seeks honest input on whether they're still the right CEO.",
    lowIndicator: "Doing the same work at 100 people as at 20. Hasn't let go of any functional area. Identity is still tied to the original role. Fears becoming irrelevant if they stop doing the work. Avoids the question of whether they're still the right leader for this stage.",
    costOfIgnoring: "This is the most common reason good founders get replaced by their boards. Not because they lack intelligence or ambition, but because they couldn't evolve fast enough. The company outgrew the version of the CEO who built it, and the CEO couldn't see it happening.",
    frameworks: ['The Three Transitions of Growing Organizations', 'The Three Deaths of a CEO', 'The Peter Principle Trap', 'The CEO Test', 'The 5 Criteria for CEO Success'],
  },
  'LO.5': {
    behavioralDefinition: "The ability to manage risk intelligently, lead organizational transformation, maintain effective board governance, and protect what works while building what's next.",
    highIndicator: 'Board relationship is characterized by candor and proactive communication. Balances exploitation of current strengths with exploration of new opportunities. Assesses risk systematically. Can lead organizational change without losing key people or momentum. Stakeholder management is deliberate.',
    lowIndicator: 'Board meetings are performances. Risk is either ignored or paralyzing. Change initiatives are announced and abandoned. Treats board as adversary to manage rather than resource to leverage. Clings to what worked yesterday when the market has already moved.',
    costOfIgnoring: "Companies that can't change die. But companies that change recklessly also die. The skill is holding both: protecting the core while extending into the new. CEOs who can't do this either stagnate into irrelevance or destroy value through unmanaged transformation.",
    frameworks: ['The Onion Theory', 'The Ambidextrous Organization', 'Board of Directors Excellence Playbook', 'Transformation Readiness Playbook', 'The Campaigning Playbook'],
  },
}

// ─── Archetype Descriptions ──────────────────────────────────────
// Based on dimension signatures from Scoring Engine v4.0 Section 6
// and dimension content from Assessment v4.0

export interface ArchetypeDescription {
  name: string
  oneSentence: string
  whatThisLooksLike: string
  whatThisIsCostingYou: string
  theShift: string
  frameworkReferences: string[]
}

export const ARCHETYPE_DESCRIPTIONS: Record<string, ArchetypeDescription> = {
  'Brilliant Bottleneck': {
    name: 'Brilliant Bottleneck',
    oneSentence: 'You see the answer before anyone else, and that speed has become the ceiling for everyone around you.',
    whatThisLooksLike: "You have genuine strategic clarity and sharp self-awareness. You spot solutions faster than your team can formulate the question. But you haven't evolved your role to match your company's needs, you haven't built the diagnostic capacity in your team, and your leader identity is still tied to being the smartest person in the room. The result: everything flows through you.",
    whatThisIsCostingYou: "Your team's capability is capped at your bandwidth. Every decision waits in your queue. The best people on your team are underutilized because they've learned that you'll arrive at the answer first. You're working harder while the organization's capacity stays flat.",
    theShift: "From being the person who solves the problem to being the person who builds the team that solves problems. Start by holding your answer for 48 hours on the next strategic decision and ask your team to bring you their analysis first.",
    frameworkReferences: ["Founder's Clarity Framework", 'The Multiplier Effect', 'The Self-Reliance Spiral'],
  },
  'Empathetic Avoider': {
    name: 'Empathetic Avoider',
    oneSentence: 'Your emotional intelligence is real, but it has become a reason to avoid the conversations that would actually help people grow.',
    whatThisLooksLike: "You score high on Emotional Mastery and Building Trust. People feel genuinely cared for. But hard conversations get delayed or softened, team dysfunction goes undiagnosed because naming it feels unkind, and your leader identity hasn't shifted from caretaker to developer. You confuse empathy with agreement and compassion with avoidance.",
    whatThisIsCostingYou: "The unsaid things in your organization are accumulating. Small issues are compounding into patterns. Your kindest people are burning out because they're compensating for the performance issues you haven't addressed. The team feels safe but stuck.",
    theShift: "From protecting people from discomfort to respecting them enough to be honest. This week, identify the conversation you've been avoiding the longest and schedule it. Use this opener: 'I care about you and this team, which is why I need to share something I've been holding back.'",
    frameworkReferences: ['NVC basics', 'Radical Candor', 'The Idiot Compassion Trap'],
  },
  'Lonely Operator': {
    name: 'Lonely Operator',
    oneSentence: 'You have the drive and stamina to build something significant, but you are doing it increasingly alone.',
    whatThisLooksLike: "Strong purpose and peak performance scores show genuine commitment and energy. But you haven't built the team infrastructure, your leader identity hasn't evolved past operator, you haven't developed your CEO successor skills, and your grounded presence is missing. You run fast and alone.",
    whatThisIsCostingYou: "Isolation is invisible until it's not. You're making decisions without diverse input, missing blind spots that a real leadership team would catch. Your energy is finite and your recovery is insufficient. The company has become dependent on your personal output rather than organizational capability.",
    theShift: "From solo excellence to collective capacity. Start with one area you've been holding alone and genuinely transfer it. Not delegate-and-monitor. Transfer. Then build a 30-minute daily reflection practice to develop the grounded presence that isolation has eroded.",
    frameworkReferences: ['Team One Principle', '4 Meetings Framework', '3 Styles of Meditation'],
  },
  'Polished Performer': {
    name: 'Polished Performer',
    oneSentence: 'The armor that made you successful may now be preventing you from seeing clearly.',
    whatThisLooksLike: "Your self-assessment suggests consistently high performance across most dimensions. However, your Impression Management score indicates a pattern of presenting an idealized self-image. This is not a character flaw. It's a deeply ingrained habit of excellence that makes blind spots invisible.",
    whatThisIsCostingYou: "If the polished self-image is accurate, you're in genuinely strong shape. If it's aspirational rather than actual, then the gap between self-perception and reality is where your biggest growth opportunity hides. The Mirror Check data, if available, will reveal which it is.",
    theShift: "The most courageous move for a Polished Performer is radical honesty with yourself. Consider retaking the assessment with the intent to describe your actual behavior this month, not your best self. The gap between those two versions is where development lives.",
    frameworkReferences: ['Five Drivers (Be Perfect, Be Strong)', 'Above the Line', 'Mirror Check'],
  },
  'Visionary Without Vehicle': {
    name: 'Visionary Without Vehicle',
    oneSentence: 'You see where the company should go with unusual clarity, but the organizational machinery to get there does not exist.',
    whatThisLooksLike: "Strong strategic clarity, self-awareness, and purpose. You know exactly what needs to happen. But organizational architecture is underdeveloped, culture hasn't been designed deliberately, and the team operating system is missing. The vision lives in your head and your passion, not in the company's infrastructure.",
    whatThisIsCostingYou: "Brilliant strategy without organizational capability is just a beautiful plan. Your team is inspired but confused about how to execute. The gap between your vision and the company's ability to deliver it creates frustration on both sides. You keep painting the picture while the canvas keeps tearing.",
    theShift: "From visionary to builder. Spend the next month not on strategy but on structure. One meeting cadence redesign, one role clarity exercise, one cultural behavior definition. The vision is clear. The vehicle needs your attention now.",
    frameworkReferences: ['4 Meetings Framework', 'Role Radar', '4 Cultures Model'],
  },
  'Conscious Leader, Stuck': {
    name: 'Conscious Leader, Stuck',
    oneSentence: 'You have done deep inner work, and now you need to translate it into organizational impact.',
    whatThisLooksLike: "Exceptional self-awareness, emotional mastery, and grounded presence. Your inner game is genuinely strong. But strategic clarity is underdeveloped, organizational architecture hasn't been built, and CEO evolution hasn't happened. You know yourself well but haven't yet translated that knowing into the systems and strategies your company needs.",
    whatThisIsCostingYou: "Self-knowledge without organizational action is personal growth, not leadership growth. Your team respects your character but may be frustrated by the lack of direction, structure, or strategic decisiveness. The company needs the leader you are on the inside to show up on the outside.",
    theShift: "From inner work to outer architecture. Pick one organizational dimension this quarter: strategic clarity, org architecture, or CEO evolution. Apply the same discipline you brought to your personal development to building organizational infrastructure.",
    frameworkReferences: ["Drucker's Five Questions", 'Five Organizational Paradigms', 'Three Transitions'],
  },
  'Firefighter': {
    name: 'Firefighter',
    oneSentence: 'You thrive in crisis and your energy is real, but the fires you fight are ones your organization should have designed away.',
    whatThisLooksLike: "High peak performance and emotional mastery: you handle pressure well and keep your composure. But organizational architecture is underdeveloped, the team operating system doesn't exist, and grounded presence is low. You're excellent in the moment but the moments keep recurring because the underlying systems are broken.",
    whatThisIsCostingYou: "Firefighting feels productive. It's not. Every fire you fight is a system you haven't built. Your team has learned to wait for you to arrive rather than prevent the fire. Your energy sustains this pattern, but it's a declining asset.",
    theShift: "After the next fire, don't move on. Stop and ask: what system would prevent this from recurring? Then build that system. Trade 10% of your firefighting time for infrastructure, and within a quarter, the fires will halve.",
    frameworkReferences: ['4 Meetings Framework', 'Role Radar', '5 Enemies of Focus'],
  },
  'Democratic Idealist': {
    name: 'Democratic Idealist',
    oneSentence: 'You genuinely believe in your team and that belief has become a reason to avoid the hard choices only a CEO can make.',
    whatThisLooksLike: "High on Building Trust and Diagnosing the Real Problem. You understand people and you see what's really happening. But strategic clarity is lacking, hard conversations are avoided, and your leader identity hasn't evolved to include the authority your role requires. Consensus feels right. Direction feels uncomfortable.",
    whatThisIsCostingYou: "Your team is well-understood but under-led. Decisions take too long because everything requires consensus. The people who want clear direction are frustrated. The absence of strategic clarity means the team's good instincts don't have a north star to align around.",
    theShift: "Leadership is not the opposite of democracy. It's the responsibility to make the calls that consensus cannot. This week, identify one decision you've been running through consensus that should be yours alone. Make it. Communicate the reasoning. Observe what happens.",
    frameworkReferences: ["Drucker's Five Questions", 'Radical Candor', "Founder's Clarity"],
  },
  'Scaling Wall': {
    name: 'Scaling Wall',
    oneSentence: 'You have the energy, purpose, and trust of your team, but the company has outgrown the way you lead.',
    whatThisLooksLike: "Strong personal performance, clear purpose, and genuine team trust. But CEO evolution hasn't happened, team dysfunction goes undiagnosed, leader identity hasn't shifted, and organizational architecture is underdeveloped. What got you here is genuinely good. It just isn't what gets you there.",
    whatThisIsCostingYou: "The company is hitting a ceiling that feels like a people problem but is actually a structural problem. You're working harder for the same results. Good people are leaving not because they don't believe in you, but because the organization can't give them what they need to grow.",
    theShift: "Acknowledge that the scaling wall is a design problem, not an effort problem. Working harder won't help. What will help: redesigning your role, building organizational infrastructure, and developing your leadership team's diagnostic capability.",
    frameworkReferences: ['Three Transitions', 'Five Organizational Paradigms', 'Self-Reliance Spiral'],
  },
  'Strategy Monk': {
    name: 'Strategy Monk',
    oneSentence: 'Your strategic mind and inner composure are genuine strengths, but people experience you as distant from the relational work of leading.',
    whatThisLooksLike: "Exceptional strategic clarity, grounded presence, self-awareness, and purpose. You think clearly and act calmly. But hard conversations are avoided, the team operating system hasn't been built, and culture hasn't been designed. You lead through ideas and presence rather than through the messy, human work of conversations, feedback, and cultural enforcement.",
    whatThisIsCostingYou: "Your team respects your mind but may not feel connected to you as a leader. The gap between strategic brilliance and relational engagement means great strategy with mediocre execution. Culture is forming by default because you haven't shaped it by design.",
    theShift: "Strategy without relationships is a document. Leadership is the bridge between the two. This month, schedule a one-on-one with every direct report focused entirely on their experience, not strategy. Ask: 'What am I not seeing about how this team works?'",
    frameworkReferences: ['NVC basics', '4 Meetings Framework', '4 Cultures Model'],
  },
  'Governance Orphan': {
    name: 'Governance Orphan',
    oneSentence: 'You have built strong internal trust and systems, but the board relationship is either neglected or adversarial.',
    whatThisLooksLike: "Strong on Building Trust, Team Operating System, and Strategic Clarity internally. But Leading Change, especially board governance, is underdeveloped. You may treat the board as an obligation to manage rather than a resource to leverage. External stakeholder management feels foreign compared to the internal leadership you excel at.",
    whatThisIsCostingYou: "Board meetings are performances rather than strategic dialogues. You're not getting the value your board could provide. Worse, the lack of candid board communication means surprises travel in both directions, and surprises at the board level are expensive.",
    theShift: "Treat your board relationship with the same intentionality you bring to your team. Start with one honest conversation with your board chair about what you actually need from them. Not what you think they want to hear.",
    frameworkReferences: ['Board Excellence Playbook', 'Onion Theory', 'Transformation Readiness'],
  },
  'Accidental Culture': {
    name: 'Accidental Culture',
    oneSentence: 'You build strategy and evolve yourself, but the culture of your organization has been left to chance.',
    whatThisLooksLike: "Strong strategic clarity, CEO evolution, and peak performance. You're personally developing and the company direction is clear. But culture hasn't been designed, trust isn't where it needs to be, and team dysfunction goes undiagnosed. The organization runs on your strategic strength while the human infrastructure develops by accident.",
    whatThisIsCostingYou: "The culture that formed by accident probably reflects some of your blind spots. High performers with misaligned values are being tolerated. New hires absorb norms by osmosis that you wouldn't design deliberately. The gap between your strategic clarity and cultural reality is a growing liability.",
    theShift: "Spend one month treating culture with the same rigor you apply to strategy. Define 3-5 specific behaviors (not values) that you want to be true. Then hold yourself and your team accountable to them, especially when it costs you a high performer.",
    frameworkReferences: ['4 Cultures Model', 'Trust Formula', '5 Dysfunctions diagnostic'],
  },
}

// ─── IM Handling Text ────────────────────────────────────────────
// Verbatim from Report Design Spec, "IMPRESSION MANAGEMENT HANDLING"

export const IM_HANDLING = {
  headlineAdvisory: 'A note on your responses: Your answers show a pattern of consistently positive self-assessment across multiple areas. This is common among high-performing CEOs, where projecting strength becomes a habit. However, this assessment is most useful when it captures your actual behavior, not your aspirations. If you feel this describes you, consider retaking the assessment with the intent to be radically honest about what your day actually looks like.',

  priorityFrameworkNote: 'Based on your response pattern, we recommend exploring the Five Drivers framework (especially "Be Perfect" and "Be Strong") and the Above the Line model (honest self-location) as additional starting points.',

  archetypeNote: "The pattern below may become clearer with a more candid self-assessment. The Polished Performer isn't a criticism. It's a recognition that the armor that served you well may now be limiting what you can see.",

  mirrorElevation: 'Because your self-report shows signs of idealization, your rater\'s perspective is especially valuable in this assessment. Pay particular attention to the gaps below.',
}

// ─── Closing Section Text ────────────────────────────────────────
// Verbatim from Report Design Spec, Section 8

export const CLOSING_TEXT = "This report is a mirror, not a verdict. It shows where you are right now, shaped by the demands you face, the habits you've built, and the phase your company is in. None of it is fixed. The CEOs who grow fastest aren't the ones who score highest. They're the ones who see clearly, accept what they see, and do the work.\n\nThat's what the next 90 days are for."

// ─── Blind Spot Section Text ─────────────────────────────────────
// From Report Design Spec, Section 6

export const BLIND_SPOT_CLOSING = "Blind spots are not character flaws. They're information gaps. The most useful thing you can do with this data is have a 30-minute conversation with your rater about the dimensions with the largest gaps. Not to debate the scores, but to understand what they see."

// ─── Headline Section Helpers ────────────────────────────────────
// From Report Design Spec, Section 1

export function buildHeadlineText(
  clmi: number,
  label: VerbalLabel,
  territories: { territory: Territory; score: number; label: VerbalLabel }[]
): string {
  const sorted = [...territories].sort((a, b) => b.score - a.score)
  const strongest = sorted[0]
  const weakest = sorted[sorted.length - 1]

  const territoryLabels: Record<Territory, string> = {
    leading_yourself: 'Leading Yourself',
    leading_teams: 'Leading Teams',
    leading_organizations: 'Leading Organizations',
  }

  return `This places you in the "${label}" range. Your strongest territory is ${territoryLabels[strongest.territory]} (${Math.round(strongest.score)}%). Your biggest opportunity for growth is in ${territoryLabels[weakest.territory]} (${Math.round(weakest.score)}%).`
}

export function buildBsiHeadlineText(bsi: number): string {
  if (bsi <= 10) {
    return `Your Blind Spot Index of ${bsi.toFixed(0)} suggests strong self-awareness, with close alignment between how you see yourself and how your rater sees you.`
  }
  if (bsi <= 20) {
    return `Your Blind Spot Index of ${bsi.toFixed(0)} suggests moderate self-awareness, with some gaps between how you see yourself and how your rater sees you.`
  }
  if (bsi <= 30) {
    return `Your Blind Spot Index of ${bsi.toFixed(0)} suggests notable blind spots, with meaningful gaps between how you see yourself and how your rater sees you. Section 6 of this report explores where those gaps are sharpest.`
  }
  return `Your Blind Spot Index of ${bsi.toFixed(0)} suggests a significant self-perception gap. Your rater sees your leadership quite differently from how you see it. Section 6 of this report explores where those gaps are sharpest.`
}

// ─── Hook Report Helpers ─────────────────────────────────────────
// From Report Design Spec, "HOOK ASSESSMENT REPORT"

export function buildHookInsight(
  dimensionName: string,
  score: number,
  isLow: boolean
): string {
  if (isLow) {
    return `Your lowest signal is in ${dimensionName}. CEOs who score similarly here often find this becomes a recurring friction point. The full assessment will show you exactly what's driving this and what to do about it.`
  }
  return `Your strongest signal is in ${dimensionName}. This is a genuine strength. The question the full assessment answers: is this strength being fully translated into how your team and organization experience you?`
}

export const HOOK_NEXT_STEP = 'This snapshot covers 10 of the 96 questions in the full CEO Leadership Assessment. The full version reveals your complete pattern across 15 dimensions, your leadership archetype, and a personalized 90-day development roadmap.'

// ─── Stage 1 Preview Helpers ─────────────────────────────────────
// From Report Design Spec, "STAGE 1 PREVIEW REPORT"

export const STAGE1_CTA = "You're 25 minutes from your complete leadership profile. Continue to Stage 2."

// ─── Tone Calibration ────────────────────────────────────────────
// From Report Design Spec, "LANGUAGE AND TONE GUIDE"

export function getToneGuidance(percentage: number): string {
  if (percentage <= 20) return 'This is costing you. Here is what to do.'
  if (percentage <= 40) return 'The pattern is clear and the path forward is concrete.'
  if (percentage <= 60) return "You're on the right track. Consistency is the challenge now."
  if (percentage <= 80) return 'This is working. The next level looks like...'
  return 'This is rare and it shows in how people experience you.'
}

// ─── Color Coding ────────────────────────────────────────────────
// From Report Design Spec, Section 3

export function getDimensionColor(percentage: number): string {
  if (percentage <= 20) return '#E57373'  // Red — Reactive
  if (percentage <= 40) return '#E57373'  // Red — Awakening
  if (percentage <= 60) return '#FFB74D'  // Amber — Practicing
  if (percentage <= 80) return '#81C784'  // Green — Consistent
  return '#7FABC8'                        // Blue — Mastered
}
