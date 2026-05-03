// ============================================================
// src/utils/apiResponse.ts
// Standardized API response helpers
// ============================================================

import { Response } from 'express';
import { ApiResponse } from '../types/quran.types';

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message?: string,
  statusCode = 200
): void => {
  const response: ApiResponse<T> = {
    success: true,
    data,
    message,
  };
  res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  error: string,
  statusCode = 500
): void => {
  const response: ApiResponse<null> = {
    success: false,
    error,
  };
  res.status(statusCode).json(response);
};

export const sendNotFound = (res: Response, resource: string): void => {
  sendError(res, `${resource} not found`, 404);
};

export const sendBadRequest = (res: Response, message: string): void => {
  sendError(res, message, 400);
};
