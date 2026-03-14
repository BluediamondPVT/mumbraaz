import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Blog } from "@/lib/models/Blog";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    await connectToDatabase();
    
    // 🔥 URL se check kar rahe hain ki request Admin Panel se aayi hai kya
    const { searchParams } = new URL(req.url);
    const isAdmin = searchParams.get('admin') === 'true';

    // 🔥 Agar admin hai toh sab dikhao {}, warna sirf published { isActive: true }
    const query = isAdmin ? {} : { isActive: true };

    const blogs = await Blog.find(query).sort({ createdAt: -1 }).lean();
    return NextResponse.json(blogs);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    
    // SEO-friendly slug generate karna (e.g., "Best Cafes" -> "best-cafes")
    const slug = body.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    // Check agar slug already exist karta hai
    const existingBlog = await Blog.findOne({ slug });
    if (existingBlog) {
      return NextResponse.json({ error: "Is title ka blog pehle se hai, title thoda change karo." }, { status: 400 });
    }

    const newBlog = await Blog.create({ ...body, slug });
    return NextResponse.json({ message: "Blog saved successfully!", blog: newBlog }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save blog" }, { status: 500 });
  }
}