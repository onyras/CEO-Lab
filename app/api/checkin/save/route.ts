import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    )

    // Get authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { responses } = await request.json()

    // Calculate week details
    const weekStart = getWeekStartDate()
    const date = new Date(weekStart)
    const year = date.getFullYear()
    const quarter = Math.floor(date.getMonth() / 3) + 1
    const weekNumber = getWeekNumberInQuarter(date, quarter)

    // Create weekly check-in record with ALL required fields
    const { data: checkin, error: checkinError } = await supabase
      .from('weekly_check_ins')
      .insert({
        user_id: user.id,
        week_start_date: weekStart,
        year,
        quarter,
        week_number: weekNumber,
        completed: true,
        completed_at: new Date().toISOString()
      })
      .select()
      .single()

    if (checkinError) {
      console.error('Check-in error:', checkinError)
      return NextResponse.json({ error: checkinError.message }, { status: 500 })
    }

    // Save individual responses with correct field names
    const responseRecords = Object.entries(responses).map(([subdimension, answer]) => ({
      check_in_id: checkin.id,  // FIXED: was checkin_id
      user_id: user.id,
      sub_dimension: subdimension,  // FIXED: was subdimension
      question_text: `How did you progress on ${subdimension} this week?`,
      answer_value: typeof answer === 'number' ? answer : null,
      answer_text: typeof answer === 'string' ? answer : null
    }))

    const { error: responsesError } = await supabase
      .from('weekly_responses')
      .insert(responseRecords)

    if (responsesError) {
      console.error('Responses error:', responsesError)
      return NextResponse.json({ error: responsesError.message }, { status: 500 })
    }

    // Update user streak
    await updateStreak(supabase, user.id)

    return NextResponse.json({ success: true, checkinId: checkin.id })
  } catch (error: any) {
    console.error('Save check-in error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

function getWeekStartDate(): string {
  const today = new Date()
  const dayOfWeek = today.getDay()
  const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1) // Adjust for Monday start
  const monday = new Date(today.setDate(diff))
  monday.setHours(0, 0, 0, 0)
  return monday.toISOString()
}

function getWeekNumberInQuarter(date: Date, quarter: number): number {
  const quarterStartMonth = (quarter - 1) * 3
  const quarterStart = new Date(date.getFullYear(), quarterStartMonth, 1)
  const weeksSinceQuarterStart = Math.floor((date.getTime() - quarterStart.getTime()) / (7 * 24 * 60 * 60 * 1000))
  return weeksSinceQuarterStart + 1
}

async function updateStreak(supabase: any, userId: string) {
  // Get all check-ins ordered by week
  const { data: checkins } = await supabase
    .from('weekly_check_ins')
    .select('week_start_date')
    .eq('user_id', userId)
    .order('week_start_date', { ascending: false })

  if (!checkins || checkins.length === 0) return

  // Calculate current streak
  let streak = 1
  const weekMs = 7 * 24 * 60 * 60 * 1000

  for (let i = 0; i < checkins.length - 1; i++) {
    const current = new Date(checkins[i].week_start_date).getTime()
    const previous = new Date(checkins[i + 1].week_start_date).getTime()
    const diff = current - previous

    // Check if weeks are consecutive
    if (Math.abs(diff - weekMs) < 24 * 60 * 60 * 1000) {
      streak++
    } else {
      break
    }
  }

  // Get existing streak to preserve longest_streak
  const { data: existingStreak } = await supabase
    .from('user_streaks')
    .select('longest_streak, total_weeks_completed')
    .eq('user_id', userId)
    .single()

  const longestStreak = Math.max(
    streak,
    existingStreak?.longest_streak || 0
  )

  // Update or create streak record - PRESERVE longest_streak
  await supabase
    .from('user_streaks')
    .upsert({
      user_id: userId,
      current_streak: streak,
      longest_streak: longestStreak,  // FIXED: Don't overwrite if current < longest
      total_weeks_completed: (existingStreak?.total_weeks_completed || 0) + 1,
      last_completion_date: getWeekStartDate(),
      updated_at: new Date().toISOString()
    })
}
