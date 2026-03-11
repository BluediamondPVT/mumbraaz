import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; 
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";
import Preloader from "@/components/Preloader";
import Footer from "@/components/layout/Footer"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://mumbraaz.vercel.app"), // 🔥 Apna domain laga yahan
  title: {
    default: "MumbraBiZ | Best Local City Directory & Services",
    template: "%s | MumbraBiZ", // Baaki pages pe apne aap piche MumbraBiZ lag jayega
  },
  description: "Find the best local businesses, services, and professionals in Mumbra and Thane. Connect, review, and grow together.",
  alternates: {
    canonical: "/", // Yeh Lighthouse SEO ko 100 karne ke liye bohot zaroori hai
  },
  openGraph: {
    title: "MumbraBiZ | Local City Directory",
    description: "Find the best local businesses and services in your city.",
    url: "https://teri-website.com",
    siteName: "MumbraBiZ",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} bg-gray-50 text-gray-900`}>
          <Preloader />
          <Toaster position="top-center" />
          
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}