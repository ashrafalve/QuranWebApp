// ============================================================
// src/index.ts
// Server entry point — boot sequence
// ============================================================

import 'dotenv/config';
import createApp from './app';
import { loadQuranData } from './data/quranLoader';
import { logger } from './utils/logger';

const PORT = parseInt(process.env.PORT ?? '5000', 10);

const startServer = async (): Promise<void> => {
  try {
    logger.info('🚀 Starting Quran API Server…');

    // Load Quran data into memory before accepting requests
    await loadQuranData();

    const app = createApp();

    const server = app.listen(PORT, () => {
      logger.info(`✅ Server running on http://localhost:${PORT}`);
      logger.info(`📖 Quran API ready at http://localhost:${PORT}/api`);
      logger.info(`💊 Health check at http://localhost:${PORT}/api/health`);
    });

    // ── Graceful Shutdown ──────────────────────────────────
    const gracefulShutdown = (signal: string) => {
      logger.info(`${signal} received. Shutting down gracefully…`);
      server.close(() => {
        logger.info('✅ Server closed');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    process.on('unhandledRejection', (reason: unknown) => {
      logger.error('Unhandled Rejection', reason);
      process.exit(1);
    });

    process.on('uncaughtException', (err: Error) => {
      logger.error('Uncaught Exception', err);
      process.exit(1);
    });
  } catch (err) {
    logger.error('Failed to start server', err);
    process.exit(1);
  }
};

startServer();
