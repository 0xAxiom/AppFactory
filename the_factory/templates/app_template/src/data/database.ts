import * as SQLite from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DATABASE_NAME = '{{APP_NAME_SLUG}}.db';
const CURRENT_SCHEMA_VERSION = 1;
const SCHEMA_VERSION_KEY = 'database_schema_version';

export interface DatabaseInterface {
  init(): Promise<void>;
  close(): Promise<void>;
  runMigrations(): Promise<void>;
}

class Database implements DatabaseInterface {
  private db: SQLite.SQLiteDatabase | null = null;

  async init(): Promise<void> {
    try {
      this.db = await SQLite.openDatabaseAsync(DATABASE_NAME);
      await this.runMigrations();
      
      if (__DEV__) {
        console.log('Database initialized successfully');
      }
    } catch (error) {
      if (__DEV__) {
        console.error('Database initialization failed:', error);
      }
      throw error;
    }
  }

  async close(): Promise<void> {
    if (this.db) {
      await this.db.closeAsync();
      this.db = null;
    }
  }

  async runMigrations(): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    const currentVersion = await this.getCurrentSchemaVersion();
    
    if (__DEV__) {
      console.log(`Current schema version: ${currentVersion}, Target: ${CURRENT_SCHEMA_VERSION}`);
    }

    for (let version = currentVersion + 1; version <= CURRENT_SCHEMA_VERSION; version++) {
      await this.runMigration(version);
      await this.setSchemaVersion(version);
      
      if (__DEV__) {
        console.log(`Migrated to schema version ${version}`);
      }
    }
  }

  private async getCurrentSchemaVersion(): Promise<number> {
    try {
      const version = await AsyncStorage.getItem(SCHEMA_VERSION_KEY);
      return version ? parseInt(version, 10) : 0;
    } catch {
      return 0;
    }
  }

  private async setSchemaVersion(version: number): Promise<void> {
    await AsyncStorage.setItem(SCHEMA_VERSION_KEY, version.toString());
  }

  private async runMigration(version: number): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    switch (version) {
      case 1:
        await this.migration001();
        break;
      default:
        throw new Error(`Unknown migration version: ${version}`);
    }
  }

  // Migration 001: Initial schema
  private async migration001(): Promise<void> {
    if (!this.db) return;
    
    // Create schema based on app requirements
    // This will be populated by Stage 10 based on Stage 02 product spec
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS app_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        data TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );
    `);

    await this.db.execAsync(`
      CREATE INDEX IF NOT EXISTS idx_app_data_created_at ON app_data(created_at);
    `);
  }

  getDatabase(): SQLite.SQLiteDatabase {
    if (!this.db) {
      throw new Error('Database not initialized. Call init() first.');
    }
    return this.db;
  }
}

export const database = new Database();

// Cloud sync adapter interface (no implementation)
export interface CloudSyncAdapter {
  upload(localData: any): Promise<boolean>;
  download(): Promise<any>;
  sync(): Promise<void>;
}

// Placeholder for future cloud sync implementation
export const cloudSyncAdapter: CloudSyncAdapter = {
  upload: async () => false,
  download: async () => null,
  sync: async () => {},
};