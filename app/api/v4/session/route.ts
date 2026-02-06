import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { STAGE_ITEMS } from '@/lib/constants'

export async function POST() {
  const startTime = Date.now()
  const logs: string[] = []

  try {
    logs.push('=== V4 SESSION START ===')

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

    // STEP 2: Check for existing incomplete session
    logs.push('Step 2: Checking for incomplete V4 session...')

    const { data: incompleteSession, error: findError } = await supabase
      .from('assessment_sessions')
      .select('id, form, stage_reached, started_at')
      .eq('ceo_id', user.id)
      .eq('version', '4.0')
      .is('completed_at', null)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (findError) {
      logs.push(`Find error: ${findError.message}`)
      return NextResponse.json({
        success: false,
        error: `Database error finding session: ${findError.message}`,
        logs
      }, { status: 500 })
    }

    // STEP 3: Resume or create session
    if (incompleteSession) {
      // RESUME existing incomplete session
      logs.push(`RESUME: Found incomplete session ${incompleteSession.id} (form=${incompleteSession.form}, stage=${incompleteSession.stage_reached})`)

      // Load already-answered item IDs for this session
      const { data: answeredRows, error: answeredError } = await supabase
        .from('item_responses')
        .select('item_id')
        .eq('session_id', incompleteSession.id)

      if (answeredError) {
        logs.push(`Error loading answered items: ${answeredError.message}`)
        return NextResponse.json({
          success: false,
          error: `Failed to load answered items: ${answeredError.message}`,
          logs
        }, { status: 500 })
      }

      const answeredItems = (answeredRows || []).map((r: { item_id: string }) => r.item_id)
      const stageItems = STAGE_ITEMS[incompleteSession.stage_reached] || []

      logs.push(`Answered items: ${answeredItems.length}, Stage ${incompleteSession.stage_reached} items: ${stageItems.length}`)

      const duration = Date.now() - startTime
      logs.push(`=== SESSION RESUMED in ${duration}ms ===`)

      return NextResponse.json({
        success: true,
        session: {
          id: incompleteSession.id,
          form: incompleteSession.form,
          stageReached: incompleteSession.stage_reached,
          isResume: true,
        },
        stageItems,
        answeredItems,
        logs
      })
    }

    // CREATE new session
    logs.push('Step 3: No incomplete session found. Creating new session...')

    // Determine form (A/B alternation based on completed session count)
    const { count: completedCount, error: countError } = await supabase
      .from('assessment_sessions')
      .select('id', { count: 'exact', head: true })
      .eq('ceo_id', user.id)
      .eq('version', '4.0')
      .not('completed_at', 'is', null)

    if (countError) {
      logs.push(`Count error: ${countError.message}`)
      return NextResponse.json({
        success: false,
        error: `Database error counting sessions: ${countError.message}`,
        logs
      }, { status: 500 })
    }

    const previousCompleted = completedCount || 0
    const form = previousCompleted % 2 === 0 ? 'A' : 'B'

    logs.push(`Previous completed sessions: ${previousCompleted}, Form selected: ${form}`)

    // Insert new session
    const { data: newSession, error: createError } = await supabase
      .from('assessment_sessions')
      .insert({
        ceo_id: user.id,
        version: '4.0',
        form,
        stage_reached: 1,
      })
      .select('id, form, stage_reached')
      .single()

    if (createError || !newSession) {
      logs.push(`Create error: ${createError?.message || 'No data returned'}`)
      return NextResponse.json({
        success: false,
        error: `Failed to create session: ${createError?.message || 'Unknown error'}`,
        logs
      }, { status: 500 })
    }

    logs.push(`Created new session: ${newSession.id}`)

    const stageItems = STAGE_ITEMS[1] || []

    const duration = Date.now() - startTime
    logs.push(`=== SESSION CREATED in ${duration}ms ===`)

    return NextResponse.json({
      success: true,
      session: {
        id: newSession.id,
        form: newSession.form,
        stageReached: newSession.stage_reached,
        isResume: false,
      },
      stageItems,
      answeredItems: [],
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
