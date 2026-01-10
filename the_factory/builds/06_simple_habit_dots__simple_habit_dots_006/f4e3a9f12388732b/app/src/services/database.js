import * as SQLite from 'expo-sqlite';

let db = null;

// Database schema version for migrations
const CURRENT_SCHEMA_VERSION = 1;

export const initializeDatabase = async () => {
  try {
    db = SQLite.openDatabaseSync('habitdots.db');
    
    // Create tables
    await createTables();
    
    // Run migrations if needed
    await runMigrations();
    
    console.log('Database initialized successfully');
    return db;
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
};

const createTables = async () => {
  // Habits table
  await db.execSync(`
    CREATE TABLE IF NOT EXISTS habits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      color TEXT NOT NULL DEFAULT '#3b82f6',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      is_active BOOLEAN DEFAULT 1
    )
  `);

  // Habit completions table
  await db.execSync(`
    CREATE TABLE IF NOT EXISTS habit_completions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      habit_id INTEGER NOT NULL,
      completion_date DATE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (habit_id) REFERENCES habits (id) ON DELETE CASCADE,
      UNIQUE(habit_id, completion_date)
    )
  `);

  // App settings table
  await db.execSync(`
    CREATE TABLE IF NOT EXISTS app_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Schema version tracking
  await db.execSync(`
    CREATE TABLE IF NOT EXISTS schema_version (
      version INTEGER PRIMARY KEY,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Set initial schema version
  const result = db.getFirstSync('SELECT version FROM schema_version LIMIT 1');
  if (!result) {
    await db.execSync('INSERT INTO schema_version (version) VALUES (?)', [CURRENT_SCHEMA_VERSION]);
  }
};

const runMigrations = async () => {
  const currentVersion = db.getFirstSync('SELECT version FROM schema_version LIMIT 1')?.version || 0;
  
  if (currentVersion < CURRENT_SCHEMA_VERSION) {
    // Future migrations would go here
    console.log('Running database migrations...');
    
    // Update schema version
    await db.execSync('UPDATE schema_version SET version = ?, updated_at = CURRENT_TIMESTAMP', [CURRENT_SCHEMA_VERSION]);
  }
};

export const getDatabase = () => {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return db;
};

// Habit operations
export const habitOperations = {
  // Create a new habit
  create: async (name, color = '#3b82f6') => {
    try {
      const result = await db.runSync(
        'INSERT INTO habits (name, color) VALUES (?, ?)',
        [name, color]
      );
      return result.lastInsertRowId;
    } catch (error) {
      console.error('Error creating habit:', error);
      throw error;
    }
  },

  // Get all active habits
  getAll: () => {
    try {
      return db.getAllSync(
        'SELECT * FROM habits WHERE is_active = 1 ORDER BY created_at ASC'
      );
    } catch (error) {
      console.error('Error fetching habits:', error);
      throw error;
    }
  },

  // Update habit
  update: async (id, name, color) => {
    try {
      await db.runSync(
        'UPDATE habits SET name = ?, color = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [name, color, id]
      );
    } catch (error) {
      console.error('Error updating habit:', error);
      throw error;
    }
  },

  // Delete habit (soft delete)
  delete: async (id) => {
    try {
      await db.runSync(
        'UPDATE habits SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [id]
      );
    } catch (error) {
      console.error('Error deleting habit:', error);
      throw error;
    }
  },

  // Get habit with completion stats
  getWithStats: (id) => {
    try {
      const habit = db.getFirstSync('SELECT * FROM habits WHERE id = ? AND is_active = 1', [id]);
      if (!habit) return null;

      // Get completion count
      const completionCount = db.getFirstSync(
        'SELECT COUNT(*) as count FROM habit_completions WHERE habit_id = ?',
        [id]
      )?.count || 0;

      // Get current streak
      const currentStreak = getCurrentStreak(id);
      
      // Get best streak
      const bestStreak = getBestStreak(id);

      return {
        ...habit,
        completionCount,
        currentStreak,
        bestStreak
      };
    } catch (error) {
      console.error('Error fetching habit with stats:', error);
      throw error;
    }
  }
};

// Completion operations
export const completionOperations = {
  // Mark habit as complete for a specific date
  markComplete: async (habitId, date = new Date().toISOString().split('T')[0]) => {
    try {
      await db.runSync(
        'INSERT OR REPLACE INTO habit_completions (habit_id, completion_date) VALUES (?, ?)',
        [habitId, date]
      );
    } catch (error) {
      console.error('Error marking habit complete:', error);
      throw error;
    }
  },

  // Mark habit as incomplete for a specific date
  markIncomplete: async (habitId, date = new Date().toISOString().split('T')[0]) => {
    try {
      await db.runSync(
        'DELETE FROM habit_completions WHERE habit_id = ? AND completion_date = ?',
        [habitId, date]
      );
    } catch (error) {
      console.error('Error marking habit incomplete:', error);
      throw error;
    }
  },

  // Check if habit is completed for a specific date
  isCompleted: (habitId, date = new Date().toISOString().split('T')[0]) => {
    try {
      const result = db.getFirstSync(
        'SELECT id FROM habit_completions WHERE habit_id = ? AND completion_date = ?',
        [habitId, date]
      );
      return !!result;
    } catch (error) {
      console.error('Error checking completion status:', error);
      return false;
    }
  },

  // Get completions for a habit in a date range
  getCompletionsInRange: (habitId, startDate, endDate) => {
    try {
      return db.getAllSync(
        'SELECT completion_date FROM habit_completions WHERE habit_id = ? AND completion_date BETWEEN ? AND ? ORDER BY completion_date',
        [habitId, startDate, endDate]
      );
    } catch (error) {
      console.error('Error fetching completions in range:', error);
      return [];
    }
  },

  // Get all completions for today
  getTodayCompletions: () => {
    const today = new Date().toISOString().split('T')[0];
    try {
      return db.getAllSync(
        'SELECT hc.*, h.name, h.color FROM habit_completions hc JOIN habits h ON hc.habit_id = h.id WHERE hc.completion_date = ? AND h.is_active = 1',
        [today]
      );
    } catch (error) {
      console.error('Error fetching today completions:', error);
      return [];
    }
  }
};

// Helper functions for streak calculation
const getCurrentStreak = (habitId) => {
  try {
    const today = new Date();
    let streak = 0;
    let currentDate = new Date(today);
    
    while (true) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const completion = db.getFirstSync(
        'SELECT id FROM habit_completions WHERE habit_id = ? AND completion_date = ?',
        [habitId, dateStr]
      );
      
      if (completion) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streak;
  } catch (error) {
    console.error('Error calculating current streak:', error);
    return 0;
  }
};

const getBestStreak = (habitId) => {
  try {
    const completions = db.getAllSync(
      'SELECT completion_date FROM habit_completions WHERE habit_id = ? ORDER BY completion_date',
      [habitId]
    );
    
    if (completions.length === 0) return 0;
    
    let maxStreak = 1;
    let currentStreak = 1;
    
    for (let i = 1; i < completions.length; i++) {
      const prevDate = new Date(completions[i - 1].completion_date);
      const currentDate = new Date(completions[i].completion_date);
      const dayDiff = (currentDate - prevDate) / (1000 * 60 * 60 * 24);
      
      if (dayDiff === 1) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 1;
      }
    }
    
    return maxStreak;
  } catch (error) {
    console.error('Error calculating best streak:', error);
    return 0;
  }
};

export default { initializeDatabase, getDatabase, habitOperations, completionOperations };