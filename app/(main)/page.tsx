import { Suspense } from "react";
import connectToDatabase from "@/lib/db";
import { Category } from "@/lib/models/Category";
import { Business } from "@/lib/models/Business";
import CategoryCard from "@/components/CategoryCard";
import PopularServices from "@/components/home/PopularServices"; 
import TravelBookings from "@/components/home/TravelBookings";
import PopularSearches from "@/components/home/PopularSearches";

export const revalidate = 3600; // 1 ghante ke liye ISR cache (Super fast speed ke liye)

async function CategoriesSection() {
  await connectToDatabase();
  
  // 🔥 Yahan .lean() add kiya hai taaki DB se plain data jaldi aaye
  const categories = await Category.find({ isActive: true }).sort({ createdAt: -1 }).lean();

  const categoriesWithCount = await Promise.all(
    categories.map(async (cat: any) => {
      const businessCount = await Business.countDocuments({
        category: cat._id,
        status: 'approved'
      });
      return {
        _id: cat._id.toString(),
        name: cat.name,
        slug: cat.slug,
        iconUrl: cat.iconUrl || "",
        businessCount,
      };
    })
  );

  return (
    <div className="bg-white min-h-screen p-4 sm:p-6 lg:p-8">
      
      {/* Banner Image */}
      <div className="w-full">
        <img 
          src="/banner.jpg" 
          alt="Banner" 
          className="w-full h-auto hidden sm:block max-h-[400px] object-cover rounded-lg shadow-md"
        />
        <img 
          src="/banner3.jpg" 
          alt="Banner-2" 
          className="w-full h-auto block sm:hidden max-h-[400px] object-cover rounded-lg shadow-md"
        />
      </div>

      {/* Category Section */}
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Our Category
              </h2>
              <p className="text-gray-600">
                Buy and Sell Everything from Used Our Top Category
              </p>
            </div>
            {/* View All button comment rakha hai */}
          </div>

          {/* Categories Grid */}
          {categoriesWithCount.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No categories available yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {categoriesWithCount.map((category) => (
                <CategoryCard
                  key={category._id}
                  slug={category.slug}
                  name={category.name}
                  iconUrl={category.iconUrl}
                  businessCount={category.businessCount}
                />
              ))}
            </div>
          )}
        </div>
      </div>

     {/* 🔥 NAYA POPULAR SERVICES COMPONENT 🔥 */}
      <div className="bg-slate-50 border-t border-gray-100">
        <PopularServices />

        {/* 🔥 YAHAN TERA TRAVEL BOOKINGS HAI 🔥 */}
        <TravelBookings />
      </div>

      {/* 🔥 NAYA POPULAR SEARCHES SLIDER YAHAN AAYEGA 🔥 */}
      <div className="bg-white">
        <PopularSearches />
      </div>

    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center font-semibold text-blue-600">Loading Categories...</div>}>
      <CategoriesSection />
    </Suspense>
  );
}