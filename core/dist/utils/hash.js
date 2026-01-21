/**
 * Hashing Utilities
 *
 * Provides consistent hashing for run IDs, input fingerprinting,
 * and determinism tracking.
 *
 * @module @appfactory/core/utils
 */
import * as crypto from 'node:crypto';
/**
 * Generate a SHA-256 hash of a string
 *
 * @param input - String to hash
 * @param length - Optional length to truncate the hash to
 * @returns Hex-encoded hash
 */
export function sha256(input, length) {
  const hash = crypto.createHash('sha256').update(input).digest('hex');
  return length ? hash.substring(0, length) : hash;
}
/**
 * Generate a SHA-256 hash of an object
 *
 * @param obj - Object to hash (will be JSON stringified with sorted keys)
 * @param length - Optional length to truncate the hash to
 * @returns Hex-encoded hash
 */
export function hashObject(obj, length) {
  const content = JSON.stringify(obj, Object.keys(obj).sort());
  return sha256(content, length);
}
/**
 * Generate a unique run ID
 *
 * @param pipeline - Pipeline identifier
 * @param suffix - Optional suffix for the run ID
 * @returns Run ID in format: YYYYMMDD_HHMMSS_<pipeline>_<suffix>
 */
export function generateRunId(pipeline, suffix) {
  const timestamp = new Date()
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/T/, '_')
    .replace(/\..+/, '');
  const parts = [timestamp, pipeline];
  if (suffix) {
    parts.push(suffix);
  }
  return parts.join('_');
}
/**
 * Generate a content-addressed run ID
 *
 * @param pipeline - Pipeline identifier
 * @param intent - User intent/prompt
 * @returns Run ID with content hash
 */
export function generateContentAddressedRunId(pipeline, intent) {
  const contentHash = sha256(intent, 8);
  const timestamp = new Date()
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/T/, '-')
    .replace(/\..+/, '')
    .substring(0, 13);
  return `${pipeline}-${timestamp}-${contentHash}`;
}
/**
 * Generate a slug from a name
 *
 * @param name - Name to slugify
 * @param maxLength - Maximum length of the slug (default: 30)
 * @returns URL-safe slug
 */
export function slugify(name, maxLength = 30) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, maxLength);
}
/**
 * Generate a unique build ID
 *
 * @returns Build ID in format: build_<timestamp>
 */
export function generateBuildId() {
  return `build_${Date.now()}`;
}
/**
 * Generate an inputs hash for determinism tracking
 *
 * @param inputs - Object containing all inputs
 * @returns 16-character hex hash
 */
export function hashInputs(inputs) {
  return hashObject(inputs, 16);
}
/**
 * Generate a random ID
 *
 * @param length - Length of the ID (default: 8)
 * @returns Random hex string
 */
export function randomId(length = 8) {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .substring(0, length);
}
/**
 * Create a content hash for a file
 *
 * @param content - File content
 * @returns SHA-256 hash of the content
 */
export function contentHash(content) {
  return crypto.createHash('sha256').update(content).digest('hex');
}
//# sourceMappingURL=hash.js.map
