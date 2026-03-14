"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { Loader2, ImagePlus, CheckCircle2, X } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";

interface BlogFormProps {
  editingId?: string | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function BlogForm({ editingId, onSuccess, onCancel }: BlogFormProps) {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!editingId);
  const [thumbnailUrl, setThumbnailUrl] = useState("");

  const [formData, setFormData] = useState({
    title: "", category: "", author: "MumbraBiZ Team", content: "", isActive: "true"
  });

  // 🔥 Fetch Blog Data for Editing 🔥
  useEffect(() => {
    if (editingId) {
      fetch(`/api/blogs/${editingId}`)
        .then(res => res.json())
        .then(data => {
          setFormData({
            title: data.title, category: data.category, author: data.author || "MumbraBiZ Team", content: data.content, isActive: data.isActive.toString()
          });
          setThumbnailUrl(data.thumbnail);
        })
        .finally(() => setInitialLoading(false));
    }
  }, [editingId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!thumbnailUrl) return toast.error("Please upload a thumbnail image!");
    
    setLoading(true);
    try {
      const textOnly = formData.content.replace(/<[^>]*>?/gm, ''); 
      const wordCount = textOnly.trim().split(/\s+/).length;
      const calculatedReadTime = Math.max(1, Math.ceil(wordCount / 200)) + " min read";

      const url = editingId ? `/api/blogs/${editingId}` : "/api/blogs";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, thumbnail: thumbnailUrl, readTime: calculatedReadTime, isActive: formData.isActive === "true" }),
      });

      if (res.ok) {
        toast.success(editingId ? "Blog updated!" : "Blog published!");
        onSuccess?.();
      } else {
        toast.error("Failed to save blog");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-xl font-bold">{editingId ? "Edit Blog" : "Write New Blog"}</h2>
        {onCancel && (
          <button type="button" onClick={onCancel} className="p-2 bg-gray-50 rounded-lg hover:text-red-500 transition-colors"><X className="w-5 h-5"/></button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-bold mb-2">Thumbnail *</label>
          <div className="p-4 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 flex items-center justify-center min-h-[160px]">
            {thumbnailUrl ? (
              <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                <Image src={thumbnailUrl} alt="Cover" fill className="object-cover" />
                <button type="button" onClick={() => setThumbnailUrl("")} className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded text-xs shadow-lg z-10 hover:bg-red-600">Remove</button>
              </div>
            ) : (
              <CldUploadWidget uploadPreset="ml_default" options={{ maxFiles: 1 }} onSuccess={(result: any) => setThumbnailUrl(result.info.secure_url)}>
                {({ open }) => (
                  <button type="button" onClick={() => open()} className="flex flex-col items-center text-gray-500 hover:text-blue-600 w-full h-full justify-center">
                    <ImagePlus className="w-8 h-8 mb-2" />
                    <span className="text-sm font-medium">Click to Upload Thumbnail</span>
                  </button>
                )}
              </CldUploadWidget>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div><label className="block text-sm font-bold mb-1">Blog Title *</label><input type="text" name="title" required value={formData.title} onChange={handleChange} className="w-full px-4 py-2 bg-white border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-bold mb-1">Category *</label><input type="text" name="category" required value={formData.category} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none" /></div>
            <div>
              <label className="block text-sm font-bold mb-1">Status</label>
              <select name="isActive" value={formData.isActive} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none">
                <option value="true">Published</option><option value="false">Draft</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-bold mb-1 flex items-center gap-2">Blog Content * <span className="text-xs font-normal text-gray-500">(HTML Supported)</span></label>
        <textarea name="content" required value={formData.content} onChange={handleChange} rows={10} className="w-full px-4 py-3 bg-white border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm leading-relaxed"></textarea>
      </div>

      <div className="flex justify-end">
        <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2">
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
          {loading ? "Saving..." : editingId ? "Update Blog" : "Publish Blog"}
        </button>
      </div>
    </form>
  );
}