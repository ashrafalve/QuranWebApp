// ============================================================
// src/app.ts
// Express application setup — middleware, routes, error handling
// ============================================================

import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import apiRoutes from './routes/index';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';

const createApp = (): Application => {
  const app = express();

  // ── Security ──────────────────────────────────────────────
  app.use(helmet());

  // ── CORS ──────────────────────────────────────────────────
  const allowedOrigins = (process.env.CORS_ORIGIN ?? 'http://localhost:3000')
    .split(',')
    .map((o) => o.trim());

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (e.g., curl, Postman)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
          callback(null, true);
        } else {
          logger.warn(`CORS blocked request from: ${origin}`);
          callback(new Error(`Origin ${origin} not allowed by CORS`));
        }
      },
      methods: ['GET', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    })
  );

  // ── Compression ───────────────────────────────────────────
  app.use(compression());

  // ── Body Parser ───────────────────────────────────────────
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true }));

  // ── Logging ───────────────────────────────────────────────
  if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('combined'));
  }

  // ── Rate Limiting ─────────────────────────────────────────
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 300,                  // 300 requests per window
    message: {
      success: false,
      error: 'Too many requests, please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  app.use('/api', limiter);

  // ── Routes ────────────────────────────────────────────────
  app.use('/api', apiRoutes);

  // ── 404 ───────────────────────────────────────────────────
  app.use(notFoundHandler);

  // ── Global Error Handler ──────────────────────────────────
  app.use(errorHandler);

  return app;
};

export default createApp;
