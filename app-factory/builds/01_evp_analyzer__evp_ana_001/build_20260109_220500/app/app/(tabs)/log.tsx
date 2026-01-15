import { View, Text, StyleSheet, FlatList, Pressable, Alert } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useCallback } from 'react';
import * as Haptics from 'expo-haptics';
import { colors, typography, spacing, radius } from '@/constants/theme';
import { ChevronRightIcon, TrashIcon, LocationIcon, WaveformIcon } from '@/ui/icons';
import { getInvestigations, deleteInvestigation } from '@/services/storage';
import { Investigation } from '@/types';
import { format, formatDuration, intervalToDuration } from 'date-fns';

export default function LogScreen() {
  const router = useRouter();
  const [investigations, setInvestigations] = useState<Investigation[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadInvestigations();
    }, [])
  );

  const loadInvestigations = async () => {
    const data = await getInvestigations();
    setInvestigations(data);
  };

  const handleDelete = async (id: string) => {
    Alert.alert(
      'Delete Investigation',
      'This will permanently delete this investigation and its recording.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            await deleteInvestigation(id);
            loadInvestigations();
          },
        },
      ]
    );
  };

  const formatSessionDuration = (seconds: number) => {
    const duration = intervalToDuration({ start: 0, end: seconds * 1000 });
    return formatDuration(duration, { format: ['minutes', 'seconds'] });
  };

  const renderItem = ({ item }: { item: Investigation }) => (
    <Pressable
      style={styles.sessionCard}
      onPress={() => router.push(`/session/${item.id}`)}
      onLongPress={() => handleDelete(item.id)}
    >
      <View style={styles.sessionIcon}>
        <WaveformIcon size={24} color={colors.accent.primary} />
      </View>
      <View style={styles.sessionInfo}>
        <Text style={styles.sessionTitle} numberOfLines={1}>
          {item.location || 'Untitled Session'}
        </Text>
        <View style={styles.sessionMeta}>
          <Text style={styles.sessionDate}>
            {format(new Date(item.startedAt), 'MMM d, yyyy')}
          </Text>
          <Text style={styles.sessionDuration}>
            {formatSessionDuration(item.duration)}
          </Text>
        </View>
      </View>
      <ChevronRightIcon size={20} color={colors.text.tertiary} />
    </Pressable>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <WaveformIcon size={64} color={colors.text.tertiary} />
      <Text style={styles.emptyTitle}>No Investigations Yet</Text>
      <Text style={styles.emptySubtitle}>
        Start your first investigation to begin building your log
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Investigation Log</Text>
        <Text style={styles.subtitle}>{investigations.length} sessions</Text>
      </View>

      <FlatList
        data={investigations}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={
          investigations.length === 0 ? styles.emptyList : styles.list
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
  },
  title: {
    ...typography.title1,
    color: colors.text.primary,
  },
  subtitle: {
    ...typography.footnote,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  list: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
  emptyList: {
    flex: 1,
  },
  sessionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    padding: spacing.md,
    borderRadius: radius.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.background.tertiary,
  },
  sessionIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.accent.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sessionInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  sessionTitle: {
    ...typography.headline,
    color: colors.text.primary,
  },
  sessionMeta: {
    flexDirection: 'row',
    marginTop: spacing.xs,
    gap: spacing.md,
  },
  sessionDate: {
    ...typography.footnote,
    color: colors.text.secondary,
  },
  sessionDuration: {
    ...typography.footnote,
    color: colors.text.tertiary,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyTitle: {
    ...typography.title3,
    color: colors.text.primary,
    marginTop: spacing.lg,
  },
  emptySubtitle: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});
