// ============================================================
// src/controllers/surahController.ts
// Handles all surah-related HTTP requests
// ============================================================

import { Request, Response } from 'express';
import { surahService } from '../services/surahService';
import {
  sendSuccess,
  sendNotFound,
  sendBadRequest,
  sendError,
} from '../utils/apiResponse';
import { logger } from '../utils/logger';

export const surahController = {
  /**
   * GET /api/surah
   * Returns all 114 surahs with metadata.
   */
  getAllSurahs(_req: Request, res: Response): void {
    try {
      const surahs = surahService.getAllSurahs();
      sendSuccess(res, surahs, `Retrieved ${surahs.length} surahs`);
    } catch (err) {
      logger.error('getAllSurahs error', err);
      sendError(res, 'Failed to retrieve surahs');
    }
  },

  /**
   * GET /api/surah/:id
   * Returns surah metadata and all its ayahs.
   */
  getSurahById(req: Request, res: Response): void {
    try {
      const id = parseInt(req.params['id'] ?? '', 10);

      if (isNaN(id)) {
        sendBadRequest(res, 'Surah ID must be a valid number');
        return;
      }

      if (id < 1 || id > 114) {
        sendBadRequest(res, 'Surah ID must be between 1 and 114');
        return;
      }

      const surah = surahService.getSurahById(id);
      if (!surah) {
        sendNotFound(res, `Surah ${id}`);
        return;
      }

      sendSuccess(res, surah, `Retrieved surah ${id}: ${surah.englishName}`);
    } catch (err) {
      logger.error('getSurahById error', err);
      sendError(res, 'Failed to retrieve surah');
    }
  },
};
