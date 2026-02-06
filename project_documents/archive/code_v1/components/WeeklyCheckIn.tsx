'use client'

import { useState } from 'react'
import { getQuestionBySubdimension } from '@/lib/weekly-questions'

interface WeeklyCheckInProps {
  focusDimensions: string[] // 3 dimensions user selected
  onComplete?: () => void
}

export default function WeeklyCheckIn({ focusDimensions, onComplete }: WeeklyCheckInProps) {
  const [responses, setResponses] = useState<Record<string, string | number>>({})
  const [saving, setSaving] = useState(false)

  const questions = focusDimensions
    .map(dim => getQuestionBySubdimension(dim))
    .filter(Boolean)

  const handleResponse = (subdimension: string, value: string | number) => {
    setResponses(prev => ({ ...prev, [subdimension]: value }))
  }

  const handleSubmit = async () => {
    if (Object.keys(responses).length !== 3) {
      alert('Please answer all 3 questions')
      return
    }

    setSaving(true)

    try {
      const response = await fetch('/api/checkin/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ responses })
      })

      if (response.ok) {
        alert('✅ Check-in saved! See you next week.')
        setResponses({}) // Clear form
        if (onComplete) onComplete()
      } else {
        const data = await response.json()
        alert('Failed to save: ' + data.error)
      }
    } catch (error) {
      console.error('Save error:', error)
      alert('Failed to save check-in')
    }

    setSaving(false)
  }

  if (questions.length === 0) {
    return (
      <div className="border-2 border-gray-200 rounded-lg p-6">
        <p className="text-gray-600">
          Please select your quarterly focus areas to start weekly check-ins.
        </p>
        <a
          href="/focus"
          className="inline-block mt-4 px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800"
        >
          Choose Focus Areas
        </a>
      </div>
    )
  }

  return (
    <div className="border-2 border-gray-200 rounded-lg p-6">
      <h3 className="text-2xl font-bold mb-4 text-gray-900">This Week's Check-in</h3>
      <p className="text-sm text-gray-600 mb-6">
        Answer these 3 questions to track your progress
      </p>

      <div className="space-y-6">
        {questions.map((q, index) => {
          if (!q) return null

          return (
            <div key={q.subdimension} className="border-b border-gray-200 pb-6 last:border-0">
              <label className="block mb-3">
                <span className="text-sm font-medium text-gray-700 block mb-1">
                  {index + 1}. {q.subdimension}
                </span>
                <span className="text-sm text-gray-900 block mb-3">
                  {q.question}
                </span>

                {q.inputType === 'number' && (
                  <input
                    type="number"
                    value={responses[q.subdimension] || ''}
                    onChange={(e) => handleResponse(q.subdimension, parseInt(e.target.value))}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-md focus:border-black focus:outline-none"
                    placeholder="Enter number"
                  />
                )}

                {q.inputType === 'select' && q.options && (
                  <select
                    value={responses[q.subdimension] || ''}
                    onChange={(e) => handleResponse(q.subdimension, e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-md focus:border-black focus:outline-none"
                  >
                    <option value="">Select an option...</option>
                    {q.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.text}
                      </option>
                    ))}
                  </select>
                )}

                {q.inputType === 'yesno' && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleResponse(q.subdimension, 'yes')}
                      className={`flex-1 px-4 py-2 border-2 rounded-md transition-all ${
                        responses[q.subdimension] === 'yes'
                          ? 'border-black bg-gray-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => handleResponse(q.subdimension, 'no')}
                      className={`flex-1 px-4 py-2 border-2 rounded-md transition-all ${
                        responses[q.subdimension] === 'no'
                          ? 'border-black bg-gray-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      No
                    </button>
                  </div>
                )}
              </label>
            </div>
          )
        })}
      </div>

      <button
        onClick={handleSubmit}
        disabled={Object.keys(responses).length !== 3 || saving}
        className="w-full mt-6 px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {saving ? 'Saving...' : 'Submit Check-in'}
      </button>
    </div>
  )
}
