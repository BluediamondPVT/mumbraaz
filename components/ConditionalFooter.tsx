'use client';

import { usePathname } from 'next/navigation';
import Footer from '@/components/layout/Footer'; // Tera original footer yahan import ho raha hai

export default function ConditionalFooter() {
  const pathname = usePathname();

  // Agar URL '/admin' se shuru hota hai, toh Footer mat dikhao
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  // Baaki sabhi pages par normal Footer dikhao
  return <Footer />;
}