'use client';

import { useState } from 'react';
import { Play, Pause, Bookmark, Book, Copy, Share2, MoreHorizontal } from 'lucide-react';
import { Ayah } from '@/types';
import { useAppStore } from '@/store/useAppStore';
import { useAudioContext } from '@/contexts/AudioContext';
import { cn } from '@/utils/cn';

interface AyahCardProps {
  ayah: Ayah;
  totalAyahs: number;
}

export default function AyahCard({ ayah, totalAyahs }: AyahCardProps) {
  const { settings } = useAppStore();
  const { currentPlaying, isPlaying, play, pause, resume } = useAudioContext();
  const [showBangla, setShowBangla] = useState(false);

  const isThisPlaying = currentPlaying?.globalNumber === ayah.number;

  const handleToggleAudio = () => {
    if (isThisPlaying) {
      if (isPlaying) {
        pause();
      } else {
        resume();
      }
    } else {
      // Pass the full ayah list for preloading (we'll get it from parent via a different way)
      // Since we don't have access to full surah ayahs here, we'll just play without preload for now
      play(ayah.number, ayah.surahId, ayah.numberInSurah, totalAyahs);
    }
  };

  return (
    <div
      className={cn(
        "p-8 md:p-12 border-b border-border bg-background transition-colors duration-300 group",
        isThisPlaying && "bg-primary/5"
      )}
      suppressHydrationWarning
    >
      <div className="flex flex-col md:flex-row gap-10 md:gap-16">
        {/* Left Action Column */}
        <div className="flex md:flex-col items-center gap-6">
          <div className="text-sm font-bold text-primary">
            {ayah.surahId}:{ayah.numberInSurah}
          </div>

          <div className="flex md:flex-col items-center gap-5" suppressHydrationWarning>
            <button
              onClick={handleToggleAudio}
              className="text-muted hover:text-primary transition-colors"
            >
              {isThisPlaying && isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
            </button>

            <button className="text-muted hover:text-primary transition-colors">
              <Book className="w-5 h-5" />
            </button>

            <button className="text-muted hover:text-primary transition-colors">
              <Bookmark className="w-5 h-5" />
            </button>

            <button className="text-muted hover:text-primary transition-colors">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Right Content Column */}
        <div className="flex-1 space-y-12" suppressHydrationWarning>
          {/* Arabic Text with Hover Bangla */}
          <div className="relative">
            <div
              onMouseEnter={() => setShowBangla(true)}
              onMouseLeave={() => setShowBangla(false)}
              className={cn(
                "text-right leading-[2.5] md:leading-[3] text-foreground transition-all cursor-help select-none",
                settings.arabicFont === 'Amiri' ? "font-amiri" : "font-scheherazade"
              )}
              style={{ fontSize: `${settings.arabicFontSize}px` }}
              dir="rtl"
              suppressHydrationWarning
            >
              {ayah.text}
              <span className="inline-flex items-center justify-center w-12 h-12 mr-6 border border-border rounded-full text-base font-sans font-bold text-muted align-middle">
                {ayah.numberInSurah}
              </span>
            </div>

            {/* Bangla Translation Tooltip */}
            {showBangla && ayah.banglaTranslation && (
              <div className="absolute right-0 top-full mt-4 z-20 bg-card border border-primary/20 p-4 rounded-2xl shadow-2xl max-w-lg animate-in fade-in slide-in-from-top-2 duration-200">
                <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-2">Bangla Meaning</p>
                <p className="text-foreground font-medium leading-relaxed">
                  {ayah.banglaTranslation}
                </p>
                {/* Arrow */}
                <div className="absolute -top-1 right-10 w-2 h-2 bg-card border-l border-t border-primary/20 rotate-45" />
              </div>
            )}
          </div>

          {/* Translation */}
          <div className="space-y-4">
            <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em]">SAHEEH INTERNATIONAL</p>
            <p
              className="text-muted/80 leading-loose max-w-4xl"
              style={{ fontSize: `${settings.translationFontSize}px` }}
            >
              {ayah.translation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
