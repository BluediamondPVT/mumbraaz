import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Review } from "@/lib/models/Review";
import { Business } from "@/lib/models/Business";

// 🔥 FIX 1: params ko Promise type diya
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    
    // 🔥 FIX 2: params ko await karke open kiya
    const resolvedParams = await params;
    const reviewId = resolvedParams.id;

    const reviewToDelete = await Review.findById(reviewId);
    if (!reviewToDelete) return NextResponse.json({ error: "Review nahi mila" }, { status: 404 });

    const businessId = reviewToDelete.business;
    
    // 1. Review ko database se uda do
    await Review.findByIdAndDelete(reviewId);

    // 🔥 FIX 3: Check karo ki Business abhi exist karta hai ya nahi!
    const businessExists = await Business.findById(businessId);
    
    // Agar business exist karta hai, tabhi uski rating update karo
    if (businessExists) {
      const allReviews = await Review.find({ business: businessId });
      const totalReviews = allReviews.length;
      const avgRating = totalReviews > 0 ? allReviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews : 0;

      await Business.findByIdAndUpdate(businessId, { totalReviews, averageRating: avgRating === 0 ? 0 : avgRating.toFixed(1) });
    }

    return NextResponse.json({ message: "Review deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Delete Review Error:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}