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

    // Create weekly check-in record
    const { data: checkin, error: checkinError } = await supabase
      .from('weekly_check_ins')
      .insert({
        user_id: user.id,
        week_start_date: getWeekStartDate()
      })
      .select()
      .single()

    if (checkinError) {
      return NextResponse.json({ error: checkinError.message }, { status: 500 })
    }

    // Save individual responses
    const responseRecords = Object.entries(responses).map(([subdimension, answer]) => ({
      checkin_id: checkin.id,
      subdimension,
      response_value: String(answer)
    }))

    const { error: responsesError } = await supabase
      .from('weekly_responses')
      .insert(responseRecords)

    if (responsesError) {
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

  // Update or create streak record
  await supabase
    .from('user_streaks')
    .upsert({
      user_id: userId,
      current_streak: streak,
      longest_streak: streak
    })
}
