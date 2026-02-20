'use client'

import { useEffect, useState } from 'react'
import { TERRITORY_COLORS, TERRITORY_CONFIG, getDimension } from '@/lib/constants'
import { getFrameworkPrescription, getVerbalLabel } from '@/lib/scoring'
import { DIMENSION_CONTENT, CLOSING_TEXT } from '@/lib/report-content'
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
    <section className="bg-white rounded-lg p-8 md:p-12 border border-black/10">
      <p className="font-mono text-xs uppercase tracking-[0.12em] text-black/40 mb-2">
        Personalized Guidance
      </p>
      <h3 className="text-2xl font-bold text-black mb-2">If I Were Your Coach</h3>
      <p className="text-sm text-black/50 mb-8 max-w-lg">
        Three interventions I would prioritize based on your assessment. These are the moves that would create the most leverage.
      </p>
      <div className="space-y-6">
        {interventions.map((intervention, i) => {
          const dim = getDimension(intervention.dimensionId)
          const color = TERRITORY_COLORS[dim.territory]

          return (
            <div
              key={intervention.dimensionId}
              className="pl-6"
              style={{ borderLeftWidth: 3, borderLeftColor: color, borderLeftStyle: 'solid' }}
            >
              <div className="flex items-center gap-3 mb-3">
                <span
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ backgroundColor: color }}
                >
                  {i + 1}
                </span>
                <h4 className="text-base font-semibold text-black">{intervention.dimensionName}</h4>
              </div>
              <div className="grid md:grid-cols-2 gap-4 mb-3">
                <div>
                  <p className="font-mono text-[10px] text-black/40 uppercase tracking-wider mb-1">Current State</p>
                  <p className="text-sm text-black/60 leading-relaxed">{intervention.currentState}</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] text-black/40 uppercase tracking-wider mb-1">Target State</p>
                  <p className="text-sm text-black/60 leading-relaxed">{intervention.targetState}</p>
                </div>
              </div>
              <div className="flex items-center gap-6 text-xs">
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
    </section>
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

    // Target: move to next verbal label tier
    let target = Math.min(100, Math.round(percentage + 20))
    if (percentage <= 20) target = 40
    else if (percentage <= 40) target = 60
    else if (percentage <= 60) target = 80
    else target = Math.min(100, Math.round(percentage + 10))

    return {
      dimensionId: dimId,
      dimensionName: dim.name,
      territory: dim.territory,
      coreQuestion: dim.coreQuestion,
      percentage: Math.round(percentage),
      verbalLabel,
      target,
      targetLabel: getVerbalLabel(target),
      costOfIgnoring: content?.costOfIgnoring ?? '',
      frameworks: frameworks.map(fw => ({
        name: fw,
        content: getFrameworkByName(fw),
      })),
      allFrameworks: content?.frameworks ?? [],
    }
  })

  // Build "Other Growth Areas"
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
    <div className="space-y-8">
      {/* Hero */}
      <section className="bg-white rounded-lg p-8 md:p-12 border border-black/10">
        <p className="font-mono text-xs uppercase tracking-[0.12em] text-black/40 mb-2">
          Your Path Forward
        </p>
        <h2 className="text-2xl font-bold text-black mb-2">Your Growth Plan</h2>
        <p className="text-sm text-black/50 leading-relaxed max-w-xl">
          {isQuarterlyFocus
            ? 'Based on the dimensions you chose to prioritize this quarter. Each area includes your current score, your target, and the specific frameworks to get there.'
            : 'Based on your assessment priorities — the areas with the most room for growth. Each area includes your current score, your target, and the specific frameworks to get there.'}
        </p>
      </section>

      {/* If I Were Your Coach */}
      <CoachingSection dimensionScores={dimensionScores} />

      {/* Priority Dimension Cards */}
      <section>
        <p className="font-mono text-xs uppercase tracking-[0.12em] text-black/40 mb-4 px-1">
          Priority Dimensions
        </p>

        <div className="space-y-6">
          {primaryCards.map(card => {
            const color = TERRITORY_COLORS[card.territory]

            return (
              <div
                key={card.dimensionId}
                className="bg-white rounded-lg p-8 border border-black/10"
                style={{ borderLeftWidth: 3, borderLeftColor: color }}
              >
                {/* Badge + territory */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="text-[10px] font-medium px-3 py-1 rounded-full"
                    style={{
                      backgroundColor: `${color}15`,
                      color,
                    }}
                  >
                    {isQuarterlyFocus ? 'Quarterly Focus' : 'Priority Area'}
                  </span>
                  <span className="text-xs text-black/40">
                    {TERRITORY_CONFIG[card.territory].displayLabel}
                  </span>
                </div>

                {/* Dimension name + question */}
                <h3 className="text-xl font-semibold text-black mb-1">{card.dimensionName}</h3>
                <p className="text-sm italic text-black/40 mb-6">{card.coreQuestion}</p>

                {/* Current vs Target */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div className="bg-[#F7F3ED]/50 rounded-lg p-5 text-center">
                    <p className="font-mono text-[10px] text-black/40 uppercase tracking-wider mb-2">Current</p>
                    <p className="text-3xl font-bold text-black">{card.percentage}%</p>
                    <p className="text-xs text-black/40 mt-1">{card.verbalLabel}</p>
                  </div>
                  <div className="rounded-lg p-5 text-center" style={{ backgroundColor: `${color}08` }}>
                    <p className="font-mono text-[10px] uppercase tracking-wider mb-2" style={{ color }}>Target</p>
                    <p className="text-3xl font-bold" style={{ color }}>{card.target}%</p>
                    <p className="text-xs mt-1" style={{ color, opacity: 0.7 }}>{card.targetLabel}</p>
                  </div>
                </div>

                {/* Why This Matters */}
                <div className="mb-6">
                  <p className="font-mono text-xs uppercase tracking-[0.12em] text-black/40 mb-2">Why This Matters</p>
                  <p className="text-sm text-black/60 leading-relaxed">{card.costOfIgnoring}</p>
                </div>

                {/* Prescribed Frameworks */}
                {card.frameworks.length > 0 && (
                  <div className="mb-4">
                    <p className="font-mono text-xs uppercase tracking-[0.12em] text-black/40 mb-3">Prescribed Frameworks</p>
                    <div className="space-y-3">
                      {card.frameworks.map(fw => (
                        <div key={fw.name} className="flex items-center justify-between p-4 bg-[#F7F3ED]/50 rounded-lg">
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-black">{fw.name}</p>
                            {fw.content && (
                              <p className="text-xs text-black/40 mt-0.5">{fw.content.tagline}</p>
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
                            <span className="flex-shrink-0 ml-4 inline-flex items-center gap-1.5 text-[10px] text-black/30 bg-black/[0.04] px-3 py-1.5 rounded-full">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#E08F6A]/50" />
                              Workshop: Coming Soon
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Full framework library */}
                {card.allFrameworks.length > 0 && (
                  <div>
                    <p className="text-xs text-black/40 mb-2">Full framework library for {card.dimensionName}:</p>
                    <div className="flex flex-wrap gap-2">
                      {card.allFrameworks.map(fw => (
                        <span key={fw} className="inline-block px-3 py-1.5 text-xs text-black/60 border border-black/10 rounded-full">{fw}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* Other Growth Areas */}
      {otherByTerritory.length > 0 && (
        <section className="bg-white rounded-lg p-8 md:p-12 border border-black/10">
          <p className="font-mono text-xs uppercase tracking-[0.12em] text-black/40 mb-2">
            Continue Growing
          </p>
          <h3 className="text-xl font-bold text-black mb-2">Other Growth Areas</h3>
          <p className="text-sm text-black/50 mb-8 max-w-lg">
            These dimensions are not your immediate priority, but understanding them helps you see the full picture.
          </p>

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
        </section>
      )}

      {/* Reassessment */}
      <section className="bg-[#F7F3ED] rounded-lg p-8 md:p-10 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.12em] text-black/40 mb-2">Quarterly Reassessment</p>
        <p className="text-sm text-black/60 leading-relaxed max-w-lg mx-auto">
          Retake the full assessment in 90 days to measure your progress. Meaningful shift in leadership behavior takes 8-12 weeks of deliberate practice.
        </p>
      </section>

      {/* Closing + CTA */}
      <section className="bg-white rounded-lg p-8 md:p-12 border border-black/10 text-center">
        <h2 className="text-xl font-bold text-black mb-6">What Comes Next</h2>
        <div className="max-w-lg mx-auto mb-8">
          {CLOSING_TEXT.split('\n\n').map((paragraph, i) => (
            <p key={i} className="text-lg text-black/70 leading-relaxed mb-4 last:mb-0">{paragraph}</p>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/dashboard"
            className="inline-block bg-black text-white px-10 py-4 rounded-lg text-base font-semibold hover:bg-black/90 transition-colors"
          >
            Go to Plan
          </a>
          <a
            href="https://cal.com/nikolaskonstantin"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-black px-10 py-4 rounded-lg text-base font-semibold border border-black/10 hover:border-black/20 transition-colors"
          >
            Book a Session
          </a>
        </div>
      </section>
    </div>
  )
}
