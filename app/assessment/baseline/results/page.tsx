'use client'

import { Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function ResultsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const stage = searchParams.get('stage')
    // Preserve stage parameter during redirect
    router.replace(`/results${stage ? `?stage=${stage}` : ''}`)
  }, [router, searchParams])

  return (
    <div className="min-h-screen bg-[#F7F3ED] flex items-center justify-center">
      <div className="text-black/60">Loading your comprehensive dashboard...</div>
    </div>
  )
}

export default function BaselineResults() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F7F3ED] flex items-center justify-center">
        <div className="text-black/60">Loading...</div>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  )
}
