'use client';

import { useEffect, useState } from 'react';
import { Menu, Newspaper } from 'lucide-react';
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminStatsCards from "@/components/admin/AdminStatsCards";
import BusinessList from "@/components/admin/BusinessList";
import CategoryList from "@/components/admin/CategoryList";
import ReviewsList from "@/components/admin/ReviewsList";
import CategoryForm from "@/components/admin/CategoryForm";
import BusinessForm from "@/components/admin/BusinessForm";
import BannerSettings from './BannerSettings';
import BlogForm from './BlogForm'; 
import BlogList from './BlogList';

export default function AdminDashboardClient() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    // 🔥 FIX: Yahan array mein 'blogs' aur 'add-blog' bhi allow kiya hai 🔥
    if (['businesses', 'categories', 'reviews', 'add-business', 'add-category', 'banners', 'blogs', 'add-blog'].includes(hash)) {
       setActiveTab(hash);
    } else {
       setActiveTab('dashboard');
    }
  }, []);

  return (
    <div className="flex h-screen w-full bg-[#f8fafc] overflow-hidden font-sans text-slate-800">
      
      {/* Sidebar Wrapper */}
      <div className={`fixed inset-y-0 left-0 z-50 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <AdminSidebar activeSection={activeTab} setActiveSection={setActiveTab} />
      </div>

      {/* Main Content Wrapper */}
      <main className="flex-1 flex flex-col h-full w-full overflow-hidden">
        
        {/* Top Header */}
        <div className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm shrink-0">
          <div className="px-6 py-4 max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
               <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden text-slate-500 hover:text-slate-800 bg-slate-100 p-2 rounded-lg transition-colors">
                 <Menu className="w-5 h-5" />
               </button>
               <div>
                  <h1 className="text-xl md:text-2xl font-bold text-slate-900 mb-0.5">Admin Dashboard</h1>
                  <p className="text-xs text-slate-500 hidden sm:block font-medium">Manage your platform efficiently</p>
               </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 w-full">
          <div className="max-w-7xl mx-auto">
            
            {/* 1. Dashboard Overview */}
            {activeTab === 'dashboard' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <AdminStatsCards />
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Welcome to Control Center</h2>
                    <p className="text-slate-500 max-w-2xl mx-auto">Use the sidebar navigation to manage businesses, add new categories, and monitor customer reviews across your platform.</p>
                </div>
              </div>
            )}

            {/* 2. ADD BUSINESS FORM */}
            {activeTab === 'add-business' && (
              <div className="animate-in fade-in duration-300 max-w-5xl mx-auto">
                <BusinessForm onSuccess={() => setActiveTab('businesses')} onCancel={() => setActiveTab('dashboard')} />
              </div>
            )}

            {/* 3. ADD CATEGORY FORM */}
            {activeTab === 'add-category' && (
              <div className="animate-in fade-in duration-300 max-w-3xl mx-auto">
                <CategoryForm onSuccess={() => setActiveTab('categories')} onCancel={() => setActiveTab('dashboard')} />
              </div>
            )}

            {/* 4. Business List */}
            {activeTab === 'businesses' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <BusinessList />
              </div>
            )}

            {/* 5. Category List */}
            {activeTab === 'categories' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <CategoryList />
              </div>
            )}

            {/* 6. Reviews List */}
            {activeTab === 'reviews' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <ReviewsList />
              </div>
            )}

            {/* 7. Banner Settings */}
            {activeTab === 'banners' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <BannerSettings />
              </div>
            )}

         {/* 🔥 8. ADD/EDIT BLOG FORM 🔥 */}
            {activeTab === 'add-blog' && (
              <div className="animate-in fade-in duration-300 max-w-5xl mx-auto">
                <BlogForm 
                  editingId={editingBlogId} 
                  onSuccess={() => { setActiveTab('blogs'); setEditingBlogId(null); }} 
                  onCancel={() => { setActiveTab('blogs'); setEditingBlogId(null); }} 
                />
              </div>
            )}

            {/* 🔥 9. BLOGS LIST 🔥 */}
            {activeTab === 'blogs' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                {/* Yahan se Edit dabane par form khulega */}
                <BlogList onEdit={(id) => { setEditingBlogId(id); setActiveTab('add-blog'); }} />
              </div>
            )}

          </div>
        </div>
      </main>
      
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden" onClick={() => setSidebarOpen(false)}></div>
      )}
    </div>
  );
}