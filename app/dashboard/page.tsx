'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import type { User } from '@supabase/supabase-js'
import WeeklyCheckIn from '@/components/WeeklyCheckIn'

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [focusDimensions, setFocusDimensions] = useState<string[]>([])
  const [currentStreak, setCurrentStreak] = useState(0)

  useEffect(() => {
    const supabase = createClient()

    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user)

        // Load quarterly focus
        const { data: focus } = await supabase
          .from('quarterly_focus')
          .select('dimension_1, dimension_2, dimension_3')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        if (focus) {
          setFocusDimensions([
            focus.dimension_1,
            focus.dimension_2,
            focus.dimension_3
          ].filter(Boolean))
        }

        // Load streak
        const { data: streak } = await supabase
          .from('user_streaks')
          .select('current_streak')
          .eq('user_id', session.user.id)
          .single()

        if (streak) {
          setCurrentStreak(streak.current_streak)
        }
      } else {
        router.push('/auth')
      }
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user)
      } else {
        router.push('/auth')
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  const handleUpgrade = async () => {
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
      })
      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Upgrade error:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">CEO Lab</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-gray-700 hover:text-gray-900"
          >
            Log Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Welcome */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold mb-4 text-gray-900">
            Welcome back, {user.user_metadata.full_name || 'there'}!
          </h2>
          <p className="text-xl text-gray-600">
            Your email: {user.email}
          </p>
        </div>

        {/* Weekly Check-in (Full Width) */}
        {focusDimensions.length === 3 && (
          <div className="mb-6">
            {currentStreak > 0 && (
              <div className="mb-4 text-center">
                <span className="inline-block px-4 py-2 bg-gray-900 text-white rounded-md">
                  🔥 {currentStreak} week streak
                </span>
              </div>
            )}
            <WeeklyCheckIn
              focusDimensions={focusDimensions}
              onComplete={() => setCurrentStreak(prev => prev + 1)}
            />
          </div>
        )}

        {/* Dashboard Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Hook Assessment */}
          <div className="border-2 border-gray-200 rounded-lg p-6">
            <h3 className="text-2xl font-bold mb-3 text-gray-900">Free Assessment</h3>
            <p className="text-gray-600 mb-4">
              Complete our 12-question hook assessment to get your leadership snapshot.
            </p>
            <a
              href="/assessment/hook"
              className="inline-block px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800"
            >
              Take Free Assessment
            </a>
          </div>

          {/* Baseline Assessment */}
          <div className="border-2 border-gray-200 rounded-lg p-6">
            <h3 className="text-2xl font-bold mb-3 text-gray-900">Full Baseline</h3>
            <p className="text-gray-600 mb-4">
              100 questions across 18 leadership dimensions. Get your complete profile.
            </p>
            <a
              href="/assessment/baseline"
              className="inline-block px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800"
            >
              Start Baseline Assessment
            </a>
          </div>

          {/* Weekly Check-ins */}
          <div className="border-2 border-gray-200 rounded-lg p-6">
            <h3 className="text-2xl font-bold mb-3 text-gray-900">Weekly Check-ins</h3>
            <p className="text-gray-600 mb-4">
              Track your progress with 3 focus areas per quarter.
            </p>
            <a
              href="/focus"
              className="inline-block px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800"
            >
              Choose Focus Areas
            </a>
          </div>

          {/* Subscription */}
          <div className="border-2 border-gray-200 rounded-lg p-6">
            <h3 className="text-2xl font-bold mb-3 text-gray-900">Subscription</h3>
            <p className="text-gray-600 mb-4">
              Status: <span className="font-semibold">Free Account</span>
            </p>
            <button
              onClick={handleUpgrade}
              className="inline-block px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800"
            >
              Upgrade to Premium - €100/month
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
