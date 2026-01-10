export interface Investigation {
  id: string;
  title: string | null;
  location: string | null;
  coordinates: { latitude: number; longitude: number } | null;
  startedAt: string;
  endedAt: string | null;
  duration: number;
  notes: string | null;
  audioFilePath: string;
  waveformData: number[];
  spectrogramPath: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Anomaly {
  id: string;
  investigationId: string;
  timestamp: number;
  type: 'frequency_spike' | 'noise_floor_change' | 'silence_anomaly' | 'unknown';
  severity: 'low' | 'medium' | 'high';
  frequencyHz: number | null;
  decibelDelta: number | null;
  createdAt: string;
}

export interface Tag {
  id: string;
  investigationId: string;
  timestamp: number;
  endTimestamp: number | null;
  label: string;
  category: 'voice' | 'noise' | 'knock' | 'unknown' | 'other';
  notes: string | null;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserSettings {
  sensitivityLevel: 'low' | 'medium' | 'high';
  recordingQuality: 'standard' | 'high';
  autoSaveLocation: boolean;
  hapticFeedback: boolean;
  darkModePreference: 'system' | 'always_dark' | 'always_light';
}

export interface SubscriptionState {
  isActive: boolean;
  entitlements: string[];
  expiresAt: string | null;
}

export const defaultSettings: UserSettings = {
  sensitivityLevel: 'medium',
  recordingQuality: 'high',
  autoSaveLocation: true,
  hapticFeedback: true,
  darkModePreference: 'always_dark',
};
