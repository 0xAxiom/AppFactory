import { MD3LightTheme, configureFonts } from 'react-native-paper';

const fontConfig = {
  default: {
    regular: {
      fontFamily: 'System',
      fontWeight: '400' as const,
    },
    medium: {
      fontFamily: 'System',
      fontWeight: '500' as const,
    },
    light: {
      fontFamily: 'System',
      fontWeight: '300' as const,
    },
    thin: {
      fontFamily: 'System',
      fontWeight: '200' as const,
    },
  },
};

export const theme = {
  ...MD3LightTheme,
  dark: true,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#60a5fa',
    onPrimary: '#1f2937',
    primaryContainer: '#374151',
    onPrimaryContainer: '#e5e5e5',
    secondary: '#a78bfa',
    onSecondary: '#1f2937',
    tertiary: '#10b981',
    onTertiary: '#ffffff',
    surface: '#1f2937',
    onSurface: '#e5e5e5',
    surfaceVariant: '#374151',
    onSurfaceVariant: '#d1d5db',
    background: '#111827',
    onBackground: '#e5e5e5',
    error: '#ef4444',
    onError: '#ffffff',
    outline: '#6b7280',
    outlineVariant: '#4b5563',
  },
  fonts: configureFonts({ config: fontConfig }),
};

export const energyColors = {
  low: {
    primary: '#3b82f6',
    background: '#1e3a8a',
    text: '#dbeafe',
  },
  medium: {
    primary: '#f59e0b',
    background: '#92400e',
    text: '#fef3c7',
  },
  high: {
    primary: '#10b981',
    background: '#065f46',
    text: '#d1fae5',
  },
};