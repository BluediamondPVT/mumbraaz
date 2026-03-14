import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Business } from "@/lib/models/Business";
import { Category } from "@/lib/models/Category";
import { Review } from "@/lib/models/Review";

export const dynamic = 'force-dynamic'; // Taaki stats hamesha fresh aayein

export async function GET() {
  try {
    await connectToDatabase();

    // 1. Total counts nikal rahe hain
    const totalBusinesses = await Business.countDocuments();
    const totalCategories = await Category.countDocuments();
    const totalReviews = await Review.countDocuments();

    // 2. Platform ki Average Rating nikal rahe hain
    const allReviews = await Review.find({}, 'rating').lean();
    let averageRating = 0;
    
    if (allReviews.length > 0) {
      const sum = allReviews.reduce((acc, curr) => acc + (curr.rating || 0), 0);
      averageRating = Number((sum / allReviews.length).toFixed(1));
    }

    // 3. JSON format mein return kar rahe hain
    return NextResponse.json({
      totalBusinesses,
      totalCategories,
      totalReviews,
      averageRating
    }, { status: 200 });

  } catch (error) {
    console.error("Stats Fetch Error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}