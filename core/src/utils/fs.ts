/**
 * File System Utilities
 *
 * Provides safe file system operations with error handling,
 * JSON parsing, and directory management.
 *
 * @module @appfactory/core/utils
 */

import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';

/**
 * Check if a file or directory exists
 *
 * @param filePath - Path to check
 * @returns true if exists, false otherwise
 */
export function exists(filePath: string): boolean {
  try {
    fs.accessSync(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if a path is a directory
 *
 * @param dirPath - Path to check
 * @returns true if directory, false otherwise
 */
export function isDirectory(dirPath: string): boolean {
  try {
    return fs.statSync(dirPath).isDirectory();
  } catch {
    return false;
  }
}

/**
 * Check if a path is a file
 *
 * @param filePath - Path to check
 * @returns true if file, false otherwise
 */
export function isFile(filePath: string): boolean {
  try {
    return fs.statSync(filePath).isFile();
  } catch {
    return false;
  }
}

/**
 * Read a file as UTF-8 string
 *
 * @param filePath - Path to the file
 * @returns File contents
 * @throws Error if file cannot be read
 */
export function readFile(filePath: string): string {
  return fs.readFileSync(filePath, 'utf-8');
}

/**
 * Read a file as UTF-8 string, returning null if it doesn't exist
 *
 * @param filePath - Path to the file
 * @returns File contents or null
 */
export function readFileSafe(filePath: string): string | null {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch {
    return null;
  }
}

/**
 * Write a string to a file, creating directories as needed
 *
 * @param filePath - Path to write to
 * @param content - Content to write
 */
export function writeFile(filePath: string, content: string): void {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, 'utf-8');
}

/**
 * Read and parse a JSON file
 *
 * @param filePath - Path to the JSON file
 * @returns Parsed JSON object
 * @throws Error if file cannot be read or parsed
 */
export function readJson<T = unknown>(filePath: string): T {
  const content = readFile(filePath);
  return JSON.parse(content) as T;
}

/**
 * Read and parse a JSON file, returning null if it doesn't exist or fails
 *
 * @param filePath - Path to the JSON file
 * @returns Parsed JSON object or null
 */
export function readJsonSafe<T = unknown>(filePath: string): T | null {
  try {
    const content = readFile(filePath);
    return JSON.parse(content) as T;
  } catch {
    return null;
  }
}

/**
 * Write an object to a JSON file with pretty formatting
 *
 * @param filePath - Path to write to
 * @param data - Data to write
 * @param pretty - Whether to format with indentation (default: true)
 */
export function writeJson(
  filePath: string,
  data: unknown,
  pretty: boolean = true
): void {
  const content = pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data);
  writeFile(filePath, content);
}

/**
 * Ensure a directory exists, creating it and parents if needed
 *
 * @param dirPath - Directory path to ensure
 */
export function ensureDir(dirPath: string): void {
  if (!exists(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Remove a file or directory recursively
 *
 * @param targetPath - Path to remove
 */
export function remove(targetPath: string): void {
  if (exists(targetPath)) {
    fs.rmSync(targetPath, { recursive: true, force: true });
  }
}

/**
 * Copy a file
 *
 * @param src - Source path
 * @param dest - Destination path
 */
export function copyFile(src: string, dest: string): void {
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
}

/**
 * Copy a directory recursively
 *
 * @param src - Source directory
 * @param dest - Destination directory
 */
export function copyDir(src: string, dest: string): void {
  ensureDir(dest);
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      copyFile(srcPath, destPath);
    }
  }
}

/**
 * List files in a directory
 *
 * @param dirPath - Directory to list
 * @returns Array of file names
 */
export function listFiles(dirPath: string): string[] {
  if (!isDirectory(dirPath)) {
    return [];
  }
  return fs.readdirSync(dirPath);
}

/**
 * List files in a directory recursively
 *
 * @param dirPath - Directory to list
 * @param options - Options for listing
 * @returns Array of relative file paths
 */
export function listFilesRecursive(
  dirPath: string,
  options: {
    /** File extensions to include (e.g., ['.ts', '.tsx']) */
    extensions?: string[];
    /** Directories to exclude */
    excludeDirs?: string[];
    /** Maximum depth (undefined = unlimited) */
    maxDepth?: number;
  } = {}
): string[] {
  const {
    extensions,
    excludeDirs = ['node_modules', '.git'],
    maxDepth,
  } = options;
  const results: string[] = [];

  function walk(dir: string, depth: number, prefix: string): void {
    if (maxDepth !== undefined && depth > maxDepth) {
      return;
    }

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const relativePath = prefix ? `${prefix}/${entry.name}` : entry.name;

      if (entry.isDirectory()) {
        if (!excludeDirs.includes(entry.name)) {
          walk(path.join(dir, entry.name), depth + 1, relativePath);
        }
      } else {
        if (!extensions || extensions.some((ext) => entry.name.endsWith(ext))) {
          results.push(relativePath);
        }
      }
    }
  }

  walk(dirPath, 0, '');
  return results;
}

/**
 * Get file size in bytes
 *
 * @param filePath - Path to the file
 * @returns File size in bytes, or 0 if file doesn't exist
 */
export function getFileSize(filePath: string): number {
  try {
    return fs.statSync(filePath).size;
  } catch {
    return 0;
  }
}

/**
 * Get the total size of a directory
 *
 * @param dirPath - Directory path
 * @returns Total size in bytes
 */
export function getDirSize(dirPath: string): number {
  let total = 0;

  const files = listFilesRecursive(dirPath);
  for (const file of files) {
    total += getFileSize(path.join(dirPath, file));
  }

  return total;
}

/**
 * Get file modification time
 *
 * @param filePath - Path to the file
 * @returns Modification date or null if file doesn't exist
 */
export function getModTime(filePath: string): Date | null {
  try {
    return fs.statSync(filePath).mtime;
  } catch {
    return null;
  }
}

/**
 * Create a temporary directory
 *
 * @param prefix - Prefix for the temp directory name
 * @returns Path to the created temp directory
 */
export function createTempDir(prefix: string = 'appfactory-'): string {
  return fs.mkdtempSync(
    path.join(fs.realpathSync(os.tmpdir()), prefix)
  );
}
