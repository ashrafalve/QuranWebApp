'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Search, Sun, Moon, Menu, Heart, Monitor, Sunset, X } from 'lucide-react';
import { useTheme } from '@/components/Providers';
import { useEffect, useState, useRef } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/utils/cn';
import { usePathname, useRouter } from 'next/navigation';

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const { setSurahSidebarOpen } = useAppStore();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === '/';

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/surah', label: 'Read Quran' },
    { href: '#', label: 'Go to Ayah', disabled: true },
    { href: '#', label: 'Bookmarks', disabled: true },
    { href: '#', label: 'More', disabled: true },
  ];

  useEffect(() => {
    setMounted(true);
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = () => {
    if (searchValue.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchValue.trim())}`);
      setSearchOpen(false);
      setSearchValue('');
    }
  };

  const themes = [
    { id: 'light', name: 'Light', icon: Sun },
    { id: 'dark', name: 'Dark', icon: Moon },
    { id: 'sepia', name: 'Sepia', icon: Sunset },
    { id: 'system', name: 'System', icon: Monitor },
  ] as const;

  const CurrentIcon = themes.find(t => t.id === theme)?.icon || Sun;

  return (
    <header className="h-16 border-b border-border bg-background flex items-center justify-between px-6 z-[60] transition-colors duration-300">
      {/* Left - Logo / Brand */}
      <div className="flex items-center gap-6">
        <button
          onClick={() => setSurahSidebarOpen(true)}
          className="lg:hidden p-2 hover:bg-card rounded-lg transition-colors"
        >
          <Menu className="w-6 h-6 text-muted" />
        </button>
        <Link href="/" className="flex items-center gap-3">
          {isHomePage && (
            <div className="bg-primary p-2 rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center overflow-hidden w-10 h-10">
              <Image
                src="/quranlogo.png"
                alt="Logo"
                width={28}
                height={28}
                className="object-contain grayscale brightness-0 invert"
                priority
              />
            </div>
          )}
          <div>
            <h1 className="font-bold text-base text-foreground leading-none">QURAN MAZID</h1>
            <p className="text-[9px] text-muted font-bold uppercase mt-0.5 tracking-widest hidden xl:block">Read, Study, and Learn The Quran</p>
          </div>
        </Link>
      </div>

      {/* Center - Nav Links (home page only) */}
      {isHomePage && (
        <nav className="hidden md:flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
          {navItems.map((item) => {
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
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-colors text-muted hover:text-foreground hover:bg-card cursor-not-allowed"
                >
                  {item.label}
                </button>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "text-primary bg-primary/10"
                    : "text-muted hover:text-foreground hover:bg-card"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      )}

      {/* Right - Actions */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative flex items-center">
          {searchOpen ? (
            <div className="absolute right-0 flex items-center bg-card border border-primary/30 rounded-full py-1.5 pl-4 pr-2 shadow-2xl animate-in slide-in-from-right-4 duration-300 w-64 md:w-80">
              <input
                autoFocus
                type="text"
                placeholder="Search..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full bg-transparent border-none focus:ring-0 text-sm text-foreground placeholder-muted outline-none"
              />
              <button 
                onClick={() => setSearchOpen(false)}
                className="p-1.5 hover:bg-border/30 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-muted" />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setSearchOpen(true)}
              className="p-2.5 rounded-full bg-card hover:bg-border/50 text-muted transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
          )}
        </div>
        
        {/* Theme Dropdown */}
        <div className="relative" ref={dropdownRef}>
          {mounted && (
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className={cn(
                "flex items-center justify-center w-10 h-10 rounded-full bg-card border transition-all text-muted hover:text-foreground",
                dropdownOpen ? "border-primary text-primary" : "border-transparent"
              )}
            >
              <CurrentIcon className="w-4 h-4" />
            </button>
          )}

          {dropdownOpen && (
            <div className="absolute top-full right-0 mt-2 w-44 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden z-[70] animate-in fade-in zoom-in duration-200">
              <div className="p-2 space-y-1">
                {themes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setTheme(t.id);
                      setDropdownOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all",
                      theme === t.id 
                        ? "bg-primary text-white" 
                        : "text-muted hover:bg-border/30 hover:text-foreground"
                    )}
                  >
                    <t.icon className="w-4 h-4" />
                    <span>{t.name}</span>
                    {theme === t.id && <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <button className="bg-primary hover:opacity-90 text-white px-5 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-primary/10">
          <span className="hidden sm:inline">Support Us</span>
          <Heart className="w-4 h-4 fill-white" />
        </button>
      </div>
    </header>
  );
}
