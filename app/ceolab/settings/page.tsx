'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { AppShell } from '@/components/layout/AppShell'
import { createClient } from '@/lib/supabase-browser'
import { DIMENSIONS, TERRITORY_CONFIG } from '@/lib/constants'
import type { DimensionId, Territory } from '@/types/assessment'

const TERRITORY_COLORS: Record<Territory, string> = {
  leading_yourself: '#7FABC8',
  leading_teams: '#A6BEA4',
  leading_organizations: '#E08F6A',
}

type Profile = {
  full_name: string
  email: string
  avatar_url: string | null
  subscription_status: string
}

export default function SettingsPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [focusDimensions, setFocusDimensions] = useState<DimensionId[]>([])
  const [loading, setLoading] = useState(true)
  const [editingName, setEditingName] = useState(false)
  const [nameValue, setNameValue] = useState('')
  const [savingName, setSavingName] = useState(false)
  const [changingFocus, setChangingFocus] = useState(false)
  const [selectedDimensions, setSelectedDimensions] = useState<DimensionId[]>([])
  const [savingFocus, setSavingFocus] = useState(false)
  const [portalLoading, setPortalLoading] = useState(false)
  const [signingOut, setSigningOut] = useState(false)

  const loadData = useCallback(async () => {
    try {
      const [profileRes, focusRes] = await Promise.all([
        fetch('/api/v4/profile'),
        fetch('/api/v4/focus'),
      ])

      const profileData = await profileRes.json()
      const focusData = await focusRes.json()

      if (!profileRes.ok) {
        router.push('/auth')
        return
      }

      setProfile(profileData.profile)
      setNameValue(profileData.profile.full_name)

      if (focusData.success && focusData.dimensions.length > 0) {
        setFocusDimensions(focusData.dimensions)
      }
    } catch {
      router.push('/auth')
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    loadData()
  }, [loadData])

  const saveName = async () => {
    if (!nameValue.trim() || nameValue.trim() === profile?.full_name) {
      setEditingName(false)
      return
    }
    setSavingName(true)
    try {
      const res = await fetch('/api/v4/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: nameValue.trim() }),
      })
      const data = await res.json()
      if (data.success) {
        setProfile(prev => prev ? { ...prev, full_name: data.full_name } : prev)
        setEditingName(false)
      }
    } finally {
      setSavingName(false)
    }
  }

  const toggleDimension = (id: DimensionId) => {
    setSelectedDimensions(prev => {
      if (prev.includes(id)) return prev.filter(d => d !== id)
      if (prev.length >= 3) return prev
      return [...prev, id]
    })
  }

  const saveFocus = async () => {
    if (selectedDimensions.length !== 3) return
    setSavingFocus(true)
    try {
      const res = await fetch('/api/v4/focus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dimensions: selectedDimensions }),
      })
      const data = await res.json()
      if (data.success) {
        setFocusDimensions(selectedDimensions)
        localStorage.setItem('aa_focus_dimensions', JSON.stringify(selectedDimensions))
        setChangingFocus(false)
      }
    } finally {
      setSavingFocus(false)
    }
  }

  const openBillingPortal = async () => {
    setPortalLoading(true)
    try {
      const res = await fetch('/api/v4/billing-portal', { method: 'POST' })
      const data = await res.json()
      if (data.success && data.url) {
        window.location.href = data.url
      }
    } finally {
      setPortalLoading(false)
    }
  }

  const signOut = async () => {
    setSigningOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth')
  }

  if (loading) {
    return (
      <AppShell>
        <div className="max-w-2xl mx-auto px-6 py-16">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-black/5 rounded w-32" />
            <div className="h-24 bg-black/5 rounded" />
            <div className="h-24 bg-black/5 rounded" />
          </div>
        </div>
      </AppShell>
    )
  }

  if (!profile) return null

  const initials = profile.full_name
    ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : profile.email[0].toUpperCase()

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto px-6 py-10 space-y-8">
        <h1 className="text-2xl font-bold text-black">Settings</h1>

        {/* Profile Section */}
        <section className="bg-white rounded-2xl p-6 border border-black/5">
          <h2 className="text-sm font-semibold text-black/40 uppercase tracking-wider mb-4">Profile</h2>
          <div className="flex items-start gap-4">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt=""
                className="w-14 h-14 rounded-full"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-black/5 flex items-center justify-center text-lg font-semibold text-black/50">
                {initials}
              </div>
            )}
            <div className="flex-1 min-w-0">
              {editingName ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={nameValue}
                    onChange={e => setNameValue(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') saveName(); if (e.key === 'Escape') { setEditingName(false); setNameValue(profile.full_name) } }}
                    className="text-lg font-semibold text-black bg-transparent border-b border-black/20 outline-none py-0.5 w-full"
                    autoFocus
                    disabled={savingName}
                  />
                  <button
                    onClick={saveName}
                    disabled={savingName}
                    className="text-sm text-black/50 hover:text-black"
                  >
                    {savingName ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={() => { setEditingName(false); setNameValue(profile.full_name) }}
                    className="text-sm text-black/30 hover:text-black/50"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setEditingName(true)}
                  className="group flex items-center gap-2"
                >
                  <span className="text-lg font-semibold text-black">{profile.full_name || 'Add your name'}</span>
                  <span className="text-xs text-black/30 group-hover:text-black/50">Edit</span>
                </button>
              )}
              <p className="text-sm text-black/40 mt-0.5">{profile.email}</p>
            </div>
          </div>
        </section>

        {/* Focus Dimensions Section */}
        <section className="bg-white rounded-2xl p-6 border border-black/5">
          <h2 className="text-sm font-semibold text-black/40 uppercase tracking-wider mb-4">Focus Dimensions</h2>
          {focusDimensions.length > 0 && !changingFocus ? (
            <div className="space-y-3">
              {focusDimensions.map(dimId => {
                const dim = DIMENSIONS.find(d => d.id === dimId)
                if (!dim) return null
                const color = TERRITORY_COLORS[dim.territory]
                return (
                  <div key={dimId} className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                    <div>
                      <p className="text-sm font-medium text-black">{dim.name}</p>
                      <p className="text-xs text-black/40">{TERRITORY_CONFIG[dim.territory].displayLabel}</p>
                    </div>
                  </div>
                )
              })}
              <button
                onClick={() => { setChangingFocus(true); setSelectedDimensions(focusDimensions) }}
                className="mt-2 text-sm text-black/50 hover:text-black transition-colors"
              >
                Change Focus
              </button>
            </div>
          ) : changingFocus ? (
            <div className="space-y-4">
              <p className="text-sm text-black/50">Select 3 dimensions to focus on ({selectedDimensions.length}/3)</p>
              {(['leading_yourself', 'leading_teams', 'leading_organizations'] as Territory[]).map(territory => (
                <div key={territory}>
                  <p className="text-xs font-semibold text-black/40 uppercase tracking-wider mb-2">
                    {TERRITORY_CONFIG[territory].displayLabel}
                  </p>
                  <div className="space-y-1">
                    {DIMENSIONS.filter(d => d.territory === territory).map(dim => {
                      const isSelected = selectedDimensions.includes(dim.id)
                      const isDisabled = !isSelected && selectedDimensions.length >= 3
                      return (
                        <button
                          key={dim.id}
                          onClick={() => toggleDimension(dim.id)}
                          disabled={isDisabled}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                            isSelected
                              ? 'bg-black/5 text-black'
                              : isDisabled
                                ? 'text-black/20 cursor-not-allowed'
                                : 'text-black/60 hover:bg-black/[0.02] hover:text-black'
                          }`}
                        >
                          <div
                            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: isSelected ? TERRITORY_COLORS[territory] : 'rgba(0,0,0,0.1)' }}
                          />
                          <span className="text-sm">{dim.name}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={saveFocus}
                  disabled={selectedDimensions.length !== 3 || savingFocus}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedDimensions.length === 3
                      ? 'bg-black text-white hover:bg-black/90'
                      : 'bg-black/5 text-black/30 cursor-not-allowed'
                  }`}
                >
                  {savingFocus ? 'Saving...' : 'Save Focus'}
                </button>
                <button
                  onClick={() => setChangingFocus(false)}
                  className="text-sm text-black/40 hover:text-black/60"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-sm text-black/40">No focus dimensions set yet.</p>
              <button
                onClick={() => { setChangingFocus(true); setSelectedDimensions([]) }}
                className="mt-2 text-sm text-black/50 hover:text-black transition-colors"
              >
                Choose Focus
              </button>
            </div>
          )}
        </section>

        {/* Subscription Section */}
        <section className="bg-white rounded-2xl p-6 border border-black/5">
          <h2 className="text-sm font-semibold text-black/40 uppercase tracking-wider mb-4">Subscription</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-black">
                {profile.subscription_status === 'active' ? 'Active' : 'Inactive'}
              </p>
              <p className="text-xs text-black/40 mt-0.5">
                {profile.subscription_status === 'active'
                  ? 'CEO Lab Premium'
                  : 'No active subscription'}
              </p>
            </div>
            {profile.subscription_status === 'active' ? (
              <button
                onClick={openBillingPortal}
                disabled={portalLoading}
                className="px-4 py-2 rounded-lg text-sm font-medium border border-black/10 text-black/70 hover:text-black hover:border-black/20 transition-colors"
              >
                {portalLoading ? 'Loading...' : 'Manage Subscription'}
              </button>
            ) : (
              <a
                href="/api/checkout"
                className="px-4 py-2 rounded-lg text-sm font-medium bg-black text-white hover:bg-black/90 transition-colors"
              >
                Subscribe
              </a>
            )}
          </div>
        </section>

        {/* Account Section */}
        <section className="bg-white rounded-2xl p-6 border border-black/5">
          <h2 className="text-sm font-semibold text-black/40 uppercase tracking-wider mb-4">Account</h2>
          <button
            onClick={signOut}
            disabled={signingOut}
            className="px-4 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            {signingOut ? 'Signing out...' : 'Sign Out'}
          </button>
        </section>
      </div>
    </AppShell>
  )
}
