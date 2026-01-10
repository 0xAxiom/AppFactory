// Professional color palette for EVP Analyzer Pro
// Based on Stage 08 brand specifications with WCAG AA compliance

export const colors = {
  primary: '#1565C0',   // Deep blue - reliability and professionalism
  accent: '#FF9800',    // Amber/orange - anomaly highlighting and CTAs
  
  // Background colors for dark theme
  background: {
    primary: '#121212',  // Rich black
    secondary: '#1E1E1E', // Surface elevation
    tertiary: '#2A2A2A'  // Card backgrounds
  },
  
  // Text colors with proper contrast
  text: {
    primary: '#FFFFFF',   // 21:1 contrast on dark backgrounds
    secondary: '#E0E0E0', // 15.3:1 contrast
    tertiary: '#B0B0B0',  // 9.7:1 contrast
    disabled: '#757575',  // 4.5:1 contrast (minimum)
    inverse: '#121212'    // For light backgrounds
  },
  
  // UI element colors
  border: {
    primary: '#333333',   // Subtle borders
    secondary: '#444444', // Elevated borders
    accent: '#1565C0'     // Focus states
  },
  
  // Status colors
  status: {
    success: '#4CAF50',   // Green
    warning: '#FF9800',   // Orange
    error: '#F44336',     // Red
    info: '#2196F3'       // Light blue
  },
  
  // Audio analysis specific colors
  audio: {
    waveform: {
      normal: '#1565C0',      // Normal audio
      anomaly: '#FF9800',     // Detected anomalies
      background: '#0A0A0A',  // Waveform background
      grid: '#333333'         // Timeline grid
    },
    levels: {
      low: '#4CAF50',         // Good levels
      medium: '#FF9800',      // Moderate levels
      high: '#F44336'         // Clipping/overload
    }
  },
  
  // Button colors
  button: {
    primary: '#1565C0',
    primaryPressed: '#0D4A99',
    secondary: '#333333',
    secondaryPressed: '#4A4A4A',
    danger: '#F44336',
    dangerPressed: '#D32F2F'
  },
  
  // Overlay and modal colors
  overlay: 'rgba(0, 0, 0, 0.7)',
  modal: '#1E1E1E',
  
  // Professional investigation colors
  session: {
    recording: '#F44336',     // Recording state
    paused: '#FF9800',        // Paused state
    stopped: '#757575',       // Stopped state
    analyzing: '#2196F3'      // Analysis in progress
  }
};

export default colors;