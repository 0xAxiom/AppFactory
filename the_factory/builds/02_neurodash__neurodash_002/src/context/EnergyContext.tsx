import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EnergyLevel, EnergyEntry, EnergyPattern } from '../types';
import { generateId } from '../utils/helpers';
import { getPatternAnalysis } from '../services/patternAnalysis';

interface EnergyContextType {
  currentEnergy: EnergyLevel | null;
  energyHistory: EnergyEntry[];
  patterns: EnergyPattern[];
  updateEnergy: (level: EnergyLevel, context?: string, voiceNote?: string) => void;
  isLoading: boolean;
  getRecommendedEnergy: () => EnergyLevel;
}

const EnergyContext = createContext<EnergyContextType | undefined>(undefined);

export function EnergyProvider({ children }: { children: ReactNode }) {
  const [currentEnergy, setCurrentEnergy] = useState<EnergyLevel | null>(null);
  const [energyHistory, setEnergyHistory] = useState<EnergyEntry[]>([]);
  const [patterns, setPatterns] = useState<EnergyPattern[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadEnergyData();
  }, []);

  useEffect(() => {
    if (energyHistory.length > 0) {
      saveEnergyData();
      updatePatterns();
    }
  }, [energyHistory]);

  const loadEnergyData = async () => {
    try {
      const energyData = await AsyncStorage.getItem('energy_history');
      if (energyData) {
        const history = JSON.parse(energyData).map((entry: any) => ({
          ...entry,
          timestamp: new Date(entry.timestamp),
        }));
        setEnergyHistory(history);
        
        // Set current energy from most recent entry
        if (history.length > 0) {
          setCurrentEnergy(history[0].level);
        }
      }
    } catch (error) {
      console.error('Error loading energy data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveEnergyData = async () => {
    try {
      await AsyncStorage.setItem('energy_history', JSON.stringify(energyHistory));
    } catch (error) {
      console.error('Error saving energy data:', error);
    }
  };

  const updateEnergy = (level: EnergyLevel, context?: string, voiceNote?: string) => {
    const newEntry: EnergyEntry = {
      id: generateId(),
      timestamp: new Date(),
      level,
      context,
      voiceNote,
    };

    setCurrentEnergy(level);
    setEnergyHistory(prev => [newEntry, ...prev].slice(0, 1000)); // Keep last 1000 entries
  };

  const updatePatterns = () => {
    const newPatterns = getPatternAnalysis(energyHistory);
    setPatterns(newPatterns);
  };

  const getRecommendedEnergy = (): EnergyLevel => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const hour = now.getHours();

    // Find pattern for current time
    const relevantPattern = patterns.find(
      p => p.dayOfWeek === dayOfWeek && Math.abs(p.hour - hour) <= 1
    );

    if (relevantPattern && relevantPattern.confidence > 0.3) {
      if (relevantPattern.averageEnergy > 2.5) return 'high';
      if (relevantPattern.averageEnergy > 1.5) return 'medium';
      return 'low';
    }

    // Default to medium if no pattern found
    return 'medium';
  };

  return (
    <EnergyContext.Provider
      value={{
        currentEnergy,
        energyHistory,
        patterns,
        updateEnergy,
        isLoading,
        getRecommendedEnergy,
      }}
    >
      {children}
    </EnergyContext.Provider>
  );
}

export function useEnergy() {
  const context = useContext(EnergyContext);
  if (context === undefined) {
    throw new Error('useEnergy must be used within an EnergyProvider');
  }
  return context;
}