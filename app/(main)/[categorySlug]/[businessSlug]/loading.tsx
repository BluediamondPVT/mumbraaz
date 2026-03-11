export default function BusinessDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 pb-16 animate-pulse">
      
      {/* 1. Slider Cover Skeleton */}
      <div className="w-full h-[350px] md:h-[450px] lg:h-[500px] bg-slate-800 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1c] to-transparent flex flex-col justify-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-10 md:pb-14">
            <div className="h-12 md:h-16 bg-slate-700/50 rounded-lg w-2/3 max-w-xl mb-4"></div>
            <div className="h-6 md:h-8 bg-slate-700/50 rounded-md w-64"></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content (Left Side) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* About Box Skeleton */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                <div className="h-8 bg-gray-200 rounded w-48"></div>
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-100 rounded w-full"></div>
                <div className="h-4 bg-gray-100 rounded w-full"></div>
                <div className="h-4 bg-gray-100 rounded w-5/6"></div>
                <div className="h-4 bg-gray-100 rounded w-4/6"></div>
              </div>
            </div>

            {/* Gallery Box Skeleton */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="aspect-square bg-gray-100 rounded-xl"></div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar (Right Side) */}
          <div className="space-y-6">
            
            {/* Action Buttons Box Skeleton */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="border-b border-gray-100 pb-6 mb-6 flex flex-col items-center">
                <div className="h-10 bg-gray-200 rounded w-24 mb-3"></div>
                <div className="h-4 bg-gray-100 rounded w-32"></div>
              </div>
              <div className="space-y-4">
                <div className="h-14 bg-gray-200 rounded-xl w-full"></div>
                <div className="h-14 bg-gray-200 rounded-xl w-full"></div>
              </div>
            </div>

            {/* Address Box Skeleton */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="h-7 bg-gray-200 rounded w-40 mb-6"></div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gray-200 rounded-lg shrink-0"></div>
                <div className="space-y-2 flex-1 pt-1">
                  <div className="h-4 bg-gray-100 rounded w-full"></div>
                  <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                </div>
              </div>
              <div className="h-12 bg-gray-100 rounded-xl w-full mt-6"></div>
            </div>

          </div>
        </div>

        {/* Related Businesses Slider Skeleton */}
        <div className="mt-16 pt-10 border-t border-gray-200">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
            <div className="h-8 bg-gray-200 rounded w-64"></div>
          </div>
          <div className="flex gap-6 overflow-hidden">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="min-w-[280px] md:min-w-[320px] bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="h-44 bg-gray-200"></div>
                <div className="p-5">
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}