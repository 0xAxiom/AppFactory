import { EnergyLevel } from '../types';

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${remainingMinutes}m`;
}

export function getEnergyColor(level: EnergyLevel): string {
  switch (level) {
    case 'low':
      return '#3b82f6';
    case 'medium':
      return '#f59e0b';
    case 'high':
      return '#10b981';
    default:
      return '#6b7280';
  }
}

export function getEnergyLabel(level: EnergyLevel): string {
  switch (level) {
    case 'low':
      return 'Resting';
    case 'medium':
      return 'Steady';
    case 'high':
      return 'Energized';
    default:
      return 'Unknown';
  }
}

export function getCognitiveLoadIcon(load: 'light' | 'medium' | 'heavy'): string {
  switch (load) {
    case 'light':
      return 'feather';
    case 'medium':
      return 'circle-outline';
    case 'heavy':
      return 'weight-lifter';
    default:
      return 'circle-outline';
  }
}

export function getEnergyNumeric(level: EnergyLevel): number {
  switch (level) {
    case 'low':
      return 1;
    case 'medium':
      return 2;
    case 'high':
      return 3;
    default:
      return 2;
  }
}

export function getEnergyFromNumeric(value: number): EnergyLevel {
  if (value <= 1.5) return 'low';
  if (value <= 2.5) return 'medium';
  return 'high';
}

export function isTaskAppropriate(
  taskEnergyRequirement: EnergyLevel,
  currentEnergy: EnergyLevel
): boolean {
  const taskLevel = getEnergyNumeric(taskEnergyRequirement);
  const currentLevel = getEnergyNumeric(currentEnergy);
  
  // Allow tasks at or below current energy level
  return taskLevel <= currentLevel;
}

export function getTimeOfDayGreeting(): string {
  const hour = new Date().getHours();
  
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  
  return date.toLocaleDateString();
}