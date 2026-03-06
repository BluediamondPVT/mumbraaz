import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { MapPin, LayoutDashboard } from "lucide-react";
import NavSearchBar from "@/components/layout/NavSearchBar"; // 🔥 Naya Import

export default async function Navbar() {
  const user = await currentUser();
  const isAdmin = user?.publicMetadata?.role === "admin";

  return (
    <nav className="bg-gradient-to-r from-red-400 to-red-500 sticky top-0 z-50 shadow-md">
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
                <Link href="/register" className="bg-white hover:bg-gray-100 text-red-500 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
                  Register
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                {isAdmin && (
                  <Link href="/admin" className="flex items-center gap-2 bg-black bg-opacity-20 hover:bg-opacity-30 text-white px-3 py-2 rounded-lg text-sm font-medium transition-all">
                    <LayoutDashboard className="w-4 h-4" />
                  </Link>
                )}
                <UserButton 
                  appearance={{
                    elements: { avatarBox: "w-9 h-9 border-2 border-white shadow-sm" }
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* 🔥 YAHAN APNA LIVE SEARCH BAR AAYEGA 🔥 */}
        <div className="flex justify-center">
          <NavSearchBar />
        </div>
        
      </div>
    </nav>
  );
}