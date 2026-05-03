// ============================================================
// src/services/surahService.ts
// Business logic for surah-related operations
// ============================================================

import { Surah, SurahWithAyahs } from '../types/quran.types';
import { getAllSurahs, getSurahById } from '../data/quranLoader';
import { cache } from '../utils/cache';

const CACHE_KEY_ALL_SURAHS = 'all_surahs';
const CACHE_KEY_SURAH_PREFIX = 'surah_';

export const surahService = {
  /**
   * Returns a list of all 114 surahs (id, arabicName, englishName, etc.)
   */
  getAllSurahs(): Surah[] {
    const cached = cache.get<Surah[]>(CACHE_KEY_ALL_SURAHS);
    if (cached) return cached;

    const surahs = getAllSurahs();
    cache.set(CACHE_KEY_ALL_SURAHS, surahs);
    return surahs;
  },

  /**
   * Returns a surah with all its ayahs (arabic + translation) by surah number.
   */
  getSurahById(id: number): SurahWithAyahs | null {
    if (id < 1 || id > 114) return null;

    const cacheKey = `${CACHE_KEY_SURAH_PREFIX}${id}`;
    const cached = cache.get<SurahWithAyahs>(cacheKey);
    if (cached) return cached;

    const surah = getSurahById(id);
    if (!surah) return null;

    cache.set(cacheKey, surah);
    return surah;
  },
};
