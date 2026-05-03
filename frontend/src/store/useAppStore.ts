import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FontSettings } from '../types';

interface AppState {
  // Font Settings
  settings: FontSettings;
  setSettings: (settings: Partial<FontSettings>) => void;

  // Audio State
  currentPlaying: { surahId: number; ayahNumber: number; globalNumber: number; totalAyahs: number } | null;
  setCurrentPlaying: (audio: { surahId: number; ayahNumber: number; globalNumber: number; totalAyahs: number } | null) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;

  // Sidebar State
  isSurahSidebarOpen: boolean;
  setSurahSidebarOpen: (open: boolean) => void;

  // View Mode
  readingMode: boolean;
  setReadingMode: (mode: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      settings: {
        arabicFont: 'Amiri',
        arabicFontSize: 30,
        translationFontSize: 17,
      },
      setSettings: (newSettings) =>
        set((state) => ({ settings: { ...state.settings, ...newSettings } })),

      currentPlaying: null,
      setCurrentPlaying: (audio) => set({ currentPlaying: audio }),
      isPlaying: false,
      setIsPlaying: (playing) => set({ isPlaying: playing }),

      isSurahSidebarOpen: true,
      setSurahSidebarOpen: (open) => set({ isSurahSidebarOpen: open }),

      readingMode: false,
      setReadingMode: (mode) => set({ readingMode: mode }),
    }),
    {
      name: 'quran-app-storage',
      partialize: (state) => ({ settings: state.settings, readingMode: state.readingMode }),
    }
  )
);
