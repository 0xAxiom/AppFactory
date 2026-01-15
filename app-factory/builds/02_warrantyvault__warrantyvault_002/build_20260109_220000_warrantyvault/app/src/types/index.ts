/**
 * WarrantyVault Type Definitions
 */

// Item categories
export type Category = 'electronics' | 'appliances' | 'furniture' | 'vehicles' | 'other';

// Warranty status derived from dates
export type WarrantyStatus = 'active' | 'expiring' | 'expired';

// Core item data model
export interface Item {
  id: string;
  name: string;
  category: Category;
  purchaseDate: string; // ISO date string
  warrantyMonths: number;
  receiptUri: string; // Local file path
  productPhotoUri?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Item with computed status
export interface ItemWithStatus extends Item {
  status: WarrantyStatus;
  daysRemaining: number;
  expirationDate: string;
}

// User settings
export interface UserSettings {
  notificationsEnabled: boolean;
  notificationDaysBefore: number;
  hasSeenOnboarding: boolean;
  lastSyncAt?: string;
}

// Default settings
export const DEFAULT_SETTINGS: UserSettings = {
  notificationsEnabled: true,
  notificationDaysBefore: 30,
  hasSeenOnboarding: false,
};

// Category display info
export const CATEGORY_INFO: Record<Category, { label: string; icon: string }> = {
  electronics: { label: 'Electronics', icon: 'smartphone' },
  appliances: { label: 'Appliances', icon: 'home' },
  furniture: { label: 'Furniture', icon: 'sofa' },
  vehicles: { label: 'Vehicles', icon: 'car' },
  other: { label: 'Other', icon: 'package' },
};

// Warranty duration presets (in months)
export const WARRANTY_PRESETS = [
  { value: 3, label: '3 months' },
  { value: 6, label: '6 months' },
  { value: 12, label: '1 year' },
  { value: 24, label: '2 years' },
  { value: 36, label: '3 years' },
  { value: 60, label: '5 years' },
];
