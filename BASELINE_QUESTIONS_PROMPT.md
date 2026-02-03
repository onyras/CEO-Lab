# Prompt: Draft 100 Baseline Assessment Questions

I need you to draft 100 baseline assessment questions for CEO Lab based on the existing structure.

## Context

**Project:** CEO Lab - Premium leadership assessment platform for founders/CEOs
**Pricing:** €100/month subscription
**Target:** First-time founders, technical specialists now leading teams, high-earning entrepreneurs

## Existing Structure

I have a complete architecture in `/project_documents/content/baseline_assessment_sub_dimension_map.md.md` that defines:
- 18 sub-dimensions across 3 territories
- Exactly what each question should measure
- Which frameworks each sub-dimension maps to

**Territories:**
1. Leading Yourself (32 questions across 6 sub-dimensions)
2. Leading Teams (35 questions across 6 sub-dimensions)
3. Leading Organizations (33 questions across 6 sub-dimensions)

## Reference Format

I already have 12 hook questions coded in `/lib/hook-questions.ts`. Use the SAME format, structure, and tone for the 100 baseline questions.

**Example from hook questions:**
```typescript
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
}
```

## Scoring

- Each question: 1-5 points (not 1-4 like hook questions)
- Options should progress from low competency (1) to high competency (5)
- Use behavioral, specific language (not abstract concepts)
- Make answers measurable where possible

## Tone & Style

- **Direct, behavioral language** ("How many times did you..." not "Do you believe in...")
- **Specific over abstract** (Concrete numbers/frequencies over feelings)
- **CEO-level examples** (Board meetings, strategy, leadership team dynamics)
- **Honest, not aspirational** (Make it safe to admit current reality)
- **Match the hook assessment tone** (Clear, punchy, real-world scenarios)

## Your Task

1. Read `/project_documents/content/baseline_assessment_sub_dimension_map.md.md`
2. Read `/lib/hook-questions.ts` for format and tone reference
3. Draft all 100 questions in TypeScript format matching the hook questions structure
4. Follow the exact sub-dimension breakdown (32 + 35 + 33 = 100)
5. Each question maps to the "Question Focus" defined in the structure file

## Output Format

Create a TypeScript file `/lib/baseline-questions.ts` with:

```typescript
import { BaselineQuestion } from '@/types/assessment'

export const baselineQuestions: BaselineQuestion[] = [
  // TERRITORY 1: LEADING YOURSELF (32 questions)

  // 1.1 Energy Management (5 questions)
  {
    id: 1,
    territory: 'yourself',
    subdimension: 'Energy Management',
    question: '...',
    options: [
      { text: '...', value: 1 },
      { text: '...', value: 2 },
      { text: '...', value: 3 },
      { text: '...', value: 4 },
      { text: '...', value: 5 }
    ]
  },
  // ... continue for all 100 questions
]
```

## Type Definition

Also create the type definition in `/types/assessment.ts`:

```typescript
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
```

## Quality Checklist

- [ ] Each question is behavioral and specific
- [ ] 5-point scale (1 = low competency, 5 = high competency)
- [ ] Progression makes sense (each answer is clearly better than previous)
- [ ] Language matches CEO/founder context
- [ ] Tone matches hook assessment
- [ ] Total: 100 questions (32 + 35 + 33)
- [ ] All sub-dimensions covered per structure file
- [ ] TypeScript format matches hook-questions.ts exactly

## Start Here

Read these files first:
1. `/Users/acai/Documents/AI Agent/nk/projects/09_ceo_lab/project_documents/content/baseline_assessment_sub_dimension_map.md.md`
2. `/Users/acai/Documents/AI Agent/nk/projects/09_ceo_lab/lib/hook-questions.ts`

Then draft all 100 questions.
