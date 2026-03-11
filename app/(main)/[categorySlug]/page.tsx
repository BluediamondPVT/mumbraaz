import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Phone, Star, MessageCircle, Navigation } from "lucide-react";
import connectToDatabase from "@/lib/db";
import { Category } from "@/lib/models/Category";
import { Business } from "@/lib/models/Business";
import CategorySidebar from "@/components/category/CategorySidebar"; 

export const revalidate = 3600; // 1 ghante ke liye ISR cache

export default async function CategoryListingPage({
  params,
  searchParams, // 🔥 Next.js feature: URL ke filters padhne ke liye
}: {
  params: Promise<{ categorySlug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await params;
  const slug = resolvedParams.categorySlug;
  
  // URL se city filter nikal rahe hain (e.g. ?city=Thane,Mumbra)
  const resolvedSearchParams = await searchParams;
  const cityFilter = resolvedSearchParams.city as string;

  await connectToDatabase();

  // 1. Current category dhoondo
  const category = await Category.findOne({ slug: slug, isActive: true });
  if (!category) {
    notFound(); 
  }

  // 2. Sidebar ke liye saari categories laao
  const allCategories = await Category.find({ isActive: true }).select("name slug").sort({ name: 1 });

  // 3. Filter Query Banao
  const query: any = { category: category._id, status: "approved" };
  if (cityFilter) {
    // Agar URL me city hai, toh usko array me convert karke filter lagao
    const citiesArray = cityFilter.split(",");
    query["location.city"] = { $in: citiesArray.map(c => new RegExp(`^${c}$`, 'i')) };
  }

  // 4. Businesses fetch karo (filtered)
  const businesses = await Business.find(query).sort({ createdAt: -1 });

  // 5. Sidebar checkbox ke liye unique cities nikalo is category ki dukaano me se
 const uniqueCities = await Business.distinct("location.city", { status: "approved" });

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      
      {/* Header Section (Premium Gradient) */}
      <div className="bg-gradient-to-r from-[#0a2342] to-[#1a365d] text-white py-14 px-4 sm:px-6 lg:px-8 shadow-inner">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-extrabold capitalize tracking-tight flex items-center gap-3">
            Best {category.name} <span className="text-[#e72b4c]">Services</span>
          </h1>
          <p className="mt-3 text-slate-300 text-lg font-medium">
            Showing {businesses.length} {businesses.length === 1 ? 'result' : 'results'}
            {cityFilter && ` in ${cityFilter.replace(/,/g, " & ")}`}
          </p>
        </div>
      </div>

      {/* Main Layout Grid (Left Sidebar + Right Content) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* 🔥 LEFT SIDEBAR 🔥 */}
          <div className="lg:col-span-1">
            <CategorySidebar 
              categories={JSON.parse(JSON.stringify(allCategories))} 
              currentCategorySlug={slug}
              availableCities={uniqueCities}
            />
          </div>

          {/* 🔥 RIGHT CONTENT (Horizontal Cards) 🔥 */}
          <div className="lg:col-span-3">
            {businesses.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Koi Listing Nahi Mili</h3>
                <p className="text-gray-500 mt-2">Kripya koi dusri city select karein ya filters hatayein.</p>
              </div>
            ) : (
              <div className="space-y-6"> {/* Horizontal cards ke liye flex-col ke bajaye space-y diya hai */}
                {businesses.map((biz) => (
                  <div 
                    key={biz._id.toString()} 
                    className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col sm:flex-row"
                  >
                    {/* Left: Image Box */}
                    <div className="sm:w-64 md:w-72 h-56 sm:h-auto shrink-0 relative bg-gray-100 overflow-hidden">
                      <img 
                        src={biz.media?.thumbnail || "https://placehold.co/600x400/png"} 
                        alt={biz.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-yellow-600 text-xs font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 shadow-sm">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        {biz.averageRating || "New"}
                      </div>
                    </div>

                    {/* Right: Content Box */}
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-4">
                          <h3 className="text-2xl font-bold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                            {biz.name}
                          </h3>
                        </div>

                        <p className="text-gray-500 text-sm mt-2 flex items-center font-medium">
                          <MapPin className="w-4 h-4 mr-1.5 text-red-500" />
                          {biz.location?.address}, <span className="text-gray-800 ml-1">{biz.location?.city}</span>
                        </p>

                        <p className="text-gray-600 text-sm mt-4 line-clamp-2 leading-relaxed">
                          {biz.description}
                        </p>
                      </div>

{/* Action Buttons */}
                      <div className="mt-6 pt-5 border-t border-gray-100 flex flex-wrap sm:flex-nowrap gap-3">
                        <Link 
                          href={`/${slug}/${biz.slug}`}
                          className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-center py-3 px-4 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
                        >
                          <span>View Details</span>
                        </Link>

                        <a 
                          href={`tel:${biz.contact?.phone}`} 
                          className="flex items-center justify-center gap-2 bg-white border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-3 rounded-xl font-semibold transition-all shadow-sm hover:shadow-md"
                        >
                          <Phone className="w-5 h-5 text-gray-600" />
                          <span className="hidden sm:inline">Call</span>
                        </a>
                        
                        <a 
                          href={`https://wa.me/${biz.contact?.whatsapp}`} 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1DA851] text-white px-4 py-3 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg"
                        >
                          <MessageCircle className="w-5 h-5" />
                          <span className="hidden sm:inline">WhatsApp</span>
                        </a>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}