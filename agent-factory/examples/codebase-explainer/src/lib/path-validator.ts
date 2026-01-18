/**
 * Path validation utilities for safe filesystem access.
 * Prevents path traversal attacks and enforces allowed roots.
 */

import * as path from 'node:path';
import * as fs from 'node:fs';
import { PathTraversalError, DirectoryNotFoundError } from './errors.js';

/**
 * Validates that a path is safe and within allowed boundaries.
 * @param requestedPath - The path to validate
 * @param allowedRoot - The root directory the path must be within
 * @returns The resolved, validated path
 * @throws PathTraversalError if path attempts to escape root
 * @throws DirectoryNotFoundError if root doesn't exist
 */
export function validatePath(requestedPath: string, allowedRoot: string): string {
  // Resolve both paths to absolute
  const resolvedPath = path.resolve(requestedPath);
  const resolvedRoot = path.resolve(allowedRoot);

  // Check if root exists
  if (!fs.existsSync(resolvedRoot)) {
    throw new DirectoryNotFoundError(allowedRoot);
  }

  // Ensure the resolved path starts with the root
  const isWithinRoot = resolvedPath === resolvedRoot || resolvedPath.startsWith(resolvedRoot + path.sep);

  if (!isWithinRoot) {
    throw new PathTraversalError(requestedPath);
  }

  // Check for .. in the original path (even if resolved safely, this is suspicious)
  if (requestedPath.includes('..')) {
    throw new PathTraversalError(requestedPath);
  }

  return resolvedPath;
}

/**
 * Checks if a path is allowed based on ALLOWED_ROOTS environment variable.
 * @param requestedPath - The path to check
 * @returns true if path is allowed
 */
export function isPathAllowed(requestedPath: string): boolean {
  const allowedRoots = process.env.ALLOWED_ROOTS?.split(',').map(r => r.trim()).filter(Boolean);

  // If no roots configured, allow any path (use with caution)
  if (!allowedRoots || allowedRoots.length === 0) {
    return true;
  }

  const resolvedPath = path.resolve(requestedPath);

  return allowedRoots.some(root => {
    const resolvedRoot = path.resolve(root);
    return resolvedPath === resolvedRoot || resolvedPath.startsWith(resolvedRoot + path.sep);
  });
}

/**
 * Gets a safe relative path for display purposes.
 * @param absolutePath - The absolute path
 * @param root - The root to make it relative to
 * @returns Relative path string
 */
export function getRelativePath(absolutePath: string, root: string): string {
  return path.relative(root, absolutePath);
}
