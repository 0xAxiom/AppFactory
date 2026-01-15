// Database migration system for EVP Analyzer Pro
import * as SQLite from 'expo-sqlite';
import { SCHEMA_VERSION, MIGRATIONS, DEFAULT_SETTINGS } from './schema';

export class MigrationManager {
  constructor(database) {
    this.db = database;
  }

  async getCurrentVersion() {
    try {
      const result = await this.db.getFirstAsync(
        'PRAGMA user_version;'
      );
      return result ? result.user_version : 0;
    } catch (error) {
      console.warn('Failed to get database version:', error);
      return 0;
    }
  }

  async setVersion(version) {
    await this.db.execAsync(`PRAGMA user_version = ${version};`);
  }

  async runMigrations() {
    const currentVersion = await this.getCurrentVersion();
    
    if (currentVersion === SCHEMA_VERSION) {
      console.log('Database is up to date');
      return;
    }

    console.log(`Migrating database from version ${currentVersion} to ${SCHEMA_VERSION}`);

    try {
      // Begin transaction
      await this.db.execAsync('BEGIN TRANSACTION;');

      // Run migrations for each version
      for (let version = currentVersion + 1; version <= SCHEMA_VERSION; version++) {
        const migrations = MIGRATIONS[version];
        if (!migrations) {
          throw new Error(`No migrations found for version ${version}`);
        }

        console.log(`Running migration for version ${version}`);
        
        for (const migration of migrations) {
          await this.db.execAsync(migration);
        }
      }

      // Insert default settings if this is a fresh install
      if (currentVersion === 0) {
        await this.insertDefaultSettings();
      }

      // Update version
      await this.setVersion(SCHEMA_VERSION);

      // Commit transaction
      await this.db.execAsync('COMMIT;');

      console.log('Database migration completed successfully');
    } catch (error) {
      // Rollback on error
      await this.db.execAsync('ROLLBACK;');
      console.error('Database migration failed:', error);
      throw new Error(`Migration failed: ${error.message}`);
    }
  }

  async insertDefaultSettings() {
    const timestamp = Date.now();
    
    for (const setting of DEFAULT_SETTINGS) {
      await this.db.runAsync(
        'INSERT OR IGNORE INTO settings (key, value, type, updated_at) VALUES (?, ?, ?, ?)',
        [setting.key, setting.value, setting.type, timestamp]
      );
    }

    console.log('Default settings inserted');
  }

  async resetDatabase() {
    console.log('Resetting database...');
    
    try {
      // Drop all tables
      await this.db.execAsync('DROP TABLE IF EXISTS sessions;');
      await this.db.execAsync('DROP TABLE IF EXISTS anomalies;');
      await this.db.execAsync('DROP TABLE IF EXISTS settings;');
      await this.db.execAsync('DROP TABLE IF EXISTS exports;');
      
      // Reset version
      await this.setVersion(0);
      
      // Run migrations to recreate
      await this.runMigrations();
      
      console.log('Database reset completed');
    } catch (error) {
      console.error('Database reset failed:', error);
      throw error;
    }
  }

  async validateDatabase() {
    try {
      // Check table existence
      const tables = ['sessions', 'anomalies', 'settings', 'exports'];
      
      for (const table of tables) {
        const result = await this.db.getFirstAsync(
          `SELECT name FROM sqlite_master WHERE type='table' AND name=?`,
          [table]
        );
        
        if (!result) {
          throw new Error(`Table ${table} does not exist`);
        }
      }

      // Check version
      const version = await this.getCurrentVersion();
      if (version !== SCHEMA_VERSION) {
        throw new Error(`Database version mismatch: expected ${SCHEMA_VERSION}, got ${version}`);
      }

      console.log('Database validation passed');
      return true;
    } catch (error) {
      console.error('Database validation failed:', error);
      return false;
    }
  }
}

export default MigrationManager;