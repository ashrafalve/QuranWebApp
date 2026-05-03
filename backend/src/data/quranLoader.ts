// ============================================================
// src/data/quranLoader.ts
// Fetches and builds the in-memory Quran dataset from
// alquran.cloud (no local file needed).
// ============================================================

import axios from 'axios';
import { Ayah, Surah, SurahWithAyahs } from '../types/quran.types';
import { logger } from '../utils/logger';

// ---------------------------------------------------------------------------
// Types for the alquran.cloud API responses
// ---------------------------------------------------------------------------

interface AlQuranEditionAyah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  page: number;
}

interface AlQuranEditionSurah {
  number: number;
  name: string;           // Arabic name  e.g. الفاتحة
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
  ayahs: AlQuranEditionAyah[];
}

interface AlQuranEditionResponse {
  code: number;
  status: string;
  data: {
    surahs: AlQuranEditionSurah[];
    edition: Record<string, unknown>;
  };
}

// ---------------------------------------------------------------------------
// Module-level in-memory store (populated once at startup)
// ---------------------------------------------------------------------------

let surahList: Surah[] = [];
let surahMap: Map<number, SurahWithAyahs> = new Map();

// Flat array of every ayah — used for full-text search
let allAyahs: Ayah[] = [];

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Fetches one edition (arabic or en.sahih) from alquran.cloud.
 */
const fetchEdition = async (edition: string): Promise<AlQuranEditionSurah[]> => {
  const url = `https://api.alquran.cloud/v1/quran/${edition}`;
  logger.info(`Fetching Quran data: ${url}`);
  const response = await axios.get<AlQuranEditionResponse>(url, { timeout: 30_000 });
  if (response.data.code !== 200) {
    throw new Error(`alquran.cloud returned code ${response.data.code}`);
  }
  return response.data.data.surahs;
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Loads the full Quran (Arabic + Saheeh International translation) into memory.
 * Should be called ONCE at server start.
 */
export const loadQuranData = async (): Promise<void> => {
  logger.info('Loading Quran data into memory…');

  const [arabicData, englishData] = await Promise.all([
    fetchEdition('quran-uthmani'),
    fetchEdition('en.sahih'),
  ]);

  // Build an ayah-number → translation map for O(1) lookups
  const translationMap = new Map<number, string>();
  for (const surah of englishData) {
    for (const ayah of surah.ayahs) {
      translationMap.set(ayah.number, ayah.text);
    }
  }

  surahList = [];
  surahMap = new Map();
  allAyahs = [];

  for (const rawSurah of arabicData) {
    const surah: Surah = {
      id: rawSurah.number,
      arabicName: rawSurah.name,
      englishName: rawSurah.englishName,
      englishNameTranslation: rawSurah.englishNameTranslation,
      numberOfAyahs: rawSurah.numberOfAyahs,
      revelationType: rawSurah.revelationType === 'Meccan' ? 'Meccan' : 'Medinan',
    };

    surahList.push(surah);

    const ayahs: Ayah[] = rawSurah.ayahs.map((rawAyah) => ({
      number: rawAyah.number,
      numberInSurah: rawAyah.numberInSurah,
      text: rawAyah.text,
      translation: translationMap.get(rawAyah.number) ?? '',
      surahId: rawSurah.number,
      surahName: rawSurah.englishName,
      surahNameArabic: rawSurah.name,
      juz: rawAyah.juz,
      page: rawAyah.page,
    }));

    surahMap.set(rawSurah.number, { ...surah, ayahs });
    allAyahs.push(...ayahs);
  }

  logger.info(
    `Quran data loaded: ${surahList.length} surahs, ${allAyahs.length} ayahs`
  );
};

// ---------------------------------------------------------------------------
// Accessors (called by services after data is loaded)
// ---------------------------------------------------------------------------

export const getAllSurahs = (): Surah[] => surahList;

export const getSurahById = (id: number): SurahWithAyahs | undefined =>
  surahMap.get(id);

export const getAllAyahs = (): Ayah[] => allAyahs;

export const isDataLoaded = (): boolean => surahList.length > 0;
