import { notFound } from "next/navigation";
import { Metadata } from "next"; 
import { MapPin, Phone, Star, MessageCircle, Navigation, Info } from "lucide-react";
import connectToDatabase from "@/lib/db";
import { Business } from "@/lib/models/Business";
import ReviewForm from "@/components/reviews/ReviewForm";
import ImageSlider from "@/components/business/ImageSlider";
import RelatedSlider from "@/components/business/RelatedSlider"; 
import BusinessGallery from "@/components/business/BusinessGallery"; 
import BusinessNav from "@/components/business/BusinessNav"; 

export const revalidate = 3600;

// ... (Metadata function same rahega) ...
export async function generateMetadata({
  params,
}: {
  params: Promise<{ categorySlug: string; businessSlug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  await connectToDatabase();
  
  const business = await Business.findOne({ 
    slug: resolvedParams.businessSlug, 
    status: "approved" 
  }).select("name description location").lean();

  if (!business) return { title: "Business Not Found | MumbraBiZ" };

  return {
    title: `${business.name} in ${business.location?.city} - Contact & Reviews | MumbraBiZ`,
    description: business.description?.substring(0, 150) + "...",
  };
}


export default async function BusinessDetailPage({
  params,
}: {
  params: Promise<{ categorySlug: string; businessSlug: string }>;
}) {
  const resolvedParams = await params;
  const { categorySlug, businessSlug } = resolvedParams;

  await connectToDatabase();

  const business = await Business.findOne({ slug: businessSlug, status: "approved" }).lean(); 
  if (!business) notFound();

  const relatedBusinessesRaw = await Business.find({
    category: business.category,
    _id: { $ne: business._id },
    status: "approved"
  }).limit(10).lean(); 

  const relatedBusinesses = relatedBusinessesRaw.map(biz => ({
    _id: biz._id.toString(),
    slug: biz.slug,
    name: biz.name,
    averageRating: biz.averageRating,
    media: { thumbnail: biz.media?.thumbnail },
    location: { address: biz.location?.address, city: biz.location?.city }
  }));

  const allImages = [business.media?.thumbnail || "https://placehold.co/1200x400/png?text=No+Image+Available"];
  if (business.media?.gallery && business.media.gallery.length > 0) {
    allImages.push(...business.media.gallery);
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16 relative">
      <ImageSlider images={allImages} name={business.name} city={business.location?.city} state={business.location?.state} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
          
          <div className="lg:col-span-2 space-y-8">
            
            {/* 🔥 2. TAB NAVIGATION YAHAN LAGA DIYA 🔥 */}
            <BusinessNav />

            {/* About Section (id="overview" lagaya) */}
            <div id="overview" className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 transition-shadow hover:shadow-md scroll-mt-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-5 flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                    <Info className="text-blue-600 w-6 h-6" />
                </div>
                About Business
              </h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line text-lg">
                {business.description}
              </p>
            </div>

            {/* Gallery Section (id="gallery" lagaya) */}
            <div id="gallery" className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 scroll-mt-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-5">Gallery & Menu</h2>
              <BusinessGallery 
                images={business.media?.gallery || []} 
                businessName={business.name} 
              />
            </div>

            {/* Review Form (id="reviews" lagaya) */}
            <div id="reviews" className="scroll-mt-24">
              <ReviewForm businessId={business._id.toString()} />
            </div>
            
          </div>

       {/* Sidebar (Right Side - Contact/Map) */}
          {/* 🔥 FIX: Yahan 'lg:sticky lg:top-24 self-start' lagaya taaki dono box ek sath stick ho 🔥 */}
          <div className="space-y-6 lg:sticky lg:top-24 self-start">
            
            {/* Action Buttons Box (Yahan se 'lg:sticky lg:top-24' hata diya) */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-100">
                <div className="text-center w-full">
                  <div className="text-4xl font-extrabold text-gray-900 flex items-center justify-center gap-2">
                    {business.averageRating || "0.0"} <Star className="w-8 h-8 text-yellow-400 fill-current" />
                  </div>
                  <p className="text-sm font-medium text-gray-500 mt-2">{business.totalReviews || 0} Ratings & Reviews</p>
                </div>
              </div>
              <div className="space-y-4">
                <a href={`https://wa.me/${business.contact?.whatsapp}`} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#1DA851] text-white py-4 px-4 rounded-xl font-bold text-lg transition-transform hover:scale-[1.02] shadow-sm"><MessageCircle className="w-6 h-6" /> WhatsApp Now</a>
                <a href={`tel:${business.contact?.phone}`} className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white py-4 px-4 rounded-xl font-bold text-lg transition-transform hover:scale-[1.02] shadow-sm"><Phone className="w-6 h-6" /> Call Business</a>
              </div>
            </div>

            {/* Address Box (id="location" yahan rahega for Tabs functionality) */}
            <div id="location" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-5 scroll-mt-24">
              <h3 className="text-xl font-bold text-gray-900">Location & Address</h3>
              <div className="flex items-start gap-4 text-gray-600">
                <div className="bg-red-100 p-2 rounded-lg flex-shrink-0 mt-1"><MapPin className="w-6 h-6 text-red-600" /></div>
                <p className="leading-relaxed text-lg">{business.location?.address}, {business.location?.city}, {business.location?.state} - {business.location?.pincode}</p>
              </div>
             <a 
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${business.name}, ${business.location?.address}, ${business.location?.city}`)}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label={`Get directions to ${business.name}`}
                className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-xl font-semibold transition-colors mt-6"
              >
                <Navigation className="w-5 h-5 text-blue-600" /> 
                Get Directions
              </a>
            </div>

          </div>
        </div>

        <RelatedSlider businesses={relatedBusinesses} categorySlug={categorySlug} />
      </div>
    </div>
  );
}