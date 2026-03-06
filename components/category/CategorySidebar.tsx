"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ChevronDown, ChevronUp, MapPin, LayoutGrid } from "lucide-react";

interface SidebarProps {
  categories: { _id: string; name: string; slug: string }[];
  currentCategorySlug: string;
  availableCities: string[];
}

export default function CategorySidebar({ categories, currentCategorySlug, availableCities }: SidebarProps) {
  const [showAllCategories, setShowAllCategories] = useState(false);
  
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

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

  // 🔥 YEH LOGIC TERA KAM KAREGA: Category click karne pe purane filters (city) preserve rahenge
  const queryString = searchParams.toString();
  const urlSuffix = queryString ? `?${queryString}` : "";

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
      
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
              // 🔥 Yahan urlSuffix add kiya hai taaki URL maintain rahe
              href={`/${cat.slug}${urlSuffix}`}
              scroll={false} // Page top pe jump nahi karega
              className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                cat.slug === currentCategorySlug 
                  ? "bg-blue-50 text-blue-700" 
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

      <div className="h-px bg-gray-100 w-full mb-8"></div>

      {/* 2. Locations Filter Section */}
      <div>
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

    </div>
  );
}