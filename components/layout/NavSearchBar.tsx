"use client";

import { useState, useEffect, useRef } from "react";
import { Search, MapPin, Loader2, LayoutGrid, Store } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface SearchCategory {
  _id: string;
  name: string;
  slug: string;
  iconUrl?: string;
}

interface SearchBusiness {
  _id: string;
  name: string;
  slug: string;
  category?: {
    slug: string;
  };
  media?: {
    thumbnail?: string;
  };
  location?: {
    address?: string;
    city?: string;
  };
}

export default function NavSearchBar() {
  const [location, setLocation] = useState("");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({ categories: [], businesses: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
      if (showDropdown) fetchResults();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query, location, showDropdown]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query || location) {
      setShowDropdown(false);
      const searchParams = new URLSearchParams();
      if (query) searchParams.append("q", query);
      if (location) searchParams.append("location", location);
      router.push(`/search?${searchParams.toString()}`);
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto z-50" ref={dropdownRef}>
      
      {/* 🔥 COMPACT PILL DESIGN 🔥 */}
      <form 
        onSubmit={handleSearchSubmit} 
        className="flex items-center bg-white rounded-full shadow-md hover:shadow-lg transition-shadow border border-gray-100 h-11 sm:h-12 w-full overflow-hidden"
      >
        
        {/* 1. Location Input - 🔥 HIDDEN ON MOBILE (sm:flex) 🔥 */}
        <div className="hidden sm:flex items-center w-40 pl-4 border-r border-gray-200">
          <MapPin className="w-4 h-4 text-red-500 shrink-0" />
          <input 
            type="text" 
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onFocus={() => setShowDropdown(true)} 
            placeholder="City / Area" 
            className="w-full bg-transparent focus:outline-none text-gray-700 text-sm px-2 truncate placeholder:text-gray-400"
          />
        </div>
        
        {/* 2. Main Query Input - 🔥 TAKES FULL WIDTH ON MOBILE 🔥 */}
        <div className="flex items-center flex-1 px-3 sm:px-4 relative">
          <Search className="w-4 h-4 text-gray-400 shrink-0" />
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowDropdown(true)}
            placeholder="Search businesses, categories..." 
            className="w-full bg-transparent focus:outline-none text-gray-700 text-[13px] sm:text-sm px-2 sm:px-3 placeholder:text-gray-400"
          />
          {isSearching && <Loader2 className="w-4 h-4 animate-spin text-gray-400 absolute right-3" />}
        </div>

        {/* 3. Circular Search Button - 🔥 RIGHT NEXT TO INPUT 🔥 */}
        <button 
          type="submit" 
          className="bg-red-500 hover:bg-red-600 text-white rounded-full w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center mr-1 sm:mr-1 shrink-0 transition-transform active:scale-95"
        >
          <Search className="w-4 h-4" />
        </button>
      </form>

      {/* DROPDOWN MENU */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden max-h-[75vh] overflow-y-auto animate-in fade-in slide-in-from-top-2">
          
          {/* Categories Section */}
          {results.categories?.length > 0 && (
            <div className="p-4 bg-slate-50/80 border-b border-gray-100">
              <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <LayoutGrid className="w-3.5 h-3.5" /> 
                {query ? "Matching Categories" : "Trending Categories"}
              </h4>
              <div className="flex flex-wrap gap-2">
                {results.categories.map((cat: SearchCategory) => (
                 <Link 
                  key={cat._id} 
                  href={`/${cat.slug}`}
                  onClick={() => setShowDropdown(false)}
                  className="flex items-center gap-1.5 bg-white border border-gray-200 hover:border-red-400 hover:text-red-500 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-600 transition-colors shadow-sm"
                >
                  {cat.iconUrl ? (
                    <Image 
                      src={cat.iconUrl} 
                      alt={cat.name} 
                      width={16} 
                      height={16} 
                      className="w-4 h-4 object-contain" 
                    />
                  ) : (
                    <span className="w-4 h-4 rounded-full bg-red-50 text-red-500 flex items-center justify-center text-[9px] font-bold">
                      {cat.name.charAt(0)}
                    </span>
                  )}
                  {cat.name}
                </Link>
                ))}
              </div>
            </div>
          )}

          {/* Businesses Section */}
          {(query || location) && results.businesses?.length > 0 && (
            <div className="py-2">
              <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mt-2 mb-1 px-5 flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5" /> Businesses
              </h4>
              {results.businesses.map((biz: SearchBusiness) => (
                <Link 
                  key={biz._id} 
                  href={`/${biz.category?.slug}/${biz.slug}`} 
                  onClick={() => setShowDropdown(false)}
                  className="flex items-center gap-4 px-5 py-2.5 hover:bg-red-50 transition-colors group"
                >
                  <Image 
                    src={biz.media?.thumbnail || "https://placehold.co/100x100"} 
                    alt={biz.name} 
                    width={44} 
                    height={44} 
                    className="w-11 h-11 rounded-lg object-cover border border-gray-200 group-hover:border-red-300 shadow-sm" 
                  />
                  <div>
                    <p className="text-sm font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                      {biz.name}
                    </p>
                    <p className="text-[11px] font-medium text-gray-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-red-400" />
                      {biz.location?.address}, {biz.location?.city}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Empty State */}
          {(query || location) && results.categories?.length === 0 && results.businesses?.length === 0 && !isSearching && (
            <div className="p-8 text-center text-gray-500 flex flex-col items-center">
              <Search className="w-8 h-8 text-gray-300 mb-2" />
              <p className="text-sm font-medium">{`"${query || location}" ke liye koi result nahi mila 😢`}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}