'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Search, Sun, Moon, Menu, Heart, Monitor, Sunset, ChevronDown } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState, useRef } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/utils/cn';

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { setSurahSidebarOpen } = useAppStore();
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const themes = [
    { id: 'light', name: 'Light', icon: Sun },
    { id: 'dark', name: 'Dark', icon: Moon },
    { id: 'sepia', name: 'Sepia', icon: Sunset },
    { id: 'system', name: 'System', icon: Monitor },
  ];

  const CurrentIcon = themes.find(t => t.id === theme)?.icon || Sun;

  return (
    <header className="h-16 border-b border-border bg-background flex items-center justify-between px-6 z-[60] transition-colors duration-300">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setSurahSidebarOpen(true)}
          className="lg:hidden p-2 hover:bg-card rounded-lg transition-colors"
        >
          <Menu className="w-6 h-6 text-muted" />
        </button>
        <Link href="/" className="flex items-center gap-3">
          <div className="bg-primary p-1.5 rounded-lg overflow-hidden flex items-center justify-center w-9 h-9 shadow-lg shadow-primary/10">
            <Image 
              src="/quran.png" 
              alt="Logo" 
              width={28} 
              height={28} 
              className="object-contain brightness-0 invert"
              style={{ height: 'auto' }}
              priority
            />
          </div>
          <div className="hidden sm:block">
            <h1 className="font-bold text-lg leading-none text-foreground">Quran Mazid</h1>
            <p className="text-[10px] text-muted font-bold uppercase mt-1 tracking-widest">Study, and Learn The Quran</p>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <button className="p-2.5 rounded-full bg-card hover:bg-border/50 text-muted transition-colors">
          <Search className="w-5 h-5" />
        </button>
        
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
              <ChevronDown className={cn("w-2.5 h-2.5 ml-0.5 transition-transform", dropdownOpen && "rotate-180")} />
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
        
        <button className="bg-primary hover:opacity-90 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-primary/10">
          <span className="hidden sm:inline">Support Us</span>
          <Heart className="w-4 h-4 fill-white" />
        </button>
      </div>
    </header>
  );
}
