'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { AppShell } from '@/components/layout/AppShell'
import { createClient } from '@/lib/supabase-browser'

type Profile = {
  full_name: string
  email: string
  avatar_url: string | null
  subscription_status: string
}

export default function SettingsPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [editingName, setEditingName] = useState(false)
  const [nameValue, setNameValue] = useState('')
  const [savingName, setSavingName] = useState(false)
  const [portalLoading, setPortalLoading] = useState(false)
  const [signingOut, setSigningOut] = useState(false)

  const loadData = useCallback(async () => {
    try {
      const profileRes = await fetch('/api/v4/profile')
      const profileData = await profileRes.json()

      if (!profileRes.ok) {
        router.push('/auth')
        return
      }

      setProfile(profileData.profile)
      setNameValue(profileData.profile.full_name)
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
        <section className="bg-white rounded-lg p-6 border border-black/5">
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

        {/* Subscription Section */}
        <section className="bg-white rounded-lg p-6 border border-black/5">
          <h2 className="text-sm font-semibold text-black/40 uppercase tracking-wider mb-4">Subscription</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-black">
                {profile.subscription_status === 'active' || profile.subscription_status === 'trialing' ? 'Active' : 'Inactive'}
              </p>
              <p className="text-xs text-black/40 mt-0.5">
                {profile.subscription_status === 'active' || profile.subscription_status === 'trialing'
                  ? 'CEO Lab Premium'
                  : 'No active subscription'}
              </p>
            </div>
            {profile.subscription_status === 'active' || profile.subscription_status === 'trialing' ? (
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
        <section className="bg-white rounded-lg p-6 border border-black/5">
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
