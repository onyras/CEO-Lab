'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import type { User } from '@supabase/supabase-js'

interface UserProfile {
  hook_completed: boolean
  baseline_completed: boolean
  subscription_status: string
}

export default function ResultsDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<UserProfile | null>(null)

  useEffect(() => {
    const loadData = async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()

      if (session?.user) {
        setUser(session.user)

        const { data: profileData } = await supabase
          .from('user_profiles')
          .select('hook_completed, baseline_completed, subscription_status')
          .eq('id', session.user.id)
          .single()

        if (profileData) {
          setProfile(profileData)
        }
      } else {
        router.push('/auth')
      }

      setLoading(false)
    }

    loadData()
  }, [router])

  const isPremium = profile?.subscription_status === 'active'
  const hasBaseline = profile?.baseline_completed

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F3ED] flex items-center justify-center">
        <div className="text-black/60">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F7F3ED]">
      {/* Header */}
      <header className="border-b border-black/10 bg-white">
        <div className="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-black tracking-tight">Your Leadership Dashboard</h1>
            <p className="text-black/60 mt-1">Complete view of your growth and progress</p>
          </div>
          <a
            href="/dashboard"
            className="text-sm font-medium text-black/60 hover:text-black transition-colors"
          >
            Back to Dashboard
          </a>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-12">
        {/* Free Assessment Results */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-black mb-6">Free Assessment</h2>
          <div className="bg-white rounded-lg shadow-sm border border-black/5 overflow-hidden">
            {profile?.hook_completed ? (
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-black mb-1">Leadership Snapshot</h3>
                    <p className="text-sm text-black/60">12-question assessment across 3 territories</p>
                  </div>
                  <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">
                    ✓ Completed
                  </span>
                </div>
                <a
                  href="/assessment/results"
                  className="inline-block px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-black/90 transition-colors"
                >
                  View Full Results →
                </a>
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-black/60 mb-4">Complete the free assessment to see your leadership snapshot</p>
                <a
                  href="/assessment/hook"
                  className="inline-block px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-black/90 transition-colors"
                >
                  Take Free Assessment
                </a>
              </div>
            )}
          </div>
        </section>

        {/* Premium Features Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-black">Premium Insights</h2>
            {!isPremium && (
              <a
                href="/dashboard?tab=payment"
                className="px-4 py-2 bg-black text-white rounded-lg text-sm font-semibold hover:bg-black/90 transition-colors"
              >
                Upgrade to Premium
              </a>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Full Baseline Results */}
            <div className="relative bg-white rounded-lg shadow-sm border border-black/5 overflow-hidden">
              {!isPremium && (
                <div className="absolute inset-0 bg-black/5 backdrop-blur-sm z-10 flex items-center justify-center">
                  <div className="bg-white rounded-lg p-6 shadow-lg text-center max-w-sm">
                    <div className="w-12 h-12 bg-black/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-6 h-6 text-black/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <h3 className="font-bold text-black mb-2">Premium Feature</h3>
                    <p className="text-sm text-black/60 mb-4">Upgrade to unlock full baseline results</p>
                    <a
                      href="/dashboard?tab=payment"
                      className="inline-block px-4 py-2 bg-black text-white rounded-lg text-sm font-semibold hover:bg-black/90 transition-colors"
                    >
                      Upgrade Now
                    </a>
                  </div>
                </div>
              )}
              {!hasBaseline && isPremium && (
                <div className="absolute inset-0 bg-black/5 backdrop-blur-sm z-10 flex items-center justify-center">
                  <div className="bg-white rounded-lg p-6 shadow-lg text-center max-w-sm">
                    <h3 className="font-bold text-black mb-2">Complete Baseline First</h3>
                    <p className="text-sm text-black/60 mb-4">Take the 100-question baseline to unlock this dashboard</p>
                    <a
                      href="/assessment/baseline"
                      className="inline-block px-4 py-2 bg-black text-white rounded-lg text-sm font-semibold hover:bg-black/90 transition-colors"
                    >
                      Start Baseline
                    </a>
                  </div>
                </div>
              )}
              <div className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-1 bg-[#A6BEA4] rounded-full"></div>
                  <h3 className="text-xl font-bold text-black">Full Baseline Profile</h3>
                </div>
                <p className="text-black/60 mb-6">Complete analysis of 18 leadership dimensions with color-coded heatmap</p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm text-black/70">
                    <span className="text-green-600">✓</span> Overall leadership score
                  </div>
                  <div className="flex items-center gap-2 text-sm text-black/70">
                    <span className="text-green-600">✓</span> Top 3 strengths identified
                  </div>
                  <div className="flex items-center gap-2 text-sm text-black/70">
                    <span className="text-green-600">✓</span> Top 3 growth opportunities
                  </div>
                  <div className="flex items-center gap-2 text-sm text-black/70">
                    <span className="text-green-600">✓</span> 18 subdimension breakdown
                  </div>
                </div>
                {isPremium && hasBaseline && (
                  <a
                    href="/assessment/baseline/results"
                    className="inline-block px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-black/90 transition-colors"
                  >
                    View Full Profile →
                  </a>
                )}
              </div>
            </div>

            {/* Weekly Progress Tracking */}
            <div className="relative bg-white rounded-lg shadow-sm border border-black/5 overflow-hidden">
              {!isPremium && (
                <div className="absolute inset-0 bg-black/5 backdrop-blur-sm z-10 flex items-center justify-center">
                  <div className="bg-white rounded-lg p-6 shadow-lg text-center max-w-sm">
                    <div className="w-12 h-12 bg-black/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-6 h-6 text-black/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <h3 className="font-bold text-black mb-2">Premium Feature</h3>
                    <p className="text-sm text-black/60 mb-4">Upgrade to unlock weekly progress tracking</p>
                    <a
                      href="/dashboard?tab=payment"
                      className="inline-block px-4 py-2 bg-black text-white rounded-lg text-sm font-semibold hover:bg-black/90 transition-colors"
                    >
                      Upgrade Now
                    </a>
                  </div>
                </div>
              )}
              <div className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-1 bg-[#E08F6A] rounded-full"></div>
                  <h3 className="text-xl font-bold text-black">Weekly Progress</h3>
                </div>
                <p className="text-black/60 mb-6">Track improvement in your 3 quarterly focus areas with trend charts</p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm text-black/70">
                    <span className="text-green-600">✓</span> 12-week progress charts
                  </div>
                  <div className="flex items-center gap-2 text-sm text-black/70">
                    <span className="text-green-600">✓</span> Current streak tracking
                  </div>
                  <div className="flex items-center gap-2 text-sm text-black/70">
                    <span className="text-green-600">✓</span> Weekly check-in history
                  </div>
                  <div className="flex items-center gap-2 text-sm text-black/70">
                    <span className="text-green-600">✓</span> Behavioral insights
                  </div>
                </div>
              </div>
            </div>

            {/* Quarterly Insights */}
            <div className="relative bg-white rounded-lg shadow-sm border border-black/5 overflow-hidden">
              {!isPremium && (
                <div className="absolute inset-0 bg-black/5 backdrop-blur-sm z-10 flex items-center justify-center">
                  <div className="bg-white rounded-lg p-6 shadow-lg text-center max-w-sm">
                    <div className="w-12 h-12 bg-black/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-6 h-6 text-black/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <h3 className="font-bold text-black mb-2">Premium Feature</h3>
                    <p className="text-sm text-black/60 mb-4">Upgrade to unlock quarterly insights</p>
                    <a
                      href="/dashboard?tab=payment"
                      className="inline-block px-4 py-2 bg-black text-white rounded-lg text-sm font-semibold hover:bg-black/90 transition-colors"
                    >
                      Upgrade Now
                    </a>
                  </div>
                </div>
              )}
              <div className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-1 bg-[#7FABC8] rounded-full"></div>
                  <h3 className="text-xl font-bold text-black">Quarterly Review</h3>
                </div>
                <p className="text-black/60 mb-6">Deep-dive analysis of your focus areas with AI-generated insights</p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm text-black/70">
                    <span className="text-green-600">✓</span> 12-week summary report
                  </div>
                  <div className="flex items-center gap-2 text-sm text-black/70">
                    <span className="text-green-600">✓</span> Pattern recognition
                  </div>
                  <div className="flex items-center gap-2 text-sm text-black/70">
                    <span className="text-green-600">✓</span> Improvement metrics
                  </div>
                  <div className="flex items-center gap-2 text-sm text-black/70">
                    <span className="text-green-600">✓</span> Next quarter recommendations
                  </div>
                </div>
              </div>
            </div>

            {/* Framework Recommendations */}
            <div className="relative bg-white rounded-lg shadow-sm border border-black/5 overflow-hidden">
              {!isPremium && (
                <div className="absolute inset-0 bg-black/5 backdrop-blur-sm z-10 flex items-center justify-center">
                  <div className="bg-white rounded-lg p-6 shadow-lg text-center max-w-sm">
                    <div className="w-12 h-12 bg-black/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-6 h-6 text-black/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <h3 className="font-bold text-black mb-2">Premium Feature</h3>
                    <p className="text-sm text-black/60 mb-4">Upgrade to unlock framework library</p>
                    <a
                      href="/dashboard?tab=payment"
                      className="inline-block px-4 py-2 bg-black text-white rounded-lg text-sm font-semibold hover:bg-black/90 transition-colors"
                    >
                      Upgrade Now
                    </a>
                  </div>
                </div>
              )}
              <div className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-1 bg-[#D4A574] rounded-full"></div>
                  <h3 className="text-xl font-bold text-black">Prescribed Frameworks</h3>
                </div>
                <p className="text-black/60 mb-6">73 Konstantin Method playbooks automatically recommended based on your gaps</p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm text-black/70">
                    <span className="text-green-600">✓</span> Personalized recommendations
                  </div>
                  <div className="flex items-center gap-2 text-sm text-black/70">
                    <span className="text-green-600">✓</span> PDF playbooks
                  </div>
                  <div className="flex items-center gap-2 text-sm text-black/70">
                    <span className="text-green-600">✓</span> 3-minute explainer videos
                  </div>
                  <div className="flex items-center gap-2 text-sm text-black/70">
                    <span className="text-green-600">✓</span> Implementation guides
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA if not premium */}
        {!isPremium && (
          <div className="mt-12 bg-black text-white rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold mb-3">Ready to Unlock Your Full Leadership Profile?</h3>
            <p className="text-white/80 mb-6 max-w-2xl mx-auto">
              Get access to your complete baseline results, weekly progress tracking, AI-generated insights, and 73 Konstantin Method frameworks.
            </p>
            <a
              href="/dashboard?tab=payment"
              className="inline-block px-8 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Upgrade to Premium - €100/month
            </a>
          </div>
        )}
      </main>
    </div>
  )
}
