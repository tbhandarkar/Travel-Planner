'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import DestinationForm from '@/components/DestinationForm'
import ItineraryCard from '@/components/ItineraryCard'
import HotelCard from '@/components/HotelCard'
import LoadingState from '@/components/LoadingState'
import type { GeneratedItinerary, TripFormData } from '@/lib/types'

// MapView uses Google Maps — load client-side only
const MapView = dynamic(() => import('@/components/MapView'), { ssr: false })

export default function HomePage() {
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [result, setResult] = useState<GeneratedItinerary | null>(null)
  const [formData, setFormData] = useState<TripFormData | null>(null)
  const [error, setError] = useState('')
  const [savedMessage, setSavedMessage] = useState('')

  const handleGenerate = async (data: TripFormData) => {
    setLoading(true)
    setError('')
    setResult(null)
    setSavedMessage('')
    setFormData(data)

    try {
      const res = await fetch('/api/generate-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Generation failed')
      setResult(json as GeneratedItinerary)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!result || !formData) return
    setSaving(true)
    setSavedMessage('')
    try {
      const res = await fetch('/api/save-trip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formData, generated: result }),
      })
      const json = await res.json()
      if (!res.ok) {
        if (res.status === 401) throw new Error('Sign in to save trips')
        throw new Error(json.error || 'Save failed')
      }
      setSavedMessage('Trip saved! View it in My Trips.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Hero */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          Plan your next adventure with AI
        </h1>
        <p className="text-gray-500 text-lg max-w-xl mx-auto">
          Enter a destination and get a personalised day-by-day itinerary, hotel suggestions, and an interactive map — in seconds.
        </p>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto">
        <DestinationForm onSubmit={handleGenerate} loading={loading} />
      </div>

      {/* Error */}
      {error && (
        <div className="max-w-2xl mx-auto bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Loading skeleton */}
      {loading && <LoadingState />}

      {/* Results */}
      {result && !loading && (
        <div className="space-y-10">
          {/* Save button */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h2 className="text-xl font-bold text-gray-900">
              Your itinerary for {formData?.destination}
            </h2>
            <div className="flex items-center gap-3">
              {savedMessage && (
                <span className="text-green-700 text-sm">{savedMessage}</span>
              )}
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              >
                {saving ? 'Saving…' : '💾 Save Trip'}
              </button>
            </div>
          </div>

          {/* Day cards */}
          <section>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Day-by-day plan</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {result.itinerary.map((day) => (
                <ItineraryCard
                  key={day.day}
                  day={day}
                  destination={formData?.destination ?? ''}
                />
              ))}
            </div>
          </section>

          {/* Hotels */}
          {result.hotels.length > 0 && (
            <section>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Hotel suggestions</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {result.hotels.map((hotel, idx) => (
                  <HotelCard
                    key={idx}
                    hotel={hotel}
                    destination={formData?.destination ?? ''}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Map */}
          <section>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Interactive map</h3>
            <MapView
              itinerary={result.itinerary}
              destination={formData?.destination ?? ''}
            />
          </section>
        </div>
      )}
    </div>
  )
}
