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

    const { quarter, year, dimensions } = await request.json()

    // Save quarterly focus with conflict resolution
    const { error } = await supabase
      .from('quarterly_focus')
      .upsert({
        user_id: user.id,
        quarter,
        year,
        sub_dimension_1: dimensions[0],  // FIXED: was dimension_1
        sub_dimension_2: dimensions[1],  // FIXED: was dimension_2
        sub_dimension_3: dimensions[2]   // FIXED: was dimension_3
      }, {
        onConflict: 'user_id,year,quarter'  // FIXED: Added conflict resolution
      })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Save focus error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
