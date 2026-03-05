import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Category } from "@/lib/models/Category";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    
    // Front-end se aane wala data padho
    const body = await req.json();
    const { name, slug, iconUrl } = body;

    if (!name || !slug) {
      return NextResponse.json({ error: "Name aur Slug zaruri hain" }, { status: 400 });
    }

    // Database mein save karo
    const newCategory = await Category.create({
      name,
      slug: slug.toLowerCase(),
      iconUrl,
    });

    return NextResponse.json({ message: "Category Added Successfully", category: newCategory }, { status: 201 });
  } catch (error: any) {
    console.error("Category Error:", error);
    // Agar slug pehle se hai (unique error)
    if (error.code === 11000) {
      return NextResponse.json({ error: "Yeh Category (slug) pehle se maujood hai" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Saari categories fetch karne ke liye GET route bhi yahi bana dete hain
export async function GET() {
  try {
    await connectToDatabase();
    const categories = await Category.find({}).sort({ createdAt: -1 });
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}