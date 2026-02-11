'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { AppShell } from '@/components/layout/AppShell'

// Types
interface AdminUser {
  id: string
  name: string
  email: string
  subscriptionStatus: string
  baselineCompleted: boolean
  hookCompleted: boolean
  joinedAt: string
  stripeCustomerId: string | null
  clmi: number | null
  baselineCompletedAt: string | null
  baselineStartedAt: string | null
  stageReached: number
  totalTimeSeconds: number | null
  weeklyCount: number
  lastPulseDate: string | null
  mirrorCount: number
}

interface UserDetail {
  user: {
    id: string
    name: string
    email: string
    subscriptionStatus: string
    stripeCustomerId: string | null
    stripeSubscriptionId: string | null
    baselineCompleted: boolean
    hookCompleted: boolean
    joinedAt: string
  }
  sessions: any[]
  dimensionScores: any[]
  territoryScores: any[]
  archetypeMatches: any[]
  pulses: any[]
  mirrorSessions: any[]
  bsi: number | null
  hookSession: any | null
}

interface FeedbackItem {
  id: string
  userId: string
  userName: string
  userEmail: string
  pageUrl: string
  text: string
  createdAt: string
}

interface ActivityEvent {
  type: string
  userId: string
  userName: string
  userEmail: string
  timestamp: string
  details: string
}

interface ReportData {
  overview: { totalUsers: number; activeSubscribers: number; inactiveUsers: number; subscriptionConversionRate: number }
  baseline: { startRate: number; completionRate: number; avgDurationHours: number | null; avgAssessmentMinutes: number | null; avgTimePerStage: Record<string, number | null>; avgResponseTimeSeconds: number | null; avgSignupToStartDays: number | null }
  engagement: { avgCheckinsPerUser: number; activeUsers7d: number; activeUsers30d: number; churnRiskCount: number; totalCheckins: number }
  mirror: { totalInvites: number; completed: number; responseRate: number | null }
  hook: { total: number; converted: number; conversionRate: number | null }
  scores: { avgClmi: number | null; clmiDistribution: Record<string, number> }
  trends: { signupWeeks: Record<string, number> }
}

type Tab = 'users' | 'feedback' | 'activity' | 'report'

// Territory dimension groupings
const TERRITORY_DIMENSIONS: Record<string, { label: string; color: string; dimensions: string[] }> = {
  leading_yourself: {
    label: 'Leading Yourself',
    color: '#7FABC8',
    dimensions: ['self_awareness', 'emotional_mastery', 'grounded_presence', 'purpose_mastery', 'peak_performance'],
  },
  leading_teams: {
    label: 'Leading Teams',
    color: '#A6BEA4',
    dimensions: ['building_trust', 'hard_conversations', 'diagnosing_real_problem', 'team_operating_system', 'leader_identity'],
  },
  leading_organizations: {
    label: 'Leading Organizations',
    color: '#E08F6A',
    dimensions: ['strategic_clarity', 'culture_design', 'organizational_architecture', 'ceo_evolution', 'leading_change'],
  },
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatDateTime(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

function formatDimensionName(dim: string) {
  return dim.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    active: 'bg-green-100 text-green-700',
    inactive: 'bg-gray-100 text-gray-500',
    canceled: 'bg-red-100 text-red-600',
    past_due: 'bg-yellow-100 text-yellow-700',
  }
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${colors[status] || colors.inactive}`}>
      {status}
    </span>
  )
}

function EventTypeBadge({ type }: { type: string }) {
  const config: Record<string, { label: string; className: string }> = {
    baseline_completed: { label: 'Baseline', className: 'bg-green-100 text-green-700' },
    baseline_started: { label: 'Started', className: 'bg-blue-100 text-blue-700' },
    weekly_checkin: { label: 'Weekly', className: 'bg-purple-100 text-purple-700' },
    mirror_completed: { label: 'Mirror', className: 'bg-orange-100 text-orange-700' },
    feedback_submitted: { label: 'Feedback', className: 'bg-yellow-100 text-yellow-700' },
    signup: { label: 'Signup', className: 'bg-gray-100 text-gray-600' },
  }
  const c = config[type] || { label: type, className: 'bg-gray-100 text-gray-600' }
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${c.className}`}>
      {c.label}
    </span>
  )
}

// ─── Users Tab ───
function UsersTab({ users, onSelectUser }: { users: AdminUser[]; onSelectUser: (id: string) => void }) {
  const [sortBy, setSortBy] = useState<keyof AdminUser>('joinedAt')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [filter, setFilter] = useState('')

  const handleSort = (key: keyof AdminUser) => {
    if (sortBy === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(key)
      setSortDir('desc')
    }
  }

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(filter.toLowerCase()) ||
    u.email.toLowerCase().includes(filter.toLowerCase())
  )

  const sorted = [...filtered].sort((a, b) => {
    const aVal = a[sortBy]
    const bVal = b[sortBy]
    if (aVal === null && bVal === null) return 0
    if (aVal === null) return 1
    if (bVal === null) return -1
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
    }
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDir === 'asc' ? aVal - bVal : bVal - aVal
    }
    return 0
  })

  const SortHeader = ({ label, field }: { label: string; field: keyof AdminUser }) => (
    <th
      className="text-left text-xs font-medium text-black/40 uppercase tracking-wider py-3 px-3 cursor-pointer hover:text-black/60 select-none"
      onClick={() => handleSort(field)}
    >
      {label} {sortBy === field ? (sortDir === 'asc' ? '↑' : '↓') : ''}
    </th>
  )

  return (
    <div>
      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <p className="text-xs text-black/40 mb-1">Total Users</p>
          <p className="text-2xl font-bold">{users.length}</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <p className="text-xs text-black/40 mb-1">Active Subscribers</p>
          <p className="text-2xl font-bold">{users.filter(u => u.subscriptionStatus === 'active').length}</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <p className="text-xs text-black/40 mb-1">Baseline Complete</p>
          <p className="text-2xl font-bold">{users.filter(u => u.baselineCompleted).length}</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <p className="text-xs text-black/40 mb-1">Avg CLMI</p>
          <p className="text-2xl font-bold">
            {users.filter(u => u.clmi).length > 0
              ? Math.round(users.filter(u => u.clmi).reduce((sum, u) => sum + u.clmi!, 0) / users.filter(u => u.clmi).length)
              : '—'}%
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="w-full md:w-80 px-4 py-2.5 rounded-lg border border-black/10 text-sm focus:outline-none focus:border-black/30 bg-white"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead className="border-b border-black/5">
            <tr>
              <SortHeader label="Name" field="name" />
              <SortHeader label="Status" field="subscriptionStatus" />
              <SortHeader label="Baseline" field="baselineCompleted" />
              <SortHeader label="CLMI" field="clmi" />
              <SortHeader label="Weekly" field="weeklyCount" />
              <SortHeader label="Mirror" field="mirrorCount" />
              <SortHeader label="Joined" field="joinedAt" />
              <th className="py-3 px-3"></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(user => (
              <tr
                key={user.id}
                className="border-b border-black/5 last:border-0 hover:bg-black/[0.02] cursor-pointer transition-colors"
                onClick={() => onSelectUser(user.id)}
              >
                <td className="py-3 px-3">
                  <p className="text-sm font-medium text-black">{user.name}</p>
                  <p className="text-xs text-black/40">{user.email}</p>
                </td>
                <td className="py-3 px-3">
                  <StatusBadge status={user.subscriptionStatus} />
                </td>
                <td className="py-3 px-3">
                  {user.baselineCompleted ? (
                    <span className="text-xs text-green-600 font-medium">Complete</span>
                  ) : user.stageReached > 0 ? (
                    <span className="text-xs text-amber-600 font-medium">Stage {user.stageReached}/3</span>
                  ) : (
                    <span className="text-xs text-black/30">Not started</span>
                  )}
                </td>
                <td className="py-3 px-3">
                  <span className="text-sm font-medium">{user.clmi ? `${Math.round(user.clmi)}%` : '—'}</span>
                </td>
                <td className="py-3 px-3">
                  <span className="text-sm">{user.weeklyCount || '—'}</span>
                </td>
                <td className="py-3 px-3">
                  <span className="text-sm">{user.mirrorCount || '—'}</span>
                </td>
                <td className="py-3 px-3">
                  <span className="text-xs text-black/40">{formatDate(user.joinedAt)}</span>
                </td>
                <td className="py-3 px-3">
                  <button className="text-xs text-black/30 hover:text-black/60">View →</button>
                </td>
              </tr>
            ))}
            {sorted.length === 0 && (
              <tr>
                <td colSpan={8} className="py-8 text-center text-sm text-black/40">
                  {filter ? 'No users match your search' : 'No users found'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── User Detail View ───
function UserDetailView({
  detail,
  onBack,
}: {
  detail: UserDetail
  onBack: () => void
}) {
  const { user, sessions, dimensionScores, territoryScores, archetypeMatches, pulses, mirrorSessions, bsi, hookSession } = detail
  const completedSession = sessions.find((s: any) => s.completed_at)

  return (
    <div>
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1 text-sm text-black/40 hover:text-black/70 transition-colors mb-6"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        Back to Users
      </button>

      {/* User header */}
      <div className="bg-white rounded-lg p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] mb-4">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-xl font-bold text-black">{user.name || 'Unknown'}</h2>
            <p className="text-sm text-black/50 mt-0.5">{user.email}</p>
            <div className="flex items-center gap-3 mt-3">
              <StatusBadge status={user.subscriptionStatus} />
              <span className="text-xs text-black/30">Joined {formatDate(user.joinedAt)}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2">
            {user.stripeCustomerId && (
              <a
                href={`https://dashboard.stripe.com/customers/${user.stripeCustomerId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-[#635BFF]/10 text-[#635BFF] hover:bg-[#635BFF]/20 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M6 3H3V13H13V10M9 3H13V7M13 3L7 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                Stripe
              </a>
            )}
            <a
              href={`mailto:${user.email}`}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-black/5 text-black/60 hover:bg-black/10 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
              Email
            </a>
          </div>
        </div>
      </div>

      {/* Assessment overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-white rounded-lg p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <p className="text-xs text-black/40 mb-1">CLMI Score</p>
          <p className="text-3xl font-bold">
            {completedSession?.clmi ? `${Math.round(Number(completedSession.clmi))}%` : '—'}
          </p>
          {completedSession?.completed_at && (
            <p className="text-xs text-black/30 mt-1">Completed {formatDate(completedSession.completed_at)}</p>
          )}
        </div>
        <div className="bg-white rounded-lg p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <p className="text-xs text-black/40 mb-1">Weekly Check-ins</p>
          <p className="text-3xl font-bold">{pulses.length > 0 ? new Set(pulses.map((p: any) => p.responded_at?.substring(0, 10))).size : 0}</p>
          {pulses.length > 0 && (
            <p className="text-xs text-black/30 mt-1">Last: {formatDate(pulses[0]?.responded_at)}</p>
          )}
        </div>
        <div className="bg-white rounded-lg p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <p className="text-xs text-black/40 mb-1">BSI (Blind Spot Index)</p>
          <p className="text-3xl font-bold">{bsi !== null ? `${Math.round(Number(bsi))}%` : '—'}</p>
          <p className="text-xs text-black/30 mt-1">
            {mirrorSessions.filter((m: any) => m.completed_at).length} mirror responses
          </p>
        </div>
      </div>

      {/* Dimension scores by territory */}
      {dimensionScores.length > 0 && (
        <div className="bg-white rounded-lg p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] mb-4">
          <h3 className="text-sm font-semibold text-black/40 uppercase tracking-wider mb-4">Dimension Scores</h3>
          {Object.entries(TERRITORY_DIMENSIONS).map(([key, territory]) => (
            <div key={key} className="mb-5 last:mb-0">
              <p className="text-xs font-medium mb-2" style={{ color: territory.color }}>
                {territory.label}
              </p>
              <div className="space-y-2">
                {territory.dimensions.map(dim => {
                  const score = dimensionScores.find((s: any) => s.dimension === dim)
                  return (
                    <div key={dim} className="flex items-center gap-3">
                      <span className="text-xs text-black/50 w-40 shrink-0">{formatDimensionName(dim)}</span>
                      <div className="flex-1 h-2 bg-black/5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${score?.percentage || 0}%`,
                            backgroundColor: territory.color,
                          }}
                        />
                      </div>
                      <span className="text-xs font-medium text-black/60 w-10 text-right">
                        {score?.percentage ? `${Math.round(Number(score.percentage))}%` : '—'}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Archetype matches */}
      {archetypeMatches.length > 0 && (
        <div className="bg-white rounded-lg p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] mb-4">
          <h3 className="text-sm font-semibold text-black/40 uppercase tracking-wider mb-3">Archetype Matches</h3>
          <div className="space-y-2">
            {archetypeMatches.map((a: any, i: number) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-black/5 last:border-0">
                <div>
                  <span className="text-sm font-medium text-black">{a.archetype_name}</span>
                  <span className="text-xs text-black/30 ml-2">{a.match_type}</span>
                </div>
                <span className="text-sm font-medium">{a.signature_strength ? `${Math.round(Number(a.signature_strength))}%` : '—'}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hook session */}
      {hookSession && (
        <div className="bg-white rounded-lg p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] mb-4">
          <h3 className="text-sm font-semibold text-black/40 uppercase tracking-wider mb-3">Hook Assessment</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-black/40">Leading Yourself</p>
              <p className="text-lg font-bold">{hookSession.ly_score ? `${Math.round(Number(hookSession.ly_score))}%` : '—'}</p>
            </div>
            <div>
              <p className="text-xs text-black/40">Leading Teams</p>
              <p className="text-lg font-bold">{hookSession.lt_score ? `${Math.round(Number(hookSession.lt_score))}%` : '—'}</p>
            </div>
            <div>
              <p className="text-xs text-black/40">Leading Organizations</p>
              <p className="text-lg font-bold">{hookSession.lo_score ? `${Math.round(Number(hookSession.lo_score))}%` : '—'}</p>
            </div>
          </div>
          <p className="text-xs text-black/30 mt-2">
            Completed {formatDate(hookSession.completed_at)} · Converted: {hookSession.converted ? 'Yes' : 'No'}
          </p>
        </div>
      )}

      {/* Mirror sessions */}
      {mirrorSessions.length > 0 && (
        <div className="bg-white rounded-lg p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] mb-4">
          <h3 className="text-sm font-semibold text-black/40 uppercase tracking-wider mb-3">Mirror Feedback</h3>
          <div className="space-y-2">
            {mirrorSessions.map((m: any) => (
              <div key={m.id} className="flex items-center justify-between py-2 border-b border-black/5 last:border-0">
                <div>
                  <span className="text-sm text-black">{m.rater_email || 'Unknown rater'}</span>
                  <span className="text-xs text-black/30 ml-2">{m.rater_relationship || ''}</span>
                </div>
                <span className={`text-xs font-medium ${m.completed_at ? 'text-green-600' : 'text-amber-500'}`}>
                  {m.completed_at ? `Completed ${formatDate(m.completed_at)}` : 'Pending'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Weekly pulse history */}
      {pulses.length > 0 && (
        <div className="bg-white rounded-lg p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <h3 className="text-sm font-semibold text-black/40 uppercase tracking-wider mb-3">Weekly Pulse History</h3>
          <div className="max-h-60 overflow-y-auto">
            {(() => {
              // Group by date
              const grouped = new Map<string, any[]>()
              for (const p of pulses) {
                const date = p.responded_at?.substring(0, 10) || 'unknown'
                const arr = grouped.get(date) || []
                arr.push(p)
                grouped.set(date, arr)
              }
              return Array.from(grouped.entries()).map(([date, items]) => (
                <div key={date} className="py-2 border-b border-black/5 last:border-0">
                  <p className="text-xs text-black/40 mb-1">{formatDate(date)}</p>
                  <div className="flex flex-wrap gap-2">
                    {items.map((item: any, i: number) => (
                      <span key={i} className="text-xs bg-black/5 rounded px-2 py-0.5">
                        {formatDimensionName(item.dimension)}: {item.score ? Math.round(Number(item.score) * 100) / 100 : '—'}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            })()}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Feedback Tab ───
function FeedbackTab({ feedback }: { feedback: FeedbackItem[] }) {
  if (feedback.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 shadow-[0_1px_3px_rgba(0,0,0,0.04)] text-center">
        <div className="w-12 h-12 rounded-full bg-black/[0.03] flex items-center justify-center mx-auto mb-4">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-black/20">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
          </svg>
        </div>
        <p className="text-sm font-medium text-black/50">No feedback yet</p>
        <p className="text-xs text-black/30 mt-1">Feedback will appear here once users submit it</p>
      </div>
    )
  }

  // Compute stats
  const uniqueUsers = new Set(feedback.map(f => f.userId)).size
  const pages = feedback.reduce((acc, f) => {
    const page = f.pageUrl.replace(/^https?:\/\/[^/]+/, '').split('?')[0] || '/'
    acc[page] = (acc[page] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  const topPages = Object.entries(pages).sort((a, b) => b[1] - a[1]).slice(0, 4)
  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const thisWeek = feedback.filter(f => new Date(f.createdAt) > weekAgo).length
  const latest = feedback[0]

  // Relative time helper
  function timeAgo(dateStr: string) {
    const diff = now.getTime() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m ago`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    if (days < 7) return `${days}d ago`
    return formatDate(dateStr)
  }

  return (
    <div className="space-y-4">
      {/* Bento grid — stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <p className="text-[11px] font-medium text-black/35 uppercase tracking-wider mb-2">Total</p>
          <p className="text-3xl font-bold text-black tracking-tight">{feedback.length}</p>
          <p className="text-xs text-black/30 mt-1">submissions</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <p className="text-[11px] font-medium text-black/35 uppercase tracking-wider mb-2">This Week</p>
          <p className="text-3xl font-bold text-black tracking-tight">{thisWeek}</p>
          <p className="text-xs text-black/30 mt-1">new entries</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <p className="text-[11px] font-medium text-black/35 uppercase tracking-wider mb-2">Users</p>
          <p className="text-3xl font-bold text-black tracking-tight">{uniqueUsers}</p>
          <p className="text-xs text-black/30 mt-1">gave feedback</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <p className="text-[11px] font-medium text-black/35 uppercase tracking-wider mb-2">Top Page</p>
          <p className="text-lg font-bold text-black tracking-tight truncate">{topPages[0]?.[0] || '—'}</p>
          <p className="text-xs text-black/30 mt-1">{topPages[0]?.[1] || 0} mentions</p>
        </div>
      </div>

      {/* Bento grid — main content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Latest highlight — spans 2 cols */}
        {latest && (
          <div className="md:col-span-2 bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col">
            <p className="text-[11px] font-medium text-black/35 uppercase tracking-wider mb-3">Latest Feedback</p>
            <div className="flex-1">
              <p className="text-base text-black/80 leading-relaxed">&ldquo;{latest.text}&rdquo;</p>
            </div>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-black/5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-black/[0.06] flex items-center justify-center text-xs font-bold text-black/40">
                  {latest.userName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs font-medium text-black">{latest.userName}</p>
                  <p className="text-[10px] text-black/30">{latest.pageUrl.replace(/^https?:\/\/[^/]+/, '').split('?')[0]}</p>
                </div>
              </div>
              <span className="text-xs text-black/30">{timeAgo(latest.createdAt)}</span>
            </div>
          </div>
        )}

        {/* Pages breakdown */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <p className="text-[11px] font-medium text-black/35 uppercase tracking-wider mb-3">By Page</p>
          <div className="space-y-2.5">
            {topPages.map(([page, count]) => {
              const pct = Math.round((count / feedback.length) * 100)
              return (
                <div key={page}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-black/60 truncate max-w-[140px]">{page}</span>
                    <span className="text-xs font-medium text-black/40">{count}</span>
                  </div>
                  <div className="h-1.5 bg-black/[0.04] rounded-full overflow-hidden">
                    <div className="h-full bg-black/15 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
            {topPages.length === 0 && (
              <p className="text-xs text-black/30">No data</p>
            )}
          </div>
        </div>
      </div>

      {/* All feedback — card grid */}
      <div>
        <p className="text-[11px] font-medium text-black/35 uppercase tracking-wider mb-3">All Feedback</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {feedback.map(f => (
            <div key={f.id} className="bg-white rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col">
              <p className="text-sm text-black/70 leading-relaxed flex-1">{f.text}</p>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-black/5">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-6 h-6 rounded-full bg-black/[0.06] flex items-center justify-center text-[10px] font-bold text-black/40 shrink-0">
                    {f.userName.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-medium text-black truncate">{f.userName}</span>
                  <span className="text-[10px] text-black/25 truncate hidden sm:inline">{f.pageUrl.replace(/^https?:\/\/[^/]+/, '').split('?')[0]}</span>
                </div>
                <span className="text-[11px] text-black/30 shrink-0 ml-2">{timeAgo(f.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Activity Tab ───
function ActivityTab({ events }: { events: ActivityEvent[] }) {
  if (events.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 shadow-[0_1px_3px_rgba(0,0,0,0.04)] text-center">
        <p className="text-sm text-black/40">No activity yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {events.map((event, i) => (
        <div key={i} className="bg-white rounded-2xl px-5 py-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex items-start gap-3">
            {/* Avatar */}
            <div className="w-9 h-9 rounded-full bg-black/[0.06] flex items-center justify-center text-xs font-bold text-black/40 shrink-0 mt-0.5">
              {(event.userName !== 'Unknown' ? event.userName : event.userEmail).charAt(0).toUpperCase()}
            </div>
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-semibold text-black">
                  {event.userName !== 'Unknown' ? event.userName : event.userEmail.split('@')[0]}
                </span>
                <span className="text-xs text-black/30">{event.userEmail}</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <EventTypeBadge type={event.type} />
                <p className="text-sm text-black/60">{event.details}</p>
              </div>
            </div>
            {/* Time */}
            <span className="text-xs text-black/30 shrink-0 mt-1">{formatDateTime(event.timestamp)}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Report Tab ───
function ReportTab({ report }: { report: ReportData | null }) {
  if (!report) {
    return (
      <div className="bg-white rounded-2xl p-12 shadow-[0_1px_3px_rgba(0,0,0,0.04)] text-center">
        <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-black/40">Loading report data...</p>
      </div>
    )
  }

  const { overview, baseline, engagement, mirror, hook, scores, trends } = report

  // Mini bar chart helper
  function MiniBar({ value, max, color = 'bg-black/15' }: { value: number; max: number; color?: string }) {
    const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0
    return (
      <div className="h-2 bg-black/[0.04] rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    )
  }

  // Stat card helper
  function StatCard({ label, value, sub, wide }: { label: string; value: string | number; sub?: string; wide?: boolean }) {
    return (
      <div className={`bg-white rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] ${wide ? 'md:col-span-2' : ''}`}>
        <p className="text-[11px] font-medium text-black/35 uppercase tracking-wider mb-2">{label}</p>
        <p className="text-2xl font-bold text-black tracking-tight">{value}</p>
        {sub && <p className="text-xs text-black/30 mt-1">{sub}</p>}
      </div>
    )
  }

  // Rate card with donut-style indicator
  function RateCard({ label, rate, numerator, denominator }: { label: string; rate: number | null; numerator?: number; denominator?: number }) {
    const pct = rate ?? 0
    return (
      <div className="bg-white rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <p className="text-[11px] font-medium text-black/35 uppercase tracking-wider mb-3">{label}</p>
        <div className="flex items-end gap-3">
          <p className="text-3xl font-bold text-black tracking-tight">{rate !== null ? `${pct}%` : '—'}</p>
          {numerator !== undefined && denominator !== undefined && (
            <p className="text-xs text-black/30 mb-1">{numerator}/{denominator}</p>
          )}
        </div>
        <div className="mt-3">
          <MiniBar value={pct} max={100} color={pct >= 60 ? 'bg-green-400' : pct >= 30 ? 'bg-amber-400' : 'bg-red-300'} />
        </div>
      </div>
    )
  }

  const signupWeekEntries = Object.entries(trends.signupWeeks).reverse()
  const maxSignups = Math.max(...signupWeekEntries.map(([, v]) => v), 1)

  return (
    <div className="space-y-4">
      {/* ── Section 1: Funnel ── */}
      <p className="text-[11px] font-medium text-black/35 uppercase tracking-wider">Conversion Funnel</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Total Users" value={overview.totalUsers} sub="all signups" />
        <RateCard label="Subscription Rate" rate={overview.subscriptionConversionRate} numerator={overview.activeSubscribers} denominator={overview.totalUsers} />
        <RateCard label="Baseline Start" rate={baseline.startRate} />
        <RateCard label="Baseline Complete" rate={baseline.completionRate} />
      </div>

      {/* ── Section 2: Assessment Timing ── */}
      <p className="text-[11px] font-medium text-black/35 uppercase tracking-wider mt-6">Assessment Timing</p>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <StatCard
          label="Signup → Start"
          value={baseline.avgSignupToStartDays !== null ? `${baseline.avgSignupToStartDays}d` : '—'}
          sub="avg days to begin"
        />
        <StatCard
          label="Total Duration"
          value={baseline.avgDurationHours !== null ? `${baseline.avgDurationHours}h` : '—'}
          sub="start to finish"
        />
        <StatCard
          label="Active Time"
          value={baseline.avgAssessmentMinutes !== null ? `${baseline.avgAssessmentMinutes}m` : '—'}
          sub="answering questions"
        />
        <StatCard
          label="Per Question"
          value={baseline.avgResponseTimeSeconds !== null ? `${baseline.avgResponseTimeSeconds}s` : '—'}
          sub="avg response time"
        />
        <div className="bg-white rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <p className="text-[11px] font-medium text-black/35 uppercase tracking-wider mb-3">Per Stage</p>
          <div className="space-y-2">
            {[1, 2, 3].map(stage => (
              <div key={stage} className="flex items-center gap-2">
                <span className="text-xs text-black/40 w-14">Stage {stage}</span>
                <span className="text-sm font-medium text-black">
                  {baseline.avgTimePerStage[stage] !== null ? `${baseline.avgTimePerStage[stage]}m` : '—'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Section 3: Engagement ── */}
      <p className="text-[11px] font-medium text-black/35 uppercase tracking-wider mt-6">Engagement</p>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <StatCard label="Active (7d)" value={engagement.activeUsers7d} sub={`of ${overview.activeSubscribers} subscribers`} />
        <StatCard label="Active (30d)" value={engagement.activeUsers30d} sub={`of ${overview.activeSubscribers} subscribers`} />
        <StatCard label="Churn Risk" value={engagement.churnRiskCount} sub="inactive 14+ days" />
        <StatCard label="Avg Check-ins" value={engagement.avgCheckinsPerUser} sub="per user total" />
        <StatCard label="Total Check-ins" value={engagement.totalCheckins} sub="all pulse entries" />
      </div>

      {/* ── Section 4: Mirror + Hook ── */}
      <p className="text-[11px] font-medium text-black/35 uppercase tracking-wider mt-6">Mirror & Hook</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <RateCard label="Mirror Response" rate={mirror.responseRate} numerator={mirror.completed} denominator={mirror.totalInvites} />
        <StatCard label="Mirror Invites" value={mirror.totalInvites} sub={`${mirror.completed} completed`} />
        <RateCard label="Hook Conversion" rate={hook.conversionRate} numerator={hook.converted} denominator={hook.total} />
        <StatCard label="Hook Sessions" value={hook.total} sub={`${hook.converted} converted`} />
      </div>

      {/* ── Section 5: Scores + Trends ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
        {/* CLMI Distribution */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[11px] font-medium text-black/35 uppercase tracking-wider">CLMI Distribution</p>
            <p className="text-sm font-bold text-black">{scores.avgClmi !== null ? `Avg ${scores.avgClmi}%` : '—'}</p>
          </div>
          <div className="space-y-3">
            {Object.entries(scores.clmiDistribution).map(([range, count]) => {
              const total = Object.values(scores.clmiDistribution).reduce((a, b) => a + b, 0)
              const colors: Record<string, string> = {
                '0-25': 'bg-red-300',
                '26-50': 'bg-amber-300',
                '51-75': 'bg-blue-300',
                '76-100': 'bg-green-400',
              }
              return (
                <div key={range}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-black/50">{range}%</span>
                    <span className="text-xs font-medium text-black/40">{count} users</span>
                  </div>
                  <div className="h-2 bg-black/[0.04] rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${colors[range] || 'bg-black/15'}`} style={{ width: `${total > 0 ? (count / total) * 100 : 0}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Signup trend */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <p className="text-[11px] font-medium text-black/35 uppercase tracking-wider mb-4">Signups (Last 8 Weeks)</p>
          <div className="flex items-end gap-2 h-32">
            {signupWeekEntries.map(([week, count]) => (
              <div key={week} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] font-medium text-black/50">{count}</span>
                <div className="w-full bg-black/[0.04] rounded-t-md overflow-hidden" style={{ height: '100px' }}>
                  <div
                    className="w-full bg-black/15 rounded-t-md mt-auto"
                    style={{
                      height: `${maxSignups > 0 ? (count / maxSignups) * 100 : 0}%`,
                      marginTop: `${maxSignups > 0 ? 100 - (count / maxSignups) * 100 : 100}%`,
                    }}
                  />
                </div>
                <span className="text-[9px] text-black/30">{week}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main Admin Page ───
export default function AdminPage() {
  const [state, setState] = useState<'loading' | 'forbidden' | 'error' | 'loaded'>('loading')
  const [tab, setTab] = useState<Tab>('users')
  const [users, setUsers] = useState<AdminUser[]>([])
  const [feedback, setFeedback] = useState<FeedbackItem[]>([])
  const [events, setEvents] = useState<ActivityEvent[]>([])
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [userDetail, setUserDetail] = useState<UserDetail | null>(null)
  const [report, setReport] = useState<ReportData | null>(null)
  const [loadingDetail, setLoadingDetail] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const loadData = useCallback(async () => {
    try {
      // Check admin access client-side first
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setState('forbidden')
        return
      }

      // Load all data in parallel
      const [usersRes, feedbackRes, activityRes, reportRes] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/admin/feedback'),
        fetch('/api/admin/activity'),
        fetch('/api/admin/report'),
      ])

      if (usersRes.status === 403) {
        setState('forbidden')
        return
      }

      if (!usersRes.ok) throw new Error('Failed to load users')

      const usersData = await usersRes.json()
      setUsers(usersData.users || [])

      if (feedbackRes.ok) {
        const feedbackData = await feedbackRes.json()
        setFeedback(feedbackData.feedback || [])
      }

      if (activityRes.ok) {
        const activityData = await activityRes.json()
        setEvents(activityData.events || [])
      }

      if (reportRes.ok) {
        const reportData = await reportRes.json()
        setReport(reportData)
      }

      setState('loaded')
    } catch (err: any) {
      console.error('Admin load error:', err)
      setErrorMsg(err.message)
      setState('error')
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const loadUserDetail = useCallback(async (userId: string) => {
    setLoadingDetail(true)
    try {
      const res = await fetch(`/api/admin/users/${userId}`)
      if (!res.ok) throw new Error('Failed to load user detail')
      const data = await res.json()
      setUserDetail(data)
      setSelectedUserId(userId)
    } catch (err) {
      console.error('User detail error:', err)
    } finally {
      setLoadingDetail(false)
    }
  }, [])

  if (state === 'loading') {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
            <span className="text-sm text-black/50">Loading admin panel...</span>
          </div>
        </div>
      </AppShell>
    )
  }

  if (state === 'forbidden') {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-[60vh] px-6">
          <div className="bg-white rounded-lg p-10 shadow-[0_1px_3px_rgba(0,0,0,0.04)] max-w-md w-full text-center">
            <h2 className="text-xl font-bold text-black mb-2">Access Denied</h2>
            <p className="text-sm text-black/50 mb-6">You don&apos;t have permission to access the admin panel.</p>
            <a
              href="/ceolab"
              className="inline-block bg-black text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-black/90 transition-colors"
            >
              Go to CEO Lab
            </a>
          </div>
        </div>
      </AppShell>
    )
  }

  if (state === 'error') {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-[60vh] px-6">
          <div className="bg-white rounded-lg p-10 shadow-[0_1px_3px_rgba(0,0,0,0.04)] max-w-md w-full text-center">
            <h2 className="text-xl font-bold text-black mb-2">Error</h2>
            <p className="text-sm text-black/50 mb-6">{errorMsg || 'Something went wrong loading the admin panel.'}</p>
            <button
              onClick={() => { setState('loading'); loadData() }}
              className="inline-block bg-black text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-black/90 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </AppShell>
    )
  }

  // User detail view
  if (selectedUserId && userDetail) {
    return (
      <AppShell>
        <div className="px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <UserDetailView
              detail={userDetail}
              onBack={() => { setSelectedUserId(null); setUserDetail(null) }}
            />
          </div>
        </div>
      </AppShell>
    )
  }

  // Loading detail overlay
  if (loadingDetail) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
            <span className="text-sm text-black/50">Loading user detail...</span>
          </div>
        </div>
      </AppShell>
    )
  }

  const TABS: { id: Tab; label: string; count?: number }[] = [
    { id: 'users', label: 'Users', count: users.length },
    { id: 'feedback', label: 'Feedback', count: feedback.length },
    { id: 'activity', label: 'Activity' },
    { id: 'report', label: 'Report' },
  ]

  return (
    <AppShell>
      <div className="px-6 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-black">Admin Panel</h1>
              <p className="text-sm text-black/40 mt-0.5">User management and platform overview</p>
            </div>
            <button
              onClick={() => { setState('loading'); loadData() }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-black/5 text-black/60 hover:bg-black/10 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" /></svg>
              Refresh
            </button>
          </div>

          {/* Tab bar */}
          <div className="flex gap-1 mb-6 bg-black/[0.03] rounded-lg p-1 w-fit">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  tab === t.id
                    ? 'bg-white text-black shadow-sm'
                    : 'text-black/40 hover:text-black/60'
                }`}
              >
                {t.label}
                {t.count !== undefined && (
                  <span className="ml-1.5 text-xs text-black/30">{t.count}</span>
                )}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {tab === 'users' && <UsersTab users={users} onSelectUser={loadUserDetail} />}
          {tab === 'feedback' && <FeedbackTab feedback={feedback} />}
          {tab === 'activity' && <ActivityTab events={events} />}
          {tab === 'report' && <ReportTab report={report} />}
        </div>
      </div>
    </AppShell>
  )
}
