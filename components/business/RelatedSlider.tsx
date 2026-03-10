"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, MapPin, Star, Store } from "lucide-react";

export default function RelatedSlider({ businesses, categorySlug }: { businesses: any[], categorySlug: string }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = direction === "left" ? -320 : 320;
      current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="mt-16 pt-10 border-t border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Store className="w-6 h-6 text-blue-600" />
        Similar Places You Might Like
      </h2>

      {/* Condition 1: Agar koi related business NAHI hai */}
      {businesses.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
            <Store className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">Koi Similar Business Nahi Mila</h3>
        </div>
      ) : (
        /* Condition 2: Agar businesses hain toh Slider dikhao */
        <div className="relative group">
          
          {/* Left Arrow */}
          <button 
            onClick={() => scroll("left")} 
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-200 text-gray-800 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-gray-50 hover:scale-110 hidden md:flex"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Scrollable Container (Hide Scrollbar using CSS class) */}
          <div 
            ref={scrollRef} 
            className="flex overflow-x-auto gap-6 snap-x snap-mandatory pb-6 pt-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} // Firefox/IE hide scrollbar
          >
            {/* Chrome/Safari scrollbar hide karne ka inline style hack */}
            <style jsx>{`
              div::-webkit-scrollbar { display: none; }
            `}</style>

            {businesses.map((biz) => (
              <Link 
                href={`/${categorySlug}/${biz.slug}`} 
                key={biz._id}
                className="min-w-[280px] md:min-w-[320px] snap-start group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 flex flex-col hover:-translate-y-1"
              >
                {/* Image Section */}
                <div className="h-44 relative overflow-hidden bg-gray-100">
                  <img 
                    src={biz.media?.thumbnail || "https://placehold.co/600x400/png"} 
                    alt={biz.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-bold text-yellow-600 shadow-sm flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    {biz.averageRating || "New"}
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {biz.name}
                    </h3>
                    <p className="text-gray-500 text-sm mt-2 flex items-center gap-1.5 font-medium">
                      <MapPin className="w-4 h-4 text-red-400 flex-shrink-0" />
                      <span className="line-clamp-1">{biz.location?.address}, {biz.location?.city}</span>
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Right Arrow */}
          <button 
            onClick={() => scroll("right")} 
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-200 text-gray-800 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-gray-50 hover:scale-110 hidden md:flex"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

        </div>
      )}
    </div>
  );
}