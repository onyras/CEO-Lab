import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { baselineQuestions } from '@/lib/baseline-questions'

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

    // Create or update baseline assessment - use user_id for conflict resolution
    const { data: existingAssessment } = await supabase
      .from('baseline_assessments')
      .select('id')
      .eq('user_id', user.id)
      .single()

    let assessmentId: string

    if (existingAssessment) {
      // Update existing assessment
      const { data: updated, error: updateError } = await supabase
        .from('baseline_assessments')
        .update({
          stage: stage,
          stage_completed: stage,
          completed_at: stage === 3 ? new Date().toISOString() : null,
        })
        .eq('id', existingAssessment.id)
        .select()
        .single()

      if (updateError) {
        console.error('Update error:', updateError)
        return NextResponse.json(
          { error: updateError.message },
          { status: 500 }
        )
      }

      assessmentId = updated.id
    } else {
      // Create new assessment
      const { data: created, error: createError } = await supabase
        .from('baseline_assessments')
        .insert({
          user_id: user.id,
          stage: stage,
          stage_completed: stage,
          completed_at: stage === 3 ? new Date().toISOString() : null,
        })
        .select()
        .single()

      if (createError) {
        console.error('Create error:', createError)
        return NextResponse.json(
          { error: createError.message },
          { status: 500 }
        )
      }

      assessmentId = created.id
    }

    // Save individual responses with ALL required fields
    const responseRecords = Object.entries(responses).map(
      ([questionId, answer]) => {
        const qNum = parseInt(questionId)
        const question = baselineQuestions.find(q => q.id === qNum)

        return {
          user_id: user.id,
          assessment_id: assessmentId,
          question_number: qNum,  // FIXED: was question_id, should be question_number
          sub_dimension: question?.subdimension || 'Unknown',
          territory: question?.territory || 'Leading Yourself',
          answer_value: answer as number,
          stage: stage,
        }
      }
    )

    // Delete existing responses for these questions, then insert new ones
    const questionNumbers = responseRecords.map(r => r.question_number)

    const { error: deleteError } = await supabase
      .from('baseline_responses')
      .delete()
      .eq('user_id', user.id)
      .eq('assessment_id', assessmentId)
      .in('question_number', questionNumbers)

    if (deleteError) {
      console.error('Delete error:', deleteError)
      // Continue anyway - the insert might work
    }

    // Insert new responses
    const { error: responsesError } = await supabase
      .from('baseline_responses')
      .insert(responseRecords)

    if (responsesError) {
      console.error('Responses error:', responsesError)
      return NextResponse.json(
        { error: responsesError.message },
        { status: 500 }
      )
    }

    // If Stage 1 complete, update user profile baseline_stage
    if (stage === 1) {
      await supabase
        .from('user_profiles')
        .update({ baseline_stage: 1 })
        .eq('id', user.id)
    }

    // If Stage 3 complete, mark user profile as baseline_completed
    if (stage === 3) {
      await supabase
        .from('user_profiles')
        .update({
          baseline_completed: true,
          baseline_stage: 3
        })
        .eq('id', user.id)
    }

    return NextResponse.json({
      success: true,
      assessmentId: assessmentId,
      stage,
      responsesSaved: responseRecords.length,
    })
  } catch (error: any) {
    console.error('Baseline save error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
