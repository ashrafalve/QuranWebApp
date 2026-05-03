// ============================================================
// src/controllers/audioController.ts
// Handles audio URL generation for Quran recitations
// ============================================================

import { Request, Response } from 'express';
import { audioService } from '../services/audioService';
import {
  sendSuccess,
  sendBadRequest,
  sendNotFound,
  sendError,
} from '../utils/apiResponse';
import { logger } from '../utils/logger';

export const audioController = {
  /**
   * GET /api/audio/:surah/:ayah?reciter=ar.alafasy
   * Returns the CDN audio URL for a specific ayah.
   */
  getAyahAudio(req: Request, res: Response): void {
    try {
      const surahId = parseInt(req.params['surah'] ?? '', 10);
      const ayahNumber = parseInt(req.params['ayah'] ?? '', 10);
      const reciter = (req.query['reciter'] as string | undefined) ?? 'ar.alafasy';

      if (isNaN(surahId) || isNaN(ayahNumber)) {
        sendBadRequest(res, 'Surah and ayah must be valid numbers');
        return;
      }

      if (surahId < 1 || surahId > 114) {
        sendBadRequest(res, 'Surah ID must be between 1 and 114');
        return;
      }

      if (ayahNumber < 1) {
        sendBadRequest(res, 'Ayah number must be greater than 0');
        return;
      }

      const audio = audioService.getAudioUrl(surahId, ayahNumber, reciter);
      if (!audio) {
        sendNotFound(res, `Audio for surah ${surahId}, ayah ${ayahNumber}`);
        return;
      }

      sendSuccess(res, audio, 'Audio URL generated');
    } catch (err) {
      logger.error('getAyahAudio error', err);
      sendError(res, 'Failed to generate audio URL');
    }
  },

  /**
   * GET /api/audio/:surah?reciter=ar.alafasy
   * Returns audio URLs for all ayahs in a surah.
   */
  getSurahAudio(req: Request, res: Response): void {
    try {
      const surahId = parseInt(req.params['surah'] ?? '', 10);
      const reciter = (req.query['reciter'] as string | undefined) ?? 'ar.alafasy';

      if (isNaN(surahId) || surahId < 1 || surahId > 114) {
        sendBadRequest(res, 'Surah ID must be between 1 and 114');
        return;
      }

      const audioList = audioService.getSurahAudioUrls(surahId, reciter);
      if (audioList.length === 0) {
        sendNotFound(res, `Surah ${surahId}`);
        return;
      }

      sendSuccess(res, audioList, `Retrieved ${audioList.length} audio URLs for surah ${surahId}`);
    } catch (err) {
      logger.error('getSurahAudio error', err);
      sendError(res, 'Failed to retrieve surah audio URLs');
    }
  },

  /**
   * GET /api/audio/reciters
   * Lists available reciters.
   */
  getReciters(_req: Request, res: Response): void {
    try {
      const reciters = audioService.getAvailableReciters();
      sendSuccess(res, reciters, `${reciters.length} reciters available`);
    } catch (err) {
      logger.error('getReciters error', err);
      sendError(res, 'Failed to retrieve reciters');
    }
  },
};
