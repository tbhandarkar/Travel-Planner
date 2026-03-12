'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import ItineraryCard from '@/components/ItineraryCard'
import HotelCard from '@/components/HotelCard'
import type { TripWithDetails, DayItinerary, Hotel } from '@/lib/types'

const MapView = dynamic(() => import('@/components/MapView'), { ssr: false })

function buildDayItinerary(items: TripWithDetails['itinerary_items']): DayItinerary[] {
  const byDay: Record<number, DayItinerary> = {}

  items.forEach((item) => {
    if (!byDay[item.day]) {
      byDay[item.day] = {
        day: item.day,
        morning:   { place_name: '', description: '', estimated_time: '' },
        afternoon: { place_name: '', description: '', estimated_time: '' },
        evening:   { place_name: '', description: '', estimated_time: '' },
      }
    }
    byDay[item.day][item.time_of_day] = {
      place_name: item.place_name,
      description: item.description,
      estimated_time: item.estimated_time,
      latitude: item.latitude ?? undefined,
      longitude: item.longitude ?? undefined,
    }
  })

  return Object.values(byDay).sort((a, b) => a.day - b.day)
}

export default function TripDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [trip, setTrip] = useState<TripWithDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`/api/trips/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error)
        setTrip(data.trip)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10 animate-pulse space-y-6">
        <div className="h-8 w-48 bg-gray-200 rounded" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <div key={i} className="h-52 bg-gray-100 rounded-2xl" />)}
        </div>
      </div>
    )
  }

  if (error || !trip) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
          {error || 'Trip not found.'}
        </div>
        <button onClick={() => router.back()} className="mt-4 text-blue-600 hover:underline text-sm">
          ← Go back
        </button>
      </div>
    )
  }

  const itinerary = buildDayItinerary(trip.itinerary_items)
  const hotels: Hotel[] = trip.hotels.map((h) => ({
    name: h.name,
    approx_price: h.approx_price,
    rating: h.rating,
    area: h.area,
  }))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-gray-700 mb-2 inline-block">
            ← My Trips
          </button>
          <h1 className="text-3xl font-extrabold text-gray-900">{trip.destination}</h1>
          <p className="text-gray-500 mt-1">
            {trip.days} day{trip.days > 1 ? 's' : ''}
            {trip.budget ? ` · ${trip.budget}` : ''}
            {trip.interests?.length > 0 ? ` · ${trip.interests.join(', ')}` : ''}
          </p>
          <p className="text-gray-400 text-xs mt-1">
            Saved {new Date(trip.created_at).toLocaleDateString(undefined, {
              day: 'numeric', month: 'long', year: 'numeric',
            })}
          </p>
        </div>
      </div>

      {/* Itinerary */}
      <section>
        <h2 className="text-xl font-bold text-gray-700 mb-4">Day-by-day plan</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {itinerary.map((day) => (
            <ItineraryCard key={day.day} day={day} destination={trip.destination} />
          ))}
        </div>
      </section>

      {/* Hotels */}
      {hotels.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-gray-700 mb-4">Hotel suggestions</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {hotels.map((hotel, idx) => (
              <HotelCard key={idx} hotel={hotel} destination={trip.destination} />
            ))}
          </div>
        </section>
      )}

      {/* Map */}
      <section>
        <h2 className="text-xl font-bold text-gray-700 mb-4">Interactive map</h2>
        <MapView itinerary={itinerary} destination={trip.destination} />
      </section>
    </div>
  )
}
