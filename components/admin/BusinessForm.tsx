"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Store, Loader2, ImagePlus, X } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";

export default function BusinessForm() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Image States
  const [thumbnailUrl, setThumbnailUrl] = useState(""); 
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]); // Multiple images ke liye state

  const [formData, setFormData] = useState({
    name: "", description: "", categoryId: "", phone: "", whatsapp: "", address: "", city: "Thane", pincode: "",
  });

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!thumbnailUrl) {
      toast.error("Bhai, ek Cover Photo toh upload karni padegi!");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/businesses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // thumbnail aur gallery dono ka data sath bhej rahe hain
        body: JSON.stringify({ ...formData, thumbnail: thumbnailUrl, gallery: galleryUrls }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message);
        // Form Reset
        setFormData({ name: "", description: "", categoryId: "", phone: "", whatsapp: "", address: "", city: "Thane", pincode: "" });
        setThumbnailUrl(""); 
        setGalleryUrls([]); // Gallery bhi clear kardo
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
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mt-8">
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Store className="text-blue-600" />
        Add New Business
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* 📸 COVER Image Upload Section */}
        <div className="p-6 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 flex flex-col items-center justify-center">
          <h3 className="font-semibold text-gray-700 mb-4 w-full text-center">Cover Photo (Main Image)</h3>
          {thumbnailUrl ? (
            <div className="relative w-full max-w-sm h-48 rounded-lg overflow-hidden shadow-md">
              <img src={thumbnailUrl} alt="Cover" className="w-full h-full object-cover" />
              <button 
                type="button" 
                onClick={() => setThumbnailUrl("")} 
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-md text-xs font-bold transition-colors"
              >
                Change
              </button>
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
                <button type="button" onClick={() => open()} className="flex flex-col items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors py-8">
                  <ImagePlus className="w-10 h-10" />
                  <span className="font-medium">Click to Upload Cover</span>
                </button>
              )}
            </CldUploadWidget>
          )}
        </div>

        {/* 📸 GALLERY Images Upload Section */}
        <div className="p-6 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-700">Gallery / Menu Photos</h3>
            <CldUploadWidget 
              uploadPreset="ml_default" 
              options={{ multiple: true }} // Allow multiple image selection
              onSuccess={(result: any) => {
                setGalleryUrls((prev) => [...prev, result.info.secure_url]);
                toast.success("Added to Gallery!");
              }}
            >
              {({ open }) => (
                <button type="button" onClick={() => open()} className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1.5 rounded-md text-sm font-bold flex items-center gap-1.5 transition-colors">
                  <ImagePlus className="w-4 h-4" />
                  Add Photos
                </button>
              )}
            </CldUploadWidget>
          </div>

          {/* Gallery Preview Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {galleryUrls.map((url, index) => (
              <div key={index} className="relative aspect-square rounded-lg overflow-hidden shadow-sm border border-gray-200 group">
                <img src={url} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
                <button 
                  type="button" 
                  onClick={() => setGalleryUrls(galleryUrls.filter((_, i) => i !== index))} 
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            {galleryUrls.length === 0 && (
              <div className="col-span-full text-center text-gray-400 text-sm py-8">
                No gallery images added yet.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Baaki ka Text Form same hai */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
          <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 text-gray-900" placeholder="e.g. Sharma Punjabi Dhaba" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select name="categoryId" required value={formData.categoryId} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 text-gray-900 bg-white">
            <option value="" disabled>Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea name="description" required value={formData.description} onChange={handleChange} rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 text-gray-900" placeholder="Business ke baare mein kuch likhein..."></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
          <input type="text" name="phone" required value={formData.phone} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 text-gray-900" placeholder="10 digit number" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp Number</label>
          <input type="text" name="whatsapp" required value={formData.whatsapp} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 text-gray-900" placeholder="91XXXXXXXXXX" />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Address</label>
          <input type="text" name="address" required value={formData.address} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 text-gray-900" placeholder="Shop No, Building, Area" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
          <input type="text" name="city" required value={formData.city} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 text-gray-900" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
          <input type="text" name="pincode" required value={formData.pincode} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 text-gray-900" />
        </div>
      </div>

      <button type="submit" disabled={loading} className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-70">
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {loading ? "Saving Business..." : "Save Business"}
      </button>
    </form>
  );
}