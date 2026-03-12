import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createServerSupabaseClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: trip, error: tripError } = await supabase
      .from('trips')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (tripError || !trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 })
    }

    const [{ data: itinerary_items }, { data: hotels }] = await Promise.all([
      supabase
        .from('itinerary_items')
        .select('*')
        .eq('trip_id', id)
        .order('day')
        .order('time_of_day'),
      supabase
        .from('hotels')
        .select('*')
        .eq('trip_id', id),
    ])

    return NextResponse.json({ trip: { ...trip, itinerary_items, hotels } })
  } catch (error) {
    console.error('[trip GET]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createServerSupabaseClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { error } = await supabase
      .from('trips')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[trip DELETE]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
