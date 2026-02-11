import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { isAdminEmail } from '@/lib/admin'

export async function GET(request: Request) {
  try {
    // Auth check
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) { return cookieStore.get(name)?.value },
          set(name: string, value: string, options: any) { cookieStore.set({ name, value, ...options }) },
          remove(name: string, options: any) { cookieStore.set({ name, value: '', ...options }) },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (!user?.email || !isAdminEmail(user.email)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Pagination
    const url = new URL(request.url)
    const limit = parseInt(url.searchParams.get('limit') || '50')
    const offset = parseInt(url.searchParams.get('offset') || '0')

    // Fetch feedback
    const { data: feedback, error, count } = await supabaseAdmin
      .from('user_feedback')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error

    // Fetch user info for feedback entries
    const ceoIds = [...new Set((feedback || []).map(f => f.ceo_id))]
    const { data: profiles } = await supabaseAdmin
      .from('user_profiles')
      .select('id, full_name')
      .in('id', ceoIds.length > 0 ? ceoIds : ['none'])

    const { data: { users: authUsers } } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 })

    const nameMap = new Map((profiles || []).map(p => [p.id, p.full_name]))
    const emailMap = new Map(authUsers.map(u => [u.id, u.email]))

    const feedbackWithUsers = (feedback || []).map(f => ({
      id: f.id,
      userId: f.ceo_id,
      userName: nameMap.get(f.ceo_id) || 'Unknown',
      userEmail: emailMap.get(f.ceo_id) || 'Unknown',
      pageUrl: f.page_url,
      text: f.feedback_text,
      createdAt: f.created_at,
    }))

    return NextResponse.json({ feedback: feedbackWithUsers, total: count })
  } catch (error: any) {
    console.error('Admin feedback error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
