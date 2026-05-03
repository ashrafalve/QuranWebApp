import { Surah, SurahWithAyahs, Ayah, Juz, JuzWithAyahs, PaginatedSearchResult } from '@/types';

// Use relative URL for deployment flexibility (works with same-domain proxy or CORS)
// Override with NEXT_PUBLIC_API_URL for separate backend deployments
const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  return res.json();
}

export const fetchSurahs = async (): Promise<Surah[]> => {
  const json = await fetchJson<{ data: Surah[] }>(`${API_URL}/surah`);
  return json.data;
};

export const fetchSurahById = async (id: number): Promise<SurahWithAyahs> => {
  const json = await fetchJson<{ data: SurahWithAyahs }>(`${API_URL}/surah/${id}`);
  return json.data;
};

export const fetchJuzList = async (): Promise<Juz[]> => {
  const json = await fetchJson<{ data: Juz[] }>(`${API_URL}/juz`);
  return json.data;
};

export const fetchJuzById = async (id: number): Promise<JuzWithAyahs> => {
  const json = await fetchJson<{ data: JuzWithAyahs }>(`${API_URL}/juz/${id}`);
  return json.data;
};

export const searchAyahs = async (q: string): Promise<PaginatedSearchResult> => {
  const json = await fetchJson<{ data: PaginatedSearchResult }>(`${API_URL}/search?q=${q}`);
  return json.data;
};

export const getAudioUrl = (globalNumber: number) => {
  return `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${globalNumber}.mp3`;
};