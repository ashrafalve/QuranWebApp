'use client';

import { useState, useEffect, useMemo } from 'react';
import { fetchSurahs, fetchJuzList } from '@/utils/api';
import { Surah, Juz } from '@/types';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, X, Home, BookOpen, Navigation, Bookmark, LayoutPanelLeft } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useAppStore } from '@/store/useAppStore';

export default function SurahSidebar() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [juzList, setJuzList] = useState<Juz[]>([]);
  const [activeTab, setActiveTab] = useState<'surah' | 'juz' | 'page'>('surah');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  
  const { isSurahSidebarOpen, setSurahSidebarOpen } = useAppStore();

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/surah', label: 'Read Quran', icon: BookOpen },
    { href: '#', label: 'Go to Ayah', icon: Navigation, disabled: true },
    { href: '#', label: 'Bookmarks', icon: Bookmark, disabled: true },
    { href: '#', label: 'More', icon: LayoutPanelLeft, disabled: true },
  ];

  useEffect(() => {
    setMounted(true);
    const loadData = async () => {
      try {
        const [surahData, juzData] = await Promise.all([
          fetchSurahs(),
          fetchJuzList(),
        ]);
        setSurahs(surahData);
        setJuzList(juzData);
      } catch (error) {
        console.error('Failed to load data', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Update active tab based on current pathname
  useEffect(() => {
    if (pathname.includes('/juz')) {
      setActiveTab('juz');
    } else if (pathname.startsWith('/surah')) {
      setActiveTab('surah');
    }
  }, [pathname]);

  // On mobile, if we navigate, close the sidebar
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setSurahSidebarOpen(false);
    }
  }, [pathname, setSurahSidebarOpen]);

  const filteredSurahs = useMemo(() => {
    if (!search.trim()) return surahs;
    const lower = search.toLowerCase();
    return surahs.filter(s =>
      s.englishName.toLowerCase().includes(lower) ||
      s.id.toString() === search
    );
  }, [surahs, search]);

  if (!mounted) {
    return <div className={cn("hidden w-[320px] h-full bg-background border-r border-border flex-col", !isHomePage && "lg:flex")} />;
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isSurahSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[90] lg:hidden animate-in fade-in duration-300"
          onClick={() => setSurahSidebarOpen(false)}
        />
      )}

      <div className={cn(
        "fixed inset-y-0 left-0 lg:static z-[100] w-[320px] h-full bg-background border-r border-border flex flex-col transition-all duration-300 transform",
        isSurahSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        isHomePage ? "lg:hidden" : "lg:flex" // Hide on desktop home page
      )} suppressHydrationWarning>
        {/* Header - Mobile Only */}
        <div className="p-6 flex items-center justify-between lg:hidden" suppressHydrationWarning>
          <div className="flex items-center gap-3">
             <div className="bg-primary p-2 rounded-xl">
               <BookOpen className="w-5 h-5 text-white" />
             </div>
             <h2 className="font-bold text-lg text-foreground">Menu</h2>
          </div>
          
          <button 
            onClick={() => setSurahSidebarOpen(false)}
            className="p-2 hover:bg-card rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-muted" />
          </button>
        </div>

        {/* Main Nav Links (Mobile Only) */}
        <div className="px-4 pb-6 lg:hidden" suppressHydrationWarning>
          <div className="space-y-1 bg-card/50 p-2 rounded-2xl border border-border/50">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={(e) => {
                   if (item.disabled) {
                     e.preventDefault();
                     alert('Coming Soon');
                   } else {
                     setSurahSidebarOpen(false);
                   }
                }}
                className={cn(
                  "flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold transition-all",
                  pathname === item.href 
                    ? "bg-primary text-white shadow-lg shadow-primary/20" 
                    : "text-muted hover:bg-border/30 hover:text-foreground",
                  item.disabled && "opacity-50 cursor-not-allowed"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="px-6 mb-6">
          <div className="h-px bg-border/50 w-full" />
        </div>

        {/* Tabs */}
        <div className="px-4 pb-4 space-y-4" suppressHydrationWarning>
          <div className="bg-card rounded-2xl p-1 flex" suppressHydrationWarning>
            <button
              onClick={() => setActiveTab('surah')}
              className={cn(
                "flex-1 py-2.5 text-[11px] font-bold rounded-xl transition-all",
                activeTab === 'surah'
                  ? "bg-background text-foreground shadow-sm border border-border/50"
                  : "text-muted hover:text-foreground"
              )}
            >
              Surah
            </button>
            <button
              onClick={() => setActiveTab('juz')}
              className={cn(
                "flex-1 py-2.5 text-[11px] font-bold rounded-xl transition-all",
                activeTab === 'juz'
                  ? "bg-background text-foreground shadow-sm border border-border/50"
                  : "text-muted hover:text-foreground"
              )}
            >
              Juz
            </button>
            <button
              onClick={() => setActiveTab('page')}
              className={cn(
                "flex-1 py-2.5 text-[11px] font-bold rounded-xl transition-all",
                activeTab === 'page'
                  ? "bg-background text-foreground shadow-sm border border-border/50"
                  : "text-muted hover:text-foreground"
              )}
            >
              Page
            </button>
          </div>

          {/* Search */}
          <div className="relative group" suppressHydrationWarning>
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search Surah..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-card border border-border group-focus-within:border-primary/50 rounded-xl py-3 pl-11 pr-4 text-sm text-foreground placeholder-muted outline-none transition-all"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-3 pb-[80px] space-y-1.5 custom-scrollbar" suppressHydrationWarning>
          {loading ? (
            Array.from({ length: 15 }).map((_, i) => (
              <div key={i} className="h-16 animate-pulse bg-card rounded-xl" />
            ))
          ) : activeTab === 'surah' ? (
            filteredSurahs.map((surah) => (
              <Link
                key={surah.id}
                href={`/surah/${surah.id}`}
                className={cn(
                  "flex items-center gap-4 p-3.5 rounded-xl border border-transparent transition-all group",
                  pathname === `/surah/${surah.id}` ? "bg-primary/10 border-primary/20 shadow-sm" : "hover:bg-card hover:border-border"
                )}
              >
                <div className={cn(
                  "relative w-10 h-10 flex items-center justify-center bg-card rounded-xl rotate-45 transition-all duration-500 shadow-sm",
                  pathname === `/surah/${surah.id}` ? "bg-primary text-white" : "group-hover:bg-primary text-muted group-hover:text-white"
                )}>
                  <span className="-rotate-45 font-bold text-xs">{surah.id}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={cn(
                    "font-bold text-sm truncate",
                    pathname === `/surah/${surah.id}` ? "text-primary" : "text-foreground"
                  )}>{surah.englishName.replace(/-/g, ' ')}</h4>
                  <p className="text-[10px] text-muted font-bold uppercase tracking-wider mt-1 truncate">{surah.englishNameTranslation}</p>
                </div>
                <div className="text-right">
                  <p className={cn(
                    "font-amiri text-lg leading-none transition-colors",
                    pathname === `/surah/${surah.id}` ? "text-primary" : "text-foreground group-hover:text-primary"
                  )}>{surah.arabicName.split(' ')[1] || surah.arabicName}</p>
                </div>
              </Link>
            ))
          ) : activeTab === 'juz' ? (
            (juzList || []).map((juz) => (
              <Link
                key={juz.id}
                href={`/surah/juz/${juz.id}`}
                className={cn(
                  "flex items-center gap-4 p-3.5 rounded-xl border border-transparent transition-all group",
                  pathname === `/surah/juz/${juz.id}` ? "bg-primary/10 border-primary/20 shadow-sm" : "hover:bg-card hover:border-border"
                )}
              >
                <div className={cn(
                  "relative w-10 h-10 flex items-center justify-center bg-card rounded-xl transition-all duration-300",
                  pathname === `/surah/juz/${juz.id}` ? "bg-primary text-white shadow-md" : "group-hover:bg-primary text-muted group-hover:text-white"
                )}>
                  <span className="font-bold text-xs">{juz.id}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={cn(
                    "font-bold text-sm",
                    pathname === `/surah/juz/${juz.id}` ? "text-primary" : "text-foreground"
                  )}>
                    Juz {juz.id}
                  </h4>
                  <p className="text-[10px] text-muted font-bold uppercase tracking-wider mt-1">
                    Ayahs {juz.startAyah} - {juz.endAyah} • {juz.surahCount} surahs
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <div className="p-8 text-center text-muted">
              <p className="font-bold mb-2">Page Navigation</p>
              <p className="text-sm">Coming Soon</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
