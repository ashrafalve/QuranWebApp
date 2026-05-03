// ============================================================
// src/types/quran.types.ts
// Core TypeScript types for the Quran API
// ============================================================

export interface Ayah {
  number: number;           // Global ayah number (1-6236)
  numberInSurah: number;    // Ayah number within the surah
  text: string;             // Arabic text
  translation: string;      // English translation (Saheeh International)
  banglaTranslation: string; // Bangla translation
  surahId: number;          // Parent surah number
  surahName: string;        // Surah English name
  surahNameArabic: string;  // Surah Arabic name
  juz: number;              // Juz number
  page: number;             // Page number in Mushaf
}

export interface Surah {
  id: number;               // Surah number (1-114)
  arabicName: string;       // Arabic name (e.g. الفاتحة)
  englishName: string;      // English name (e.g. Al-Faatiha)
  englishNameTranslation: string; // Meaning (e.g. The Opening)
  numberOfAyahs: number;    // Total ayah count
  revelationType: 'Meccan' | 'Medinan'; // Revelation type
}

export interface SurahWithAyahs extends Surah {
  ayahs: Ayah[];
}

export interface AudioInfo {
  surahId: number;
  ayahNumber: number;
  url: string;
  reciter: string;
}

export interface SearchResult {
  ayah: Ayah;
  matchType: 'arabic' | 'translation';
}

export interface PaginatedSearchResult {
  query: string;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  results: SearchResult[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Raw shape from the Quran API JSON
export interface RawAyah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  page: number;
}

export interface RawEditionAyah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  page: number;
}

export interface RawSurah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
  ayahs: RawAyah[];
}

export interface RawEditionSurah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
  ayahs: RawEditionAyah[];
}

export interface QuranData {
  surahs: RawSurah[];
}
