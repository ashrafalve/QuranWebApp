'use client';

import Sidebar from '@/components/Sidebar';
import SurahSidebar from '@/components/SurahSidebar';
import { usePathname } from 'next/navigation';

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <>
      {!isHomePage && <Sidebar />}
      <SurahSidebar />
      {children}
    </>
  );
}
