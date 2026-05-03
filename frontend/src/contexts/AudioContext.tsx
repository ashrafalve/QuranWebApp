'use client';

import { createContext, useContext, useEffect, useCallback, useState, useRef } from 'react';

type AudioContextType = {
  currentPlaying: { surahId: number; ayahNumber: number; globalNumber: number; totalAyahs: number } | null;
  isPlaying: boolean;
  play: (globalNumber: number, totalAyahs?: number) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  skipForward: () => void;
  skipBack: () => void;
  progress: number;
  currentTime: string;
  duration: string;
  isLoading: boolean;
  volume: number;
  setVolume: (vol: number) => void;
};

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const useAudioContext = () => {
  const ctx = useContext(AudioContext);
  if (!ctx) throw new Error('useAudioContext must be used within AudioProvider');
  return ctx;
};

function formatTime(time: number) {
  if (isNaN(time)) return '00:00';
  const mins = Math.floor(time / 60);
  const secs = Math.floor(time % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

type AudioEventHandler = () => void;

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [currentPlaying, setCurrentPlaying] = useState<{ surahId: number; ayahNumber: number; globalNumber: number; totalAyahs: number } | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const isPlayingRef = useRef(isPlaying);
  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('00:00');
  const [duration, setDuration] = useState('00:00');
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolumeState] = useState(1);

  const handlersRef = useRef<Record<string, AudioEventHandler[]>>({});
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const volumeRef = useRef(volume);
  useEffect(() => { volumeRef.current = volume; }, [volume]);

  const preloadedSurahsRef = useRef<Set<number>>(new Set());

  const addEventHandler = (audio: HTMLAudioElement, event: string, handler: AudioEventHandler) => {
    audio.addEventListener(event, handler);
    if (!handlersRef.current[event]) handlersRef.current[event] = [];
    handlersRef.current[event].push(handler);
  };

  const removeAllEventHandlers = (audio: HTMLAudioElement) => {
    Object.entries(handlersRef.current).forEach(([event, handlers]) => {
      handlers.forEach((handler) => audio.removeEventListener(event, handler));
    });
    handlersRef.current = {};
  };

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current.load();
    }
    setIsPlaying(false);
    isPlayingRef.current = false;
  }, []);

  const playRef = useRef<(g: number, t?: number) => void>(() => {
    throw new Error('play not initialized');
  });

  const preloadSurahAudio = useCallback((surahId: number) => {
    if (preloadedSurahsRef.current.has(surahId)) return;

    const API_BASE = typeof window !== 'undefined'
      ? (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api')
      : 'http://127.0.0.1:5000/api';

    fetch(`${API_BASE}/audio/${surahId}`)
      .then(res => res.json())
      .then(json => {
        const items = json.data || [];
        items.forEach((item: { url: string }) => {
          if (item.url) {
            const audio = new Audio(item.url);
            audio.preload = 'auto';
            audio.load();
          }
        });
        preloadedSurahsRef.current.add(surahId);
      })
      .catch(() => {});
  }, []);

  const [surahBoundaries, setSurahBoundaries] = useState<{ id: number; start: number; end: number }[]>([]);

  useEffect(() => {
    const API_BASE = typeof window !== 'undefined'
      ? (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api')
      : 'http://127.0.0.1:5000/api';
    
    fetch(`${API_BASE}/surah`)
      .then(res => res.json())
      .then(json => {
        let currentGlobal = 1;
        const boundaries = (json.data || []).map((s: any) => {
          const boundary = {
            id: s.id,
            start: currentGlobal,
            end: currentGlobal + s.numberOfAyahs - 1
          };
          currentGlobal += s.numberOfAyahs;
          return boundary;
        });
        setSurahBoundaries(boundaries);
      })
      .catch(err => console.error('Failed to fetch surah boundaries', err));
  }, []);

  const getMetadata = useCallback((globalNumber: number) => {
    const boundary = surahBoundaries.find(b => globalNumber >= b.start && globalNumber <= b.end);
    if (!boundary) return { surahId: 1, ayahNumber: 1 };
    return {
      surahId: boundary.id,
      ayahNumber: globalNumber - boundary.start + 1
    };
  }, [surahBoundaries]);

  const play = useCallback((globalNumber: number, totalAyahs: number = 6236) => {
    const url = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${globalNumber}.mp3`;
    const { surahId, ayahNumber } = getMetadata(globalNumber);

    stopAudio();

    setCurrentPlaying({ surahId, ayahNumber, globalNumber, totalAyahs });
    setIsPlaying(true);
    isPlayingRef.current = true;
    setIsLoading(true);

    let audio = audioRef.current;
    if (!audio) {
      audio = document.createElement('audio');
      audio.setAttribute('data-global-audio', 'true');
      document.body.appendChild(audio);
      audioRef.current = audio;
    }

    removeAllEventHandlers(audio);

    const trackData = { globalNumber, totalAyahs };
    (audio as any).__trackData = trackData;

    const handleCanPlay = () => {
      setIsLoading(false);
      audio!.volume = volumeRef.current;
      if (isPlayingRef.current && audio!.paused) {
        audio!.play().catch((err) => {
          if (err.name === 'NotAllowedError') setIsPlaying(false);
        });
      }
    };

    const handleEnded = () => {
      const data = (audio as any).__trackData;
      if (data && data.globalNumber < data.totalAyahs) {
        setTimeout(() => {
          playRef.current(data.globalNumber + 1, data.totalAyahs);
        }, 100); // Small delay for smooth transition
      } else {
        setIsPlaying(false);
        setCurrentPlaying(null);
      }
    };

    addEventHandler(audio, 'loadstart', () => setIsLoading(true));
    addEventHandler(audio, 'canplay', handleCanPlay);
    addEventHandler(audio, 'timeupdate', () => {
      setProgress((audio!.currentTime / audio!.duration) * 100 || 0);
      setCurrentTime(formatTime(audio!.currentTime));
      setDuration(formatTime(audio!.duration));
    });
    addEventHandler(audio, 'ended', handleEnded);
    addEventHandler(audio, 'waiting', () => setIsLoading(true));
    addEventHandler(audio, 'playing', () => setIsLoading(false));
    addEventHandler(audio, 'error', () => {
      setIsLoading(false);
      setIsPlaying(false);
    });

    audio.src = url;
    audio.load();
    preloadSurahAudio(surahId);
  }, [stopAudio, preloadSurahAudio, getMetadata]);

  useEffect(() => { playRef.current = play; }, [play]);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      isPlayingRef.current = false;
    }
  }, []);

  const resume = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  }, []);

  const stop = useCallback(() => {
    stopAudio();
    setCurrentPlaying(null);
  }, [stopAudio]);

  const skipForward = useCallback(() => {
    if (currentPlaying && currentPlaying.ayahNumber < currentPlaying.totalAyahs) {
      play(currentPlaying.globalNumber + 1, currentPlaying.totalAyahs);
    }
  }, [currentPlaying, play]);

  const skipBack = useCallback(() => {
    if (currentPlaying && currentPlaying.globalNumber > 1) {
      play(currentPlaying.globalNumber - 1, currentPlaying.totalAyahs);
    }
  }, [currentPlaying, play]);

  const setVolume = useCallback((vol: number) => {
    setVolumeState(vol);
    if (audioRef.current) audioRef.current.volume = vol;
  }, []);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  return (
    <AudioContext.Provider value={{
      currentPlaying,
      isPlaying,
      play,
      pause,
      resume,
      stop,
      skipForward,
      skipBack,
      progress,
      currentTime,
      duration,
      isLoading,
      volume,
      setVolume,
    }}>
      {children}
    </AudioContext.Provider>
  );
}
