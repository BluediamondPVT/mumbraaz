import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, ArrowRight, Newspaper } from "lucide-react";
import connectToDatabase from "@/lib/db";
import { Blog } from "@/lib/models/Blog";
import type { Metadata } from "next";

// 🔥 ISR Caching: Har 1 ghante mein page auto-update hoga (Super Fast Speed)
export const revalidate = 3600; 

// 🔥 SEO Metadata 🔥
export const metadata: Metadata = {
  title: "Latest Articles & News | MumbraBiZ",
  description: "Read the latest local news, business tips, real estate updates, and guides in Mumbra and Thane.",
  alternates: {
    canonical: "/blogs",
  }
};

export default async function AllBlogsPage() {
  await connectToDatabase();
  
  // Sirf published blogs fetch karenge, sabse naye wale pehle
  const blogs = await Blog.find({ isActive: true }).sort({ createdAt: -1 }).lean();

  return (
    <main className="min-h-screen bg-slate-50 pt-8 pb-20">
      
      {/* PAGE HEADER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-4 text-blue-600">
          <Newspaper className="w-8 h-8" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">
          Our Latest Articles
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          Stay updated with local trends, business guides, lifestyle tips, and everything happening around you.
        </p>
      </div>

      {/* BLOGS GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {blogs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <Newspaper className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Articles Yet</h2>
            <p className="text-gray-500">We are working on bringing you the best content. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <Link 
                key={blog._id.toString()} 
                href={`/blog/${blog.slug}`}
                className="group flex flex-col bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* Blog Image */}
                <div className="relative w-full aspect-[16/10] bg-gray-100 overflow-hidden">
                  <Image 
                    src={blog.thumbnail || "/placeholder.jpg"} 
                    alt={blog.title} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-bold text-blue-700 shadow-sm">
                    {blog.category}
                  </div>
                </div>

                {/* Blog Content */}
                <div className="p-6 md:p-8 flex-1 flex flex-col">
                  {/* Meta */}
                  <div className="flex items-center gap-4 text-xs font-medium text-gray-500 mb-4">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-gray-400" />
                      {blog.readTime}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 leading-snug mb-4 group-hover:text-blue-600 transition-colors line-clamp-3">
                    {blog.title}
                  </h3>

                  {/* Read Article Link */}
                  <div className="mt-auto pt-5 border-t border-gray-50 flex items-center text-sm font-bold text-blue-600">
                    Read Article 
                    <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1.5 transition-transform duration-300" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

    </main>
  );
}