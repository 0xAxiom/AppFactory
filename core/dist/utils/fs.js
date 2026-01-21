/**
 * File System Utilities
 *
 * Provides safe file system operations with error handling,
 * JSON parsing, and directory management.
 *
 * @module @appfactory/core/utils
 */
import * as fs from 'node:fs';
import * as path from 'node:path';
/**
 * Check if a file or directory exists
 *
 * @param filePath - Path to check
 * @returns true if exists, false otherwise
 */
export function exists(filePath) {
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
export function isDirectory(dirPath) {
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
export function isFile(filePath) {
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
export function readFile(filePath) {
  return fs.readFileSync(filePath, 'utf-8');
}
/**
 * Read a file as UTF-8 string, returning null if it doesn't exist
 *
 * @param filePath - Path to the file
 * @returns File contents or null
 */
export function readFileSafe(filePath) {
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
export function writeFile(filePath, content) {
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
export function readJson(filePath) {
  const content = readFile(filePath);
  return JSON.parse(content);
}
/**
 * Read and parse a JSON file, returning null if it doesn't exist or fails
 *
 * @param filePath - Path to the JSON file
 * @returns Parsed JSON object or null
 */
export function readJsonSafe(filePath) {
  try {
    const content = readFile(filePath);
    return JSON.parse(content);
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
export function writeJson(filePath, data, pretty = true) {
  const content = pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data);
  writeFile(filePath, content);
}
/**
 * Ensure a directory exists, creating it and parents if needed
 *
 * @param dirPath - Directory path to ensure
 */
export function ensureDir(dirPath) {
  if (!exists(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}
/**
 * Remove a file or directory recursively
 *
 * @param targetPath - Path to remove
 */
export function remove(targetPath) {
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
export function copyFile(src, dest) {
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
}
/**
 * Copy a directory recursively
 *
 * @param src - Source directory
 * @param dest - Destination directory
 */
export function copyDir(src, dest) {
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
export function listFiles(dirPath) {
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
export function listFilesRecursive(dirPath, options = {}) {
  const {
    extensions,
    excludeDirs = ['node_modules', '.git'],
    maxDepth,
  } = options;
  const results = [];
  function walk(dir, depth, prefix) {
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
export function getFileSize(filePath) {
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
export function getDirSize(dirPath) {
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
export function getModTime(filePath) {
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
export function createTempDir(prefix = 'appfactory-') {
  return fs.mkdtempSync(
    path.join(fs.realpathSync(require('os').tmpdir()), prefix)
  );
}
//# sourceMappingURL=fs.js.map
