/**
 * Preferences Context - Manages user settings
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { UserSettings } from '../types';
import { DEFAULT_SETTINGS } from '../types';
import { settingsStorage } from '../utils/storage';

interface PreferencesContextValue {
  settings: UserSettings;
  isLoading: boolean;
  updateSettings: (updates: Partial<UserSettings>) => Promise<void>;
  markOnboardingSeen: () => Promise<void>;
}

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  // Load settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const stored = await settingsStorage.get();
        setSettings(stored);
      } catch (err) {
        console.error('Error loading settings:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Update settings
  const updateSettings = useCallback(async (updates: Partial<UserSettings>) => {
    const updated = { ...settings, ...updates };
    await settingsStorage.save(updated);
    setSettings(updated);
  }, [settings]);

  // Mark onboarding as seen
  const markOnboardingSeen = useCallback(async () => {
    await updateSettings({ hasSeenOnboarding: true });
  }, [updateSettings]);

  const value: PreferencesContextValue = {
    settings,
    isLoading,
    updateSettings,
    markOnboardingSeen,
  };

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
}
