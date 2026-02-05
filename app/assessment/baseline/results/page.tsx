'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function BaselineResults() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the new comprehensive dashboard
    router.replace('/results')
  }, [router])

  return (
    <div className="min-h-screen bg-[#F7F3ED] flex items-center justify-center">
      <div className="text-black/60">Loading your comprehensive dashboard...</div>
    </div>
  )
}
