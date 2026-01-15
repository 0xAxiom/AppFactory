import { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors, typography, spacing } from '../src/ui/theme';
import { useSettings } from '../src/context/SettingsContext';
import { useSubscription } from '../src/context/SubscriptionContext';
import { getLastRoast, getTodayRoastCount, RoastEntry } from '../src/services/database';
import { scheduleRoasts } from '../src/services/notifications';
import { IntensityLevel } from '../src/data/insults';

export default function Home() {
  const { settings } = useSettings();
  const { isPremium } = useSubscription();
  const [lastRoast, setLastRoast] = useState<RoastEntry | null>(null);
  const [todayCount, setTodayCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    const [roast, count] = await Promise.all([
      getLastRoast(),
      getTodayRoastCount(),
    ]);
    setLastRoast(roast);
    setTodayCount(count);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  useEffect(() => {
    if (settings) {
      scheduleRoasts({ ...settings, isPremium });
    }
  }, [settings, isPremium]);

  const onRefresh = async () => {
    setRefreshing(true);
    Haptics.selectionAsync();
    await loadData();
    if (settings) {
      await scheduleRoasts({ ...settings, isPremium });
    }
    setRefreshing(false);
  };

  const getIntensityLabel = (intensity: IntensityLevel) => {
    switch (intensity) {
      case 'mild':
        return 'Mild Tease';
      case 'medium':
        return 'Solid Roast';
      case 'savage':
        return 'Savage Burns';
    }
  };

  const getIntensityIcon = (intensity: IntensityLevel) => {
    switch (intensity) {
      case 'mild':
        return 'happy-outline';
      case 'medium':
        return 'flame-outline';
      case 'savage':
        return 'skull-outline';
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.accent}
        />
      }
    >
      <View style={styles.header}>
        <Text style={styles.logo}>RoastPush</Text>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => {
            Haptics.selectionAsync();
            router.push('/settings');
          }}
        >
          <Ionicons name="settings-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="flame" size={32} color={colors.accent} />
          <Text style={styles.statNumber}>{todayCount}</Text>
          <Text style={styles.statLabel}>Roasts Today</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="calendar-outline" size={32} color={colors.accent} />
          <Text style={styles.statNumber}>{settings?.dailyLimit || 5}</Text>
          <Text style={styles.statLabel}>Daily Limit</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.intensityCard}
        onPress={() => {
          Haptics.selectionAsync();
          router.push('/settings');
        }}
        activeOpacity={0.8}
      >
        <View style={styles.intensityHeader}>
          <Ionicons
            name={getIntensityIcon(settings?.intensity || 'medium') as any}
            size={24}
            color={colors.accent}
          />
          <Text style={styles.intensityTitle}>Current Intensity</Text>
        </View>
        <Text style={styles.intensityLevel}>
          {getIntensityLabel(settings?.intensity || 'medium')}
        </Text>
        <Text style={styles.intensityHint}>Tap to change</Text>
      </TouchableOpacity>

      <View style={styles.lastRoastCard}>
        <Text style={styles.lastRoastTitle}>Last Roast</Text>
        {lastRoast ? (
          <>
            <Text style={styles.lastRoastText}>"{lastRoast.insult}"</Text>
            <Text style={styles.lastRoastTime}>{formatTime(lastRoast.timestamp)}</Text>
          </>
        ) : (
          <Text style={styles.noRoastText}>No roasts yet. They're coming for you...</Text>
        )}
      </View>

      <TouchableOpacity
        style={styles.historyButton}
        onPress={() => {
          Haptics.selectionAsync();
          router.push('/history');
        }}
        activeOpacity={0.8}
      >
        <Ionicons name="time-outline" size={20} color={colors.text} />
        <Text style={styles.historyButtonText}>View Roast History</Text>
        <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    paddingTop: spacing.xxl + spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logo: {
    ...typography.h1,
    color: colors.accent,
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    alignItems: 'center',
  },
  statNumber: {
    ...typography.h1,
    color: colors.text,
    marginTop: spacing.sm,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  intensityCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.accent + '30',
  },
  intensityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  intensityTitle: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  intensityLevel: {
    ...typography.h2,
    color: colors.text,
  },
  intensityHint: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  lastRoastCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  lastRoastTitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  lastRoastText: {
    ...typography.body,
    color: colors.text,
    fontStyle: 'italic',
    lineHeight: 24,
  },
  lastRoastTime: {
    ...typography.caption,
    color: colors.accent,
    marginTop: spacing.sm,
  },
  noRoastText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  historyButton: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  historyButtonText: {
    ...typography.body,
    color: colors.text,
    flex: 1,
  },
});
