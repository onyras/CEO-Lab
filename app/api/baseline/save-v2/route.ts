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

    // STEP 3: ALWAYS create new assessment (never reuse for retakes)
    logs.push('Step 3: Creating new assessment...')

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

    const assessmentId = newAssessment.id
    logs.push(`Created new assessment: ${assessmentId} (retakes get new ID = preserve history)`)

    // STEP 4: Prepare response records with versioning
    logs.push('Step 4: Preparing response records with version snapshots...')

    // Generate unique response_set_id for this submission
    const responseSetId = crypto.randomUUID()
    const submittedAt = new Date().toISOString()

    const responseRecords = Object.entries(responses).map(([questionId, answer]) => {
      const qNum = parseInt(questionId)
      const question = baselineQuestions.find(q => q.id === qNum)

      if (!question) {
        logs.push(`Warning: Question ${qNum} not found in question bank`)
      }

      return {
        user_id: user.id,
        assessment_id: assessmentId,
        response_set_id: responseSetId, // FIX 2: Link all responses in this submission
        question_number: qNum,
        question_version: '1.0', // FIX 3: Version tracking
        question_text: question?.question || 'Unknown', // FIX 3: Snapshot question text
        sub_dimension: question?.subdimension || 'Unknown',
        territory: question?.territory || 'Leading Yourself',
        answer_value: answer as number,
        stage: stageNumber,
        submitted_at: submittedAt,
      }
    })

    logs.push(`Prepared ${responseRecords.length} response records (response_set_id: ${responseSetId}, version: 1.0)`)

    // STEP 5: Insert responses (append-only, new assessment each time)
    logs.push('Step 5: Inserting responses (append-only, never overwrites)...')

    const { error: insertResponsesError } = await supabase
      .from('baseline_responses')
      .insert(responseRecords) // INSERT ONLY - new assessment_id each time

    if (insertResponsesError) {
      logs.push(`Insert responses error: ${insertResponsesError.message}`)
      return NextResponse.json({
        success: false,
        error: `Failed to save responses: ${insertResponsesError.message}`,
        logs
      }, { status: 500 })
    }

    logs.push(`Inserted ${responseRecords.length} responses (history preserved forever)`)

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

    // STEP 8: Insert scores (append-only - NEVER DELETE OR OVERWRITE)
    logs.push('Step 8: Inserting scores (append-only, preserves history)...')

    const scoreRecords = scores.allSubdimensions.map(dim => ({
      user_id: user.id,
      assessment_id: assessmentId, // Link to specific assessment for history
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

    const { error: insertScoresError } = await supabase
      .from('sub_dimension_scores')
      .insert(scoreRecords) // INSERT ONLY - never update or delete

    if (insertScoresError) {
      logs.push(`Insert scores error: ${insertScoresError.message}`)
      return NextResponse.json({
        success: false,
        error: `Failed to save scores: ${insertScoresError.message}`,
        logs
      }, { status: 500 })
    }

    logs.push(`Inserted ${scoreRecords.length} new score records (history preserved)`)

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
