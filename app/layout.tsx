import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; 
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";
import Preloader from "@/components/Preloader";
import ConditionalFooter from "@/components/ConditionalFooter"; // 🔥 Naya import

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://mumbraaz.vercel.app"), 
  title: {
    default: "MumbraBiZ | Best Local City Directory & Services",
    template: "%s | MumbraBiZ",
  },
  description: "Find the best local businesses, services, and professionals in Mumbra and Thane. Connect, review, and grow together.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "MumbraBiZ | Local City Directory",
    description: "Find the best local businesses and services in your city.",
    url: "https://mumbraaz.vercel.app", // 🔥 Yahan bhi domain update kar diya maine
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
          
          {/* 🔥 Puraane <Footer /> ki jagah ye laga diya 🔥 */}
          <ConditionalFooter />
          
        </body>
      </html>
    </ClerkProvider>
  );
}