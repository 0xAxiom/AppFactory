// App configuration constants for EVP Analyzer Pro
// Based on Stage 02-09 specifications

import Constants from 'expo-constants';

// App information
export const APP_INFO = {
  name: 'EVP Analyzer Pro',
  version: '1.0.0',
  description: 'Professional paranormal investigation toolkit with authentic audio analysis',
  website: 'https://evpanalyzerpro.com',
  support: 'support@evpanalyzerpro.com'
};

// Audio recording configuration
export const AUDIO_CONFIG = {
  defaultSampleRate: 44100,
  defaultBitDepth: 16,
  defaultChannels: 1,
  maxRecordingDuration: 4 * 60 * 60 * 1000, // 4 hours in milliseconds
  bufferSize: 4096,
  anomalyDetection: {
    threshold: -30, // dB threshold for anomaly detection
    sensitivity: 0.7, // Default sensitivity (0-1)
    minSpikeDuration: 100, // Minimum spike duration in ms
  }
};

// Free tier limitations
export const FREE_LIMITS = {
  recordingDuration: 5 * 60 * 1000, // 5 minutes in milliseconds
  maxSessions: 10,
  exportFormat: 'mp3', // Limited to MP3
  cloudSyncEnabled: false,
  advancedAnalysis: false
};

// Professional features (Pro subscription)
export const PRO_FEATURES = {
  unlimitedRecording: true,
  cloudSync: true,
  advancedAnalysis: true,
  professionalExport: ['wav', 'flac'],
  batchProcessing: true,
  prioritySupport: true
};

// RevenueCat configuration
export const REVENUECAT_CONFIG = {
  entitlementId: 'pro_features',
  products: {
    monthly: 'monthly_4_99',
    annual: 'annual_49_99'
  },
  pricing: {
    monthly: 4.99,
    annual: 49.99
  }
};

// Database configuration
export const DATABASE_CONFIG = {
  name: 'evp_analyzer.db',
  version: 1,
  maxConnections: 1,
  enableWAL: true // Write-Ahead Logging for better performance
};

// Analytics configuration
export const ANALYTICS_CONFIG = {
  enabled: true,
  anonymizeData: true,
  trackingEvents: {
    sessionStarted: 'session_started',
    anomalyDetected: 'anomaly_detected',
    subscriptionPurchased: 'subscription_purchased',
    settingChanged: 'setting_changed',
    exportCompleted: 'export_completed'
  }
};

// Export configuration
export const EXPORT_CONFIG = {
  formats: {
    free: ['mp3'],
    pro: ['wav', 'flac', 'mp3']
  },
  quality: {
    mp3: {
      bitrate: 192, // kbps
      quality: 'high'
    },
    wav: {
      sampleRate: 44100,
      bitDepth: 16
    },
    flac: {
      compressionLevel: 5
    }
  },
  metadata: {
    includeTimestamp: true,
    includeAnomalies: true,
    includeSessionInfo: true
  }
};

// Network configuration
export const NETWORK_CONFIG = {
  timeout: 30000, // 30 seconds
  retryAttempts: 3,
  retryDelay: 1000, // 1 second
  endpoints: {
    privacy: 'https://evpanalyzerpro.com/privacy',
    terms: 'https://evpanalyzerpro.com/terms',
    support: 'https://evpanalyzerpro.com/support'
  }
};

// UI configuration
export const UI_CONFIG = {
  theme: 'dark',
  animations: {
    enabled: true,
    duration: 300
  },
  accessibility: {
    minimumTouchTarget: 44, // iOS guideline
    highContrast: false,
    reduceMotion: false
  }
};

// Environment-specific configuration
export const ENV_CONFIG = {
  isDevelopment: __DEV__,
  isProduction: !__DEV__,
  apiKeys: {
    revenueCat: {
      ios: Constants.expoConfig?.extra?.revenueCatIosKey,
      android: Constants.expoConfig?.extra?.revenueCatAndroidKey
    }
  }
};

// Feature flags
export const FEATURE_FLAGS = {
  cloudSync: false, // Will be enabled in future update
  advancedSpectralAnalysis: false, // Pro feature in development
  teamCollaboration: false, // Future feature
  hardwareIntegration: false, // Future hardware partnerships
  aiAnomalyClassification: false // Advanced AI features
};

// Legal and compliance
export const LEGAL_CONFIG = {
  privacyPolicyUrl: 'https://evpanalyzerpro.com/privacy',
  termsOfServiceUrl: 'https://evpanalyzerpro.com/terms',
  supportEmail: 'support@evpanalyzerpro.com',
  copyrightNotice: '© 2026 EVP Analyzer Pro. All rights reserved.',
  dataRetentionDays: 365
};

export default {
  APP_INFO,
  AUDIO_CONFIG,
  FREE_LIMITS,
  PRO_FEATURES,
  REVENUECAT_CONFIG,
  DATABASE_CONFIG,
  ANALYTICS_CONFIG,
  EXPORT_CONFIG,
  NETWORK_CONFIG,
  UI_CONFIG,
  ENV_CONFIG,
  FEATURE_FLAGS,
  LEGAL_CONFIG
};