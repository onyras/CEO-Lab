'use client'

import { getDimension } from '@/lib/constants'
import { IM_HANDLING, BLIND_SPOT_CLOSING } from '@/lib/report-content'
import { MirrorDotPlot } from '@/components/visualizations/MirrorDotPlot'
import type { MirrorGap } from '@/types/assessment'

interface BlindSpotsTabProps {
  mirrorGaps?: MirrorGap[]
  hasMirrorData: boolean
  imFlagged: boolean
}

export function BlindSpotsTab({ mirrorGaps, hasMirrorData, imFlagged }: BlindSpotsTabProps) {
  const significantGaps = (mirrorGaps ?? []).filter(
    (g) => g.severity === 'significant' || g.severity === 'critical'
  )

  return (
    <div className="bg-white rounded-lg p-8 md:p-10 border border-black/10">
      <h2 className="text-xl font-bold text-black mb-1">Blind Spots</h2>

      {hasMirrorData && mirrorGaps && mirrorGaps.length > 0 ? (
        <>
          <p className="text-sm text-black/50 mb-6 mt-2">
            How others see your leadership compared to how you see yourself.
          </p>

          {imFlagged && (
            <div className="bg-[#F7F3ED] rounded-lg p-5 mb-6">
              <p className="text-sm text-black/70 leading-relaxed">{IM_HANDLING.mirrorElevation}</p>
            </div>
          )}

          <MirrorDotPlot
            gaps={mirrorGaps.map((gap) => ({
              dimensionId: gap.dimensionId,
              dimensionName: getDimension(gap.dimensionId).name,
              ceoPct: gap.ceoPct,
              raterPct: gap.raterPct,
              gapLabel: gap.gapLabel,
              severity: gap.severity,
            }))}
          />

          {significantGaps.length > 0 && (
            <div className="mt-6 space-y-4">
              {significantGaps.map((gap) => {
                const def = getDimension(gap.dimensionId)
                const gapDirection = gap.ceoPct > gap.raterPct ? 'higher than your rater' : 'lower than your rater'
                const gapSize = Math.abs(Math.round(gap.ceoPct - gap.raterPct))

                return (
                  <div
                    key={gap.dimensionId}
                    className="border-l-2 pl-4 py-2"
                    style={{ borderColor: gap.severity === 'critical' ? '#E08F6A' : '#7FABC8' }}
                  >
                    <p className="text-xs font-semibold text-black/40 uppercase tracking-wider mb-1">
                      {def.name} <span className="normal-case font-normal">&mdash; {gap.gapLabel}</span>
                    </p>
                    <p className="text-sm text-black/70 leading-relaxed">
                      You rated yourself {gapSize} points {gapDirection} on {def.name}. This gap suggests that your experience of your own leadership differs meaningfully from how it lands with others.
                    </p>
                  </div>
                )
              })}
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-black/10">
            <p className="text-sm text-black/60 leading-relaxed">{BLIND_SPOT_CLOSING}</p>
          </div>
        </>
      ) : (
        <div className="text-center py-8 mt-2">
          <p className="text-black/60 text-sm max-w-md mx-auto leading-relaxed mb-6">
            Blind spot analysis requires a Mirror Check &mdash; a brief survey completed by someone who works closely with you.
          </p>
          <a
            href="/assessment/mirror"
            className="inline-block bg-black text-white px-8 py-4 rounded-lg text-base font-semibold hover:bg-black/90 transition-colors"
          >
            Invite a Trusted Colleague
          </a>
        </div>
      )}
    </div>
  )
}
