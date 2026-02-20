'use client'

import { ScoreRing } from '@/components/visualizations/ScoreRing'
import { getVerbalLabel } from '@/lib/scoring'

interface QuarterInfo {
  quarter: number
  year: number
  clmi: number | null
  completedAt: string | null
  isCurrent: boolean
}

interface QuarterlyAssessmentGridProps {
  quarterlyAssessments: QuarterInfo[]
}

export function QuarterlyAssessmentGrid({ quarterlyAssessments }: QuarterlyAssessmentGridProps) {
  return (
    <div className="mb-16">
      <div className="flex items-end justify-between pb-5 border-b border-black/10 mb-8">
        <div>
          <p className="font-mono text-sm uppercase tracking-[0.12em] text-black/50 mb-2">Quarterly Assessments</p>
          <h2 className="text-2xl font-semibold tracking-tight">Baseline Assessments</h2>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {quarterlyAssessments.map((qi) => {
          const qLabel = `Q${qi.quarter} ${qi.year}`
          const key = `${qi.year}-${qi.quarter}`

          if (qi.clmi != null && qi.completedAt) {
            const verbal = getVerbalLabel(qi.clmi)
            const dateStr = new Date(qi.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            return (
              <div key={key} className="bg-white border border-black/10 rounded-lg p-8">
                <p className="font-mono text-sm uppercase tracking-[0.12em] text-black/50 mb-5">{qLabel}</p>
                <div className="flex items-center gap-5">
                  <ScoreRing value={qi.clmi} size={64} strokeWidth={5} color="#000" />
                  <div>
                    <p className="text-3xl font-bold font-mono tracking-tight">{Math.round(qi.clmi)}%</p>
                    <p className="text-base text-black/50">{verbal}</p>
                  </div>
                </div>
                <p className="text-xs text-black/35 mt-5 font-mono uppercase tracking-[0.08em]">Completed {dateStr}</p>
              </div>
            )
          }

          if (qi.isCurrent) {
            return (
              <a key={key} href="/assessment/baseline" className="block bg-black text-white rounded-lg p-8 hover:bg-black/90 transition-colors">
                <p className="font-mono text-xs uppercase tracking-[0.12em] text-white/40 mb-5">{qLabel}</p>
                <p className="text-xl font-semibold mb-2">Take Assessment</p>
                <p className="text-sm text-white/50">96 questions · ~25 min</p>
              </a>
            )
          }

          return (
            <div key={key} className="bg-black/[0.02] border border-black/5 rounded-lg p-8">
              <p className="font-mono text-xs uppercase tracking-[0.12em] text-black/20 mb-5">{qLabel}</p>
              <p className="text-sm text-black/20">Skipped</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
