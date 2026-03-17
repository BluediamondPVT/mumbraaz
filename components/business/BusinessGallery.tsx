"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

interface BusinessGalleryProps {
  images: string[];
  businessName: string;
}

export default function BusinessGallery({ images, businessName }: BusinessGalleryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Background scroll lock jab modal open ho
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => { document.body.style.overflow = "auto"; };
  }, [isOpen]);

  if (!images || images.length === 0) {
    return (
      <div className="p-10 border-2 border-dashed border-gray-300 bg-gray-50 rounded-xl flex flex-col items-center justify-center text-gray-400">
        <svg className="w-12 h-12 mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="font-medium text-gray-500">Abhi koi images upload nahi ki gayi hain.</p>
      </div>
    );
  }

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  // Sirf pehli 6 images dikhani hain grid mein
  const displayImages = images.slice(0, 6);
  const hasMore = images.length > 6;

  return (
    <>
      {/* 1. GRID GALLERY */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {displayImages.map((imgUrl, index) => {
          const isLast = index === 5; // 6th image (0-indexed)
          
          return (
            <div 
              key={index} 
              onClick={() => openLightbox(index)}
              className="aspect-square rounded-xl overflow-hidden border border-gray-200 group relative bg-gray-100 cursor-pointer"
            >
              <Image 
                src={imgUrl} 
                alt={`${businessName} gallery image ${index + 1}`} 
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              
              {/* Hover Zoom Icon overlay (Sirf non-last images par ya agar 6 se kam images hain) */}
              {(!isLast || !hasMore) && (
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <ZoomIn className="text-white w-8 h-8 drop-shadow-md" />
                </div>
              )}

              {/* 🔥 SEE MORE OVERLAY (Sirf 6th image par aayega agar total images 6 se zyada hain) 🔥 */}
              {isLast && hasMore && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center transition-colors hover:bg-black/70">
                  <span className="text-white font-black text-2xl sm:text-3xl tracking-tight">
                    +{images.length - 5}
                  </span>
                  <span className="text-white/90 text-sm font-semibold mt-1">See More</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 2. FULLSCREEN LIGHTBOX MODAL */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center flex-col">
          
          {/* Top Bar controls */}
          <div className="absolute top-0 w-full p-4 flex justify-between items-center z-10 bg-gradient-to-b from-black/60 to-transparent">
            <span className="text-white/70 font-medium text-sm">
              {currentIndex + 1} / {images.length}
            </span>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Main Focused Image */}
          <div className="relative w-full max-w-5xl h-[70vh] md:h-[80vh] px-4 md:px-16 flex items-center justify-center">
            <div className="relative w-full h-full">
              <Image 
                src={images[currentIndex]} 
                alt={`${businessName} full image ${currentIndex + 1}`} 
                fill
                className="object-contain" // object-contain taaki image kate nahi
                priority
              />
            </div>
            
            {/* Arrows (Agar 1 se zyada image ho) */}
            {images.length > 1 && (
              <>
                <button 
                  onClick={prevImage}
                  className="absolute left-4 md:left-0 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/80 rounded-full text-white transition-all hover:scale-110"
                >
                  <ChevronLeft className="w-8 h-8 md:w-10 md:h-10" />
                </button>
                <button 
                  onClick={nextImage}
                  className="absolute right-4 md:right-0 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/80 rounded-full text-white transition-all hover:scale-110"
                >
                  <ChevronRight className="w-8 h-8 md:w-10 md:h-10" />
                </button>
              </>
            )}
          </div>
          
        </div>
      )}
    </>
  );
}