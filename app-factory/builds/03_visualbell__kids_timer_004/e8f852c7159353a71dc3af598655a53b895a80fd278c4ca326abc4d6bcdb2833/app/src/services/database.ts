import AsyncStorage from '@react-native-async-storage/async-storage';

// Database schema for VisualBell timer app
export interface TimerSession {
  id: string;
  duration_seconds: number;
  theme_id: string;
  completion_status: 'completed' | 'cancelled' | 'interrupted';
  start_timestamp: number;
  end_timestamp?: number;
  preset_used?: string;
  child_interaction_count: number;
}

export interface CustomPreset {
  id: string;
  name: string;
  duration_seconds: number;
  theme_id: string;
  icon_name?: string;
  created_timestamp: number;
  usage_count: number;
  is_favorite: boolean;
}

export interface Theme {
  theme_id: string;
  display_name: string;
  category: string;
  is_premium: boolean;
  asset_version: string;
  usage_count: number;
  last_used_timestamp?: number;
}

export interface UsageAnalytics {
  date: string; // YYYY-MM-DD format
  total_timer_minutes: number;
  total_sessions: number;
  completion_rate: number;
  most_used_theme?: string;
  most_used_duration?: number;
  weekly_consistency_score: number;
}

const STORAGE_KEYS = {
  TIMER_SESSIONS: '@visualbell_timer_sessions',
  CUSTOM_PRESETS: '@visualbell_custom_presets', 
  THEMES: '@visualbell_themes',
  USAGE_ANALYTICS: '@visualbell_usage_analytics',
};

class DatabaseService {
  private initialized = false;

  async initialize(): Promise<void> {
    try {
      await this.seedInitialData();
      this.initialized = true;
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  }

  private async seedInitialData(): Promise<void> {
    // Check if themes already exist
    const existingThemes = await AsyncStorage.getItem(STORAGE_KEYS.THEMES);
    if (existingThemes) return;

    // Seed themes data
    const themes: Theme[] = [
      {
        theme_id: 'default',
        display_name: 'Sunshine Circle',
        category: 'default',
        is_premium: false,
        asset_version: '1.0',
        usage_count: 0,
      },
      {
        theme_id: 'space',
        display_name: 'Space Adventure',
        category: 'space',
        is_premium: false,
        asset_version: '1.0',
        usage_count: 0,
      },
      {
        theme_id: 'underwater',
        display_name: 'Underwater World',
        category: 'underwater',
        is_premium: true,
        asset_version: '1.0',
        usage_count: 0,
      },
      {
        theme_id: 'garden',
        display_name: 'Fairy Garden',
        category: 'garden',
        is_premium: true,
        asset_version: '1.0',
        usage_count: 0,
      },
      {
        theme_id: 'construction',
        display_name: 'Construction Zone',
        category: 'construction',
        is_premium: true,
        asset_version: '1.0',
        usage_count: 0,
      },
      {
        theme_id: 'art',
        display_name: 'Art Studio',
        category: 'art',
        is_premium: true,
        asset_version: '1.0',
        usage_count: 0,
      },
    ];

    await AsyncStorage.setItem(STORAGE_KEYS.THEMES, JSON.stringify(themes));
  }

  // Timer session methods
  async saveTimerSession(session: Omit<TimerSession, 'id'>): Promise<string> {
    if (!this.initialized) throw new Error('Database not initialized');

    const sessionWithId: TimerSession = {
      ...session,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    };

    const existingSessions = await this.getRecentTimerSessions(1000);
    const updatedSessions = [sessionWithId, ...existingSessions];

    await AsyncStorage.setItem(STORAGE_KEYS.TIMER_SESSIONS, JSON.stringify(updatedSessions));
    return sessionWithId.id;
  }

  async getRecentTimerSessions(limit: number = 10): Promise<TimerSession[]> {
    if (!this.initialized) throw new Error('Database not initialized');

    try {
      const sessionsData = await AsyncStorage.getItem(STORAGE_KEYS.TIMER_SESSIONS);
      if (!sessionsData) return [];

      const sessions: TimerSession[] = JSON.parse(sessionsData);
      return sessions.slice(0, limit);
    } catch (error) {
      console.error('Error getting timer sessions:', error);
      return [];
    }
  }

  // Custom preset methods
  async saveCustomPreset(preset: Omit<CustomPreset, 'id'>): Promise<string> {
    if (!this.initialized) throw new Error('Database not initialized');

    const presetWithId: CustomPreset = {
      ...preset,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    };

    const existingPresets = await this.getCustomPresets();
    const updatedPresets = [...existingPresets, presetWithId];

    await AsyncStorage.setItem(STORAGE_KEYS.CUSTOM_PRESETS, JSON.stringify(updatedPresets));
    return presetWithId.id;
  }

  async getCustomPresets(): Promise<CustomPreset[]> {
    if (!this.initialized) throw new Error('Database not initialized');

    try {
      const presetsData = await AsyncStorage.getItem(STORAGE_KEYS.CUSTOM_PRESETS);
      if (!presetsData) return [];

      const presets: CustomPreset[] = JSON.parse(presetsData);
      return presets.sort((a, b) => {
        if (a.is_favorite !== b.is_favorite) return b.is_favorite ? 1 : -1;
        if (a.usage_count !== b.usage_count) return b.usage_count - a.usage_count;
        return b.created_timestamp - a.created_timestamp;
      });
    } catch (error) {
      console.error('Error getting custom presets:', error);
      return [];
    }
  }

  async incrementPresetUsage(presetId: string): Promise<void> {
    if (!this.initialized) throw new Error('Database not initialized');

    const presets = await this.getCustomPresets();
    const updatedPresets = presets.map(preset => 
      preset.id === presetId 
        ? { ...preset, usage_count: preset.usage_count + 1 }
        : preset
    );

    await AsyncStorage.setItem(STORAGE_KEYS.CUSTOM_PRESETS, JSON.stringify(updatedPresets));
  }

  // Theme methods
  async getThemes(): Promise<Theme[]> {
    if (!this.initialized) throw new Error('Database not initialized');

    try {
      const themesData = await AsyncStorage.getItem(STORAGE_KEYS.THEMES);
      if (!themesData) return [];

      const themes: Theme[] = JSON.parse(themesData);
      return themes.sort((a, b) => {
        if (a.is_premium !== b.is_premium) return a.is_premium ? 1 : -1;
        return a.display_name.localeCompare(b.display_name);
      });
    } catch (error) {
      console.error('Error getting themes:', error);
      return [];
    }
  }

  async incrementThemeUsage(themeId: string): Promise<void> {
    if (!this.initialized) throw new Error('Database not initialized');

    const themes = await this.getThemes();
    const updatedThemes = themes.map(theme =>
      theme.theme_id === themeId
        ? { ...theme, usage_count: theme.usage_count + 1, last_used_timestamp: Date.now() }
        : theme
    );

    await AsyncStorage.setItem(STORAGE_KEYS.THEMES, JSON.stringify(updatedThemes));
  }

  // Analytics methods
  async updateDailyAnalytics(date: string): Promise<void> {
    if (!this.initialized) throw new Error('Database not initialized');

    const sessions = await this.getRecentTimerSessions(1000);
    const dateStart = new Date(date).getTime();
    const dateEnd = dateStart + 24 * 60 * 60 * 1000;

    const daySessions = sessions.filter(session => 
      session.start_timestamp >= dateStart && session.start_timestamp < dateEnd
    );

    if (daySessions.length === 0) return;

    const totalSessions = daySessions.length;
    const totalMinutes = daySessions.reduce((sum, session) => sum + session.duration_seconds / 60, 0);
    const completedSessions = daySessions.filter(session => session.completion_status === 'completed').length;
    const completionRate = completedSessions / totalSessions;

    // Find most used theme and duration
    const themeUsage = new Map<string, number>();
    const durationUsage = new Map<number, number>();

    daySessions.forEach(session => {
      themeUsage.set(session.theme_id, (themeUsage.get(session.theme_id) || 0) + 1);
      durationUsage.set(session.duration_seconds, (durationUsage.get(session.duration_seconds) || 0) + 1);
    });

    const mostUsedTheme = Array.from(themeUsage.entries()).reduce((a, b) => a[1] > b[1] ? a : b)[0];
    const mostUsedDuration = Array.from(durationUsage.entries()).reduce((a, b) => a[1] > b[1] ? a : b)[0];

    const analytics: UsageAnalytics = {
      date,
      total_timer_minutes: Math.round(totalMinutes),
      total_sessions: totalSessions,
      completion_rate: Math.round(completionRate * 100) / 100,
      most_used_theme: mostUsedTheme,
      most_used_duration: mostUsedDuration,
      weekly_consistency_score: 0, // Can be calculated later
    };

    const existingAnalytics = await this.getUsageAnalytics(365);
    const updatedAnalytics = [
      analytics,
      ...existingAnalytics.filter(a => a.date !== date)
    ];

    await AsyncStorage.setItem(STORAGE_KEYS.USAGE_ANALYTICS, JSON.stringify(updatedAnalytics));
  }

  async getUsageAnalytics(days: number = 7): Promise<UsageAnalytics[]> {
    if (!this.initialized) throw new Error('Database not initialized');

    try {
      const analyticsData = await AsyncStorage.getItem(STORAGE_KEYS.USAGE_ANALYTICS);
      if (!analyticsData) return [];

      const analytics: UsageAnalytics[] = JSON.parse(analyticsData);
      return analytics
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, days);
    } catch (error) {
      console.error('Error getting usage analytics:', error);
      return [];
    }
  }

  // Cleanup methods
  async cleanupOldSessions(daysToKeep: number = 180): Promise<void> {
    if (!this.initialized) throw new Error('Database not initialized');

    const cutoffTimestamp = Date.now() - (daysToKeep * 24 * 60 * 60 * 1000);
    const sessions = await this.getRecentTimerSessions(1000);
    const recentSessions = sessions.filter(session => session.start_timestamp >= cutoffTimestamp);

    await AsyncStorage.setItem(STORAGE_KEYS.TIMER_SESSIONS, JSON.stringify(recentSessions));
  }

  async getDatabase(): Promise<void> {
    if (!this.initialized) {
      await this.initialize();
    }
  }
}

export const databaseService = new DatabaseService();