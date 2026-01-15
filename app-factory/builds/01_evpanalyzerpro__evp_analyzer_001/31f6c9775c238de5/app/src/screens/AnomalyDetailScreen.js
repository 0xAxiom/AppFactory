// Anomaly Detail Screen for focused review of specific anomalies
// Professional interface for anomaly validation and annotation

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';

import { useTheme } from '../styles/theme';
import { useDatabase, AnomalyRepository } from '../services/database';

const AnomalyDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { colors, typography, spacing } = useTheme();
  const { database } = useDatabase();
  
  const { anomalyId, sessionId } = route.params;
  const [anomaly, setAnomaly] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAnomalyDetails();
  }, [anomalyId, database]);

  const loadAnomalyDetails = async () => {
    if (!database || !anomalyId) return;

    try {
      const anomalyRepo = new AnomalyRepository(database);
      // Note: This would need to be implemented in the repository
      // For now, we'll simulate loading the anomaly
      setAnomaly({
        id: anomalyId,
        type: 'amplitude_spike',
        timestamp: 45000,
        confidence: 0.75,
        description: 'Sudden amplitude spike detected',
        user_validated: false,
        user_notes: null
      });
    } catch (error) {
      console.error('Failed to load anomaly details:', error);
      Alert.alert('Error', 'Failed to load anomaly details');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimestamp = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.primary,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    header: {
      backgroundColor: colors.background.secondary,
      padding: spacing.lg,
    },
    title: {
      ...typography.h1,
      color: colors.text.primary,
      marginBottom: spacing.sm,
    },
    subtitle: {
      ...typography.body,
      color: colors.text.secondary,
    },
    content: {
      padding: spacing.lg,
    },
    comingSoon: {
      padding: spacing.xl,
      alignItems: 'center',
    },
    comingSoonIcon: {
      fontSize: 64,
      color: colors.text.tertiary,
      marginBottom: spacing.lg,
    },
    comingSoonText: {
      ...typography.body,
      color: colors.text.secondary,
      textAlign: 'center',
    },
  });

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={[typography.body, { color: colors.text.secondary }]}>
          Loading anomaly details...
        </Text>
      </View>
    );
  }

  if (!anomaly) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={[typography.body, { color: colors.text.secondary }]}>
          Anomaly not found
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {anomaly.type.replace('_', ' ').toUpperCase()}
        </Text>
        <Text style={styles.subtitle}>
          Detected at {formatTimestamp(anomaly.timestamp)}
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.comingSoon}>
          <Text style={styles.comingSoonIcon}>🔊</Text>
          <Text style={styles.comingSoonText}>
            Detailed anomaly analysis interface coming in the next update.{'\n\n'}
            This will include:
            {'\n'}• Isolated audio playback of the anomaly segment
            {'\n'}• Spectral analysis and frequency visualization  
            {'\n'}• Confidence scoring and validation controls
            {'\n'}• Manual annotation and note-taking tools
            {'\n'}• Export options for evidence documentation
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default AnomalyDetailScreen;