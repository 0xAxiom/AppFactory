import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task, EnergyLevel } from '../types';
import { generateId } from '../utils/helpers';
import { getAdaptiveTaskSuggestions } from '../services/taskRecommendations';

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'completed' | 'rescheduledCount'>) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  completeTask: (taskId: string, effort?: number) => void;
  rescheduleTask: (taskId: string, newDueDate?: Date) => void;
  getEnergyAppropriateTask: (currentEnergy: EnergyLevel) => Task[];
  isLoading: boolean;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      saveTasks();
    }
  }, [tasks]);

  const loadTasks = async () => {
    try {
      const taskData = await AsyncStorage.getItem('tasks');
      if (taskData) {
        const parsedTasks = JSON.parse(taskData).map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
          completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
        }));
        setTasks(parsedTasks);
      } else {
        // Initialize with sample tasks for demo
        initializeSampleTasks();
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
      initializeSampleTasks();
    } finally {
      setIsLoading(false);
    }
  };

  const saveTasks = async () => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  };

  const initializeSampleTasks = () => {
    const sampleTasks: Task[] = [
      {
        id: generateId(),
        title: 'Quick email check',
        description: 'Scan inbox for urgent messages',
        energyRequirement: 'low',
        cognitiveLoad: 'light',
        estimatedDuration: 10,
        completed: false,
        createdAt: new Date(),
        rescheduledCount: 0,
        category: 'Communication',
      },
      {
        id: generateId(),
        title: 'Review project proposal',
        description: 'Read through and provide feedback on new project proposal',
        energyRequirement: 'medium',
        cognitiveLoad: 'medium',
        estimatedDuration: 30,
        completed: false,
        createdAt: new Date(),
        rescheduledCount: 0,
        category: 'Work',
      },
      {
        id: generateId(),
        title: 'Deep work session',
        description: 'Focus on complex coding task',
        energyRequirement: 'high',
        cognitiveLoad: 'heavy',
        estimatedDuration: 90,
        completed: false,
        createdAt: new Date(),
        rescheduledCount: 0,
        category: 'Development',
      },
      {
        id: generateId(),
        title: 'Organize desk',
        description: 'Tidy workspace and file papers',
        energyRequirement: 'low',
        cognitiveLoad: 'light',
        estimatedDuration: 15,
        completed: false,
        createdAt: new Date(),
        rescheduledCount: 0,
        category: 'Organization',
      },
    ];
    setTasks(sampleTasks);
  };

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'completed' | 'rescheduledCount'>) => {
    const newTask: Task = {
      ...taskData,
      id: generateId(),
      createdAt: new Date(),
      completed: false,
      rescheduledCount: 0,
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId ? { ...task, ...updates } : task
      )
    );
  };

  const completeTask = (taskId: string, effort?: number) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? {
              ...task,
              completed: true,
              completedAt: new Date(),
              effort,
            }
          : task
      )
    );
  };

  const rescheduleTask = (taskId: string, newDueDate?: Date) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? {
              ...task,
              dueDate: newDueDate,
              rescheduledCount: task.rescheduledCount + 1,
            }
          : task
      )
    );
  };

  const getEnergyAppropriateTask = (currentEnergy: EnergyLevel): Task[] => {
    return getAdaptiveTaskSuggestions(tasks, currentEnergy);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        updateTask,
        completeTask,
        rescheduleTask,
        getEnergyAppropriateTask,
        isLoading,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}