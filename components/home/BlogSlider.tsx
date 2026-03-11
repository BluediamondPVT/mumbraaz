"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight, Calendar, Clock } from "lucide-react";

// Mock Data Blogs ke liye
const blogs = [
  { 
    id: 1, 
    title: "10 Best Cafes in Thane for a Perfect Weekend Vibes", 
    category: "Food & Dining", 
    date: "Mar 10, 2026", 
    readTime: "5 min read", 
    img: "/blog/sahil-hotel.jpg", 
    slug: "/blog/best-cafes" 
  },
  { 
    id: 2, 
    title: "How to Choose the Right Banquet Hall for Your Wedding", 
    category: "Weddings", 
    date: "Mar 8, 2026", 
    readTime: "8 min read", 
    img: "/blog/wedding.jpg", 
    slug: "/blog/wedding-halls" 
  },
  { 
    id: 3, 
    title: "Top 5 Emerging Real Estate Projects in Mumbra", 
    category: "Real Estate", 
    date: "Mar 5, 2026", 
    readTime: "6 min read", 
    img: "/blog/real-state.webp", 
    slug: "/blog/real-estate" 
  },
  { 
    id: 4, 
    title: "Essential Maintenance Tips for Your Car This Monsoon", 
    category: "Automotive", 
    date: "Mar 1, 2026", 
    readTime: "4 min read", 
    img: "/blog/automotive.jpg", 
    slug: "/blog/car-maintenance" 
  },
  { 
    id: 5, 
    title: "The Ultimate Guide to Interior Design on a Budget", 
    category: "Home Decor", 
    date: "Feb 25, 2026", 
    readTime: "7 min read", 
    img: "/blog/home-decore.jpg", 
    slug: "/blog/interior-design" 
  },
];

export default function BlogSlider() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      // Blog cards thode chaude hain, isliye scroll amount zyada rakha hai
      const scrollAmount = direction === "left" ? -360 : 360;
      current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      
      {/* Section Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
            Latest Articles & News
          </h2>
          <p className="text-gray-500 text-sm md:text-base">
            Stay updated with local trends, tips, and guides.
          </p>
        </div>
        <Link 
          href="/blogs" 
          className="hidden sm:flex items-center gap-1 text-blue-600 font-semibold hover:text-blue-800 transition-colors"
        >
          View All <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Slider Area */}
      <div className="relative group">
        
        {/* Left Arrow */}
        <button 
          onClick={() => scroll("left")} 
          className="absolute -left-5 top-[40%] -translate-y-1/2 z-20 bg-white border border-gray-100 text-gray-600 p-3 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.1)] opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-gray-50 hover:scale-110 hover:text-blue-600 hidden md:flex"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Scrollable Container */}
        <div 
          ref={scrollRef} 
          className="flex gap-6 overflow-x-auto pb-8 pt-2 px-2 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {blogs.map((blog) => (
            <Link 
              key={blog.id} 
              href={blog.slug}
              // 🔥 NEW ANIMATION: Halka sa scale up aur soft glow shadow
              className="group/blog flex-shrink-0 w-[300px] sm:w-[340px] flex flex-col snap-start rounded-b-sm bg-white border border-gray-100 hover:border-blue-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500"
            >
              {/* Blog Image */}
              <div className="relative w-full aspect-[16/10] overflow-hidden rounded-t-3xl bg-gray-100">
                <Image 
                  src={blog.img}
                  alt={blog.title}
                  fill
                  sizes="(max-width: 768px) 300px, 340px"
                  // 🔥 NEW ANIMATION: Halka sa grayscale se pure color me aayega
                  className="object-cover grayscale-[10%] group-hover/blog:grayscale-0 group-hover/blog:scale-105 transition-all duration-700"
                />
                
                {/* Category Badge Over Image */}
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-blue-700 shadow-sm">
                  {blog.category}
                </div>
              </div>

              {/* Blog Content */}
              <div className="p-6 flex-1 flex flex-col">
                
                {/* Meta Data (Date & Time) */}
                <div className="flex items-center gap-4 text-[11px] sm:text-xs font-medium text-gray-500 mb-3">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    {blog.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    {blog.readTime}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-snug mb-4 group-hover/blog:text-blue-600 transition-colors line-clamp-2">
                  {blog.title}
                </h3>

                {/* Bottom Read Article Link */}
                <div className="mt-auto pt-4 border-t border-gray-50 flex items-center text-sm font-bold text-blue-600">
                  Read Article 
                  {/* 🔥 NEW ANIMATION: Arrow aage slide hoga */}
                  <ArrowRight className="w-4 h-4 ml-2 transform group-hover/blog:translate-x-1.5 transition-transform duration-300" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Right Arrow */}
        <button 
          onClick={() => scroll("right")} 
          className="absolute -right-5 top-[40%] -translate-y-1/2 z-20 bg-white border border-gray-100 text-gray-600 p-3 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.1)] opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-gray-50 hover:scale-110 hover:text-blue-600 hidden md:flex"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

      </div>
    </section>
  );
}