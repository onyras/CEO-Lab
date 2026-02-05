import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
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

    // Get most recent baseline assessment
    const { data: assessment } = await supabase
      .from('baseline_assessments')
      .select('id, stage')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (!assessment) {
      return NextResponse.json({
        responses: {},
        stage: 0
      })
    }

    // Get all responses for this assessment
    const { data: responses } = await supabase
      .from('baseline_responses')
      .select('question_number, answer_value')
      .eq('assessment_id', assessment.id)

    // Convert to { questionId: answerValue } format
    const responsesMap: Record<number, number> = {}
    responses?.forEach(r => {
      responsesMap[r.question_number] = r.answer_value
    })

    return NextResponse.json({
      responses: responsesMap,
      stage: assessment.stage
    })
  } catch (error: any) {
    console.error('Fetch responses error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
