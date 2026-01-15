import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  completedAt?: number;
}

interface TaskStore {
  tasks: Task[];
  addTask: (text: string) => void;
  completeTask: (id: string) => void;
  loadTasks: () => Promise<void>;
  saveTasks: () => Promise<void>;
}

const STORAGE_KEY = 'cleartasks_tasks';

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],

  addTask: (text: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      text,
      completed: false,
      createdAt: Date.now(),
    };

    set(state => ({
      tasks: [...state.tasks, newTask]
    }));

    get().saveTasks();
  },

  completeTask: (id: string) => {
    set(state => ({
      tasks: state.tasks.map(task =>
        task.id === id
          ? { ...task, completed: true, completedAt: Date.now() }
          : task
      )
    }));

    get().saveTasks();
  },

  loadTasks: async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const tasks = JSON.parse(stored);
        set({ tasks });
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  },

  saveTasks: async () => {
    try {
      const { tasks } = get();
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  },
}));