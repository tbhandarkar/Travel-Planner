// ─── Activity / Itinerary ───────────────────────────────────────────────────

export interface ActivityItem {
  place_name: string
  description: string
  estimated_time: string
  latitude?: number
  longitude?: number
}

export interface DayItinerary {
  day: number
  morning: ActivityItem
  afternoon: ActivityItem
  evening: ActivityItem
}

// ─── Hotels ─────────────────────────────────────────────────────────────────

export interface Hotel {
  name: string
  approx_price: string
  rating: number
  area: string
}

// ─── AI Response ─────────────────────────────────────────────────────────────

export interface GeneratedItinerary {
  itinerary: DayItinerary[]
  hotels: Hotel[]
}

// ─── Form ────────────────────────────────────────────────────────────────────

export const INTEREST_OPTIONS = [
  'Food & Dining',
  'Culture & History',
  'Nature & Outdoors',
  'Shopping',
  'Nightlife',
  'Art & Museums',
  'Adventure & Sports',
  'Relaxation & Wellness',
] as const

export type Interest = typeof INTEREST_OPTIONS[number]

export interface TripFormData {
  destination: string
  days: number
  budget: string
  interests: string[]
}

// ─── Database ─────────────────────────────────────────────────────────────────

export interface Trip {
  id: string
  user_id: string
  destination: string
  days: number
  budget: string | null
  interests: string[]
  created_at: string
}

export interface ItineraryItem {
  id: string
  trip_id: string
  day: number
  time_of_day: 'morning' | 'afternoon' | 'evening'
  place_name: string
  description: string
  estimated_time: string
  latitude: number | null
  longitude: number | null
}

export interface SavedHotel {
  id: string
  trip_id: string
  name: string
  approx_price: string
  rating: number
  area: string
}

export interface TripWithDetails extends Trip {
  itinerary_items: ItineraryItem[]
  hotels: SavedHotel[]
}

// ─── API ─────────────────────────────────────────────────────────────────────

export interface GenerateItineraryRequest {
  destination: string
  days: number
  budget: string
  interests: string[]
}

export interface SaveTripRequest {
  formData: TripFormData
  generated: GeneratedItinerary
}
