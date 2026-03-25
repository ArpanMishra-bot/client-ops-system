export default function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-gray-100 p-6 animate-pulse">
          <div className="flex justify-between">
            <div>
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
              <div className="h-8 w-16 bg-gray-200 rounded mt-2"></div>
              <div className="h-3 w-32 bg-gray-200 rounded mt-2"></div>
            </div>
            <div className="h-12 w-12 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      ))}
    </div>
  )
}
