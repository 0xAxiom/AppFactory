#!/usr/bin/env node
/**
 * Path Validation Utility
 *
 * Validates file paths to prevent directory traversal attacks.
 * Mirrors the logic in agent-factory/examples/codebase-explainer/src/lib/path-validator.ts
 *
 * Usage:
 *   node scripts/security/validate-paths.js <path> <allowed-root>
 *
 * Exit codes:
 *   0 - Path is safe
 *   1 - Path traversal detected
 *   2 - Invalid arguments
 */

import * as path from 'path';
import * as fs from 'fs';

/**
 * Validates that a path is safe and within allowed boundaries.
 * @param {string} requestedPath - The path to validate
 * @param {string} allowedRoot - The root directory the path must be within
 * @returns {{ valid: boolean, resolved: string, error?: string }}
 */
function validatePath(requestedPath, allowedRoot) {
  // Resolve both paths to absolute
  const resolvedPath = path.resolve(requestedPath);
  const resolvedRoot = path.resolve(allowedRoot);

  // Check if root exists
  if (!fs.existsSync(resolvedRoot)) {
    return {
      valid: false,
      resolved: resolvedPath,
      error: `Root directory does not exist: ${allowedRoot}`,
    };
  }

  // Ensure the resolved path starts with the root
  const isWithinRoot =
    resolvedPath === resolvedRoot ||
    resolvedPath.startsWith(resolvedRoot + path.sep);

  if (!isWithinRoot) {
    return {
      valid: false,
      resolved: resolvedPath,
      error: `Path escapes allowed root: ${requestedPath} -> ${resolvedPath}`,
    };
  }

  // Check for .. in the original path (even if resolved safely, this is suspicious)
  if (requestedPath.includes('..')) {
    return {
      valid: false,
      resolved: resolvedPath,
      error: `Path contains traversal pattern '..': ${requestedPath}`,
    };
  }

  return {
    valid: true,
    resolved: resolvedPath,
  };
}

/**
 * Checks if a path matches any dangerous patterns
 * @param {string} filePath - The path to check
 * @returns {{ safe: boolean, issues: string[] }}
 */
function checkDangerousPatterns(filePath) {
  const issues = [];

  // Check for null bytes
  if (filePath.includes('\x00')) {
    issues.push('Path contains null byte');
  }

  // Check for excessive path length
  if (filePath.length > 4096) {
    issues.push('Path exceeds maximum length');
  }

  // Check for suspicious characters
  if (/[<>"|?*]/.test(filePath)) {
    issues.push('Path contains invalid characters');
  }

  // Check for hidden file attempts via Unicode
  if (/[\u200B-\u200D\uFEFF]/.test(filePath)) {
    issues.push('Path contains invisible Unicode characters');
  }

  return {
    safe: issues.length === 0,
    issues,
  };
}

/**
 * Validates multiple paths against allowed roots
 * @param {string[]} paths - Paths to validate
 * @param {string[]} allowedRoots - Allowed root directories
 * @returns {{ valid: boolean, results: object[] }}
 */
function validateMultiplePaths(paths, allowedRoots) {
  const results = [];

  for (const p of paths) {
    // Check dangerous patterns first
    const patternCheck = checkDangerousPatterns(p);
    if (!patternCheck.safe) {
      results.push({
        path: p,
        valid: false,
        error: patternCheck.issues.join(', '),
      });
      continue;
    }

    // Check against each allowed root
    let isValid = false;
    let resolvedPath = '';
    let lastError = '';

    for (const root of allowedRoots) {
      const result = validatePath(p, root);
      if (result.valid) {
        isValid = true;
        resolvedPath = result.resolved;
        break;
      }
      lastError = result.error;
    }

    results.push({
      path: p,
      valid: isValid,
      resolved: resolvedPath,
      error: isValid ? undefined : lastError,
    });
  }

  return {
    valid: results.every((r) => r.valid),
    results,
  };
}

function main() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.error('Usage: validate-paths.js <path> <allowed-root>');
    console.error('       validate-paths.js --batch <paths-file> <roots-file>');
    process.exit(2);
  }

  if (args[0] === '--batch') {
    // Batch mode: read paths and roots from files
    const pathsFile = args[1];
    const rootsFile = args[2];

    if (!pathsFile || !rootsFile) {
      console.error('Batch mode requires paths file and roots file');
      process.exit(2);
    }

    const paths = fs
      .readFileSync(pathsFile, 'utf-8')
      .split('\n')
      .filter(Boolean);
    const roots = fs
      .readFileSync(rootsFile, 'utf-8')
      .split('\n')
      .filter(Boolean);

    const result = validateMultiplePaths(paths, roots);
    console.log(JSON.stringify(result, null, 2));
    process.exit(result.valid ? 0 : 1);
  }

  // Single path mode
  const requestedPath = args[0];
  const allowedRoot = args[1];

  // Check dangerous patterns
  const patternCheck = checkDangerousPatterns(requestedPath);
  if (!patternCheck.safe) {
    console.error('Path failed safety check:', patternCheck.issues.join(', '));
    process.exit(1);
  }

  // Validate path
  const result = validatePath(requestedPath, allowedRoot);

  if (result.valid) {
    console.log('Path is safe:', result.resolved);
    process.exit(0);
  } else {
    console.error('Path validation failed:', result.error);
    process.exit(1);
  }
}

main();
