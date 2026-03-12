'use client'

import { useState } from 'react'
import { INTEREST_OPTIONS, type TripFormData } from '@/lib/types'

interface Props {
  onSubmit: (data: TripFormData) => void
  loading: boolean
}

export default function DestinationForm({ onSubmit, loading }: Props) {
  const [destination, setDestination] = useState('')
  const [days, setDays] = useState(3)
  const [budget, setBudget] = useState('')
  const [interests, setInterests] = useState<string[]>([])

  const toggleInterest = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!destination.trim()) return
    onSubmit({ destination: destination.trim(), days, budget, interests })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6">
      {/* Destination */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Destination <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          required
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="e.g. Tokyo, Bali, Paris"
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>

      {/* Days + Budget row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Number of days
          </label>
          <input
            type="number"
            min={1}
            max={14}
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Daily budget <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            type="text"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="e.g. $100/day, budget"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
      </div>

      {/* Interests */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Interests <span className="text-gray-400 font-normal">(select all that apply)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {INTEREST_OPTIONS.map((interest) => {
            const selected = interests.includes(interest)
            return (
              <button
                key={interest}
                type="button"
                onClick={() => toggleInterest(interest)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  selected
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
                }`}
              >
                {interest}
              </button>
            )
          })}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !destination.trim()}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Generating itinerary…
          </span>
        ) : (
          'Generate Itinerary'
        )}
      </button>
    </form>
  )
}
