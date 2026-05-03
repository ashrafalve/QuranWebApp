// ============================================================
// src/controllers/searchController.ts
// Handles search requests across Arabic and English text
// ============================================================

import { Request, Response } from 'express';
import { searchService } from '../services/searchService';
import {
  sendSuccess,
  sendBadRequest,
  sendError,
} from '../utils/apiResponse';
import { logger } from '../utils/logger';

const MAX_LIMIT = 100;
const DEFAULT_LIMIT = 20;

export const searchController = {
  /**
   * GET /api/search?q=<query>&page=<n>&limit=<n>
   */
  search(req: Request, res: Response): void {
    try {
      const query = (req.query['q'] as string | undefined) ?? '';
      const pageStr = (req.query['page'] as string | undefined) ?? '1';
      const limitStr = (req.query['limit'] as string | undefined) ?? String(DEFAULT_LIMIT);

      if (!query.trim()) {
        sendBadRequest(res, 'Query parameter "q" is required and cannot be empty');
        return;
      }

      const page = Math.max(1, parseInt(pageStr, 10) || 1);
      const limit = Math.min(
        MAX_LIMIT,
        Math.max(1, parseInt(limitStr, 10) || DEFAULT_LIMIT)
      );

      const result = searchService.search(query, page, limit);
      sendSuccess(res, result, `Found ${result.total} result(s) for "${query}"`);
    } catch (err) {
      logger.error('search error', err);
      sendError(res, 'Search failed');
    }
  },
};
