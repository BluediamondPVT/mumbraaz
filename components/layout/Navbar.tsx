import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { MapPin, LayoutDashboard, Search } from "lucide-react";

export default async function Navbar() {
  const user = await currentUser();
  const isAdmin = user?.publicMetadata?.role === "admin";

  return (
    <nav className="bg-gradient-to-r from-red-400 to-red-500 sticky top-0 z-50">
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Top Row: Logo and User Actions */}
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <MapPin className="w-5 h-5" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">
              Mumbra <span className="text-yellow-200">BiZ</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {!user ? (
              <div className="flex items-center gap-3">
                <Link href="/login" className="text-sm font-medium text-white hover:text-gray-100 transition-colors">
                  Login
                </Link>
                <Link href="/register" className="bg-white hover:bg-gray-100 text-red-500 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  Register
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                {isAdmin && (
                  <Link href="/admin" className="flex items-center gap-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-black px-3 py-2 rounded-lg text-sm font-medium transition-all">
                    <LayoutDashboard className="w-4 h-4" />
                    
                  </Link>
                )}
                <UserButton 
                  appearance={{
                    elements: { avatarBox: "w-9 h-9 border-2 border-white" }
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Search Bar Row */}
        <div className="pb-4 flex flex-col sm:flex-row gap-3 items-stretch max-w-4xl">
          <div className="flex items-center bg-white bg-opacity-90 hover:bg-opacity-100 rounded-lg px-4 py-2 flex-1 transition-all">
            <MapPin className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0" />
            <input 
              type="text" 
              placeholder="Select Location" 
              className="w-full bg-transparent focus:outline-none text-gray-700 text-sm"
            />
          </div>
          
          <div className="flex items-center bg-white bg-opacity-90 hover:bg-opacity-100 rounded-lg px-4 py-2 flex-1 transition-all">
            <Search className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0" />
            <input 
              type="text" 
              placeholder="Enter Keyword here..." 
              className="w-full bg-transparent focus:outline-none text-gray-700 text-sm"
            />
          </div>

          <button className="bg-white hover:bg-gray-50 text-red-500 font-semibold px-6 py-2 rounded-lg transition-colors w-full sm:w-auto flex items-center justify-center gap-2">
            <span>Search</span>
          </button>
        </div>
      </div>
    </nav>
  );
}