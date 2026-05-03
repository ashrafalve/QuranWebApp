// ============================================================
// src/services/juzService.ts
// Juz-related business logic
// ============================================================

import { getAllAyahs, surahMap } from '../data/quranLoader';
import { Ayah, Surah } from '../types/quran.types';

export interface JuzInfo {
  id: number;
  startAyah: number;
  endAyah: number;
  surahCount: number;
  uniqueSurahs: Surah[];
  startSurah: Surah;
  endSurah: Surah;
  startSurahId: number;
  endSurahId: number;
  startAyahInSurah: number;
  endAyahInSurah: number;
}

export interface JuzWithAyahs extends JuzInfo {
  ayahs: Ayah[];
}

/**
 * Get all 30 juz with boundaries and metadata
 */
export function getAllJuz(): JuzInfo[] {
  const ayahs = getAllAyahs();
  const juzBoundaries = getJuzBoundaries();

  return juzBoundaries.map((boundary, index) => {
    const juzId = index + 1;
    const juzAyahs = ayahs.filter(a => a.number >= boundary.startAyah && a.number <= boundary.endAyah);
    
    if (juzAyahs.length === 0) {
      throw new Error(`No ayahs found for Juz ${juzId}`);
    }

    const firstAyah = juzAyahs[0];
    const lastAyah = juzAyahs[juzAyahs.length - 1];
    
    const uniqueSurahIds = Array.from(new Set(juzAyahs.map(a => a.surahId)));
    const uniqueSurahs = uniqueSurahIds.map(id => surahMap.get(id)!);

    return {
      id: juzId,
      startAyah: boundary.startAyah,
      endAyah: boundary.endAyah,
      surahCount: uniqueSurahs.length,
      uniqueSurahs,
      startSurah: surahMap.get(firstAyah.surahId)!,
      endSurah: surahMap.get(lastAyah.surahId)!,
      startSurahId: firstAyah.surahId,
      endSurahId: lastAyah.surahId,
      startAyahInSurah: firstAyah.numberInSurah,
      endAyahInSurah: lastAyah.numberInSurah,
    };
  });
}

/**
 * Get a specific juz with its ayahs and metadata
 */
export function getJuzById(juzId: number): JuzWithAyahs | null {
  if (juzId < 1 || juzId > 30) return null;

  const ayahs = getAllAyahs();
  const boundaries = getJuzBoundaries();
  const boundary = boundaries[juzId - 1];

  const juzAyahs = ayahs.filter(a => a.number >= boundary.startAyah && a.number <= boundary.endAyah);
  if (juzAyahs.length === 0) return null;

  const firstAyah = juzAyahs[0];
  const lastAyah = juzAyahs[juzAyahs.length - 1];
  
  const uniqueSurahIds = Array.from(new Set(juzAyahs.map(a => a.surahId)));
  const uniqueSurahs = uniqueSurahIds.map(id => surahMap.get(id)!);

  return {
    id: juzId,
    startAyah: boundary.startAyah,
    endAyah: boundary.endAyah,
    surahCount: uniqueSurahs.length,
    uniqueSurahs,
    startSurah: surahMap.get(firstAyah.surahId)!,
    endSurah: surahMap.get(lastAyah.surahId)!,
    startSurahId: firstAyah.surahId,
    endSurahId: lastAyah.surahId,
    startAyahInSurah: firstAyah.numberInSurah,
    endAyahInSurah: lastAyah.numberInSurah,
    ayahs: juzAyahs,
  };
}

/**
 * Juz boundaries from standard Hafs Quran
 */
function getJuzBoundaries(): { startAyah: number; endAyah: number }[] {
  return [
    { startAyah: 1, endAyah: 148 },     // Juz 1
    { startAyah: 149, endAyah: 252 },   // Juz 2
    { startAyah: 253, endAyah: 356 },   // Juz 3
    { startAyah: 357, endAyah: 476 },   // Juz 4
    { startAyah: 477, endAyah: 622 },   // Juz 5
    { startAyah: 623, endAyah: 759 },   // Juz 6
    { startAyah: 760, endAyah: 904 },   // Juz 7
    { startAyah: 905, endAyah: 1128 },  // Juz 8
    { startAyah: 1129, endAyah: 1204 }, // Juz 9
    { startAyah: 1205, endAyah: 1355 }, // Juz 10
    { startAyah: 1356, endAyah: 1489 }, // Juz 11
    { startAyah: 1490, endAyah: 1616 }, // Juz 12
    { startAyah: 1617, endAyah: 1745 }, // Juz 13
    { startAyah: 1746, endAyah: 1866 }, // Juz 14
    { startAyah: 1867, endAyah: 2033 }, // Juz 15
    { startAyah: 2034, endAyah: 2129 }, // Juz 16
    { startAyah: 2130, endAyah: 2234 }, // Juz 17
    { startAyah: 2235, endAyah: 2356 }, // Juz 18
    { startAyah: 2357, endAyah: 2487 }, // Juz 19
    { startAyah: 2488, endAyah: 2626 }, // Juz 20
    { startAyah: 2627, endAyah: 2750 }, // Juz 21
    { startAyah: 2751, endAyah: 2878 }, // Juz 22
    { startAyah: 2879, endAyah: 3005 }, // Juz 23
    { startAyah: 3006, endAyah: 3140 }, // Juz 24
    { startAyah: 3141, endAyah: 3281 }, // Juz 25
    { startAyah: 3282, endAyah: 3419 }, // Juz 26
    { startAyah: 3420, endAyah: 3535 }, // Juz 27
    { startAyah: 3536, endAyah: 3629 }, // Juz 28
    { startAyah: 3630, endAyah: 3749 }, // Juz 29
    { startAyah: 3750, endAyah: 6236 }, // Juz 30
  ];
}