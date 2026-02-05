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

    // STEP 3: Get or create assessment (smart logic for stages vs retakes)
    logs.push('Step 3: Determining assessment (stage continuation, redo, or new baseline)...')

    // Check for existing incomplete assessment
    const { data: incompleteAssessment, error: findError } = await supabase
      .from('baseline_assessments')
      .select('id, stage, completed_at')
      .eq('user_id', user.id)
      .is('completed_at', null) // Only incomplete assessments
      .order('created_at', { ascending: false })
      .limit(1)
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
    let isRedo = false

    // Logic: Resume incomplete OR decide redo vs new baseline
    if (incompleteAssessment && stageNumber > incompleteAssessment.stage) {
      // RESUME: Stage progression (1→2→3)
      assessmentId = incompleteAssessment.id
      logs.push(`RESUME: Reusing assessment ${assessmentId} (stage ${incompleteAssessment.stage} → ${stageNumber})`)

      // Update stage progress
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

      logs.push('Assessment updated - same baseline run continues')
    } else {
      // Check for recent completion (redo vs new baseline)
      const { data: recentComplete, error: recentError } = await supabase
        .from('baseline_assessments')
        .select('id, completed_at')
        .eq('user_id', user.id)
        .not('completed_at', 'is', null)
        .order('completed_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (recentError) {
        logs.push(`Recent check error: ${recentError.message}`)
        return NextResponse.json({
          success: false,
          error: `Database error checking recent completion: ${recentError.message}`,
          logs
        }, { status: 500 })
      }

      const daysSinceCompletion = recentComplete
        ? (Date.now() - new Date(recentComplete.completed_at).getTime()) / (1000 * 60 * 60 * 24)
        : 999

      logs.push(`Days since last completion: ${daysSinceCompletion.toFixed(1)}`)

      if (recentComplete && daysSinceCompletion < 90) {
        // REDO: Overwrite same baseline (within 90 days)
        assessmentId = recentComplete.id
        isRedo = true
        logs.push(`REDO: Reusing assessment ${assessmentId} (${daysSinceCompletion.toFixed(1)} days since completion)`)

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

        logs.push('Redo mode: Will overwrite previous responses')
      } else {
        // NEW BASELINE: Quarterly retake (90+ days or first time)
        logs.push(`NEW BASELINE: Creating new assessment (${recentComplete ? '90+ days passed' : 'first time'})`)

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
        logs.push(`Created new assessment: ${assessmentId}`)
      }
    }

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
        response_set_id: responseSetId,
        question_number: qNum,
        sub_dimension: question?.subdimension || 'Unknown',
        territory: question?.territory || 'Leading Yourself',
        answer_value: answer as number,
        stage: stageNumber,
        submitted_at: submittedAt,
      }
    })

    logs.push(`Prepared ${responseRecords.length} response records (response_set_id: ${responseSetId}, version: 1.0)`)

    // STEP 5: Save responses (upsert for redo support)
    logs.push(`Step 5: Saving responses (${isRedo ? 'UPSERT for redo' : 'INSERT for new baseline'})...`)

    const { error: saveResponsesError } = await supabase
      .from('baseline_responses')
      .upsert(responseRecords, {
        onConflict: 'user_id,assessment_id,question_number' // Overwrite if redo, insert if new
      })

    if (saveResponsesError) {
      logs.push(`Save responses error: ${saveResponsesError.message}`)
      return NextResponse.json({
        success: false,
        error: `Failed to save responses: ${saveResponsesError.message}`,
        logs
      }, { status: 500 })
    }

    logs.push(`Saved ${responseRecords.length} responses ${isRedo ? '(overwrote previous)' : '(new entries)'}`)

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

    // STEP 8: Save scores (delete old + insert new for this user)
    logs.push('Step 8: Saving scores...')

    const scoreRecords = scores.allSubdimensions.map(dim => ({
      user_id: user.id,
      assessment_id: assessmentId,
      sub_dimension: dim.subdimension,
      territory: dim.territory === 'yourself' ? 'Leading Yourself' :
                dim.territory === 'teams' ? 'Leading Teams' :
                'Leading Organizations',
      current_score: dim.score,
      max_possible_score: dim.maxScore,
      percentage: dim.percentage,
      model_version: '1.0',
      calculated_at: new Date().toISOString()
    }))

    // Upsert scores using the existing (user_id, sub_dimension) unique constraint
    const { error: saveScoresError } = await supabase
      .from('sub_dimension_scores')
      .upsert(scoreRecords, {
        onConflict: 'user_id,sub_dimension'
      })

    if (saveScoresError) {
      logs.push(`Save scores error: ${saveScoresError.message}`)
      return NextResponse.json({
        success: false,
        error: `Failed to save scores: ${saveScoresError.message}`,
        logs
      }, { status: 500 })
    }

    logs.push(`Saved ${scoreRecords.length} score records`)

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
