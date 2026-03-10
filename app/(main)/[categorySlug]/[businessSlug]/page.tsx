import { notFound } from "next/navigation";
import { MapPin, Phone, Star, MessageCircle, Navigation, Info, Store } from "lucide-react";
import connectToDatabase from "@/lib/db";
import { Business } from "@/lib/models/Business";
import ReviewForm from "@/components/reviews/ReviewForm";
import ImageSlider from "@/components/business/ImageSlider";
import RelatedSlider from "@/components/business/RelatedSlider"; // 🔥 Naya Slider Import

export default async function BusinessDetailPage({
  params,
}: {
  params: Promise<{ categorySlug: string; businessSlug: string }>;
}) {
  const resolvedParams = await params;
  const { categorySlug, businessSlug } = resolvedParams;

  await connectToDatabase();

  // 1. Current Business Fetch Karo
  const business = await Business.findOne({ 
    slug: businessSlug, 
    status: "approved" 
  });

  if (!business) {
    notFound();
  }

  // 🔥 2. RELATED BUSINESSES FETCH KARO 🔥
  const relatedBusinessesRaw = await Business.find({
    category: business.category,
    _id: { $ne: business._id },
    status: "approved"
  }).limit(10); // Slider hai isliye zyada (10) manga rahe hain

  // Client Component (Slider) mein pass karne ke liye Data ko plain format mein convert kiya
  const relatedBusinesses = relatedBusinessesRaw.map(biz => ({
    _id: biz._id.toString(),
    slug: biz.slug,
    name: biz.name,
    averageRating: biz.averageRating,
    media: { thumbnail: biz.media?.thumbnail },
    location: { address: biz.location?.address, city: biz.location?.city }
  }));

  // Cover image aur gallery images ko ek array mein combine karna
  const allImages = [business.media?.thumbnail || "https://placehold.co/1200x400/png?text=No+Image+Available"];
  if (business.media?.gallery && business.media.gallery.length > 0) {
    allImages.push(...business.media.gallery);
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      
      {/* 1. Slider Cover Section */}
      <ImageSlider 
        images={allImages} 
        name={business.name} 
        city={business.location?.city} 
        state={business.location?.state} 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content (Left Side - 2 columns space) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* About Section */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 transition-shadow hover:shadow-md">
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

            {/* Gallery Section */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-5">Gallery & Menu</h2>
              
              {business.media?.gallery && business.media.gallery.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {business.media.gallery.map((imgUrl: string, index: number) => (
                    <div 
                      key={index} 
                      className="aspect-square rounded-xl overflow-hidden border border-gray-200 group relative bg-gray-100 cursor-pointer"
                    >
                      <img 
                        src={imgUrl} 
                        alt={`${business.name} gallery image ${index + 1}`} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-10 border-2 border-dashed border-gray-300 bg-gray-50 rounded-xl flex flex-col items-center justify-center text-gray-400">
                  <svg className="w-12 h-12 mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="font-medium text-gray-500">Abhi koi images upload nahi ki gayi hain.</p>
                </div>
              )}
            </div>

            {/* Review Form */}
            <ReviewForm businessId={business._id.toString()} />

          </div>

          {/* Sidebar (Right Side - 1 column space) */}
          <div className="space-y-6">
            
            {/* Action Buttons Box */}
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
                <a 
                  href={`https://wa.me/${business.contact?.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#1DA851] text-white py-4 px-4 rounded-xl font-bold text-lg transition-transform hover:scale-[1.02] shadow-sm"
                >
                  <MessageCircle className="w-6 h-6" />
                  WhatsApp Now
                </a>
                
                <a 
                  href={`tel:${business.contact?.phone}`}
                  className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white py-4 px-4 rounded-xl font-bold text-lg transition-transform hover:scale-[1.02] shadow-sm"
                >
                  <Phone className="w-6 h-6" />
                  Call Business
                </a>
              </div>
            </div>

            {/* Address Box */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-5">
              <h3 className="text-xl font-bold text-gray-900">Location & Address</h3>
              
              <div className="flex items-start gap-4 text-gray-600">
                <div className="bg-red-100 p-2 rounded-lg flex-shrink-0 mt-1">
                    <MapPin className="w-6 h-6 text-red-600" />
                </div>
                <p className="leading-relaxed text-lg">{business.location?.address}, {business.location?.city}, {business.location?.state} - {business.location?.pincode}</p>
              </div>

              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.name + " " + business.location?.city)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-xl font-semibold transition-colors mt-6"
              >
                <Navigation className="w-5 h-5 text-blue-600" />
                Get Directions
              </a>
            </div>

          </div>
        </div>

        {/* 🔥 YAHAN APNA NAYA SLIDER COMPONENT CALL KIYA HAI 🔥 */}
        <RelatedSlider businesses={relatedBusinesses} categorySlug={categorySlug} />

      </div>
    </div>
  );
}