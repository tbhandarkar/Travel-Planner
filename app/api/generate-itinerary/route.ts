import { NextRequest, NextResponse } from 'next/server'
import { generateItinerary } from '@/lib/openai'
import { enrichWithCoordinates } from '@/lib/geocoding'
import type { GenerateItineraryRequest } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as GenerateItineraryRequest

    const { destination, days, budget, interests } = body

    if (!destination || typeof destination !== 'string') {
      return NextResponse.json({ error: 'Destination is required' }, { status: 400 })
    }
    if (!days || typeof days !== 'number' || days < 1 || days > 14) {
      return NextResponse.json({ error: 'Days must be between 1 and 14' }, { status: 400 })
    }

    // Generate itinerary via OpenAI
    const generated = await generateItinerary({ destination, days, budget, interests })

    // Enrich each activity with lat/lng via Google Geocoding API
    const enrichedItinerary = await enrichWithCoordinates(generated.itinerary, destination)

    return NextResponse.json({ ...generated, itinerary: enrichedItinerary })
  } catch (error) {
    console.error('[generate-itinerary]', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
