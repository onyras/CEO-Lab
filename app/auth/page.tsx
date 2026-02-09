'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import Link from 'next/link'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Read hookSessionId from localStorage (set by hook assessment)
  const getCallbackUrl = () => {
    const base = `${window.location.origin}/auth/callback`
    try {
      const stored = localStorage.getItem('ceolab_hook_results')
      if (stored) {
        const { hookSessionId } = JSON.parse(stored)
        if (hookSessionId) return `${base}?hookSessionId=${hookSessionId}`
      }
    } catch {}
    return base
  }

  const handleGoogleSignIn = async () => {
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: getCallbackUrl(),
        },
      })
      if (error) throw error
    } catch (error: any) {
      setError(error.message)
    }
  }

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: getCallbackUrl(),
        },
      })

      if (error) throw error

      setMessage('Check your email! We sent you a magic link to sign in.')
      setEmail('')
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <Link href="/">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">CEO Lab</h1>
          </Link>
          <p className="text-gray-600">Sign in to continue</p>
        </div>

        {/* Auth Card */}
        <div className="bg-white border-2 border-gray-200 rounded-lg p-8">
          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-md hover:border-gray-300 flex items-center justify-center gap-3 mb-6 font-medium text-gray-900 transition-all"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19.6 10.227c0-.709-.064-1.39-.182-2.045H10v3.868h5.382a4.6 4.6 0 01-1.996 3.018v2.51h3.232c1.891-1.742 2.982-4.305 2.982-7.35z" fill="#4285F4"/>
              <path d="M10 20c2.7 0 4.964-.895 6.618-2.423l-3.232-2.509c-.895.6-2.04.955-3.386.955-2.605 0-4.81-1.76-5.595-4.123H1.064v2.59A9.996 9.996 0 0010 20z" fill="#34A853"/>
              <path d="M4.405 11.9c-.2-.6-.314-1.24-.314-1.9 0-.66.114-1.3.314-1.9V5.51H1.064A9.996 9.996 0 000 10c0 1.614.386 3.14 1.064 4.49l3.34-2.59z" fill="#FBBC05"/>
              <path d="M10 3.977c1.468 0 2.786.505 3.823 1.496l2.868-2.868C14.959.99 12.695 0 10 0 6.091 0 2.709 2.24 1.064 5.51l3.34 2.59C5.19 5.736 7.395 3.977 10 3.977z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">or</span>
            </div>
          </div>

          {/* Magic Link */}
          <form onSubmit={handleMagicLink}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-md focus:border-black focus:outline-none text-gray-900"
                placeholder="you@example.com"
              />
            </div>

            {/* Success Message */}
            {message && (
              <div className="bg-green-50 border-2 border-green-200 rounded-md p-4 mb-4">
                <p className="text-sm text-green-800">{message}</p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-md p-4 mb-4">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 bg-black text-white rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? 'Sending link...' : 'Continue with Email'}
            </button>
          </form>

          <p className="text-xs text-gray-500 mt-6 text-center">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>

        {/* Back to home */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-gray-600 hover:text-gray-900">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
