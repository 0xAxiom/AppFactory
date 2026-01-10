// Session Detail Screen for reviewing individual sessions
// Provides detailed playback and analysis interface

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
import { useDatabase, SessionRepository, AnomalyRepository } from '../services/database';

const SessionDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { colors, typography, spacing } = useTheme();
  const { database } = useDatabase();
  
  const { sessionId } = route.params;
  const [session, setSession] = useState(null);
  const [anomalies, setAnomalies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSessionDetails();
  }, [sessionId, database]);

  const loadSessionDetails = async () => {
    if (!database || !sessionId) return;

    try {
      const sessionRepo = new SessionRepository(database);
      const anomalyRepo = new AnomalyRepository(database);

      const sessionData = await sessionRepo.findById(sessionId);
      const anomalyData = await anomalyRepo.findBySessionId(sessionId);

      setSession(sessionData);
      setAnomalies(anomalyData);
    } catch (error) {
      console.error('Failed to load session details:', error);
      Alert.alert('Error', 'Failed to load session details');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatDuration = (milliseconds) => {
    if (!milliseconds) return '0:00';
    const seconds = Math.floor(milliseconds / 1000);
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
    metadata: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: spacing.md,
      gap: spacing.lg,
    },
    metaItem: {
      flex: 1,
      minWidth: 100,
    },
    metaLabel: {
      ...typography.caption,
      color: colors.text.tertiary,
    },
    metaValue: {
      ...typography.body,
      color: colors.text.primary,
      fontWeight: '500',
    },
    content: {
      padding: spacing.lg,
    },
    sectionTitle: {
      ...typography.h2,
      color: colors.text.primary,
      marginBottom: spacing.md,
    },
    comingSoon: {
      padding: spacing.xl,
      alignItems: 'center',
    },
    comingSoonText: {
      ...typography.body,
      color: colors.text.secondary,
      textAlign: 'center',
      marginBottom: spacing.lg,
    },
    anomalyList: {
      gap: spacing.md,
    },
    anomalyCard: {
      backgroundColor: colors.background.secondary,
      padding: spacing.md,
      borderRadius: 8,
      borderLeftWidth: 4,
      borderLeftColor: colors.accent,
    },
    anomalyHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    anomalyType: {
      ...typography.label,
      color: colors.accent,
      fontWeight: '600',
    },
    anomalyTime: {
      ...typography.caption,
      color: colors.text.secondary,
      fontFamily: 'monospace',
    },
    anomalyDescription: {
      ...typography.body,
      color: colors.text.primary,
    },
    noAnomalies: {
      padding: spacing.lg,
      alignItems: 'center',
    },
    noAnomaliesText: {
      ...typography.body,
      color: colors.text.secondary,
      textAlign: 'center',
    },
  });

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={[typography.body, { color: colors.text.secondary }]}>
          Loading session details...
        </Text>
      </View>
    );
  }

  if (!session) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={[typography.body, { color: colors.text.secondary }]}>
          Session not found
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Session Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{session.name}</Text>
        <Text style={styles.subtitle}>
          {formatDate(session.created_at)}
        </Text>
        
        <View style={styles.metadata}>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Duration</Text>
            <Text style={styles.metaValue}>
              {formatDuration(session.duration)}
            </Text>
          </View>
          
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Quality</Text>
            <Text style={styles.metaValue}>
              {session.sample_rate / 1000}kHz/{session.bit_depth}bit
            </Text>
          </View>
          
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Anomalies</Text>
            <Text style={[styles.metaValue, { color: session.anomaly_count > 0 ? colors.accent : colors.text.primary }]}>
              {session.anomaly_count}
            </Text>
          </View>
          
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>File Size</Text>
            <Text style={styles.metaValue}>
              {session.file_size ? `${Math.round(session.file_size / 1024 / 1024 * 10) / 10} MB` : 'Unknown'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        {/* Audio Player Section */}
        <Text style={styles.sectionTitle}>Audio Playback</Text>
        <View style={styles.comingSoon}>
          <Icon name="play-circle-outline" size={64} color={colors.text.tertiary} />
          <Text style={styles.comingSoonText}>
            Audio playback with waveform visualization and anomaly markers coming in the next update.
            This will include professional timeline scrubbing and segment isolation tools.
          </Text>
        </View>

        {/* Anomalies Section */}
        <Text style={styles.sectionTitle}>
          Detected Anomalies ({anomalies.length})
        </Text>
        
        {anomalies.length > 0 ? (
          <View style={styles.anomalyList}>
            {anomalies.map((anomaly, index) => (
              <View key={anomaly.id || index} style={styles.anomalyCard}>
                <View style={styles.anomalyHeader}>
                  <Text style={styles.anomalyType}>
                    {anomaly.type.replace('_', ' ').toUpperCase()}
                  </Text>
                  <Text style={styles.anomalyTime}>
                    {formatDuration(anomaly.timestamp)}
                  </Text>
                </View>
                
                <Text style={styles.anomalyDescription}>
                  {anomaly.description || 'Audio anomaly detected during analysis'}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.noAnomalies}>
            <Icon name="check-circle" size={48} color={colors.text.tertiary} />
            <Text style={styles.noAnomaliesText}>
              No anomalies detected in this session.{'\n'}
              This indicates optimal recording conditions or a quiet investigation period.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default SessionDetailScreen;