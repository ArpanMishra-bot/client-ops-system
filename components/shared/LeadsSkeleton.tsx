export default function LeadsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-40 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-56 bg-gray-200 rounded mt-1 animate-pulse"></div>
        </div>
        <div className="h-10 w-28 bg-gray-200 rounded-lg animate-pulse"></div>
      </div>

      {/* Stats Skeleton */}
      <div className="flex gap-1 text-sm">
        <div className="h-5 w-12 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
      </div>

      {/* Kanban Columns Skeleton */}
      <div className="hidden md:block">
        <div className="grid grid-cols-7 gap-4">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="bg-gray-50 rounded-xl p-3 animate-pulse">
              <div className="h-6 w-20 bg-gray-200 rounded mb-2"></div>
              <div className="space-y-2">
                {[...Array(2)].map((_, j) => (
                  <div key={j} className="bg-white rounded-lg p-3 border">
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    <div className="h-3 w-16 bg-gray-200 rounded mt-2"></div>
                    <div className="h-3 w-20 bg-gray-200 rounded mt-1"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Skeleton */}
      <div className="md:hidden space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border p-4 animate-pulse">
            <div className="flex justify-between">
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
              <div className="h-5 w-16 bg-gray-200 rounded-full"></div>
            </div>
            <div className="h-3 w-24 bg-gray-200 rounded mt-2"></div>
            <div className="h-3 w-20 bg-gray-200 rounded mt-1"></div>
          </div>
        ))}
      </div>
    </div>
  )
}
