import type { SupabaseClient } from '@supabase/supabase-js'

export interface StreakData {
  currentStreak: number
  longestStreak: number
  totalWeeks: number
  lastCheckIn: string | null
  isDueThisWeek: boolean
}

/**
 * Calculate streak data from weekly_pulse entries.
 * Groups by ISO week and counts consecutive weeks with at least 1 response.
 */
export async function getStreakData(
  supabase: SupabaseClient,
  userId: string
): Promise<StreakData> {
  const { data: pulseRows, error } = await supabase
    .from('weekly_pulse')
    .select('responded_at')
    .eq('ceo_id', userId)
    .order('responded_at', { ascending: true })

  if (error || !pulseRows || pulseRows.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      totalWeeks: 0,
      lastCheckIn: null,
      isDueThisWeek: true,
    }
  }

  // Group responses by ISO week number
  const weekSet = new Set<string>()
  let lastDate: string | null = null

  for (const row of pulseRows) {
    const date = new Date(row.responded_at)
    const weekKey = getISOWeekKey(date)
    weekSet.add(weekKey)
    lastDate = row.responded_at
  }

  const sortedWeeks = [...weekSet].sort()
  const totalWeeks = sortedWeeks.length

  // Calculate streaks
  let currentStreak = 0
  let longestStreak = 0
  let tempStreak = 1

  for (let i = 1; i < sortedWeeks.length; i++) {
    if (areConsecutiveWeeks(sortedWeeks[i - 1], sortedWeeks[i])) {
      tempStreak++
    } else {
      longestStreak = Math.max(longestStreak, tempStreak)
      tempStreak = 1
    }
  }
  longestStreak = Math.max(longestStreak, tempStreak)

  // Current streak: count backwards from the most recent week
  const now = new Date()
  const currentWeekKey = getISOWeekKey(now)
  const lastWeekKey = getISOWeekKey(new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000))

  const lastEntryWeek = sortedWeeks[sortedWeeks.length - 1]

  if (lastEntryWeek === currentWeekKey || lastEntryWeek === lastWeekKey) {
    // Streak is active (checked in this week or last week)
    currentStreak = 1
    for (let i = sortedWeeks.length - 2; i >= 0; i--) {
      if (areConsecutiveWeeks(sortedWeeks[i], sortedWeeks[i + 1])) {
        currentStreak++
      } else {
        break
      }
    }
  }

  // Is check-in due this week?
  const isDueThisWeek = !weekSet.has(currentWeekKey)

  return {
    currentStreak,
    longestStreak,
    totalWeeks,
    lastCheckIn: lastDate,
    isDueThisWeek,
  }
}

function getISOWeekKey(date: Date): string {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  // Set to Thursday of current week (ISO 8601)
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7))
  const year = d.getFullYear()
  const jan4 = new Date(year, 0, 4)
  const weekNum = Math.ceil(
    ((d.getTime() - jan4.getTime()) / 86400000 + jan4.getDay() + 1) / 7
  )
  return `${year}-W${String(weekNum).padStart(2, '0')}`
}

function areConsecutiveWeeks(weekA: string, weekB: string): boolean {
  // Parse year and week from "YYYY-WXX"
  const [yearA, wA] = weekA.split('-W').map(Number)
  const [yearB, wB] = weekB.split('-W').map(Number)

  if (yearA === yearB) {
    return wB - wA === 1
  }
  // Cross-year boundary: last week of yearA to first week of yearB
  if (yearB === yearA + 1 && wB === 1) {
    // ISO weeks can be 52 or 53
    return wA >= 52
  }
  return false
}
