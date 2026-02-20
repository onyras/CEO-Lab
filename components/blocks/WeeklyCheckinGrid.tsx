'use client'

interface WeeklyCheckinGridProps {
  completedWeeksThisQuarter: number[]
  currentWeekOfQuarter: number
  currentQuarter: number
  currentYear: number
  currentStreak: number
}

export function WeeklyCheckinGrid({
  completedWeeksThisQuarter,
  currentWeekOfQuarter,
  currentQuarter,
  currentYear,
  currentStreak,
}: WeeklyCheckinGridProps) {
  const completedWeeksCount = completedWeeksThisQuarter.length
  const completedWeeksSet = new Set(completedWeeksThisQuarter)

  return (
    <div className="mb-16">
      <div className="flex items-end justify-between pb-5 border-b border-black/10 mb-8">
        <div>
          <p className="font-mono text-sm uppercase tracking-[0.12em] text-black/50 mb-2">Weekly Check-Ins</p>
          <h2 className="text-2xl font-semibold tracking-tight">Q{currentQuarter} {currentYear} Progress</h2>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold font-mono">{completedWeeksCount}<span className="text-lg font-normal text-black/35">/12</span></p>
          <p className="font-mono text-base text-black/60 uppercase tracking-[0.08em]">weeks completed</p>
        </div>
      </div>

      <div className="bg-white border border-black/10 rounded-lg p-8">
        <div className="grid grid-cols-6 gap-4">
          {Array.from({ length: 12 }, (_, i) => {
            const weekNum = i + 1
            const isCompleted = completedWeeksSet.has(weekNum)
            const isCurrent = weekNum === currentWeekOfQuarter && !isCompleted
            const isFuture = weekNum > currentWeekOfQuarter

            if (isCompleted) {
              return (
                <div key={weekNum} className="flex flex-col items-center gap-2">
                  <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <span className="font-mono text-base text-black/60">W{weekNum}</span>
                </div>
              )
            }

            if (isCurrent) {
              return (
                <a key={weekNum} href="/assessment/weekly" className="flex flex-col items-center gap-2 group">
                  <div className="w-14 h-14 rounded-full border-2 border-black flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                    <span className="font-mono text-base font-bold group-hover:text-white">{weekNum}</span>
                  </div>
                  <span className="font-mono text-xs text-black font-bold">Now</span>
                </a>
              )
            }

            return (
              <div key={weekNum} className="flex flex-col items-center gap-2">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
                  isFuture ? 'bg-black/[0.03]' : 'bg-black/[0.06]'
                }`}>
                  <span className={`font-mono text-base ${isFuture ? 'text-black/15' : 'text-black/35'}`}>{weekNum}</span>
                </div>
                <span className="font-mono text-xs text-black/20">W{weekNum}</span>
              </div>
            )
          })}
        </div>

        {currentStreak > 0 && (
          <div className="mt-6 pt-6 border-t border-black/5">
            <p className="text-base text-black/50">
              <span className="font-mono font-bold text-black">{currentStreak}</span> week streak
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
