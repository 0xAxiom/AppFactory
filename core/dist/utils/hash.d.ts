/**
 * Hashing Utilities
 *
 * Provides consistent hashing for run IDs, input fingerprinting,
 * and determinism tracking.
 *
 * @module @appfactory/core/utils
 */
/**
 * Generate a SHA-256 hash of a string
 *
 * @param input - String to hash
 * @param length - Optional length to truncate the hash to
 * @returns Hex-encoded hash
 */
export declare function sha256(input: string, length?: number): string;
/**
 * Generate a SHA-256 hash of an object
 *
 * @param obj - Object to hash (will be JSON stringified with sorted keys)
 * @param length - Optional length to truncate the hash to
 * @returns Hex-encoded hash
 */
export declare function hashObject(obj: unknown, length?: number): string;
/**
 * Generate a unique run ID
 *
 * @param pipeline - Pipeline identifier
 * @param suffix - Optional suffix for the run ID
 * @returns Run ID in format: YYYYMMDD_HHMMSS_<pipeline>_<suffix>
 */
export declare function generateRunId(
  pipeline: string,
  suffix?: string
): string;
/**
 * Generate a content-addressed run ID
 *
 * @param pipeline - Pipeline identifier
 * @param intent - User intent/prompt
 * @returns Run ID with content hash
 */
export declare function generateContentAddressedRunId(
  pipeline: string,
  intent: string
): string;
/**
 * Generate a slug from a name
 *
 * @param name - Name to slugify
 * @param maxLength - Maximum length of the slug (default: 30)
 * @returns URL-safe slug
 */
export declare function slugify(name: string, maxLength?: number): string;
/**
 * Generate a unique build ID
 *
 * @returns Build ID in format: build_<timestamp>
 */
export declare function generateBuildId(): string;
/**
 * Generate an inputs hash for determinism tracking
 *
 * @param inputs - Object containing all inputs
 * @returns 16-character hex hash
 */
export declare function hashInputs(inputs: Record<string, unknown>): string;
/**
 * Generate a random ID
 *
 * @param length - Length of the ID (default: 8)
 * @returns Random hex string
 */
export declare function randomId(length?: number): string;
/**
 * Create a content hash for a file
 *
 * @param content - File content
 * @returns SHA-256 hash of the content
 */
export declare function contentHash(content: string | Buffer): string;
//# sourceMappingURL=hash.d.ts.map
