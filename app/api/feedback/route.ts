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

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { pageUrl, feedbackText } = body

    if (!feedbackText || typeof feedbackText !== 'string' || feedbackText.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Feedback text is required' },
        { status: 400 }
      )
    }

    const { error: insertError } = await supabase
      .from('user_feedback')
      .insert({
        ceo_id: user.id,
        page_url: pageUrl || '',
        feedback_text: feedbackText.trim(),
      })

    if (insertError) {
      return NextResponse.json(
        { success: false, error: `Failed to save feedback: ${insertError.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Unknown server error' },
      { status: 500 }
    )
  }
}
