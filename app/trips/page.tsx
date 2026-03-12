import TripList from '@/components/TripList'

export const metadata = { title: 'My Trips — AI Travel Planner' }

export default function TripsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">My Trips</h1>
        <p className="text-gray-500 mt-1">All your saved itineraries in one place.</p>
      </div>
      <TripList />
    </div>
  )
}
