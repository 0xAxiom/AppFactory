/**
 * AsyncStorage utilities for WarrantyVault
 * Used for items and user preferences
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Item, UserSettings } from '../types';
import { DEFAULT_SETTINGS } from '../types';

// Storage keys
const STORAGE_KEYS = {
  ITEMS: '@warrantyvault/items',
  SETTINGS: '@warrantyvault/settings',
} as const;

/**
 * Item storage operations
 */
export const itemStorage = {
  /**
   * Get all items
   */
  async getAll(): Promise<Item[]> {
    try {
      const json = await AsyncStorage.getItem(STORAGE_KEYS.ITEMS);
      return json ? JSON.parse(json) : [];
    } catch (error) {
      console.error('Error reading items:', error);
      return [];
    }
  },

  /**
   * Save all items
   */
  async saveAll(items: Item[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));
    } catch (error) {
      console.error('Error saving items:', error);
      throw error;
    }
  },

  /**
   * Add a new item
   */
  async add(item: Item): Promise<void> {
    const items = await this.getAll();
    items.push(item);
    await this.saveAll(items);
  },

  /**
   * Update an existing item
   */
  async update(id: string, updates: Partial<Item>): Promise<void> {
    const items = await this.getAll();
    const index = items.findIndex(item => item.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...updates, updatedAt: new Date().toISOString() };
      await this.saveAll(items);
    }
  },

  /**
   * Delete an item
   */
  async delete(id: string): Promise<void> {
    const items = await this.getAll();
    const filtered = items.filter(item => item.id !== id);
    await this.saveAll(filtered);
  },

  /**
   * Get item by ID
   */
  async getById(id: string): Promise<Item | null> {
    const items = await this.getAll();
    return items.find(item => item.id === id) || null;
  },
};

/**
 * Settings storage operations
 */
export const settingsStorage = {
  /**
   * Get user settings
   */
  async get(): Promise<UserSettings> {
    try {
      const json = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      return json ? { ...DEFAULT_SETTINGS, ...JSON.parse(json) } : DEFAULT_SETTINGS;
    } catch (error) {
      console.error('Error reading settings:', error);
      return DEFAULT_SETTINGS;
    }
  },

  /**
   * Save user settings
   */
  async save(settings: Partial<UserSettings>): Promise<void> {
    try {
      const current = await this.get();
      const updated = { ...current, ...settings };
      await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving settings:', error);
      throw error;
    }
  },
};
