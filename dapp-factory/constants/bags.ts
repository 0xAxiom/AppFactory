/**
 * Bags API Constants
 *
 * Centralized configuration for Bags SDK integration based on official documentation.
 * All values are derived from https://docs.bags.fm/principles/ documentation.
 */

/**
 * Base URL Configuration
 *
 * Based on https://docs.bags.fm/principles/base-url-versioning
 * Current API version: v1 (released 2025-08-02)
 */
export const BAGS_API_CONFIG = {
  BASE_URL: 'https://public-api-v2.bags.fm/api/v1/',
  VERSION: 'v1',
  HEALTH_CHECK_ENDPOINT: '/ping',
  EXPECTED_PING_RESPONSE: { message: 'pong' },
} as const;

/**
 * Rate Limiting Configuration
 *
 * Based on https://docs.bags.fm/principles/rate-limits
 * - 1,000 requests per hour per user
 * - Sliding hourly window system
 * - ~16.7 requests per minute
 */
export const BAGS_RATE_LIMITS = {
  REQUESTS_PER_HOUR: 1000,
  REQUESTS_PER_MINUTE: 16.7, // Approximate for planning
  SLIDING_WINDOW: true,
  RETRY_STATUS_CODE: 429,
  HEADERS: {
    LIMIT: 'X-RateLimit-Limit',
    REMAINING: 'X-RateLimit-Remaining',
    RESET: 'X-RateLimit-Reset',
  },
} as const;

/**
 * Program IDs (Mainnet-Beta)
 *
 * Based on https://docs.bags.fm/principles/program-ids
 * All program IDs are for mainnet-beta network
 */
export const BAGS_PROGRAM_IDS = {
  // Current active programs
  FEE_SHARE_V2: '7ko7duEv4Gk5kRoJKGTRVgypuRHvTbCFbDeaC9Q4pWk3',
  METEORA_DAMM_V2: 'cpamdpZCGKUy5JxQXB4dcpGPiikHawvSWAd6mEn1sGG',
  METEORA_DBC: 'dbcij3LWUppWqq96dh6gJWwBifmcGfLSB5D4DuSMaqN',

  // Legacy (for reference)
  FEE_SHARE_V1_LEGACY: 'FEEhPbKVKnco9EXnaY3i4R5rQVUx91wgVfu8qokixywi',
} as const;

/**
 * Address Lookup Table (LUT) Configuration
 *
 * Based on https://docs.bags.fm/principles/lookup-tables
 * Maintained by Bags for core program IDs and frequently used accounts
 */
export const BAGS_LOOKUP_TABLES = {
  MAINNET_LUT_ADDRESS: 'Eq1EVs15EAWww1YtPTtWPzJRLPJoS6VYP9oW9SbNr3yp',
  REQUIRED_FOR_FEE_CLAIMERS_THRESHOLD: 15, // LUT mandatory for >15 fee claimers
  IDL_REPOSITORY: 'https://github.com/bagsfm/bags-sdk/tree/main/src/idl',
} as const;

/**
 * File Upload Constraints
 *
 * Based on https://docs.bags.fm/principles/file-uploads
 */
export const BAGS_FILE_UPLOAD = {
  MAX_SIZE_MB: 15,
  MAX_SIZE_BYTES: 15 * 1024 * 1024,
  SUPPORTED_TYPES: [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/gif',
    'image/webp',
  ],
  CONTENT_TYPE: 'multipart/form-data',
  FIELD_NAME: 'image',
  ERROR_CODES: {
    FILE_TOO_LARGE: 413,
    UNSUPPORTED_TYPE: 400,
    MISSING_FILE: 400,
    CORRUPTED_FILE: 400,
  },
} as const;

/**
 * Error Handling Configuration
 *
 * Based on https://docs.bags.fm/principles/error-handling
 */
export const BAGS_ERROR_HANDLING = {
  RETRYABLE_STATUS_CODES: [429, 500, 502, 503],
  NON_RETRYABLE_STATUS_CODES: [400, 401, 403, 404],
  MAX_RETRY_ATTEMPTS: 5,
  EXPONENTIAL_BACKOFF_BASE: 2,
  INITIAL_RETRY_DELAY_MS: 1000,
  SUCCESS_RESPONSE_FIELD: 'success',
  ERROR_MESSAGE_FIELD: 'error',
} as const;

/**
 * Tipping Configuration
 *
 * Based on https://docs.bags.fm/principles/tipping
 * Optional feature for specific endpoints
 */
export const BAGS_TIPPING = {
  SUPPORTED_ENDPOINTS: [
    '/token-launch/create-launch-transaction',
    '/fee-share/config',
  ],
  RECOMMENDED_LUT_ADDRESS: 'Eq1EVs15EAWww1YtPTtWPzJRLPJoS6VYP9oW9SbNr3yp',
  PARAMETERS: {
    TIP_WALLET: 'tipWallet', // Base58 encoded Solana public key
    TIP_LAMPORTS: 'tipLamports', // Tip amount in lamports
  },
  DEFAULT_TIP_ENABLED: false,
} as const;

/**
 * API Key Management
 *
 * Based on https://docs.bags.fm/principles/api-key-management
 */
export const BAGS_API_KEYS = {
  PORTAL_URL: 'https://dev.bags.fm',
  MAX_KEYS_PER_USER: 10,
  HEADER_NAME: 'x-api-key',
  ENVIRONMENT_VARIABLE: 'BAGS_API_KEY',
  RECOMMENDED_ENVIRONMENTS: ['development', 'staging', 'production'],
} as const;

/**
 * Network Configuration
 *
 * Solana network configuration for Bags API
 */
export const BAGS_NETWORKS = {
  MAINNET: {
    name: 'mainnet-beta',
    rpc: 'https://api.mainnet-beta.solana.com',
    program_ids: BAGS_PROGRAM_IDS,
  },
  DEVNET: {
    name: 'devnet',
    rpc: 'https://api.devnet.solana.com',
    // Note: Check Bags docs for devnet program IDs if supported
    program_ids: null, // TBD based on Bags devnet support
  },
} as const;

/**
 * Token Launch Parameters
 *
 * Based on https://docs.bags.fm/how-to-guides/launch-token
 */
export const BAGS_TOKEN_LAUNCH = {
  REQUIRED_PARAMS: [
    'image', // URL or uploaded file
    'name',
    'symbol',
    'description',
    'initialBuyAmount',
  ],
  OPTIONAL_PARAMS: [
    'twitter',
    'website',
    'telegram',
    'feeClaimers', // Array with percentage allocation, max 100 claimers
  ],
  FEE_SHARE_CONFIG: {
    MAX_CLAIMERS: 100,
    MAX_TOTAL_BPS: 10000, // 100% in basis points
    CREATOR_MUST_SET_BPS: true,
  },
  SUPPORTED_SOCIAL_PLATFORMS: ['twitter', 'kick', 'github'],
} as const;

/**
 * Validation Functions
 */
export function validateImageFile(file: File): void {
  if (file.size > BAGS_FILE_UPLOAD.MAX_SIZE_BYTES) {
    throw new Error(
      `File size must be under ${BAGS_FILE_UPLOAD.MAX_SIZE_MB}MB`
    );
  }

  if (!BAGS_FILE_UPLOAD.SUPPORTED_TYPES.includes(file.type)) {
    throw new Error(
      `Invalid file type. Supported: ${BAGS_FILE_UPLOAD.SUPPORTED_TYPES.join(', ')}`
    );
  }
}

export function isRetryableError(statusCode: number): boolean {
  return BAGS_ERROR_HANDLING.RETRYABLE_STATUS_CODES.includes(statusCode);
}

export function calculateBackoffDelay(attempt: number): number {
  return (
    BAGS_ERROR_HANDLING.INITIAL_RETRY_DELAY_MS *
    Math.pow(BAGS_ERROR_HANDLING.EXPONENTIAL_BACKOFF_BASE, attempt)
  );
}
