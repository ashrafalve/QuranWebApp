'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import AyahCard from './AyahCard';
import { SurahWithAyahs } from '@/types';
import { cn } from '@/utils/cn';

export default function SurahReader({ surah, surahId }: { surah: SurahWithAyahs, surahId: number }) {
  const { readingMode, settings } = useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a stable initial state to avoid hydration mismatch
    return (
      <div className="divide-y divide-border mt-10">
        {surah.ayahs.map((ayah) => (
          <AyahCard
            key={ayah.number}
            ayah={ayah}
            totalAyahs={surah.ayahs[surah.ayahs.length - 1].number}
          />
        ))}
      </div>
    );
  }

  if (readingMode) {
    return (
      <div className="mt-10">
        {/* Info row */}
        <div className="flex items-center justify-between py-6 border-b border-border mb-12 text-[10px] md:text-xs font-bold text-muted uppercase tracking-widest">
          <span>{surah.englishName.replace(/-/g, ' ')}</span>
          <span>Page: {surah.ayahs[0]?.page.toString().padStart(2, '0') || '01'}</span>
          <span>Juz: {surah.ayahs[0]?.juz.toString().padStart(2, '0') || '01'}</span>
        </div>

        {/* Reading Content */}
        <div 
          className={cn(
            "text-center leading-[3] md:leading-[3.5] text-foreground px-4", 
            settings.arabicFont === 'Amiri' ? "font-amiri" : "font-scheherazade"
          )}
          style={{ fontSize: `${settings.arabicFontSize}px` }}
          dir="rtl"
        >
          {surahId !== 1 && surahId !== 9 && (
            <div className="mb-12 font-amiri text-3xl md:text-4xl text-primary text-center">
              بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
            </div>
          )}
          {surah.ayahs.map((ayah) => (
            <span key={ayah.number}>
              {ayah.text}
              <span className="inline-flex items-center justify-center w-10 h-10 mx-2 md:mx-4 border border-border rounded-full text-base font-sans font-bold text-muted align-middle shadow-sm">
                {ayah.numberInSurah}
              </span>
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border mt-10">
      {surah.ayahs.map((ayah) => (
        <AyahCard
          key={ayah.number}
          ayah={ayah}
          totalAyahs={surah.ayahs[surah.ayahs.length - 1].number}
        />
      ))}
    </div>
  );
}
