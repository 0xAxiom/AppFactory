import React, { createContext, useContext } from 'react';

// Professional EVP Investigation Color Palette - Atmospheric & Modern
export const colors = {
  primary: '#1A237E',    // Midnight blue - professional paranormal depth
  accent: '#E65100',     // Deep amber - anomaly alerts and discoveries
  background: '#0D0D0D', // True black - immersive darkness
  surface: '#1A1A1A',    // Surface elevation - subtle contrast
  text: {
    primary: '#FFFFFF',    // Pure white - maximum contrast
    secondary: '#E3F2FD',  // Light blue tint - atmospheric secondary
    disabled: '#90CAF9'    // Pale blue - disabled states
  },
  border: '#424242',       // Subtle borders for structure
  success: '#2E7D32',      // Forest green - successful captures
  warning: '#E65100',      // Deep amber - potential anomalies
  error: '#C62828',        // Deep red - critical issues

  // Status colors structure (for compatibility)
  status: {
    success: '#2E7D32',      // Successful EVP captures
    warning: '#E65100',      // Potential paranormal activity
    error: '#C62828',        // Critical system issues
    info: '#1565C0',         // General information
    supernatural: '#673AB7'  // Paranormal activity indicator
  },
  
  // Atmospheric waveform colors for EVP analysis
  waveform: {
    normal: '#1565C0',       // Normal audio - calm blue
    anomaly: '#E65100',      // EVP anomalies - bright amber alert
    background: '#0A0A0A'    // Waveform background - deeper black
  },

  // Investigation session state colors
  session: {
    recording: '#C62828',    // Recording state - urgent red
    paused: '#E65100',       // Paused - amber standby
    stopped: '#616161',      // Stopped - neutral gray
    analyzing: '#1565C0',    // Analysis - professional blue
    detected: '#673AB7'      // EVP detected - supernatural purple
  },

  // Professional audio analysis colors
  audio: {
    waveform: {
      normal: '#1565C0',      // Normal audio - calm blue
      anomaly: '#E65100',     // EVP anomalies - bright amber
      background: '#0A0A0A',  // Waveform bg - deeper black
      grid: '#424242',        // Timeline grid - subtle structure
      peak: '#FF6F00'         // Audio peaks - bright orange
    },
    levels: {
      low: '#388E3C',         // Safe levels - green
      medium: '#F57C00',      // Moderate - orange
      high: '#C62828',        // Overload - red
      supernatural: '#673AB7' // Anomalous readings - purple
    }
  },

  // Specialized investigation equipment colors
  investigation: {
    electromagnetic: '#3F51B5',  // EMF readings - indigo
    thermal: '#FF5722',          // Temperature - orange-red
    motion: '#4CAF50',           // Motion detection - green
    spirit: '#9C27B0'            // Spirit communication - magenta
  }
};

// Typography system with Dynamic Type support
export const typography = {
  h1: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
    fontFamily: 'System'
  },
  h2: {
    fontSize: 20,
    fontWeight: '500',
    lineHeight: 28,
    fontFamily: 'System'
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    fontFamily: 'System'
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
    fontFamily: 'System'
  },
  monospace: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    fontFamily: 'Menlo'
  }
};

// Spacing system
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48
};

// Layout constants
export const layout = {
  borderRadius: 8,
  borderWidth: 1,
  minTouchTarget: 44, // iOS minimum
  shadowRadius: 4,
  elevation: 3
};

const ThemeContext = createContext({
  colors,
  typography,
  spacing,
  layout
});

export const ThemeProvider = ({ children }) => {
  const theme = {
    colors,
    typography,
    spacing,
    layout
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};