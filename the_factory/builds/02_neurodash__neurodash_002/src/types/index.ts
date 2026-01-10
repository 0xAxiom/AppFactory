export type EnergyLevel = 'low' | 'medium' | 'high';

export interface EnergyEntry {
  id: string;
  timestamp: Date;
  level: EnergyLevel;
  context?: string;
  voiceNote?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  energyRequirement: EnergyLevel;
  cognitiveLoad: 'light' | 'medium' | 'heavy';
  estimatedDuration: number; // in minutes
  completed: boolean;
  effort?: number; // 1-10 scale
  dueDate?: Date;
  createdAt: Date;
  completedAt?: Date;
  rescheduledCount: number;
  category?: string;
}

export interface FocusSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  plannedDuration: number;
  actualDuration?: number;
  energyAtStart: EnergyLevel;
  energyAtEnd?: EnergyLevel;
  taskId?: string;
  completed: boolean;
  pauseCount: number;
}

export interface EnergyPattern {
  dayOfWeek: number;
  hour: number;
  averageEnergy: number;
  confidence: number;
}

export interface UserPreferences {
  voiceEnabled: boolean;
  hapticsEnabled: boolean;
  reminderFrequency: 'low' | 'medium' | 'high';
  focusSessionDefaults: {
    low: number;
    medium: number;
    high: number;
  };
  accessibilityPreferences: {
    highContrast: boolean;
    reducedMotion: boolean;
    voiceOverEnabled: boolean;
  };
}