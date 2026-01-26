/**
 * Deterministic hashing utilities for Repo Mode
 * Uses SHA256 for all cryptographic hashing
 */

import { createHash } from 'crypto';

/**
 * Compute SHA256 hash of a string
 * Returns lowercase hex string
 */
export function sha256(input: string): string {
  return createHash('sha256').update(input, 'utf8').digest('hex');
}

/**
 * Compute SHA256 hash of a buffer
 * Returns lowercase hex string
 */
export function sha256Buffer(input: Buffer): string {
  return createHash('sha256').update(input).digest('hex');
}

/**
 * Create canonical JSON string for deterministic hashing
 * - Sorts object keys alphabetically
 * - No whitespace
 * - Consistent key ordering at all depths
 */
export function canonicalJsonStringify(obj: unknown): string {
  return JSON.stringify(obj, (_, value) => {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return Object.keys(value)
        .sort()
        .reduce((sorted: Record<string, unknown>, key) => {
          sorted[key] = value[key];
          return sorted;
        }, {});
    }
    return value;
  });
}

/**
 * Generate deterministic launch ID from core fields
 * Input: { repoUrl, commitSha, walletAddress, brand, symbol }
 */
export function generateLaunchId(params: {
  repoUrl: string;
  commitSha: string;
  walletAddress: string;
  brand: string;
  symbol: string;
}): string {
  const canonical = canonicalJsonStringify({
    brand: params.brand,
    commitSha: params.commitSha.toLowerCase(),
    repoUrl: params.repoUrl.toLowerCase(),
    symbol: params.symbol.toUpperCase(),
    walletAddress: params.walletAddress
  });

  return sha256(canonical);
}

/**
 * Generate intent hash (hash of intent excluding hashes object)
 */
export function generateIntentHash(intent: Record<string, unknown>): string {
  // Remove hashes field before computing hash
  const { hashes: _hashes, ...intentWithoutHashes } = intent;
  const canonical = canonicalJsonStringify(intentWithoutHashes);
  return sha256(canonical);
}

/**
 * Generate config hash (hash of launch config only)
 */
export function generateConfigHash(launchConfig: {
  brand: string;
  symbol: string;
  description?: string;
}): string {
  const canonical = canonicalJsonStringify(launchConfig);
  return sha256(canonical);
}

/**
 * Generate repo state hash
 */
export function generateRepoStateHash(repo: {
  url: string;
  commitSha: string;
  owner: string;
  name: string;
}): string {
  const canonical = canonicalJsonStringify(repo);
  return sha256(canonical);
}

/**
 * Format hash with sha256: prefix for manifest files
 */
export function formatSha256Hash(hash: string): string {
  return `sha256:${hash}`;
}

/**
 * Timing-safe hash comparison to prevent timing attacks
 */
export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  const bufA = Buffer.from(a, 'utf8');
  const bufB = Buffer.from(b, 'utf8');

  // Use crypto.timingSafeEqual for constant-time comparison
  const { timingSafeEqual: tsEqual } = require('crypto');
  return tsEqual(bufA, bufB);
}
