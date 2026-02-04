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

    const { stage, responses } = await request.json()

    // Create or update baseline assessment
    const { data: assessment, error: assessmentError } = await supabase
      .from('baseline_assessments')
      .upsert({
        user_id: user.id,
        stage_completed: stage,
        completed_at: stage === 3 ? new Date().toISOString() : null,
      })
      .select()
      .single()

    if (assessmentError) {
      return NextResponse.json(
        { error: assessmentError.message },
        { status: 500 }
      )
    }

    // Save individual responses
    const responseRecords = Object.entries(responses).map(
      ([questionId, answer]) => ({
        assessment_id: assessment.id,
        question_id: parseInt(questionId),
        answer_value: answer as number,
      })
    )

    const { error: responsesError } = await supabase
      .from('baseline_responses')
      .upsert(responseRecords)

    if (responsesError) {
      return NextResponse.json(
        { error: responsesError.message },
        { status: 500 }
      )
    }

    // If Stage 3 complete, mark user profile as baseline_completed
    if (stage === 3) {
      await supabase
        .from('user_profiles')
        .update({ baseline_completed: true })
        .eq('id', user.id)
    }

    // Calculate sub-dimension scores
    // TODO: Implement scoring logic based on question mapping

    return NextResponse.json({
      success: true,
      assessmentId: assessment.id,
      stage,
    })
  } catch (error: any) {
    console.error('Baseline save error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
