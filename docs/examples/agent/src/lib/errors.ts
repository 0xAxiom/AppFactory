/**
 * Error Handling Utilities
 *
 * Provides typed error classes and handling for consistent error responses.
 */

import { logger } from './logger.js';

/**
 * Application Error
 *
 * Custom error class with code, message, status, and optional details.
 */
export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 500,
    public details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
  }
}

/**
 * Error Codes
 */
export const ErrorCodes = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  TIMEOUT: 'TIMEOUT',
} as const;

/**
 * Handle Error
 *
 * Converts any error to an AppError for consistent handling.
 */
export function handleError(error: unknown): AppError {
  // Already an AppError
  if (error instanceof AppError) {
    logger.error(error.code, {
      message: error.message,
      details: error.details,
    });
    return error;
  }

  // Standard Error
  if (error instanceof Error) {
    logger.error('unhandled_error', {
      message: error.message,
      stack: error.stack,
    });
    return new AppError(
      ErrorCodes.INTERNAL_ERROR,
      error.message || 'An unexpected error occurred',
      500
    );
  }

  // Unknown error type
  logger.error('unknown_error', { error: String(error) });
  return new AppError(
    ErrorCodes.INTERNAL_ERROR,
    'An unexpected error occurred',
    500
  );
}

/**
 * Create common errors
 */
export const Errors = {
  validation: (message: string, details?: unknown) =>
    new AppError(ErrorCodes.VALIDATION_ERROR, message, 400, details),

  notFound: (resource: string) =>
    new AppError(ErrorCodes.NOT_FOUND, `${resource} not found`, 404),

  unauthorized: (message = 'Unauthorized') =>
    new AppError(ErrorCodes.UNAUTHORIZED, message, 401),

  forbidden: (message = 'Forbidden') =>
    new AppError(ErrorCodes.FORBIDDEN, message, 403),

  internal: (message = 'Internal server error') =>
    new AppError(ErrorCodes.INTERNAL_ERROR, message, 500),

  timeout: (message = 'Request timeout') =>
    new AppError(ErrorCodes.TIMEOUT, message, 408),
};
