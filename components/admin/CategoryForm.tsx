"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { PlusCircle, Loader2, Image as ImageIcon, X } from "lucide-react";

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
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Load existing category if editing
  useEffect(() => {
    if (editingId) {
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
      if (data.iconUrl) {
        setImagePreview(data.iconUrl);
      }
    } catch (error) {
      toast.error("Failed to load category");
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setIconUrl(result);
      };
      reader.readAsDataURL(file);
    }
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
        toast.success(data.message);
        if (!editingId) {
          setName("");
          setSlug("");
          setIconUrl("");
          setImagePreview(null);
          setIsActive(true);
        }
        onSuccess?.();
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error("Kuch gadbad ho gayi!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 max-w-2xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <PlusCircle className="text-blue-600" />
          {editingId ? "Edit Category" : "Add New Category"}
        </h2>
        {editingId && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Image Upload */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Category Icon/Image</label>
        <div className="flex gap-4 items-start">
          <div className="flex-1">
            <label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-600 hover:bg-blue-50 transition">
              <div className="flex flex-col items-center gap-2">
                <ImageIcon className="w-6 h-6 text-gray-400" />
                <span className="text-sm text-gray-600">Click to upload image</span>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
          {imagePreview && (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-24 h-24 rounded-lg object-cover border border-gray-200"
              />
              <button
                type="button"
                onClick={() => {
                  setImagePreview(null);
                  setIconUrl("");
                }}
                className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Name and Slug */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={handleNameChange}
            placeholder="e.g. Dhabas"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none text-gray-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">URL Slug</label>
          <input
            type="text"
            required
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="e.g. dhabas"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none bg-gray-50 text-gray-900"
          />
        </div>
      </div>

      {/* Active Status */}
      {editingId && (
        <div className="mb-6">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm font-medium text-gray-700">Active</span>
          </label>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-70"
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {loading ? "Saving..." : editingId ? "Update Category" : "Save Category"}
      </button>
    </form>
  );
}