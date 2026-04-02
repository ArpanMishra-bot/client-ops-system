// components/shared/StatsSkeleton.tsx
export default function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-gray-100 p-6 animate-pulse">
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <div className="h-3 w-20 bg-gray-200 rounded" />
              <div className="h-8 w-24 bg-gray-200 rounded" />
              <div className="h-3 w-28 bg-gray-200 rounded" />
            </div>
            <div className="w-10 h-10 rounded-xl bg-gray-200" />
          </div>
          <div className="mt-4">
            <div className="h-5 w-16 bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}
