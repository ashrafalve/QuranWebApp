'use client';

import { useEffect, useRef, useState } from 'react';
import { Play, Pause, SkipForward, SkipBack, X, MoreHorizontal } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { getAudioUrl } from '@/utils/api';
import { cn } from '@/utils/cn';

export default function AudioPlayer() {
  const { currentPlaying, isPlaying, setIsPlaying, setCurrentPlaying } = useAppStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('00:00');
  const [duration, setDuration] = useState('00:00');

  const formatTime = (time: number) => {
    if (isNaN(time)) return '00:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (currentPlaying && audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
      }
    }
  }, [currentPlaying, isPlaying]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
      setCurrentTime(formatTime(audioRef.current.currentTime));
      setDuration(formatTime(audioRef.current.duration));
    }
  };

  if (!currentPlaying) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] bg-card border-t border-border h-[70px] flex flex-col transition-colors duration-300">
      {/* Progress Bar at the very top */}
      <div className="w-full h-[2px] bg-transparent cursor-pointer group relative">
        <div 
          className="h-full bg-primary transition-all duration-100" 
          style={{ width: `${progress}%` }} 
        />
        <div 
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full scale-0 group-hover:scale-100 transition-transform" 
          style={{ left: `${progress}%` }}
        />
      </div>

      <div className="flex-1 flex items-center justify-between px-6 md:px-10">
        {/* Left Side: Surah Info */}
        <div className="flex items-center gap-4 w-1/4">
          <div className="text-foreground font-bold text-sm">
             Surah {currentPlaying.surahId} : {currentPlaying.ayahNumber}
          </div>
        </div>

        {/* Center: Controls */}
        <div className="flex items-center gap-6 md:gap-10">
          <span className="text-[11px] font-bold text-muted tabular-nums">{currentTime}</span>
          
          <div className="flex items-center gap-6">
            <button className="text-muted hover:text-foreground transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
            
            <button className="text-muted hover:text-primary transition-colors">
              <SkipBack className="w-5 h-5 fill-current" />
            </button>

            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="bg-primary text-white p-2.5 rounded-full hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>

            <button className="text-muted hover:text-primary transition-colors">
              <SkipForward className="w-5 h-5 fill-current" />
            </button>

            <button 
              onClick={() => {
                setCurrentPlaying(null);
                setIsPlaying(false);
              }}
              className="text-muted hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <span className="text-[11px] font-bold text-muted tabular-nums">{duration}</span>
        </div>

        {/* Right Side */}
        <div className="hidden md:block w-1/4" />
      </div>

      <audio 
        key={currentPlaying.globalNumber}
        ref={audioRef}
        src={getAudioUrl(currentPlaying.globalNumber)}
        autoPlay={isPlaying}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => {
          if (currentPlaying.ayahNumber < currentPlaying.totalAyahs) {
            setCurrentPlaying({
              ...currentPlaying,
              ayahNumber: currentPlaying.ayahNumber + 1,
              globalNumber: currentPlaying.globalNumber + 1
            });
            
            setTimeout(() => {
              if (audioRef.current) {
                audioRef.current.play().catch(err => console.error('Auto-play blocked:', err));
              }
            }, 100);
          } else {
            setIsPlaying(false);
          }
        }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onLoadedMetadata={handleTimeUpdate}
      />
    </div>
  );
}
