import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { Audio } from 'expo-av';
import { format } from 'date-fns';
import { colors, typography, spacing, radius } from '@/constants/theme';
import { PlayIcon, PauseIcon, TagIcon, ExportIcon, ChevronRightIcon, LockIcon, AnomalyIcon } from '@/ui/icons';
import { getInvestigations, getTags, getAnomalies } from '@/services/storage';
import { useSubscription } from '@/stores/SubscriptionContext';
import { Investigation, Tag, Anomaly } from '@/types';

export default function SessionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { isProUser } = useSubscription();
  const [investigation, setInvestigation] = useState<Investigation | null>(null);
  const [tags, setTags] = useState<Tag[]>([]);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackPosition, setPlaybackPosition] = useState(0);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  useEffect(() => {
    loadData();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [id]);

  const loadData = async () => {
    const investigations = await getInvestigations();
    const found = investigations.find((i) => i.id === id);
    if (found) {
      setInvestigation(found);
      const tagData = await getTags(id!);
      setTags(tagData);
      if (isProUser) {
        const anomalyData = await getAnomalies(id!);
        setAnomalies(anomalyData);
      }
    }
  };

  const togglePlayback = async () => {
    if (!investigation) return;

    if (isPlaying && sound) {
      await sound.pauseAsync();
      setIsPlaying(false);
    } else {
      try {
        if (sound) {
          await sound.playAsync();
        } else {
          const { sound: newSound } = await Audio.Sound.createAsync(
            { uri: investigation.audioFilePath },
            { shouldPlay: true },
            (status) => {
              if (status.isLoaded) {
                setPlaybackPosition(status.positionMillis / 1000);
                if (status.didJustFinish) {
                  setIsPlaying(false);
                  setPlaybackPosition(0);
                }
              }
            }
          );
          setSound(newSound);
        }
        setIsPlaying(true);
      } catch (error) {
        console.error('Playback error:', error);
      }
    }
  };

  const handleSpectrogramPress = () => {
    if (!isProUser) {
      router.push('/paywall');
    } else {
      // Navigate to spectrogram view
      router.push(`/session/${id}/spectrogram`);
    }
  };

  const handleExportPress = () => {
    if (!isProUser) {
      router.push('/paywall');
    } else {
      router.push(`/session/${id}/export`);
    }
  };

  const handleTagPress = () => {
    router.push(`/session/${id}/tag`);
  };

  if (!investigation) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{investigation.location || 'Investigation'}</Text>
          <Text style={styles.date}>
            {format(new Date(investigation.startedAt), 'MMMM d, yyyy • h:mm a')}
          </Text>
        </View>

        {/* Waveform */}
        <View style={styles.waveformSection}>
          <Text style={styles.sectionTitle}>Waveform</Text>
          <View style={styles.waveformContainer}>
            {investigation.waveformData.slice(0, 60).map((value, index) => (
              <View
                key={index}
                style={[
                  styles.waveformBar,
                  { height: 8 + value * 80 },
                  index / 60 < playbackPosition / investigation.duration && styles.waveformBarPlayed,
                ]}
              />
            ))}
          </View>
          <View style={styles.playbackControls}>
            <TouchableOpacity style={styles.playButton} onPress={togglePlayback}>
              {isPlaying ? (
                <PauseIcon size={32} color={colors.text.primary} />
              ) : (
                <PlayIcon size={32} color={colors.text.primary} />
              )}
            </TouchableOpacity>
            <Text style={styles.playbackTime}>
              {Math.floor(playbackPosition / 60)}:{String(Math.floor(playbackPosition % 60)).padStart(2, '0')} /
              {Math.floor(investigation.duration / 60)}:{String(investigation.duration % 60).padStart(2, '0')}
            </Text>
          </View>
        </View>

        {/* Spectrogram (Premium) */}
        <Pressable style={styles.spectrogramSection} onPress={handleSpectrogramPress}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Spectrogram</Text>
            {!isProUser && <LockIcon size={16} color={colors.accent.primary} />}
          </View>
          <View style={[styles.spectrogramPreview, !isProUser && styles.blurred]}>
            <Text style={styles.spectrogramPlaceholder}>
              {isProUser ? 'View Spectrogram →' : 'Unlock with EVP Pro'}
            </Text>
          </View>
        </Pressable>

        {/* Anomalies */}
        <View style={styles.anomaliesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Anomalies</Text>
            {!isProUser && (
              <View style={styles.anomalyBadge}>
                <AnomalyIcon size={14} color={colors.status.anomaly} />
                <Text style={styles.anomalyBadgeText}>3 found</Text>
                <LockIcon size={12} color={colors.accent.primary} />
              </View>
            )}
          </View>
          {isProUser ? (
            anomalies.length > 0 ? (
              anomalies.map((anomaly) => (
                <View key={anomaly.id} style={styles.anomalyItem}>
                  <AnomalyIcon size={20} color={colors.status.anomaly} />
                  <View style={styles.anomalyInfo}>
                    <Text style={styles.anomalyType}>{anomaly.type.replace('_', ' ')}</Text>
                    <Text style={styles.anomalyTime}>
                      {Math.floor(anomaly.timestamp / 60)}:{String(Math.floor(anomaly.timestamp % 60)).padStart(2, '0')}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.noAnomalies}>No anomalies detected</Text>
            )
          ) : (
            <Pressable style={styles.unlockPrompt} onPress={() => router.push('/paywall')}>
              <Text style={styles.unlockText}>Unlock anomaly detection with EVP Pro</Text>
            </Pressable>
          )}
        </View>

        {/* Tags */}
        <View style={styles.tagsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tags</Text>
            <TouchableOpacity onPress={handleTagPress}>
              <TagIcon size={20} color={colors.accent.primary} />
            </TouchableOpacity>
          </View>
          {tags.length > 0 ? (
            tags.map((tag) => (
              <View key={tag.id} style={styles.tagItem}>
                <View style={[styles.tagChip, { backgroundColor: colors.tag[tag.category] + '20' }]}>
                  <Text style={[styles.tagChipText, { color: colors.tag[tag.category] }]}>
                    {tag.category}
                  </Text>
                </View>
                <Text style={styles.tagLabel}>{tag.label}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noTags}>No tags yet. Tap + to add one.</Text>
          )}
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, !isProUser && styles.actionButtonLocked]}
            onPress={handleExportPress}
          >
            <ExportIcon size={20} color={isProUser ? colors.text.primary : colors.text.tertiary} />
            <Text style={[styles.actionText, !isProUser && styles.actionTextLocked]}>
              Export
            </Text>
            {!isProUser && <LockIcon size={14} color={colors.accent.primary} />}
          </TouchableOpacity>
        </View>

        <View style={styles.footer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  loadingText: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },
  backButton: {
    marginBottom: spacing.md,
  },
  backText: {
    ...typography.body,
    color: colors.accent.primary,
  },
  title: {
    ...typography.title1,
    color: colors.text.primary,
  },
  date: {
    ...typography.footnote,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  waveformSection: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.headline,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 100,
    backgroundColor: colors.background.secondary,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  waveformBar: {
    width: 3,
    backgroundColor: colors.visualization.waveform,
    borderRadius: 1.5,
    opacity: 0.4,
  },
  waveformBarPlayed: {
    opacity: 1,
  },
  playbackControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    gap: spacing.md,
  },
  playButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.accent.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playbackTime: {
    ...typography.body,
    color: colors.text.secondary,
    fontVariant: ['tabular-nums'],
  },
  spectrogramSection: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  spectrogramPreview: {
    height: 80,
    backgroundColor: colors.background.secondary,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  blurred: {
    opacity: 0.5,
  },
  spectrogramPlaceholder: {
    ...typography.body,
    color: colors.text.secondary,
  },
  anomaliesSection: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  anomalyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.status.anomaly + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  anomalyBadgeText: {
    ...typography.caption1,
    color: colors.status.anomaly,
    fontWeight: '600',
  },
  anomalyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.background.secondary,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.xs,
  },
  anomalyInfo: {
    flex: 1,
  },
  anomalyType: {
    ...typography.body,
    color: colors.text.primary,
    textTransform: 'capitalize',
  },
  anomalyTime: {
    ...typography.caption1,
    color: colors.text.secondary,
  },
  noAnomalies: {
    ...typography.body,
    color: colors.text.tertiary,
  },
  unlockPrompt: {
    backgroundColor: colors.background.secondary,
    padding: spacing.md,
    borderRadius: radius.md,
  },
  unlockText: {
    ...typography.body,
    color: colors.accent.primary,
    textAlign: 'center',
  },
  tagsSection: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  tagItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  tagChip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  tagChipText: {
    ...typography.caption1,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  tagLabel: {
    ...typography.body,
    color: colors.text.primary,
  },
  noTags: {
    ...typography.body,
    color: colors.text.tertiary,
  },
  actions: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.accent.primary,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
  },
  actionButtonLocked: {
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.background.tertiary,
  },
  actionText: {
    ...typography.headline,
    color: colors.text.primary,
  },
  actionTextLocked: {
    color: colors.text.tertiary,
  },
  footer: {
    height: spacing['2xl'],
  },
});
