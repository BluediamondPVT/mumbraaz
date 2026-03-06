"use client";

import { useState, useEffect } from "react";
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
      
      {/* Images Loop with Fade Effect */}
      {images.map((img, index) => (
        <img
          key={index}
          src={img}
          alt={`${name} image ${index + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? "opacity-100 scale-105" : "opacity-0 scale-100"
          }`}
          style={{ transitionProperty: "opacity, transform" }}
        />
      ))}

      {/* Premium Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1c] via-[#0a0f1c]/50 to-transparent flex flex-col justify-end">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-10 md:pb-14 relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 tracking-tight drop-shadow-lg">
            {name}
          </h1>
          <p className="text-gray-200 text-lg md:text-xl flex items-center gap-2 font-medium">
            <MapPin className="w-6 h-6 text-[#e72b4c]" />
            {city}, {state}
          </p>
        </div>
      </div>

      {/* Navigation Arrows (Sirf tab dikhenge jab 1 se zyada images hon) */}
      {images.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white p-2.5 md:p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"
          >
            <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white p-2.5 md:p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"
          >
            <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
          </button>

          {/* Bottom Dots Indicator */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentIndex ? "w-8 h-2.5 bg-[#e72b4c]" : "w-2.5 h-2.5 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}