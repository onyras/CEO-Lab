'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-browser'

export default function DebugPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAllData()
  }, [])

  const loadAllData = async () => {
    const supabase = createClient()

    // Get user
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      setData({ error: 'Not logged in' })
      setLoading(false)
      return
    }

    // Get all data from all tables
    const [profile, assessments, responses, scores, hookAssessments] = await Promise.all([
      supabase.from('user_profiles').select('*').eq('id', user.id).single(),
      supabase.from('baseline_assessments').select('*').eq('user_id', user.id),
      supabase.from('baseline_responses').select('*').eq('user_id', user.id),
      supabase.from('sub_dimension_scores').select('*').eq('user_id', user.id),
      supabase.from('hook_assessments').select('*').eq('user_id', user.id)
    ])

    setData({
      user: {
        id: user.id,
        email: user.email,
      },
      profile: profile.data,
      profileError: profile.error?.message,
      assessments: assessments.data,
      assessmentsError: assessments.error?.message,
      responsesCount: responses.data?.length || 0,
      responses: responses.data,
      responsesError: responses.error?.message,
      scoresCount: scores.data?.length || 0,
      scores: scores.data,
      scoresError: scores.error?.message,
      hookAssessments: hookAssessments.data,
      hookAssessmentsError: hookAssessments.error?.message,
    })

    setLoading(false)
  }

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-3xl font-bold mb-6">Database Debug View</h1>

      <div className="space-y-6">
        <div className="border p-4 rounded">
          <h2 className="text-xl font-bold mb-2">User Info</h2>
          <pre className="text-xs overflow-auto bg-gray-100 p-2 rounded">
            {JSON.stringify(data?.user, null, 2)}
          </pre>
        </div>

        <div className="border p-4 rounded">
          <h2 className="text-xl font-bold mb-2">User Profile</h2>
          <pre className="text-xs overflow-auto bg-gray-100 p-2 rounded">
            {JSON.stringify(data?.profile, null, 2)}
          </pre>
          {data?.profileError && (
            <p className="text-red-600 mt-2">Error: {data.profileError}</p>
          )}
        </div>

        <div className="border p-4 rounded">
          <h2 className="text-xl font-bold mb-2">Baseline Assessments</h2>
          <pre className="text-xs overflow-auto bg-gray-100 p-2 rounded">
            {JSON.stringify(data?.assessments, null, 2)}
          </pre>
          {data?.assessmentsError && (
            <p className="text-red-600 mt-2">Error: {data.assessmentsError}</p>
          )}
        </div>

        <div className="border p-4 rounded">
          <h2 className="text-xl font-bold mb-2">
            Baseline Responses ({data?.responsesCount} total)
          </h2>
          <pre className="text-xs overflow-auto bg-gray-100 p-2 rounded max-h-96">
            {JSON.stringify(data?.responses, null, 2)}
          </pre>
          {data?.responsesError && (
            <p className="text-red-600 mt-2">Error: {data.responsesError}</p>
          )}
        </div>

        <div className="border p-4 rounded">
          <h2 className="text-xl font-bold mb-2">
            Sub-Dimension Scores ({data?.scoresCount} total)
          </h2>
          <pre className="text-xs overflow-auto bg-gray-100 p-2 rounded max-h-96">
            {JSON.stringify(data?.scores, null, 2)}
          </pre>
          {data?.scoresError && (
            <p className="text-red-600 mt-2">Error: {data.scoresError}</p>
          )}
        </div>

        <div className="border p-4 rounded">
          <h2 className="text-xl font-bold mb-2">Hook Assessments (Free Test)</h2>
          <pre className="text-xs overflow-auto bg-gray-100 p-2 rounded">
            {JSON.stringify(data?.hookAssessments, null, 2)}
          </pre>
          {data?.hookAssessmentsError && (
            <p className="text-red-600 mt-2">Error: {data.hookAssessmentsError}</p>
          )}
        </div>
      </div>

      <div className="mt-8 flex gap-4">
        <button
          onClick={loadAllData}
          className="px-4 py-2 bg-black text-white rounded"
        >
          Refresh Data
        </button>
        <a
          href="/dashboard"
          className="px-4 py-2 bg-gray-200 text-black rounded"
        >
          Back to Dashboard
        </a>
      </div>
    </div>
  )
}
