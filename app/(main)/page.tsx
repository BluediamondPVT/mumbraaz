import { Suspense } from "react";
import connectToDatabase from "@/lib/db";
import { Category } from "@/lib/models/Category";
import { Business } from "@/lib/models/Business";
import CategoryCard from "@/components/CategoryCard";

async function CategoriesSection() {
  await connectToDatabase();
  const categories = await Category.find({ isActive: true }).sort({ createdAt: -1 });

  const categoriesWithCount = await Promise.all(
    categories.map(async (cat) => {
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
    <div className="bg-white min-h-screen">
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
            {/* <a 
              href="#" 
              className="text-red-500 border-2 border-red-500 px-6 py-2 rounded-lg font-medium hover:bg-red-50 transition-colors whitespace-nowrap"
            >
              View All
            </a> */}
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
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>}>
      <CategoriesSection />
    </Suspense>
  );
}