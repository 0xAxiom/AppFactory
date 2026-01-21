// Design system theme - populated from Stage 08 brand identity
export const theme = {
  colors: {
    // Primary colors from Stage 08
    primary: '{{PRIMARY_COLOR}}',
    secondary: '{{SECONDARY_COLOR}}',

    // Semantic colors
    success: '#059669',
    warning: '#D97706',
    error: '#DC2626',
    info: '#0284C7',

    // Neutral palette
    background: '#FFFFFF',
    surface: '#F8FAFC',
    surfaceSecondary: '#F1F5F9',
    border: '#E2E8F0',

    // Text colors
    textPrimary: '#1E293B',
    textSecondary: '#64748B',
    textTertiary: '#94A3B8',
    textInverse: '#FFFFFF',
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  typography: {
    // Based on platform defaults with Stage 08 customizations
    fontFamily: {
      regular: 'System',
      medium: 'System',
      semiBold: 'System',
      bold: 'System',
    },

    fontSize: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 32,
    },

    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },

  borderRadius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },

  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 5,
    },
  },

  // Touch targets for accessibility
  touchTarget: {
    minHeight: 44,
    minWidth: 44,
  },
};
