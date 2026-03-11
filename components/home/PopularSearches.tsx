"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Static mock data (Test karne ke liye teri /banner3.jpg use ki hai)
const popularSearches = [
  { title: "Real Estate Agents", img: "/popular-searches/realstate.webp", action: "Enquire Now", link: "/real-estate" },
  { title: "Banquet Halls", img: "/popular-searches/10035861.webp", action: "Enquire Now", link: "/banquet-halls" },
  { title: "Caterers", img: "/popular-searches/10083293.webp", action: "Enquire Now", link: "/caterers" },
  { title: "Pathology Labs", img: "/popular-searches/10356131.webp", action: "Explore", link: "/pathology" },
  { title: "Gynaecologist & Obstetrician Doctors", img: "/popular-searches/10551087.webp", action: "Explore", link: "/doctors" },
  { title: "Interior Designers", img: "/popular-searches/10156331.webp", action: "Enquire Now", link: "/interior-designers" },
];

export default function PopularSearches() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      // Ek baar me lagbhag ek card ki width jitna scroll hoga
      const scrollAmount = direction === "left" ? -320 : 320;
      current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
          Popular Searches
        </h2>
      </div>

      <div className="relative group">
        
        {/* Left Arrow (Hover pe dikhega) */}
        <button 
        aria-label="Previous Slide"
          onClick={() => scroll("left")} 
          className="absolute -left-5 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm border border-gray-200 text-gray-800 p-2.5 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-blue-50 hover:scale-110 hover:text-blue-600 hidden md:flex"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Scrollable Container (Smooth Snap Scrolling) */}
        <div 
          ref={scrollRef} 
          className="flex gap-5 overflow-x-auto pb-8 pt-4 px-2 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {popularSearches.map((item, index) => (
            <Link 
              key={index} 
              href={item.link}
              className="group/card flex-shrink-0 w-[260px] sm:w-[280px] flex flex-col snap-start rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white"
            >
              {/* Top: Image Section */}
              <div className="relative h-44 w-full overflow-hidden bg-gray-100">
                <Image 
                  src={item.img}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 260px, 280px"
                  className="object-cover transition-transform duration-700 group-hover/card:scale-110"
                />
                {/* Image ke upar halka sa dark gradient taaki premium lage */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Bottom: Blue Details Section */}
              <div className="flex-1 p-5 flex flex-col justify-between bg-gradient-to-br from-red-600 to-red-700 relative overflow-hidden">
                {/* Animated Background Glow on Hover */}
                <div className="absolute inset-0 bg-white opacity-0 group-hover/card:opacity-10 transition-opacity duration-500"></div>

                <h3 className="text-white font-bold text-[17px] leading-tight mb-4 relative z-10 line-clamp-2">
                  {item.title}
                </h3>
                
                <button className="relative z-10 self-start bg-white text-blue-700 font-bold text-sm px-5 py-2.5 rounded-lg shadow-sm group-hover/card:shadow-md transform group-hover/card:scale-105 transition-all duration-300">
                  {item.action}
                </button>
              </div>
            </Link>
          ))}
        </div>

        {/* Right Arrow (Hover pe dikhega) */}
        <button 
        aria-label="Next Slide"
          onClick={() => scroll("right")} 
          className="absolute -right-5 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm border border-gray-200 text-gray-800 p-2.5 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-blue-50 hover:scale-110 hover:text-blue-600 hidden md:flex"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

      </div>
    </section>
  );
}