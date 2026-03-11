'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Search, Edit, Trash, MapPin, Phone, Star, Store } from 'lucide-react';
import toast from 'react-hot-toast';
import BusinessForm from './BusinessForm';

interface Business {
  _id: string;
  name: string;
  slug: string;
  category: { name: string; slug: string } | null;
  location: { city: string; address: string };
  contact: { phone: string };
  averageRating: number;
  status: string;
  media: { thumbnail: string };
  createdAt: string;
}

export default function BusinessList() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/businesses');
      const data = await response.json();
      setBusinesses(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error('Failed to load businesses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      const response = await fetch(`/api/businesses/${id}`, { method: 'DELETE' });
      const data = await response.json();

      if (response.ok) {
        toast.success('Business deleted successfully');
        setBusinesses(businesses.filter(b => b._id !== id));
      } else {
        toast.error(data.error || 'Failed to delete');
      }
    } catch (err) {
      toast.error('Error deleting business');
    }
  };

  const handleFormSuccess = () => {
    setEditingId(null);
    setShowForm(false);
    fetchBusinesses(); // Refresh list after edit
  };

  const filteredBusinesses = businesses.filter(b => 
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      b.location.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 relative">
      
      {/* Top Bar: Search & Count */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:max-w-md">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
           <input 
              type="text" 
              placeholder="Search by name or city..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none text-sm transition-all"
           />
        </div>
        <div className="text-sm font-bold text-gray-600 bg-blue-50 text-blue-700 px-4 py-2 rounded-xl border border-blue-100 whitespace-nowrap">
           Total Businesses: {filteredBusinesses.length}
        </div>
      </div>

      {/* Main Table Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-100 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4">Business Details</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Location & Contact</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                // Loading Skeletons
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="flex gap-3"><div className="w-12 h-12 bg-gray-200 rounded-lg"></div><div className="space-y-2"><div className="h-4 bg-gray-200 rounded w-32"></div><div className="h-3 bg-gray-200 rounded w-24"></div></div></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                    <td className="px-6 py-4"><div className="space-y-2"><div className="h-4 bg-gray-200 rounded w-24"></div><div className="h-3 bg-gray-200 rounded w-20"></div></div></td>
                    <td className="px-6 py-4"><div className="h-6 bg-gray-200 rounded-full w-20 mx-auto"></div></td>
                    <td className="px-6 py-4 text-right"><div className="h-8 bg-gray-200 rounded w-16 ml-auto"></div></td>
                  </tr>
                ))
              ) : filteredBusinesses.length === 0 ? (
                // Empty State
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <Store className="w-12 h-12 text-gray-300 mb-3" />
                      <p className="text-lg font-bold text-gray-800">No businesses found</p>
                      <p className="text-sm">Try adjusting your search or add a new business.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                // Actual Data Rows
                filteredBusinesses.map((biz) => (
                  <tr key={biz._id} className="hover:bg-blue-50/50 transition-colors group">
                    {/* 1. Business Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-200 shrink-0 bg-gray-100">
                          <Image 
                            src={biz.media?.thumbnail || "https://placehold.co/100x100"} 
                            alt={biz.name} fill sizes="48px" className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{biz.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-gray-500">/{biz.slug}</span>
                            {biz.averageRating > 0 && (
                              <span className="flex items-center gap-1 text-[10px] font-bold text-yellow-600 bg-yellow-100 px-1.5 py-0.5 rounded">
                                <Star className="w-3 h-3 fill-current" /> {biz.averageRating}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* 2. Category */}
                    <td className="px-6 py-4 font-medium text-gray-700">
                      {biz.category?.name || <span className="text-red-400 italic">None</span>}
                    </td>

                    {/* 3. Location & Contact */}
                    <td className="px-6 py-4">
                      <div className="space-y-1 text-xs text-gray-600">
                        <p className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-red-400" /> {biz.location.city}
                        </p>
                        <p className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-green-500" /> {biz.contact?.phone || "N/A"}
                        </p>
                      </div>
                    </td>

                    {/* 4. Status */}
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold capitalize
                        ${biz.status === 'approved' ? 'bg-green-100 text-green-700' : 
                          biz.status === 'rejected' ? 'bg-red-100 text-red-700' : 
                          'bg-yellow-100 text-yellow-700'}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${biz.status === 'approved' ? 'bg-green-500' : biz.status === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'}`}></span>
                        {biz.status}
                      </span>
                    </td>

                    {/* 5. Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => { setEditingId(biz._id); setShowForm(true); }}
                          aria-label="Edit business"
                          className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(biz._id, biz.name)}
                          aria-label="Delete business"
                          className="p-2 text-red-600 bg-red-50 hover:bg-red-600 hover:text-white rounded-lg transition-colors"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modern Blur Modal for Edit Form */}
      {showForm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
           {/* Modal Backdrop */}
           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowForm(false)}></div>
           
           {/* Modal Content */}
           <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl bg-transparent animate-in fade-in zoom-in-95 duration-200 scrollbar-hide">
             <BusinessForm
               editingId={editingId || undefined}
               onSuccess={handleFormSuccess}
               onCancel={() => setShowForm(false)}
             />
           </div>
        </div>
      )}
    </div>
  );
}