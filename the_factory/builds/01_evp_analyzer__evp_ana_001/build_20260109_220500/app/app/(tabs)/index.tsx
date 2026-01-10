import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useState, useEffect } from 'react';
import { colors, typography, spacing } from '@/constants/theme';
import { MicIcon, WaveformIcon } from '@/ui/icons';
import { getInvestigations } from '@/services/storage';
import { Investigation } from '@/types';
import { format } from 'date-fns';

export default function HomeScreen() {
  const router = useRouter();
  const [sessionCount, setSessionCount] = useState(0);
  const [lastSession, setLastSession] = useState<Investigation | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const investigations = await getInvestigations();
    setSessionCount(investigations.length);
    if (investigations.length > 0) {
      setLastSession(investigations[0]);
    }
  };

  const handleStartInvestigation = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/record');
  };

  const handleOpenLastSession = async () => {
    if (lastSession) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      router.push(`/session/${lastSession.id}`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <WaveformIcon size={28} color={colors.accent.primary} />
        <Text style={styles.title}>EVP Analyzer</Text>
      </View>

      <View style={styles.content}>
        <TouchableOpacity
          style={styles.recordButton}
          onPress={handleStartInvestigation}
          activeOpacity={0.8}
        >
          <View style={styles.recordButtonInner}>
            <MicIcon size={48} color={colors.text.primary} />
          </View>
        </TouchableOpacity>

        <Text style={styles.recordLabel}>Start Investigation</Text>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{sessionCount}</Text>
            <Text style={styles.statLabel}>Sessions</Text>
          </View>
        </View>
      </View>

      {lastSession && (
        <Pressable style={styles.lastSession} onPress={handleOpenLastSession}>
          <Text style={styles.lastSessionLabel}>Last Investigation</Text>
          <Text style={styles.lastSessionTitle}>
            {lastSession.location || 'Untitled Session'}
          </Text>
          <Text style={styles.lastSessionDate}>
            {format(new Date(lastSession.startedAt), 'MMM d, yyyy • h:mm a')}
          </Text>
        </Pressable>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    gap: spacing.sm,
  },
  title: {
    ...typography.title2,
    color: colors.text.primary,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: spacing['3xl'],
  },
  recordButton: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 3,
    borderColor: colors.accent.primary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent.muted,
  },
  recordButtonInner: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.accent.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordLabel: {
    ...typography.headline,
    color: colors.text.primary,
    marginTop: spacing.lg,
  },
  statsContainer: {
    flexDirection: 'row',
    marginTop: spacing['2xl'],
    gap: spacing.xl,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    ...typography.title1,
    color: colors.accent.primary,
  },
  statLabel: {
    ...typography.footnote,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  lastSession: {
    backgroundColor: colors.background.secondary,
    marginHorizontal: spacing.md,
    marginBottom: spacing.lg,
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.background.tertiary,
  },
  lastSessionLabel: {
    ...typography.caption1,
    color: colors.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  lastSessionTitle: {
    ...typography.headline,
    color: colors.text.primary,
    marginTop: spacing.xs,
  },
  lastSessionDate: {
    ...typography.footnote,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
});
