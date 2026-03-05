import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { MapPin, LayoutDashboard } from "lucide-react";

export default async function Navbar() {
  // userId aur poora user object nikal rahe hain
  const user = await currentUser();
  const isAdmin = user?.publicMetadata?.role === "admin";

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <MapPin className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">
              City<span className="text-blue-600">Directory</span>
            </span>
          </Link>

          <div className="flex items-center gap-6">
            <Link href="/businesses" className="text-sm font-medium text-gray-600 hover:text-blue-600 hidden sm:block">
              All Businesses
            </Link>
            
            {!user ? (
              <div className="flex items-center gap-4">
                <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-blue-600">
                  Log in
                </Link>
                <Link href="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  Sign up
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                {/* Agar Admin hai toh Dashboard ka button dikhao */}
                {isAdmin && (
                  <Link href="/admin" className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                    <LayoutDashboard className="w-4 h-4" />
                    
                  </Link>
                )}
                
                <UserButton 
                  appearance={{
                    elements: { avatarBox: "w-10 h-10 border-2 border-blue-100" }
                  }}
                />
              </div>
            )}
          </div>
          
        </div>
      </div>
    </nav>
  );
}