// components/shared/TableSkeleton.tsx
export default function TableSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Search bar skeleton */}
      <div className="h-10 w-64 bg-gray-200 rounded-lg" />
      
      {/* Table skeleton */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="h-12 bg-gray-50 border-b border-gray-100" />
        <div className="divide-y divide-gray-50">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center px-6 py-4">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full" />
                  <div className="h-4 w-32 bg-gray-200 rounded" />
                </div>
              </div>
              <div className="flex-1">
                <div className="h-4 w-24 bg-gray-200 rounded" />
              </div>
              <div className="flex-1">
                <div className="h-4 w-40 bg-gray-200 rounded" />
              </div>
              <div className="flex-1">
                <div className="h-5 w-16 bg-gray-200 rounded-full" />
              </div>
              <div className="flex-1">
                <div className="h-4 w-12 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
