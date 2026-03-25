export default function ClientsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-48 bg-gray-200 rounded mt-1 animate-pulse"></div>
        </div>
        <div className="h-10 w-28 bg-gray-200 rounded-lg animate-pulse"></div>
      </div>

      {/* Desktop Skeleton */}
      <div className="hidden md:block bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-100 border-b"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center px-6 py-4 border-b">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div className="h-4 w-32 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div className="flex-1">
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
              </div>
              <div className="flex-1">
                <div className="h-4 w-40 bg-gray-200 rounded"></div>
              </div>
              <div className="flex-1">
                <div className="h-5 w-16 bg-gray-200 rounded-full"></div>
              </div>
              <div className="flex-1">
                <div className="h-4 w-12 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Skeleton */}
      <div className="md:hidden space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 animate-pulse">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
                <div className="h-3 w-48 bg-gray-200 rounded mt-1"></div>
              </div>
              <div className="h-5 w-16 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
