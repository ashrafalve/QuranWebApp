// ============================================================
// src/routes/audioRoutes.ts
// ============================================================

import { Router } from 'express';
import { audioController } from '../controllers/audioController';

const router = Router();

// GET /api/audio/reciters            → list available reciters
router.get('/reciters', audioController.getReciters);

// GET /api/audio/:surah              → all ayah audio URLs for a surah
router.get('/:surah', audioController.getSurahAudio);

// GET /api/audio/:surah/:ayah        → single ayah audio URL
router.get('/:surah/:ayah', audioController.getAyahAudio);

export default router;
