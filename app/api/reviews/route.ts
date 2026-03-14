import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Review } from "@/lib/models/Review";
import { Business } from "@/lib/models/Business";
import { User } from "@/lib/models/User";
import { currentUser } from "@clerk/nextjs/server";

export const dynamic = 'force-dynamic'; // 🔥 Cache hata dega, hamesha live data aayega

export async function GET() {
  try {
    await connectToDatabase();
    const reviews = await Review.find({})
      .populate('user', 'name email')
      .populate('business', 'name')
      .sort({ createdAt: -1 })
      .lean();
      
    return NextResponse.json(reviews, { status: 200 });
  } catch (error) {
    console.error("Reviews Fetch Error:", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) return NextResponse.json({ error: "Login karna zaroori hai!" }, { status: 401 });

    await connectToDatabase();
    const body = await req.json();
    const { businessId, rating, comment } = body;

    if (!rating || !comment) return NextResponse.json({ error: "Rating/comment missing" }, { status: 400 });

    let dbUser = await User.findOne({ clerkId: clerkUser.id });
    if (!dbUser) {
      dbUser = await User.create({
        clerkId: clerkUser.id,
        name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'User',
        email: clerkUser.emailAddresses[0]?.emailAddress || '',
      });
    }

    const existingReview = await Review.findOne({ user: dbUser._id, business: businessId });
    if (existingReview) return NextResponse.json({ error: "Pehle hi review de chuke ho!" }, { status: 400 });

    const newReview = await Review.create({ user: dbUser._id, business: businessId, rating: Number(rating), comment });

    const allReviews = await Review.find({ business: businessId });
    const avgRating = allReviews.reduce((acc, curr) => acc + curr.rating, 0) / allReviews.length;

    await Business.findByIdAndUpdate(businessId, { totalReviews: allReviews.length, averageRating: avgRating.toFixed(1) });

    return NextResponse.json({ message: "Review added!" }, { status: 201 });
  } catch (error) {
    console.error("Review POST Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}