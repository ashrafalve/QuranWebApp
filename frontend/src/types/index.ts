export interface Ayah {
  number: number;
  numberInSurah: number;
  text: string;
  translation: string;
  banglaTranslation: string;
  surahId: number;
  surahName: string;
  surahNameArabic: string;
  juz: number;
  page: number;
}

export interface Surah {
  id: number;
  arabicName: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: 'Meccan' | 'Medinan';
}

export interface SurahWithAyahs extends Surah {
  ayahs: Ayah[];
}

export interface Juz {
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

export interface JuzWithAyahs extends Juz {
  ayahs: Ayah[];
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

export interface FontSettings {
  arabicFont: 'Amiri' | 'Scheherazade';
  arabicFontSize: number;
  translationFontSize: number;
}
