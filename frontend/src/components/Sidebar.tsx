'use client';

import { useState, useEffect } from 'react';
import { fetchSurahs } from '@/utils/api';
import { Surah } from '@/types';
import Link from 'next/link';
import { Search, LayoutGrid, ListFilter, BookOpen, Send, Bookmark, LayoutPanelLeft, Home } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useTheme } from '@/components/Providers';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

const HomeIcon = Home;

const menuItems = [
  { icon: HomeIcon, href: '/', label: 'Home' },
  { icon: BookOpen, href: '/surah', label: 'Quran' },
  { icon: LayoutGrid, href: '/apps', label: 'Apps' },
  { icon: Send, href: '/share', label: 'Share' },
  { icon: Bookmark, href: '/bookmarks', label: 'Bookmarks' },
  { icon: LayoutPanelLeft, href: '/more', label: 'More' },
];

export default function Sidebar() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { theme } = useTheme();
  const pathname = usePathname();

  useEffect(() => {
    const loadSurahs = async () => {
      try {
        const data = await fetchSurahs();
        setSurahs(data);
      } catch (error) {
        console.error('Failed to load surahs', error);
      } finally {
        setLoading(false);
      }
    };
    loadSurahs();
  }, []);

  const filteredSurahs = surahs.filter(s => 
    s.englishName.toLowerCase().includes(search.toLowerCase()) ||
    s.id.toString() === search
  );

  // Logo: always white (grayscale + brightness-0 + invert), regardless of theme
  const logoClass = "object-contain grayscale brightness-0 invert";

  return (
    <aside className="hidden md:flex flex-col items-center py-6 w-[80px] bg-background border-r border-border z-50 transition-colors duration-300">
      {/* Top Logo */}
      <div className="mb-12 flex justify-center w-full px-2">
        <Link href="/" className="bg-primary p-2.5 rounded-xl shadow-lg shadow-primary/20 hover:scale-110 transition-transform flex items-center justify-center overflow-hidden w-12 h-12">
          <Image 
            src="/quranlogo.png" 
            alt="Logo" 
            width={32} 
            height={32} 
            className={logoClass}
            priority
          />
        </Link>
      </div>

      {/* Navigation Icons - Centered */}
      <div className="flex-1 flex flex-col gap-8 w-full items-center justify-center">
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
