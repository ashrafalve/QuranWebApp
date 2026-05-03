'use client';

import { Play, Pause, Bookmark, Book, Copy, Share2, MoreHorizontal } from 'lucide-react';
import { Ayah } from '@/types';
import { useAppStore } from '@/store/useAppStore';
import { getAudioUrl } from '@/utils/api';
import { cn } from '@/utils/cn';
import { useEffect, useRef, useState } from 'react';

interface AyahCardProps {
  ayah: Ayah;
  totalAyahs: number;
}

export default function AyahCard({ ayah, totalAyahs }: AyahCardProps) {
  const { settings, currentPlaying, setCurrentPlaying, isPlaying, setIsPlaying } = useAppStore();
  const isThisPlaying = currentPlaying?.surahId === ayah.surahId && currentPlaying?.ayahNumber === ayah.numberInSurah;

  const toggleAudio = () => {
    if (isThisPlaying) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentPlaying({ 
        surahId: ayah.surahId, 
        ayahNumber: ayah.numberInSurah, 
        globalNumber: ayah.number,
        totalAyahs: totalAyahs
      });
      setIsPlaying(true);
    }
  };

  return (
    <div className={cn(
      "p-8 md:p-12 border-b border-border bg-background transition-colors duration-300 group",
      isThisPlaying && "bg-primary/5"
    )}>
      <div className="flex flex-col md:flex-row gap-10 md:gap-16">
        {/* Left Action Column */}
        <div className="flex md:flex-col items-center gap-6">
          <div className="text-sm font-bold text-primary">
            {ayah.surahId}:{ayah.numberInSurah}
          </div>
          
          <div className="flex md:flex-col items-center gap-5">
            <button 
              onClick={toggleAudio}
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
        <div className="flex-1 space-y-12">
          {/* Arabic Text */}
          <div 
            className={cn(
              "text-right leading-[2.5] md:leading-[3] text-foreground transition-all",
              settings.arabicFont === 'Amiri' ? "font-amiri" : "font-scheherazade"
            )}
            style={{ fontSize: `${settings.arabicFontSize}px` }}
            dir="rtl"
          >
            {ayah.text}
            <span className="inline-flex items-center justify-center w-12 h-12 mr-6 border border-border rounded-full text-base font-sans font-bold text-muted align-middle">
              {ayah.numberInSurah}
            </span>
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
