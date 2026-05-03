// ============================================================
// src/routes/searchRoutes.ts
// ============================================================

import { Router } from 'express';
import { searchController } from '../controllers/searchController';

const router = Router();

// GET /api/search?q=<query>&page=<n>&limit=<n>
router.get('/', searchController.search);

export default router;
