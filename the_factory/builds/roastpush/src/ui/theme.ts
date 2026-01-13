export const colors = {
  background: '#0D0D0D',
  surface: '#1A1A1A',
  accent: '#FF4500',
  accentLight: '#FF6B35',
  text: '#FFFFFF',
  textSecondary: '#9CA3AF',
  success: '#4CAF50',
  warning: '#FFC107',
  error: '#E53935',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 24,
    fontWeight: '600' as const,
    letterSpacing: -0.25,
  },
  h3: {
    fontSize: 18,
    fontWeight: '600' as const,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400' as const,
  },
  button: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
};
