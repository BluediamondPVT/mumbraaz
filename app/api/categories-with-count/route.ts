import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Category } from "@/lib/models/Category";
import { Business } from "@/lib/models/Business";

export async function GET() {
  try {
    await connectToDatabase();
    
    const categories = await Category.find({ isActive: true }).sort({ createdAt: -1 });
    
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const businessCount = await Business.countDocuments({ 
          category: cat._id,
          status: 'approved'
        });
        return {
          _id: cat._id,
          name: cat.name,
          slug: cat.slug,
          iconUrl: cat.iconUrl,
          isActive: cat.isActive,
          businessCount,
        };
      })
    );

    return NextResponse.json(categoriesWithCount, { status: 200 });
  } catch (error) {
    console.error("Categories with count error:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}
