import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Button, TextInput, Card, Divider } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Haptics from 'expo-haptics';
import { useEnergy } from '../context/EnergyContext';
import { useTasks } from '../context/TaskContext';
import EnergyIndicator from '../components/EnergyIndicator';
import TaskCard from '../components/TaskCard';
import { EnergyLevel } from '../types';
import { getTimeOfDayGreeting, getRelativeTime } from '../utils/helpers';
import { energyColors } from '../theme';

export default function EnergyScreen() {
  const { currentEnergy, energyHistory, updateEnergy, getRecommendedEnergy } = useEnergy();
  const { getEnergyAppropriateTask, completeTask, rescheduleTask } = useTasks();
  
  const [selectedEnergy, setSelectedEnergy] = useState<EnergyLevel | null>(null);
  const [context, setContext] = useState('');
  const [showingTasks, setShowingTasks] = useState(false);

  const handleEnergySelection = (level: EnergyLevel) => {
    setSelectedEnergy(level);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleUpdateEnergy = () => {
    if (selectedEnergy) {
      updateEnergy(selectedEnergy, context);
      setContext('');
      setSelectedEnergy(null);
      setShowingTasks(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const suggestedTasks = currentEnergy ? getEnergyAppropriateTask(currentEnergy) : [];
  const recommendedEnergy = getRecommendedEnergy();
  const lastEntry = energyHistory[0];

  const renderEnergySelector = () => {
    const energyLevels: { level: EnergyLevel; icon: string; description: string }[] = [
      { 
        level: 'low', 
        icon: 'battery-low', 
        description: 'Resting mode - gentle tasks only' 
      },
      { 
        level: 'medium', 
        icon: 'battery-medium', 
        description: 'Steady pace - balanced productivity' 
      },
      { 
        level: 'high', 
        icon: 'battery-high', 
        description: 'Energized - ready for challenging work' 
      },
    ];

    return (
      <View style={styles.energySelector}>
        <Text style={styles.selectorTitle}>How's your energy right now?</Text>
        <Text style={styles.selectorSubtitle}>
          Based on your patterns, {recommendedEnergy} energy is typical for this time
        </Text>
        
        <View style={styles.energyOptions}>
          {energyLevels.map(({ level, icon, description }) => {
            const isSelected = selectedEnergy === level;
            const energyTheme = energyColors[level];
            
            return (
              <TouchableOpacity
                key={level}
                style={[
                  styles.energyOption,
                  isSelected && { 
                    borderColor: energyTheme.primary, 
                    backgroundColor: energyTheme.background + '20' 
                  }
                ]}
                onPress={() => handleEnergySelection(level)}
              >
                <MaterialCommunityIcons
                  name={icon}
                  size={32}
                  color={isSelected ? energyTheme.primary : '#9ca3af'}
                />
                <Text style={[
                  styles.energyOptionTitle,
                  isSelected && { color: energyTheme.primary }
                ]}>
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </Text>
                <Text style={styles.energyOptionDescription}>
                  {description}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TextInput
          style={styles.contextInput}
          placeholder="Optional: Add context (e.g., 'after coffee', 'feeling anxious')"
          placeholderTextColor="#9ca3af"
          value={context}
          onChangeText={setContext}
          mode="outlined"
          multiline
          numberOfLines={2}
        />

        <Button
          mode="contained"
          onPress={handleUpdateEnergy}
          disabled={!selectedEnergy}
          style={styles.updateButton}
        >
          Update Energy Level
        </Button>
      </View>
    );
  };

  const renderCurrentState = () => (
    <View style={styles.currentState}>
      <View style={styles.greeting}>
        <Text style={styles.greetingText}>{getTimeOfDayGreeting()}</Text>
        <Text style={styles.greetingSubtext}>
          {lastEntry 
            ? `Last check-in: ${getRelativeTime(lastEntry.timestamp)}`
            : 'Ready for your first energy check-in'
          }
        </Text>
      </View>

      <EnergyIndicator level={currentEnergy} size="large" />

      <Button
        mode="outlined"
        onPress={() => setShowingTasks(false)}
        style={styles.updateEnergyButton}
      >
        Update Energy Level
      </Button>
    </View>
  );

  const renderTaskSuggestions = () => (
    <View style={styles.taskSuggestions}>
      <Text style={styles.sectionTitle}>Suggested Tasks</Text>
      <Text style={styles.sectionSubtitle}>
        Based on your current {currentEnergy} energy level
      </Text>

      {suggestedTasks.length > 0 ? (
        suggestedTasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onComplete={() => completeTask(task.id, 7)} // Default effort of 7
            onReschedule={() => rescheduleTask(task.id)}
            showEnergyLevel={false}
          />
        ))
      ) : (
        <Card style={styles.emptyState}>
          <View style={styles.emptyStateContent}>
            <MaterialCommunityIcons name="check-circle" size={48} color="#10b981" />
            <Text style={styles.emptyStateTitle}>All caught up!</Text>
            <Text style={styles.emptyStateText}>
              No tasks match your current energy level. Great time to rest or add new tasks.
            </Text>
          </View>
        </Card>
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {currentEnergy && showingTasks ? (
        <>
          {renderCurrentState()}
          <Divider style={styles.divider} />
          {renderTaskSuggestions()}
        </>
      ) : (
        renderEnergySelector()
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  currentState: {
    padding: 20,
    alignItems: 'center',
    gap: 20,
  },
  greeting: {
    alignItems: 'center',
    marginBottom: 10,
  },
  greetingText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#e5e5e5',
    marginBottom: 4,
  },
  greetingSubtext: {
    fontSize: 14,
    color: '#9ca3af',
  },
  updateEnergyButton: {
    borderColor: '#60a5fa',
  },
  energySelector: {
    padding: 20,
  },
  selectorTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#e5e5e5',
    textAlign: 'center',
    marginBottom: 8,
  },
  selectorSubtitle: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },
  energyOptions: {
    gap: 16,
    marginBottom: 24,
  },
  energyOption: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#374151',
    alignItems: 'center',
    gap: 8,
  },
  energyOptionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#e5e5e5',
  },
  energyOptionDescription: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 18,
  },
  contextInput: {
    marginBottom: 20,
    backgroundColor: '#1f2937',
  },
  updateButton: {
    paddingVertical: 4,
  },
  divider: {
    marginVertical: 20,
    backgroundColor: '#374151',
  },
  taskSuggestions: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#e5e5e5',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 16,
  },
  emptyState: {
    backgroundColor: '#1f2937',
  },
  emptyStateContent: {
    padding: 32,
    alignItems: 'center',
    gap: 12,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#e5e5e5',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 20,
  },
});