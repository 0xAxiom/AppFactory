export const colors = {
  background: {
    primary: '#0D0D0F',
    secondary: '#161619',
    tertiary: '#1E1E22',
    elevated: '#252529',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#A0A0A8',
    tertiary: '#6B6B73',
    inverse: '#0D0D0F',
  },
  accent: {
    primary: '#00D9A5',
    secondary: '#00B386',
    muted: 'rgba(0, 217, 165, 0.12)',
  },
  status: {
    recording: '#FF4444',
    anomaly: '#FFB800',
    success: '#00D9A5',
    error: '#FF4444',
    warning: '#FFB800',
  },
  visualization: {
    waveform: '#00D9A5',
    waveformBackground: 'rgba(0, 217, 165, 0.06)',
    spectrogramLow: '#1A1A2E',
    spectrogramMid: '#4A00E0',
    spectrogramHigh: '#FF0080',
    anomalyMarker: '#FFB800',
    playhead: '#FFFFFF',
  },
  tag: {
    voice: '#4A90D9',
    noise: '#6B6B73',
    knock: '#8B5A2B',
    unknown: '#9B59B6',
    other: '#00D9A5',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
};

export const radius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const typography = {
  display: { fontSize: 34, lineHeight: 41, fontWeight: '700' as const },
  title1: { fontSize: 28, lineHeight: 34, fontWeight: '700' as const },
  title2: { fontSize: 22, lineHeight: 28, fontWeight: '600' as const },
  title3: { fontSize: 20, lineHeight: 25, fontWeight: '600' as const },
  headline: { fontSize: 17, lineHeight: 22, fontWeight: '600' as const },
  body: { fontSize: 17, lineHeight: 22, fontWeight: '400' as const },
  callout: { fontSize: 16, lineHeight: 21, fontWeight: '400' as const },
  subhead: { fontSize: 15, lineHeight: 20, fontWeight: '400' as const },
  footnote: { fontSize: 13, lineHeight: 18, fontWeight: '400' as const },
  caption1: { fontSize: 12, lineHeight: 16, fontWeight: '400' as const },
  caption2: { fontSize: 11, lineHeight: 13, fontWeight: '400' as const },
};
