import { Suspense } from "react";
import type { Metadata } from "next"; 
import Image from "next/image"; 
import connectToDatabase from "@/lib/db";
import { Category } from "@/lib/models/Category";
import { Banner } from "@/lib/models/Banner";
import CategoryCard from "@/components/CategoryCard";
import PopularServices from "@/components/home/PopularServices"; 
import TravelBookings from "@/components/home/TravelBookings";
import PopularSearches from "@/components/home/PopularSearches";
import BlogSlider from "@/components/home/BlogSlider";
import CategoryLoadingSkeleton from "@/app/(main)/loading"; 

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "MumbraBiZ | Find Best Local Businesses & Services",
  description: "Explore the best local businesses, services, and professionals in Mumbra and Thane.",
  alternates: { canonical: "/" }
};

async function CategoriesSection() {
  await connectToDatabase();
  
  // 1. Banner Data Fetch
  const bannerData = await Banner.findOne({ type: "homepage" }).lean();
  const desktop1 = bannerData?.desktop1 || "/banner3.jpg";
  const desktop2 = bannerData?.desktop2 || "/banner.jpg";
  const desktop3 = bannerData?.desktop3 || "/banner3.jpg";
  const mobileBanner = bannerData?.mobile || "/banner3.jpg";

  // 🔥 2. OPTIMIZED AGGREGATION: Ek hi query mein Categories + Counts 🔥
  const categoriesWithCount = await Category.aggregate([
    { $match: { isActive: true } },
    {
      $lookup: {
        from: "businesses", // Dhyan dena: tumhare collection ka naam 'businesses' hona chahiye
        localField: "_id",
        foreignField: "category",
        as: "bizData"
      }
    },
    {
      $project: {
        _id: { $toString: "$_id" },
        name: 1,
        slug: 1,
        iconUrl: { $ifNull: ["$iconUrl", ""] },
        businessCount: {
          $size: {
            $filter: {
              input: "$bizData",
              as: "biz",
              cond: { $eq: ["$$biz.status", "approved"] }
            }
          }
        }
      }
    },
    { $sort: { createdAt: -1 } }
  ]);

  return (
    <main className="bg-white min-h-screen p-4 sm:p-6 lg:p-8"> 
      {/* Banner Section */}
      <section className="w-full px-4 sm:px-6 lg:px-8 pt-6">
        <div className="max-w-7xl mx-auto">
          <div className="hidden md:grid grid-cols-3 gap-4 h-[250px] lg:h-[300px]">
            {[desktop1, desktop2, desktop3].map((src, i) => (
              <div key={i} className="relative w-full h-full rounded-xl overflow-hidden shadow-md bg-gray-100">
                <Image src={src} alt={`Banner ${i+1}`} fill priority className="object-cover hover:scale-105 transition-transform duration-500" />
              </div>
            ))}
          </div>
          <div className="block md:hidden relative w-full h-[200px] sm:h-[250px] rounded-xl overflow-hidden shadow-md bg-gray-100">
            <Image src={mobileBanner} alt="Mobile Banner" fill priority className="object-cover" />
          </div>
        </div>
      </section>

      {/* Category Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Explore Local Categories</h1>
              <p className="text-gray-600">Buy and Sell Everything from Our Top Rated Categories</p>
            </div>
          </div>

          {categoriesWithCount.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No categories available yet</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {categoriesWithCount.map((cat) => (
                <CategoryCard key={cat._id} {...cat} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-slate-50 border-t border-gray-100">
        <PopularServices />
        <TravelBookings />
      </section>
      <PopularSearches />
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