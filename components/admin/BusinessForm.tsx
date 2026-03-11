"use client";

import { useState, useEffect } from "react";
import Image from "next/image"; // 🔥 Next.js Image component for fast previews
import toast from "react-hot-toast";
import { Store, Loader2, ImagePlus, X, MapPin, Phone, CheckCircle2, MessageCircle } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";

export default function BusinessForm() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  
  // Image States
  const [thumbnailUrl, setThumbnailUrl] = useState(""); 
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]); 

  const [formData, setFormData] = useState({
    name: "", description: "", categoryId: "", phone: "", whatsapp: "", address: "", city: "Thane", pincode: "",
  });

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
          setCategories(data);
          setInitialLoading(false);
      })
      .catch(() => {
          toast.error("Failed to load categories");
          setInitialLoading(false);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!thumbnailUrl) {
      toast.error("Please upload a cover photo for the business!");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/businesses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, thumbnail: thumbnailUrl, gallery: galleryUrls }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Business added successfully!");
        // Form Reset
        setFormData({ name: "", description: "", categoryId: "", phone: "", whatsapp: "", address: "", city: "Thane", pincode: "" });
        setThumbnailUrl(""); 
        setGalleryUrls([]);
      } else {
        toast.error(data.error || "Failed to add business");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
      return (
          <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center animate-pulse">
              <div className="w-12 h-12 bg-blue-100 rounded-full mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-48"></div>
          </div>
      );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100">
        <div className="bg-blue-50 p-3 rounded-xl">
            <Store className="text-blue-600 w-6 h-6" />
        </div>
        <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Add New Business</h2>
            <p className="text-sm text-gray-500">Fill in the details to list a new business on the platform.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        
        {/* 📸 COVER Image Upload Section (Left Side - 5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <label className="block text-sm font-bold text-gray-700">Cover Photo *</label>
          <div className="p-6 border-2 border-dashed border-gray-200 hover:border-blue-400 rounded-2xl bg-gray-50 flex flex-col items-center justify-center transition-colors min-h-[220px]">
            {thumbnailUrl ? (
              <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-sm group">
                <Image 
                  src={thumbnailUrl} 
                  alt="Cover Preview" 
                  fill 
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      type="button" 
                      onClick={() => setThumbnailUrl("")} 
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-transform hover:scale-105 shadow-lg flex items-center gap-2"
                    >
                      <X className="w-4 h-4" /> Remove
                    </button>
                </div>
              </div>
            ) : (
              <CldUploadWidget 
                uploadPreset="ml_default" 
                onSuccess={(result: any) => {
                  setThumbnailUrl(result.info.secure_url);
                  toast.success("Cover Image Uploaded!");
                }}
              >
                {({ open }) => (
                  <button type="button" onClick={() => open()} className="flex flex-col items-center gap-3 text-gray-500 hover:text-blue-600 transition-colors w-full h-full justify-center">
                    <div className="bg-white p-4 rounded-full shadow-sm">
                        <ImagePlus className="w-8 h-8" />
                    </div>
                    <span className="font-medium text-sm">Click to upload cover</span>
                  </button>
                )}
              </CldUploadWidget>
            )}
          </div>
        </div>

        {/* 📸 GALLERY Images Upload Section (Right Side - 7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex justify-between items-end">
             <label className="block text-sm font-bold text-gray-700">Gallery Photos <span className="font-normal text-gray-400 text-xs ml-2">(Optional)</span></label>
             <CldUploadWidget 
                uploadPreset="ml_default" 
                options={{ multiple: true }} 
                onSuccess={(result: any) => {
                  setGalleryUrls((prev) => [...prev, result.info.secure_url]);
                  toast.success("Added to Gallery!");
                }}
              >
                {({ open }) => (
                  <button type="button" onClick={() => open()} className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors">
                    <ImagePlus className="w-4 h-4" />
                    Add More
                  </button>
                )}
              </CldUploadWidget>
          </div>
          
          <div className="p-6 border border-gray-200 rounded-2xl bg-gray-50 min-h-[220px]">
            {galleryUrls.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {galleryUrls.map((url, index) => (
                  <div key={index} className="relative aspect-square rounded-xl overflow-hidden shadow-sm border border-gray-200 group">
                    <Image 
                        src={url} 
                        alt={`Gallery ${index}`} 
                        fill
                        sizes="(max-width: 768px) 33vw, 150px"
                        className="object-cover" 
                    />
                    <button 
                      type="button" 
                      onClick={() => setGalleryUrls(galleryUrls.filter((_, i) => i !== index))} 
                      className="absolute top-2 right-2 bg-red-500/90 hover:bg-red-600 text-white p-1.5 rounded-md text-xs font-bold opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-sm"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
               <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-2 py-10">
                   <Store className="w-10 h-10 opacity-20" />
                   <p className="text-sm font-medium">No gallery images added yet.</p>
               </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Text Form Section */}
      <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-6 border-b border-gray-200 pb-3">Business Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Business Name *</label>
              <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition-shadow outline-none" placeholder="e.g. Sharma Punjabi Dhaba" />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Category *</label>
              <select name="categoryId" required value={formData.categoryId} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition-shadow outline-none appearance-none cursor-pointer">
                <option value="" disabled>Select a Category...</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Description *</label>
              <textarea name="description" required value={formData.description} onChange={handleChange} rows={4} className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition-shadow outline-none resize-none" placeholder="Write a detailed description about the business..."></textarea>
            </div>
          </div>
      </div>

      {/* Contact & Location Section */}
      <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-6 border-b border-gray-200 pb-3">Contact & Location</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                  <Phone className="w-4 h-4 text-gray-400" /> Phone Number *
              </label>
              <input type="text" name="phone" required value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition-shadow outline-none" placeholder="10 digit number" />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                 <MessageCircle className="w-4 h-4 text-[#25D366]" /> WhatsApp Number
              </label>
              <input type="text" name="whatsapp" required value={formData.whatsapp} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#25D366] focus:border-[#25D366] text-gray-900 transition-shadow outline-none" placeholder="Same as phone (optional)" />
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                 <MapPin className="w-4 h-4 text-red-500" /> Full Address *
              </label>
              <input type="text" name="address" required value={formData.address} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition-shadow outline-none" placeholder="Shop No, Building Name, Street" />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">City *</label>
              <input type="text" name="city" required value={formData.city} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition-shadow outline-none" />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Pincode *</label>
              <input type="text" name="pincode" required value={formData.pincode} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition-shadow outline-none" placeholder="e.g. 400612" />
            </div>
          </div>
      </div>

      {/* Submit Action */}
      <div className="flex justify-end pt-4">
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all transform hover:-translate-y-1 shadow-[0_8px_20px_rgba(79,70,229,0.3)] flex items-center justify-center gap-3 disabled:opacity-70 disabled:hover:translate-y-0"
          >
            {loading ? (
                <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Publishing Business...
                </>
            ) : (
                <>
                    <CheckCircle2 className="w-6 h-6" />
                    Publish Business
                </>
            )}
          </button>
      </div>

    </form>
  );
}