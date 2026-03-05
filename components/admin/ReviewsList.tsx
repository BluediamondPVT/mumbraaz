'use client';

import { useEffect, useState } from 'react';
import { Star, User, MessageCircle } from 'lucide-react';

interface Review {
  _id: string;
  rating: number;
  comment: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  business: {
    _id: string;
    name: string;
  };
  createdAt: string;
}

export default function ReviewsList() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/reviews');
        if (!response.ok) throw new Error('Failed to fetch reviews');
        const data = await response.json();
        setReviews(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        <p className="font-semibold">Error loading reviews</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">All Ratings & Reviews</h3>
        <p className="text-sm text-gray-600 mt-1">Total: {reviews.length} reviews</p>
      </div>

      {reviews.length === 0 ? (
        <div className="p-12 text-center">
          <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">No reviews found</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {reviews.map((review) => (
            <div key={review._id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 rounded-full p-2">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{review.user.name}</p>
                    <p className="text-sm text-gray-600">{review.user.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex gap-1 justify-end mb-1">
                    {renderStars(review.rating)}
                  </div>
                  <p className="text-sm font-semibold text-blue-600">{review.rating}.0 / 5.0</p>
                </div>
              </div>

              <div className="mb-3">
                <p className="text-sm font-medium text-gray-700 mb-1">Business: {review.business.name}</p>
                <p className="text-gray-700">{review.comment}</p>
              </div>

              <p className="text-xs text-gray-500">
                {new Date(review.createdAt).toLocaleDateString()} -{' '}
                {new Date(review.createdAt).toLocaleTimeString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
