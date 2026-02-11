'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import { getFrameworkBySlug } from '@/lib/framework-content'
import { getDimension, TERRITORY_CONFIG } from '@/lib/constants'
import { getVerbalLabel } from '@/lib/scoring'
import { AppShell } from '@/components/layout/AppShell'
import type { DimensionId, Territory } from '@/types/assessment'

const TERRITORY_COLORS: Record<Territory, string> = {
  leading_yourself: '#7FABC8',
  leading_teams: '#A6BEA4',
  leading_organizations: '#E08F6A',
}

export default function FrameworkDetailPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const framework = getFrameworkBySlug(slug)

  const [userScore, setUserScore] = useState<number | null>(null)

  useEffect(() => {
    async function loadScore() {
      if (!framework) return

      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Get latest completed session
      const { data: session } = await supabase
        .from('assessment_sessions')
        .select('id')
        .eq('ceo_id', user.id)
        .eq('version', '4.0')
        .not('completed_at', 'is', null)
        .order('completed_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (!session) return

      const { data: dimScore } = await supabase
        .from('dimension_scores')
        .select('percentage')
        .eq('session_id', session.id)
        .eq('dimension', framework.dimension)
        .maybeSingle()

      if (dimScore) {
        setUserScore(dimScore.percentage)
      }
    }

    loadScore()
  }, [framework])

  if (!framework) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-[80vh] px-6">
          <div className="bg-white rounded-2xl p-10 border border-black/5 max-w-md w-full text-center">
            <h2 className="text-xl font-bold text-black mb-3">Framework Not Found</h2>
            <p className="text-sm text-black/50 mb-6">This framework doesn&apos;t have detailed content yet.</p>
            <a
              href="/ceolab"
              className="inline-block bg-black text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-black/90 transition-colors"
            >
              Back to CEO Lab
            </a>
          </div>
        </div>
      </AppShell>
    )
  }

  const dimension = getDimension(framework.dimension)
  const territoryColor = TERRITORY_COLORS[dimension.territory]
  const territoryLabel = TERRITORY_CONFIG[dimension.territory].displayLabel

  return (
    <AppShell>
      <div className="px-6 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Back link */}
          <a
            href="/ceolab"
            className="inline-flex items-center gap-1 text-sm text-black/40 hover:text-black/70 transition-colors mb-8"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Dashboard
          </a>

          {/* Framework header */}
          <div className="bg-white rounded-2xl p-8 md:p-10 border border-black/5 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span
                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium text-white"
                style={{ backgroundColor: territoryColor }}
              >
                {territoryLabel}
              </span>
              <span className="text-xs text-black/40">{dimension.name}</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-black mb-2">
              {framework.name}
            </h1>
            <p className="text-base text-black/60 leading-relaxed">
              {framework.tagline}
            </p>

            {/* User score for this dimension */}
            {userScore !== null && (
              <div className="mt-6 flex items-center gap-4 p-4 bg-[#F7F3ED]/60 rounded-xl">
                <div>
                  <p className="text-xs text-black/40 mb-0.5">Your {dimension.name} score</p>
                  <p className="text-2xl font-bold text-black">{Math.round(userScore)}%</p>
                </div>
                <span
                  className="text-xs font-medium px-2.5 py-1 rounded-full"
                  style={{
                    backgroundColor: `${territoryColor}15`,
                    color: territoryColor,
                  }}
                >
                  {getVerbalLabel(userScore)}
                </span>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="bg-white rounded-2xl p-8 border border-black/5 mb-6">
            <h2 className="text-sm font-semibold text-black/40 uppercase tracking-wider mb-3">Overview</h2>
            <p className="text-sm text-black/70 leading-relaxed">
              {framework.summary}
            </p>
          </div>

          {/* When to use */}
          <div className="bg-white rounded-2xl p-8 border border-black/5 mb-6">
            <h2 className="text-sm font-semibold text-black/40 uppercase tracking-wider mb-3">When to Use This</h2>
            <p className="text-sm text-black/70 leading-relaxed">
              {framework.whenToUse}
            </p>
          </div>

          {/* External resource */}
          {framework.externalUrl && (
            <div className="bg-white rounded-2xl p-8 border border-black/5 mb-6">
              <h2 className="text-sm font-semibold text-black/40 uppercase tracking-wider mb-3">Resource</h2>
              <a
                href={framework.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-black hover:text-black/70 transition-colors"
              >
                View resource
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M6 3H3V13H13V10M9 3H13V7M13 3L7 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          )}

          {/* Coaching CTA */}
          {framework.coachingCta && (
            <div className="bg-white rounded-2xl p-8 border border-black/5 text-center">
              <h2 className="text-lg font-semibold text-black mb-2">Work Through This With Niko</h2>
              <p className="text-sm text-black/50 mb-6 max-w-sm mx-auto">
                Get personalized guidance on applying {framework.name} to your specific leadership context.
              </p>
              <a
                href="https://cal.com/nikolaskonstantin"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-black text-white px-8 py-3.5 rounded-lg text-sm font-semibold hover:bg-black/90 transition-colors"
              >
                Book a Session
              </a>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
