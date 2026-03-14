"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { Loader2, ImagePlus, Save, LayoutTemplate } from "lucide-react";
import imageCompression from "browser-image-compression"; // 🔥 Naya Compressor Import

export default function BannerSettings() {
  const [loading, setLoading] = useState(false);
  const [banners, setBanners] = useState({
    desktop1: "", desktop2: "", desktop3: "", mobile: ""
  });

  useEffect(() => {
    fetch("/api/banners").then(res => res.json()).then(data => {
      if (data.desktop1) setBanners(data);
    });
  }, []);

  const handleSave = async () => {
    if (!banners.desktop1 || !banners.desktop2 || !banners.desktop3 || !banners.mobile) {
      toast.error("Please upload all 4 images!");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/banners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(banners),
      });
      if (res.ok) toast.success("Banners Updated Successfully!");
      else toast.error("Failed to update banners");
    } catch (err) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 YAHAN HAI TERA 100KB WEBP CONVERSION LOGIC 🔥
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: keyof typeof banners) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Compressor Settings
    const options = {
      maxSizeMB: 0.1, // Limit: 100KB (0.1 MB)
      maxWidthOrHeight: 1200, // Max resolution
      useWebWorker: true,
      fileType: "image/webp", // 🔥 Force conversion to WebP
    };

    try {
      const loadingToast = toast.loading("Converting to WebP (<100KB)...");

      // 1. Browser mein hi image compress aur convert hogi
      const compressedFile = await imageCompression(file, options);

      toast.loading("Uploading securely...", { id: loadingToast });

      // 2. Cloudinary ke REST API pe direct bhejna
      const formData = new FormData();
      formData.append("file", compressedFile);
      formData.append("upload_preset", "ml_default"); // Apna Cloudinary preset check kar lena

      // IMPORTANT: `.env.local` mein NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME zaroor hona chahiye
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME; 
      const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await uploadRes.json();

      if (data.secure_url) {
        setBanners((prev) => ({ ...prev, [field]: data.secure_url }));
        toast.success("WebP Image Uploaded!", { id: loadingToast });
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Image processing failed!");
    }
  };

  const UploadBox = ({ label, field }: { label: string, field: keyof typeof banners }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
      <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
        <label className="block text-sm font-bold text-gray-700 mb-2">{label}</label>
        <div className="relative w-full h-32 bg-white rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
          
          {/* Hidden File Input */}
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={(e) => handleFileUpload(e, field)} 
          />

          {banners[field] ? (
            <>
              <Image src={banners[field]} alt={label} fill className="object-cover" />
              <button 
                onClick={() => setBanners({ ...banners, [field]: "" })} 
                className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-md text-xs font-bold z-10 hover:bg-red-600 transition"
              >
                Remove
              </button>
            </>
          ) : (
            <button 
              onClick={() => fileInputRef.current?.click()} 
              className="flex flex-col items-center text-gray-500 hover:text-blue-600 w-full h-full justify-center"
            >
              <ImagePlus className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">Click to Upload (Max 100KB)</span>
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
        <div className="bg-indigo-100 p-2.5 rounded-lg"><LayoutTemplate className="w-6 h-6 text-indigo-600" /></div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manage Homepage Banners</h2>
          <p className="text-sm text-gray-500">Upload images. We will automatically convert them to WebP and compress under 100KB.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <UploadBox label="Desktop Image 1 (Left)" field="desktop1" />
        <UploadBox label="Desktop Image 2 (Center)" field="desktop2" />
        <UploadBox label="Desktop Image 3 (Right)" field="desktop3" />
      </div>

      <div className="max-w-xs mb-8">
        <UploadBox label="Mobile Banner Image" field="mobile" />
      </div>

      <div className="flex justify-end pt-4 border-t border-gray-100">
        <button onClick={handleSave} disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all">
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {loading ? "Saving Banners..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}