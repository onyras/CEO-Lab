'use client'

const PHASE_CONFIG = [
  { label: 'Phase 1', weeks: 'Week 1-4', description: 'Foundation' },
  { label: 'Phase 2', weeks: 'Week 5-8', description: 'Development' },
  { label: 'Phase 3', weeks: 'Week 9-12', description: 'Integration' },
] as const

interface RoadmapTimelineProps {
  priorityDimensions: {
    dimensionId: string
    dimensionName: string
    frameworks: string[]
    verbalLabel: string
  }[]
}

export function RoadmapTimeline({
  priorityDimensions,
}: RoadmapTimelineProps) {
  // Map dimensions to phases: first to Phase 1, second to Phase 2, third to Phase 3
  // If fewer than 3 dimensions, remaining phases show empty
  // If more than 3, distribute evenly across phases
  const phases = PHASE_CONFIG.map((phase, index) => {
    const dims: typeof priorityDimensions = []

    if (priorityDimensions.length <= 3) {
      if (priorityDimensions[index]) {
        dims.push(priorityDimensions[index])
      }
    } else {
      // Distribute evenly
      const perPhase = Math.ceil(priorityDimensions.length / 3)
      const start = index * perPhase
      const end = Math.min(start + perPhase, priorityDimensions.length)
      dims.push(...priorityDimensions.slice(start, end))
    }

    return { ...phase, dimensions: dims }
  })

  return (
    <div className="w-full font-[Inter]">
      {/* Timeline bar */}
      <div className="relative mb-8">
        {/* Horizontal line */}
        <div className="absolute top-3 left-0 right-0 h-px bg-black/20" />

        {/* Phase markers */}
        <div className="relative flex justify-between">
          {phases.map((phase, index) => (
            <div
              key={index}
              className="flex flex-col items-center"
              style={{ width: `${100 / 3}%` }}
            >
              {/* Marker dot */}
              <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center z-10">
                <span className="text-[10px] font-semibold text-white">
                  {index + 1}
                </span>
              </div>
              {/* Phase label */}
              <span className="mt-2 text-xs font-semibold text-black">
                {phase.label}
              </span>
              <span className="text-[10px] text-black/50">
                {phase.weeks}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Phase content cards */}
      <div className="grid grid-cols-3 gap-4">
        {phases.map((phase, phaseIndex) => (
          <div
            key={phaseIndex}
            className="rounded-lg border border-black/10 bg-white p-4"
          >
            <div className="mb-3">
              <h4 className="text-xs font-semibold text-black uppercase tracking-wide">
                {phase.description}
              </h4>
              <p className="text-[10px] text-black/40 mt-0.5">
                {phase.weeks}
              </p>
            </div>

            {phase.dimensions.length === 0 ? (
              <p className="text-[10px] text-black/30 italic">
                No priority assigned
              </p>
            ) : (
              <div className="space-y-3">
                {phase.dimensions.map((dim) => (
                  <div key={dim.dimensionId}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-black">
                        {dim.dimensionName}
                      </span>
                      <span className="text-[10px] text-black/50">
                        {dim.verbalLabel}
                      </span>
                    </div>

                    {/* Frameworks */}
                    {dim.frameworks.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {dim.frameworks.map((fw, fwIndex) => (
                          <span
                            key={fwIndex}
                            className="inline-block px-2 py-0.5 rounded bg-[#F7F3ED] text-[10px] text-black/70"
                          >
                            {fw}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
