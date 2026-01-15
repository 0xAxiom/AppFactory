import { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors, typography, spacing } from '../src/ui/theme';
import { getAllRoasts, RoastEntry } from '../src/services/database';

export default function History() {
  const [roasts, setRoasts] = useState<RoastEntry[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadRoasts = useCallback(async () => {
    const data = await getAllRoasts();
    setRoasts(data);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadRoasts();
    }, [loadRoasts])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRoasts();
    setRefreshing(false);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) {
      return `Today at ${date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
    }
    if (isYesterday) {
      return `Yesterday at ${date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
    }
    return date.toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'mild':
        return '#4CAF50';
      case 'medium':
        return colors.accent;
      case 'savage':
        return '#E53935';
      default:
        return colors.accent;
    }
  };

  const renderItem = ({ item }: { item: RoastEntry }) => (
    <View style={styles.roastCard}>
      <View style={styles.roastHeader}>
        <View
          style={[
            styles.intensityBadge,
            { backgroundColor: getIntensityColor(item.intensity) + '20' },
          ]}
        >
          <Text
            style={[styles.intensityText, { color: getIntensityColor(item.intensity) }]}
          >
            {item.intensity.toUpperCase()}
          </Text>
        </View>
        <Text style={styles.categoryText}>{item.category}</Text>
      </View>
      <Text style={styles.roastText}>"{item.insult}"</Text>
      <Text style={styles.roastTime}>{formatDate(item.timestamp)}</Text>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="flame-outline" size={64} color={colors.surface} />
      <Text style={styles.emptyTitle}>No Roasts Yet</Text>
      <Text style={styles.emptyText}>
        Your roast history is empty. The burns are coming...
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            Haptics.selectionAsync();
            router.back();
          }}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Roast History</Text>
        <View style={styles.backButton} />
      </View>

      <FlatList
        data={roasts}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={[
          styles.listContent,
          roasts.length === 0 && styles.emptyList,
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.accent}
          />
        }
        ListEmptyComponent={renderEmpty}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl + spacing.md,
    paddingBottom: spacing.md,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...typography.h2,
    color: colors.text,
  },
  listContent: {
    padding: spacing.lg,
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center',
  },
  roastCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  roastHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  intensityBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 6,
  },
  intensityText: {
    ...typography.caption,
    fontWeight: '600',
    fontSize: 10,
  },
  categoryText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  roastText: {
    ...typography.body,
    color: colors.text,
    fontStyle: 'italic',
    lineHeight: 24,
  },
  roastTime: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyTitle: {
    ...typography.h2,
    color: colors.text,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
