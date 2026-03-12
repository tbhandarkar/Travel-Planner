import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import type { SaveTripRequest } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = (await request.json()) as SaveTripRequest
    const { formData, generated } = body

    // 1. Insert trip record
    const { data: trip, error: tripError } = await supabase
      .from('trips')
      .insert({
        user_id: user.id,
        destination: formData.destination,
        days: formData.days,
        budget: formData.budget || null,
        interests: formData.interests,
      })
      .select()
      .single()

    if (tripError) throw tripError

    // 2. Insert itinerary items (flatten morning/afternoon/evening)
    const itineraryRows = generated.itinerary.flatMap((day) =>
      (['morning', 'afternoon', 'evening'] as const).map((slot) => ({
        trip_id: trip.id,
        day: day.day,
        time_of_day: slot,
        place_name: day[slot].place_name,
        description: day[slot].description,
        estimated_time: day[slot].estimated_time,
        latitude: day[slot].latitude ?? null,
        longitude: day[slot].longitude ?? null,
      }))
    )

    const { error: itinError } = await supabase
      .from('itinerary_items')
      .insert(itineraryRows)

    if (itinError) throw itinError

    // 3. Insert hotels
    const hotelRows = generated.hotels.map((h) => ({
      trip_id: trip.id,
      name: h.name,
      approx_price: h.approx_price,
      rating: h.rating,
      area: h.area,
    }))

    const { error: hotelError } = await supabase
      .from('hotels')
      .insert(hotelRows)

    if (hotelError) throw hotelError

    return NextResponse.json({ tripId: trip.id }, { status: 201 })
  } catch (error) {
    console.error('[save-trip]', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
