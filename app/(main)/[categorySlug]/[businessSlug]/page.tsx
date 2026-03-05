import { notFound } from "next/navigation";
import { MapPin, Phone, Star, MessageCircle, Navigation, Clock, Info } from "lucide-react";
import connectToDatabase from "@/lib/db";
import { Business } from "@/lib/models/Business";
import Link from "next/link";
import ReviewForm from "@/components/reviews/ReviewForm";
// Next.js ka Image component zyada optimize hota hai, par abhi img tag hi theek hai.

export default async function BusinessDetailPage({
  params,
}: {
  params: Promise<{ categorySlug: string; businessSlug: string }>;
}) {
  const resolvedParams = await params;
  const { categorySlug, businessSlug } = resolvedParams;

  await connectToDatabase();

  const business = await Business.findOne({ 
    slug: businessSlug, 
    status: "approved" 
  });

  if (!business) {
    notFound();
  }

  // Debugging ke liye: console pe check karna ki image URL aa raha hai ya nahi
  console.log("Business Thumbnail URL:", business.media?.thumbnail);

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* 1. Cover Image Section */}
      <div className="w-full h-64 md:h-80 lg:h-96 bg-gray-300 relative group"> {/* Height thodi badha di for better look */}
        {/* Yahan hum sure kar rahe hain ki image object cover rahe aur poori width le */}
        <img 
          src={business.media?.thumbnail || "https://placehold.co/1200x400/png?text=No+Image+Available"} 
          alt={business.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" // Thoda sa zoom effect hover pe
        />
        {/* Gradient overlay taaki text clearly dikhe */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-8 md:pb-12">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white mb-3 tracking-tight">
              {business.name}
            </h1>
            <p className="text-gray-200 text-lg md:text-xl flex items-center gap-2 font-medium">
              <MapPin className="w-6 h-6 text-red-500" /> {/* Location pin thoda highlight kar diya */}
              {business.location?.city}, {business.location?.state}
            </p>
          </div>
        </div>
      </div>

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

            {/* Baad mein yahan Menu Images aur Reviews aayenge */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-5">Gallery & Menu</h2>
              <div className="p-12 border-2 border-dashed border-gray-300 bg-gray-50 rounded-xl flex items-center justify-center text-gray-500 font-medium">
                Images aur Menu aage ke phase mein Cloudinary ke zariye add honge.
              </div>
            </div>


            <ReviewForm businessId={business._id.toString()} />

          </div>

          {/* Sidebar (Right Side - 1 column space) */}
          <div className="space-y-6">
            
            {/* Action Buttons Box */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"> {/* Sticky kiya hai taaki scroll pe sath chale */}
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

              {/* Google Maps link thoda fix kiya hai taaki encoded space sahi se handle ho */}
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
      </div>
    </div>
  );
}