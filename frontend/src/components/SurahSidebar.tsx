'use client';

import { useState, useEffect } from 'react';
import { fetchSurahs } from '@/utils/api';
import { Surah } from '@/types';
import Link from 'next/link';
import { Search, LayoutGrid, ListFilter } from 'lucide-react';
import { cn } from '@/utils/cn';

export default function SurahSidebar() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

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

  return (
    <div className="w-[320px] h-full bg-background border-r border-border flex flex-col hidden lg:flex transition-colors duration-300">
      {/* Tabs */}
      <div className="p-4 space-y-4">
        <div className="bg-card rounded-2xl p-1 flex">
          <button className="flex-1 py-2.5 text-[11px] font-bold bg-background text-foreground rounded-xl shadow-sm border border-border/50">Surah</button>
          <button className="flex-1 py-2.5 text-[11px] font-bold text-muted hover:text-foreground transition-colors">Juz</button>
          <button className="flex-1 py-2.5 text-[11px] font-bold text-muted hover:text-foreground transition-colors">Page</button>
        </div>

        {/* Search */}
        <div className="relative group">
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

      <div className="flex-1 overflow-y-auto px-3 pb-[80px] space-y-1.5 custom-scrollbar">
        {loading ? (
          Array.from({ length: 15 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse bg-card rounded-xl" />
          ))
        ) : (
          filteredSurahs.map((surah) => (
            <Link 
              key={surah.id} 
              href={`/surah/${surah.id}`}
              className="flex items-center gap-4 p-3.5 rounded-xl hover:bg-card border border-transparent hover:border-border transition-all group"
            >
              <div className="relative w-10 h-10 flex items-center justify-center bg-card group-hover:bg-primary text-muted group-hover:text-white rounded-xl rotate-45 transition-all duration-500 shadow-sm">
                 <span className="-rotate-45 font-bold text-xs">{surah.id}</span>
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm text-foreground truncate">{surah.englishName}</h4>
                <p className="text-[10px] font-bold text-muted uppercase tracking-wider mt-1 truncate">{surah.englishNameTranslation}</p>
              </div>

              <div className="text-right">
                <p className="font-amiri text-lg text-foreground group-hover:text-primary transition-colors leading-none">{surah.arabicName.split(' ')[1] || surah.arabicName}</p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
