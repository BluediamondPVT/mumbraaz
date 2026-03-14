import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { MapPin, LayoutDashboard } from "lucide-react";
import NavSearchBar from "@/components/layout/NavSearchBar"; // Tera search bar

export default async function Navbar() {
  const user = await currentUser();
  const isAdmin = user?.publicMetadata?.role === "admin";

  return (
    <nav className="bg-gradient-to-r from-red-500 to-red-600 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 🔥 FLEX-WRAP MAGIC: Desktop pe 1 Row, Mobile pe 2 Rows ekdum slim 🔥 */}
        <div className="flex flex-wrap items-center justify-between py-3 gap-y-3 md:h-20 md:py-0">
          
          {/* 1. LOGO (Hamesha Left) - Order 1 */}
          <div className="flex-shrink-0 order-1">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-white p-2 rounded-xl text-red-500 shadow-sm group-hover:scale-105 transition-transform">
                <MapPin className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <span className="text-xl md:text-3xl  font-extrabold text-white tracking-tight">
                Mumbra<span className="text-yellow-300">BiZ</span>
              </span>
            </Link>
          </div>

          {/* 2. USER ACTIONS / PROFILE (Mobile pe Right, Desktop pe bhi Right) - Order 2 on Mobile, Order 3 on Desktop */}
          <div className="flex-shrink-0 flex items-center gap-3 order-2 md:order-3">
            {!user ? (
              <>
                <Link href="/login" className="text-sm font-bold text-white/90 hover:text-white transition-colors hidden sm:block">
                  Login
                </Link>
                <Link href="/register" className="bg-white text-red-600 hover:bg-red-50 px-4 py-2 md:px-5 md:py-2.5 rounded-full text-sm font-bold transition-all shadow-sm hover:shadow">
                  Register
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-3">
                {isAdmin && (
                  <Link 
                    href="/admin" 
                    className="flex items-center gap-1.5 bg-black/20 hover:bg-black/30 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-all backdrop-blur-sm"
                    title="Admin Dashboard"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                  </Link>
                )}
                <div className="">
                  <UserButton 
                    appearance={{
                      elements: { avatarBox: "w-8 h-8 md:w-13 md:h-15 shadow-sm" }
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* 3. SEARCH BAR (Mobile pe Niche, Desktop pe Center me) - Order 3 on Mobile, Order 2 on Desktop */}
          <div className="w-full md:w-auto md:flex-1 order-3 md:order-2 md:px-8 lg:px-12 flex justify-center">
            {/* NavSearchBar ka container ab pura width lega par limit ke sath */}
            <div className="w-full max-w-2xl">
              <NavSearchBar />
            </div>
          </div>

        </div>
      </div>
    </nav>
  );
}