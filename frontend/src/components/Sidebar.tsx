'use client';

import { useState, useEffect } from 'react';
import { fetchSurahs } from '@/utils/api';
import { Surah } from '@/types';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { HomeIconCustom, ReadQuranIconCustom, NavigationIconCustom, BookmarkIconCustom, MoreIconCustom } from './CustomIcons';
import { cn } from '@/utils/cn';
import { useTheme } from '@/components/Providers';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

const menuItems = [
  { icon: HomeIconCustom, href: '/', label: 'Home' },
  { icon: ReadQuranIconCustom, href: '/surah', label: 'Read Quran' },
  { icon: NavigationIconCustom, href: '#', label: 'Go to Ayah', disabled: true },
  { icon: BookmarkIconCustom, href: '#', label: 'Bookmarks', disabled: true },
  { icon: MoreIconCustom, href: '#', label: 'More', disabled: true },
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

  // Logo: white for dark theme, dark for light/sepia
  const logoFilterClass = theme === 'dark' ? 'grayscale brightness-0 invert' : 'grayscale';

  return (
    <aside className="hidden lg:flex flex-col items-center py-6 w-[80px] bg-background border-r border-border z-50 transition-colors duration-300">
      {/* Top Logo */}
      <div className="mb-12 flex justify-center w-full px-2">
        <Link href="/" className="bg-primary p-2.5 rounded-xl shadow-lg shadow-primary/20 hover:scale-110 transition-transform flex items-center justify-center overflow-hidden w-12 h-12">
<Image 
             src="/quranlogo.png" 
             alt="Logo" 
             width={32} 
             height={32} 
             className={cn("object-contain", logoFilterClass)}
             priority
           />
        </Link>
      </div>

      {/* Navigation Icons - Centered */}
      <div className="flex-1 flex flex-col gap-8 w-full items-center justify-center">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const isDisabled = item.disabled;

          if (isDisabled) {
            return (
              <button
                key={item.label}
                onClick={(e) => {
                  e.preventDefault();
                  alert('Coming Soon');
                }}
                className="flex items-center justify-center w-full py-2 transition-all duration-200 group relative text-muted hover:text-foreground cursor-not-allowed"
              >
                <item.icon className="w-6 h-6 transition-transform group-hover:scale-110" />
                <div className="absolute left-20 bg-card text-foreground text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-[100] font-bold uppercase tracking-widest border border-border">
                  {item.label}
                </div>
              </button>
            );
          }

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
