// ============================================================
// src/utils/cache.ts
// In-memory cache using node-cache
// ============================================================

import NodeCache from 'node-cache';
import { logger } from './logger';

// Default TTL: 1 hour (from env or fallback)
const DEFAULT_TTL = parseInt(process.env.CACHE_TTL ?? '3600', 10);

class CacheService {
  private cache: NodeCache;

  constructor(ttl: number = DEFAULT_TTL) {
    this.cache = new NodeCache({
      stdTTL: ttl,
      checkperiod: ttl * 0.2, // Check for expired keys every 20% of TTL
      useClones: false,        // Better performance for large objects
    });

    this.cache.on('expired', (key: string) => {
      logger.debug(`Cache key expired: ${key}`);
    });

    logger.info(`Cache initialized with TTL: ${ttl}s`);
  }

  get<T>(key: string): T | undefined {
    const value = this.cache.get<T>(key);
    if (value !== undefined) {
      logger.debug(`Cache HIT: ${key}`);
    } else {
      logger.debug(`Cache MISS: ${key}`);
    }
    return value;
  }

  set<T>(key: string, value: T, ttl?: number): boolean {
    const result = ttl !== undefined
      ? this.cache.set(key, value, ttl)
      : this.cache.set(key, value);
    if (result) {
      logger.debug(`Cache SET: ${key}`);
    }
    return result;
  }

  del(key: string): number {
    return this.cache.del(key);
  }

  flush(): void {
    this.cache.flushAll();
    logger.info('Cache flushed');
  }

  getStats() {
    return this.cache.getStats();
  }
}

// Singleton instance
export const cache = new CacheService();
