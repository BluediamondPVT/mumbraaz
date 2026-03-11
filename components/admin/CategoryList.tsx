'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image'; // 🔥 Image optimization
import { Layers, Edit, Trash, Plus, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import CategoryForm from './CategoryForm';

interface Category {
  _id: string;
  name: string;
  slug: string;
  iconUrl?: string;
  isActive: boolean;
  createdAt: string;
}

export default function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || 'Category deleted successfully');
        setCategories(categories.filter(cat => cat._id !== id));
      } else {
        toast.error(data.error || 'Failed to delete category');
      }
    } catch (err) {
      toast.error('Error deleting category');
    }
  };

  const handleEdit = (id: string) => {
    setEditingId(id);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setEditingId(null);
    setShowForm(false);
    fetchCategories();
  };

  const handleFormCancel = () => {
    setEditingId(null);
    setShowForm(false);
  };

  // Filter logic
  const filteredCategories = categories.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
             <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm animate-pulse flex flex-col gap-4 h-48">
                 <div className="w-14 h-14 bg-gray-200 rounded-xl"></div>
                 <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                 <div className="h-4 bg-gray-100 rounded w-1/2"></div>
             </div>
          ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-red-700 flex items-center gap-4">
        <div className="bg-red-100 p-3 rounded-full"><Trash className="text-red-500 w-6 h-6" /></div>
        <div>
           <p className="font-bold text-lg">Error loading categories</p>
           <p className="text-sm opacity-80">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 relative">
      
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        
        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
           <input 
              type="text" 
              placeholder="Search categories..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-green-500 focus:bg-white transition-all text-sm outline-none text-gray-700"
           />
        </div>

        {/* Add Button */}
        <button
          onClick={() => setShowForm(true)}
          className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 font-semibold transition-transform hover:-translate-y-0.5 shadow-sm shadow-green-200"
        >
          <Plus className="w-5 h-5" />
          Add Category
        </button>
      </div>

      {/* Grid Content */}
      {filteredCategories.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center border border-gray-100 shadow-sm flex flex-col items-center">
          <div className="bg-gray-50 p-5 rounded-full mb-4">
             <Layers className="w-12 h-12 text-gray-300" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-1">No categories found</h3>
          <p className="text-gray-500">
            {searchQuery ? `We couldn't find anything for "${searchQuery}"` : "Start by adding your first service category."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredCategories.map((category) => (
            <div
              key={category._id}
              className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-green-100 transition-all duration-300 flex flex-col group"
            >
              {/* Top Row: Icon & Status */}
              <div className="flex justify-between items-start mb-4">
                 <div className="w-14 h-14 bg-green-50 rounded-xl overflow-hidden relative flex items-center justify-center border border-green-100/50 shrink-0">
                    {category.iconUrl ? (
                      <Image
                        src={category.iconUrl}
                        alt={category.name}
                        fill
                        sizes="56px"
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <Layers className="text-green-500 w-6 h-6" />
                    )}
                 </div>
                 <span
                    className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase ${
                      category.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {category.isActive ? 'Active' : 'Hidden'}
                  </span>
              </div>

              {/* Middle Row: Text Data */}
              <div className="flex-1 mb-6">
                  <h4 className="font-bold text-gray-900 text-lg leading-tight mb-1 group-hover:text-green-600 transition-colors">{category.name}</h4>
                  <p className="text-xs font-mono text-gray-400 bg-gray-50 inline-block px-2 py-0.5 rounded">/{category.slug}</p>
                  <p className="text-[11px] text-gray-400 mt-3 font-medium">Added: {new Date(category.createdAt).toLocaleDateString()}</p>
              </div>

              {/* Bottom Row: Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-50">
                <button
                  onClick={() => handleEdit(category._id)}
                  className="flex-1 bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-600 hover:text-blue-600 px-3 py-2 rounded-lg flex items-center justify-center gap-1.5 text-sm font-semibold transition-all"
                >
                  <Edit className="w-4 h-4" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(category._id, category.name)}
                  className="flex-1 bg-white border border-gray-200 hover:border-red-300 hover:bg-red-50 text-gray-600 hover:text-red-600 px-3 py-2 rounded-lg flex items-center justify-center gap-1.5 text-sm font-semibold transition-all"
                >
                  <Trash className="w-4 h-4" /> Trash
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modern Blur Modal for Form */}
      {showForm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
           {/* Backdrop */}
           <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={handleFormCancel}></div>
           
           {/* Modal Content */}
           <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-transparent animate-in fade-in zoom-in-95 duration-200">
             <CategoryForm
               editingId={editingId || undefined}
               onSuccess={handleFormSuccess}
               onCancel={handleFormCancel}
             />
           </div>
        </div>
      )}

    </div>
  );
}