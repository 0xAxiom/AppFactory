/**
 * File System Utilities
 *
 * Provides safe file system operations with error handling,
 * JSON parsing, and directory management.
 *
 * @module @appfactory/core/utils
 */
/**
 * Check if a file or directory exists
 *
 * @param filePath - Path to check
 * @returns true if exists, false otherwise
 */
export declare function exists(filePath: string): boolean;
/**
 * Check if a path is a directory
 *
 * @param dirPath - Path to check
 * @returns true if directory, false otherwise
 */
export declare function isDirectory(dirPath: string): boolean;
/**
 * Check if a path is a file
 *
 * @param filePath - Path to check
 * @returns true if file, false otherwise
 */
export declare function isFile(filePath: string): boolean;
/**
 * Read a file as UTF-8 string
 *
 * @param filePath - Path to the file
 * @returns File contents
 * @throws Error if file cannot be read
 */
export declare function readFile(filePath: string): string;
/**
 * Read a file as UTF-8 string, returning null if it doesn't exist
 *
 * @param filePath - Path to the file
 * @returns File contents or null
 */
export declare function readFileSafe(filePath: string): string | null;
/**
 * Write a string to a file, creating directories as needed
 *
 * @param filePath - Path to write to
 * @param content - Content to write
 */
export declare function writeFile(filePath: string, content: string): void;
/**
 * Read and parse a JSON file
 *
 * @param filePath - Path to the JSON file
 * @returns Parsed JSON object
 * @throws Error if file cannot be read or parsed
 */
export declare function readJson<T = unknown>(filePath: string): T;
/**
 * Read and parse a JSON file, returning null if it doesn't exist or fails
 *
 * @param filePath - Path to the JSON file
 * @returns Parsed JSON object or null
 */
export declare function readJsonSafe<T = unknown>(filePath: string): T | null;
/**
 * Write an object to a JSON file with pretty formatting
 *
 * @param filePath - Path to write to
 * @param data - Data to write
 * @param pretty - Whether to format with indentation (default: true)
 */
export declare function writeJson(filePath: string, data: unknown, pretty?: boolean): void;
/**
 * Ensure a directory exists, creating it and parents if needed
 *
 * @param dirPath - Directory path to ensure
 */
export declare function ensureDir(dirPath: string): void;
/**
 * Remove a file or directory recursively
 *
 * @param targetPath - Path to remove
 */
export declare function remove(targetPath: string): void;
/**
 * Copy a file
 *
 * @param src - Source path
 * @param dest - Destination path
 */
export declare function copyFile(src: string, dest: string): void;
/**
 * Copy a directory recursively
 *
 * @param src - Source directory
 * @param dest - Destination directory
 */
export declare function copyDir(src: string, dest: string): void;
/**
 * List files in a directory
 *
 * @param dirPath - Directory to list
 * @returns Array of file names
 */
export declare function listFiles(dirPath: string): string[];
/**
 * List files in a directory recursively
 *
 * @param dirPath - Directory to list
 * @param options - Options for listing
 * @returns Array of relative file paths
 */
export declare function listFilesRecursive(dirPath: string, options?: {
    /** File extensions to include (e.g., ['.ts', '.tsx']) */
    extensions?: string[];
    /** Directories to exclude */
    excludeDirs?: string[];
    /** Maximum depth (undefined = unlimited) */
    maxDepth?: number;
}): string[];
/**
 * Get file size in bytes
 *
 * @param filePath - Path to the file
 * @returns File size in bytes, or 0 if file doesn't exist
 */
export declare function getFileSize(filePath: string): number;
/**
 * Get the total size of a directory
 *
 * @param dirPath - Directory path
 * @returns Total size in bytes
 */
export declare function getDirSize(dirPath: string): number;
/**
 * Get file modification time
 *
 * @param filePath - Path to the file
 * @returns Modification date or null if file doesn't exist
 */
export declare function getModTime(filePath: string): Date | null;
/**
 * Create a temporary directory
 *
 * @param prefix - Prefix for the temp directory name
 * @returns Path to the created temp directory
 */
export declare function createTempDir(prefix?: string): string;
//# sourceMappingURL=fs.d.ts.map