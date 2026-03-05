import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Phone, Star, MessageCircle } from "lucide-react";
import connectToDatabase from "@/lib/db";
import { Category } from "@/lib/models/Category";
import { Business } from "@/lib/models/Business";

export default async function CategoryListingPage({
  params,
}: {
  params: Promise<{ categorySlug: string }>; // 1. Yahan Promise add kiya
}) {
  // 2. Yahan params ko await kiya
  const resolvedParams = await params;
  const slug = resolvedParams.categorySlug;

  await connectToDatabase();

  // 3. Database me check karo ki kya aisi koi category hai?
  const category = await Category.findOne({ slug: slug, isActive: true });

  if (!category) {
    notFound(); // Agar koi aaltu-faltu URL daale toh 404 page dikhao
  }

  // 4. Us category ki saari approved dukaane (businesses) le aao
  const businesses = await Business.find({ 
    category: category._id,
    status: "approved" 
  }).sort({ createdAt: -1 });

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      
      {/* Header Section */}
      <div className="bg-blue-600 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold capitalize">
            Best {category.name} in Town
          </h1>
          <p className="mt-2 text-blue-100">
            {businesses.length} {businesses.length === 1 ? 'result' : 'results'} found
          </p>
        </div>
      </div>

      {/* Listing Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {businesses.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-xl font-medium text-gray-900">Abhi yahan koi listing nahi hai.</h3>
            <p className="text-gray-500 mt-2">Admin panel se is category mein naye businesses add karein.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businesses.map((biz) => (
              <div key={biz._id.toString()} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                
                {/* Image Placeholder */}
                <div className="h-48 bg-gray-200 w-full overflow-hidden">
                  <img 
                    src={biz.media?.thumbnail || "https://placehold.co/600x400/png"} 
                    alt={biz.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-gray-900 line-clamp-1">{biz.name}</h3>
                    <div className="flex items-center bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-bold">
                      <Star className="w-4 h-4 mr-1 fill-current" />
                      {biz.averageRating || "New"}
                    </div>
                  </div>

                  <p className="text-gray-500 text-sm mt-1 flex items-center line-clamp-1">
                    <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                    {biz.location?.address}, {biz.location?.city}
                  </p>

                  <p className="text-gray-600 text-sm mt-3 line-clamp-2 flex-1">
                    {biz.description}
                  </p>

                  {/* Action Buttons */}
                  <div className="mt-5 pt-4 border-t border-gray-100 flex gap-3">
                    <Link 
                      href={`/${slug}/${biz.slug}`} 
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 text-center py-2 rounded-lg font-medium transition-colors"
                    >
                      View Details
                    </Link>
                    <a 
                      href={`https://wa.me/${biz.contact?.whatsapp}`} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition-colors w-12"
                    >
                      <MessageCircle className="w-5 h-5" />
                    </a>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}