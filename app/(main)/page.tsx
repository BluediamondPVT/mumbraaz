import { Suspense } from "react";
import type { Metadata } from "next"; 
import Image from "next/image"; 
import connectToDatabase from "@/lib/db";
import { Category } from "@/lib/models/Category";
import { Business } from "@/lib/models/Business";
import { Banner } from "@/lib/models/Banner"; // 🔥 Banner Model import kiya
import CategoryCard from "@/components/CategoryCard";
import PopularServices from "@/components/home/PopularServices"; 
import TravelBookings from "@/components/home/TravelBookings";
import PopularSearches from "@/components/home/PopularSearches";
import BlogSlider from "@/components/home/BlogSlider";
import CategoryLoadingSkeleton from "@/app/(main)/loading"; 

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
  
  // 🔥 DYNAMIC BANNER FETCH LOGIC 🔥
  // Database se banner layega, agar nahi mila toh null aayega
  const bannerData = await Banner.findOne({ type: "homepage" }).lean();
  
  // Agar database mein images hain toh wo use karega, warna teri purani images as Fallback use hongi
  const desktop1 = bannerData?.desktop1 || "/banner3.jpg";
  const desktop2 = bannerData?.desktop2 || "/banner.jpg";
  const desktop3 = bannerData?.desktop3 || "/banner3.jpg";
  const mobileBanner = bannerData?.mobile || "/banner3.jpg";

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
    <main className="bg-white min-h-screen p-4 sm:p-6 lg:p-8"> 
      
      {/* 🔥 DYNAMIC BANNER SECTION 🔥 */}
      <section className="w-full px-4 sm:px-6 lg:px-8 pt-6">
        <div className="max-w-7xl mx-auto">
          
          {/* DESKTOP VIEW: 3 Images Side-by-Side (Laptop/Tablet ke liye) */}
          <div className="hidden md:grid grid-cols-3 gap-4 h-[250px] lg:h-[300px]">
            
            {/* Image 1 (Left) */}
            <div className="relative w-full h-full rounded-xl overflow-hidden shadow-md bg-gray-100">
              <Image 
                src={desktop1} 
                alt="Feature 1 in Mumbra" 
                fill
                priority 
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Image 2 (Center) */}
            <div className="relative w-full h-full rounded-xl overflow-hidden shadow-md bg-gray-100">
              <Image 
                src={desktop2} 
                alt="Feature 2 in Mumbra" 
                fill
                priority 
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Image 3 (Right) */}
            <div className="relative w-full h-full rounded-xl overflow-hidden shadow-md bg-gray-100">
              <Image 
                src={desktop3} 
                alt="Feature 3 in Mumbra" 
                fill
                priority 
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>

          </div>

          {/* MOBILE VIEW: Sirf 1 Image (Phones ke liye) */}
          <div className="block md:hidden relative w-full h-[200px] sm:h-[250px] rounded-xl overflow-hidden shadow-md bg-gray-100">
            <Image 
              src={mobileBanner} 
              alt="MumbraBiZ - Best Local Directory Mobile Banner" 
              fill
              priority 
              className="object-cover"
            />
          </div>

        </div>
      </section>

      {/* Category Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-12">
            <div>
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

      {/* POPULAR SERVICES COMPONENT */}
      <section className="bg-slate-50 border-t border-gray-100">
        <PopularServices />
        <TravelBookings />
      </section>

      {/* POPULAR SEARCHES SLIDER */}
      <section className="bg-white">
        <PopularSearches />
      </section>

      {/* BLOG SLIDER */}
      <section className="bg-slate-50 border-t border-gray-100">
        <BlogSlider />
      </section>

    </main>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<CategoryLoadingSkeleton />}>
      <CategoriesSection />
    </Suspense>
  );
}