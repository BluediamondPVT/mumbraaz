"use client";

import { useState, useEffect, useRef } from "react";
import { Search, MapPin, Loader2, LayoutGrid, Store } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

// 🔥 Option 1: TypeScript Interfaces (Type check ke liye)
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

  return (
    <div className="pb-4 relative max-w-4xl w-full" ref={dropdownRef}>
      <div className="flex flex-col sm:flex-row gap-3 items-stretch w-full">
        {/* 🔥 Location Input 🔥 */}
        <div className="flex items-center bg-white bg-opacity-90 hover:bg-opacity-100 rounded-lg px-4 py-2 flex-1 transition-all">
          <MapPin className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0" />
          <input 
            type="text" 
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onFocus={() => setShowDropdown(true)} 
            placeholder="Select City / Area" 
            className="w-full bg-transparent focus:outline-none text-gray-700 text-sm"
          />
        </div>
        
        {/* Main Query Input */}
        <div className="flex items-center bg-white bg-opacity-90 hover:bg-opacity-100 rounded-lg px-4 py-2 flex-1 transition-all relative">
          <Search className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0" />
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowDropdown(true)}
            placeholder="Enter Keyword here..." 
            className="w-full bg-transparent focus:outline-none text-gray-700 text-sm pr-6"
          />
          {isSearching && <Loader2 className="w-4 h-4 animate-spin text-gray-400 absolute right-3" />}
        </div>

        <button className="bg-white hover:bg-gray-50 text-red-500 font-semibold px-6 py-2 rounded-lg transition-colors w-full sm:w-auto flex items-center justify-center gap-2">
          <span>Search</span>
        </button>
      </div>

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 max-h-[80vh] overflow-y-auto">
          
          {/* Categories Section */}
          {results.categories?.length > 0 && (
            <div className="p-3 bg-slate-50 border-b border-gray-100">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-1 flex items-center gap-1">
                <LayoutGrid className="w-3 h-3" /> 
                {query ? "Categories" : "Trending"}
              </h4>
              <div className="flex flex-wrap gap-2">
                {/* 🔥 Yahan cat: any ki jagah cat: SearchCategory lagaya 🔥 */}
                {results.categories.map((cat: SearchCategory) => (
                 <Link 
                  key={cat._id} 
                  href={`/${cat.slug}`}
                  onClick={() => setShowDropdown(false)}
                  className="flex items-center gap-1.5 bg-white border border-gray-200 hover:border-red-400 hover:text-red-500 px-2.5 py-1 rounded-md text-xs font-medium text-gray-600 transition-colors"
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

          {/* 🔥 Businesses Section 🔥 */}
          {(query || location) && results.businesses?.length > 0 && (
            <div className="py-1">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-2 mb-1 px-4 flex items-center gap-1">
                <Store className="w-3 h-3" /> Businesses
              </h4>
              {/* 🔥 Yahan biz: any ki jagah biz: SearchBusiness lagaya 🔥 */}
              {results.businesses.map((biz: SearchBusiness) => (
                <Link 
                  key={biz._id} 
                  href={`/${biz.category?.slug}/${biz.slug}`} 
                  onClick={() => setShowDropdown(false)}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-red-50 transition-colors group"
                >
                  <Image 
                    src={biz.media?.thumbnail || "https://placehold.co/100x100"} 
                    alt={biz.name} 
                    width={40} 
                    height={40} 
                    className="w-10 h-10 rounded-md object-cover border border-gray-200 group-hover:border-red-300" 
                  />
                  <div>
                    <p className="text-sm font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                      {biz.name}
                    </p>
                    <p className="text-[11px] text-gray-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-red-400" />
                      {biz.location?.address}, {biz.location?.city}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Agar kuch na mile toh message */}
          {(query || location) && results.categories?.length === 0 && results.businesses?.length === 0 && !isSearching && (
            <div className="p-6 text-center text-gray-500 text-sm">
              <p>{`"${query || location}" ke liye koi result nahi mila 😢`}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}