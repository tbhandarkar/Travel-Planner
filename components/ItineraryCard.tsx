import type { DayItinerary, ActivityItem } from '@/lib/types'

const TIME_LABELS: Record<'morning' | 'afternoon' | 'evening', { label: string; color: string; bg: string }> = {
  morning:   { label: 'Morning',   color: 'text-amber-700',  bg: 'bg-amber-50 border-amber-200' },
  afternoon: { label: 'Afternoon', color: 'text-blue-700',   bg: 'bg-blue-50 border-blue-200'  },
  evening:   { label: 'Evening',   color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200' },
}

function ActivityBlock({
  slot,
  activity,
  destination,
}: {
  slot: 'morning' | 'afternoon' | 'evening'
  activity: ActivityItem
  destination: string
}) {
  const meta = TIME_LABELS[slot]
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${activity.place_name}, ${destination}`
  )}`

  return (
    <div className={`border rounded-xl p-4 ${meta.bg}`}>
      <span className={`text-xs font-semibold uppercase tracking-wide ${meta.color}`}>
        {meta.label}
      </span>
      <div className="mt-1 flex items-start justify-between gap-2">
        <div>
          <h4 className="font-semibold text-gray-900 text-sm">{activity.place_name}</h4>
          <p className="text-gray-600 text-sm mt-0.5">{activity.description}</p>
          <p className="text-gray-400 text-xs mt-1">⏱ {activity.estimated_time}</p>
        </div>
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="Open in Google Maps"
          className="shrink-0 text-blue-600 hover:text-blue-800 text-lg"
        >
          📍
        </a>
      </div>
    </div>
  )
}

interface Props {
  day: DayItinerary
  destination: string
}

export default function ItineraryCard({ day, destination }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-3">
        <h3 className="text-white font-bold text-base">Day {day.day}</h3>
      </div>
      <div className="p-5 space-y-3">
        <ActivityBlock slot="morning"   activity={day.morning}   destination={destination} />
        <ActivityBlock slot="afternoon" activity={day.afternoon} destination={destination} />
        <ActivityBlock slot="evening"   activity={day.evening}   destination={destination} />
      </div>
    </div>
  )
}
