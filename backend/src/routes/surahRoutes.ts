// ============================================================
// src/routes/surahRoutes.ts
// ============================================================

import { Router } from 'express';
import { surahController } from '../controllers/surahController';

const router = Router();

// GET /api/surah        → all 114 surahs
router.get('/', surahController.getAllSurahs);

// GET /api/surah/:id    → single surah with ayahs
router.get('/:id', surahController.getSurahById);

export default router;
