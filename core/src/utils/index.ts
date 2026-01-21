/**
 * Utilities - Barrel Export
 *
 * Re-exports all utilities from the @appfactory/core package.
 *
 * @module @appfactory/core/utils
 */

// Logger
export { Logger, createLogger, logger } from './logger.js';
export type { LogLevel, LogEntry, LoggerOptions } from './logger.js';

// File system utilities
export {
  exists,
  isDirectory,
  isFile,
  readFile,
  readFileSafe,
  writeFile,
  readJson,
  readJsonSafe,
  writeJson,
  ensureDir,
  remove,
  copyFile,
  copyDir,
  listFiles,
  listFilesRecursive,
  getFileSize,
  getDirSize,
  getModTime,
  createTempDir,
} from './fs.js';

// Hashing utilities
export {
  sha256,
  hashObject,
  generateRunId,
  generateContentAddressedRunId,
  slugify,
  generateBuildId,
  hashInputs,
  randomId,
  contentHash,
} from './hash.js';

// Date utilities
export {
  toISOString,
  toDateString,
  toCompactDate,
  toTimestamp,
  toHumanReadable,
  formatDuration,
  getRelativeTime,
  isToday,
  addTime,
} from './date.js';
