// ============================================================
// src/routes/index.ts
// Central route registry
// ============================================================

import { Router, Request, Response } from 'express';
import surahRoutes from './surahRoutes';
import searchRoutes from './searchRoutes';
import audioRoutes from './audioRoutes';
import { cache } from '../utils/cache';
import { isDataLoaded } from '../data/quranLoader';

const router = Router();

// Health check
router.get('/health', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      status: 'ok',
      dataLoaded: isDataLoaded(),
      cache: cache.getStats(),
      timestamp: new Date().toISOString(),
    },
  });
});

// API routes
router.use('/surah', surahRoutes);
router.use('/search', searchRoutes);
router.use('/audio', audioRoutes);

export default router;
