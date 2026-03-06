"use client";

import { useState, useEffect, useRef } from "react";
import { Search, MapPin, Loader2, LayoutGrid, Store } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

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
      // Agar dropdown open hai, tabhi API call karo
      if (showDropdown) {
        fetchResults();
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query, location, showDropdown]);

  const handleSearchSubmit = () => {
    if (query) {
      // Baad me yahan search results page ka link daalenge
      toast.success("Aage chalke yeh Search Page pe jayega!");
    }
  };

  return (
    <div className="relative max-w-3xl mx-auto z-50" ref={dropdownRef}>
      
      {/* Search Input Box */}
      <div className="glass p-2.5 md:p-3 rounded-2xl flex flex-col sm:flex-row items-stretch shadow-xl bg-white/95 border border-gray-100">
        
        {/* 1. Location Input */}
        <div className="flex items-center flex-1 px-4 py-3 text-slate-600 border-b sm:border-b-0 sm:border-r border-slate-200/50">
          <MapPin className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
          <input 
            type="text" 
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="City ya Area" 
            className="w-full focus:outline-none bg-transparent text-slate-800 placeholder:text-slate-400 font-medium"
          />
        </div>

        {/* 2. Main Query Input (Click karte hi dropdown open) */}
        <div className="flex items-center flex-1 px-4 py-3 text-slate-600 relative">
          <Search className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowDropdown(true)} // 🔥 CLICK KARTE HI DROPDOWN SHOW
            placeholder="Kya dhoondh rahe ho?" 
            className="w-full focus:outline-none bg-transparent text-slate-800 placeholder:text-slate-400 font-medium"
          />
          {isSearching && <Loader2 className="w-4 h-4 animate-spin text-gray-400 absolute right-4" />}
        </div>

        <button 
          onClick={handleSearchSubmit}
          className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-8 py-3.5 rounded-xl font-bold transition-all hover:scale-[1.02] shadow-md mt-2 sm:mt-0"
        >
          Search
        </button>
      </div>

      {/* 🔥 JUSTDIAL STYLE DROPDOWN 🔥 */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-fade-in-up">
          
          {/* Section A: Categories (Agar type nahi kiya toh trending, type kiya toh matching) */}
          {results.categories?.length > 0 && (
            <div className="p-4 bg-slate-50 border-b border-gray-100">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2 flex items-center gap-1.5">
                <LayoutGrid className="w-3.5 h-3.5" /> 
                {query ? "Matching Categories" : "Trending Categories"}
              </h4>
              <div className="flex flex-wrap gap-2">
                {results.categories.map((cat: any) => (
                  <Link 
                    key={cat._id} 
                    href={`/${cat.slug}`}
                    onClick={() => setShowDropdown(false)}
                    className="flex items-center gap-2 bg-white border border-gray-200 hover:border-blue-400 hover:text-blue-600 px-3 py-1.5 rounded-full text-sm font-medium text-gray-600 transition-colors shadow-sm"
                  >
                    {cat.iconUrl ? (
                      <img src={cat.iconUrl} alt={cat.name} className="w-5 h-5 object-contain" />
                    ) : (
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold">
                        {cat.name.charAt(0)}
                      </span>
                    )}
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Section B: Businesses (Sirf tab dikhega jab user kuch type kare) */}
          {query && results.businesses?.length > 0 && (
            <div className="py-2">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-2 mb-2 px-6 flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5" /> Businesses
              </h4>
              {results.businesses.map((biz: any) => (
                <Link 
                  key={biz._id} 
                  // Category slug use karke exact dukan ke page pe bhej rahe hain
                  href={`/${biz.category?.slug}/${biz.slug}`} 
                  onClick={() => setShowDropdown(false)}
                  className="flex items-center gap-4 px-6 py-3 hover:bg-blue-50 transition-colors group"
                >
                  <img 
                    src={biz.media?.thumbnail || "https://placehold.co/100x100"} 
                    className="w-12 h-12 rounded-lg object-cover border border-gray-200 group-hover:border-blue-300" 
                    alt={biz.name} 
                  />
                  <div>
                    <p className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                      {biz.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-red-400" />
                      {biz.location?.address}, {biz.location?.city}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Agar search karne pe kuch na mile */}
          {query && results.categories?.length === 0 && results.businesses?.length === 0 && !isSearching && (
            <div className="p-8 text-center text-gray-500">
              <p>"{query}" ke liye kuch nahi mila 😢</p>
            </div>
          )}

        </div>
      )}
    </div>
  );
}