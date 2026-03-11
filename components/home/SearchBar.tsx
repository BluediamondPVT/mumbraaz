"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image"; // 🔥 1. Next.js Image import kiya
import { Search, MapPin, Loader2, LayoutGrid, Store, X } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SearchBar() {
  const [location, setLocation] = useState("");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({ categories: [], businesses: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Jab user bahar click kare toh dropdown band ho jaye
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // API Call logic (Debouncing)
  useEffect(() => {
    const fetchResults = async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/search?q=${query}&location=${location}`);
        const data = await res.json();
        setResults(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearching(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      if (showDropdown) {
        fetchResults();
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query, location, showDropdown]);

  // 🔥 2. Actual Search Navigation 🔥
  const handleSearchSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (query || location) {
      setShowDropdown(false);
      // Actual search page pe push kar rahe hain query params ke sath
      const searchParams = new URLSearchParams();
      if (query) searchParams.append("q", query);
      if (location) searchParams.append("location", location);
      router.push(`/search?${searchParams.toString()}`);
    }
  };

  return (
    <div className="relative max-w-4xl mx-auto z-50 w-full" ref={dropdownRef}>
      
      {/* Search Input Box */}
      <form 
        onSubmit={handleSearchSubmit} 
        className="p-2 md:p-2.5 rounded-2xl flex flex-col sm:flex-row items-stretch shadow-[0_8px_30px_rgb(0,0,0,0.08)] bg-white/95 backdrop-blur-md border border-white/50 focus-within:ring-4 focus-within:ring-blue-500/20 transition-all duration-300"
      >
        
        {/* 1. Location Input */}
        <div className="flex items-center flex-1 px-4 py-3 text-slate-600 border-b sm:border-b-0 sm:border-r border-slate-200/60 group">
          <MapPin className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 group-focus-within:animate-bounce" />
          <input 
            type="text" 
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onFocus={() => setShowDropdown(true)}
            placeholder="City or Area..." 
            className="w-full focus:outline-none bg-transparent text-slate-800 placeholder:text-slate-400 font-medium"
          />
          {location && (
            <button type="button" onClick={() => setLocation("")} className="text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* 2. Main Query Input */}
        <div className="flex items-center flex-1 px-4 py-3 text-slate-600 relative group">
          <Search className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 group-focus-within:text-blue-700 transition-colors" />
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowDropdown(true)}
            placeholder="What are you looking for?" 
            className="w-full focus:outline-none bg-transparent text-slate-800 placeholder:text-slate-400 font-medium pr-8"
          />
          <div className="absolute right-4 flex items-center gap-2">
            {query && !isSearching && (
              <button type="button" onClick={() => setQuery("")} className="text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full p-1">
                <X className="w-3 h-3" />
              </button>
            )}
            {isSearching && <Loader2 className="w-4 h-4 animate-spin text-blue-500" />}
          </div>
        </div>

        <button 
          type="submit"
          className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3.5 rounded-xl font-bold transition-all hover:-translate-y-0.5 shadow-md hover:shadow-lg mt-2 sm:mt-0 flex items-center justify-center"
        >
          Search
        </button>
      </form>

      {/* 🔥 PREMIUM DROPDOWN 🔥 */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-[0_20px_50px_rgb(0,0,0,0.15)] border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">
          
          {/* Section A: Categories */}
          {results.categories?.length > 0 && (
            <div className="p-4 bg-slate-50/80 border-b border-gray-100">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 px-2 flex items-center gap-1.5">
                <LayoutGrid className="w-4 h-4 text-indigo-500" /> 
                {query ? "Matching Categories" : "Trending Categories"}
              </h4>
              <div className="flex flex-wrap gap-2">
                {results.categories.map((cat: any) => (
                  <Link 
                    key={cat._id} 
                    href={`/${cat.slug}`}
                    onClick={() => setShowDropdown(false)}
                    className="flex items-center gap-2 bg-white border border-slate-200 hover:border-indigo-400 hover:text-indigo-700 px-3 py-1.5 rounded-xl text-sm font-semibold text-slate-700 transition-all shadow-sm hover:shadow"
                  >
                    {cat.iconUrl ? (
                      // 🔥 NEXT/IMAGE optimization for category icon
                      <div className="relative w-5 h-5">
                        <Image src={cat.iconUrl} alt={cat.name} fill sizes="20px" className="object-contain" />
                      </div>
                    ) : (
                      <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold">
                        {cat.name.charAt(0)}
                      </span>
                    )}
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Section B: Businesses */}
          {(query || location) && results.businesses?.length > 0 && (
            <div className="py-2 max-h-[60vh] overflow-y-auto scrollbar-hide">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-3 mb-2 px-6 flex items-center gap-1.5">
                <Store className="w-4 h-4 text-blue-500" /> Businesses & Places
              </h4>
              {results.businesses.map((biz: any) => (
                <Link 
                  key={biz._id} 
                  href={`/${biz.category?.slug}/${biz.slug}`} 
                  onClick={() => setShowDropdown(false)}
                  className="flex items-center gap-4 px-6 py-3 hover:bg-blue-50/50 transition-colors group"
                >
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-sm border border-gray-200 group-hover:border-blue-300 shrink-0">
                    {/* 🔥 NEXT/IMAGE optimization for business thumbnail */}
                    <Image 
                      src={biz.media?.thumbnail || "https://placehold.co/100x100"} 
                      alt={biz.name} 
                      fill
                      sizes="48px"
                      className="object-cover transition-transform duration-300 group-hover:scale-110" 
                    />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                      {biz.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1 font-medium">
                      <MapPin className="w-3 h-3 text-red-400" />
                      {biz.location?.address}, {biz.location?.city}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Empty State (When no results found) */}
          {(query || location) && results.categories?.length === 0 && results.businesses?.length === 0 && !isSearching && (
            <div className="p-10 text-center flex flex-col items-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                <Search className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-gray-900 font-semibold mb-1">No results found</p>
              <p className="text-sm text-gray-500">We couldn't find anything for "{query || location}"</p>
            </div>
          )}

        </div>
      )}
    </div>
  );
}