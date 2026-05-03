// ============================================================
// src/utils/logger.ts
// Simple structured logger utility
// ============================================================

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

const getTimestamp = (): string => new Date().toISOString();

const serializeMeta = (meta: unknown): string => {
  if (meta instanceof Error) {
    return JSON.stringify({ message: meta.message, stack: meta.stack });
  }
  try {
    return JSON.stringify(meta);
  } catch {
    return String(meta);
  }
};

const formatMessage = (level: LogLevel, message: string, meta?: unknown): string => {
  const base = `[${getTimestamp()}] [${level.toUpperCase()}] ${message}`;
  if (meta !== undefined) {
    return `${base} ${serializeMeta(meta)}`;
  }
  return base;
};

export const logger = {
  info: (message: string, meta?: unknown) => {
    console.log(formatMessage('info', message, meta));
  },
  warn: (message: string, meta?: unknown) => {
    console.warn(formatMessage('warn', message, meta));
  },
  error: (message: string, meta?: unknown) => {
    console.error(formatMessage('error', message, meta));
  },
  debug: (message: string, meta?: unknown) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(formatMessage('debug', message, meta));
    }
  },
};
