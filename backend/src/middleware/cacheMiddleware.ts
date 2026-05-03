import { Request, Response, NextFunction } from 'express';
import { cache } from '../utils/cache';

/**
 * Simple middleware to cache GET requests based on URL
 * @param ttl Time to live in seconds
 */
export const cacheMiddleware = (ttl?: number) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const key = `__cache__${req.originalUrl || req.url}`;
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
      return res.send(cachedResponse);
    }

    // Intercept res.send to store in cache
    const originalSend = res.send;
    res.send = function (body) {
      cache.set(key, body, ttl);
      return originalSend.call(this, body);
    };

    next();
  };
};
