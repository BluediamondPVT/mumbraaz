/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com", // Teri asli images ke liye
      },
      {
        protocol: "https",
        hostname: "placehold.co", // Dummy images ke liye jo code mein hain
      }
    ],
  },
};

export default nextConfig;