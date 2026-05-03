// ============================================================
// src/services/audioService.ts
// Generates audio URLs from the Islamic Network CDN
// ============================================================

import { AudioInfo } from '../types/quran.types';
import { getSurahById } from '../data/quranLoader';

// Available reciters (subset of what islamic.network supports)
export const RECITERS: Record<string, string> = {
  'ar.alafasy':       'Mishary Rashid Alafasy',
  'ar.abdurrahmaanas-sudais': 'Abdurrahman As-Sudais',
  'ar.abdullahbasfar': 'Abdullah Basfar',
  'ar.husary':        'Mahmoud Khalil Al-Husary',
  'ar.minshawi':      'Mohamed Siddiq Al-Minshawi',
};

const DEFAULT_RECITER = 'ar.alafasy';
const AUDIO_BASE = 'https://cdn.islamic.network/quran/audio/128';

export const audioService = {
  /**
   * Returns the CDN audio URL for a specific surah + ayah.
   * URL format: https://cdn.islamic.network/quran/audio/128/{reciter}/{globalAyahNumber}.mp3
   */
  getAudioUrl(
    surahId: number,
    ayahNumber: number,
    reciter: string = DEFAULT_RECITER
  ): AudioInfo | null {
    if (surahId < 1 || surahId > 114) return null;
    if (ayahNumber < 1) return null;

    const surah = getSurahById(surahId);
    if (!surah) return null;
    if (ayahNumber > surah.numberOfAyahs) return null;

    // Find global ayah number
    const ayah = surah.ayahs.find((a) => a.numberInSurah === ayahNumber);
    if (!ayah) return null;

    const safeReciter = RECITERS[reciter] ? reciter : DEFAULT_RECITER;
    const url = `${AUDIO_BASE}/${safeReciter}/${ayah.number}.mp3`;

    return {
      surahId,
      ayahNumber,
      url,
      reciter: RECITERS[safeReciter] ?? safeReciter,
    };
  },

  /**
   * Returns audio URLs for an entire surah (all ayahs).
   */
  getSurahAudioUrls(
    surahId: number,
    reciter: string = DEFAULT_RECITER
  ): AudioInfo[] {
    const surah = getSurahById(surahId);
    if (!surah) return [];

    const safeReciter = RECITERS[reciter] ? reciter : DEFAULT_RECITER;

    return surah.ayahs.map((ayah) => ({
      surahId,
      ayahNumber: ayah.numberInSurah,
      url: `${AUDIO_BASE}/${safeReciter}/${ayah.number}.mp3`,
      reciter: RECITERS[safeReciter] ?? safeReciter,
    }));
  },

  getAvailableReciters(): { id: string; name: string }[] {
    return Object.entries(RECITERS).map(([id, name]) => ({ id, name }));
  },
};
