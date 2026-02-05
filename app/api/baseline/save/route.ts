import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { baselineQuestions } from '@/lib/baseline-questions'
import { calculateBaselineScores } from '@/lib/scoring'

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
    const stageNumber = Number(stage) || 0

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
          stage: stageNumber,
          completed_at: stageNumber === 3 ? new Date().toISOString() : null,
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
          stage: stageNumber,
          completed_at: stageNumber === 3 ? new Date().toISOString() : null,
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
          stage: stageNumber,
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

    // Calculate scores and populate sub_dimension_scores table
    const scores = calculateBaselineScores(responses)

    // Delete existing scores for this user
    await supabase
      .from('sub_dimension_scores')
      .delete()
      .eq('user_id', user.id)

    // Insert new scores
    const scoreRecords = scores.allSubdimensions.map(dim => ({
      user_id: user.id,
      sub_dimension: dim.subdimension,
      territory: dim.territory === 'yourself' ? 'Leading Yourself' :
                dim.territory === 'teams' ? 'Leading Teams' :
                'Leading Organizations',
      current_score: dim.score,
      max_possible_score: dim.maxScore,
      percentage: dim.percentage
    }))

    const { error: scoresError } = await supabase
      .from('sub_dimension_scores')
      .insert(scoreRecords)

    if (scoresError) {
      console.error('Scores error:', scoresError)
      // CRITICAL: Return error instead of silent failure
      return NextResponse.json(
        { error: 'Failed to save scores: ' + scoresError.message },
        { status: 500 }
      )
    }

    // If Stage 1 complete, update user profile baseline_stage
    if (stageNumber >= 1) {
      const profileUpdates =
        stageNumber === 3
          ? { baseline_completed: true, baseline_stage: 3 }
          : { baseline_stage: stageNumber }

      await supabase
        .from('user_profiles')
        .upsert({ id: user.id, ...profileUpdates }, { onConflict: 'id' })
    }

    return NextResponse.json({
      success: true,
      assessmentId: assessmentId,
      stage: stageNumber,
      responsesSaved: responseRecords.length,
    })
  } catch (error: any) {
    console.error('Baseline save error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
