'use client'

import Link from 'next/link'

export default function NovaHero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-8 py-20 bg-white">
      {/* Background animation container */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(1px 1px at 20% 30%, #000, transparent),
            radial-gradient(1px 1px at 60% 70%, #000, transparent),
            radial-gradient(1px 1px at 50% 50%, #000, transparent),
            radial-gradient(1px 1px at 80% 10%, #000, transparent),
            radial-gradient(1px 1px at 90% 60%, #000, transparent),
            radial-gradient(1px 1px at 33% 80%, #000, transparent)
          `,
          backgroundSize: '200% 200%',
          animation: 'stars 60s ease-in-out infinite'
        }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto text-center">

        {/* Logo/Animation Space */}
        <div className="mb-12 min-h-[180px] flex items-center justify-center">
          {/* Your animation will go here */}
          <div className="text-black/5 text-6xl">
            {/* Placeholder - add your logo animation */}
          </div>
        </div>

        {/* Main Headline - Nova Style (closer sizing) */}
        <h1 className="text-[48px] md:text-[52px] lg:text-[56px] font-bold text-black mb-6 leading-[1.1] tracking-tight">
          A measurement system for your
          <br />
          leadership development
        </h1>

        {/* Subtitle */}
        <p className="text-base md:text-lg text-black/60 mb-10 max-w-2xl mx-auto leading-relaxed">
          CEO Lab tracks your growth across 18 leadership dimensions.
          No preconception, just space for your development to take shape.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
          {/* Primary CTA */}
          <Link
            href="/assessment/hook"
            className="w-full sm:w-auto bg-black text-white px-7 py-3.5 rounded-lg text-base font-semibold hover:bg-black/90 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 20 20"
              fill="none"
              className="translate-y-[1px]"
            >
              <path
                d="M10 4v12m-6-6h12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            Start Free Assessment
          </Link>

          {/* Secondary CTA */}
          <Link
            href="#learn-more"
            className="w-full sm:w-auto bg-transparent text-black border-2 border-black/10 px-7 py-3.5 rounded-lg text-base font-semibold hover:bg-black/5 hover:border-black/20 transition-all duration-200"
          >
            Learn more
          </Link>
        </div>

        {/* Supporting Text */}
        <p className="text-sm text-black/40">
          Also available for{' '}
          <span className="text-black/60 font-medium">Teams</span>
          {' '}&{' '}
          <span className="text-black/60 font-medium">Organizations</span>
        </p>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="w-6 h-10 rounded-full border-2 border-black/10 flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-black/30 rounded-full animate-bounce"></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes stars {
          0%, 100% {
            background-position: 0% 0%, 10% 20%, 20% 30%, 30% 40%, 40% 50%, 50% 60%;
          }
          50% {
            background-position: 100% 100%, 90% 80%, 80% 70%, 70% 60%, 60% 50%, 50% 40%;
          }
        }
      `}</style>
    </section>
  )
}
