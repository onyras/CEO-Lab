'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
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

function CompleteResultsView({ results }: { results: FullResults }) {
  const [activeTab, setActiveTab] = useState<ResultsTab>('overview')

  const clmi = results.session.clmi ?? 0
  const hasMirrorData = results.mirrorGaps != null && results.mirrorGaps.length > 0
  const bsi = results.bsi
  const imFlagged = results.session.imFlagged

  const tabs: { key: ResultsTab; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'leading-yourself', label: 'Leading Yourself' },
    { key: 'leading-teams', label: 'Leading Teams' },
    { key: 'leading-organizations', label: 'Leading Orgs' },
    { key: 'growth-plan', label: 'Your Growth Plan' },
  ]

  const handleNavigateToTab = (tab: string) => {
    setActiveTab(tab as ResultsTab)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="print:bg-white">
      <header className="pt-12 pb-4 px-6">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/ceolab"
            className="inline-flex items-center gap-1.5 text-sm text-black/40 hover:text-black/60 transition-colors mb-6"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to CEO Lab
          </Link>
          <div className="text-center">
            <p className="font-mono text-xs uppercase tracking-[0.12em] text-black/40 mb-2">CEO Lab Assessment</p>
            <h1 className="text-3xl md:text-4xl font-bold text-black">Your Leadership Report</h1>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pb-20">
        {/* Tab bar — horizontally scrollable on mobile */}
        <div className="overflow-x-auto -mx-6 px-6 mb-10">
          <div className="flex gap-1 p-1.5 bg-black/[0.04] rounded-lg min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleNavigateToTab(tab.key)}
                className={`py-3 px-5 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                  activeTab === tab.key
                    ? 'bg-white text-black shadow-sm'
                    : 'text-black/40 hover:text-black/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
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
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="space-y-6">
          <div className="text-center mb-12">
            <div className="h-8 w-48 bg-black/5 rounded mx-auto mb-3 animate-pulse" />
            <div className="h-4 w-72 bg-black/5 rounded mx-auto animate-pulse" />
          </div>
          {/* Tab bar skeleton */}
          <div className="flex gap-1 p-1.5 bg-black/[0.04] rounded-lg mb-10">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-10 flex-1 bg-black/5 rounded-lg animate-pulse" />
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
        <div className="max-w-6xl mx-auto px-6 py-16">
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
