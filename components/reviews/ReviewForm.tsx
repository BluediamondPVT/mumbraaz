"use client";

import { useState, useEffect } from "react";
import { Star, Loader2, UserCircle2, ChevronDown, ChevronUp } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/nextjs"; 
import Link from "next/link";

export default function ReviewForm({ businessId }: { businessId: string }) {
  const { isLoaded, isSignedIn } = useAuth(); 

  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  
  const [reviews, setReviews] = useState<any[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  
  // 🔥 READ MORE KE LIYE NAYA STATE 🔥
  const [showAllReviews, setShowAllReviews] = useState(false); 

  useEffect(() => {
    fetchReviews();
  }, [businessId]);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/reviews?businessId=${businessId}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch (error) {
      console.error("Failed to fetch reviews");
    } finally {
      setLoadingReviews(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Kam se kam 1 star toh de bhai!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessId, rating, comment }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Review posted successfully!");
        setRating(0);
        setComment("");
        fetchReviews(); 
      } else {
        toast.error(data.error || "Kuch gadbad ho gayi");
      }
    } catch (error) {
      toast.error("Kuch gadbad ho gayi!");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Sirf 4 reviews dikhane ka logic 🔥
  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 4);

  if (!isLoaded) {
    return (
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 mt-8 flex justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-8">
      
      {/* 📝 REVIEW LIKHNE KA FORM */}
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Leave a Review</h3>

        {!isSignedIn ? (
          <div className="bg-gray-50 p-6 rounded-xl text-center border border-gray-200">
            <p className="text-gray-600 mb-4">Review likhne ke liye login karna zaroori hai.</p>
            <Link 
              href="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium inline-block transition-colors"
            >
              Log in to Review
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= (hoveredRating || rating)
                        ? "text-yellow-400 fill-current drop-shadow-sm"
                        : "text-gray-200"
                    } transition-colors`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-500 font-medium">
                {rating > 0 ? `${rating} Stars` : "Select rating"}
              </span>
            </div>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              placeholder="Apna experience share karo..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none text-gray-900 bg-gray-50/50"
            ></textarea>

            <button
              type="submit"
              disabled={loading}
              className="bg-gray-900 hover:bg-black text-white px-6 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2 disabled:opacity-70"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Submitting..." : "Post Review"}
            </button>
          </form>
        )}
      </div>

      {/* 🗣️ REVIEWS DIKHANE KI LIST */}
      {loadingReviews ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : reviews.length > 0 ? (
        /* 🔥 Agar reviews 0 se zyada hain, tabhi ye box dikhega 🔥 */
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            Customer Reviews <span className="text-sm font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{reviews.length}</span>
          </h3>

          <div className="space-y-6">
            {displayedReviews.map((review) => (
              <div key={review._id} className="pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                      <UserCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{review.userName || "Anonymous User"}</h4>
                      <p className="text-xs text-gray-500 font-medium">
                        {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 bg-yellow-50 px-2 py-1 rounded-lg">
                    <span className="text-sm font-bold text-yellow-700 mr-1">{review.rating}</span>
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed pl-13">
                  {review.comment}
                </p>
              </div>
            ))}
          </div>

          {/* 🔥 READ MORE BUTTON (Sirf tab dikhega jab reviews 4 se zyada honge) 🔥 */}
          {reviews.length > 4 && (
            <button
              onClick={() => setShowAllReviews(!showAllReviews)}
              className="mt-8 w-full py-3.5 bg-gray-50 hover:bg-gray-100 text-blue-600 font-bold rounded-xl flex items-center justify-center gap-2 transition-colors border border-gray-200"
            >
              {showAllReviews ? (
                <>Show Less <ChevronUp className="w-5 h-5" /></>
              ) : (
                <>Read all {reviews.length} Reviews <ChevronDown className="w-5 h-5" /></>
              )}
            </button>
          )}

        </div>
      ) : null} 
      {/* 👆 Agar 0 reviews hue toh null return karega (Hide ho jayega) */}

    </div>
  );
}