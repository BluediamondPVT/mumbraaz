import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Business } from "@/lib/models/Business";
import { Category } from "@/lib/models/Category";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";
    const location = searchParams.get("location") || "";

    await connectToDatabase();

    // 1. Fetch Categories
    let categoryFilter: any = { isActive: true };
    if (q) {
      categoryFilter.name = { $regex: q, $options: "i" };
    }
    const categories = await Category.find(categoryFilter).limit(6).select("name slug iconUrl");

    // 2. Fetch Businesses (Agar Keyword HO ya Location HO)
    let businesses: any[] = [];
    if (q || location) { // 🔥 Yahan change kiya hai
      let bizFilter: any = { status: "approved" };
      
      // Agar keyword hai toh name/description me dhundo
      if (q) {
        bizFilter.$or = [
          { name: { $regex: q, $options: "i" } },
          { description: { $regex: q, $options: "i" } }
        ];
      }

      // Agar location hai toh city match karo
      if (location) {
        bizFilter["location.city"] = { $regex: location, $options: "i" };
      }

      businesses = await Business.find(bizFilter)
        .populate("category", "slug")
        .limit(5)
        .select("name slug media.thumbnail location.city location.address");
    }

    return NextResponse.json({ categories, businesses });
  } catch (error) {
    console.error("Search Error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}