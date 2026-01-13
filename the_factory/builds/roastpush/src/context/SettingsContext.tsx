import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IntensityLevel, InsultCategory } from '../data/insults';

const SETTINGS_KEY = 'roastpush_settings';

export interface Settings {
  intensity: IntensityLevel;
  categories: InsultCategory[];
  dailyLimit: number;
  startHour: number;
  endHour: number;
}

const DEFAULT_SETTINGS: Settings = {
  intensity: 'medium',
  categories: ['general', 'work'],
  dailyLimit: 5,
  startHour: 9,
  endHour: 22,
};

interface SettingsContextType {
  settings: Settings | null;
  updateSettings: (updates: Partial<Settings>) => Promise<void>;
  resetSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const stored = await AsyncStorage.getItem(SETTINGS_KEY);
      if (stored) {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(stored) });
      } else {
        setSettings(DEFAULT_SETTINGS);
        await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
      }
    } catch (error) {
      console.warn('Failed to load settings:', error);
      setSettings(DEFAULT_SETTINGS);
    }
  }

  async function updateSettings(updates: Partial<Settings>) {
    const newSettings = { ...settings, ...updates } as Settings;
    setSettings(newSettings);
    try {
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
    } catch (error) {
      console.warn('Failed to save settings:', error);
    }
  }

  async function resetSettings() {
    setSettings(DEFAULT_SETTINGS);
    try {
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
    } catch (error) {
      console.warn('Failed to reset settings:', error);
    }
  }

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
