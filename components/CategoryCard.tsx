"use client"; 

import Link from "next/link";

interface CategoryCardProps {
  slug: string;
  name: string;
  iconUrl: string;
  businessCount: number;
}

export default function CategoryCard({
  slug,
  name,
  iconUrl,
  businessCount,
}: CategoryCardProps) {
  return (
    <Link href={`/${slug}`}>
      <div className="category-card">
        <div className="category-icon">
          {iconUrl ? (
            <img src={iconUrl} alt={name} />
          ) : (
            <div className="icon-placeholder">{name.charAt(0)}</div>
          )}
        </div>
        <h3 className="category-name">{name}</h3>
        <p className="category-count">{businessCount} listings</p>
      </div>

      <style jsx>{`
        .category-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          padding: 10px 6px;
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(20px);
          border: 2px solid rgba(255, 255, 255, 0.9);
          border-radius: 16px;
          text-align: center;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          text-decoration: none;
          color: inherit;
          box-shadow: 0 3px 9px rgba(79, 70, 229, 0.15);
        }

        .category-card:hover {
          transform: translateY(-8px);
          background: rgba(255, 255, 255, 0.9);
          border-color: #4f46e5;
          box-shadow: 0 8px 24px rgba(79, 70, 229, 0.15);
        }

        .category-icon {
          width: 56px;
          height: 56px;
          border-radius: 12px;
          background: linear-gradient(135deg, #eef2ff, #e0e7ff);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          flex-shrink: 0;
        }

        .category-icon img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .icon-placeholder {
          font-size: 24px;
          font-weight: 600;
          color: #4f46e5;
          line-height: 1;
        }

        .category-name {
          font-size: 14px;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
          line-height: 1.4;
          max-height: 2.8em;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .category-count {
          font-size: 12px;
          color: #64748b;
          margin: 0;
          font-weight: 500;
        }
      `}</style>
    </Link>
  );
}