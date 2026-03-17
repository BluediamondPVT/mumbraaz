"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ChevronDown, ChevronUp, MapPin, LayoutGrid, SlidersHorizontal, X } from "lucide-react";
   
interface SidebarProps {
  categories: { _id: string; name: string; slug: string }[];
  currentCategorySlug: string;
  availableCities: string[];
}

export default function CategorySidebar({ categories, currentCategorySlug, availableCities }: SidebarProps) {
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false); // 🔥 Mobile Modal State
  
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 🔥 UX FIX: Jab mobile pe modal open ho, toh piche ka background scroll na ho
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => { document.body.style.overflow = "auto"; };
  }, [isMobileOpen]);

  // URL se current selected cities nikalna
  const selectedCitiesUrl = searchParams.get("city");
  const selectedCities = selectedCitiesUrl ? selectedCitiesUrl.split(",") : [];

  // Jab user checkbox pe click kare
  const handleCityChange = (city: string) => {
    let newCities = [...selectedCities];
    if (newCities.includes(city)) {
      newCities = newCities.filter((c) => c !== city); // Uncheck
    } else {
      newCities.push(city); // Check
    }

    const params = new URLSearchParams(searchParams.toString());
    if (newCities.length > 0) {
      params.set("city", newCities.join(","));
    } else {
      params.delete("city");
    }
    
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const displayedCategories = showAllCategories ? categories : categories.slice(0, 6);
  const queryString = searchParams.toString();
  const urlSuffix = queryString ? `?${queryString}` : "";

  // 🔥 FILTER CONTENT (Taaki desktop aur mobile ke liye code repeat na karna pade)
  const FilterContent = (
    <div className="p-6 lg:p-0">
      
      {/* Mobile Header (Only visible on mobile) */}
      <div className="flex justify-between items-center mb-6 lg:hidden pb-4 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-blue-600" />
          Filters & Categories
        </h2>
        <button onClick={() => setIsMobileOpen(false)} className="p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* 1. Categories Section */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <LayoutGrid className="w-5 h-5 text-blue-600" />
          Categories
        </h3>
        <div className="space-y-1">
          {displayedCategories.map((cat) => (
            <Link 
              key={cat._id} 
              href={`/${cat.slug}${urlSuffix}`}
              scroll={false} 
              onClick={() => setIsMobileOpen(false)} // 🔥 Mobile pe link click hote hi modal band kardo
              className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                cat.slug === currentCategorySlug 
                  ? "bg-blue-50 text-blue-700 font-bold" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
        
        {/* Read More / Read Less Button */}
        {categories.length > 6 && (
          <button 
            onClick={() => setShowAllCategories(!showAllCategories)}
            className="mt-3 flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 px-3 transition-colors"
          >
            {showAllCategories ? (
              <><ChevronUp className="w-4 h-4" /> Show Less</>
            ) : (
              <><ChevronDown className="w-4 h-4" /> +{categories.length - 6} More</>
            )}
          </button>
        )}
      </div>

      <div className="h-px bg-gray-100 w-full mb-8 hidden lg:block"></div>

      {/* 2. Locations Filter Section */}
      <div className="mb-6 lg:mb-0">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-red-500" />
          Filter by City
        </h3>
        {availableCities.length === 0 ? (
          <p className="text-sm text-gray-500 px-3">No cities available.</p>
        ) : (
          <div className="space-y-3 px-3">
            {availableCities.map((city, index) => (
              <label key={index} className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={selectedCities.includes(city)}
                  onChange={() => handleCityChange(city)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer transition-all"
                />
                <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">
                  {city}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Apply Button (Only mobile) */}
      <div className="mt-8 lg:hidden">
        <button 
          onClick={() => setIsMobileOpen(false)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95"
        >
          Show Results
        </button>
      </div>

    </div>
  );

  return (
    <>
      {/* 🔥 MOBILE VIEW: Floating Trigger Button (Bottom Center) 🔥 */}
      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
        <button 
          onClick={() => setIsMobileOpen(true)}
          className="flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-xl font-bold shadow-[0_10px_40px_rgba(0,0,0,0.3)] hover:bg-black transition-transform active:scale-95 border border-gray-700"
        >
          <SlidersHorizontal className="w-5 h-5" />
          Filters
          {/* Agar filter active hai, toh badge dikhao */}
          {selectedCities.length > 0 && (
            <span className="bg-blue-600 text-white text-[11px] px-2 py-0.5 rounded-full ml-1">
              {selectedCities.length}
            </span>
          )}
        </button>
      </div>

      {/* 🔥 MOBILE VIEW: Black Blur Overlay 🔥 */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden transition-opacity duration-300"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* 🔥 RESPONSIVE WRAPPER: Mobile pe Bottom Sheet, Desktop pe Sticky Sidebar 🔥 */}
      <div 
        className={`
          fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto transform transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-sm
          lg:relative lg:block lg:translate-y-0 lg:bg-white lg:rounded-2xl lg:border lg:border-gray-100 lg:p-6 lg:sticky lg:top-24 lg:h-auto lg:overflow-visible lg:z-auto
          ${isMobileOpen ? "translate-y-0" : "translate-y-full lg:translate-y-0"}
        `}
      >
        {/* Mobile Drag Handle Indicator */}
        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mt-4 mb-2 lg:hidden" />
        
        {FilterContent}
      </div>
    </>
  );
}