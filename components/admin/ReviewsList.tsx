'use client';

import { useEffect, useState } from 'react';
import { Star, User, MessageCircle, Trash2, Loader2, Store } from 'lucide-react'; // 🔥 Store add kar diya
import toast from 'react-hot-toast';

interface Review {
  _id: string;
  rating: number;
  comment: string;
  user: { _id: string; name: string; email: string; } | null;
  business: { _id: string; name: string; } | null;
  createdAt: string;
}

export default function ReviewsList() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/reviews');
      
      const text = await response.text(); 
      
      try {
        const data = JSON.parse(text);
        if (!response.ok) throw new Error(data.error || 'Failed to fetch reviews');
        setReviews(Array.isArray(data) ? data : []);
      } catch (parseError) {
        console.error("API Error HTML Response:", text); 
        throw new Error("Backend Crash! JSON ki jagah HTML aaya. Terminal check kar.");
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    
    setDeletingId(id);
    try {
      const res = await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
      const text = await res.text();

      try {
        const data = JSON.parse(text);
        if (res.ok) {
          toast.success("Review deleted successfully!");
          setReviews((prev) => prev.filter((review) => review._id !== id));
        } else {
          toast.error(data.error || "Failed to delete review");
        }
      } catch (parseError) {
        toast.error("Delete API crashed. Terminal check kar!");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setDeletingId(null);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
    ));
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-blue-600 w-8 h-8" /></div>;

  if (error) return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
      <p className="font-semibold">Error loading reviews</p>
      <p className="text-sm">{error}</p>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-gray-900">All Ratings & Reviews</h3>
          <p className="text-sm text-gray-500 mt-0.5">Manage customer feedback</p>
        </div>
        <div className="bg-white px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-bold text-gray-700 shadow-sm">
          Total: {reviews.length}
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="p-16 text-center">
          <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No reviews found yet.</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {reviews.map((review) => (
            <div key={review._id} className="p-6 hover:bg-slate-50 transition-colors relative group">
              <button
                onClick={() => handleDelete(review._id)}
                disabled={deletingId === review._id}
                className="absolute top-6 right-6 p-2 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors opacity-0 group-hover:opacity-100"
              >
                {deletingId === review._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              </button>

              <div className="flex justify-between items-start mb-4 pr-12">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 rounded-full p-2.5 shrink-0"><User className="w-5 h-5 text-blue-600" /></div>
                  <div>
                    <p className="font-bold text-gray-900 leading-tight">{review.user?.name || <span className="italic text-gray-400">Unknown</span>}</p>
                    <p className="text-xs text-gray-500">{review.user?.email || "No email"}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex gap-1 justify-end mb-1">{renderStars(review.rating)}</div>
                </div>
              </div>

              <div className="mb-4 bg-white p-4 rounded-xl border border-gray-100">
                <p className="text-[13px] font-bold text-gray-800 mb-1 flex items-center gap-2">
                  <Store className="w-3.5 h-3.5 text-gray-400" />
                  {review.business?.name || <span className="text-red-500 italic font-normal">Business Deleted</span>}
                </p>
                <p className="text-sm text-gray-600">"{review.comment}"</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}