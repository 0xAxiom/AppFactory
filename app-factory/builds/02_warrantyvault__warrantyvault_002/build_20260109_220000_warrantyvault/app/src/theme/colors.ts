/**
 * WarrantyVault Color Palette
 * Trust-focused utility dashboard with clear status hierarchy
 */

export const colors = {
  // Brand Colors
  primary: '#2563EB',      // Vault Blue - actions, links, brand
  secondary: '#059669',    // Protection Green - success, active status

  // Status Colors
  warning: '#EA580C',      // Expiring soon status
  error: '#EF4444',        // Errors, destructive actions
  muted: '#6B7280',        // Expired status, secondary text

  // UI Colors
  background: '#F9FAFB',   // Light mode background
  surface: '#FFFFFF',      // Cards, modals
  border: '#E5E7EB',       // Dividers, input borders

  // Text Colors
  text: {
    primary: '#1F2937',    // Main text
    secondary: '#6B7280',  // Muted text
    inverse: '#FFFFFF',    // Text on dark backgrounds
  },

  // Status-specific
  status: {
    active: {
      bg: '#ECFDF5',
      border: '#059669',
      text: '#059669',
    },
    expiring: {
      bg: '#FFF7ED',
      border: '#EA580C',
      text: '#EA580C',
    },
    expired: {
      bg: '#F3F4F6',
      border: '#6B7280',
      text: '#6B7280',
    },
  },
} as const;

export type ColorKey = keyof typeof colors;
