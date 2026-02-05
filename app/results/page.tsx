'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import { calculateBaselineScores } from '@/lib/scoring'
import type { User } from '@supabase/supabase-js'
import './results.css'

interface UserProfile {
  hook_completed: boolean
  baseline_completed: boolean
  subscription_status: string
}

interface SubDimensionScore {
  sub_dimension: string
  territory: string
  percentage: number
}

interface TerritoryScore {
  territory: string
  score: number
}

export default function ResultsDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [subDimensionScores, setSubDimensionScores] = useState<SubDimensionScore[]>([])
  const [territoryScores, setTerritoryScores] = useState<TerritoryScore[]>([])
  const [overallScore, setOverallScore] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalData, setModalData] = useState<{ dimension: string; score: number } | null>(null)

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

        // Load sub-dimension scores if baseline completed
        if (profileData?.baseline_completed) {
          // First try to load from sub_dimension_scores table
          const { data: scores } = await supabase
            .from('sub_dimension_scores')
            .select('sub_dimension, territory, percentage')
            .eq('user_id', session.user.id)

          if (scores && scores.length > 0) {
            // Use pre-calculated scores
            setSubDimensionScores(scores)
            calculateTerritoryScores(scores)
          } else {
            // Fallback: Calculate from baseline_responses (NEVER DELETE USER DATA)
            const { data: responsesData } = await supabase
              .from('baseline_responses')
              .select('question_number, answer_value')
              .eq('user_id', session.user.id)

            if (responsesData && responsesData.length > 0) {
              // Convert to format expected by calculateBaselineScores
              const responses: Record<number, number> = {}
              responsesData.forEach(r => {
                responses[r.question_number] = r.answer_value
              })

              // Calculate scores using the same logic as before
              const calculatedScores = calculateBaselineScores(responses)

              // Convert to our display format
              const displayScores: SubDimensionScore[] = calculatedScores.allSubdimensions.map(dim => ({
                sub_dimension: dim.subdimension,
                territory: dim.territory === 'yourself' ? 'Leading Yourself' :
                          dim.territory === 'teams' ? 'Leading Teams' :
                          'Leading Organizations',
                percentage: dim.percentage
              }))

              setSubDimensionScores(displayScores)
              calculateTerritoryScores(displayScores)
            }
          }
        }
      } else {
        router.push('/auth')
      }

      setLoading(false)
    }

    loadData()
  }, [router])

  const calculateTerritoryScores = (scores: SubDimensionScore[]) => {
    const territories = ['Leading Yourself', 'Leading Teams', 'Leading Organizations']
    const territoryScoreData = territories.map(territory => {
      const territoryDimensions = scores.filter(s => s.territory === territory)
      const avg = territoryDimensions.length > 0
        ? territoryDimensions.reduce((sum, s) => sum + s.percentage, 0) / territoryDimensions.length
        : 0
      return { territory, score: Math.round(avg) }
    })
    setTerritoryScores(territoryScoreData)

    // Calculate overall score
    const overall = scores.length > 0
      ? Math.round(scores.reduce((sum, s) => sum + s.percentage, 0) / scores.length)
      : 0
    setOverallScore(overall)
  }

  const isPremium = profile?.subscription_status === 'active'
  const hasBaseline = profile?.baseline_completed

  const openModal = (dimension: string, score: number) => {
    setModalData({ dimension, score })
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setModalData(null)
  }

  const getScoreRange = (score: number): string => {
    if (score < 40) return 'low'
    if (score < 60) return 'medium'
    if (score < 80) return 'good'
    return 'excellent'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F3ED] flex items-center justify-center">
        <div className="text-black/60">Loading your leadership dashboard...</div>
      </div>
    )
  }

  // Show paywall if not premium
  if (!isPremium) {
    return (
      <div className="min-h-screen bg-[#F7F3ED]">
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
          <div className="bg-white rounded-lg p-12 text-center max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-black/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-black/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-black mb-4">Premium Feature</h2>
            <p className="text-lg text-black/60 mb-8">
              Unlock your comprehensive leadership dashboard with 18 sub-dimensions, AI-powered insights, what-if scenario planning, and personalized action plans.
            </p>
            <a
              href="/dashboard?tab=payment"
              className="inline-block px-8 py-3 bg-black text-white rounded-lg font-semibold hover:bg-black/90 transition-colors"
            >
              Upgrade to Premium - €100/month
            </a>
          </div>
        </main>
      </div>
    )
  }

  // Show message if baseline not completed
  if (!hasBaseline || subDimensionScores.length === 0) {
    return (
      <div className="min-h-screen bg-[#F7F3ED]">
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
          <div className="bg-white rounded-lg p-12 text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-black mb-4">Complete Your Baseline First</h2>
            <p className="text-lg text-black/60 mb-8">
              Take the 100-question baseline assessment to unlock your comprehensive leadership dashboard.
            </p>
            <a
              href="/assessment/baseline"
              className="inline-block px-8 py-3 bg-black text-white rounded-lg font-semibold hover:bg-black/90 transition-colors"
            >
              Start Baseline Assessment
            </a>
          </div>
        </main>
      </div>
    )
  }

  // Main comprehensive dashboard
  return (
    <div className="min-h-screen bg-[#F7F3ED]">
      {/* Header */}
      <header className="border-b border-black/10 bg-white">
        <div className="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-black tracking-tight">Leadership Scoreboard</h1>
            <p className="text-black/60 mt-1">Your comprehensive leadership profile</p>
          </div>
          <a
            href="/dashboard"
            className="text-sm font-medium text-black/60 hover:text-black transition-colors"
          >
            Back to Dashboard
          </a>
        </div>
      </header>

      <div className="page">
        {/* 1. Hero / Leadership Scoreboard */}
        <header className="hero">
          <div className="hero__left">
            <p className="pill">Konstantin Method • 100Q Baseline</p>
            <h1>Leadership Scoreboard</h1>
            <p className="subtitle">A comprehensive system for reducing leadership blind spots across three domains. This dashboard transforms 100 standardized questions into your personalized leadership map.</p>
            <div className="hero__meta">
              <div>
                <div className="meta__label">Participant</div>
                <div className="meta__value">{user?.user_metadata?.full_name || user?.email}</div>
              </div>
              <div>
                <div className="meta__label">Completed</div>
                <div className="meta__value">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
              </div>
              <div>
                <div className="meta__label">Confidence</div>
                <div className="meta__value">High • 100/100</div>
              </div>
            </div>
          </div>
          <div className="hero__right">
            <div className="score-card">
              <div className="score-card__label">Overall Leadership Score</div>
              <div className="score-card__value">{overallScore}</div>
              <div className="score-card__sub">Calculated across {subDimensionScores.length} leadership dimensions</div>
            </div>
          </div>
        </header>

        {/* 2. The Konstantin Method Map */}
        <section className="section">
          <div className="section__header">
            <h2>The Konstantin Method Map</h2>
            <p>The 100 questions are anchored to 18 sub-dimensions across three domains. Each domain compounds the next.</p>
          </div>
          <div className="domain-grid">
            <div className="domain-card">
              <div className="domain-card__label">Leading Yourself</div>
              <h3>Clarity before Influence</h3>
              <p>Drivers, reactivity, energy, and self-awareness that shape every decision you make.</p>
              <ul className="domain-card__list">
                <li>5 Drivers</li>
                <li>Leading Above the Line</li>
                <li>Purpose & Direction</li>
                <li>4 Ways of Listening</li>
              </ul>
            </div>
            <div className="domain-card">
              <div className="domain-card__label">Leading Teams</div>
              <h3>Trust before Performance</h3>
              <p>Psychological safety, accountability, and communication rhythm define your team's ceiling.</p>
              <ul className="domain-card__list">
                <li>Trust Formula</li>
                <li>Drama Triangle</li>
                <li>5 Dysfunctions</li>
                <li>Nonviolent Communication</li>
              </ul>
            </div>
            <div className="domain-card">
              <div className="domain-card__label">Leading Organizations</div>
              <h3>System before Scale</h3>
              <p>Strategy, culture, and structure that must cohere as complexity increases.</p>
              <ul className="domain-card__list">
                <li>CEO Test</li>
                <li>Strategy Traps</li>
                <li>Culture Diagnostics</li>
                <li>Org Quadrants</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 3. Territory Scores */}
        <section className="section">
          <div className="section__header">
            <h2>Territory Scores</h2>
            <p>Scores across the three domains, normalized to 100.</p>
          </div>
          <div className="territory-grid">
            {territoryScores.map((territory, index) => (
              <div key={territory.territory} className="territory-card">
                <div className="territory-card__top">
                  <div>
                    <div className="territory-card__label">{territory.territory}</div>
                    <div className="territory-card__score">{territory.score}</div>
                  </div>
                  <div className={`badge ${index === 0 ? 'blue' : index === 1 ? 'green' : 'orange'}`}>
                    {index === 0 ? 'Self' : index === 1 ? 'Teams' : 'Org'}
                  </div>
                </div>
                <div className="bar">
                  <div className="bar__fill" style={{ width: `${territory.score}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Sub-Dimension Heatmap */}
        <section className="section section--alt">
          <div className="section__header">
            <h2>Sub-Dimension Heatmap</h2>
            <p>{subDimensionScores.length} sub-dimensions scored from 0–100. Click a tile for details.</p>
          </div>
          <div className="heatmap">
            {subDimensionScores.map((dim) => (
              <div
                key={dim.sub_dimension}
                className="heatmap-tile"
                data-score-range={getScoreRange(dim.percentage)}
                onClick={() => openModal(dim.sub_dimension, Math.round(dim.percentage))}
              >
                <div className="heatmap-tile__score">{Math.round(dim.percentage)}</div>
                <div className="heatmap-tile__label">{dim.sub_dimension}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Insights You Didn't Know */}
        <section className="section">
          <div className="section__header">
            <h2>Insights You Didn't Know</h2>
            <p>Personalized interpretations derived from score interplay.</p>
          </div>
          <div className="insight-grid">
            <div className="insight-card">
              <div className="insight-card__title">Your highest and lowest scores reveal your growth edge</div>
              <p>
                Your strongest dimension is {subDimensionScores.reduce((max, dim) => dim.percentage > max.percentage ? dim : max).sub_dimension} ({Math.round(subDimensionScores.reduce((max, dim) => dim.percentage > max.percentage ? dim : max).percentage)}), while your biggest opportunity is {subDimensionScores.reduce((min, dim) => dim.percentage < min.percentage ? dim : min).sub_dimension} ({Math.round(subDimensionScores.reduce((min, dim) => dim.percentage < min.percentage ? dim : min).percentage)}). Closing this gap unlocks your next level of leadership.
              </p>
            </div>
          </div>
        </section>

        {/* 6. Metrics Library */}
        <section className="section section--alt">
          <div className="section__header">
            <h2>Metrics Library</h2>
            <p>All {subDimensionScores.length} dimensions at a glance.</p>
          </div>
          <div className="metrics-grid">
            {subDimensionScores
              .sort((a, b) => b.percentage - a.percentage)
              .map((dim) => (
                <div key={dim.sub_dimension} className="metric">
                  <div className="metric__value">{Math.round(dim.percentage)}</div>
                  <div className="metric__label">{dim.sub_dimension}</div>
                </div>
              ))}
          </div>
        </section>

        {/* 7. Next Steps */}
        <section className="section">
          <div className="section__header">
            <h2>Next Steps</h2>
            <p>Focus on your lowest-scoring dimensions for maximum impact.</p>
          </div>
          <div className="action-grid">
            {subDimensionScores
              .sort((a, b) => a.percentage - b.percentage)
              .slice(0, 3)
              .map((dim) => (
                <div key={dim.sub_dimension} className="action-card">
                  <div className="action-card__title">Improve {dim.sub_dimension}</div>
                  <p>Current score: {Math.round(dim.percentage)}. This is one of your key growth opportunities.</p>
                  <div className="action-card__meta">Focus area for maximum impact</div>
                </div>
              ))}
          </div>
        </section>

        <footer className="footer">
          <div>Konstantin Method — Leadership is measurable.</div>
          <div className="footer__small">Generated from 100-question baseline assessment • CEO Lab</div>
        </footer>
      </div>

      {/* Modal */}
      {modalOpen && modalData && (
        <div className="modal active" onClick={closeModal}>
          <div className="modal__content" onClick={(e) => e.stopPropagation()}>
            <button className="modal__close" onClick={closeModal}>Close</button>
            <h3>{modalData.dimension} ({modalData.score})</h3>
            <p style={{ marginTop: '16px', color: 'var(--text-secondary)' }}>
              This dimension measures a critical aspect of your leadership. Your score of {modalData.score} provides insight into your current capability in this area.
            </p>
            <div style={{ background: 'rgba(127, 171, 200, 0.1)', padding: '16px', borderRadius: '12px', marginTop: '16px' }}>
              <strong style={{ display: 'block', marginBottom: '8px' }}>Your score vs typical range:</strong>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                You: <strong>{modalData.score}</strong> | Typical range: <strong>60-75</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
