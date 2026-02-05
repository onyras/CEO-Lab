import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { baselineQuestions } from '@/lib/baseline-questions'
import { calculateBaselineScores } from '@/lib/scoring'

interface SaveRequest {
  stage: number | string
  responses: Record<string, number>
}

export async function POST(request: Request) {
  const startTime = Date.now()
  const logs: string[] = []

  try {
    logs.push('=== BASELINE SAVE V2 START ===')

    // Initialize Supabase
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

    // STEP 1: Authenticate user
    logs.push('Step 1: Authenticating user...')
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      logs.push(`Auth failed: ${authError?.message || 'No user'}`)
      return NextResponse.json({
        success: false,
        error: 'Authentication failed',
        logs
      }, { status: 401 })
    }

    logs.push(`User authenticated: ${user.id}`)

    // STEP 2: Parse and validate request
    logs.push('Step 2: Parsing request...')
    let body: SaveRequest

    try {
      body = await request.json()
    } catch (e) {
      logs.push('Failed to parse JSON')
      return NextResponse.json({
        success: false,
        error: 'Invalid JSON in request body',
        logs
      }, { status: 400 })
    }

    const stageNumber = Number(body.stage) || 0
    const responses = body.responses || {}
    const responseCount = Object.keys(responses).length

    logs.push(`Stage: ${stageNumber}, Responses: ${responseCount}`)

    // Validate inputs
    if (stageNumber < 1 || stageNumber > 3) {
      logs.push('Invalid stage number')
      return NextResponse.json({
        success: false,
        error: `Invalid stage: ${stageNumber}. Must be 1, 2, or 3.`,
        logs
      }, { status: 400 })
    }

    if (responseCount === 0) {
      logs.push('No responses provided')
      return NextResponse.json({
        success: false,
        error: 'No responses provided',
        logs
      }, { status: 400 })
    }

    // STEP 3: Get or create baseline assessment
    logs.push('Step 3: Finding existing assessment...')

    const { data: existingAssessment, error: findError } = await supabase
      .from('baseline_assessments')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle()

    if (findError) {
      logs.push(`Find error: ${findError.message}`)
      return NextResponse.json({
        success: false,
        error: `Database error finding assessment: ${findError.message}`,
        logs
      }, { status: 500 })
    }

    let assessmentId: string

    if (existingAssessment) {
      logs.push(`Found existing assessment: ${existingAssessment.id}`)
      assessmentId = existingAssessment.id

      // Update it
      logs.push('Step 3b: Updating assessment...')
      const { error: updateError } = await supabase
        .from('baseline_assessments')
        .update({
          stage: stageNumber,
          completed_at: stageNumber === 3 ? new Date().toISOString() : null,
        })
        .eq('id', assessmentId)

      if (updateError) {
        logs.push(`Update error: ${updateError.message}`)
        return NextResponse.json({
          success: false,
          error: `Failed to update assessment: ${updateError.message}`,
          logs
        }, { status: 500 })
      }

      logs.push('Assessment updated')
    } else {
      logs.push('No existing assessment, creating new...')

      const { data: newAssessment, error: createError } = await supabase
        .from('baseline_assessments')
        .insert({
          user_id: user.id,
          stage: stageNumber,
          completed_at: stageNumber === 3 ? new Date().toISOString() : null,
        })
        .select('id')
        .single()

      if (createError || !newAssessment) {
        logs.push(`Create error: ${createError?.message || 'No data returned'}`)
        return NextResponse.json({
          success: false,
          error: `Failed to create assessment: ${createError?.message || 'Unknown error'}`,
          logs
        }, { status: 500 })
      }

      assessmentId = newAssessment.id
      logs.push(`Created assessment: ${assessmentId}`)
    }

    // STEP 4: Prepare response records
    logs.push('Step 4: Preparing response records...')

    const responseRecords = Object.entries(responses).map(([questionId, answer]) => {
      const qNum = parseInt(questionId)
      const question = baselineQuestions.find(q => q.id === qNum)

      if (!question) {
        logs.push(`Warning: Question ${qNum} not found in question bank`)
      }

      return {
        user_id: user.id,
        assessment_id: assessmentId,
        question_number: qNum,
        sub_dimension: question?.subdimension || 'Unknown',
        territory: question?.territory || 'Leading Yourself',
        answer_value: answer as number,
        stage: stageNumber,
        submitted_at: new Date().toISOString(), // Phase 0: timestamp tracking
      }
    })

    logs.push(`Prepared ${responseRecords.length} response records`)

    // STEP 5: Upsert responses (no deletes - NEVER DELETE USER DATA)
    logs.push('Step 5: Upserting responses (atomic, no deletes)...')

    const { error: upsertResponsesError } = await supabase
      .from('baseline_responses')
      .upsert(responseRecords, {
        onConflict: 'user_id,assessment_id,question_number',
        ignoreDuplicates: false
      })

    if (upsertResponsesError) {
      logs.push(`Upsert responses error: ${upsertResponsesError.message}`)
      return NextResponse.json({
        success: false,
        error: `Failed to save responses: ${upsertResponsesError.message}`,
        logs
      }, { status: 500 })
    }

    logs.push(`Upserted ${responseRecords.length} responses (no data deleted)`)

    // STEP 7: Calculate scores
    logs.push('Step 7: Calculating scores...')

    let scores
    try {
      scores = calculateBaselineScores(responses)
      logs.push(`Calculated scores for ${scores.allSubdimensions.length} subdimensions`)
    } catch (scoreError) {
      logs.push(`Score calculation error: ${scoreError}`)
      return NextResponse.json({
        success: false,
        error: `Failed to calculate scores: ${scoreError}`,
        logs
      }, { status: 500 })
    }

    // STEP 8: Upsert scores (no deletes - NEVER DELETE USER DATA)
    logs.push('Step 8: Upserting scores (atomic, no deletes)...')

    const scoreRecords = scores.allSubdimensions.map(dim => ({
      user_id: user.id,
      sub_dimension: dim.subdimension,
      territory: dim.territory === 'yourself' ? 'Leading Yourself' :
                dim.territory === 'teams' ? 'Leading Teams' :
                'Leading Organizations',
      current_score: dim.score,
      max_possible_score: dim.maxScore,
      percentage: dim.percentage,
      model_version: '1.0', // Phase 0: version tracking for future interpretation updates
      calculated_at: new Date().toISOString() // Phase 0: timestamp tracking
    }))

    const { error: upsertScoresError } = await supabase
      .from('sub_dimension_scores')
      .upsert(scoreRecords, {
        onConflict: 'user_id,sub_dimension',
        ignoreDuplicates: false
      })

    if (upsertScoresError) {
      logs.push(`Upsert scores error: ${upsertScoresError.message}`)
      return NextResponse.json({
        success: false,
        error: `Failed to save scores: ${upsertScoresError.message}`,
        logs
      }, { status: 500 })
    }

    logs.push(`Upserted ${scoreRecords.length} score records (no data deleted)`)

    // STEP 9: Update user profile
    logs.push('Step 9: Updating user profile...')

    const profileUpdates = stageNumber === 3
      ? { baseline_completed: true, baseline_stage: 3 }
      : { baseline_stage: stageNumber }

    const { error: profileError } = await supabase
      .from('user_profiles')
      .upsert(
        { id: user.id, ...profileUpdates },
        { onConflict: 'id' }
      )

    if (profileError) {
      logs.push(`Profile update error: ${profileError.message}`)
      // Don't fail the whole request - responses and scores are saved
      logs.push('Warning: Profile not updated but data is saved')
    } else {
      logs.push(`Profile updated: baseline_stage = ${stageNumber}`)
    }

    // SUCCESS
    const duration = Date.now() - startTime
    logs.push(`=== SAVE COMPLETED in ${duration}ms ===`)

    return NextResponse.json({
      success: true,
      assessmentId,
      stage: stageNumber,
      responsesSaved: responseRecords.length,
      scoresSaved: scoreRecords.length,
      duration,
      logs
    })

  } catch (error: any) {
    logs.push(`FATAL ERROR: ${error.message}`)
    logs.push(`Stack: ${error.stack}`)

    return NextResponse.json({
      success: false,
      error: error.message || 'Unknown server error',
      logs
    }, { status: 500 })
  }
}
