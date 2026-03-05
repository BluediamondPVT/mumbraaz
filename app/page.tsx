import Link from "next/link";
import { Search, MapPin, LayoutGrid } from "lucide-react";
import connectToDatabase from "@/lib/db";
import { Category } from "@/lib/models/Category";

export default async function HomePage() {
  // 1. Database se direct connection aur data fetch
  await connectToDatabase();
  // Sirf wo categories laao jo active hain, aur naye wale pehle dikhao
  const categories = await Category.find({ isActive: true }).sort({ createdAt: -1 });

  return (
    <div className="min-h-screen bg-white">
      
      {/* HEADER / HERO SECTION */}
      <section className="relative bg-gradient-to-r from-blue-600 to-indigo-700 py-20 px-4 sm:px-6 lg:px-8 text-center text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Apne Shahar Ka Best Dhoondho!
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-8">
            Dhaba ho ya Hospital, sab kuch milega yahan. Explore the best local businesses.
          </p>

          {/* SEARCH BAR */}
          <div className="bg-white p-2 rounded-full shadow-lg flex flex-col sm:flex-row items-center max-w-3xl mx-auto gap-2">
            <div className="flex items-center w-full px-4 py-2 text-gray-700 border-b sm:border-b-0 sm:border-r border-gray-200">
              <MapPin className="w-5 h-5 text-gray-400 mr-2" />
              <input 
                type="text" 
                placeholder="City ya Area" 
                className="w-full focus:outline-none bg-transparent"
              />
            </div>
            <div className="flex items-center w-full px-4 py-2 text-gray-700">
              <Search className="w-5 h-5 text-gray-400 mr-2" />
              <input 
                type="text" 
                placeholder="Kya dhoondh rahe ho?" 
                className="w-full focus:outline-none bg-transparent"
              />
            </div>
            <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold transition-all">
              Search
            </button>
          </div>
        </div>
      </section>

      {/* DYNAMIC CATEGORIES GRID */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
          Explore Categories
        </h2>
        
        {categories.length === 0 ? (
          <p className="text-center text-gray-500">Koi category nahi mili. Admin panel se add karein.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {categories.map((cat) => (
              <Link href={`/${cat.slug}`} key={cat._id.toString()} className="group flex flex-col items-center">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center bg-blue-50 text-blue-600 transition-transform group-hover:scale-110 shadow-sm group-hover:shadow-md border border-blue-100">
                  {/* Abhi ke liye common icon lagaya hai, baad me images aayengi */}
                  <LayoutGrid className="w-8 h-8" />
                </div>
                <span className="mt-3 text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors capitalize">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}