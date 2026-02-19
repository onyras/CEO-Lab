'use client'

import { ARCHETYPE_DESCRIPTIONS, IM_HANDLING } from '@/lib/report-content'
import { ArchetypeBadge } from '@/components/visualizations/ArchetypeBadge'
import type { ArchetypeMatch } from '@/types/assessment'

interface ArchetypesTabProps {
  archetypes: ArchetypeMatch[]
  imFlagged: boolean
}

export function ArchetypesTab({ archetypes, imFlagged }: ArchetypesTabProps) {
  const hasMatches = archetypes.length > 0

  return (
    <div className="bg-white rounded-lg p-8 md:p-10 border border-black/10">
      <h2 className="text-xl font-bold text-black mb-1">Archetypes</h2>

      {imFlagged && (
        <div className="bg-[#F7F3ED] rounded-lg p-5 mb-6 mt-4">
          <p className="text-sm text-black/70 leading-relaxed">{IM_HANDLING.archetypeNote}</p>
        </div>
      )}

      {hasMatches ? (
        <>
          <p className="text-sm text-black/50 mb-6 mt-2">
            Your leadership profile matches the following pattern{archetypes.length > 1 ? 's' : ''}.
          </p>

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {archetypes.map((arch) => (
              <ArchetypeBadge
                key={arch.name}
                name={arch.name}
                matchType={arch.matchType}
                signatureStrength={arch.signatureStrength}
                sjiConfirmed={arch.sjiConfirmed}
                displayRank={arch.displayRank}
              />
            ))}
          </div>

          <div className="space-y-6">
            {archetypes.map((arch) => {
              const desc = ARCHETYPE_DESCRIPTIONS[arch.name]
              if (!desc) return null

              return (
                <div key={arch.name} className="border border-black/10 rounded-lg p-6">
                  <div className="mb-4">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-black">{desc.name}</h3>
                      <span className="text-xs font-medium text-black/40 px-2 py-0.5 bg-[#F7F3ED] rounded-full">
                        {arch.matchType === 'full' ? 'Full match' : 'Partial match'}
                      </span>
                    </div>
                    <p className="text-base text-black/70 leading-relaxed font-medium italic">{desc.oneSentence}</p>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs font-semibold text-black/40 uppercase tracking-wider mb-1">What This Looks Like</p>
                    <p className="text-sm text-black/70 leading-relaxed">{desc.whatThisLooksLike}</p>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs font-semibold text-black/40 uppercase tracking-wider mb-1">What This Is Costing You</p>
                    <p className="text-sm text-black/70 leading-relaxed">{desc.whatThisIsCostingYou}</p>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs font-semibold text-black/40 uppercase tracking-wider mb-1">The Shift</p>
                    <p className="text-sm text-black/70 leading-relaxed">{desc.theShift}</p>
                  </div>

                  {desc.frameworkReferences.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-black/40 uppercase tracking-wider mb-2">Key Frameworks</p>
                      <div className="flex flex-wrap gap-2">
                        {desc.frameworkReferences.map((fw) => (
                          <span key={fw} className="inline-block px-3 py-1.5 text-xs font-medium text-black bg-[#F7F3ED] rounded-full">{fw}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {arch.sjiConfirmed != null && (
                    <div className="pt-3 border-t border-black/10">
                      {arch.sjiConfirmed ? (
                        <p className="text-xs text-black/50 flex items-center gap-1.5">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#A6BEA4]" />
                          Confirmed by situational responses
                        </p>
                      ) : (
                        <p className="text-xs text-black/50 flex items-center gap-1.5">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#E08F6A]" />
                          Self-report and situational responses diverge. Worth exploring.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </>
      ) : (
        <div className="text-center py-8 mt-2">
          <p className="text-black/60 text-sm max-w-md mx-auto leading-relaxed">
            Your profile doesn&apos;t match a single dominant pattern. This usually means a balanced profile or a transitional phase.
          </p>
        </div>
      )}
    </div>
  )
}
