import Link from "next/link";
import Image from "next/image"; 

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
    <Link href={`/${slug}`} aria-label={`View ${name} category`}>
      <div className="flex flex-col items-center gap-1 px-2 py-2.5 bg-white/70 backdrop-blur-md border-2 border-white/90 rounded-2xl text-center transition-all duration-300 ease-out cursor-pointer text-inherit shadow-[0_3px_9px_rgba(79,70,229,0.15)] hover:-translate-y-2 hover:bg-white/90 hover:border-indigo-600 hover:shadow-[0_8px_24px_rgba(79,70,229,0.15)] group">
        
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100 flex items-center justify-center overflow-hidden shrink-0 relative mb-1">
          {iconUrl ? (
            // 🔥 Next.js Image optimization for fast loading
            <Image 
              src={iconUrl} 
              alt={`${name} icon`} 
              fill
              sizes="56px"
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
          ) : (
            <div className="text-2xl font-semibold text-indigo-600 leading-none">
              {name.charAt(0)}
            </div>
          )}
        </div>
        
        <h3 className="text-sm font-semibold text-slate-800 m-0 leading-snug line-clamp-2">
          {name}
        </h3>
        <p className="text-xs text-slate-500 m-0 font-medium">
          {businessCount} listings
        </p>

      </div>
    </Link>
  );
}