import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { Investigation, Tag, Anomaly, UserSettings, defaultSettings } from '@/types';

const STORAGE_KEYS = {
  INVESTIGATIONS: 'investigations',
  TAGS: 'tags',
  ANOMALIES: 'anomalies',
  SETTINGS: 'settings',
  HAS_ONBOARDED: 'hasOnboarded',
};

const AUDIO_DIR = `${FileSystem.documentDirectory}audio/`;

export async function ensureAudioDirectory() {
  const dirInfo = await FileSystem.getInfoAsync(AUDIO_DIR);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(AUDIO_DIR, { intermediates: true });
  }
  return AUDIO_DIR;
}

export async function getAudioFilePath(id: string): Promise<string> {
  await ensureAudioDirectory();
  return `${AUDIO_DIR}${id}.wav`;
}

// Investigation operations
export async function getInvestigations(): Promise<Investigation[]> {
  const data = await AsyncStorage.getItem(STORAGE_KEYS.INVESTIGATIONS);
  return data ? JSON.parse(data) : [];
}

export async function saveInvestigation(investigation: Investigation): Promise<void> {
  const investigations = await getInvestigations();
  const index = investigations.findIndex((i) => i.id === investigation.id);
  if (index >= 0) {
    investigations[index] = investigation;
  } else {
    investigations.unshift(investigation);
  }
  await AsyncStorage.setItem(STORAGE_KEYS.INVESTIGATIONS, JSON.stringify(investigations));
}

export async function deleteInvestigation(id: string): Promise<void> {
  const investigations = await getInvestigations();
  const filtered = investigations.filter((i) => i.id !== id);
  await AsyncStorage.setItem(STORAGE_KEYS.INVESTIGATIONS, JSON.stringify(filtered));

  // Delete associated audio file
  const audioPath = await getAudioFilePath(id);
  const fileInfo = await FileSystem.getInfoAsync(audioPath);
  if (fileInfo.exists) {
    await FileSystem.deleteAsync(audioPath);
  }

  // Delete associated tags and anomalies
  await deleteTagsForInvestigation(id);
  await deleteAnomaliesForInvestigation(id);
}

export async function getInvestigationCount(): Promise<number> {
  const investigations = await getInvestigations();
  return investigations.length;
}

// Tag operations
export async function getTags(investigationId: string): Promise<Tag[]> {
  const data = await AsyncStorage.getItem(STORAGE_KEYS.TAGS);
  const allTags: Tag[] = data ? JSON.parse(data) : [];
  return allTags.filter((t) => t.investigationId === investigationId);
}

export async function saveTag(tag: Tag): Promise<void> {
  const data = await AsyncStorage.getItem(STORAGE_KEYS.TAGS);
  const allTags: Tag[] = data ? JSON.parse(data) : [];
  const index = allTags.findIndex((t) => t.id === tag.id);
  if (index >= 0) {
    allTags[index] = tag;
  } else {
    allTags.push(tag);
  }
  await AsyncStorage.setItem(STORAGE_KEYS.TAGS, JSON.stringify(allTags));
}

export async function deleteTag(id: string): Promise<void> {
  const data = await AsyncStorage.getItem(STORAGE_KEYS.TAGS);
  const allTags: Tag[] = data ? JSON.parse(data) : [];
  const filtered = allTags.filter((t) => t.id !== id);
  await AsyncStorage.setItem(STORAGE_KEYS.TAGS, JSON.stringify(filtered));
}

async function deleteTagsForInvestigation(investigationId: string): Promise<void> {
  const data = await AsyncStorage.getItem(STORAGE_KEYS.TAGS);
  const allTags: Tag[] = data ? JSON.parse(data) : [];
  const filtered = allTags.filter((t) => t.investigationId !== investigationId);
  await AsyncStorage.setItem(STORAGE_KEYS.TAGS, JSON.stringify(filtered));
}

// Anomaly operations
export async function getAnomalies(investigationId: string): Promise<Anomaly[]> {
  const data = await AsyncStorage.getItem(STORAGE_KEYS.ANOMALIES);
  const allAnomalies: Anomaly[] = data ? JSON.parse(data) : [];
  return allAnomalies.filter((a) => a.investigationId === investigationId);
}

export async function saveAnomalies(anomalies: Anomaly[]): Promise<void> {
  const data = await AsyncStorage.getItem(STORAGE_KEYS.ANOMALIES);
  const existing: Anomaly[] = data ? JSON.parse(data) : [];
  const combined = [...existing, ...anomalies];
  await AsyncStorage.setItem(STORAGE_KEYS.ANOMALIES, JSON.stringify(combined));
}

async function deleteAnomaliesForInvestigation(investigationId: string): Promise<void> {
  const data = await AsyncStorage.getItem(STORAGE_KEYS.ANOMALIES);
  const allAnomalies: Anomaly[] = data ? JSON.parse(data) : [];
  const filtered = allAnomalies.filter((a) => a.investigationId !== investigationId);
  await AsyncStorage.setItem(STORAGE_KEYS.ANOMALIES, JSON.stringify(filtered));
}

// Settings operations
export async function getSettings(): Promise<UserSettings> {
  const data = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
  return data ? { ...defaultSettings, ...JSON.parse(data) } : defaultSettings;
}

export async function saveSettings(settings: Partial<UserSettings>): Promise<void> {
  const current = await getSettings();
  const updated = { ...current, ...settings };
  await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
}

// Onboarding
export async function hasCompletedOnboarding(): Promise<boolean> {
  const data = await AsyncStorage.getItem(STORAGE_KEYS.HAS_ONBOARDED);
  return data === 'true';
}

export async function setOnboardingComplete(): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.HAS_ONBOARDED, 'true');
}

// Clear all data
export async function clearAllData(): Promise<void> {
  await AsyncStorage.multiRemove([
    STORAGE_KEYS.INVESTIGATIONS,
    STORAGE_KEYS.TAGS,
    STORAGE_KEYS.ANOMALIES,
  ]);

  const dirInfo = await FileSystem.getInfoAsync(AUDIO_DIR);
  if (dirInfo.exists) {
    await FileSystem.deleteAsync(AUDIO_DIR, { idempotent: true });
  }
}
