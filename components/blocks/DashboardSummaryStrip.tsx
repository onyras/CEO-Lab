'use client'

import { ScoreRing } from '@/components/visualizations/ScoreRing'
import { TERRITORY_COLORS, TERRITORY_CONFIG } from '@/lib/constants'
import { getVerbalLabel } from '@/lib/scoring'
import { ARCHETYPE_DESCRIPTIONS } from '@/lib/report-content'
import type { FullResults, Territory } from '@/types/assessment'

interface DashboardSummaryStripProps {
  clmi: number
  label: string
  streak: { currentStreak: number; lastCheckIn: string | null; isDueThisWeek: boolean }
  primaryArchetype?: { name: string } | null
  territoryScores?: { territory: Territory; score: number }[]
}

export function DashboardSummaryStrip({ clmi, label, streak, primaryArchetype, territoryScores }: DashboardSummaryStripProps) {
  const archetypeDesc = primaryArchetype ? ARCHETYPE_DESCRIPTIONS[primaryArchetype.name] : null

  return (
    <div className="bg-white border border-black/10 rounded-lg p-8 mb-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex items-center gap-8">
          <ScoreRing value={clmi} size={96} strokeWidth={6} color="#000" label={label} />
          <div>
            <p className="font-mono text-sm uppercase tracking-[0.12em] text-black/50 mb-2">CLMI Score</p>
            <p className="text-3xl font-bold font-mono tracking-tight text-black">{Math.round(clmi)}%</p>
            <p className="text-base text-black/50 mt-1">{label}</p>
          </div>
        </div>

        {/* Territory mini-bars */}
        {territoryScores && territoryScores.length > 0 && (
          <div className="flex flex-col gap-2 min-w-[180px]">
            {territoryScores.map((ts) => (
              <div key={ts.territory} className="flex items-center gap-2">
                <span className="text-base text-black/60 w-[60px] truncate">
                  {TERRITORY_CONFIG[ts.territory].displayLabel.replace('Leading ', '')}
                </span>
                <div className="flex-1 bg-black/5 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${Math.max(4, ts.score)}%`,
                      backgroundColor: TERRITORY_COLORS[ts.territory],
                    }}
                  />
                </div>
                <span className="text-xs font-mono font-bold text-black w-8 text-right">{Math.round(ts.score)}%</span>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center gap-10">
          <div className="text-center">
            <p className="text-3xl font-bold font-mono text-black">{streak.currentStreak}</p>
            <p className="text-base text-black/60 mt-0.5">Week streak</p>
          </div>
          {streak.lastCheckIn && (
            <div className="text-center">
              <p className="text-base font-medium text-black">
                {new Date(streak.lastCheckIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </p>
              <p className="text-base text-black/60 mt-0.5">Last check-in</p>
            </div>
          )}
        </div>
      </div>

      {primaryArchetype && archetypeDesc && (
        <div className="mt-6 pt-6 border-t border-black/5 flex items-center gap-4">
          <span className="font-mono text-base text-black/60 uppercase tracking-[0.12em]">Primary Archetype</span>
          <span className="inline-flex items-center px-4 py-1.5 bg-[#F7F3ED] rounded-full text-sm font-semibold text-black">
            {primaryArchetype.name}
          </span>
        </div>
      )}
    </div>
  )
}
