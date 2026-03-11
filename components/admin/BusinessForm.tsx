"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { Store, Loader2, ImagePlus, X, MapPin, Phone, CheckCircle2, MessageCircle } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";

interface BusinessFormProps {
  editingId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function BusinessForm({ editingId, onSuccess, onCancel }: BusinessFormProps) {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  
  const [thumbnailUrl, setThumbnailUrl] = useState(""); 
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]); 

  const [formData, setFormData] = useState({
    name: "", description: "", categoryId: "", phone: "", whatsapp: "", address: "", city: "Thane", pincode: "", status: "approved"
  });

  // Load Categories & Existing Business Data (if editing)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await fetch("/api/categories");
        const cats = await catRes.json();
        setCategories(cats);

        if (editingId) {
          const bizRes = await fetch(`/api/businesses/${editingId}`);
          if (!bizRes.ok) throw new Error("Failed to load business");
          const biz = await bizRes.json();
          
          setFormData({
            name: biz.name,
            description: biz.description,
            categoryId: biz.category?.toString() || "",
            phone: biz.contact?.phone || "",
            whatsapp: biz.contact?.whatsapp || "",
            address: biz.location?.address || "",
            city: biz.location?.city || "",
            pincode: biz.location?.pincode || "",
            status: biz.status || "approved"
          });
          setThumbnailUrl(biz.media?.thumbnail || "");
          setGalleryUrls(biz.media?.gallery || []);
        }
      } catch (error) {
        toast.error("Failed to load data");
      } finally {
        setInitialLoading(false);
      }
    };
    fetchData();
  }, [editingId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!thumbnailUrl) {
      toast.error("Please upload a cover photo!");
      return;
    }
    setLoading(true);

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/businesses/${editingId}` : "/api/businesses";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, thumbnail: thumbnailUrl, gallery: galleryUrls }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Saved successfully!");
        if (!editingId) {
          setFormData({ name: "", description: "", categoryId: "", phone: "", whatsapp: "", address: "", city: "Thane", pincode: "", status: "approved" });
          setThumbnailUrl(""); 
          setGalleryUrls([]);
        }
        onSuccess?.(); // Modal close karne ke liye
      } else {
        toast.error(data.error || "Failed to save");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
      return (
          <div className="bg-white p-12 rounded-2xl shadow-sm flex flex-col items-center animate-pulse">
              <div className="w-12 h-12 bg-blue-100 rounded-full mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-48"></div>
          </div>
      );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
      
      <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="bg-blue-50 p-3 rounded-xl">
              <Store className="text-blue-600 w-6 h-6" />
          </div>
          <div>
              <h2 className="text-2xl font-bold text-gray-900">{editingId ? "Edit Business" : "Add New Business"}</h2>
              <p className="text-sm text-gray-500">Fill in the details below.</p>
          </div>
        </div>
        {editingId && onCancel && (
          <button type="button" onClick={onCancel} className="text-gray-400 hover:text-red-500 p-2 bg-gray-50 rounded-lg">
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Cover Image Upload */}
        <div className="space-y-3">
          <label className="block text-sm font-bold text-gray-700">Cover Photo *</label>
          <div className="p-4 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50 flex items-center justify-center min-h-[180px]">
            {thumbnailUrl ? (
              <div className="relative w-full aspect-video rounded-xl overflow-hidden group">
                <Image src={thumbnailUrl} alt="Cover" fill className="object-cover" />
                <button type="button" onClick={() => setThumbnailUrl("")} className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-lg text-xs font-bold shadow-lg">Remove</button>
              </div>
            ) : (
              <CldUploadWidget uploadPreset="ml_default" onSuccess={(result: any) => setThumbnailUrl(result.info.secure_url)}>
                {({ open }) => (
                  <button type="button" onClick={() => open()} className="flex flex-col items-center text-gray-500 hover:text-blue-600 w-full">
                    <ImagePlus className="w-8 h-8 mb-2" />
                    <span className="text-sm font-medium">Upload Cover</span>
                  </button>
                )}
              </CldUploadWidget>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Business Name *</label>
              <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Category *</label>
              <select name="categoryId" required value={formData.categoryId} onChange={handleChange} className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="" disabled>Select Category...</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>
             {editingId && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl outline-none">
                  <option value="pending">Pending</option>
                  <option value="approved">Approved (Live)</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            )}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-bold text-gray-700 mb-1">Description *</label>
        <textarea name="description" required value={formData.description} onChange={handleChange} rows={3} className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"></textarea>
      </div>

      {/* Contact & Location Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 bg-gray-50 p-4 rounded-xl">
            <div>
              <label className="text-sm font-bold text-gray-700 mb-1 flex items-center gap-1"><Phone className="w-4 h-4"/> Phone *</label>
              <input type="text" name="phone" required value={formData.phone} onChange={handleChange} className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg outline-none" />
            </div>
            <div>
              <label className="text-sm font-bold text-gray-700 mb-1 flex items-center gap-1"><MessageCircle className="w-4 h-4"/> WhatsApp</label>
              <input type="text" name="whatsapp" value={formData.whatsapp} onChange={handleChange} className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-bold text-gray-700 mb-1 flex items-center gap-1"><MapPin className="w-4 h-4"/> Address *</label>
              <input type="text" name="address" required value={formData.address} onChange={handleChange} className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">City *</label>
              <input type="text" name="city" required value={formData.city} onChange={handleChange} className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Pincode *</label>
              <input type="text" name="pincode" required value={formData.pincode} onChange={handleChange} className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg outline-none" />
            </div>
      </div>

      <div className="flex justify-end">
          <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-md">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
            {loading ? "Saving..." : editingId ? "Update Business" : "Publish Business"}
          </button>
      </div>

    </form>
  );
}