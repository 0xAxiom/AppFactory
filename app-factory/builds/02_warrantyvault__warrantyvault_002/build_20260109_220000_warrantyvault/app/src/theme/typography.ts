/**
 * WarrantyVault Typography System
 * System fonts with clear hierarchy
 */

import { Platform, TextStyle } from 'react-native';

const fontFamily = Platform.select({
  ios: 'System',
  android: 'Roboto',
  default: 'System',
});

export const typography = {
  // Display - Hero numbers, countdown
  display: {
    fontFamily,
    fontSize: 32,
    fontWeight: '700' as TextStyle['fontWeight'],
    lineHeight: 38,
  },

  // Title - Screen titles
  title: {
    fontFamily,
    fontSize: 24,
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: 29,
  },

  // Headline - Section headers
  headline: {
    fontFamily,
    fontSize: 20,
    fontWeight: '500' as TextStyle['fontWeight'],
    lineHeight: 24,
  },

  // Body - Primary content
  body: {
    fontFamily,
    fontSize: 16,
    fontWeight: '400' as TextStyle['fontWeight'],
    lineHeight: 24,
  },

  // Body Medium - Emphasized body
  bodyMedium: {
    fontFamily,
    fontSize: 16,
    fontWeight: '500' as TextStyle['fontWeight'],
    lineHeight: 24,
  },

  // Caption - Labels, metadata
  caption: {
    fontFamily,
    fontSize: 14,
    fontWeight: '400' as TextStyle['fontWeight'],
    lineHeight: 20,
  },

  // Small - Timestamps, badges
  small: {
    fontFamily,
    fontSize: 12,
    fontWeight: '400' as TextStyle['fontWeight'],
    lineHeight: 16,
  },

  // Button text
  button: {
    fontFamily,
    fontSize: 16,
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: 20,
  },
} as const;
