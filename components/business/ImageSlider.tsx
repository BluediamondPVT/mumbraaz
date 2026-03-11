"use client";

import { useState, useEffect } from "react";
import Image from "next/image"; // 🔥 1. Fast loading ke liye Image import kiya
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";

interface ImageSliderProps {
  images: string[];
  name: string;
  city: string;
  state: string;
}

export default function ImageSlider({ images, name, city, state }: ImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide effect (har 4 second mein image change hogi)
  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative w-full h-[350px] md:h-[450px] lg:h-[500px] bg-slate-900 group overflow-hidden">
      
      {/* Images Loop with Premium Fade & Zoom Effect */}
      {images.map((img, index) => (
        <div 
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <Image
            src={img}
            alt={`${name} cover image ${index + 1}`}
            fill
            priority={index === 0} // 🔥 2. Sabse pehli image instantly load hogi LCP 100 ke liye
            sizes="100vw"
            className={`object-cover transition-transform duration-[5000ms] ease-out ${
              index === currentIndex ? "scale-105" : "scale-100"
            }`}
          />
        </div>
      ))}

      {/* Premium Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1c] via-[#0a0f1c]/40 to-transparent flex flex-col justify-end z-20 pointer-events-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-10 md:pb-14 relative pointer-events-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 tracking-tight drop-shadow-lg">
            {name}
          </h1>
          <p className="text-gray-200 text-lg md:text-xl flex items-center gap-2 font-medium drop-shadow-md">
            <MapPin className="w-6 h-6 text-[#e72b4c]" />
            {city}, {state}
          </p>
        </div>
      </div>

      {/* Navigation Arrows (Sirf tab dikhenge jab 1 se zyada images hon) */}
      {images.length > 1 && (
        <div className="z-30 relative w-full h-full pointer-events-none">
          <button
            onClick={prevSlide}
            aria-label="Previous image" // 🔥 3. Accessibility (Screen readers ke liye)
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white p-2.5 md:p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg pointer-events-auto"
          >
            <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
          </button>
          
          <button
            onClick={nextSlide}
            aria-label="Next image"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white p-2.5 md:p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg pointer-events-auto"
          >
            <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
          </button>

          {/* Bottom Dots Indicator */}
          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 pointer-events-auto">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`transition-all duration-300 rounded-full shadow-sm ${
                  index === currentIndex ? "w-8 h-2.5 bg-[#e72b4c]" : "w-2.5 h-2.5 bg-white/50 hover:bg-white/90"
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}