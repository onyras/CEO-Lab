'use client'

import { useState, useCallback, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'

export function FeedbackWidget() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [text, setText] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setIsAuthenticated(!!user)
    }
    checkAuth()
  }, [])

  const handleSubmit = useCallback(async () => {
    if (!text.trim()) return

    setStatus('sending')

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageUrl: pathname,
          feedbackText: text.trim(),
        }),
      })

      if (!res.ok) {
        throw new Error('Failed to submit')
      }

      setStatus('sent')
      setText('')
      setTimeout(() => {
        setIsOpen(false)
        setStatus('idle')
      }, 2000)
    } catch {
      setStatus('error')
    }
  }, [text, pathname])

  // Only show for authenticated users
  if (!isAuthenticated) return null

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {isOpen && (
        <div className="mb-3 w-80 bg-white rounded-xl border border-black/5 shadow-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-black">Share Feedback</p>
            <button
              onClick={() => { setIsOpen(false); setStatus('idle') }}
              className="text-black/30 hover:text-black/60 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {status === 'sent' ? (
            <p className="text-sm text-[#A6BEA4] font-medium py-4 text-center">
              Thank you for your feedback.
            </p>
          ) : (
            <>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="What's on your mind? Bug, suggestion, or anything else..."
                className="w-full h-24 px-3 py-2.5 text-sm text-black bg-[#F7F3ED]/50 border border-black/5 rounded-lg resize-none placeholder:text-black/30 focus:outline-none focus:border-black/20 transition-colors"
              />
              {status === 'error' && (
                <p className="text-xs text-[#E08F6A] mt-1">Something went wrong. Please try again.</p>
              )}
              <button
                onClick={handleSubmit}
                disabled={!text.trim() || status === 'sending'}
                className={`mt-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  text.trim() && status !== 'sending'
                    ? 'bg-black text-white hover:bg-black/90'
                    : 'bg-black/10 text-black/30 cursor-not-allowed'
                }`}
              >
                {status === 'sending' ? 'Sending...' : 'Submit'}
              </button>
            </>
          )}
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-white border border-black/10 rounded-lg text-xs font-medium text-black/50 hover:text-black/80 hover:border-black/20 transition-all shadow-sm"
      >
        Feedback
      </button>
    </div>
  )
}
