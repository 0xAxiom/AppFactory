import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase;

export interface RoastEntry {
  id: number;
  insult: string;
  intensity: string;
  category: string;
  timestamp: number;
}

export async function initDatabase(): Promise<void> {
  db = await SQLite.openDatabaseAsync('roastpush.db');

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS roasts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      insult TEXT NOT NULL,
      intensity TEXT NOT NULL,
      category TEXT NOT NULL,
      timestamp INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_roasts_timestamp ON roasts(timestamp DESC);
  `);
}

export async function saveRoast(
  insult: string,
  intensity: string,
  category: string
): Promise<void> {
  const timestamp = Date.now();
  await db.runAsync(
    'INSERT INTO roasts (insult, intensity, category, timestamp) VALUES (?, ?, ?, ?)',
    [insult, intensity, category, timestamp]
  );
}

export async function getLastRoast(): Promise<RoastEntry | null> {
  const result = await db.getFirstAsync<RoastEntry>(
    'SELECT * FROM roasts ORDER BY timestamp DESC LIMIT 1'
  );
  return result || null;
}

export async function getTodayRoastCount(): Promise<number> {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const timestamp = startOfDay.getTime();

  const result = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM roasts WHERE timestamp >= ?',
    [timestamp]
  );
  return result?.count || 0;
}

export async function getAllRoasts(limit: number = 100): Promise<RoastEntry[]> {
  const results = await db.getAllAsync<RoastEntry>(
    'SELECT * FROM roasts ORDER BY timestamp DESC LIMIT ?',
    [limit]
  );
  return results;
}

export async function clearAllRoasts(): Promise<void> {
  await db.runAsync('DELETE FROM roasts');
}
