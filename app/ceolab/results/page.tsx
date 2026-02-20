'use client'

import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { createClient } from '@/lib/supabase-browser'
import { AppShell } from '@/components/layout/AppShell'
import { LockedSection } from '@/components/ui/LockedSection'
import type { FullResults } from '@/types/assessment'

// ---------------------------------------------------------------------------
// Dynamic tab imports with loading skeletons
// ---------------------------------------------------------------------------

function TabSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg p-8 border border-black/10">
          <div className="h-5 w-32 bg-black/5 rounded mb-4 animate-pulse" />
          <div className="h-4 w-64 bg-black/5 rounded mb-6 animate-pulse" />
          <div className="space-y-3">
            <div className="h-3 w-full bg-black/5 rounded animate-pulse" />
            <div className="h-3 w-4/5 bg-black/5 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  )
}

const OverviewTab = dynamic(() => import('./tabs/OverviewTab').then(m => ({ default: m.OverviewTab })), {
  loading: () => <TabSkeleton />,
  ssr: false,
})

const TerritoryTab = dynamic(() => import('./tabs/TerritoryTab').then(m => ({ default: m.TerritoryTab })), {
  loading: () => <TabSkeleton />,
  ssr: false,
})

const GrowthPlanTab = dynamic(() => import('./tabs/GrowthPlanTab').then(m => ({ default: m.GrowthPlanTab })), {
  loading: () => <TabSkeleton />,
  ssr: false,
})

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ResultsTab = 'overview' | 'leading-yourself' | 'leading-teams' | 'leading-organizations' | 'growth-plan'

// ---------------------------------------------------------------------------
// Complete Results View
// ---------------------------------------------------------------------------

// Territory colors for bento nav
const BENTO_TERRITORY_COLORS: Record<string, string> = {
  leading_yourself: '#7FABC8',
  leading_teams: '#A6BEA4',
  leading_organizations: '#E08F6A',
}

const BENTO_NAV_CONFIG: { key: ResultsTab; label: string; description: string; territory?: string }[] = [
  { key: 'overview', label: 'Overview', description: 'CLMI score, archetypes, and leadership snapshot' },
  { key: 'leading-yourself', label: 'Leading Yourself', description: 'Self-awareness, emotional mastery, and inner growth', territory: 'leading_yourself' },
  { key: 'leading-teams', label: 'Leading Teams', description: 'Trust, conversations, and team systems', territory: 'leading_teams' },
  { key: 'leading-organizations', label: 'Leading Orgs', description: 'Strategy, culture, and organizational design', territory: 'leading_organizations' },
  { key: 'growth-plan', label: 'Your Growth Plan', description: 'Frameworks and workshops for your priority areas' },
]

function CompleteResultsView({ results }: { results: FullResults }) {
  const [activeTab, setActiveTab] = useState<ResultsTab>('overview')

  const clmi = results.session.clmi ?? 0
  const hasMirrorData = results.mirrorGaps != null && results.mirrorGaps.length > 0
  const bsi = results.bsi
  const imFlagged = results.session.imFlagged

  const handleNavigateToTab = (tab: string) => {
    setActiveTab(tab as ResultsTab)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="print:bg-white">
      <header className="pt-12 pb-4 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <p className="font-mono text-xs uppercase tracking-[0.12em] text-black/40 mb-2">CEO Lab Assessment</p>
            <h1 className="text-3xl md:text-4xl font-bold text-black">Your Leadership Report</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pb-20 print:max-w-full">
        {/* Bento-style navigation grid */}
        <div className="mb-12">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {BENTO_NAV_CONFIG.map((nav) => {
              const isActive = activeTab === nav.key
              const territoryColor = nav.territory ? BENTO_TERRITORY_COLORS[nav.territory] : undefined

              return (
                <button
                  key={nav.key}
                  onClick={() => handleNavigateToTab(nav.key)}
                  className={`relative text-left rounded-lg p-5 transition-all ${
                    isActive
                      ? 'bg-white border-2 border-black'
                      : 'bg-white border border-black/10 hover:border-black/25'
                  }`}
                >
                  {/* Territory color accent bar */}
                  {territoryColor && (
                    <div
                      className="absolute top-0 left-0 right-0 h-1 rounded-t-lg"
                      style={{ backgroundColor: isActive ? territoryColor : `${territoryColor}60` }}
                    />
                  )}

                  {/* Icon for each tab */}
                  <div className="mb-3">
                    {nav.key === 'overview' && (
                      <svg className={`w-7 h-7 ${isActive ? 'text-black' : 'text-black/30'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                      </svg>
                    )}
                    {nav.key === 'leading-yourself' && (
                      <svg className={`w-7 h-7`} style={{ color: isActive ? territoryColor : `${territoryColor}80` }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                    )}
                    {nav.key === 'leading-teams' && (
                      <svg className={`w-7 h-7`} style={{ color: isActive ? territoryColor : `${territoryColor}80` }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                      </svg>
                    )}
                    {nav.key === 'leading-organizations' && (
                      <svg className={`w-7 h-7`} style={{ color: isActive ? territoryColor : `${territoryColor}80` }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
                      </svg>
                    )}
                    {nav.key === 'growth-plan' && (
                      <svg className={`w-7 h-7 ${isActive ? 'text-black' : 'text-black/30'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
                      </svg>
                    )}
                  </div>

                  <p className={`text-sm font-semibold mb-1 ${isActive ? 'text-black' : 'text-black/70'}`}>
                    {nav.label}
                  </p>
                  <p className={`text-xs leading-relaxed ${isActive ? 'text-black/50' : 'text-black/30'}`}>
                    {nav.description}
                  </p>
                </button>
              )
            })}
          </div>
        </div>

        {activeTab === 'overview' && (
          <OverviewTab
            clmi={clmi}
            bsi={bsi}
            hasMirrorData={hasMirrorData}
            territoryScores={results.territoryScores}
            dimensionScores={results.dimensionScores}
            archetypes={results.archetypes}
            mirrorGaps={results.mirrorGaps}
            imFlagged={imFlagged}
            onNavigateToTab={handleNavigateToTab}
          />
        )}
        {activeTab === 'leading-yourself' && (
          <TerritoryTab
            territory="leading_yourself"
            territoryScores={results.territoryScores}
            dimensionScores={results.dimensionScores}
            mirrorGaps={results.mirrorGaps}
            hasMirrorData={hasMirrorData}
            imFlagged={imFlagged}
          />
        )}
        {activeTab === 'leading-teams' && (
          <TerritoryTab
            territory="leading_teams"
            territoryScores={results.territoryScores}
            dimensionScores={results.dimensionScores}
            mirrorGaps={results.mirrorGaps}
            hasMirrorData={hasMirrorData}
            imFlagged={imFlagged}
          />
        )}
        {activeTab === 'leading-organizations' && (
          <TerritoryTab
            territory="leading_organizations"
            territoryScores={results.territoryScores}
            dimensionScores={results.dimensionScores}
            mirrorGaps={results.mirrorGaps}
            hasMirrorData={hasMirrorData}
            imFlagged={imFlagged}
          />
        )}
        {activeTab === 'growth-plan' && (
          <GrowthPlanTab dimensionScores={results.dimensionScores} priorityDimensions={results.priorityDimensions} />
        )}
      </main>

      <style jsx global>{`
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          header, main { max-width: 100% !important; }
          section { break-inside: avoid; page-break-inside: avoid; }
        }
      `}</style>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Loading State
// ---------------------------------------------------------------------------

function LoadingSkeleton() {
  return (
    <AppShell>
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="space-y-6">
          <div className="text-center mb-12">
            <div className="h-8 w-48 bg-black/5 rounded mx-auto mb-3 animate-pulse" />
            <div className="h-4 w-72 bg-black/5 rounded mx-auto animate-pulse" />
          </div>
          {/* Bento nav skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-12">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-white border border-black/10 rounded-lg p-5 animate-pulse">
                <div className="h-4 w-12 bg-black/5 rounded mb-3" />
                <div className="h-4 w-20 bg-black/5 rounded mb-2" />
                <div className="h-3 w-full bg-black/5 rounded" />
              </div>
            ))}
          </div>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-8 border border-black/10">
              <div className="h-4 w-8 bg-black/5 rounded mb-3 animate-pulse" />
              <div className="h-6 w-40 bg-black/5 rounded mb-6 animate-pulse" />
              <div className="space-y-3">
                <div className="h-3 w-full bg-black/5 rounded animate-pulse" />
                <div className="h-3 w-4/5 bg-black/5 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  )
}

// ---------------------------------------------------------------------------
// Error State
// ---------------------------------------------------------------------------

function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <AppShell>
      <div className="flex items-center justify-center px-6 min-h-[80vh]">
        <div className="bg-white rounded-lg p-10 max-w-md w-full text-center border border-black/10">
          <h2 className="text-xl font-bold text-black mb-3">
            Something went wrong
          </h2>
          <p className="text-sm text-black/60 mb-6 leading-relaxed">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-block bg-black text-white px-10 py-4 rounded-lg text-base font-semibold hover:bg-black/90 transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </AppShell>
  )
}

// ---------------------------------------------------------------------------
// Main Page Component — loads data from API
// ---------------------------------------------------------------------------

export default function ResultsPage() {
  const [pageState, setPageState] = useState<'loading' | 'error' | 'locked' | 'ready'>('loading')
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<FullResults | null>(null)

  const loadResults = React.useCallback(async () => {
    try {
      setPageState('loading')
      setError(null)

      const supabase = createClient()
      const { data: { user }, error: authError } = await supabase.auth.getUser()

      if (authError || !user) {
        window.location.href = '/auth'
        return
      }

      // Parallelize subscription check and assessment check
      const [profileRes, sessionRes] = await Promise.all([
        supabase
          .from('user_profiles')
          .select('subscription_status')
          .eq('id', user.id)
          .single(),
        supabase
          .from('assessment_sessions')
          .select('id')
          .eq('ceo_id', user.id)
          .eq('version', '4.0')
          .not('completed_at', 'is', null)
          .limit(1)
          .maybeSingle(),
      ])

      const subStatus = profileRes.data?.subscription_status || 'inactive'
      const isSubscribed = subStatus === 'active' || subStatus === 'trialing'

      if (!isSubscribed && !sessionRes.data) {
        setPageState('locked')
        return
      }

      const response = await fetch('/api/v4/results')

      if (!response.ok) {
        if (response.status === 401) {
          window.location.href = '/auth'
          return
        }
        if (response.status === 404) {
          setPageState('locked')
          return
        }
        throw new Error(`Failed to load results (${response.status})`)
      }

      const data = await response.json()
      setResults(data.results)
      setPageState('ready')
    } catch (err: any) {
      console.error('Results page load error:', err)
      setError(err.message || 'Failed to load results')
      setPageState('error')
    }
  }, [])

  useEffect(() => {
    loadResults()
  }, [loadResults])

  if (pageState === 'loading') return <LoadingSkeleton />
  if (pageState === 'error') return <ErrorState message={error || 'Something went wrong'} onRetry={loadResults} />
  if (pageState === 'locked') {
    return (
      <AppShell>
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mb-8">
            <p className="font-mono text-xs uppercase tracking-[0.12em] text-black/40 mb-2">CEO Lab Assessment</p>
            <h1 className="text-3xl md:text-4xl font-bold text-black">Your Leadership Report</h1>
          </div>
          <LockedSection title="Subscribe to see your full leadership report" />
        </div>
      </AppShell>
    )
  }
  if (pageState === 'ready' && results) {
    return (
      <AppShell>
        <CompleteResultsView results={results} />
      </AppShell>
    )
  }

  return null
}
