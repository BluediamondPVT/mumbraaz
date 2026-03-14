import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Clock, User, ArrowLeft, ArrowRight } from "lucide-react";
import connectToDatabase from "@/lib/db";
import { Blog } from "@/lib/models/Blog";

// 🔥 1. DYNAMIC SEO METADATA 🔥
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  await connectToDatabase();
  const resolvedParams = await params;
  const blog = await Blog.findOne({ slug: resolvedParams.slug, isActive: true }).lean();
  
  if (!blog) return { title: "Blog Not Found | MumbraBiZ" };
  
  const plainTextDesc = blog.content.replace(/<[^>]*>?/gm, '').substring(0, 160) + "...";

  return {
    title: `${blog.title} | MumbraBiZ`,
    description: plainTextDesc,
    openGraph: {
      title: blog.title,
      description: plainTextDesc,
      images: [blog.thumbnail],
    }
  };
}

// 🔥 2. MAIN PAGE COMPONENT 🔥
export default async function BlogDetails({ params }: { params: Promise<{ slug: string }> }) {
  await connectToDatabase();
  const resolvedParams = await params;
  
  // 1. Current Blog Fetch Karo
  const blog = await Blog.findOne({ slug: resolvedParams.slug, isActive: true }).lean();
  if (!blog) notFound();

  // 🔥 2. RANDOM BLOGS FETCH KARO (Current ko chhod kar koi bhi 3) 🔥
  const relatedBlogs = await Blog.aggregate([
    { $match: { isActive: true, slug: { $ne: resolvedParams.slug } } }, // Current wale ko list se hatao
    { $sample: { size: 3 } } // Database se koi bhi 3 random blogs uthao
  ]);

  const formattedDate = new Date(blog.createdAt).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric'
  });

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      
      {/* HEADER HERO IMAGE SECTION */}
      <div className="relative w-full h-[40vh] md:h-[60vh] min-h-[400px]">
        <Image src={blog.thumbnail || "/placeholder.jpg"} alt={blog.title} fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
      </div>

      {/* CONTENT CONTAINER */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 md:-mt-48 relative z-10">
        
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white font-medium mb-6 transition-colors drop-shadow-md">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        {/* MAIN BLOG CARD */}
        <article className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-10 md:p-14 mb-16">
          <div className="mb-6">
            <span className="bg-blue-50 text-blue-600 font-bold px-4 py-1.5 rounded-full text-sm tracking-wide">
              {blog.category}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-8">
            {blog.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 pb-8 border-b border-gray-100 mb-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg">
                <User className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-gray-900">{blog.author || "MumbraBiZ Team"}</p>
                <p className="text-xs text-gray-500 font-medium">Author</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6 text-sm font-medium text-gray-500 ml-auto">
              <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-gray-400" />{formattedDate}</span>
              <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-gray-400" />{blog.readTime}</span>
            </div>
          </div>

          {/* HTML CONTENT */}
          <div 
            className="prose prose-lg max-w-none text-gray-900 prose-headings:font-bold prose-headings:text-black prose-p:text-gray-900 prose-p:leading-relaxed prose-a:text-blue-600 hover:prose-a:text-blue-800 prose-img:rounded-xl"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </article>

        {/* 🔥 RANDOM ARTICLES SECTION 🔥 */}
        {relatedBlogs.length > 0 && (
          <div className="border-t border-gray-200 pt-12 pb-8">
            {/* Heading change kardi gayi hai */}
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center justify-between">
              Explore More Articles
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {relatedBlogs.map((relatedBlog) => (
                <Link 
                  key={relatedBlog._id.toString()} 
                  href={`/blog/${relatedBlog.slug}`}
                  className="group flex flex-col bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-blue-100 transition-all duration-300"
                >
                  <div className="relative w-full aspect-[16/10] bg-gray-100 overflow-hidden">
                    <Image 
                      src={relatedBlog.thumbnail || "/placeholder.jpg"} 
                      alt={relatedBlog.title} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-center gap-3 text-xs font-medium text-gray-500 mb-3">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{new Date(relatedBlog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{relatedBlog.readTime}</span>
                    </div>
                    <h3 className="font-bold text-gray-900 line-clamp-2 mb-4 group-hover:text-blue-600 transition-colors">
                      {relatedBlog.title}
                    </h3>
                    <div className="mt-auto flex items-center text-sm font-bold text-blue-600">
                      Read Article <ArrowRight className="w-4 h-4 ml-1.5 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}