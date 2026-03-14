import { Suspense } from "react";
import type { Metadata } from "next"; 
import Image from "next/image"; 
import connectToDatabase from "@/lib/db";
import { Category } from "@/lib/models/Category";
import { Business } from "@/lib/models/Business";
import CategoryCard from "@/components/CategoryCard";
import PopularServices from "@/components/home/PopularServices"; 
import TravelBookings from "@/components/home/TravelBookings";
import PopularSearches from "@/components/home/PopularSearches";
import BlogSlider from "@/components/home/BlogSlider";
import CategoryLoadingSkeleton from "@/app/(main)/loading"; // Apna correct path daal dena

export const revalidate = 3600; // 1 ghante ke liye ISR cache (Super fast speed ke liye)

// 🔥 2. PAGE KA SEO METADATA (Google Search ke liye) 🔥
export const metadata: Metadata = {
  title: "MumbraBiZ | Find Best Local Businesses & Services",
  description: "Explore the best local businesses, services, and professionals in Mumbra and Thane. Buy, sell, and connect with top-rated local categories.",
  alternates: {
    canonical: "/", // Duplicate content issue ko rokne ke liye
  }
};

async function CategoriesSection() {
  await connectToDatabase();
  
  // Yahan .lean() add kiya hai taaki DB se plain data jaldi aaye
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
    <main className="bg-white min-h-screen p-4 sm:p-6 lg:p-8"> {/* div ki jagah <main> use kiya for better HTML structure */}
      
      {/* Banner Image Optimized for 100/100 LCP */}
      <section className="w-full">
        <Image 
          src="/banner.jpg" 
          alt="MumbraBiZ - Find Local Businesses and Services Desktop Banner" // 🔥 3. Alt text ko descriptive banaya
          width={1920} 
          height={400}
          priority 
          className="w-full h-auto hidden sm:block max-h-[400px] object-cover rounded-lg shadow-md"
        />
        <Image 
          src="/banner3.jpg" 
          alt="MumbraBiZ - Best Local Directory Mobile Banner" 
          width={800}
          height={400}
          priority 
          className="w-full h-auto block sm:hidden max-h-[400px] object-cover rounded-lg shadow-md"
        />
      </section>

      {/* Category Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-12">
            <div>
              {/* 🔥 4. h2 ko H1 banaya kyunki homepage par main title yahi hai 🔥 */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Explore Local Categories
              </h1>
              <p className="text-gray-600">
                Buy and Sell Everything from Our Top Rated Categories
              </p>
            </div>
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
      </section>

     {/* NAYA POPULAR SERVICES COMPONENT */}
      <section className="bg-slate-50 border-t border-gray-100">
        <PopularServices />
        <TravelBookings />
      </section>

      {/* NAYA POPULAR SEARCHES SLIDER */}
      <section className="bg-white">
        <PopularSearches />
      </section>

      {/* NAYA BLOG SLIDER */}
      <section className="bg-slate-50 border-t border-gray-100">
        <BlogSlider />
      </section>

    </main>
  );
}

export default function HomePage() {
  return (
    // 🔥 Fallback mein text hata kar apna component laga diya 🔥
    <Suspense fallback={<CategoryLoadingSkeleton />}>
      <CategoriesSection />
    </Suspense>
  );
}