'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import type { User } from '@supabase/supabase-js'
import WeeklyCheckIn from '@/components/WeeklyCheckIn'

interface UserProfile {
  hook_completed: boolean
  baseline_completed: boolean
  subscription_status: string
}

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [focusDimensions, setFocusDimensions] = useState<string[]>([])
  const [currentStreak, setCurrentStreak] = useState(0)
  const [activeTab, setActiveTab] = useState<'assessments' | 'results' | 'payment'>('assessments')

  useEffect(() => {
    // Check URL params for tab
    const params = new URLSearchParams(window.location.search)
    const tab = params.get('tab')
    if (tab === 'payment') {
      setActiveTab('payment')
    }
  }, [])

  useEffect(() => {
    const supabase = createClient()

    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user)

        // Load user profile
        const { data: profileData } = await supabase
          .from('user_profiles')
          .select('hook_completed, baseline_completed, subscription_status')
          .eq('id', session.user.id)
          .single()

        if (profileData) {
          setProfile(profileData)
        }

        // Load quarterly focus
        const { data: focus } = await supabase
          .from('quarterly_focus')
          .select('sub_dimension_1, sub_dimension_2, sub_dimension_3')  // FIXED: was dimension_1/2/3
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        if (focus) {
          setFocusDimensions([
            focus.sub_dimension_1,  // FIXED: was dimension_1
            focus.sub_dimension_2,  // FIXED: was dimension_2
            focus.sub_dimension_3   // FIXED: was dimension_3
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
      <div className="min-h-screen bg-[#F7F3ED] flex items-center justify-center">
        <div className="text-black/60">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#F7F3ED]">
      {/* Header */}
      <header className="border-b border-black/10 bg-white">
        <div className="max-w-6xl mx-auto px-8 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-black tracking-tight">CEO Lab</h1>
          <button
            onClick={handleLogout}
            className="text-sm font-medium text-black/60 hover:text-black transition-colors"
          >
            Log Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-8 py-12">
        {/* Welcome */}
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-3 text-black leading-tight tracking-tight">
            Welcome back{user.user_metadata.full_name ? `, ${user.user_metadata.full_name}` : ''}
          </h2>
          <p className="text-lg text-black/50">
            {user.email}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8 border-b border-black/10">
          <button
            onClick={() => setActiveTab('assessments')}
            className={`pb-4 px-4 font-semibold text-sm transition-colors ${
              activeTab === 'assessments'
                ? 'text-black border-b-2 border-black'
                : 'text-black/40 hover:text-black/60'
            }`}
          >
            Assessments
          </button>
          <a
            href="/results"
            className="pb-4 px-4 font-semibold text-sm transition-colors text-black/40 hover:text-black/60"
          >
            Results Dashboard
          </a>
          <button
            onClick={() => setActiveTab('payment')}
            className={`pb-4 px-4 font-semibold text-sm transition-colors ${
              activeTab === 'payment'
                ? 'text-black border-b-2 border-black'
                : 'text-black/40 hover:text-black/60'
            }`}
          >
            Payment
          </button>
        </div>

        {/* Assessments Tab */}
        {activeTab === 'assessments' && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Hook Assessment */}
            <div className="bg-white rounded-lg p-8 shadow-sm border border-black/5">
              <div className="mb-6">
                <div className="w-12 h-1 bg-[#7FABC8] rounded-full mb-4"></div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-2xl font-bold text-black">Free Assessment</h3>
                  {profile?.hook_completed && (
                    <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">
                      ✓ Completed
                    </span>
                  )}
                </div>
                <p className="text-base text-black/60 leading-relaxed">
                  12 questions to get your leadership snapshot across 3 core territories.
                </p>
              </div>
              {profile?.hook_completed ? (
                <a
                  href="/assessment/hook"
                  className="inline-block px-6 py-3 border-2 border-black/20 text-black rounded-lg font-semibold hover:border-black transition-colors"
                >
                  Redo Assessment
                </a>
              ) : (
                <a
                  href="/assessment/hook"
                  className="inline-block px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-black/90 transition-colors"
                >
                  Take Assessment
                </a>
              )}
            </div>

            {/* Baseline Assessment */}
            <div className="bg-white rounded-lg p-8 shadow-sm border border-black/5">
              <div className="mb-6">
                <div className="w-12 h-1 bg-[#A6BEA4] rounded-full mb-4"></div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-2xl font-bold text-black">Full Baseline</h3>
                  {profile?.baseline_completed && (
                    <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">
                      ✓ Completed
                    </span>
                  )}
                </div>
                <p className="text-base text-black/60 leading-relaxed">
                  100 questions across 18 dimensions. Your complete leadership profile.
                </p>
              </div>
              {profile?.baseline_completed ? (
                <a
                  href="/assessment/baseline"
                  className="inline-block px-6 py-3 border-2 border-black/20 text-black rounded-lg font-semibold hover:border-black transition-colors"
                >
                  Redo Assessment
                </a>
              ) : (
                <a
                  href="/assessment/baseline"
                  className="inline-block px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-black/90 transition-colors"
                >
                  Start Baseline
                </a>
              )}
            </div>

            {/* Weekly Check-ins */}
            <div className="bg-white rounded-lg p-8 shadow-sm border border-black/5">
              <div className="mb-6">
                <div className="w-12 h-1 bg-[#E08F6A] rounded-full mb-4"></div>
                <h3 className="text-2xl font-bold text-black mb-2">Weekly Check-ins</h3>
                <p className="text-base text-black/60 leading-relaxed">
                  Track your progress with 3 focus areas per quarter.
                </p>
              </div>
              <a
                href="/focus"
                className="inline-block px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-black/90 transition-colors"
              >
                Choose Focus
              </a>
            </div>
          </div>
        )}

        {/* Results Tab */}
        {activeTab === 'results' && (
          <div className="space-y-8">
            {/* Weekly Check-in Display */}
            {focusDimensions.length === 3 && (
              <div>
                {currentStreak > 0 && (
                  <div className="mb-6 flex justify-center">
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-lg font-semibold text-sm">
                      🔥 {currentStreak} week streak
                    </div>
                  </div>
                )}
                <WeeklyCheckIn
                  focusDimensions={focusDimensions}
                  onComplete={() => setCurrentStreak(prev => prev + 1)}
                />
              </div>
            )}

            {/* Assessment Results */}
            <div className="bg-white rounded-lg p-8 shadow-sm border border-black/5">
              <h3 className="text-2xl font-bold text-black mb-6">Your Assessment Results</h3>
              {!profile?.hook_completed && !profile?.baseline_completed ? (
                <p className="text-black/60">
                  Complete an assessment to see your results here.
                </p>
              ) : (
                <div className="space-y-4">
                  {profile?.hook_completed && (
                    <div className="p-6 bg-[#F7F3ED] rounded-lg flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-black mb-1">Free Assessment</h4>
                        <p className="text-sm text-black/60">12-question leadership snapshot</p>
                      </div>
                      <a
                        href="/assessment/results"
                        className="px-4 py-2 bg-black text-white rounded-lg text-sm font-semibold hover:bg-black/90 transition-colors"
                      >
                        View Results
                      </a>
                    </div>
                  )}
                  {profile?.baseline_completed && (
                    <div className="p-6 bg-[#F7F3ED] rounded-lg flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-black mb-1">Full Baseline</h4>
                        <p className="text-sm text-black/60">Complete 100-question profile</p>
                      </div>
                      <a
                        href="/assessment/baseline/results"
                        className="px-4 py-2 bg-black text-white rounded-lg text-sm font-semibold hover:bg-black/90 transition-colors"
                      >
                        View Results
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Payment Tab */}
        {activeTab === 'payment' && (
          <div className="max-w-2xl">
            <div className="bg-white rounded-lg p-8 shadow-sm border border-black/5">
              <div className="mb-6">
                <div className="inline-block px-3 py-1 bg-black/5 text-black/60 rounded text-xs font-semibold mb-4">
                  {profile?.subscription_status === 'active' ? 'PREMIUM ACCOUNT' : 'FREE ACCOUNT'}
                </div>
                <h3 className="text-2xl font-bold text-black mb-2">
                  {profile?.subscription_status === 'active' ? 'Premium Subscription' : 'Upgrade to Premium'}
                </h3>
                <p className="text-base text-black/60 leading-relaxed">
                  {profile?.subscription_status === 'active'
                    ? 'You have full access to all features.'
                    : 'Full access to all assessments, weekly tracking, and AI insights.'}
                </p>
              </div>
              {profile?.subscription_status !== 'active' && (
                <button
                  onClick={handleUpgrade}
                  className="inline-block px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-black/90 transition-colors"
                >
                  Subscribe €100/month
                </button>
              )}
              {profile?.subscription_status === 'active' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-[#F7F3ED] rounded-lg">
                    <div>
                      <p className="font-semibold text-black">Monthly Subscription</p>
                      <p className="text-sm text-black/60">€100.00 per month</p>
                    </div>
                    <span className="text-green-600 font-semibold">Active</span>
                  </div>
                  <p className="text-sm text-black/60">
                    Manage your subscription in <a href="https://billing.stripe.com" className="underline hover:text-black">Stripe Customer Portal</a>
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
