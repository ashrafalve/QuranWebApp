import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
});

export const fetchSurahs = async () => {
  const { data } = await api.get('/surah');
  return data.data;
};

export const fetchSurahById = async (id: number) => {
  const { data } = await api.get(`/surah/${id}`);
  return data.data;
};

export const searchAyahs = async (q: string) => {
  const { data } = await api.get(`/search?q=${q}`);
  return data.data;
};

export const getAudioUrl = (globalNumber: number) => {
  return `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${globalNumber}.mp3`;
};
