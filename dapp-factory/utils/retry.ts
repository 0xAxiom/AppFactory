/**
 * Retry Utilities for Bags API
 *
 * Provides retry logic and API fetch wrapper for Bags API interactions.
 */

import { BAGS_API_CONFIG } from '../constants/bags.js';

export interface RetryConfig {
  maxAttempts: number;
  initialDelayMs: number;
  backoffBase: number;
  retryableStatusCodes: number[];
  timeoutMs?: number;
}

export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 5,
  initialDelayMs: 1000,
  backoffBase: 2,
  retryableStatusCodes: [429, 500, 502, 503, 504],
};

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Generic retry wrapper for async functions
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  config: RetryConfig = DEFAULT_RETRY_CONFIG
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < config.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Check if this is a response with a status code we shouldn't retry
      if (error instanceof Error && error.message.includes('Non-retryable')) {
        throw error;
      }

      if (attempt < config.maxAttempts - 1) {
        const delay =
          config.initialDelayMs * Math.pow(config.backoffBase, attempt);
        console.log(
          `Retry ${attempt + 1}/${config.maxAttempts} in ${delay}ms... (${lastError.message})`
        );
        await sleep(delay);
      }
    }
  }

  throw new Error(
    `All ${config.maxAttempts} attempts failed. Last error: ${lastError?.message}`
  );
}

/**
 * Bags API fetch wrapper with automatic base URL resolution and headers
 */
export async function bagsApiFetch(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  // Resolve endpoint to full URL if it's a relative path
  const url = endpoint.startsWith('http')
    ? endpoint
    : `${BAGS_API_CONFIG.BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  // Merge headers with defaults
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add API key if available
  const apiKey = process.env.BAGS_API_KEY;
  if (apiKey) {
    headers['x-api-key'] = apiKey;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Check for non-retryable status codes
  if (!response.ok && ![429, 500, 502, 503, 504].includes(response.status)) {
    throw new Error(
      `Non-retryable HTTP ${response.status}: ${await response.text()}`
    );
  }

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response;
}

/**
 * Bags API fetch with automatic retry
 */
export async function bagsApiFetchWithRetry(
  endpoint: string,
  options: RequestInit = {},
  retryConfig: RetryConfig = DEFAULT_RETRY_CONFIG
): Promise<Response> {
  return withRetry(() => bagsApiFetch(endpoint, options), retryConfig);
}
