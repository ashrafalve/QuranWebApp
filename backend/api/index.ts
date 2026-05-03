import createApp from '../src/app';
import { loadQuranData, isDataLoaded } from '../src/data/quranLoader';

const app = createApp();

export default async (req: any, res: any) => {
  // Ensure Quran data is loaded into memory before handling the request
  if (!isDataLoaded()) {
    console.log('Vercel Cold Start: Loading Quran data...');
    await loadQuranData();
  }
  
  // Forward the request to the Express application
  return app(req, res);
};
