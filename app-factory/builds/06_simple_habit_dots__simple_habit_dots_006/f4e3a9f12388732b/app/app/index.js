import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { useTheme } from '@styles/theme';
import { habitOperations, completionOperations } from '@services/database';

const { width } = Dimensions.get('window');

export default function TodayScreen() {
  const { colors, spacing, typography } = useTheme();
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().split('T')[0];
  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = async () => {
    try {
      const allHabits = habitOperations.getAll();
      const habitsWithCompletions = allHabits.map(habit => ({
        ...habit,
        isCompleted: completionOperations.isCompleted(habit.id, today),
        currentStreak: getCurrentStreak(habit.id)
      }));
      setHabits(habitsWithCompletions);
    } catch (error) {
      console.error('Error loading habits:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentStreak = (habitId) => {
    // Simple streak calculation for today view
    try {
      const completions = completionOperations.getCompletionsInRange(
        habitId,
        getDateDaysAgo(30),
        today
      );
      
      let streak = 0;
      let currentDate = new Date();
      
      for (let i = 0; i < 30; i++) {
        const dateStr = currentDate.toISOString().split('T')[0];
        const isCompleted = completions.some(c => c.completion_date === dateStr);
        
        if (isCompleted) {
          streak++;
          currentDate.setDate(currentDate.getDate() - 1);
        } else {
          break;
        }
      }
      
      return streak;
    } catch (error) {
      return 0;
    }
  };

  const getDateDaysAgo = (days) => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString().split('T')[0];
  };

  const toggleHabitCompletion = async (habit) => {
    try {
      if (habit.isCompleted) {
        await completionOperations.markIncomplete(habit.id, today);
      } else {
        await completionOperations.markComplete(habit.id, today);
        // Haptic feedback for completion
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      
      await loadHabits();
    } catch (error) {
      Alert.alert('Error', 'Failed to update habit. Please try again.');
      console.error('Error toggling habit:', error);
    }
  };

  const HabitCard = ({ habit }) => (
    <TouchableOpacity
      style={[styles.habitCard, { backgroundColor: colors.background.secondary }]}
      onPress={() => toggleHabitCompletion(habit)}
      activeOpacity={0.7}
    >
      <View style={styles.habitCardContent}>
        <View style={styles.habitInfo}>
          <View
            style={[
              styles.habitDot,
              {
                backgroundColor: habit.isCompleted ? habit.color : colors.background.primary,
                borderColor: habit.color,
                borderWidth: habit.isCompleted ? 0 : 2,
              }
            ]}
          >
            {habit.isCompleted && (
              <Ionicons name="checkmark" size={16} color="white" />
            )}
          </View>
          <View style={styles.habitText}>
            <Text style={[styles.habitName, { color: colors.text.primary }]}>
              {habit.name}
            </Text>
            {habit.currentStreak > 0 && (
              <Text style={[styles.streakText, { color: colors.text.secondary }]}>
                🔥 {habit.currentStreak} day{habit.currentStreak !== 1 ? 's' : ''} streak
              </Text>
            )}
          </View>
        </View>
        <View style={styles.habitAction}>
          <Ionicons
            name={habit.isCompleted ? "checkmark-circle" : "ellipse-outline"}
            size={24}
            color={habit.isCompleted ? colors.success : colors.text.tertiary}
          />
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.text.secondary }]}>
            Loading your habits...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const completedToday = habits.filter(h => h.isCompleted).length;
  const totalHabits = habits.length;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.dateText, { color: colors.text.secondary }]}>
            {todayFormatted}
          </Text>
          <Text style={[styles.titleText, { color: colors.text.primary }]}>
            Good {getTimeOfDay()}!
          </Text>
          {totalHabits > 0 && (
            <Text style={[styles.progressText, { color: colors.text.secondary }]}>
              {completedToday} of {totalHabits} habits completed
            </Text>
          )}
        </View>

        {/* Progress indicator */}
        {totalHabits > 0 && (
          <View style={[styles.progressContainer, { backgroundColor: colors.background.secondary }]}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor: colors.primary,
                    width: `${(completedToday / totalHabits) * 100}%`,
                  }
                ]}
              />
            </View>
            <Text style={[styles.progressPercentage, { color: colors.text.primary }]}>
              {Math.round((completedToday / totalHabits) * 100)}%
            </Text>
          </View>
        )}

        {/* Habits list */}
        <View style={styles.habitsContainer}>
          {habits.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="add-circle-outline" size={64} color={colors.text.tertiary} />
              <Text style={[styles.emptyStateTitle, { color: colors.text.primary }]}>
                No habits yet
              </Text>
              <Text style={[styles.emptyStateText, { color: colors.text.secondary }]}>
                Tap the Habits tab to create your first habit and start building consistency.
              </Text>
            </View>
          ) : (
            habits.map((habit) => (
              <HabitCard key={habit.id} habit={habit} />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const getTimeOfDay = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  header: {
    marginBottom: 24,
  },
  dateText: {
    fontSize: 16,
    marginBottom: 4,
  },
  titleText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 16,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressPercentage: {
    fontSize: 16,
    fontWeight: '600',
  },
  habitsContainer: {
    gap: 12,
  },
  habitCard: {
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  habitCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  habitInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  habitDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  habitText: {
    flex: 1,
  },
  habitName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  streakText: {
    fontSize: 14,
  },
  habitAction: {
    marginLeft: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
});