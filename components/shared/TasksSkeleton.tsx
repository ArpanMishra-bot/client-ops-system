export default function TasksSkeleton() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
      </div>

      <div>
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 w-32 bg-gray-200 rounded mt-1 animate-pulse"></div>
      </div>

      <div className="space-y-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border overflow-hidden animate-pulse">
            <div className="bg-gray-100 px-4 py-3 border-b">
              <div className="h-5 w-32 bg-gray-200 rounded"></div>
            </div>
            <div className="divide-y">
              {[...Array(2)].map((_, j) => (
                <div key={j} className="p-4">
                  <div className="flex justify-between">
                    <div>
                      <div className="h-4 w-48 bg-gray-200 rounded"></div>
                      <div className="h-3 w-32 bg-gray-200 rounded mt-2"></div>
                    </div>
                    <div className="h-3 w-20 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
