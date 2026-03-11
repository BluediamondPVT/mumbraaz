import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/private/'], // Agar koi private folder ho toh
    },
    sitemap: 'https://mumbraaz.vercel.app/sitemap.xml', 
  };
}