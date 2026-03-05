import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; 
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";

// Navbar import karo
import Navbar from "@/components/layout/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "City Directory | Find Best Dhabas, Cafes & More",
  description: "Apne shahar ke best local businesses, hospitals, aur shops dhoondhein.",
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
          <Toaster position="top-center" />
          
          {/* Yahan Navbar laga diya */}
          <Navbar />
          
          <main className="min-h-screen">
            {children}
          </main>

        </body>
      </html>
    </ClerkProvider>
  );
}