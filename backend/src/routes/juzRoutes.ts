import { Router } from 'express';
import { isDataLoaded } from '../data/quranLoader';
import { getAllJuz, getJuzById } from '../services/juzService';
import { sendSuccess, sendError, sendNotFound } from '../utils/apiResponse';
import { cacheMiddleware } from '../middleware/cacheMiddleware';

const router = Router();

/**
 * GET /api/juz
 * List all 30 juz with metadata
 */
router.get('/', cacheMiddleware(3600), (_req, res) => {
  if (!isDataLoaded()) {
    return sendError(res, 'Quran data not loaded', 503);
  }

  try {
    const juzList = getAllJuz();
    sendSuccess(res, juzList);
  } catch (err) {
    sendError(res, 'Failed to generate juz list');
  }
});

/**
 * GET /api/juz/:id
 * Get specific juz with ayahs and metadata
 */
router.get('/:id', cacheMiddleware(3600), (req, res) => {
  if (!isDataLoaded()) {
    return sendError(res, 'Quran data not loaded', 503);
  }

  const juzId = parseInt(req.params.id);
  if (isNaN(juzId) || juzId < 1 || juzId > 30) {
    return sendNotFound(res, `Juz ${req.params.id}`);
  }

  const juz = getJuzById(juzId);
  if (!juz) {
    return sendNotFound(res, `Juz ${juzId}`);
  }

  sendSuccess(res, juz);
});

export default router;
