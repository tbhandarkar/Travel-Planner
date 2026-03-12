'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { Trip } from '@/lib/types'

export default function TripList() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchTrips = async () => {
    try {
      const res = await fetch('/api/trips')
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setTrips(data.trips ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load trips')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchTrips() }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this trip? This cannot be undone.')) return
    setDeleting(id)
    try {
      const res = await fetch(`/api/trips/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      setTrips((prev) => prev.filter((t) => t.id !== id))
    } catch {
      alert('Failed to delete trip.')
    } finally {
      setDeleting(null)
    }
  }

  if (loading) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-36 bg-gray-100 rounded-2xl" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">{error}</div>
    )
  }

  if (trips.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500">
        <p className="text-4xl mb-3">🗺️</p>
        <p className="font-medium">No saved trips yet.</p>
        <Link href="/" className="text-blue-600 hover:underline text-sm mt-1 inline-block">
          Plan your first trip →
        </Link>
      </div>
    )
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {trips.map((trip) => (
        <div
          key={trip.id}
          className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between gap-2">
            <Link href={`/trips/${trip.id}`} className="hover:text-blue-600 transition-colors">
              <h3 className="font-bold text-gray-900">{trip.destination}</h3>
              <p className="text-gray-500 text-sm mt-0.5">
                {trip.days} day{trip.days > 1 ? 's' : ''}
                {trip.budget ? ` · ${trip.budget}` : ''}
              </p>
            </Link>
            <button
              onClick={() => handleDelete(trip.id)}
              disabled={deleting === trip.id}
              className="text-gray-400 hover:text-red-500 transition-colors text-xl leading-none"
              title="Delete trip"
            >
              {deleting === trip.id ? '…' : '×'}
            </button>
          </div>

          {trip.interests?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {trip.interests.slice(0, 3).map((i) => (
                <span key={i} className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                  {i}
                </span>
              ))}
              {trip.interests.length > 3 && (
                <span className="text-gray-400 text-xs">+{trip.interests.length - 3}</span>
              )}
            </div>
          )}

          <p className="text-gray-400 text-xs mt-3">
            {new Date(trip.created_at).toLocaleDateString(undefined, {
              day: 'numeric', month: 'short', year: 'numeric',
            })}
          </p>

          <Link
            href={`/trips/${trip.id}`}
            className="mt-3 block text-center text-sm text-blue-600 hover:text-blue-700 border border-blue-200 hover:border-blue-400 rounded-lg py-1.5 transition-colors"
          >
            View itinerary →
          </Link>
        </div>
      ))}
    </div>
  )
}
