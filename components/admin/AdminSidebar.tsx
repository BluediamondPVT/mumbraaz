'use client';

import { useState } from 'react';
import { 
  LayoutDashboard, Building2, Layers, Star, 
  Home, LogOut, ChevronDown, ChevronRight, 
  PlusCircle, List 
} from 'lucide-react';
import { UserButton, useUser, SignOutButton } from "@clerk/nextjs"; 
import Link from "next/link"; 

export default function AdminSidebar({ 
  activeSection, 
  setActiveSection 
}: { 
  activeSection: string, 
  setActiveSection: (section: string) => void 
}) {
  const { user, isLoaded } = useUser();
  
  // Dropdown open/close state track karne ke liye
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    businesses: false,
    categories: false,
  });

  const toggleMenu = (menu: string) => {
    setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  return (
    <aside className="w-64 h-full min-h-screen bg-white flex flex-col border-r border-slate-200 shrink-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      
      {/* Header / Logo */}
      <div className="p-6 border-b border-slate-100">
        <h2 className="text-2xl font-black tracking-tight text-slate-800">MumbraBiZ</h2>
        <p className="text-[10px] text-blue-500 font-bold tracking-widest uppercase mt-1">Admin Workspace</p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto scrollbar-hide">
        
        {/* Dashboard Link */}
        <button
          onClick={() => setActiveSection('dashboard')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 font-semibold text-sm
            ${activeSection === 'dashboard' ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}
          `}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Dashboard Overview</span>
        </button>

        {/* 🏢 Businesses Dropdown */}
        <div className="pt-2">
          <button
            onClick={() => toggleMenu('businesses')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 font-semibold text-sm text-slate-500 hover:bg-slate-50 hover:text-slate-800`}
          >
            <div className="flex items-center gap-3">
              <Building2 className={`w-5 h-5 ${openMenus.businesses ? 'text-blue-500' : ''}`} />
              <span>Businesses</span>
            </div>
            {openMenus.businesses ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
          
          {openMenus.businesses && (
            <div className="mt-1 space-y-1 pl-11 pr-2 animate-in slide-in-from-top-2 duration-200">
              <button
                onClick={() => setActiveSection('businesses')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeSection === 'businesses' ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
              >
                <List className="w-4 h-4" /> All Businesses
              </button>
              <button
                onClick={() => setActiveSection('add-business')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeSection === 'add-business' ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
              >
                <PlusCircle className="w-4 h-4" /> Add Business
              </button>
            </div>
          )}
        </div>

        {/* 📂 Categories Dropdown */}
        <div className="pt-1">
          <button
            onClick={() => toggleMenu('categories')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 font-semibold text-sm text-slate-500 hover:bg-slate-50 hover:text-slate-800`}
          >
            <div className="flex items-center gap-3">
              <Layers className={`w-5 h-5 ${openMenus.categories ? 'text-blue-500' : ''}`} />
              <span>Categories</span>
            </div>
            {openMenus.categories ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
          
          {openMenus.categories && (
            <div className="mt-1 space-y-1 pl-11 pr-2 animate-in slide-in-from-top-2 duration-200">
              <button
                onClick={() => setActiveSection('categories')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeSection === 'categories' ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
              >
                <List className="w-4 h-4" /> All Categories
              </button>
              <button
                onClick={() => setActiveSection('add-category')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeSection === 'add-category' ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
              >
                <PlusCircle className="w-4 h-4" /> Add Category
              </button>
            </div>
          )}
        </div>

        {/* ⭐ Reviews Link */}
        <div className="pt-2">
          <button
            onClick={() => setActiveSection('reviews')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 font-semibold text-sm
              ${activeSection === 'reviews' ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}
            `}
          >
            <Star className="w-5 h-5" />
            <span>Ratings & Reviews</span>
          </button>
        </div>
      </nav>

      {/* 🔥 Bottom Action Section 🔥 */}
      <div className="p-4 border-t border-slate-100 mt-auto bg-slate-50/50 flex flex-col gap-1.5">
        
        <Link 
          href="/" 
          className="w-full flex items-center gap-3 px-3 py-2 text-slate-500 hover:bg-white hover:text-slate-800 hover:shadow-sm rounded-lg transition-all text-sm font-semibold border border-transparent hover:border-slate-200"
        >
          <Home className="w-4 h-4 text-slate-400" />
          Back to Website
        </Link>

        <SignOutButton signOutOptions={{ redirectUrl: '/' }}>
          <button className="w-full flex items-center gap-3 px-3 py-2 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all text-sm font-semibold">
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </SignOutButton>

        <div className="h-px bg-slate-200 my-2 mx-2"></div>

        {/* User Profile */}
        <div className="flex items-center gap-3 p-2 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 rounded-xl transition-all cursor-pointer">
          <div className="shrink-0 flex items-center justify-center">
            {isLoaded ? (
               <UserButton  />
            ) : (
               <div className="w-8 h-8 rounded-full bg-slate-200 animate-pulse"></div>
            )}
          </div>
          <div className="flex flex-col overflow-hidden text-left">
            <p className="text-sm font-bold text-slate-800 leading-none truncate">
              {isLoaded ? user?.fullName || 'Admin User' : 'Loading...'}
            </p>
            <p className="text-[11px] text-slate-500 mt-1 truncate">
              {isLoaded ? user?.primaryEmailAddress?.emailAddress : ''}
            </p>
          </div>
        </div>

      </div>
      
    </aside>
  );
}