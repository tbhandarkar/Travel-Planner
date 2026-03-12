import type { ActivityItem, DayItinerary } from './types'

interface GeocodeResult {
  lat: number
  lng: number
}

async function geocodePlace(
  placeName: string,
  city: string
): Promise<GeocodeResult | null> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  if (!apiKey) return null

  const query = encodeURIComponent(`${placeName}, ${city}`)
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=${apiKey}`

  try {
    const res = await fetch(url)
    const data = await res.json()

    if (data.status === 'OK' && data.results.length > 0) {
      const { lat, lng } = data.results[0].geometry.location
      return { lat, lng }
    }
    return null
  } catch {
    return null
  }
}

// Enriches all activities in the itinerary with coordinates (server-side only)
export async function enrichWithCoordinates(
  itinerary: DayItinerary[],
  city: string
): Promise<DayItinerary[]> {
  const enrichActivity = async (activity: ActivityItem): Promise<ActivityItem> => {
    const coords = await geocodePlace(activity.place_name, city)
    if (coords) {
      return { ...activity, latitude: coords.lat, longitude: coords.lng }
    }
    return activity
  }

  const enriched = await Promise.all(
    itinerary.map(async (day) => ({
      ...day,
      morning:   await enrichActivity(day.morning),
      afternoon: await enrichActivity(day.afternoon),
      evening:   await enrichActivity(day.evening),
    }))
  )

  return enriched
}
