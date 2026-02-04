'use client'

import Link from 'next/link'

export default function NovaNav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-black/10 bg-white/80">
      <div className="max-w-7xl mx-auto px-8 py-4">
        <div className="flex justify-between items-center">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-black">
            <span className="text-xl font-bold">nk</span>
            <span className="text-xl font-light">CEO Lab</span>
          </Link>

          {/* Nav Items */}
          <div className="flex items-center gap-6">
            <Link
              href="/auth"
              className="text-sm font-medium text-black/70 hover:text-black transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/assessment/hook"
              className="bg-black text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-black/90 transition-all duration-200"
            >
              Start Free Assessment
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
