import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect, useRef } from 'react';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { v4 as uuidv4 } from 'uuid';
import { colors, typography, spacing, radius } from '@/constants/theme';
import { StopIcon, CloseIcon } from '@/ui/icons';
import { saveInvestigation, getAudioFilePath, getInvestigationCount } from '@/services/storage';
import { useSubscription } from '@/stores/SubscriptionContext';
import { Investigation } from '@/types';

const MAX_FREE_SESSIONS = 3;

export default function RecordScreen() {
  const router = useRouter();
  const { isProUser } = useSubscription();
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [waveformData, setWaveformData] = useState<number[]>([]);
  const recording = useRef<Audio.Recording | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    startRecording();
    return () => {
      stopRecording(false);
    };
  }, []);

  const startRecording = async () => {
    try {
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) {
        Alert.alert(
          'Microphone Access Required',
          'EVP Analyzer needs microphone access to record audio.',
          [{ text: 'OK', onPress: () => router.back() }]
        );
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
        (status) => {
          if (status.metering) {
            // Convert metering to 0-1 range for waveform
            const normalized = Math.max(0, Math.min(1, (status.metering + 60) / 60));
            setWaveformData((prev) => [...prev.slice(-100), normalized]);
          }
        },
        100
      );

      recording.current = newRecording;
      setIsRecording(true);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      timerRef.current = setInterval(() => {
        setDuration((d) => d + 1);
      }, 1000);
    } catch (error) {
      console.error('Failed to start recording:', error);
      Alert.alert('Recording Error', 'Failed to start recording. Please try again.');
      router.back();
    }
  };

  const stopRecording = async (save: boolean = true) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    if (!recording.current) return;

    try {
      await recording.current.stopAndUnloadAsync();
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      if (save && duration > 0) {
        // Check session limit
        const count = await getInvestigationCount();
        if (count >= MAX_FREE_SESSIONS && !isProUser) {
          router.replace('/paywall');
          return;
        }

        const uri = recording.current.getURI();
        if (uri) {
          const id = uuidv4();
          const audioPath = await getAudioFilePath(id);

          // In a real app, you'd move the file to the permanent location
          // For now, we'll use the temporary URI

          const investigation: Investigation = {
            id,
            title: null,
            location: null,
            coordinates: null,
            startedAt: new Date(Date.now() - duration * 1000).toISOString(),
            endedAt: new Date().toISOString(),
            duration,
            notes: null,
            audioFilePath: uri,
            waveformData,
            spectrogramPath: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          await saveInvestigation(investigation);
          router.replace(`/session/${id}`);
          return;
        }
      }

      setIsRecording(false);
      router.back();
    } catch (error) {
      console.error('Failed to stop recording:', error);
      router.back();
    }
  };

  const handleStop = () => {
    stopRecording(true);
  };

  const handleCancel = () => {
    Alert.alert('Cancel Recording', 'Are you sure you want to discard this recording?', [
      { text: 'Keep Recording', style: 'cancel' },
      { text: 'Discard', style: 'destructive', onPress: () => stopRecording(false) },
    ]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel} style={styles.closeButton}>
          <CloseIcon size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <View style={styles.recordingIndicator}>
          <View style={styles.recordingDot} />
          <Text style={styles.recordingText}>RECORDING</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.timerContainer}>
        <Text style={styles.timer}>{formatTime(duration)}</Text>
      </View>

      <View style={styles.waveformContainer}>
        {waveformData.map((value, index) => (
          <View
            key={index}
            style={[
              styles.waveformBar,
              { height: 10 + value * 100 },
            ]}
          />
        ))}
      </View>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.stopButton} onPress={handleStop}>
          <StopIcon size={40} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.stopLabel}>Stop & Save</Text>
      </View>
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
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  closeButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  recordingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.status.recording,
  },
  recordingText: {
    ...typography.caption1,
    color: colors.status.recording,
    fontWeight: '600',
    letterSpacing: 1,
  },
  placeholder: {
    width: 44,
  },
  timerContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  timer: {
    fontSize: 64,
    fontWeight: '200',
    color: colors.text.primary,
    fontVariant: ['tabular-nums'],
  },
  waveformContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    gap: 2,
  },
  waveformBar: {
    width: 3,
    backgroundColor: colors.visualization.waveform,
    borderRadius: 1.5,
  },
  controls: {
    alignItems: 'center',
    paddingBottom: spacing['3xl'],
  },
  stopButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.status.recording,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopLabel: {
    ...typography.footnote,
    color: colors.text.secondary,
    marginTop: spacing.md,
  },
});
