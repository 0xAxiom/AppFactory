/**
 * Date Utilities
 *
 * Provides consistent date formatting and manipulation
 * across all AppFactory pipelines.
 *
 * @module @appfactory/core/utils
 */
/**
 * Format a date as ISO string (YYYY-MM-DDTHH:mm:ss.sssZ)
 *
 * @param date - Date to format (defaults to now)
 * @returns ISO formatted date string
 */
export declare function toISOString(date?: Date): string;
/**
 * Format a date as YYYY-MM-DD
 *
 * @param date - Date to format (defaults to now)
 * @returns Date string in YYYY-MM-DD format
 */
export declare function toDateString(date?: Date): string;
/**
 * Format a date as YYYYMMDD (compact format for file names)
 *
 * @param date - Date to format (defaults to now)
 * @returns Compact date string
 */
export declare function toCompactDate(date?: Date): string;
/**
 * Format a date as YYYYMMDD_HHMMSS (timestamp format for run IDs)
 *
 * @param date - Date to format (defaults to now)
 * @returns Timestamp string
 */
export declare function toTimestamp(date?: Date): string;
/**
 * Format a date as human-readable string
 *
 * @param date - Date to format
 * @returns Human-readable date string (e.g., "Jan 20, 2026 at 3:45 PM")
 */
export declare function toHumanReadable(date?: Date): string;
/**
 * Format duration in milliseconds to human-readable string
 *
 * @param ms - Duration in milliseconds
 * @returns Human-readable duration (e.g., "1m 30s", "2h 15m")
 */
export declare function formatDuration(ms: number): string;
/**
 * Get relative time string (e.g., "2 hours ago", "in 3 days")
 *
 * @param date - Date to compare
 * @param reference - Reference date (defaults to now)
 * @returns Relative time string
 */
export declare function getRelativeTime(date: Date, reference?: Date): string;
/**
 * Check if a date is today
 *
 * @param date - Date to check
 * @returns true if the date is today
 */
export declare function isToday(date: Date): boolean;
/**
 * Add time to a date
 *
 * @param date - Starting date
 * @param amount - Amount to add
 * @param unit - Unit of time
 * @returns New date with added time
 */
export declare function addTime(date: Date, amount: number, unit: 'seconds' | 'minutes' | 'hours' | 'days' | 'weeks' | 'months' | 'years'): Date;
//# sourceMappingURL=date.d.ts.map