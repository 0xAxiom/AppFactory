// Database schema for EVP Analyzer Pro
// Based on Stage 05 technical architecture specifications

export const SCHEMA_VERSION = 1;

// Database table definitions
export const TABLES = {
  sessions: 'sessions',
  anomalies: 'anomalies',
  settings: 'settings',
  exports: 'exports'
};

// Session table schema
export const CREATE_SESSIONS_TABLE = `
  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    location TEXT,
    start_time INTEGER NOT NULL,
    end_time INTEGER,
    duration INTEGER,
    file_path TEXT NOT NULL,
    file_size INTEGER,
    sample_rate INTEGER DEFAULT 44100,
    bit_depth INTEGER DEFAULT 16,
    anomaly_count INTEGER DEFAULT 0,
    analysis_status TEXT DEFAULT 'pending',
    notes TEXT,
    investigators TEXT,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  );
`;

// Anomalies table schema
export const CREATE_ANOMALIES_TABLE = `
  CREATE TABLE IF NOT EXISTS anomalies (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL,
    timestamp REAL NOT NULL,
    duration REAL,
    type TEXT NOT NULL,
    confidence REAL,
    amplitude REAL,
    frequency_range TEXT,
    description TEXT,
    user_notes TEXT,
    user_validated BOOLEAN DEFAULT FALSE,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    FOREIGN KEY (session_id) REFERENCES sessions (id) ON DELETE CASCADE
  );
`;

// Settings table schema
export const CREATE_SETTINGS_TABLE = `
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    type TEXT NOT NULL,
    updated_at INTEGER NOT NULL
  );
`;

// Exports table schema
export const CREATE_EXPORTS_TABLE = `
  CREATE TABLE IF NOT EXISTS exports (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL,
    export_type TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER,
    format TEXT NOT NULL,
    parameters TEXT,
    created_at INTEGER NOT NULL,
    FOREIGN KEY (session_id) REFERENCES sessions (id) ON DELETE CASCADE
  );
`;

// Indexes for performance optimization
export const CREATE_INDEXES = [
  'CREATE INDEX IF NOT EXISTS idx_sessions_created_at ON sessions (created_at DESC);',
  'CREATE INDEX IF NOT EXISTS idx_sessions_analysis_status ON sessions (analysis_status);',
  'CREATE INDEX IF NOT EXISTS idx_anomalies_session_id ON anomalies (session_id);',
  'CREATE INDEX IF NOT EXISTS idx_anomalies_timestamp ON anomalies (timestamp);',
  'CREATE INDEX IF NOT EXISTS idx_anomalies_type ON anomalies (type);',
  'CREATE INDEX IF NOT EXISTS idx_exports_session_id ON exports (session_id);'
];

// Default settings
export const DEFAULT_SETTINGS = [
  { key: 'audio_quality', value: 'high', type: 'string' },
  { key: 'sample_rate', value: '44100', type: 'number' },
  { key: 'bit_depth', value: '16', type: 'number' },
  { key: 'anomaly_sensitivity', value: '0.7', type: 'number' },
  { key: 'auto_detect_enabled', value: 'true', type: 'boolean' },
  { key: 'noise_reduction', value: 'true', type: 'boolean' },
  { key: 'export_format', value: 'wav', type: 'string' },
  { key: 'cloud_sync_enabled', value: 'false', type: 'boolean' },
  { key: 'onboarding_completed', value: 'false', type: 'boolean' },
  { key: 'privacy_analytics_enabled', value: 'true', type: 'boolean' }
];

// Migration queries
export const MIGRATIONS = {
  1: [
    CREATE_SESSIONS_TABLE,
    CREATE_ANOMALIES_TABLE,
    CREATE_SETTINGS_TABLE,
    CREATE_EXPORTS_TABLE,
    ...CREATE_INDEXES
  ]
};

// Data validation schemas
export const VALIDATION = {
  session: {
    required: ['id', 'name', 'start_time', 'file_path', 'created_at'],
    types: {
      id: 'string',
      name: 'string',
      location: 'string',
      start_time: 'number',
      end_time: 'number',
      duration: 'number',
      file_path: 'string',
      file_size: 'number',
      sample_rate: 'number',
      bit_depth: 'number',
      anomaly_count: 'number',
      analysis_status: 'string',
      notes: 'string',
      investigators: 'string',
      created_at: 'number',
      updated_at: 'number'
    }
  },
  anomaly: {
    required: ['id', 'session_id', 'timestamp', 'type', 'created_at'],
    types: {
      id: 'string',
      session_id: 'string',
      timestamp: 'number',
      duration: 'number',
      type: 'string',
      confidence: 'number',
      amplitude: 'number',
      frequency_range: 'string',
      description: 'string',
      user_notes: 'string',
      user_validated: 'boolean',
      created_at: 'number',
      updated_at: 'number'
    }
  }
};