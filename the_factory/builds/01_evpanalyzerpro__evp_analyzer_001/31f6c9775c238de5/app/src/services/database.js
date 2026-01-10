// Database service for EVP Analyzer Pro
// Implements SQLite-based data persistence with migration support

import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SQLite from 'expo-sqlite';
import MigrationManager from '../database/migrations';

const DatabaseContext = createContext(null);

export const DatabaseProvider = ({ children }) => {
  const [database, setDatabase] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        console.log('Initializing database...');
        
        // Open database
        const db = await SQLite.openDatabaseAsync('evp_analyzer.db');
        
        // Run migrations
        const migrationManager = new MigrationManager(db);
        await migrationManager.runMigrations();
        
        // Validate database structure
        const isValid = await migrationManager.validateDatabase();
        if (!isValid) {
          throw new Error('Database validation failed');
        }

        setDatabase(db);
        setIsReady(true);
        console.log('Database initialized successfully');
      } catch (error) {
        console.error('Database initialization failed:', error);
        setError(error.message);
      }
    };

    initializeDatabase();
  }, []);

  const value = {
    database,
    isReady,
    error
  };

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};

// Repository classes for data access
export class SessionRepository {
  constructor(database) {
    this.db = database;
  }

  async create(session) {
    const timestamp = Date.now();
    const sessionData = {
      ...session,
      created_at: timestamp,
      updated_at: timestamp
    };

    await this.db.runAsync(`
      INSERT INTO sessions (
        id, name, location, start_time, end_time, duration,
        file_path, file_size, sample_rate, bit_depth, anomaly_count,
        analysis_status, notes, investigators, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      sessionData.id,
      sessionData.name,
      sessionData.location || null,
      sessionData.start_time,
      sessionData.end_time || null,
      sessionData.duration || null,
      sessionData.file_path,
      sessionData.file_size || null,
      sessionData.sample_rate || 44100,
      sessionData.bit_depth || 16,
      sessionData.anomaly_count || 0,
      sessionData.analysis_status || 'pending',
      sessionData.notes || null,
      sessionData.investigators || null,
      sessionData.created_at,
      sessionData.updated_at
    ]);

    return sessionData;
  }

  async findById(id) {
    return await this.db.getFirstAsync(
      'SELECT * FROM sessions WHERE id = ?',
      [id]
    );
  }

  async findAll(limit = 50, offset = 0) {
    return await this.db.getAllAsync(
      'SELECT * FROM sessions ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );
  }

  async update(id, updates) {
    const timestamp = Date.now();
    const setClause = Object.keys(updates)
      .map(key => `${key} = ?`)
      .join(', ');
    
    const values = [...Object.values(updates), timestamp, id];

    await this.db.runAsync(
      `UPDATE sessions SET ${setClause}, updated_at = ? WHERE id = ?`,
      values
    );
  }

  async delete(id) {
    await this.db.runAsync('DELETE FROM sessions WHERE id = ?', [id]);
  }

  async getRecentSessions(limit = 10) {
    return await this.db.getAllAsync(
      'SELECT * FROM sessions ORDER BY created_at DESC LIMIT ?',
      [limit]
    );
  }

  async getSessionStats() {
    const stats = await this.db.getFirstAsync(`
      SELECT 
        COUNT(*) as total_sessions,
        SUM(duration) as total_duration,
        SUM(anomaly_count) as total_anomalies,
        AVG(anomaly_count) as avg_anomalies_per_session
      FROM sessions
    `);
    
    return stats;
  }
}

export class AnomalyRepository {
  constructor(database) {
    this.db = database;
  }

  async create(anomaly) {
    const timestamp = Date.now();
    const anomalyData = {
      ...anomaly,
      created_at: timestamp,
      updated_at: timestamp
    };

    await this.db.runAsync(`
      INSERT INTO anomalies (
        id, session_id, timestamp, duration, type, confidence,
        amplitude, frequency_range, description, user_notes,
        user_validated, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      anomalyData.id,
      anomalyData.session_id,
      anomalyData.timestamp,
      anomalyData.duration || null,
      anomalyData.type,
      anomalyData.confidence || null,
      anomalyData.amplitude || null,
      anomalyData.frequency_range || null,
      anomalyData.description || null,
      anomalyData.user_notes || null,
      anomalyData.user_validated || false,
      anomalyData.created_at,
      anomalyData.updated_at
    ]);

    return anomalyData;
  }

  async findBySessionId(sessionId) {
    return await this.db.getAllAsync(
      'SELECT * FROM anomalies WHERE session_id = ? ORDER BY timestamp ASC',
      [sessionId]
    );
  }

  async update(id, updates) {
    const timestamp = Date.now();
    const setClause = Object.keys(updates)
      .map(key => `${key} = ?`)
      .join(', ');
    
    const values = [...Object.values(updates), timestamp, id];

    await this.db.runAsync(
      `UPDATE anomalies SET ${setClause}, updated_at = ? WHERE id = ?`,
      values
    );
  }

  async delete(id) {
    await this.db.runAsync('DELETE FROM anomalies WHERE id = ?', [id]);
  }

  async deleteBySessionId(sessionId) {
    await this.db.runAsync('DELETE FROM anomalies WHERE session_id = ?', [sessionId]);
  }
}

export class SettingsRepository {
  constructor(database) {
    this.db = database;
  }

  async get(key) {
    const setting = await this.db.getFirstAsync(
      'SELECT value, type FROM settings WHERE key = ?',
      [key]
    );

    if (!setting) return null;

    // Convert value based on type
    switch (setting.type) {
      case 'boolean':
        return setting.value === 'true';
      case 'number':
        return parseFloat(setting.value);
      case 'string':
      default:
        return setting.value;
    }
  }

  async set(key, value, type = 'string') {
    const timestamp = Date.now();
    const stringValue = String(value);

    await this.db.runAsync(`
      INSERT OR REPLACE INTO settings (key, value, type, updated_at)
      VALUES (?, ?, ?, ?)
    `, [key, stringValue, type, timestamp]);
  }

  async getAll() {
    const settings = await this.db.getAllAsync('SELECT * FROM settings');
    const result = {};

    for (const setting of settings) {
      switch (setting.type) {
        case 'boolean':
          result[setting.key] = setting.value === 'true';
          break;
        case 'number':
          result[setting.key] = parseFloat(setting.value);
          break;
        default:
          result[setting.key] = setting.value;
      }
    }

    return result;
  }

  async delete(key) {
    await this.db.runAsync('DELETE FROM settings WHERE key = ?', [key]);
  }
}