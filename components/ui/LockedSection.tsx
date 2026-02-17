interface LockedSectionProps {
  title?: string
  className?: string
}

export function LockedSection({
  title = 'Subscribe to unlock',
  className = '',
}: LockedSectionProps) {
  return (
    <div
      className={`bg-black/[0.02] border border-black/5 rounded-2xl flex flex-col items-center justify-center py-12 px-6 text-center ${className}`}
    >
      <svg
        className="w-8 h-8 text-black/20 mb-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
        />
      </svg>
      <p className="text-sm text-black/40 mb-6">{title}</p>
      <a
        href="/api/checkout"
        className="inline-block bg-black text-white px-8 py-3.5 rounded-lg text-sm font-semibold hover:bg-black/90 transition-colors"
      >
        Subscribe &mdash; &euro;100/mo
      </a>
    </div>
  )
}
