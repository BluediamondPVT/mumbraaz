import { MapPin, LayoutGrid } from "lucide-react";

export default function CategoryLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 pb-16 animate-pulse">
      
      {/* Header Skeleton */}
      <div className="bg-[#0a2342] py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="h-10 md:h-12 bg-slate-700/50 rounded-lg w-3/4 max-w-md mb-4"></div>
          <div className="h-5 bg-slate-700/50 rounded-md w-48"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* LEFT SIDEBAR SKELETON */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-5 h-5 bg-gray-200 rounded"></div>
                <div className="h-6 bg-gray-200 rounded w-32"></div>
              </div>
              <div className="space-y-3 mb-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-9 bg-gray-100 rounded-lg w-full"></div>
                ))}
              </div>
              <div className="h-px bg-gray-100 w-full mb-8"></div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-5 h-5 bg-gray-200 rounded"></div>
                <div className="h-6 bg-gray-200 rounded w-28"></div>
              </div>
              <div className="space-y-4 px-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex gap-3 items-center">
                    <div className="w-4 h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT CONTENT SKELETON (Horizontal Cards) */}
          <div className="lg:col-span-3 space-y-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row overflow-hidden">
                <div className="sm:w-64 md:w-72 h-56 sm:h-auto bg-gray-200 shrink-0"></div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="h-7 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-100 rounded w-full"></div>
                      <div className="h-4 bg-gray-100 rounded w-5/6"></div>
                    </div>
                  </div>
                  <div className="mt-6 pt-5 border-t border-gray-50 flex gap-3">
                    <div className="h-11 bg-gray-100 rounded-xl flex-1"></div>
                    <div className="h-11 bg-gray-100 rounded-xl w-32"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}