/**
 * Deterministic naming utilities for Repo Mode
 * Generates predictable branch names and slugs
 */

import { sha256 } from './hashing.js';

/**
 * Generate URL-safe slug from brand name
 * - Lowercase
 * - Replace spaces and special chars with hyphens
 * - Remove consecutive hyphens
 * - Trim leading/trailing hyphens
 */
export function generateSlug(brand: string): string {
  return brand
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
    .replace(/-+/g, '-') // Collapse consecutive hyphens
    .replace(/^-|-$/g, ''); // Trim leading/trailing hyphens
}

/**
 * Generate deterministic branch name
 * Format: launch/{slug}-{8-char-hash}
 *
 * The hash suffix ensures uniqueness while the slug provides readability
 */
export function generateBranchName(params: {
  brand: string;
  walletAddress: string;
  commitSha: string;
}): string {
  const slug = generateSlug(params.brand);

  // Generate hash from wallet + commit for uniqueness
  const hashInput = `${params.walletAddress}:${params.commitSha}`;
  const fullHash = sha256(hashInput);
  const shortHash = fullHash.substring(0, 8);

  return `launch/${slug}-${shortHash}`;
}

/**
 * Generate token symbol from brand name if not provided
 * - Takes first letter of each word
 * - Uppercase
 * - Max 5 characters
 */
export function generateTokenSymbol(brand: string): string {
  const words = brand.split(/[\s-_]+/).filter((w) => w.length > 0);

  if (words.length === 1) {
    // Single word: take first 3-5 chars
    return words[0].substring(0, 5).toUpperCase();
  }

  // Multiple words: take first letter of each
  const symbol = words
    .map((w) => w[0])
    .join('')
    .substring(0, 5)
    .toUpperCase();

  return symbol;
}

/**
 * Extract repo name from GitHub URL
 */
export function extractRepoName(repoUrl: string): string | null {
  const match = repoUrl.match(/github\.com\/[^/]+\/([^/]+)\/?$/);
  if (!match) return null;
  return match[1].replace(/\.git$/, '');
}

/**
 * Extract owner from GitHub URL
 */
export function extractOwner(repoUrl: string): string | null {
  const match = repoUrl.match(/github\.com\/([^/]+)\/[^/]+\/?$/);
  if (!match) return null;
  return match[1];
}
