'use client';

import { Building2, Layers, Star, MessageCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function AdminStatsCards() {
  const [stats, setStats] = useState({
    totalBusinesses: 0,
    totalCategories: 0,
    averageRating: 0,
    totalReviews: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [businessesRes, categoriesRes, reviewsRes] = await Promise.all([
          fetch('/api/businesses'),
          fetch('/api/categories'),
          fetch('/api/reviews'),
        ]);

        const businesses = (await businessesRes.json()) as any[];
        const categories = (await categoriesRes.json()) as any[];
        const reviews = (await reviewsRes.json()) as any[];

        const avgRating = reviews.length > 0
          ? (reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length).toFixed(1)
          : 0;

        setStats({
          totalBusinesses: businesses.length,
          totalCategories: categories.length,
          averageRating: parseFloat(avgRating as string),
          totalReviews: reviews.length,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      icon: Building2,
      label: 'Total Businesses',
      value: stats.totalBusinesses,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      icon: Layers,
      label: 'Total Categories',
      value: stats.totalCategories,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      icon: MessageCircle,
      label: 'Total Reviews',
      value: stats.totalReviews,
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
    {
      icon: Star,
      label: 'Average Rating',
      value: `${stats.averageRating} ⭐`,
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className={`${card.bgColor} rounded-lg p-6 border border-gray-100 hover:shadow-lg transition-shadow`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">{card.label}</p>
                <p className="text-3xl font-bold text-gray-900">{card.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${card.bgColor.replace('50', '100')}`}>
                <Icon className={`w-6 h-6 ${card.iconColor}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
