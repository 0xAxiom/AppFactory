import { Task, EnergyLevel } from '../types';
import { getEnergyNumeric, isTaskAppropriate } from '../utils/helpers';

export function getAdaptiveTaskSuggestions(
  allTasks: Task[],
  currentEnergy: EnergyLevel,
  limit: number = 4
): Task[] {
  // Filter out completed tasks
  const incompleteTasks = allTasks.filter(task => !task.completed);

  // Separate tasks by appropriateness for current energy
  const appropriateTasks = incompleteTasks.filter(task => 
    isTaskAppropriate(task.energyRequirement, currentEnergy)
  );

  const inappropriateTasks = incompleteTasks.filter(task => 
    !isTaskAppropriate(task.energyRequirement, currentEnergy)
  );

  // Score tasks based on current energy and other factors
  const scoredTasks = appropriateTasks.map(task => ({
    task,
    score: calculateTaskScore(task, currentEnergy),
  }));

  // Sort by score (highest first)
  scoredTasks.sort((a, b) => b.score - a.score);

  // Get top suggestions
  let suggestions = scoredTasks.slice(0, limit).map(item => item.task);

  // If we don't have enough appropriate tasks, suggest modified versions
  if (suggestions.length < limit && inappropriateTasks.length > 0) {
    const adaptedTasks = inappropriateTasks
      .slice(0, limit - suggestions.length)
      .map(task => adaptTaskToEnergy(task, currentEnergy));
    
    suggestions = [...suggestions, ...adaptedTasks];
  }

  return suggestions;
}

function calculateTaskScore(task: Task, currentEnergy: EnergyLevel): number {
  let score = 0;

  // Perfect energy match gets highest score
  const energyDiff = Math.abs(
    getEnergyNumeric(task.energyRequirement) - getEnergyNumeric(currentEnergy)
  );
  score += (3 - energyDiff) * 10; // 30 points for perfect match, 20 for 1 level diff, 10 for 2 levels

  // Prefer shorter tasks when energy is low
  if (currentEnergy === 'low') {
    score += Math.max(0, 30 - task.estimatedDuration); // Bonus for shorter tasks
  }

  // Prefer longer, complex tasks when energy is high
  if (currentEnergy === 'high' && task.cognitiveLoad === 'heavy') {
    score += 15;
  }

  // Factor in due dates
  if (task.dueDate) {
    const daysUntilDue = Math.ceil(
      (task.dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysUntilDue <= 1) score += 25; // Urgent tasks
    else if (daysUntilDue <= 3) score += 10; // Soon tasks
    else if (daysUntilDue <= 7) score += 5; // This week tasks
  }

  // Slight penalty for frequently rescheduled tasks when energy is low
  if (currentEnergy === 'low' && task.rescheduledCount > 2) {
    score -= 5;
  }

  // Bonus for tasks that haven't been rescheduled much
  if (task.rescheduledCount === 0) {
    score += 5;
  }

  // Random factor to add variety
  score += Math.random() * 3;

  return score;
}

function adaptTaskToEnergy(task: Task, currentEnergy: EnergyLevel): Task {
  // Create a modified version of the task that's more appropriate for current energy
  const adaptedTask = { ...task };

  if (currentEnergy === 'low' && task.energyRequirement === 'high') {
    // Break down high-energy tasks for low energy
    adaptedTask.title = `Quick prep: ${task.title}`;
    adaptedTask.description = `Prepare for or break down: ${task.description || task.title}`;
    adaptedTask.energyRequirement = 'low';
    adaptedTask.cognitiveLoad = 'light';
    adaptedTask.estimatedDuration = Math.min(15, task.estimatedDuration / 3);
  } else if (currentEnergy === 'low' && task.energyRequirement === 'medium') {
    // Simplify medium tasks for low energy
    adaptedTask.title = `Light work: ${task.title}`;
    adaptedTask.description = `Simple version of: ${task.description || task.title}`;
    adaptedTask.energyRequirement = 'low';
    adaptedTask.estimatedDuration = Math.min(20, task.estimatedDuration / 2);
  } else if (currentEnergy === 'medium' && task.energyRequirement === 'high') {
    // Moderate high-energy tasks
    adaptedTask.title = `Progress on: ${task.title}`;
    adaptedTask.description = `Make meaningful progress: ${task.description || task.title}`;
    adaptedTask.energyRequirement = 'medium';
    adaptedTask.cognitiveLoad = task.cognitiveLoad === 'heavy' ? 'medium' : task.cognitiveLoad;
    adaptedTask.estimatedDuration = Math.min(45, task.estimatedDuration * 0.7);
  }

  return adaptedTask;
}

export function getTasksByCategory(tasks: Task[]): Record<string, Task[]> {
  const categories: Record<string, Task[]> = {};
  
  tasks.forEach(task => {
    const category = task.category || 'Uncategorized';
    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push(task);
  });

  return categories;
}

export function getTaskCompletionStats(tasks: Task[]): {
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
  averageEffort: number;
  averageRescheduled: number;
} {
  const completedTasks = tasks.filter(task => task.completed);
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? (completedTasks.length / totalTasks) * 100 : 0;

  const effortScores = completedTasks
    .filter(task => task.effort !== undefined)
    .map(task => task.effort!);
  const averageEffort = effortScores.length > 0 
    ? effortScores.reduce((sum, effort) => sum + effort, 0) / effortScores.length 
    : 0;

  const totalRescheduled = tasks.reduce((sum, task) => sum + task.rescheduledCount, 0);
  const averageRescheduled = totalTasks > 0 ? totalRescheduled / totalTasks : 0;

  return {
    totalTasks,
    completedTasks: completedTasks.length,
    completionRate,
    averageEffort,
    averageRescheduled,
  };
}

export function getSuggestedTaskDuration(
  energyLevel: EnergyLevel,
  cognitiveLoad: 'light' | 'medium' | 'heavy'
): number {
  const baseDurations = {
    light: 15,
    medium: 30,
    heavy: 60,
  };

  const energyMultipliers = {
    low: 0.5,
    medium: 1,
    high: 1.5,
  };

  return Math.round(baseDurations[cognitiveLoad] * energyMultipliers[energyLevel]);
}