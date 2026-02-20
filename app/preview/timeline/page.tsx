'use client'

import React, { useState } from 'react'

const D = {
  id: 'LY.1',
  name: 'Self-Awareness',
  score: 65,
  color: '#7FABC8',
  bP25: 38,
  bP75: 68,
  label: 'Strong',
  q0: 'Start',
  q1: 'Q1 \'26',
  q2: 'Q2 \'26',
  q3: 'Q3 \'26',
  q4: 'Q4 \'26',
}

// Shared SVG helpers
const Y = (score: number, h: number, pad: number) => pad + (h - 2 * pad) * (1 - score / 100)

// ═══════════════════════════════════════════════════════════════════════════════
// ORIGINAL 9 — Detailed Line Chart
// ═══════════════════════════════════════════════════════════════════════════════
function OrigA() {
  const h = 100, yP = Y(D.score, h, 15), bT = Y(D.bP75, h, 15), bB = Y(D.bP25, h, 15)
  return (
    <svg width="100%" height={h} viewBox="0 0 280 100" className="overflow-visible">
      <line x1="32" y1="8" x2="32" y2={h - 18} stroke="rgba(0,0,0,0.06)" />
      <text x="28" y="14" textAnchor="end" fontSize="8" fill="rgba(0,0,0,0.2)" className="font-mono">100</text>
      <text x="28" y={h - 18} textAnchor="end" fontSize="8" fill="rgba(0,0,0,0.2)" className="font-mono">0</text>
      <line x1="32" y1={h - 18} x2="270" y2={h - 18} stroke="rgba(0,0,0,0.06)" />
      <rect x="32" y={bT} width="238" height={bB - bT} fill="rgba(0,0,0,0.02)" rx="2" />
      {[80, 140, 200, 260].map(x => <line key={x} x1={x} y1="8" x2={x} y2={h - 18} stroke="rgba(0,0,0,0.03)" />)}
      <defs><linearGradient id="gA" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={D.color} stopOpacity="0.12" /><stop offset="100%" stopColor={D.color} stopOpacity="0" /></linearGradient></defs>
      <polygon points={`32,${h - 18} 80,${yP} 80,${h - 18}`} fill="url(#gA)" />
      <polyline points={`32,${h - 18} 80,${yP}`} fill="none" stroke={D.color} strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="80" cy={yP} r="8" fill={D.color} opacity="0.12" />
      <circle cx="80" cy={yP} r="4.5" fill={D.color} stroke="white" strokeWidth="2" />
      <text x="80" y={yP - 12} textAnchor="middle" fontSize="11" fontWeight="bold" fill={D.color} className="font-mono">{D.score}%</text>
      <line x1="80" y1={yP} x2="140" y2={yP} stroke="rgba(0,0,0,0.06)" strokeDasharray="4 3" />
      <circle cx="140" cy={yP} r="4" fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth="1.5" strokeDasharray="3 2" />
      <line x1="140" y1={yP} x2="200" y2={yP} stroke="rgba(0,0,0,0.03)" strokeDasharray="4 3" />
      <circle cx="200" cy={yP} r="3.5" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="1" strokeDasharray="2 2" />
      <text x="32" y={h - 4} textAnchor="middle" fontSize="8" fill="rgba(0,0,0,0.15)" className="font-mono">Start</text>
      <text x="80" y={h - 4} textAnchor="middle" fontSize="9" fontWeight="bold" fill="rgba(0,0,0,0.5)" className="font-mono">{D.q1}</text>
      <text x="140" y={h - 4} textAnchor="middle" fontSize="9" fill="rgba(0,0,0,0.2)" className="font-mono">{D.q2}</text>
      <text x="200" y={h - 4} textAnchor="middle" fontSize="8" fill="rgba(0,0,0,0.1)" className="font-mono">Q3</text>
      <text x="260" y={h - 4} textAnchor="middle" fontSize="8" fill="rgba(0,0,0,0.06)" className="font-mono">Q4</text>
    </svg>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// ORIGINAL 10 — Card Grid Per Quarter
// ═══════════════════════════════════════════════════════════════════════════════
function OrigB() {
  return (
    <div className="grid grid-cols-4 gap-3">
      <div className="rounded-lg p-4 border-2" style={{ borderColor: D.color }}>
        <p className="font-mono text-[10px] font-bold text-black/60 mb-2">{D.q1}</p>
        <p className="text-2xl font-bold font-mono" style={{ color: D.color }}>{D.score}%</p>
        <p className="text-[10px] text-black/40 mt-1">{D.label}</p>
        <div className="mt-3 h-1.5 rounded-full bg-black/5">
          <div className="h-full rounded-full" style={{ width: `${D.score}%`, backgroundColor: D.color }} />
        </div>
      </div>
      <div className="rounded-lg p-4 border border-dashed border-black/10 bg-black/[0.01]">
        <p className="font-mono text-[10px] text-black/20 mb-2">{D.q2}</p>
        <p className="text-2xl font-bold font-mono text-black/10">&mdash;</p>
        <p className="text-[10px] text-black/15 mt-1">Upcoming</p>
        <div className="mt-3 h-1.5 rounded-full bg-black/[0.03]" />
      </div>
      <div className="rounded-lg p-4 border border-dashed border-black/5 bg-black/[0.005]">
        <p className="font-mono text-[10px] text-black/12 mb-2">{D.q3}</p>
        <p className="text-2xl font-bold font-mono text-black/6">&mdash;</p>
        <div className="mt-3 h-1.5 rounded-full bg-black/[0.02]" />
      </div>
      <div className="rounded-lg p-4 border border-dashed border-black/[0.03]">
        <p className="font-mono text-[10px] text-black/8 mb-2">{D.q4}</p>
        <p className="text-2xl font-bold font-mono text-black/4">&mdash;</p>
        <div className="mt-3 h-1.5 rounded-full bg-black/[0.01]" />
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// NEW DESIGNS — Line Chart Variations (building on Original 9)
// ═══════════════════════════════════════════════════════════════════════════════

// 3: Smooth curve with upward growth projection
function D3() {
  const h = 110, yP = Y(D.score, h, 18), bT = Y(D.bP75, h, 18), bB = Y(D.bP25, h, 18)
  const projY = Y(Math.min(100, D.score + 8), h, 18)
  return (
    <svg width="100%" height={h} viewBox="0 0 320 110" className="overflow-visible">
      <defs>
        <linearGradient id="g3" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={D.color} stopOpacity="0.15" /><stop offset="100%" stopColor={D.color} stopOpacity="0" /></linearGradient>
        <filter id="glow3"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      {/* Axes */}
      <line x1="36" y1="12" x2="36" y2={h - 22} stroke="rgba(0,0,0,0.05)" />
      <line x1="36" y1={h - 22} x2="310" y2={h - 22} stroke="rgba(0,0,0,0.05)" />
      <text x="32" y="17" textAnchor="end" fontSize="8" fill="rgba(0,0,0,0.18)" className="font-mono">100</text>
      <text x="32" y={h / 2 + 3} textAnchor="end" fontSize="8" fill="rgba(0,0,0,0.12)" className="font-mono">50</text>
      <text x="32" y={h - 21} textAnchor="end" fontSize="8" fill="rgba(0,0,0,0.18)" className="font-mono">0</text>
      {/* Benchmark */}
      <rect x="36" y={bT} width="274" height={bB - bT} fill="rgba(0,0,0,0.018)" rx="3" />
      <text x="308" y={bT + (bB - bT) / 2 + 3} textAnchor="end" fontSize="7" fill="rgba(0,0,0,0.1)">typical</text>
      {/* Gridlines */}
      {[100, 170, 240, 310].map(x => <line key={x} x1={x} y1="12" x2={x} y2={h - 22} stroke="rgba(0,0,0,0.02)" />)}
      {/* Area fill */}
      <path d={`M 36,${h - 22} Q 68,${h - 22} 100,${yP} L 100,${h - 22} Z`} fill="url(#g3)" />
      {/* Smooth curve */}
      <path d={`M 36,${h - 22} Q 68,${h - 22} 100,${yP}`} fill="none" stroke={D.color} strokeWidth="2.5" strokeLinecap="round" />
      {/* Growth projection arrow */}
      <path d={`M 100,${yP} Q 135,${yP - 2} 170,${projY}`} fill="none" stroke={D.color} strokeWidth="1.5" strokeDasharray="6 4" opacity="0.3" />
      <path d={`M 170,${projY} Q 205,${projY - 2} 240,${Y(Math.min(100, D.score + 14), h, 18)}`} fill="none" stroke={D.color} strokeWidth="1" strokeDasharray="4 4" opacity="0.15" />
      {/* Current dot */}
      <circle cx="100" cy={yP} r="10" fill={D.color} opacity="0.08" filter="url(#glow3)" />
      <circle cx="100" cy={yP} r="5" fill={D.color} stroke="white" strokeWidth="2.5" />
      <text x="100" y={yP - 14} textAnchor="middle" fontSize="12" fontWeight="bold" fill={D.color} className="font-mono">{D.score}%</text>
      {/* Future dots */}
      <circle cx="170" cy={projY} r="4.5" fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth="1.5" strokeDasharray="3 2" />
      <circle cx="240" cy={Y(Math.min(100, D.score + 14), h, 18)} r="3.5" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="1" strokeDasharray="2 2" />
      {/* X labels */}
      <text x="36" y={h - 6} textAnchor="middle" fontSize="8" fill="rgba(0,0,0,0.12)" className="font-mono">Start</text>
      <text x="100" y={h - 6} textAnchor="middle" fontSize="9" fontWeight="bold" fill="rgba(0,0,0,0.45)" className="font-mono">{D.q1}</text>
      <text x="170" y={h - 6} textAnchor="middle" fontSize="9" fill="rgba(0,0,0,0.18)" className="font-mono">{D.q2}</text>
      <text x="240" y={h - 6} textAnchor="middle" fontSize="8" fill="rgba(0,0,0,0.08)" className="font-mono">{D.q3}</text>
      <text x="310" y={h - 6} textAnchor="middle" fontSize="8" fill="rgba(0,0,0,0.05)" className="font-mono">{D.q4}</text>
    </svg>
  )
}

// 4: Clean step chart — each quarter is a plateau
function D4() {
  const h = 100, yP = Y(D.score, h, 15)
  return (
    <svg width="100%" height={h} viewBox="0 0 300 100" className="overflow-visible">
      <defs><linearGradient id="g4" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={D.color} stopOpacity="0.1" /><stop offset="100%" stopColor={D.color} stopOpacity="0" /></linearGradient></defs>
      <line x1="30" y1="10" x2="30" y2={h - 18} stroke="rgba(0,0,0,0.05)" />
      <line x1="30" y1={h - 18} x2="290" y2={h - 18} stroke="rgba(0,0,0,0.05)" />
      <text x="26" y="15" textAnchor="end" fontSize="8" fill="rgba(0,0,0,0.15)" className="font-mono">100</text>
      <text x="26" y={h - 17} textAnchor="end" fontSize="8" fill="rgba(0,0,0,0.15)" className="font-mono">0</text>
      {/* Step fill */}
      <path d={`M 30,${h - 18} L 30,${h - 18} L 95,${h - 18} L 95,${yP} L 160,${yP} L 160,${h - 18} Z`} fill="url(#g4)" />
      {/* Step line */}
      <path d={`M 30,${h - 18} L 95,${h - 18} L 95,${yP} L 160,${yP}`} fill="none" stroke={D.color} strokeWidth="2" strokeLinecap="round" />
      {/* Current plateau marker */}
      <rect x="95" y={yP} width="65" height="3" rx="1.5" fill={D.color} />
      <circle cx="160" cy={yP} r="5" fill={D.color} stroke="white" strokeWidth="2" />
      <text x="128" y={yP - 8} textAnchor="middle" fontSize="11" fontWeight="bold" fill={D.color} className="font-mono">{D.score}%</text>
      {/* Future placeholders */}
      <rect x="160" y={yP} width="65" height="1" rx="0.5" fill="rgba(0,0,0,0.06)" strokeDasharray="4 3" />
      <circle cx="225" cy={yP} r="4" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="1.5" strokeDasharray="3 2" />
      <rect x="225" y={yP} width="65" height="1" rx="0.5" fill="rgba(0,0,0,0.03)" />
      <circle cx="290" cy={yP} r="3" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="1" strokeDasharray="2 2" />
      {/* X labels */}
      <text x="62" y={h - 4} textAnchor="middle" fontSize="8" fill="rgba(0,0,0,0.12)" className="font-mono">Baseline</text>
      <text x="128" y={h - 4} textAnchor="middle" fontSize="9" fontWeight="bold" fill="rgba(0,0,0,0.45)" className="font-mono">{D.q1}</text>
      <text x="192" y={h - 4} textAnchor="middle" fontSize="9" fill="rgba(0,0,0,0.15)" className="font-mono">{D.q2}</text>
      <text x="258" y={h - 4} textAnchor="middle" fontSize="8" fill="rgba(0,0,0,0.08)" className="font-mono">{D.q3}</text>
    </svg>
  )
}

// 5: Minimal dot-on-line with growth arrow
function D5() {
  const h = 80, yP = Y(D.score, h, 12), projY = Y(Math.min(100, D.score + 10), h, 12)
  return (
    <svg width="100%" height={h} viewBox="0 0 300 80" className="overflow-visible">
      <line x1="20" y1={h - 14} x2="290" y2={h - 14} stroke="rgba(0,0,0,0.04)" />
      <line x1="20" y1="8" x2="20" y2={h - 14} stroke="rgba(0,0,0,0.04)" />
      {/* Thin growth line */}
      <line x1="20" y1={h - 14} x2="80" y2={yP} stroke={D.color} strokeWidth="1.5" opacity="0.4" />
      <line x1="80" y1={yP} x2="160" y2={projY} stroke={D.color} strokeWidth="1" strokeDasharray="6 4" opacity="0.2" />
      <line x1="160" y1={projY} x2="240" y2={Y(Math.min(100, D.score + 18), h, 12)} stroke={D.color} strokeWidth="0.5" strokeDasharray="4 4" opacity="0.1" />
      {/* Arrow at tip */}
      <polygon points={`${240 - 4},${Y(Math.min(100, D.score + 18), h, 12) + 3} ${240},${Y(Math.min(100, D.score + 18), h, 12)} ${240 - 4},${Y(Math.min(100, D.score + 18), h, 12) - 3}`} fill={D.color} opacity="0.1" />
      {/* Current dot — large and prominent */}
      <circle cx="80" cy={yP} r="12" fill={D.color} opacity="0.06" />
      <circle cx="80" cy={yP} r="6" fill="white" stroke={D.color} strokeWidth="2.5" />
      <circle cx="80" cy={yP} r="2" fill={D.color} />
      <text x="80" y={yP - 16} textAnchor="middle" fontSize="13" fontWeight="bold" fill="rgba(0,0,0,0.7)" className="font-mono">{D.score}%</text>
      {/* Future ghost dots */}
      <circle cx="160" cy={projY} r="4" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="1.5" strokeDasharray="3 2" />
      <circle cx="240" cy={Y(Math.min(100, D.score + 18), h, 12)} r="3" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="1" strokeDasharray="2 2" />
      {/* Labels */}
      <text x="80" y={h - 2} textAnchor="middle" fontSize="9" fontWeight="bold" fill="rgba(0,0,0,0.4)" className="font-mono">Now</text>
      <text x="160" y={h - 2} textAnchor="middle" fontSize="8" fill="rgba(0,0,0,0.15)" className="font-mono">{D.q2}</text>
      <text x="240" y={h - 2} textAnchor="middle" fontSize="8" fill="rgba(0,0,0,0.08)" className="font-mono">{D.q3}</text>
    </svg>
  )
}

// 6: Bold progress bar + stacked future mini-chart
function D6() {
  const h = 90, yP = Y(D.score, h, 14), bT = Y(D.bP75, h, 14), bB = Y(D.bP25, h, 14)
  return (
    <div className="space-y-4">
      {/* Big bar */}
      <div className="relative">
        <div className="h-4 w-full rounded-full bg-black/[0.03] overflow-hidden">
          <div className="h-full rounded-full" style={{ width: `${D.score}%`, backgroundColor: D.color }} />
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="font-mono text-[9px] text-black/20">0%</span>
          <span className="font-mono text-[9px] text-black/20">Typical: {D.bP25}–{D.bP75}%</span>
          <span className="font-mono text-[9px] text-black/20">100%</span>
        </div>
      </div>
      {/* Mini growth trajectory */}
      <svg width="100%" height={h} viewBox="0 0 300 90" className="overflow-visible">
        <rect x="0" y={bT} width="300" height={bB - bT} fill="rgba(0,0,0,0.015)" rx="2" />
        <line x1="0" y1={h - 14} x2="300" y2={h - 14} stroke="rgba(0,0,0,0.03)" />
        {[75, 150, 225, 300].map(x => <line key={x} x1={x} y1="10" x2={x} y2={h - 14} stroke="rgba(0,0,0,0.02)" />)}
        <defs><linearGradient id="g6" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={D.color} stopOpacity="0.1" /><stop offset="100%" stopColor={D.color} stopOpacity="0" /></linearGradient></defs>
        <path d={`M 0,${h - 14} Q 37,${h - 14} 75,${yP} L 75,${h - 14} Z`} fill="url(#g6)" />
        <path d={`M 0,${h - 14} Q 37,${h - 14} 75,${yP}`} fill="none" stroke={D.color} strokeWidth="2" />
        <circle cx="75" cy={yP} r="5" fill={D.color} stroke="white" strokeWidth="2" />
        <line x1="75" y1={yP} x2="150" y2={yP} stroke="rgba(0,0,0,0.06)" strokeDasharray="4 3" />
        <circle cx="150" cy={yP} r="4" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="1.5" strokeDasharray="3 2" />
        <line x1="150" y1={yP} x2="225" y2={yP} stroke="rgba(0,0,0,0.03)" strokeDasharray="3 3" />
        <circle cx="225" cy={yP} r="3" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="1" strokeDasharray="2 2" />
        <text x="75" y={h - 2} textAnchor="middle" fontSize="9" fontWeight="bold" fill="rgba(0,0,0,0.4)" className="font-mono">{D.q1}</text>
        <text x="150" y={h - 2} textAnchor="middle" fontSize="9" fill="rgba(0,0,0,0.15)" className="font-mono">{D.q2}</text>
        <text x="225" y={h - 2} textAnchor="middle" fontSize="8" fill="rgba(0,0,0,0.08)" className="font-mono">{D.q3}</text>
      </svg>
    </div>
  )
}

// 7: Wide timeline with progress pill indicators
function D7() {
  return (
    <div>
      <div className="flex items-end gap-1 mb-4">
        {/* Quarters as pills */}
        <div className="flex-1">
          <div className="h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: D.color }}>
            <span className="font-mono text-sm font-bold text-white">{D.score}%</span>
          </div>
          <p className="font-mono text-[10px] font-bold text-black/50 text-center mt-2">{D.q1}</p>
          <p className="text-[9px] text-black/30 text-center">Current</p>
        </div>
        <div className="flex items-center px-1 self-center">
          <svg className="w-4 h-4 text-black/15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
        </div>
        <div className="flex-1">
          <div className="h-10 rounded-lg border-2 border-dashed border-black/10 flex items-center justify-center">
            <span className="font-mono text-sm text-black/15">?</span>
          </div>
          <p className="font-mono text-[10px] text-black/20 text-center mt-2">{D.q2}</p>
        </div>
        <div className="flex items-center px-1 self-center">
          <svg className="w-4 h-4 text-black/8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
        </div>
        <div className="flex-1">
          <div className="h-10 rounded-lg border border-dashed border-black/5 flex items-center justify-center">
            <span className="font-mono text-sm text-black/8">?</span>
          </div>
          <p className="font-mono text-[10px] text-black/10 text-center mt-2">{D.q3}</p>
        </div>
        <div className="flex items-center px-1 self-center">
          <svg className="w-4 h-4 text-black/5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
        </div>
        <div className="flex-1">
          <div className="h-10 rounded-lg border border-dashed border-black/[0.03] flex items-center justify-center">
            <span className="font-mono text-sm text-black/5">?</span>
          </div>
          <p className="font-mono text-[10px] text-black/6 text-center mt-2">{D.q4}</p>
        </div>
      </div>
      <div className="h-1.5 rounded-full bg-black/[0.03] overflow-hidden">
        <div className="h-full rounded-full" style={{ width: '25%', backgroundColor: D.color }} />
      </div>
    </div>
  )
}

// 8: Growth chart with confidence band widening into future
function D8() {
  const h = 110, yP = Y(D.score, h, 18)
  const projY = Y(D.score + 6, h, 18)
  return (
    <svg width="100%" height={h} viewBox="0 0 320 110" className="overflow-visible">
      <defs>
        <linearGradient id="g8" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={D.color} stopOpacity="0.12" /><stop offset="100%" stopColor={D.color} stopOpacity="0" /></linearGradient>
        <linearGradient id="g8b" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor={D.color} stopOpacity="0.06" /><stop offset="100%" stopColor={D.color} stopOpacity="0" /></linearGradient>
      </defs>
      <line x1="36" y1="12" x2="36" y2={h - 22} stroke="rgba(0,0,0,0.04)" />
      <line x1="36" y1={h - 22} x2="310" y2={h - 22} stroke="rgba(0,0,0,0.04)" />
      <text x="32" y="17" textAnchor="end" fontSize="8" fill="rgba(0,0,0,0.15)" className="font-mono">100</text>
      <text x="32" y={h - 21} textAnchor="end" fontSize="8" fill="rgba(0,0,0,0.15)" className="font-mono">0</text>
      {/* Confidence band — widens into future */}
      <path d={`M 100,${yP - 3} Q 170,${projY - 12} 280,${Y(D.score + 20, h, 18)} L 280,${Y(D.score - 8, h, 18)} Q 170,${projY + 8} 100,${yP + 3} Z`} fill="url(#g8b)" />
      {/* Area */}
      <path d={`M 36,${h - 22} Q 68,${h - 22} 100,${yP} L 100,${h - 22} Z`} fill="url(#g8)" />
      <path d={`M 36,${h - 22} Q 68,${h - 22} 100,${yP}`} fill="none" stroke={D.color} strokeWidth="2.5" strokeLinecap="round" />
      {/* Projected center line */}
      <path d={`M 100,${yP} Q 170,${projY} 280,${Y(D.score + 12, h, 18)}`} fill="none" stroke={D.color} strokeWidth="1" strokeDasharray="6 4" opacity="0.2" />
      {/* Current */}
      <circle cx="100" cy={yP} r="6" fill={D.color} stroke="white" strokeWidth="2.5" />
      <text x="100" y={yP - 14} textAnchor="middle" fontSize="12" fontWeight="bold" fill={D.color} className="font-mono">{D.score}%</text>
      <text x="108" y={yP - 3} fontSize="7" fill="rgba(0,0,0,0.3)">you are here</text>
      {/* Quarter dots */}
      <circle cx="170" cy={projY} r="4" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="1.5" strokeDasharray="3 2" />
      <circle cx="240" cy={Y(D.score + 10, h, 18)} r="3" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="1" strokeDasharray="2 2" />
      {/* X labels */}
      <text x="100" y={h - 6} textAnchor="middle" fontSize="9" fontWeight="bold" fill="rgba(0,0,0,0.4)" className="font-mono">{D.q1}</text>
      <text x="170" y={h - 6} textAnchor="middle" fontSize="9" fill="rgba(0,0,0,0.15)" className="font-mono">{D.q2}</text>
      <text x="240" y={h - 6} textAnchor="middle" fontSize="8" fill="rgba(0,0,0,0.08)" className="font-mono">{D.q3}</text>
      <text x="310" y={h - 6} textAnchor="middle" fontSize="8" fill="rgba(0,0,0,0.04)" className="font-mono">{D.q4}</text>
    </svg>
  )
}

// 9: Cards with embedded sparklines
function D9() {
  const h = 30
  const yP = 4 + (h - 8) * (1 - D.score / 100)
  return (
    <div className="grid grid-cols-4 gap-3">
      <div className="rounded-lg p-4 bg-white border-2" style={{ borderColor: D.color }}>
        <div className="flex items-center justify-between mb-2">
          <p className="font-mono text-[10px] font-bold text-black/50">{D.q1}</p>
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold text-white" style={{ backgroundColor: D.color }}>Now</span>
        </div>
        <p className="text-2xl font-bold font-mono" style={{ color: D.color }}>{D.score}%</p>
        <svg width="100%" height={h} viewBox="0 0 80 30" className="mt-2">
          <defs><linearGradient id="g9s" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={D.color} stopOpacity="0.15" /><stop offset="100%" stopColor={D.color} stopOpacity="0" /></linearGradient></defs>
          <polygon points={`0,${h} 0,${h} 40,${h} 80,${yP} 80,${h}`} fill="url(#g9s)" />
          <polyline points={`0,${h} 40,${h * 0.7} 80,${yP}`} fill="none" stroke={D.color} strokeWidth="2" strokeLinecap="round" />
          <circle cx="80" cy={yP} r="3" fill={D.color} stroke="white" strokeWidth="1.5" />
        </svg>
      </div>
      {[{ q: D.q2, op: 0.12 }, { q: D.q3, op: 0.06 }, { q: D.q4, op: 0.03 }].map(({ q, op }, i) => (
        <div key={i} className="rounded-lg p-4 border border-dashed" style={{ borderColor: `rgba(0,0,0,${op * 2})`, backgroundColor: `rgba(0,0,0,${op / 3})` }}>
          <p className="font-mono text-[10px] mb-2" style={{ color: `rgba(0,0,0,${op * 4})` }}>{q}</p>
          <p className="text-2xl font-bold font-mono" style={{ color: `rgba(0,0,0,${op * 2})` }}>&mdash;</p>
          <svg width="100%" height={h} viewBox="0 0 80 30" className="mt-2">
            <line x1="0" y1={h / 2} x2="80" y2={h / 2} stroke={`rgba(0,0,0,${op})`} strokeDasharray="4 4" />
          </svg>
        </div>
      ))}
    </div>
  )
}

// 10: Horizontal track with percentage labels at key thresholds
function D10() {
  return (
    <div>
      <div className="relative h-8 bg-black/[0.02] rounded-lg overflow-visible">
        {/* Threshold markers */}
        {[0, 25, 50, 75, 100].map(v => (
          <div key={v} className="absolute top-0 h-full flex items-end" style={{ left: `${v}%` }}>
            <div className="w-px h-2 bg-black/10" />
          </div>
        ))}
        {/* Benchmark zone */}
        <div className="absolute top-0 h-full rounded opacity-30" style={{ left: `${D.bP25}%`, width: `${D.bP75 - D.bP25}%`, backgroundColor: `${D.color}15` }} />
        {/* Filled track */}
        <div className="absolute top-0 left-0 h-full rounded-l-lg" style={{ width: `${D.score}%`, backgroundColor: `${D.color}20` }} />
        {/* Current position */}
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10" style={{ left: `${D.score}%` }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center border-2 border-white" style={{ backgroundColor: D.color, boxShadow: `0 0 0 3px ${D.color}20` }}>
            <span className="font-mono text-[9px] font-bold text-white">{D.score}</span>
          </div>
        </div>
        {/* Future quarter markers */}
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2" style={{ left: '80%' }}>
          <div className="w-6 h-6 rounded-full border-2 border-dashed border-black/10 bg-white" />
        </div>
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2" style={{ left: '95%' }}>
          <div className="w-5 h-5 rounded-full border border-dashed border-black/5 bg-white" />
        </div>
      </div>
      <div className="flex justify-between mt-2 px-1">
        <span className="font-mono text-[9px] text-black/15">0</span>
        <span className="font-mono text-[9px] text-black/15">25</span>
        <span className="font-mono text-[9px] text-black/15">50</span>
        <span className="font-mono text-[9px] text-black/15">75</span>
        <span className="font-mono text-[9px] text-black/15">100</span>
      </div>
      <div className="relative mt-1">
        <div className="absolute -translate-x-1/2" style={{ left: `${D.score}%` }}>
          <p className="font-mono text-[10px] font-bold text-black/50">{D.q1}</p>
        </div>
        <div className="absolute -translate-x-1/2" style={{ left: '80%' }}>
          <p className="font-mono text-[10px] text-black/15">{D.q2}</p>
        </div>
      </div>
    </div>
  )
}

// 11: Growth trajectory with "you are here" pin
function D11() {
  const h = 100, yP = Y(D.score, h, 16)
  return (
    <svg width="100%" height={h} viewBox="0 0 300 100" className="overflow-visible">
      <defs><linearGradient id="g11" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={D.color} stopOpacity="0.08" /><stop offset="100%" stopColor={D.color} stopOpacity="0" /></linearGradient></defs>
      <line x1="30" y1={h - 16} x2="290" y2={h - 16} stroke="rgba(0,0,0,0.04)" />
      {/* Target zone at top */}
      <rect x="30" y="16" width="260" height="16" fill="rgba(0,0,0,0.015)" rx="2" />
      <text x="160" y="27" textAnchor="middle" fontSize="7" fill="rgba(0,0,0,0.1)" className="font-mono">TARGET ZONE: 80-100%</text>
      {/* Path */}
      <path d={`M 30,${h - 16} Q 55,${h - 16} 80,${yP}`} fill="none" stroke={D.color} strokeWidth="2.5" strokeLinecap="round" />
      <path d={`M 30,${h - 16} Q 55,${h - 16} 80,${yP} L 80,${h - 16} Z`} fill="url(#g11)" />
      {/* Growth arrow projection */}
      <path d={`M 80,${yP} C 120,${yP - 5} 160,${yP - 12} 230,${Y(82, h, 16)}`} fill="none" stroke={D.color} strokeWidth="1" strokeDasharray="8 4" opacity="0.15" />
      <polygon points={`226,${Y(82, h, 16) + 4} 234,${Y(82, h, 16)} 226,${Y(82, h, 16) - 4}`} fill={D.color} opacity="0.15" />
      {/* Pin marker */}
      <line x1="80" y1={yP} x2="80" y2={yP - 25} stroke={D.color} strokeWidth="1.5" />
      <circle cx="80" cy={yP - 25} r="8" fill={D.color} />
      <text x="80" y={yP - 22} textAnchor="middle" fontSize="8" fontWeight="bold" fill="white" className="font-mono">{D.score}</text>
      <circle cx="80" cy={yP} r="3" fill={D.color} />
      {/* Future markers */}
      <circle cx="155" cy={Y(D.score + 6, h, 16)} r="4" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="1.5" strokeDasharray="3 2" />
      <circle cx="230" cy={Y(82, h, 16)} r="3.5" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="1" strokeDasharray="2 2" />
      {/* Labels */}
      <text x="80" y={h - 2} textAnchor="middle" fontSize="9" fontWeight="bold" fill="rgba(0,0,0,0.4)" className="font-mono">{D.q1}</text>
      <text x="155" y={h - 2} textAnchor="middle" fontSize="9" fill="rgba(0,0,0,0.12)" className="font-mono">{D.q2}</text>
      <text x="230" y={h - 2} textAnchor="middle" fontSize="8" fill="rgba(0,0,0,0.06)" className="font-mono">{D.q3}</text>
    </svg>
  )
}

// 12: Cards with growth delta arrows
function D12() {
  return (
    <div className="grid grid-cols-4 gap-3">
      <div className="rounded-lg p-5 border-l-4" style={{ borderColor: D.color, backgroundColor: `${D.color}08` }}>
        <p className="font-mono text-[10px] font-bold text-black/50 mb-1">{D.q1}</p>
        <div className="flex items-baseline gap-2">
          <p className="text-3xl font-bold font-mono tracking-tight" style={{ color: D.color }}>{D.score}</p>
          <span className="font-mono text-sm text-black/30">%</span>
        </div>
        <p className="text-[10px] text-black/40 mt-1.5">{D.label}</p>
        <div className="mt-3 h-2 rounded-full bg-black/5">
          <div className="h-full rounded-full" style={{ width: `${D.score}%`, backgroundColor: D.color }} />
        </div>
      </div>
      <div className="rounded-lg p-5 border border-dashed border-black/10 flex flex-col justify-center items-center">
        <p className="font-mono text-[10px] text-black/20 mb-2">{D.q2}</p>
        <div className="w-10 h-10 rounded-full border-2 border-dashed border-black/8 flex items-center justify-center mb-2">
          <svg className="w-4 h-4 text-black/15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" /></svg>
        </div>
        <p className="text-[9px] text-black/15">Growth target</p>
      </div>
      <div className="rounded-lg p-5 border border-dashed border-black/5 flex flex-col justify-center items-center">
        <p className="font-mono text-[10px] text-black/12 mb-2">{D.q3}</p>
        <div className="w-10 h-10 rounded-full border border-dashed border-black/5 flex items-center justify-center mb-2">
          <svg className="w-4 h-4 text-black/8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" /></svg>
        </div>
        <p className="text-[9px] text-black/8">Future</p>
      </div>
      <div className="rounded-lg p-5 border border-dashed border-black/[0.03] flex flex-col justify-center items-center">
        <p className="font-mono text-[10px] text-black/8 mb-2">{D.q4}</p>
        <div className="w-8 h-8 rounded-full border border-dashed border-black/[0.03]" />
      </div>
    </div>
  )
}

// 13: Gauge meter with quarterly ticks
function D13() {
  const angle = -90 + (D.score / 100) * 180
  const r = 50, cx = 80, cy = 60
  return (
    <div className="flex items-center gap-8">
      <svg width="160" height="90" viewBox="0 0 160 90" className="overflow-visible">
        {/* Arc track */}
        <path d={`M ${cx - r},${cy} A ${r},${r} 0 0,1 ${cx + r},${cy}`} fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth="10" strokeLinecap="round" />
        {/* Filled arc */}
        <path d={`M ${cx - r},${cy} A ${r},${r} 0 0,1 ${cx + Math.cos(angle * Math.PI / 180) * r},${cy + Math.sin(angle * Math.PI / 180) * r}`} fill="none" stroke={D.color} strokeWidth="10" strokeLinecap="round" />
        {/* Quarter tick marks */}
        {[0, 1, 2, 3].map(i => {
          const a = -90 + (25 * (i + 1) / 100) * 180
          const ox = cx + Math.cos(a * Math.PI / 180) * (r + 8)
          const oy = cy + Math.sin(a * Math.PI / 180) * (r + 8)
          return <circle key={i} cx={ox} cy={oy} r="2" fill={i === 0 ? D.color : `rgba(0,0,0,${0.15 - i * 0.04})`} />
        })}
        {/* Needle dot */}
        <circle cx={cx + Math.cos(angle * Math.PI / 180) * r} cy={cy + Math.sin(angle * Math.PI / 180) * r} r="6" fill={D.color} stroke="white" strokeWidth="2" />
        <text x={cx} y={cy + 5} textAnchor="middle" fontSize="18" fontWeight="bold" fill="rgba(0,0,0,0.7)" className="font-mono">{D.score}%</text>
        <text x={cx} y={cy + 18} textAnchor="middle" fontSize="8" fill="rgba(0,0,0,0.25)" className="font-mono">{D.label}</text>
      </svg>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: D.color }} />
          <span className="font-mono text-xs font-bold text-black/60">{D.q1}: {D.score}%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full border-2 border-dashed border-black/15" />
          <span className="font-mono text-xs text-black/20">{D.q2}: upcoming</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full border border-dashed border-black/8" />
          <span className="font-mono text-xs text-black/10">{D.q3}</span>
        </div>
      </div>
    </div>
  )
}

// 14: Big number with inline sparkline + quarters below
function D14() {
  const h = 40, yP = 5 + (h - 10) * (1 - D.score / 100)
  return (
    <div>
      <div className="flex items-center gap-6 mb-4">
        <div>
          <p className="text-4xl font-bold font-mono tracking-tight" style={{ color: D.color }}>{D.score}%</p>
          <p className="text-xs text-black/30 mt-0.5">{D.label} &middot; {D.q1}</p>
        </div>
        <div className="flex-1">
          <svg width="100%" height={h} viewBox="0 0 200 40" className="overflow-visible">
            <defs><linearGradient id="g14" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={D.color} stopOpacity="0.1" /><stop offset="100%" stopColor={D.color} stopOpacity="0" /></linearGradient></defs>
            <polygon points={`0,${h} 25,${h} 50,${yP} 50,${h}`} fill="url(#g14)" />
            <polyline points={`0,${h} 25,${h * 0.8} 50,${yP}`} fill="none" stroke={D.color} strokeWidth="2" strokeLinecap="round" />
            <circle cx="50" cy={yP} r="4" fill={D.color} stroke="white" strokeWidth="1.5" />
            <line x1="50" y1={yP} x2="100" y2={yP} stroke="rgba(0,0,0,0.06)" strokeDasharray="4 3" />
            <circle cx="100" cy={yP} r="3" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="1.5" strokeDasharray="2 2" />
            <line x1="100" y1={yP} x2="150" y2={yP} stroke="rgba(0,0,0,0.03)" strokeDasharray="3 3" />
            <circle cx="150" cy={yP} r="2.5" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="1" strokeDasharray="2 2" />
            <text x="50" y={h - 1} fontSize="8" textAnchor="middle" fill="rgba(0,0,0,0.3)" className="font-mono">{D.q1}</text>
            <text x="100" y={h - 1} fontSize="8" textAnchor="middle" fill="rgba(0,0,0,0.12)" className="font-mono">{D.q2}</text>
            <text x="150" y={h - 1} fontSize="7" textAnchor="middle" fill="rgba(0,0,0,0.06)" className="font-mono">{D.q3}</text>
          </svg>
        </div>
      </div>
      <div className="h-1.5 rounded-full bg-black/[0.03]">
        <div className="h-full rounded-full" style={{ width: `${D.score}%`, backgroundColor: D.color }} />
      </div>
    </div>
  )
}

// 15: Two-row: chart on top, card slots on bottom
function D15() {
  const h = 70, yP = Y(D.score, h, 12)
  return (
    <div className="space-y-4">
      <svg width="100%" height={h} viewBox="0 0 300 70" className="overflow-visible">
        <defs><linearGradient id="g15" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={D.color} stopOpacity="0.1" /><stop offset="100%" stopColor={D.color} stopOpacity="0" /></linearGradient></defs>
        <line x1="0" y1={h - 12} x2="300" y2={h - 12} stroke="rgba(0,0,0,0.03)" />
        <polygon points={`0,${h - 12} 75,${yP} 75,${h - 12}`} fill="url(#g15)" />
        <path d={`M 0,${h - 12} Q 37,${h - 12} 75,${yP}`} fill="none" stroke={D.color} strokeWidth="2" strokeLinecap="round" />
        <circle cx="75" cy={yP} r="5" fill={D.color} stroke="white" strokeWidth="2" />
        <text x="75" y={yP - 10} textAnchor="middle" fontSize="11" fontWeight="bold" fill={D.color} className="font-mono">{D.score}%</text>
        <line x1="75" y1={yP} x2="150" y2={yP} stroke="rgba(0,0,0,0.05)" strokeDasharray="4 3" />
        <circle cx="150" cy={yP} r="3.5" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="1.5" strokeDasharray="3 2" />
        <line x1="150" y1={yP} x2="225" y2={yP} stroke="rgba(0,0,0,0.02)" strokeDasharray="3 3" />
        <circle cx="225" cy={yP} r="3" fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth="1" strokeDasharray="2 2" />
      </svg>
      <div className="grid grid-cols-4 gap-2">
        {[
          { q: D.q1, active: true },
          { q: D.q2, active: false },
          { q: D.q3, active: false },
          { q: D.q4, active: false },
        ].map(({ q, active }, i) => (
          <div key={i} className={`rounded-lg p-3 text-center ${active ? 'border-2' : 'border border-dashed'}`} style={{ borderColor: active ? D.color : `rgba(0,0,0,${0.1 - i * 0.025})` }}>
            <p className="font-mono text-[10px]" style={{ color: active ? D.color : `rgba(0,0,0,${0.3 - i * 0.08})` }}>{q}</p>
            {active && <p className="font-mono text-lg font-bold mt-1" style={{ color: D.color }}>{D.score}%</p>}
            {!active && <p className="font-mono text-lg font-bold mt-1" style={{ color: `rgba(0,0,0,${0.08 - i * 0.02})` }}>&mdash;</p>}
          </div>
        ))}
      </div>
    </div>
  )
}

// 16: Radial progress with quarter segments
function D16() {
  const r = 42, cx = 55, cy = 55, circumference = 2 * Math.PI * r
  const filled = (D.score / 100) * circumference
  return (
    <div className="flex items-center gap-8">
      <svg width="110" height="110" viewBox="0 0 110 110">
        {/* Track */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth="8" />
        {/* Quarter segment lines */}
        {[0, 1, 2, 3].map(i => {
          const a = (-90 + i * 90) * Math.PI / 180
          return <line key={i} x1={cx + Math.cos(a) * (r - 5)} y1={cy + Math.sin(a) * (r - 5)} x2={cx + Math.cos(a) * (r + 5)} y2={cy + Math.sin(a) * (r + 5)} stroke="rgba(0,0,0,0.06)" strokeWidth="1" />
        })}
        {/* Progress */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={D.color} strokeWidth="8" strokeDasharray={`${filled} ${circumference - filled}`} strokeDashoffset={circumference * 0.25} strokeLinecap="round" transform={`rotate(-90 ${cx} ${cy})`} />
        <text x={cx} y={cy - 4} textAnchor="middle" fontSize="20" fontWeight="bold" fill="rgba(0,0,0,0.7)" className="font-mono">{D.score}%</text>
        <text x={cx} y={cy + 12} textAnchor="middle" fontSize="9" fill="rgba(0,0,0,0.25)" className="font-mono">{D.q1}</text>
      </svg>
      <div className="flex-1 space-y-3">
        {[
          { q: D.q1, score: D.score, filled: true },
          { q: D.q2, score: null, filled: false },
          { q: D.q3, score: null, filled: false },
          { q: D.q4, score: null, filled: false },
        ].map(({ q, score, filled: f }, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${f ? '' : 'border border-dashed'}`} style={{ backgroundColor: f ? D.color : 'transparent', borderColor: `rgba(0,0,0,${0.15 - i * 0.04})` }} />
            <span className="font-mono text-[10px] w-12" style={{ color: `rgba(0,0,0,${f ? 0.5 : 0.15 - i * 0.03})` }}>{q}</span>
            <div className="flex-1 h-1.5 rounded-full" style={{ backgroundColor: `rgba(0,0,0,${f ? 0.04 : 0.02})` }}>
              {f && <div className="h-full rounded-full" style={{ width: `${D.score}%`, backgroundColor: D.color }} />}
            </div>
            <span className="font-mono text-[10px] w-8 text-right" style={{ color: f ? D.color : `rgba(0,0,0,${0.1 - i * 0.03})` }}>{score ? `${score}%` : '—'}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// 17: Clean area chart with quarter columns
function D17() {
  const h = 100, yP = Y(D.score, h, 16)
  return (
    <svg width="100%" height={h} viewBox="0 0 320 100" className="overflow-visible">
      <defs><linearGradient id="g17" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={D.color} stopOpacity="0.1" /><stop offset="100%" stopColor={D.color} stopOpacity="0" /></linearGradient></defs>
      {/* Quarter column backgrounds */}
      <rect x="20" y="16" width="70" height={h - 36} fill="rgba(0,0,0,0.008)" rx="4" />
      <rect x="95" y="16" width="70" height={h - 36} fill="rgba(0,0,0,0.004)" rx="4" />
      <rect x="170" y="16" width="70" height={h - 36} fill="rgba(0,0,0,0.002)" rx="4" />
      <rect x="245" y="16" width="70" height={h - 36} fill="rgba(0,0,0,0.001)" rx="4" />
      {/* X axis */}
      <line x1="20" y1={h - 16} x2="315" y2={h - 16} stroke="rgba(0,0,0,0.04)" />
      {/* Area */}
      <path d={`M 20,${h - 16} L 55,${yP} L 55,${h - 16} Z`} fill="url(#g17)" />
      <path d={`M 20,${h - 16} Q 37,${h - 16} 55,${yP}`} fill="none" stroke={D.color} strokeWidth="2.5" strokeLinecap="round" />
      {/* Current */}
      <circle cx="55" cy={yP} r="6" fill={D.color} stroke="white" strokeWidth="2.5" />
      <text x="55" y={yP - 12} textAnchor="middle" fontSize="12" fontWeight="bold" fill={D.color} className="font-mono">{D.score}%</text>
      {/* Future */}
      <line x1="55" y1={yP} x2="130" y2={yP} stroke="rgba(0,0,0,0.05)" strokeDasharray="4 3" />
      <circle cx="130" cy={yP} r="4" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="1.5" strokeDasharray="3 2" />
      <line x1="130" y1={yP} x2="205" y2={yP} stroke="rgba(0,0,0,0.02)" strokeDasharray="3 3" />
      <circle cx="205" cy={yP} r="3" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="1" strokeDasharray="2 2" />
      {/* Labels */}
      <text x="55" y={h - 3} textAnchor="middle" fontSize="9" fontWeight="bold" fill="rgba(0,0,0,0.4)" className="font-mono">{D.q1}</text>
      <text x="130" y={h - 3} textAnchor="middle" fontSize="9" fill="rgba(0,0,0,0.15)" className="font-mono">{D.q2}</text>
      <text x="205" y={h - 3} textAnchor="middle" fontSize="8" fill="rgba(0,0,0,0.07)" className="font-mono">{D.q3}</text>
      <text x="280" y={h - 3} textAnchor="middle" fontSize="8" fill="rgba(0,0,0,0.04)" className="font-mono">{D.q4}</text>
    </svg>
  )
}

// 18: Split view — big score left, mini chart right
function D18() {
  const h = 60, yP = 8 + (h - 16) * (1 - D.score / 100)
  return (
    <div className="flex items-center gap-6">
      <div className="flex-shrink-0 w-24 h-24 rounded-lg flex flex-col items-center justify-center" style={{ backgroundColor: `${D.color}08`, border: `2px solid ${D.color}` }}>
        <p className="text-3xl font-bold font-mono" style={{ color: D.color }}>{D.score}</p>
        <p className="font-mono text-[9px] text-black/30 -mt-0.5">percent</p>
      </div>
      <div className="flex-1">
        <svg width="100%" height={h} viewBox="0 0 220 60" className="overflow-visible">
          <defs><linearGradient id="g18" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={D.color} stopOpacity="0.08" /><stop offset="100%" stopColor={D.color} stopOpacity="0" /></linearGradient></defs>
          <polygon points={`0,${h - 8} 55,${yP} 55,${h - 8}`} fill="url(#g18)" />
          <polyline points={`0,${h - 8} 30,${h - 8} 55,${yP}`} fill="none" stroke={D.color} strokeWidth="2" strokeLinecap="round" />
          <circle cx="55" cy={yP} r="4" fill={D.color} stroke="white" strokeWidth="2" />
          <line x1="55" y1={yP} x2="110" y2={yP} stroke="rgba(0,0,0,0.05)" strokeDasharray="4 3" />
          <circle cx="110" cy={yP} r="3" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="1.5" strokeDasharray="3 2" />
          <line x1="110" y1={yP} x2="165" y2={yP} stroke="rgba(0,0,0,0.02)" strokeDasharray="3 3" />
          <circle cx="165" cy={yP} r="2.5" fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth="1" strokeDasharray="2 2" />
          <text x="55" y={h - 0} fontSize="8" textAnchor="middle" fill="rgba(0,0,0,0.35)" fontWeight="bold" className="font-mono">{D.q1}</text>
          <text x="110" y={h - 0} fontSize="8" textAnchor="middle" fill="rgba(0,0,0,0.12)" className="font-mono">{D.q2}</text>
          <text x="165" y={h - 0} fontSize="7" textAnchor="middle" fill="rgba(0,0,0,0.06)" className="font-mono">{D.q3}</text>
        </svg>
      </div>
    </div>
  )
}

// 19: Layered bar comparison (current vs future zones)
function D19() {
  return (
    <div className="space-y-2">
      {/* Main bar with zones */}
      <div className="relative h-12 bg-black/[0.02] rounded-lg overflow-hidden">
        {/* Benchmark zone */}
        <div className="absolute top-0 h-full" style={{ left: `${D.bP25}%`, width: `${D.bP75 - D.bP25}%`, backgroundColor: 'rgba(0,0,0,0.02)' }} />
        {/* Current fill */}
        <div className="absolute top-0 left-0 h-full rounded-l-lg flex items-center justify-end pr-3" style={{ width: `${D.score}%`, backgroundColor: `${D.color}18` }}>
          <span className="font-mono text-sm font-bold" style={{ color: D.color }}>{D.score}%</span>
        </div>
        {/* Score marker line */}
        <div className="absolute top-0 h-full w-0.5" style={{ left: `${D.score}%`, backgroundColor: D.color }} />
        {/* Future zone indicator */}
        <div className="absolute top-0 h-full border-l-2 border-dashed" style={{ left: '80%', borderColor: 'rgba(0,0,0,0.06)' }}>
          <span className="absolute top-1 left-2 font-mono text-[8px] text-black/10">target</span>
        </div>
      </div>
      {/* Quarter timeline below */}
      <div className="flex">
        <div className="flex-1 text-center border-r border-black/5 py-1.5">
          <p className="font-mono text-[10px] font-bold" style={{ color: D.color }}>{D.q1}</p>
        </div>
        <div className="flex-1 text-center border-r border-black/[0.03] py-1.5">
          <p className="font-mono text-[10px] text-black/20">{D.q2}</p>
        </div>
        <div className="flex-1 text-center border-r border-black/[0.02] py-1.5">
          <p className="font-mono text-[10px] text-black/10">{D.q3}</p>
        </div>
        <div className="flex-1 text-center py-1.5">
          <p className="font-mono text-[10px] text-black/6">{D.q4}</p>
        </div>
      </div>
    </div>
  )
}

// 20: Elegant chart with smooth Bezier + floating score badge
function D20() {
  const h = 110, yP = Y(D.score, h, 20), bT = Y(D.bP75, h, 20), bB = Y(D.bP25, h, 20)
  return (
    <svg width="100%" height={h} viewBox="0 0 340 110" className="overflow-visible">
      <defs>
        <linearGradient id="g20" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={D.color} stopOpacity="0.12" /><stop offset="100%" stopColor={D.color} stopOpacity="0" /></linearGradient>
        <filter id="sh20"><feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.08" /></filter>
      </defs>
      {/* Grid */}
      <line x1="40" y1={h - 22} x2="330" y2={h - 22} stroke="rgba(0,0,0,0.04)" />
      <line x1="40" y1="14" x2="40" y2={h - 22} stroke="rgba(0,0,0,0.04)" />
      <text x="36" y="19" textAnchor="end" fontSize="8" fill="rgba(0,0,0,0.12)" className="font-mono">100</text>
      <text x="36" y={h / 2} textAnchor="end" fontSize="8" fill="rgba(0,0,0,0.08)" className="font-mono">50</text>
      <text x="36" y={h - 21} textAnchor="end" fontSize="8" fill="rgba(0,0,0,0.12)" className="font-mono">0</text>
      {/* Benchmark */}
      <rect x="40" y={bT} width="290" height={bB - bT} fill="rgba(0,0,0,0.015)" rx="3" />
      {/* Area */}
      <path d={`M 40,${h - 22} C 65,${h - 22} 80,${yP + 10} 110,${yP} L 110,${h - 22} Z`} fill="url(#g20)" />
      {/* Smooth curve */}
      <path d={`M 40,${h - 22} C 65,${h - 22} 80,${yP + 10} 110,${yP}`} fill="none" stroke={D.color} strokeWidth="2.5" strokeLinecap="round" />
      {/* Floating badge */}
      <rect x="86" y={yP - 28} width="48" height="22" rx="6" fill="white" filter="url(#sh20)" />
      <rect x="86" y={yP - 28} width="48" height="22" rx="6" fill="none" stroke={D.color} strokeWidth="1" opacity="0.3" />
      <text x="110" y={yP - 14} textAnchor="middle" fontSize="12" fontWeight="bold" fill={D.color} className="font-mono">{D.score}%</text>
      {/* Current dot */}
      <circle cx="110" cy={yP} r="5" fill={D.color} stroke="white" strokeWidth="2" />
      {/* Future projection */}
      <path d={`M 110,${yP} Q 160,${yP - 3} 190,${Y(D.score + 5, h, 20)}`} fill="none" stroke={D.color} strokeWidth="1" strokeDasharray="6 4" opacity="0.2" />
      <circle cx="190" cy={Y(D.score + 5, h, 20)} r="4" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="1.5" strokeDasharray="3 2" />
      <path d={`M 190,${Y(D.score + 5, h, 20)} Q 230,${Y(D.score + 8, h, 20)} 270,${Y(D.score + 10, h, 20)}`} fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth="1" strokeDasharray="4 4" />
      <circle cx="270" cy={Y(D.score + 10, h, 20)} r="3" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="1" strokeDasharray="2 2" />
      {/* X labels */}
      <text x="40" y={h - 6} textAnchor="middle" fontSize="8" fill="rgba(0,0,0,0.1)" className="font-mono">Start</text>
      <text x="110" y={h - 6} textAnchor="middle" fontSize="9" fontWeight="bold" fill="rgba(0,0,0,0.4)" className="font-mono">{D.q1}</text>
      <text x="190" y={h - 6} textAnchor="middle" fontSize="9" fill="rgba(0,0,0,0.15)" className="font-mono">{D.q2}</text>
      <text x="270" y={h - 6} textAnchor="middle" fontSize="8" fill="rgba(0,0,0,0.06)" className="font-mono">{D.q3}</text>
    </svg>
  )
}

// 21: Wide cards with integrated horizontal chart
function D21() {
  return (
    <div className="grid grid-cols-4 gap-3">
      <div className="col-span-2 rounded-lg p-5 border-2 flex items-center gap-5" style={{ borderColor: D.color }}>
        <div className="flex-shrink-0">
          <p className="font-mono text-[10px] font-bold text-black/50 mb-1">{D.q1} &middot; Current</p>
          <p className="text-3xl font-bold font-mono tracking-tight" style={{ color: D.color }}>{D.score}%</p>
          <p className="text-[10px] text-black/35 mt-0.5">{D.label}</p>
        </div>
        <div className="flex-1">
          <div className="h-3 rounded-full bg-black/[0.04]">
            <div className="h-full rounded-full" style={{ width: `${D.score}%`, backgroundColor: D.color }} />
          </div>
          <div className="flex justify-between mt-1">
            <span className="font-mono text-[8px] text-black/15">0</span>
            <span className="font-mono text-[8px] text-black/15">100</span>
          </div>
        </div>
      </div>
      <div className="rounded-lg p-5 border border-dashed border-black/10 flex flex-col justify-center items-center bg-black/[0.008]">
        <p className="font-mono text-[10px] text-black/20 mb-1">{D.q2}</p>
        <div className="w-8 h-8 rounded-full border-2 border-dashed border-black/10 flex items-center justify-center">
          <svg className="w-3.5 h-3.5 text-black/15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" /></svg>
        </div>
        <p className="text-[8px] text-black/12 mt-1.5">Upcoming</p>
      </div>
      <div className="rounded-lg p-5 border border-dashed border-black/5 flex flex-col justify-center items-center bg-black/[0.004]">
        <p className="font-mono text-[10px] text-black/10 mb-1">{D.q3}</p>
        <div className="w-8 h-8 rounded-full border border-dashed border-black/5" />
        <p className="text-[8px] text-black/6 mt-1.5">&nbsp;</p>
      </div>
    </div>
  )
}

// 22: Minimal elegant — score, thin line, future dots
function D22() {
  const h = 70, yP = Y(D.score, h, 10)
  return (
    <svg width="100%" height={h} viewBox="0 0 300 70" className="overflow-visible">
      <line x1="10" y1={h - 10} x2="290" y2={h - 10} stroke="rgba(0,0,0,0.03)" />
      {/* Elegant thin line */}
      <path d={`M 10,${h - 10} C 40,${h - 10} 55,${yP} 75,${yP}`} fill="none" stroke={D.color} strokeWidth="1.5" strokeLinecap="round" />
      {/* Glow */}
      <circle cx="75" cy={yP} r="14" fill={D.color} opacity="0.04" />
      <circle cx="75" cy={yP} r="8" fill={D.color} opacity="0.06" />
      <circle cx="75" cy={yP} r="4" fill={D.color} stroke="white" strokeWidth="2" />
      {/* Score */}
      <text x="75" y={yP - 16} textAnchor="middle" fontSize="14" fontWeight="bold" fill="rgba(0,0,0,0.65)" className="font-mono">{D.score}%</text>
      <text x="75" y={yP - 5} textAnchor="middle" fontSize="7" fill="rgba(0,0,0,0.2)">{D.label}</text>
      {/* Future line */}
      <line x1="75" y1={yP} x2="290" y2={yP} stroke="rgba(0,0,0,0.04)" strokeDasharray="6 6" />
      {/* Quarter markers */}
      <circle cx="150" cy={yP} r="3.5" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="1.5" strokeDasharray="3 2" />
      <circle cx="225" cy={yP} r="3" fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth="1" strokeDasharray="2 2" />
      {/* X labels */}
      <text x="75" y={h - 1} textAnchor="middle" fontSize="9" fontWeight="bold" fill="rgba(0,0,0,0.35)" className="font-mono">{D.q1}</text>
      <text x="150" y={h - 1} textAnchor="middle" fontSize="8" fill="rgba(0,0,0,0.12)" className="font-mono">{D.q2}</text>
      <text x="225" y={h - 1} textAnchor="middle" fontSize="8" fill="rgba(0,0,0,0.06)" className="font-mono">{D.q3}</text>
    </svg>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// DESIGNS REGISTRY
// ═══════════════════════════════════════════════════════════════════════════════

const DESIGNS: { id: number; name: string; desc: string; C: () => React.ReactNode }[] = [
  { id: 1, name: 'Original A — Detailed Line Chart', desc: 'Full x/y axes, gradient fill, halo dot, benchmark band, quarter labels', C: OrigA },
  { id: 2, name: 'Original B — Card Grid', desc: 'Side-by-side quarter cards with score, label, and mini progress bar', C: OrigB },
  { id: 3, name: 'Smooth Growth Curve', desc: 'Bezier curve with upward projection, glow dot, widening future ghosts', C: D3 },
  { id: 4, name: 'Step Plateau Chart', desc: 'Stepped chart showing your score as a held level with future plateaus', C: D4 },
  { id: 5, name: 'Minimal Dot + Arrow', desc: 'Ultra-clean line with prominent dot and directional growth arrow', C: D5 },
  { id: 6, name: 'Bold Bar + Mini Chart', desc: 'Thick progress bar on top, compact growth chart below', C: D6 },
  { id: 7, name: 'Timeline Pill Slots', desc: 'Colored pill for current, empty slots for future with chevrons between', C: D7 },
  { id: 8, name: 'Confidence Band Chart', desc: 'Widening uncertainty cone showing possible growth trajectories', C: D8 },
  { id: 9, name: 'Cards + Embedded Sparklines', desc: 'Quarter cards with sparkline charts inside, "Now" badge on current', C: D9 },
  { id: 10, name: 'Track + Position Marker', desc: 'Horizontal gauge track with large score pill at current position', C: D10 },
  { id: 11, name: 'Pin Map + Target Zone', desc: 'Growth trajectory with "you are here" pin, target zone at top, arrow to goal', C: D11 },
  { id: 12, name: 'Cards + Growth Arrows', desc: 'Current score card with accent border, future cards with upward growth icons', C: D12 },
  { id: 13, name: 'Gauge Meter', desc: 'Semi-circle gauge with quarter ticks, legend sidebar', C: D13 },
  { id: 14, name: 'Big Number + Spark', desc: 'Large score number left, inline sparkline right, thin bar below', C: D14 },
  { id: 15, name: 'Chart + Card Slots', desc: 'Area chart on top, clickable quarter card slots on bottom', C: D15 },
  { id: 16, name: 'Radial + Quarter List', desc: 'Circular progress ring with quarterly breakdown list beside it', C: D16 },
  { id: 17, name: 'Column Zone Chart', desc: 'Quarter column backgrounds with area chart overlaid', C: D17 },
  { id: 18, name: 'Split Score + Chart', desc: 'Large score box left, mini trajectory chart right', C: D18 },
  { id: 19, name: 'Layered Bar + Timeline', desc: 'Thick bar with zones (current, benchmark, target), quarter row below', C: D19 },
  { id: 20, name: 'Floating Badge Chart', desc: 'Elegant Bezier curve with floating score badge, smooth projections', C: D20 },
  { id: 21, name: 'Wide Card + Slots', desc: 'Current takes 2 cols with bar, future quarters as compact add-slots', C: D21 },
  { id: 22, name: 'Minimalist Glow', desc: 'Ultra-minimal with concentric glow, thin curve, subtle future line', C: D22 },
]

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE
// ═══════════════════════════════════════════════════════════════════════════════

export default function TimelinePreviewPage() {
  const [selected, setSelected] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-[#F7F3ED] py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="font-mono text-xs uppercase tracking-[0.12em] text-black/40 mb-2">Design Preview</p>
          <h1 className="text-3xl font-bold text-black mb-2">Dimension Growth Timeline — 22 Options</h1>
          <p className="text-base text-black/40">Self-Awareness &middot; 65% (Strong) &middot; Q1 2026</p>
        </div>

        <div className="space-y-6">
          {DESIGNS.map(({ id, name, desc, C }) => (
            <button
              key={id}
              onClick={() => setSelected(id)}
              className={`w-full text-left bg-white rounded-lg p-8 border-2 transition-all ${
                selected === id ? 'border-black ring-2 ring-black/5' : 'border-black/10 hover:border-black/25'
              }`}
            >
              <div className="flex items-start justify-between mb-5">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full font-mono text-xs font-bold ${
                      id <= 2 ? 'bg-black/10 text-black/50' : 'bg-black/5 text-black/40'
                    }`}>{id}</span>
                    <h2 className="text-base font-semibold text-black">{name}</h2>
                  </div>
                  <p className="text-sm text-black/35 ml-10">{desc}</p>
                </div>
                {selected === id && (
                  <span className="bg-black text-white px-3 py-1 rounded text-xs font-bold flex-shrink-0">Selected</span>
                )}
              </div>

              <div className="bg-[#F7F3ED]/40 rounded-lg p-6">
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <p className="text-xs text-black/40 mb-0.5">LY.1</p>
                    <h3 className="text-lg font-semibold text-black">Self-Awareness</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-black">65%</span>
                    <p className="text-xs text-black/40">Strong</p>
                  </div>
                </div>
                <C />
              </div>
            </button>
          ))}
        </div>

        {selected && (
          <div className="sticky bottom-6 mt-8 bg-black text-white rounded-lg p-5 text-center shadow-lg">
            <p className="text-base font-semibold">Design {selected}: {DESIGNS.find(d => d.id === selected)?.name}</p>
          </div>
        )}
      </div>
    </div>
  )
}
