export default function LoadingState() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Itinerary skeleton */}
      <div>
        <div className="h-5 w-40 bg-gray-200 rounded mb-4" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl border border-gray-200 overflow-hidden">
              <div className="h-10 bg-blue-200" />
              <div className="p-5 space-y-3">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="rounded-xl bg-gray-100 h-20" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hotels skeleton */}
      <div>
        <div className="h-5 w-36 bg-gray-200 rounded mb-4" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-xl border border-gray-200 p-4 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
              <div className="h-3 bg-gray-100 rounded w-2/3" />
            </div>
          ))}
        </div>
      </div>

      <div className="text-center text-sm text-gray-400 pt-2">
        AI is crafting your personalised itinerary — this may take up to 30 seconds…
      </div>
    </div>
  )
}
