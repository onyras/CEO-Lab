'use client'

import { useEffect, useState } from 'react'
import { TERRITORY_COLORS, TERRITORY_CONFIG, getDimension } from '@/lib/constants'
import { getFrameworkPrescription, getVerbalLabel } from '@/lib/scoring'
import { DIMENSION_CONTENT } from '@/lib/report-content'
import { getFrameworkByName } from '@/lib/framework-content'
import { generateCoachingInterventions } from '@/lib/coaching-interventions'
import type { DimensionScore, DimensionId, Territory } from '@/types/assessment'

// ---------------------------------------------------------------------------
// Coaching Interventions ("If I Were Your Coach")
// ---------------------------------------------------------------------------

function CoachingSection({ dimensionScores }: { dimensionScores: DimensionScore[] }) {
  const interventions = generateCoachingInterventions(dimensionScores)

  if (interventions.length === 0) return null

  return (
    <div className="bg-white rounded-lg p-6 md:p-8 border border-black/10">
      <h3 className="text-lg font-bold text-black mb-1">If I Were Your Coach</h3>
      <p className="text-sm text-black/50 mb-6">
        Three interventions I'd prioritize based on your assessment.
      </p>
      <div className="space-y-5">
        {interventions.map((intervention, i) => {
          const dim = getDimension(intervention.dimensionId)
          const color = TERRITORY_COLORS[dim.territory]

          return (
            <div
              key={intervention.dimensionId}
              className="border-l-3 pl-5"
              style={{ borderLeftWidth: 3, borderLeftColor: color }}
            >
              <div className="flex items-center gap-3 mb-2">
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ backgroundColor: color }}
                >
                  {i + 1}
                </span>
                <h4 className="text-sm font-semibold text-black">{intervention.dimensionName}</h4>
              </div>
              <div className="grid md:grid-cols-2 gap-3 mb-2">
                <div>
                  <p className="text-[10px] text-black/40 uppercase tracking-wider mb-0.5">Current State</p>
                  <p className="text-xs text-black/60 leading-relaxed">{intervention.currentState}</p>
                </div>
                <div>
                  <p className="text-[10px] text-black/40 uppercase tracking-wider mb-0.5">Target State</p>
                  <p className="text-xs text-black/60 leading-relaxed">{intervention.targetState}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="text-black/40">
                  Framework: <span className="font-medium text-black/70">{intervention.framework}</span>
                </span>
                <span className="text-black/40">
                  Timeline: <span className="font-medium text-black/70">{intervention.timeline}</span>
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Growth Plan Tab
// ---------------------------------------------------------------------------

interface GrowthPlanTabProps {
  dimensionScores: DimensionScore[]
  priorityDimensions: DimensionId[]
}

export function GrowthPlanTab({ dimensionScores, priorityDimensions }: GrowthPlanTabProps) {
  // Determine primary focus: quarterly focus from localStorage, or fallback to top 3 priorities
  const [focusDimensions, setFocusDimensions] = useState<DimensionId[]>([])
  const [isQuarterlyFocus, setIsQuarterlyFocus] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('aa_focus_dimensions')
      if (stored) {
        const parsed = JSON.parse(stored) as DimensionId[]
        if (Array.isArray(parsed) && parsed.length > 0) {
          setFocusDimensions(parsed.slice(0, 3))
          setIsQuarterlyFocus(true)
          return
        }
      }
    } catch {
      // ignore parse errors
    }
    setFocusDimensions(priorityDimensions.slice(0, 3))
    setIsQuarterlyFocus(false)
  }, [priorityDimensions])

  // Build primary focus cards data
  const primaryCards = focusDimensions.map(dimId => {
    const dim = getDimension(dimId)
    const score = dimensionScores.find(ds => ds.dimensionId === dimId)
    const percentage = score?.percentage ?? 0
    const verbalLabel = score?.verbalLabel ?? getVerbalLabel(percentage)
    const frameworks = getFrameworkPrescription(dimId, percentage)
    const content = DIMENSION_CONTENT[dimId]
    const costOfIgnoring = content?.costOfIgnoring ?? ''
    // Extract first sentence for "Why This Matters"
    const firstSentence = costOfIgnoring.split(/(?<=\.)\s/)[0] || costOfIgnoring

    return {
      dimensionId: dimId,
      dimensionName: dim.name,
      territory: dim.territory,
      coreQuestion: dim.coreQuestion,
      percentage,
      verbalLabel,
      firstSentence,
      frameworks: frameworks.map(fw => ({
        name: fw,
        content: getFrameworkByName(fw),
      })),
    }
  })

  // Build "Other Growth Areas" — remaining dimensions grouped by territory
  const focusSet = new Set(focusDimensions)
  const territories: Territory[] = ['leading_yourself', 'leading_teams', 'leading_organizations']
  const otherByTerritory = territories.map(t => {
    const config = TERRITORY_CONFIG[t]
    const color = TERRITORY_COLORS[t]
    const dims = dimensionScores
      .filter(ds => !focusSet.has(ds.dimensionId) && getDimension(ds.dimensionId).territory === t)
    return { territory: t, label: config.displayLabel, color, dims }
  }).filter(g => g.dims.length > 0)

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="bg-white rounded-lg p-8 md:p-10 border border-black/10">
        <h2 className="text-xl font-bold text-black mb-2">
          Your Growth Plan
        </h2>
        <p className="text-sm text-black/50 leading-relaxed max-w-lg">
          {isQuarterlyFocus
            ? 'Based on your quarterly focus — the dimensions you chose to prioritize this quarter.'
            : 'Based on your assessment priorities — the areas with the most room for growth.'}
        </p>
      </div>

      {/* If I Were Your Coach */}
      <CoachingSection dimensionScores={dimensionScores} />

      {/* Primary Focus Cards */}
      <div className="space-y-4">
        <p className="text-xs font-semibold text-black/40 uppercase tracking-wider px-1">Primary Focus</p>
        {primaryCards.map(card => {
          const color = TERRITORY_COLORS[card.territory]
          return (
            <div
              key={card.dimensionId}
              className="bg-white rounded-lg p-6 border border-black/10"
              style={{ borderLeftWidth: 3, borderLeftColor: color }}
            >
              {/* Badge + score */}
              <div className="flex items-start justify-between mb-3">
                <span
                  className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: `${color}15`,
                    color,
                  }}
                >
                  {isQuarterlyFocus ? 'Quarterly Focus' : 'Priority Area'}
                </span>
                <span className="text-xs text-black/40">
                  {card.verbalLabel} · {Math.round(card.percentage)}% capacity
                </span>
              </div>

              {/* Dimension name */}
              <h3 className="text-lg font-semibold text-black mb-1">{card.dimensionName}</h3>

              {/* Core question */}
              <p className="text-sm italic text-black/40 mb-4">{card.coreQuestion}</p>

              {/* Why this matters */}
              <div className="mb-4">
                <p className="text-xs font-semibold text-black/40 uppercase tracking-wider mb-1">Why This Matters</p>
                <p className="text-sm text-black/60 leading-relaxed">{card.firstSentence}</p>
              </div>

              {/* Prescribed frameworks */}
              {card.frameworks.length > 0 && (
                <div className="space-y-2">
                  {card.frameworks.map(fw => (
                    <div key={fw.name} className="flex items-center justify-between">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-black">{fw.name}</p>
                        {fw.content && (
                          <p className="text-xs text-black/40 truncate">{fw.content.tagline}</p>
                        )}
                      </div>
                      {fw.content ? (
                        <a
                          href={`/frameworks/${fw.content.id}`}
                          className="flex-shrink-0 ml-4 inline-flex items-center gap-1 text-xs font-medium text-black hover:text-black/70 transition-colors"
                        >
                          Learn more
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </a>
                      ) : (
                        <span className="flex-shrink-0 ml-4 text-[10px] text-black/30">Coming soon</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Other Growth Areas */}
      {otherByTerritory.length > 0 && (
        <div className="bg-white rounded-lg p-8 border border-black/10">
          <h3 className="text-sm font-semibold text-black/40 uppercase tracking-wider mb-6">Other Growth Areas</h3>

          <div className="space-y-8">
            {otherByTerritory.map(group => (
              <div key={group.territory}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: group.color }} />
                  <h4 className="text-sm font-semibold text-black">{group.label}</h4>
                </div>

                <div className="space-y-3">
                  {group.dims.map(dim => {
                    const dimDef = getDimension(dim.dimensionId)
                    const percentage = Math.round(dim.percentage)
                    const frameworks = getFrameworkPrescription(dim.dimensionId, percentage)

                    return (
                      <div key={dim.dimensionId} className="pl-5 border-l-2" style={{ borderColor: `${group.color}30` }}>
                        <div className="flex items-center justify-between mb-1.5">
                          <p className="text-sm font-medium text-black">{dimDef.name}</p>
                          <span className="text-xs text-black/40">{dim.verbalLabel} · {percentage}% capacity</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {frameworks.map(fw => {
                            const fwContent = getFrameworkByName(fw)
                            return fwContent ? (
                              <a
                                key={fw}
                                href={`/frameworks/${fwContent.id}`}
                                className="inline-block px-2.5 py-1 text-xs font-medium text-black bg-[#F7F3ED] rounded-full hover:bg-[#F7F3ED]/80 transition-colors"
                              >
                                {fw}
                              </a>
                            ) : (
                              <span
                                key={fw}
                                className="inline-block px-2.5 py-1 text-xs text-black/50 border border-black/10 rounded-full"
                              >
                                {fw}
                              </span>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Coaching CTA */}
      <div className="bg-white rounded-lg p-8 border border-black/10 text-center">
        <h3 className="text-lg font-semibold text-black mb-2">Want Guided Support?</h3>
        <p className="text-sm text-black/50 mb-6 max-w-sm mx-auto">
          Work through your growth plan with Niko in a focused coaching session.
        </p>
        <a
          href="https://cal.com/nikolaskonstantin"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-black text-white px-8 py-3.5 rounded-lg text-sm font-semibold hover:bg-black/90 transition-colors"
        >
          Book a Session
        </a>
      </div>
    </div>
  )
}
