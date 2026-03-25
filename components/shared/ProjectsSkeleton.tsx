export default function ProjectsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-48 bg-gray-200 rounded mt-1 animate-pulse"></div>
        </div>
        <div className="h-10 w-28 bg-gray-200 rounded-lg animate-pulse"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 animate-pulse">
            <div className="flex justify-between">
              <div className="flex-1">
                <div className="h-5 w-32 bg-gray-200 rounded"></div>
                <div className="h-3 w-24 bg-gray-200 rounded mt-2"></div>
              </div>
              <div className="h-5 w-16 bg-gray-200 rounded-full"></div>
            </div>
            <div className="h-3 w-full bg-gray-200 rounded mt-3"></div>
            <div className="mt-4">
              <div className="flex justify-between mb-1">
                <div className="h-3 w-16 bg-gray-200 rounded"></div>
                <div className="h-3 w-8 bg-gray-200 rounded"></div>
              </div>
              <div className="h-1.5 w-full bg-gray-200 rounded"></div>
              <div className="h-3 w-24 bg-gray-200 rounded mt-2"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
