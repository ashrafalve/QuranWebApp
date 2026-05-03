'use client';

import { Play, Pause, SkipForward, SkipBack, X, MoreHorizontal, Loader2, Volume2, VolumeX } from 'lucide-react';
import { useAudioContext } from '@/contexts/AudioContext';
import { useState } from 'react';

export default function AudioPlayer() {
  const {
    currentPlaying,
    isPlaying,
    pause,
    resume,
    skipForward,
    skipBack,
    stop,
    progress,
    currentTime,
    duration,
    isLoading,
  } = useAudioContext();

  if (!currentPlaying) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] bg-card border-t border-border h-[80px] flex flex-col transition-all duration-300 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
      {/* Progress Bar */}
      <div
        className="w-full h-[4px] bg-border/30 cursor-pointer group relative"
        onClick={(e) => {
          const audio = document.querySelector('audio[data-global-audio]') as HTMLAudioElement | null;
          if (audio && audio.duration) {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const clickedProgress = x / rect.width;
            audio.currentTime = clickedProgress * audio.duration;
          }
        }}
      >
        <div
          className="h-full bg-primary transition-all duration-100 relative"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-primary rounded-full scale-0 group-hover:scale-100 transition-transform shadow-lg shadow-primary/40 border-2 border-background" />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-between px-6 md:px-12">
        {/* Left Side: Meta - Hidden on tiny screens */}
        <div className="hidden sm:flex items-center gap-5 w-1/4">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold text-xs">
            {currentPlaying.surahId}:{currentPlaying.ayahNumber}
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Al-Afasy Recitation</span>
            <span className="text-foreground font-bold text-sm truncate max-w-[150px]">Surah {currentPlaying.surahId}</span>
          </div>
        </div>

        {/* Center: Controls */}
        <div className="flex items-center gap-6 md:gap-12">
          <span className="text-[11px] font-bold text-muted tabular-nums hidden sm:inline">{currentTime}</span>

          <div className="flex items-center gap-6">
            <button className="text-muted hover:text-foreground transition-colors hidden sm:inline">
              <MoreHorizontal className="w-4 h-4" />
            </button>

            <button
              onClick={skipBack}
              disabled={currentPlaying.ayahNumber === 1}
              className="text-muted hover:text-primary transition-colors disabled:opacity-30"
            >
              <SkipBack className="w-5 h-5 fill-current" />
            </button>

            <button
              onClick={() => (isPlaying ? pause() : resume())}
              className="bg-primary text-white w-12 h-12 rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20 flex items-center justify-center"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current ml-0.5" />
              )}
            </button>

            <button
              onClick={skipForward}
              disabled={currentPlaying.ayahNumber === currentPlaying.totalAyahs}
              className="text-muted hover:text-primary transition-colors disabled:opacity-30"
            >
              <SkipForward className="w-5 h-5 fill-current" />
            </button>

            <button
              onClick={stop}
              className="text-muted hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <span className="text-[11px] font-bold text-muted tabular-nums hidden sm:inline">{duration}</span>
        </div>

        {/* Right Side: Volume */}
        <div className="hidden md:flex items-center justify-end gap-4 w-1/4">
          <VolumeControls />
        </div>
      </div>
    </div>
  );
}

function VolumeControls() {
  const { volume: ctxVolume, setVolume } = useAudioContext();
  const [isMuted, setIsMuted] = useState(false);

  const audio = document.querySelector('audio[data-global-audio]') as HTMLAudioElement | null;

  const changeVolume = (val: number) => {
    setVolume(val);
    setIsMuted(false);
    if (audio) audio.volume = val;
  };

  const toggleMute = () => {
    if (!audio) return;
    if (isMuted || ctxVolume === 0) {
      audio.volume = ctxVolume || 1;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  return (
    <>
      <button onClick={toggleMute} className="text-muted hover:text-primary transition-colors">
        {isMuted || ctxVolume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={isMuted ? 0 : ctxVolume}
        onChange={(e) => changeVolume(parseFloat(e.target.value))}
        className="w-20 h-1 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
      />
    </>
  );
}
