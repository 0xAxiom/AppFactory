import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { colors, typography, spacing, radius } from '@/constants/theme';
import { CloseIcon, PlayIcon, PauseIcon, AnomalyIcon } from '@/ui/icons';
import { getInvestigations, getAnomalies } from '@/services/storage';
import { Investigation, Anomaly } from '@/types';

export default function SpectrogramScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [investigation, setInvestigation] = useState<Investigation | null>(null);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    const investigations = await getInvestigations();
    const found = investigations.find((i) => i.id === id);
    if (found) {
      setInvestigation(found);
      const anomalyData = await getAnomalies(id!);
      setAnomalies(anomalyData);
    }
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const renderSpectrogramVisualization = () => {
    const bars = [];
    const barCount = 60;

    for (let i = 0; i < barCount; i++) {
      const heights = [];
      const frequencyBands = 20;

      for (let j = 0; j < frequencyBands; j++) {
        const intensity = Math.random() * 0.8 + 0.2;
        heights.push(intensity);
      }

      bars.push(
        <View key={i} style={styles.spectrogramColumn}>
          {heights.map((intensity, j) => (
            <View
              key={j}
              style={[
                styles.spectrogramCell,
                {
                  opacity: intensity,
                  backgroundColor: getFrequencyColor(j / frequencyBands),
                },
              ]}
            />
          ))}
        </View>
      );
    }

    return bars;
  };

  const getFrequencyColor = (ratio: number) => {
    if (ratio < 0.33) return colors.visualization.spectrumLow;
    if (ratio < 0.66) return colors.visualization.spectrumMid;
    return colors.visualization.spectrumHigh;
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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
          <CloseIcon size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Spectrogram</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.spectrogramContainer}>
        <View style={styles.frequencyAxis}>
          <Text style={styles.axisLabel}>20kHz</Text>
          <Text style={styles.axisLabel}>10kHz</Text>
          <Text style={styles.axisLabel}>1kHz</Text>
          <Text style={styles.axisLabel}>100Hz</Text>
          <Text style={styles.axisLabel}>20Hz</Text>
        </View>
        <View style={styles.spectrogramView}>
          {renderSpectrogramVisualization()}
        </View>
      </View>

      <View style={styles.timeAxis}>
        <Text style={styles.timeLabel}>0:00</Text>
        <Text style={styles.timeLabel}>
          {Math.floor(investigation.duration / 2 / 60)}:
          {String(Math.floor((investigation.duration / 2) % 60)).padStart(2, '0')}
        </Text>
        <Text style={styles.timeLabel}>
          {Math.floor(investigation.duration / 60)}:
          {String(investigation.duration % 60).padStart(2, '0')}
        </Text>
      </View>

      {anomalies.length > 0 && (
        <View style={styles.anomaliesSection}>
          <Text style={styles.sectionTitle}>Detected Anomalies</Text>
          {anomalies.map((anomaly) => (
            <TouchableOpacity key={anomaly.id} style={styles.anomalyItem}>
              <AnomalyIcon size={20} color={colors.status.anomaly} />
              <View style={styles.anomalyInfo}>
                <Text style={styles.anomalyType}>
                  {anomaly.type.replace('_', ' ')}
                </Text>
                <Text style={styles.anomalyTime}>
                  {Math.floor(anomaly.timestamp / 60)}:
                  {String(Math.floor(anomaly.timestamp % 60)).padStart(2, '0')}
                </Text>
              </View>
              <Text style={styles.anomalyConfidence}>
                {Math.round(anomaly.confidence * 100)}%
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={styles.controls}>
        <TouchableOpacity style={styles.playButton} onPress={togglePlayback}>
          {isPlaying ? (
            <PauseIcon size={32} color={colors.text.primary} />
          ) : (
            <PlayIcon size={32} color={colors.text.primary} />
          )}
        </TouchableOpacity>
      </View>
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
  title: {
    ...typography.headline,
    color: colors.text.primary,
  },
  placeholder: {
    width: 44,
  },
  spectrogramContainer: {
    flexDirection: 'row',
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
  },
  frequencyAxis: {
    width: 50,
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  axisLabel: {
    ...typography.caption2,
    color: colors.text.tertiary,
    textAlign: 'right',
    paddingRight: spacing.sm,
  },
  spectrogramView: {
    flex: 1,
    height: 200,
    flexDirection: 'row',
    backgroundColor: colors.background.secondary,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  spectrogramColumn: {
    flex: 1,
    flexDirection: 'column-reverse',
  },
  spectrogramCell: {
    flex: 1,
  },
  timeAxis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: spacing.md,
    marginTop: spacing.xs,
    paddingLeft: 50,
  },
  timeLabel: {
    ...typography.caption2,
    color: colors.text.tertiary,
  },
  anomaliesSection: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  sectionTitle: {
    ...typography.headline,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  anomalyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.xs,
  },
  anomalyInfo: {
    flex: 1,
    marginLeft: spacing.sm,
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
  anomalyConfidence: {
    ...typography.headline,
    color: colors.status.anomaly,
  },
  controls: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: spacing['3xl'],
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.accent.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
