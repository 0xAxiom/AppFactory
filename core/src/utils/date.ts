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
export function toISOString(date: Date = new Date()): string {
  return date.toISOString();
}

/**
 * Format a date as YYYY-MM-DD
 *
 * @param date - Date to format (defaults to now)
 * @returns Date string in YYYY-MM-DD format
 */
export function toDateString(date: Date = new Date()): string {
  return date.toISOString().split('T')[0];
}

/**
 * Format a date as YYYYMMDD (compact format for file names)
 *
 * @param date - Date to format (defaults to now)
 * @returns Compact date string
 */
export function toCompactDate(date: Date = new Date()): string {
  return date.toISOString().split('T')[0].replace(/-/g, '');
}

/**
 * Format a date as YYYYMMDD_HHMMSS (timestamp format for run IDs)
 *
 * @param date - Date to format (defaults to now)
 * @returns Timestamp string
 */
export function toTimestamp(date: Date = new Date()): string {
  return date
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/T/, '_')
    .replace(/\..+/, '');
}

/**
 * Format a date as human-readable string
 *
 * @param date - Date to format
 * @returns Human-readable date string (e.g., "Jan 20, 2026 at 3:45 PM")
 */
export function toHumanReadable(date: Date = new Date()): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Format duration in milliseconds to human-readable string
 *
 * @param ms - Duration in milliseconds
 * @returns Human-readable duration (e.g., "1m 30s", "2h 15m")
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) {
    return `${ms}ms`;
  }

  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) {
    return `${seconds}s`;
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes < 60) {
    return remainingSeconds > 0
      ? `${minutes}m ${remainingSeconds}s`
      : `${minutes}m`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
}

/**
 * Get relative time string (e.g., "2 hours ago", "in 3 days")
 *
 * @param date - Date to compare
 * @param reference - Reference date (defaults to now)
 * @returns Relative time string
 */
export function getRelativeTime(
  date: Date,
  reference: Date = new Date()
): string {
  const diffMs = date.getTime() - reference.getTime();
  const diffSeconds = Math.abs(Math.floor(diffMs / 1000));
  const isPast = diffMs < 0;

  const units: [number, string, string][] = [
    [60, 'second', 'seconds'],
    [60, 'minute', 'minutes'],
    [24, 'hour', 'hours'],
    [30, 'day', 'days'],
    [12, 'month', 'months'],
    [Infinity, 'year', 'years'],
  ];

  let value = diffSeconds;
  let unitIndex = 0;

  while (unitIndex < units.length - 1 && value >= units[unitIndex][0]) {
    value = Math.floor(value / units[unitIndex][0]);
    unitIndex++;
  }

  const [, singular, plural] = units[unitIndex];
  const unit = value === 1 ? singular : plural;

  return isPast ? `${value} ${unit} ago` : `in ${value} ${unit}`;
}

/**
 * Check if a date is today
 *
 * @param date - Date to check
 * @returns true if the date is today
 */
export function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

/**
 * Add time to a date
 *
 * @param date - Starting date
 * @param amount - Amount to add
 * @param unit - Unit of time
 * @returns New date with added time
 */
export function addTime(
  date: Date,
  amount: number,
  unit: 'seconds' | 'minutes' | 'hours' | 'days' | 'weeks' | 'months' | 'years'
): Date {
  const result = new Date(date);

  switch (unit) {
    case 'seconds':
      result.setSeconds(result.getSeconds() + amount);
      break;
    case 'minutes':
      result.setMinutes(result.getMinutes() + amount);
      break;
    case 'hours':
      result.setHours(result.getHours() + amount);
      break;
    case 'days':
      result.setDate(result.getDate() + amount);
      break;
    case 'weeks':
      result.setDate(result.getDate() + amount * 7);
      break;
    case 'months':
      result.setMonth(result.getMonth() + amount);
      break;
    case 'years':
      result.setFullYear(result.getFullYear() + amount);
      break;
  }

  return result;
}
