/**
 * Retry Utilities for Bags API
 *
 * Implements proper retry logic and API client for Bags API interactions
 * with rate limiting, exponential backoff, and error handling.
 */

import { BAGS_API_CONFIG, BAGS_RATE_LIMITS } from '../constants/bags.js';

export interface RetryOptions {
  maxAttempts?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffMultiplier?: number;
  retryOnStatuses?: number[];
}

const DEFAULT_RETRY_OPTIONS: Required<RetryOptions> = {
  maxAttempts: 3,
  initialDelay: 1000,
  maxDelay: 10000,
  backoffMultiplier: 2,
  retryOnStatuses: [429, 502, 503, 504, 520, 522, 524],
};

export interface BagsFetchOptions extends RequestInit {
  timeout?: number;
}

/**
 * Specialized fetch function for Bags API with proper base URL handling,
 * authentication headers, and timeout support.
 */
export async function bagsApiFetch(
  endpoint: string,
  options: BagsFetchOptions = {}
): Promise<Response> {
  const { timeout = 30000, ...fetchOptions } = options;

  // Construct full URL - handle both relative and absolute endpoints
  const url = endpoint.startsWith('http')
    ? endpoint
    : `${BAGS_API_CONFIG.BASE_URL.replace(/\/$/, '')}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  // Set up default headers
  const headers = new Headers(fetchOptions.headers);

  // Always set Content-Type for POST/PUT requests with body (unless FormData)
  if (
    (fetchOptions.method === 'POST' || fetchOptions.method === 'PUT') &&
    fetchOptions.body &&
    !(fetchOptions.body instanceof FormData) &&
    !headers.get('Content-Type')
  ) {
    headers.set('Content-Type', 'application/json');
  }

  // Add API version header
  headers.set('X-Bags-API-Version', BAGS_API_CONFIG.VERSION);

  // Create AbortController for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Bags API request timed out after ${timeout}ms`);
    }

    throw error;
  }
}

/**
 * Retry wrapper with exponential backoff and rate limit awareness.
 * Automatically retries on network errors and specific HTTP status codes.
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const opts = { ...DEFAULT_RETRY_OPTIONS, ...options };
  let lastError: Error;

  for (let attempt = 1; attempt <= opts.maxAttempts; attempt++) {
    try {
      const result = await operation();
      return result;
    } catch (error) {
      lastError = error as Error;

      // Don't retry on the last attempt
      if (attempt === opts.maxAttempts) {
        break;
      }

      // Check if this is a retryable error
      const shouldRetry = await isRetryableError(error, opts.retryOnStatuses);

      if (!shouldRetry) {
        throw error;
      }

      // Calculate delay with exponential backoff
      const baseDelay =
        opts.initialDelay * Math.pow(opts.backoffMultiplier, attempt - 1);
      const delay = Math.min(baseDelay, opts.maxDelay);

      // Add jitter to prevent thundering herd
      const jitteredDelay = delay + Math.random() * 1000;

      console.warn(
        `Bags API request failed (attempt ${attempt}/${opts.maxAttempts}), retrying in ${Math.round(jitteredDelay)}ms...`,
        error instanceof Error ? error.message : String(error)
      );

      await sleep(jitteredDelay);
    }
  }

  throw lastError!;
}

/**
 * Determine if an error should trigger a retry attempt
 */
async function isRetryableError(
  error: unknown,
  retryOnStatuses: number[]
): Promise<boolean> {
  // Network errors (fetch failures)
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return true;
  }

  // Timeout errors
  if (error instanceof Error && error.message.includes('timed out')) {
    return true;
  }

  // HTTP errors with Response object
  if (error instanceof Response) {
    return retryOnStatuses.includes(error.status);
  }

  // Error objects with status property
  if (typeof error === 'object' && error !== null && 'status' in error) {
    const status = (error as any).status;
    return typeof status === 'number' && retryOnStatuses.includes(status);
  }

  return false;
}

/**
 * Sleep utility for retry delays
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Extract rate limit information from response headers
 */
export function extractRateLimitInfo(response: Response): {
  limit: number | null;
  remaining: number | null;
  reset: number | null;
  retryAfter: number | null;
} {
  const limit = response.headers.get(BAGS_RATE_LIMITS.HEADERS.LIMIT);
  const remaining = response.headers.get(BAGS_RATE_LIMITS.HEADERS.REMAINING);
  const reset = response.headers.get(BAGS_RATE_LIMITS.HEADERS.RESET);
  const retryAfter = response.headers.get('Retry-After');

  return {
    limit: limit ? parseInt(limit, 10) : null,
    remaining: remaining ? parseInt(remaining, 10) : null,
    reset: reset ? parseInt(reset, 10) : null,
    retryAfter: retryAfter ? parseInt(retryAfter, 10) : null,
  };
}
