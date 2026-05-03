// ============================================================
// src/services/searchService.ts
// Full-text search across Arabic text and English translation
// ============================================================

import { Ayah, PaginatedSearchResult, SearchResult } from '../types/quran.types';
import { getAllAyahs } from '../data/quranLoader';
import { cache } from '../utils/cache';
import { logger } from '../utils/logger';

const CACHE_KEY_SEARCH_PREFIX = 'search_';
const SEARCH_CACHE_TTL = 300; // 5 minutes for search results

/**
 * Normalise Arabic text: remove diacritics (tashkeel) so searching
 * بِسْمِ also matches بسم, etc.
 */
const normaliseArabic = (text: string): string =>
  text
    .replace(/[\u0617-\u061A\u064B-\u065F]/g, '') // strip harakat
    .replace(/\s+/g, ' ')
    .trim();

const normaliseQuery = (q: string): string => q.trim().toLowerCase();

export const searchService = {
  /**
   * Search ayahs by Arabic text or English translation.
   * Returns paginated results.
   */
  search(
    query: string,
    page = 1,
    limit = 20
  ): PaginatedSearchResult {
    const trimmed = query.trim();
    if (!trimmed) {
      return {
        query,
        total: 0,
        page,
        limit,
        totalPages: 0,
        results: [],
      };
    }

    const cacheKey = `${CACHE_KEY_SEARCH_PREFIX}${trimmed}_${page}_${limit}`;
    const cached = cache.get<PaginatedSearchResult>(cacheKey);
    if (cached) return cached;

    logger.debug(`Searching for: "${trimmed}"`);

    const normalisedQuery = normaliseQuery(trimmed);
    const normalisedArabicQuery = normaliseArabic(trimmed);
    const isArabic = /[\u0600-\u06FF]/.test(trimmed);

    const allAyahs: Ayah[] = getAllAyahs();
    const results: SearchResult[] = [];

    for (const ayah of allAyahs) {
      if (isArabic) {
        // Arabic search: strip diacritics from both sides
        if (normaliseArabic(ayah.text).includes(normalisedArabicQuery)) {
          results.push({ ayah, matchType: 'arabic' });
        }
      } else {
        // English search (case-insensitive)
        if (ayah.translation.toLowerCase().includes(normalisedQuery)) {
          results.push({ ayah, matchType: 'translation' });
        }
      }
    }

    const total = results.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const paginatedResults = results.slice(startIndex, startIndex + limit);

    const result: PaginatedSearchResult = {
      query: trimmed,
      total,
      page,
      limit,
      totalPages,
      results: paginatedResults,
    };

    cache.set(cacheKey, result, SEARCH_CACHE_TTL);
    logger.debug(`Search found ${total} results for: "${trimmed}"`);

    return result;
  },
};
