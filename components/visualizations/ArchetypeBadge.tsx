'use client'

import type { ReactNode } from 'react'

// ─── Archetype Illustrations ─────────────────────────────────────
// Abstract geometric SVG icons — one per archetype

function ArchetypeIcon({ name }: { name: string }) {
  const size = 64
  const icons: Record<string, ReactNode> = {
    'Brilliant Bottleneck': (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        {/* Funnel narrowing to a point — everything flows through one person */}
        <path d="M12 16L32 40L52 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="32" y1="40" x2="32" y2="54" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="32" cy="40" r="3" fill="currentColor" />
        <circle cx="18" cy="12" r="2" fill="currentColor" opacity="0.3" />
        <circle cx="32" cy="10" r="2" fill="currentColor" opacity="0.3" />
        <circle cx="46" cy="12" r="2" fill="currentColor" opacity="0.3" />
      </svg>
    ),
    'Empathetic Avoider': (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        {/* Heart with a curved detour — cares deeply but avoids conflict */}
        <path d="M32 52C32 52 12 38 12 24C12 18 17 12 24 12C28 12 31 14 32 18C33 14 36 12 40 12C47 12 52 18 52 24C52 38 32 52 32 52Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="none" />
        <path d="M22 30C26 30 30 26 34 30C38 34 42 30 42 30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      </svg>
    ),
    'Lonely Operator': (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        {/* Single circle separated from a cluster */}
        <circle cx="32" cy="20" r="8" stroke="currentColor" strokeWidth="2.5" />
        <circle cx="20" cy="48" r="4" stroke="currentColor" strokeWidth="1.5" opacity="0.25" />
        <circle cx="32" cy="50" r="4" stroke="currentColor" strokeWidth="1.5" opacity="0.25" />
        <circle cx="44" cy="48" r="4" stroke="currentColor" strokeWidth="1.5" opacity="0.25" />
        <line x1="32" y1="28" x2="32" y2="40" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.3" />
      </svg>
    ),
    'Polished Performer': (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        {/* Shield/mask — polished exterior hiding interior */}
        <path d="M32 8L50 18V34C50 44 42 52 32 56C22 52 14 44 14 34V18L32 8Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M32 20V40" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
        <circle cx="32" cy="30" r="6" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
      </svg>
    ),
    'Visionary Without Vehicle': (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        {/* Star/spark above broken bridge — vision without execution */}
        <polygon points="32,8 35,18 46,18 37,24 40,34 32,28 24,34 27,24 18,18 29,18" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="none" />
        <line x1="12" y1="48" x2="26" y2="48" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="38" y1="48" x2="52" y2="48" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M26 48L30 44" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
        <path d="M38 48L34 44" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
      </svg>
    ),
    'Conscious Leader, Stuck': (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        {/* Eye inside a box — sees clearly but can't move */}
        <rect x="14" y="14" width="36" height="36" rx="4" stroke="currentColor" strokeWidth="2.5" />
        <ellipse cx="32" cy="32" rx="12" ry="8" stroke="currentColor" strokeWidth="2" />
        <circle cx="32" cy="32" r="4" fill="currentColor" />
      </svg>
    ),
    'Firefighter': (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        {/* Flame — always putting out fires */}
        <path d="M32 8C32 8 20 22 20 36C20 44 25 52 32 52C39 52 44 44 44 36C44 22 32 8 32 8Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M32 28C32 28 26 34 26 40C26 44 29 48 32 48C35 48 38 44 38 40C38 34 32 28 32 28Z" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
      </svg>
    ),
    'Democratic Idealist': (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        {/* Equal circles in a ring — everyone has equal say */}
        <circle cx="32" cy="14" r="5" stroke="currentColor" strokeWidth="2" />
        <circle cx="47" cy="24" r="5" stroke="currentColor" strokeWidth="2" />
        <circle cx="47" cy="42" r="5" stroke="currentColor" strokeWidth="2" />
        <circle cx="32" cy="50" r="5" stroke="currentColor" strokeWidth="2" />
        <circle cx="17" cy="42" r="5" stroke="currentColor" strokeWidth="2" />
        <circle cx="17" cy="24" r="5" stroke="currentColor" strokeWidth="2" />
        <circle cx="32" cy="32" r="2" fill="currentColor" opacity="0.2" />
      </svg>
    ),
    'Scaling Wall': (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        {/* Ascending steps hitting a wall */}
        <path d="M10 52H20V42H30V32H40V22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="48" y1="10" x2="48" y2="52" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <path d="M42 18L48 12L54 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
      </svg>
    ),
    'Strategy Monk': (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        {/* Compass/mandala — deep thinking, strategic clarity */}
        <circle cx="32" cy="32" r="20" stroke="currentColor" strokeWidth="2" />
        <circle cx="32" cy="32" r="10" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
        <line x1="32" y1="8" x2="32" y2="56" stroke="currentColor" strokeWidth="1.5" opacity="0.25" />
        <line x1="8" y1="32" x2="56" y2="32" stroke="currentColor" strokeWidth="1.5" opacity="0.25" />
        <circle cx="32" cy="32" r="3" fill="currentColor" />
      </svg>
    ),
    'Governance Orphan': (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        {/* Scattered dots without structure — no organizational framework */}
        <rect x="14" y="14" width="36" height="36" rx="4" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" opacity="0.3" />
        <circle cx="22" cy="22" r="3" fill="currentColor" opacity="0.5" />
        <circle cx="42" cy="18" r="3" fill="currentColor" opacity="0.5" />
        <circle cx="28" cy="38" r="3" fill="currentColor" opacity="0.5" />
        <circle cx="44" cy="42" r="3" fill="currentColor" opacity="0.5" />
        <circle cx="18" cy="44" r="3" fill="currentColor" opacity="0.5" />
        <circle cx="38" cy="28" r="3" fill="currentColor" opacity="0.5" />
      </svg>
    ),
    'Accidental Culture': (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        {/* Scattered shapes — culture happened by accident, not design */}
        <rect x="10" y="20" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="2" transform="rotate(-15 16 26)" />
        <rect x="34" y="12" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="2" transform="rotate(10 40 18)" />
        <rect x="24" y="36" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="2" transform="rotate(-5 30 42)" />
        <rect x="42" y="38" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="2" transform="rotate(20 48 44)" />
        <path d="M20 32C28 28 36 32 44 28" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.25" />
      </svg>
    ),
  }

  return (
    <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-[#F7F3ED] text-black/70 shrink-0">
      {icons[name] || (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="16" stroke="currentColor" strokeWidth="2" />
          <circle cx="32" cy="32" r="4" fill="currentColor" />
        </svg>
      )}
    </div>
  )
}

// ─── Badge Component ─────────────────────────────────────────────

interface ArchetypeBadgeProps {
  name: string
  matchType: 'full' | 'partial'
  signatureStrength: number
  sjiConfirmed?: boolean
  displayRank: number
  territoryAccent?: string
}

export function ArchetypeBadge({
  name,
  matchType,
  signatureStrength,
  sjiConfirmed,
  displayRank,
  territoryAccent,
}: ArchetypeBadgeProps) {
  const clampedStrength = Math.max(0, Math.min(100, signatureStrength))
  const isFull = matchType === 'full'

  return (
    <div
      className="w-full rounded-xl border border-black/10 bg-white p-6 font-[Inter]"
      style={territoryAccent ? { borderLeftWidth: 3, borderLeftColor: territoryAccent } : undefined}
    >
      <div className="flex gap-5">
        {/* Illustration */}
        <ArchetypeIcon name={name} />

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Rank + Name + Match badge */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#F7F3ED] text-xs font-bold text-black">
                #{displayRank}
              </span>
              <h3 className="text-lg font-semibold text-black leading-tight">
                {name}
              </h3>
            </div>

            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium shrink-0 ${
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
      </div>
    </div>
  )
}
