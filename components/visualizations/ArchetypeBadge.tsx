'use client'

interface ArchetypeBadgeProps {
  name: string
  matchType: 'full' | 'partial'
  signatureStrength: number
  sjiConfirmed?: boolean
  displayRank: number
}

export function ArchetypeBadge({
  name,
  matchType,
  signatureStrength,
  sjiConfirmed,
  displayRank,
}: ArchetypeBadgeProps) {
  const clampedStrength = Math.max(0, Math.min(100, signatureStrength))
  const isFull = matchType === 'full'

  return (
    <div className="w-full rounded-lg border border-black/10 bg-white p-5 font-[Inter]">
      {/* Rank + Name row */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {/* Rank badge */}
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#F7F3ED] text-xs font-semibold text-black">
            #{displayRank}
          </span>
          <h3 className="text-lg font-semibold text-black leading-tight">
            {name}
          </h3>
        </div>

        {/* Match type badge */}
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
            isFull
              ? 'bg-black text-white'
              : 'bg-white text-black border border-black/30'
          }`}
        >
          {isFull ? 'Full Match' : 'Partial Match'}
        </span>
      </div>

      {/* Signature strength */}
      <div className="mb-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-black/60">Signature Strength</span>
          <span className="text-xs font-semibold text-black">
            {clampedStrength}%
          </span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-[#F7F3ED] overflow-hidden">
          <div
            className="h-full rounded-full bg-black transition-all duration-500 ease-out"
            style={{ width: `${clampedStrength}%` }}
          />
        </div>
      </div>

      {/* SJI confirmation */}
      {sjiConfirmed && (
        <p className="text-[11px] text-black/50 mt-2">
          Confirmed by situational responses
        </p>
      )}
    </div>
  )
}
