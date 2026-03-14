'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Edit, Trash2, Loader2, Newspaper } from 'lucide-react';
import toast from 'react-hot-toast';

export default function BlogList({ onEdit }: { onEdit: (id: string) => void }) {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      // 🔥 YAHAN CHANGE KIYA: ?admin=true lagaya taaki drafts bhi aayein
      const res = await fetch('/api/blogs?admin=true'); 
      const data = await res.json();
      setBlogs(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bhai, sach me delete karna hai?")) return;
    
    setDeletingId(id);
    try {
      const res = await fetch(`/api/blogs/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success("Blog deleted!");
        setBlogs(blogs.filter((blog) => blog._id !== id));
      } else {
        toast.error("Failed to delete");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;

  if (blogs.length === 0) {
    return (
      <div className="bg-white p-12 rounded-2xl border text-center">
        <Newspaper className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500 font-medium">Koi blog nahi mila. Naya blog add karo!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-900">All Blogs (Published & Drafts)</h3>
        <span className="bg-white px-3 py-1 rounded-lg border text-sm font-bold shadow-sm">Total: {blogs.length}</span>
      </div>

      <div className="divide-y divide-gray-100">
        {blogs.map((blog) => (
          <div key={blog._id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-14 rounded-lg overflow-hidden border">
                <Image src={blog.thumbnail || "/placeholder.jpg"} alt={blog.title} fill className="object-cover" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 line-clamp-1">{blog.title}</h4>
                <p className="text-xs text-gray-500 mt-1">
                  <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-semibold">{blog.category}</span>
                  <span className="ml-2">{blog.readTime}</span>
                  <span className={`ml-2 font-bold ${blog.isActive ? 'text-green-500' : 'text-amber-500'}`}>
                    • {blog.isActive ? 'Published' : 'Draft'}
                  </span>
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button onClick={() => onEdit(blog._id)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors">
                <Edit className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(blog._id)} disabled={deletingId === blog._id} className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-600 hover:text-white transition-colors">
                {deletingId === blog._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}