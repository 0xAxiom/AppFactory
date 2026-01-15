import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Button, Card, ProgressBar, IconButton, Chip } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Haptics from 'expo-haptics';
import { useEnergy } from '../context/EnergyContext';
import { useTasks } from '../context/TaskContext';
import { formatDuration } from '../utils/helpers';
import { FocusSession, EnergyLevel } from '../types';

export default function FocusScreen() {
  const { currentEnergy } = useEnergy();
  const { tasks } = useTasks();
  
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(25 * 60); // 25 minutes default
  const [selectedDuration, setSelectedDuration] = useState(25);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [sessionCount, setSessionCount] = useState(0);
  const [pauseCount, setPauseCount] = useState(0);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<Date | null>(null);

  const durationOptions = getDurationOptions(currentEnergy);
  const availableTasks = tasks.filter(task => !task.completed).slice(0, 5);

  useEffect(() => {
    if (isActive && !isPaused && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleSessionComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, isPaused, timeRemaining]);

  const handleStart = () => {
    if (!isActive) {
      setIsActive(true);
      startTimeRef.current = new Date();
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(true);
    setPauseCount(prev => prev + 1);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleStop = () => {
    Alert.alert(
      'End Session',
      'Are you sure you want to end this focus session?',
      [
        { text: 'Continue', style: 'cancel' },
        {
          text: 'End Session',
          style: 'destructive',
          onPress: () => {
            setIsActive(false);
            setIsPaused(false);
            setTimeRemaining(selectedDuration * 60);
            setPauseCount(0);
            startTimeRef.current = null;
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          },
        },
      ]
    );
  };

  const handleSessionComplete = () => {
    setIsActive(false);
    setIsPaused(false);
    setSessionCount(prev => prev + 1);
    setTimeRemaining(selectedDuration * 60);
    setPauseCount(0);
    startTimeRef.current = null;
    
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    Alert.alert(
      '🎉 Session Complete!',
      `Great work! You've completed a ${selectedDuration}-minute focus session.`,
      [
        {
          text: 'Take a Break',
          onPress: () => suggestBreak(),
        },
        {
          text: 'Start Another',
          onPress: () => setTimeRemaining(selectedDuration * 60),
        },
      ]
    );
  };

  const handleDurationChange = (duration: number) => {
    if (!isActive) {
      setSelectedDuration(duration);
      setTimeRemaining(duration * 60);
    }
  };

  const suggestBreak = () => {
    const breakDuration = selectedDuration >= 45 ? 15 : 5; // Longer breaks for longer sessions
    Alert.alert(
      'Break Time',
      `Take a ${breakDuration}-minute break. Your brain needs time to process and recharge.`,
      [{ text: 'OK' }]
    );
  };

  const progress = (selectedDuration * 60 - timeRemaining) / (selectedDuration * 60);
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  const getStatusMessage = () => {
    if (!isActive) return 'Ready to focus';
    if (isPaused) return 'Paused - take your time';
    return selectedTask ? `Focusing on task` : 'Deep focus session';
  };

  const renderTimer = () => (
    <Card style={styles.timerCard}>
      <View style={styles.timerContent}>
        <Text style={styles.statusText}>{getStatusMessage()}</Text>
        
        <View style={styles.timerDisplay}>
          <Text style={styles.timeText}>
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </Text>
          <ProgressBar 
            progress={progress} 
            style={styles.progressBar}
            color={isActive ? '#10b981' : '#60a5fa'}
          />
        </View>

        {selectedTask && (
          <View style={styles.selectedTask}>
            <Text style={styles.taskLabel}>Current Task:</Text>
            <Text style={styles.taskTitle}>
              {tasks.find(t => t.id === selectedTask)?.title}
            </Text>
          </View>
        )}

        <View style={styles.timerControls}>
          {!isActive ? (
            <Button
              mode="contained"
              onPress={handleStart}
              style={styles.startButton}
              labelStyle={styles.buttonLabel}
            >
              Start Focus Session
            </Button>
          ) : (
            <View style={styles.activeControls}>
              <IconButton
                icon={isPaused ? 'play' : 'pause'}
                size={28}
                iconColor={isPaused ? '#10b981' : '#f59e0b'}
                onPress={isPaused ? handleStart : handlePause}
                style={styles.controlButton}
              />
              <IconButton
                icon="stop"
                size={28}
                iconColor="#ef4444"
                onPress={handleStop}
                style={styles.controlButton}
              />
            </View>
          )}
        </View>
      </View>
    </Card>
  );

  const renderDurationOptions = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Session Duration</Text>
      <Text style={styles.sectionSubtitle}>
        {currentEnergy 
          ? `Recommended for ${currentEnergy} energy`
          : 'Choose your focus session length'
        }
      </Text>
      
      <View style={styles.durationChips}>
        {durationOptions.map(duration => (
          <Chip
            key={duration}
            selected={selectedDuration === duration}
            onPress={() => handleDurationChange(duration)}
            disabled={isActive}
            style={styles.durationChip}
          >
            {duration}m
          </Chip>
        ))}
      </View>
    </View>
  );

  const renderTaskSelection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Focus On (Optional)</Text>
      <Text style={styles.sectionSubtitle}>
        Choose a specific task to work on during this session
      </Text>
      
      <View style={styles.taskChips}>
        <Chip
          selected={selectedTask === null}
          onPress={() => setSelectedTask(null)}
          disabled={isActive}
          style={styles.taskChip}
        >
          General Focus
        </Chip>
        {availableTasks.map(task => (
          <Chip
            key={task.id}
            selected={selectedTask === task.id}
            onPress={() => setSelectedTask(task.id)}
            disabled={isActive}
            style={styles.taskChip}
          >
            {task.title}
          </Chip>
        ))}
      </View>
    </View>
  );

  const renderStats = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Today's Progress</Text>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <MaterialCommunityIcons name="check-circle" size={24} color="#10b981" />
          <Text style={styles.statNumber}>{sessionCount}</Text>
          <Text style={styles.statLabel}>Sessions Completed</Text>
        </View>
        
        <View style={styles.statItem}>
          <MaterialCommunityIcons name="clock" size={24} color="#60a5fa" />
          <Text style={styles.statNumber}>{sessionCount * selectedDuration}</Text>
          <Text style={styles.statLabel}>Minutes Focused</Text>
        </View>
        
        {pauseCount > 0 && (
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="pause" size={24} color="#f59e0b" />
            <Text style={styles.statNumber}>{pauseCount}</Text>
            <Text style={styles.statLabel}>Pauses</Text>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderTimer()}
      {!isActive && renderDurationOptions()}
      {!isActive && renderTaskSelection()}
      {renderStats()}
    </View>
  );
}

function getDurationOptions(energyLevel: EnergyLevel | null): number[] {
  switch (energyLevel) {
    case 'low':
      return [10, 15, 20, 25];
    case 'medium':
      return [15, 25, 30, 45];
    case 'high':
      return [25, 45, 60, 90];
    default:
      return [15, 25, 30, 45]; // Default options
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
    padding: 20,
    gap: 24,
  },
  timerCard: {
    backgroundColor: '#1f2937',
    elevation: 4,
  },
  timerContent: {
    padding: 32,
    alignItems: 'center',
    gap: 20,
  },
  statusText: {
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
  },
  timerDisplay: {
    alignItems: 'center',
    gap: 16,
    width: '100%',
  },
  timeText: {
    fontSize: 48,
    fontWeight: '700',
    color: '#e5e5e5',
    fontFamily: 'monospace',
  },
  progressBar: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    backgroundColor: '#374151',
  },
  selectedTask: {
    alignItems: 'center',
    gap: 4,
  },
  taskLabel: {
    fontSize: 12,
    color: '#9ca3af',
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#60a5fa',
    textAlign: 'center',
  },
  timerControls: {
    width: '100%',
    alignItems: 'center',
  },
  startButton: {
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  activeControls: {
    flexDirection: 'row',
    gap: 16,
  },
  controlButton: {
    backgroundColor: '#374151',
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#e5e5e5',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#9ca3af',
    lineHeight: 20,
  },
  durationChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  durationChip: {
    backgroundColor: '#374151',
  },
  taskChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  taskChip: {
    backgroundColor: '#374151',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 20,
  },
  statItem: {
    alignItems: 'center',
    gap: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#e5e5e5',
  },
  statLabel: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
  },
});