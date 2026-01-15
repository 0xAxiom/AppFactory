/**
 * WarrantyVault Theme
 * Centralized design system exports
 */

export { colors } from './colors';
export { spacing, radius, shadows } from './spacing';
export { typography } from './typography';

// Combined theme object for context
export const theme = {
  colors: require('./colors').colors,
  spacing: require('./spacing').spacing,
  radius: require('./spacing').radius,
  shadows: require('./spacing').shadows,
  typography: require('./typography').typography,
};

export type Theme = typeof theme;
