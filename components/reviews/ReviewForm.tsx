"use client";

import { useState } from "react";
import { Star, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/nextjs"; // 🔥 SignedIn/Out hata ke useAuth laya 🔥
import Link from "next/link";

export default function ReviewForm({ businessId }: { businessId: string }) {
  // Clerk hook se check kar rahe hain user ka status
  const { isLoaded, isSignedIn } = useAuth(); 

  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

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
        toast.success(data.message);
        setRating(0);
        setComment("");
        // Page refresh karo taaki nayi rating dikhe
        window.location.reload(); 
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error("Kuch gadbad ho gayi!");
    } finally {
      setLoading(false);
    }
  };

  // Jab tak Clerk check kar raha hai, loading dikhao (Flicker issue solve karne ke liye)
  if (!isLoaded) {
    return (
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 mt-8 flex justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 mt-8">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Leave a Review</h3>

      {/* Agar User Login NAHI hai */}
      {!isSignedIn ? (
        <div className="bg-gray-50 p-6 rounded-xl text-center border border-gray-200">
          <p className="text-gray-600 mb-4">Review likhne ke liye login karna zaroori hai.</p>
          <Link href="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium inline-block transition-colors">
            Log in to Review
          </Link>
        </div>
      ) : (
        /* Agar User Login HAI toh Form dikhao */
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Star Rating UI */}
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
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  } transition-colors`}
                />
              </button>
            ))}
            <span className="ml-2 text-sm text-gray-500 font-medium">
              {rating > 0 ? `${rating} Stars` : "Select rating"}
            </span>
          </div>

          {/* Comment Box */}
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            placeholder="Apna experience share karo..."
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none text-gray-900"
          ></textarea>

          <button
            type="submit"
            disabled={loading}
            className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2 disabled:opacity-70"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Submitting..." : "Post Review"}
          </button>
        </form>
      )}
    </div>
  );
}