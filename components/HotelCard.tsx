import type { Hotel } from '@/lib/types'

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating)
  const half = rating % 1 >= 0.5
  return (
    <span className="text-amber-400 text-sm">
      {'★'.repeat(full)}
      {half ? '½' : ''}
      <span className="text-gray-300">{'★'.repeat(5 - full - (half ? 1 : 0))}</span>
      <span className="text-gray-600 text-xs ml-1">{rating.toFixed(1)}</span>
    </span>
  )
}

interface Props {
  hotel: Hotel
  destination: string
}

export default function HotelCard({ hotel, destination }: Props) {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${hotel.name}, ${hotel.area}, ${destination}`
  )}`

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow flex flex-col gap-2">
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-semibold text-gray-900 text-sm leading-tight">{hotel.name}</h4>
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 text-blue-600 hover:text-blue-800 text-lg"
          title="View on map"
        >
          📍
        </a>
      </div>

      <StarRating rating={hotel.rating} />

      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500">📍 {hotel.area}</span>
        <span className="font-semibold text-green-700">{hotel.approx_price}</span>
      </div>

      <p className="text-xs text-gray-400 italic">
        * Hotel prices are AI-estimated approximations — verify on booking sites.
      </p>
    </div>
  )
}
