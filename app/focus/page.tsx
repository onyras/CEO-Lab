'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'

const SUB_DIMENSIONS = {
  yourself: [
    'Energy Management',
    'Self-Awareness',
    'Above the Line',
    'Emotional Fluidity',
    'Contemplative Practice',
    'Stress Design'
  ],
  teams: [
    'Trust Formula',
    'Psychological Safety',
    'Multiplier Behavior',
    'Communication Rhythm',
    'Team Health',
    'Accountability & Delegation'
  ],
  organizations: [
    'Strategic Clarity',
    'Culture as System',
    'Three Transitions',
    'Systems Thinking',
    'Organizational Design',
    'Board & Governance'
  ]
}

export default function QuarterlyFocus() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [selectedDimensions, setSelectedDimensions] = useState<string[]>([])
  const [currentQuarter, setCurrentQuarter] = useState<1 | 2 | 3 | 4>(1)

  useEffect(() => {
    loadCurrentFocus()
  }, [])

  const loadCurrentFocus = async () => {
    // TODO: Load existing focus from database
    // For now, determine current quarter
    const month = new Date().getMonth() + 1
    const quarter = Math.ceil(month / 3) as 1 | 2 | 3 | 4
    setCurrentQuarter(quarter)
    setLoading(false)
  }

  const toggleDimension = (dimension: string) => {
    if (selectedDimensions.includes(dimension)) {
      setSelectedDimensions(selectedDimensions.filter(d => d !== dimension))
    } else if (selectedDimensions.length < 3) {
      setSelectedDimensions([...selectedDimensions, dimension])
    }
  }

  const handleSave = async () => {
    if (selectedDimensions.length !== 3) {
      alert('Please select exactly 3 focus areas')
      return
    }

    try {
      const response = await fetch('/api/focus/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quarter: currentQuarter,
          year: 2026,
          dimensions: selectedDimensions
        })
      })

      if (response.ok) {
        router.push('/dashboard')
      } else {
        const data = await response.json()
        alert('Failed to save: ' + data.error)
      }
    } catch (error) {
      console.error('Save error:', error)
      alert('Failed to save focus areas')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Quarterly Focus</h1>
          <p className="text-gray-600 mt-2">
            Choose 3 leadership dimensions to focus on for Q{currentQuarter} 2026
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Instructions */}
        <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6 mb-8">
          <h2 className="font-bold text-gray-900 mb-2">How it works:</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• Select 3 dimensions you want to improve this quarter</li>
            <li>• You'll answer 1 question per dimension every week (3 questions total)</li>
            <li>• Same questions for 12 weeks to build clear trend data</li>
            <li>• At the end of the quarter, review your progress and choose new focus areas</li>
          </ul>
        </div>

        {/* Selection Counter */}
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700">
            Selected: {selectedDimensions.length} / 3
          </p>
        </div>

        {/* Dimension Selection */}
        <div className="space-y-8 mb-8">
          {/* Leading Yourself */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Leading Yourself</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {SUB_DIMENSIONS.yourself.map((dimension) => (
                <button
                  key={dimension}
                  onClick={() => toggleDimension(dimension)}
                  disabled={selectedDimensions.length === 3 && !selectedDimensions.includes(dimension)}
                  className={`text-left px-6 py-4 rounded-lg border-2 transition-all ${
                    selectedDimensions.includes(dimension)
                      ? 'border-black bg-gray-50'
                      : 'border-gray-200 hover:border-gray-300'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{dimension}</span>
                    <span className="text-xs text-gray-500">Your score will appear here</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Leading Teams */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Leading Teams</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {SUB_DIMENSIONS.teams.map((dimension) => (
                <button
                  key={dimension}
                  onClick={() => toggleDimension(dimension)}
                  disabled={selectedDimensions.length === 3 && !selectedDimensions.includes(dimension)}
                  className={`text-left px-6 py-4 rounded-lg border-2 transition-all ${
                    selectedDimensions.includes(dimension)
                      ? 'border-black bg-gray-50'
                      : 'border-gray-200 hover:border-gray-300'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <span className="font-medium text-gray-900">{dimension}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Leading Organizations */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Leading Organizations</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {SUB_DIMENSIONS.organizations.map((dimension) => (
                <button
                  key={dimension}
                  onClick={() => toggleDimension(dimension)}
                  disabled={selectedDimensions.length === 3 && !selectedDimensions.includes(dimension)}
                  className={`text-left px-6 py-4 rounded-lg border-2 transition-all ${
                    selectedDimensions.includes(dimension)
                      ? 'border-black bg-gray-50'
                      : 'border-gray-200 hover:border-gray-300'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <span className="font-medium text-gray-900">{dimension}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-center">
          <button
            onClick={handleSave}
            disabled={selectedDimensions.length !== 3}
            className="px-8 py-3 bg-black text-white rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Focus Areas
          </button>
        </div>
      </main>
    </div>
  )
}
