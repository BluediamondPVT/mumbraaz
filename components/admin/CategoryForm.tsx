"use client";

import { useState, useEffect } from "react";
import Image from "next/image"; // 🔥 Image optimization
import toast from "react-hot-toast";
import { PlusCircle, Loader2, Image as ImageIcon, X, Layers, CheckCircle2 } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary"; // 🔥 Category icon ke liye bhi Cloudinary use kiya

interface CategoryFormProps {
  editingId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function CategoryForm({ editingId, onSuccess, onCancel }: CategoryFormProps) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [iconUrl, setIconUrl] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);

  // Load existing category if editing
  useEffect(() => {
    if (editingId) {
      setInitialLoading(true);
      fetchCategory();
    }
  }, [editingId]);

  const fetchCategory = async () => {
    try {
      const res = await fetch(`/api/categories/${editingId}`);
      if (!res.ok) throw new Error("Failed to fetch category");
      const data = await res.json();
      setName(data.name);
      setSlug(data.slug);
      setIconUrl(data.iconUrl || "");
      setIsActive(data.isActive);
    } catch (error) {
      toast.error("Failed to load category");
    } finally {
      setInitialLoading(false);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/categories/${editingId}` : "/api/categories";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug, iconUrl, isActive }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Category saved successfully!");
        if (!editingId) {
          setName("");
          setSlug("");
          setIconUrl("");
          setIsActive(true);
        }
        onSuccess?.();
      } else {
        toast.error(data.error || "Failed to save category");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center animate-pulse max-w-2xl">
          <div className="w-12 h-12 bg-green-100 rounded-full mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-48"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 max-w-2xl transition-all">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="bg-green-50 p-3 rounded-xl">
             {editingId ? <Layers className="text-green-600 w-6 h-6" /> : <PlusCircle className="text-green-600 w-6 h-6" />}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">
              {editingId ? "Edit Category" : "Add New Category"}
            </h2>
            <p className="text-sm text-gray-500">Organize your platform's services.</p>
          </div>
        </div>
        
        {editingId && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            aria-label="Cancel editing"
            className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Image Upload using Cloudinary */}
      <div className="mb-8">
        <label className="block text-sm font-bold text-gray-700 mb-3">Category Icon (Optional)</label>
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          
          <div className="w-full sm:flex-1">
            {/* 🔥 CldUploadWidget for optimized image hosting 🔥 */}
            <CldUploadWidget 
                uploadPreset="ml_default" 
                onSuccess={(result: any) => {
                  setIconUrl(result.info.secure_url);
                  toast.success("Icon Uploaded!");
                }}
            >
              {({ open }) => (
                <button 
                  type="button" 
                  onClick={() => open()} 
                  className="flex flex-col items-center justify-center w-full px-4 py-8 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 hover:border-green-400 hover:bg-green-50/50 transition-colors group"
                >
                  <div className="bg-white p-3 rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                      <ImageIcon className="w-6 h-6 text-gray-400 group-hover:text-green-500" />
                  </div>
                  <span className="text-sm font-medium text-gray-600 group-hover:text-green-600">Click to upload icon</span>
                </button>
              )}
            </CldUploadWidget>
          </div>

          {/* Preview Box */}
          {iconUrl && (
            <div className="relative shrink-0">
              <div className="w-28 h-28 rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-gray-50 relative group">
                <Image
                  src={iconUrl}
                  alt="Category Icon Preview"
                  fill
                  sizes="112px"
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <button
                type="button"
                onClick={() => setIconUrl("")}
                aria-label="Remove Icon"
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 hover:scale-110 transition-all shadow-md z-10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Name and Slug */}
      <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 mb-6 space-y-5">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Category Name *</label>
          <input
            type="text"
            required
            value={name}
            onChange={handleNameChange}
            placeholder="e.g. Restaurants"
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-shadow text-gray-900"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">URL Slug *</label>
          <input
            type="text"
            required
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="e.g. restaurants"
            className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-shadow text-gray-600"
          />
          <p className="text-xs text-gray-500 mt-2 ml-1">This will be the URL: yoursite.com/<strong>{slug || 'category-name'}</strong></p>
        </div>
      </div>

      {/* Active Status Toggle */}
      {editingId && (
        <div className="mb-8 p-4 border border-gray-100 rounded-xl flex items-center justify-between bg-white">
          <div>
            <p className="text-sm font-bold text-gray-800">Category Status</p>
            <p className="text-xs text-gray-500">Hide or show this category to public.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
          </label>
        </div>
      )}

      {/* Submit Action */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          aria-label={editingId ? "Update Category" : "Save Category"}
          disabled={loading}
          className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3.5 rounded-xl font-bold text-lg transition-all transform hover:-translate-y-0.5 shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0"
        >
          {loading ? (
             <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</>
          ) : (
             <><CheckCircle2 className="w-5 h-5" /> {editingId ? "Update Category" : "Save Category"}</>
          )}
        </button>
      </div>

    </form>
  );
}