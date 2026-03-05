import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Review } from "@/lib/models/Review";
import { Business } from "@/lib/models/Business";
import { User } from "@/lib/models/User";
import { currentUser } from "@clerk/nextjs/server";

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
    // 1. Check karo ki user logged in hai ya nahi
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: "Review dene ke liye login karna zaroori hai!" }, { status: 401 });
    }

    await connectToDatabase();
    const body = await req.json();
    const { businessId, rating, comment } = body;

    if (!rating || !comment) {
      return NextResponse.json({ error: "Rating aur comment dono dena zaroori hai." }, { status: 400 });
    }

    // 2. User ko MongoDB me dhoondo. Agar nahi hai, toh naya bana lo (Webhook bypass trick)
    let dbUser = await User.findOne({ clerkId: clerkUser.id });
    if (!dbUser) {
      dbUser = await User.create({
        clerkId: clerkUser.id,
        name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'User',
        email: clerkUser.emailAddresses[0]?.emailAddress || '',
      });
    }

    // 3. Check karo ki is user ne is dukan ko pehle toh review nahi diya?
    const existingReview = await Review.findOne({ user: dbUser._id, business: businessId });
    if (existingReview) {
      return NextResponse.json({ error: "Bhai, tum pehle hi review de chuke ho!" }, { status: 400 });
    }

    // 4. Naya Review save karo
    const newReview = await Review.create({
      user: dbUser._id,
      business: businessId,
      rating: Number(rating),
      comment: comment,
    });

    // 5. Dukaan ki Average Rating aur Total Reviews update karo
    const allReviews = await Review.find({ business: businessId });
    const totalReviews = allReviews.length;
    // Saari ratings ka total sum nikal ke average nikalna
    const avgRating = allReviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews;

    await Business.findByIdAndUpdate(businessId, {
      totalReviews: totalReviews,
      averageRating: avgRating.toFixed(1) // 4.5 jaisa format rakhne ke liye
    });

    return NextResponse.json({ message: "Review mast add ho gaya!" }, { status: 201 });
  } catch (error) {
    console.error("Review Error:", error);
    return NextResponse.json({ error: "Server mein kuch gadbad hui." }, { status: 500 });
  }
}