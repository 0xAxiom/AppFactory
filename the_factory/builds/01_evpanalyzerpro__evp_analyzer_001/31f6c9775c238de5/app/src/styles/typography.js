import { Platform } from 'react-native';

// Typography system based on Stage 08 specifications
// Supports Dynamic Type scaling up to 200% for accessibility

export const fontFamilies = {
  system: Platform.select({
    ios: 'SF Pro Display',
    android: 'Roboto',
    default: 'System'
  }),
  monospace: Platform.select({
    ios: 'SF Mono',
    android: 'Roboto Mono',
    default: 'monospace'
  })
};

export const fontSizes = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 20,
  xxxl: 24,
  display: 28
};

export const lineHeights = {
  xs: 14,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 26,
  xxl: 28,
  xxxl: 32,
  display: 36
};

export const fontWeights = {
  light: '300',
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700'
};

// Typography styles with proper hierarchy
export const typography = {
  // Display text
  display: {
    fontSize: fontSizes.display,
    lineHeight: lineHeights.display,
    fontWeight: fontWeights.bold,
    fontFamily: fontFamilies.system
  },
  
  // Headings
  h1: {
    fontSize: fontSizes.xxxl,
    lineHeight: lineHeights.xxxl,
    fontWeight: fontWeights.semibold,
    fontFamily: fontFamilies.system
  },
  h2: {
    fontSize: fontSizes.xxl,
    lineHeight: lineHeights.xxl,
    fontWeight: fontWeights.medium,
    fontFamily: fontFamilies.system
  },
  h3: {
    fontSize: fontSizes.xl,
    lineHeight: lineHeights.xl,
    fontWeight: fontWeights.medium,
    fontFamily: fontFamilies.system
  },
  
  // Body text
  body: {
    fontSize: fontSizes.lg,
    lineHeight: lineHeights.lg,
    fontWeight: fontWeights.regular,
    fontFamily: fontFamilies.system
  },
  bodyLarge: {
    fontSize: fontSizes.xl,
    lineHeight: lineHeights.xl,
    fontWeight: fontWeights.regular,
    fontFamily: fontFamilies.system
  },
  bodySmall: {
    fontSize: fontSizes.md,
    lineHeight: lineHeights.md,
    fontWeight: fontWeights.regular,
    fontFamily: fontFamilies.system
  },
  
  // UI elements
  button: {
    fontSize: fontSizes.lg,
    lineHeight: lineHeights.lg,
    fontWeight: fontWeights.medium,
    fontFamily: fontFamilies.system
  },
  label: {
    fontSize: fontSizes.md,
    lineHeight: lineHeights.md,
    fontWeight: fontWeights.medium,
    fontFamily: fontFamilies.system
  },
  caption: {
    fontSize: fontSizes.sm,
    lineHeight: lineHeights.sm,
    fontWeight: fontWeights.regular,
    fontFamily: fontFamilies.system
  },
  
  // Technical/data display
  monospace: {
    fontSize: fontSizes.md,
    lineHeight: lineHeights.md,
    fontWeight: fontWeights.regular,
    fontFamily: fontFamilies.monospace
  },
  timestamp: {
    fontSize: fontSizes.sm,
    lineHeight: lineHeights.sm,
    fontWeight: fontWeights.medium,
    fontFamily: fontFamilies.monospace
  },
  
  // Navigation
  tab: {
    fontSize: fontSizes.sm,
    lineHeight: lineHeights.sm,
    fontWeight: fontWeights.medium,
    fontFamily: fontFamilies.system
  },
  
  // Professional investigation specific
  sessionTitle: {
    fontSize: fontSizes.xl,
    lineHeight: lineHeights.xl,
    fontWeight: fontWeights.semibold,
    fontFamily: fontFamilies.system
  },
  anomalyLabel: {
    fontSize: fontSizes.sm,
    lineHeight: lineHeights.sm,
    fontWeight: fontWeights.semibold,
    fontFamily: fontFamilies.system
  }
};

// Accessibility scaling helper
export const getScaledFont = (baseStyle, scale = 1) => {
  return {
    ...baseStyle,
    fontSize: Math.round(baseStyle.fontSize * Math.min(scale, 2)), // Max 200% scaling
    lineHeight: Math.round(baseStyle.lineHeight * Math.min(scale, 2))
  };
};

export default typography;