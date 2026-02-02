/**
 * HTTP Retry Utility
 *
 * Exponential backoff retry logic for API calls to Bags and Clanker endpoints.
 */

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
  retryableStatusCodes: [429, 500, 502, 503],
};

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchWithRetry(
  url: string,
  options: RequestInit,
  config: RetryConfig = DEFAULT_RETRY_CONFIG
): Promise<Response> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < config.maxAttempts; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = config.timeoutMs
        ? setTimeout(() => controller.abort(), config.timeoutMs)
        : null;

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      if (timeoutId) clearTimeout(timeoutId);

      if (response.ok) return response;

      if (!config.retryableStatusCodes.includes(response.status)) {
        throw new Error(
          `Non-retryable HTTP ${response.status}: ${await response.text()}`
        );
      }

      lastError = new Error(`HTTP ${response.status}`);
    } catch (error) {
      if (error instanceof Error && error.message.startsWith('Non-retryable')) {
        throw error;
      }
      lastError = error instanceof Error ? error : new Error(String(error));
    }

    if (attempt < config.maxAttempts - 1) {
      const delay =
        config.initialDelayMs * Math.pow(config.backoffBase, attempt);
      console.log(
        `Retry ${attempt + 1}/${config.maxAttempts} in ${delay}ms...`
      );
      await sleep(delay);
    }
  }

  throw new Error(
    `All ${config.maxAttempts} attempts failed. Last error: ${lastError?.message}`
  );
}
