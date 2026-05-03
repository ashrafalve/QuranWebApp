'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, Send, Bookmark, LayoutPanelLeft, BookOpen } from 'lucide-react';
import { cn } from '@/utils/cn';
import Image from 'next/image';

const HomeIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 2L3 8V20H21V8L12 2Z" />
    <circle cx="12" cy="13" r="3" />
  </svg>
);

const menuItems = [
  { icon: HomeIcon, href: '/', label: 'Home' },
  { icon: BookOpen, href: '/surah', label: 'Quran' },
  { icon: LayoutGrid, href: '/apps', label: 'Apps' },
  { icon: Send, href: '/share', label: 'Share' },
  { icon: Bookmark, href: '/bookmarks', label: 'Bookmarks' },
  { icon: LayoutPanelLeft, href: '/more', label: 'More' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col items-center py-6 w-[80px] bg-background border-r border-border z-50 transition-colors duration-300">
      {/* Top Logo */}
      <div className="mb-12 flex justify-center w-full px-2">
        <Link href="/" className="bg-primary p-2.5 rounded-xl shadow-lg shadow-primary/20 hover:scale-110 transition-transform flex items-center justify-center overflow-hidden w-12 h-12">
           <Image 
            src="/quran.png" 
            alt="Logo" 
            width={32} 
            height={32} 
            className="object-contain brightness-0 invert" 
            style={{ height: 'auto' }} 
            priority
          />
        </Link>
      </div>

      {/* Navigation Icons - Exactly Middle Aligned */}
      <div className="flex flex-col gap-8 w-full items-center">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-center w-full py-2 transition-all duration-200 group relative",
                isActive ? "text-primary" : "text-muted hover:text-foreground"
              )}
            >
              <item.icon 
                className={cn(
                  "w-6 h-6 transition-transform group-hover:scale-110", 
                  isActive ? "text-primary" : ""
                )} 
              />
              
              {isActive && (
                <div className="absolute left-0 w-1 h-6 bg-primary rounded-r-full" />
              )}
              
              <div className="absolute left-20 bg-card text-foreground text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-[100] font-bold uppercase tracking-widest border border-border">
                {item.label}
              </div>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
