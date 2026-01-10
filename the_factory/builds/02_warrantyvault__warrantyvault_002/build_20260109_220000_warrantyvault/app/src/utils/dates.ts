/**
 * Date utility functions for warranty calculations
 */

import { addMonths, differenceInDays, parseISO, format, isBefore, isAfter } from 'date-fns';
import type { WarrantyStatus } from '../types';

// Days threshold for "expiring soon" status
const EXPIRING_THRESHOLD_DAYS = 30;

/**
 * Calculate warranty expiration date
 */
export function getExpirationDate(purchaseDate: string, warrantyMonths: number): Date {
  return addMonths(parseISO(purchaseDate), warrantyMonths);
}

/**
 * Calculate days remaining until warranty expiration
 * Returns negative number if expired
 */
export function getDaysRemaining(purchaseDate: string, warrantyMonths: number): number {
  const expirationDate = getExpirationDate(purchaseDate, warrantyMonths);
  return differenceInDays(expirationDate, new Date());
}

/**
 * Determine warranty status based on expiration
 */
export function getWarrantyStatus(purchaseDate: string, warrantyMonths: number): WarrantyStatus {
  const daysRemaining = getDaysRemaining(purchaseDate, warrantyMonths);

  if (daysRemaining < 0) {
    return 'expired';
  }

  if (daysRemaining <= EXPIRING_THRESHOLD_DAYS) {
    return 'expiring';
  }

  return 'active';
}

/**
 * Format date for display
 */
export function formatDate(dateString: string): string {
  return format(parseISO(dateString), 'MMM d, yyyy');
}

/**
 * Format days remaining for display
 */
export function formatDaysRemaining(days: number): string {
  if (days < 0) {
    const absDays = Math.abs(days);
    if (absDays === 1) return 'Expired 1 day ago';
    return `Expired ${absDays} days ago`;
  }

  if (days === 0) return 'Expires today';
  if (days === 1) return '1 day remaining';
  if (days < 30) return `${days} days remaining`;

  const months = Math.floor(days / 30);
  if (months === 1) return 'About 1 month remaining';
  if (months < 12) return `About ${months} months remaining`;

  const years = Math.floor(months / 12);
  if (years === 1) return 'About 1 year remaining';
  return `About ${years} years remaining`;
}

/**
 * Get today's date as ISO string
 */
export function getTodayISO(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Get current timestamp as ISO string
 */
export function getNowISO(): string {
  return new Date().toISOString();
}
