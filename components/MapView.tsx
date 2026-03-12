'use client'

import { useCallback, useState } from 'react'
import { GoogleMap, MarkerF, InfoWindowF, useJsApiLoader } from '@react-google-maps/api'
import type { DayItinerary, ActivityItem } from '@/lib/types'

interface MarkerData {
  id: string
  position: { lat: number; lng: number }
  title: string
  description: string
  slot: string
  day: number
}

const SLOT_COLORS: Record<string, string> = {
  morning: '#F59E0B',
  afternoon: '#3B82F6',
  evening: '#8B5CF6',
}

const MAP_CONTAINER_STYLE = { width: '100%', height: '480px' }

function buildMarkers(itinerary: DayItinerary[]): MarkerData[] {
  const markers: MarkerData[] = []

  itinerary.forEach((day) => {
    (['morning', 'afternoon', 'evening'] as const).forEach((slot) => {
      const activity: ActivityItem = day[slot]
      if (activity.latitude && activity.longitude) {
        markers.push({
          id: `${day.day}-${slot}`,
          position: { lat: activity.latitude, lng: activity.longitude },
          title: activity.place_name,
          description: activity.description,
          slot,
          day: day.day,
        })
      }
    })
  })

  return markers
}

function computeCenter(markers: MarkerData[]): { lat: number; lng: number } {
  if (markers.length === 0) return { lat: 0, lng: 0 }
  const lat = markers.reduce((s, m) => s + m.position.lat, 0) / markers.length
  const lng = markers.reduce((s, m) => s + m.position.lng, 0) / markers.length
  return { lat, lng }
}

interface Props {
  itinerary: DayItinerary[]
  destination: string
}

export default function MapView({ itinerary, destination }: Props) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''
  const { isLoaded, loadError } = useJsApiLoader({ googleMapsApiKey: apiKey })
  const [selected, setSelected] = useState<MarkerData | null>(null)

  const markers = buildMarkers(itinerary)
  const center = computeCenter(markers)

  const onLoad = useCallback((map: google.maps.Map) => {
    if (markers.length === 0) return
    const bounds = new window.google.maps.LatLngBounds()
    markers.forEach((m) => bounds.extend(m.position))
    map.fitBounds(bounds, 60)
  }, [markers]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!apiKey) {
    return (
      <div className="bg-gray-100 rounded-2xl flex items-center justify-center h-48 text-gray-500 text-sm">
        Google Maps API key not configured — add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to .env.local
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl flex items-center justify-center h-48 text-red-600 text-sm p-4">
        Failed to load Google Maps: {loadError.message}
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div className="bg-gray-100 rounded-2xl flex items-center justify-center h-48 text-gray-500 text-sm animate-pulse">
        Loading map…
      </div>
    )
  }

  if (markers.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-2xl flex items-center justify-center h-48 text-gray-500 text-sm">
        No geocoded locations available for {destination}
      </div>
    )
  }

  return (
    <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
      {/* Legend */}
      <div className="bg-white px-4 py-2 flex items-center gap-4 text-xs text-gray-600 border-b border-gray-100">
        {(['morning', 'afternoon', 'evening'] as const).map((slot) => (
          <span key={slot} className="flex items-center gap-1">
            <span
              className="inline-block w-3 h-3 rounded-full"
              style={{ backgroundColor: SLOT_COLORS[slot] }}
            />
            {slot.charAt(0).toUpperCase() + slot.slice(1)}
          </span>
        ))}
      </div>

      <GoogleMap
        mapContainerStyle={MAP_CONTAINER_STYLE}
        center={center}
        zoom={12}
        onLoad={onLoad}
        options={{ streetViewControl: false, mapTypeControl: false }}
      >
        {markers.map((marker) => (
          <MarkerF
            key={marker.id}
            position={marker.position}
            title={marker.title}
            onClick={() => setSelected(marker)}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: SLOT_COLORS[marker.slot],
              fillOpacity: 1,
              strokeColor: '#fff',
              strokeWeight: 2,
            }}
          />
        ))}

        {selected && (
          <InfoWindowF
            position={selected.position}
            onCloseClick={() => setSelected(null)}
          >
            <div className="max-w-[200px]">
              <p className="text-xs font-bold text-gray-500 uppercase">Day {selected.day} · {selected.slot}</p>
              <p className="font-semibold text-gray-900 text-sm mt-0.5">{selected.title}</p>
              <p className="text-gray-600 text-xs mt-1">{selected.description}</p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selected.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 text-xs mt-2 inline-block hover:underline"
              >
                Open in Google Maps →
              </a>
            </div>
          </InfoWindowF>
        )}
      </GoogleMap>
    </div>
  )
}
