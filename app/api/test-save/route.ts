import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
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

  const results: any = {
    timestamp: new Date().toISOString(),
    tests: []
  }

  // Get user
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' })
  }

  results.user_id = user.id

  // TEST 1: Can we read user_profiles?
  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  results.tests.push({
    name: 'Read user_profiles',
    success: !profileError,
    error: profileError?.message,
    data: profile
  })

  // TEST 2: Can we update user_profiles?
  const { error: updateProfileError } = await supabase
    .from('user_profiles')
    .update({ baseline_stage: 1 })
    .eq('id', user.id)

  results.tests.push({
    name: 'Update user_profiles.baseline_stage',
    success: !updateProfileError,
    error: updateProfileError?.message
  })

  // TEST 3: Can we insert into baseline_assessments?
  const { data: newAssessment, error: insertAssessmentError } = await supabase
    .from('baseline_assessments')
    .insert({
      user_id: user.id,
      stage: 1
    })
    .select()
    .single()

  results.tests.push({
    name: 'Insert baseline_assessments',
    success: !insertAssessmentError,
    error: insertAssessmentError?.message,
    data: newAssessment
  })

  const testAssessmentId = newAssessment?.id

  // TEST 4: Can we insert into baseline_responses?
  if (testAssessmentId) {
    const { error: insertResponseError } = await supabase
      .from('baseline_responses')
      .insert({
        user_id: user.id,
        assessment_id: testAssessmentId,
        question_number: 999,
        sub_dimension: 'Test Dimension',
        territory: 'Leading Yourself',
        answer_value: 5,
        stage: 1
      })

    results.tests.push({
      name: 'Insert baseline_responses',
      success: !insertResponseError,
      error: insertResponseError?.message
    })

    // TEST 5: Can we delete from baseline_responses?
    const { error: deleteResponseError } = await supabase
      .from('baseline_responses')
      .delete()
      .eq('user_id', user.id)
      .eq('question_number', 999)

    results.tests.push({
      name: 'Delete baseline_responses (RLS CHECK)',
      success: !deleteResponseError,
      error: deleteResponseError?.message,
      critical: true
    })
  }

  // TEST 6: Can we insert into sub_dimension_scores?
  const { error: insertScoreError } = await supabase
    .from('sub_dimension_scores')
    .insert({
      user_id: user.id,
      sub_dimension: 'Test Dimension',
      territory: 'Leading Yourself',
      current_score: 10,
      max_possible_score: 25,
      percentage: 0.4
    })

  results.tests.push({
    name: 'Insert sub_dimension_scores',
    success: !insertScoreError,
    error: insertScoreError?.message
  })

  // TEST 7: Can we delete from sub_dimension_scores?
  const { error: deleteScoreError } = await supabase
    .from('sub_dimension_scores')
    .delete()
    .eq('user_id', user.id)
    .eq('sub_dimension', 'Test Dimension')

  results.tests.push({
    name: 'Delete sub_dimension_scores (RLS CHECK - CRITICAL)',
    success: !deleteScoreError,
    error: deleteScoreError?.message,
    critical: true
  })

  // TEST 8: Check actual data in tables
  const { data: assessments } = await supabase
    .from('baseline_assessments')
    .select('*')
    .eq('user_id', user.id)

  const { data: responses } = await supabase
    .from('baseline_responses')
    .select('*')
    .eq('user_id', user.id)

  const { data: scores } = await supabase
    .from('sub_dimension_scores')
    .select('*')
    .eq('user_id', user.id)

  results.actual_data = {
    assessments_count: assessments?.length || 0,
    assessments: assessments,
    responses_count: responses?.length || 0,
    responses_sample: responses?.slice(0, 5),
    scores_count: scores?.length || 0,
    scores: scores
  }

  // Clean up test data
  if (testAssessmentId) {
    await supabase
      .from('baseline_assessments')
      .delete()
      .eq('id', testAssessmentId)
  }

  return NextResponse.json(results, { status: 200 })
}
