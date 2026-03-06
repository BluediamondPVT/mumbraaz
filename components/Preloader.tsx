"use client";

import { useState, useEffect } from "react";

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [isRevealing, setIsRevealing] = useState(false);

  // Define the number of "stairs" (columns) for the dramatic reveal
  const columns = 5;

  useEffect(() => {
    const triggerReveal = () => {
      // Step 1: Trigger the staircase exit animation
      setIsRevealing(true);

      // Step 2: Unmount the component entirely after animations finish
      // 300ms (fade) + 700ms (slide) + (4 * 100ms delay) = ~1400ms total
      setTimeout(() => setIsLoading(false), 1500);
    };

    if (document.readyState === "complete") {
      triggerReveal();
    } else {
      window.addEventListener("load", triggerReveal);
    }

    // Fallback: trigger reveal after 2.5 seconds anyway
    const timer = setTimeout(() => {
      triggerReveal();
    }, 2500);

    return () => {
      window.removeEventListener("load", triggerReveal);
      clearTimeout(timer);
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none w-screen h-screen flex">
      {/* The "Stairs" Background
        Creates 5 vertical columns that slide up sequentially
      */}
      {Array.from({ length: columns }).map((_, i) => (
        <div
          key={i}
          className={`h-full flex-1 bg-zinc-950 transition-transform duration-[800ms] ease-[cubic-bezier(0.76,0,0.24,1)] ${
            isRevealing ? "-translate-y-full" : "translate-y-0"
          }`}
          style={{ transitionDelay: `${i * 100}ms` }}
        />
      ))}

      {/* Center Content (Logo & Geometric Loader)
        Fades out before the stairs open
      */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center gap-8 transition-opacity duration-300 ease-in-out ${
          isRevealing ? "opacity-0" : "opacity-100"
        }`}
      >
        {/* Geometric Staircase Loader Indicator */}
        <div className="flex items-end gap-2 h-12">
          <div className="w-3 bg-white animate-[bounce_1s_infinite_0ms]"></div>
          <div className="w-3 bg-white animate-[bounce_1s_infinite_100ms] h-3/4"></div>
          <div className="w-3 bg-white animate-[bounce_1s_infinite_200ms] h-2/4"></div>
          <div className="w-3 bg-white animate-[bounce_1s_infinite_300ms] h-1/4"></div>
        </div>

        {/* Logo Text */}
        <div className="overflow-hidden">
          <h1 className="text-4xl font-extrabold text-white tracking-[0.2em] uppercase relative">
            Mumbra <span className="text-zinc-500 font-light">BiZ</span>
            {/* Subtle light sweep effect over the text */}
            <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></span>
          </h1>
        </div>
      </div>
    </div>
  );
}