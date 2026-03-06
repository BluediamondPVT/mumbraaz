export default function Loading() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navbar placeholder */}
      <div className="h-16 bg-white border-b"></div>
      
      {/* Categories Loading Skeleton */}
      <div className="bg-white min-h-screen">
        <div className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Header skeleton */}
            <div className="flex justify-between items-center mb-12">
              <div>
                <div className="h-9 w-48 bg-gray-200 rounded mb-2 animate-pulse"></div>
                <div className="h-5 w-64 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>

            {/* Categories Grid skeleton */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 flex flex-col items-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-full mb-3 animate-pulse"></div>
                  <div className="h-5 w-20 bg-gray-200 rounded mb-2 animate-pulse"></div>
                  <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

