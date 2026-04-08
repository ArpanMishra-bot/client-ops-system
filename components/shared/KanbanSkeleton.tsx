// components/shared/KanbanSkeleton.tsx
export default function KanbanSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Stats row skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          <div className="h-5 w-20 bg-gray-200 rounded" />
          <div className="h-5 w-20 bg-gray-200 rounded" />
        </div>
        <div className="h-8 w-24 bg-gray-200 rounded-lg" />
      </div>

      {/* Kanban columns skeleton */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="flex-shrink-0 w-72">
            <div className="bg-white rounded-xl border border-gray-100">
              <div className="p-3 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="h-5 w-16 bg-gray-200 rounded-full" />
                  <div className="h-4 w-8 bg-gray-200 rounded" />
                </div>
              </div>
              <div className="p-2 space-y-2">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="bg-white rounded-lg border border-gray-100 p-3 space-y-2">
                    <div className="h-4 w-32 bg-gray-200 rounded" />
                    <div className="h-3 w-24 bg-gray-200 rounded" />
                    <div className="h-3 w-20 bg-gray-200 rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
