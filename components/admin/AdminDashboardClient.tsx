'use client';

import { useEffect, useState } from 'react';
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminStatsCards from "@/components/admin/AdminStatsCards";
import BusinessList from "@/components/admin/BusinessList";
import CategoryList from "@/components/admin/CategoryList";
import ReviewsList from "@/components/admin/ReviewsList";
import CategoryForm from "@/components/admin/CategoryForm";
import BusinessForm from "@/components/admin/BusinessForm";

export default function AdminDashboardClient() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'businesses' | 'categories' | 'reviews'>('dashboard');

  useEffect(() => {
    // Handle navigation from sidebar links
    const handleNavClick = () => {
      const hash = window.location.hash.substring(1);
      if (hash === 'overview') setActiveTab('dashboard');
      else if (hash === 'businesses') setActiveTab('businesses');
      else if (hash === 'categories') setActiveTab('categories');
      else if (hash === 'reviews') setActiveTab('reviews');
    };

    // Set initial tab based on hash
    handleNavClick();
    window.addEventListener('hashchange', handleNavClick);
    return () => window.removeEventListener('hashchange', handleNavClick);
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar activeSection={activeTab} />

      {/* Main Content */}
      <main className="flex-1 md:ml-64 overflow-y-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
          <div className="px-6 py-6 max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-1">Admin Dashboard</h1>
            <p className="text-gray-600">Manage businesses, categories, and reviews</p>
          </div>
        </div>

        {/* Content Area */}
        <div className="px-6 py-8 max-w-7xl mx-auto">
          {/* Dashboard Overview Tab */}
          {activeTab === 'dashboard' && (
            <div id="overview" className="space-y-8">
              {/* Stats Cards */}
              <AdminStatsCards />

              {/* Welcome Section */}
              <div className="bg-white rounded-lg shadow-md p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Your Admin Dashboard</h2>
                <p className="text-gray-600 mb-6">
                  Manage every aspect of your City Directory platform. Use the sidebar navigation to access different sections:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-blue-900 mb-2">📍 All Businesses</h3>
                    <p className="text-sm text-blue-700">View and manage all registered businesses with their details, status, and ratings.</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h3 className="font-semibold text-green-900 mb-2">📂 All Categories</h3>
                    <p className="text-sm text-green-700">Create, edit, and manage product/service categories for organized browsing.</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <h3 className="font-semibold text-purple-900 mb-2">⭐ Ratings & Reviews</h3>
                    <p className="text-sm text-purple-700">Monitor customer feedback with comprehensive review analytics and ratings.</p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <h3 className="font-semibold text-orange-900 mb-2">➕ Quick Actions</h3>
                    <p className="text-sm text-orange-700">Use quick add buttons in the sidebar to create new categories and businesses.</p>
                  </div>
                </div>
              </div>

              {/* Quick Add Forms */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <div className="bg-green-100 rounded-lg p-2">
                      <span className="text-green-600 text-lg">📂</span>
                    </div>
                    Add New Category
                  </h3>
                  <CategoryForm />
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <div className="bg-blue-100 rounded-lg p-2">
                      <span className="text-blue-600 text-lg">🏢</span>
                    </div>
                    Add New Business
                  </h3>
                  <BusinessForm />
                </div>
              </div>
            </div>
          )}

          {/* Businesses Tab */}
          {activeTab === 'businesses' && (
            <div id="businesses" className="space-y-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">All Businesses</h2>
                <p className="text-gray-600 mt-2">Complete list of all registered businesses on your platform</p>
              </div>
              <BusinessList />
            </div>
          )}

          {/* Categories Tab */}
          {activeTab === 'categories' && (
            <div id="categories" className="space-y-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">All Categories</h2>
                <p className="text-gray-600 mt-2">Organize and manage service/product categories</p>
              </div>
              <CategoryList />
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div id="reviews" className="space-y-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">All Ratings & Reviews</h2>
                <p className="text-gray-600 mt-2">Monitor all customer reviews and ratings across your platform</p>
              </div>
              <ReviewsList />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
