// Analysis Screen for detailed EVP review
// Based on Stage 03 wireframes for professional analysis interface

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
import { usePurchases, FEATURES } from '../services/purchases';

const AnalysisScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { colors, typography, spacing } = useTheme();
  const { database } = useDatabase();
  const { shouldShowPaywall } = usePurchases();

  const [currentSession, setCurrentSession] = useState(null);
  const [recentSessions, setRecentSessions] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState(route.params?.sessionId || null);

  useEffect(() => {
    loadRecentSessions();
  }, [database]);

  useEffect(() => {
    if (selectedSessionId) {
      loadSessionForAnalysis(selectedSessionId);
    }
  }, [selectedSessionId, database]);

  const loadRecentSessions = async () => {
    if (!database) return;

    try {
      const sessionRepo = new SessionRepository(database);
      const sessions = await sessionRepo.getRecentSessions(5);
      setRecentSessions(sessions);

      // Auto-select most recent session if none selected
      if (!selectedSessionId && sessions.length > 0) {
        setSelectedSessionId(sessions[0].id);
      }
    } catch (error) {
      console.error('Failed to load recent sessions:', error);
    }
  };

  const loadSessionForAnalysis = async (sessionId) => {
    if (!database) return;

    try {
      const sessionRepo = new SessionRepository(database);
      const anomalyRepo = new AnomalyRepository(database);

      const session = await sessionRepo.findById(sessionId);
      const anomalies = await anomalyRepo.findBySessionId(sessionId);

      setCurrentSession({ ...session, anomalies });
    } catch (error) {
      console.error('Failed to load session for analysis:', error);
      Alert.alert('Error', 'Failed to load session data');
    }
  };

  const handleAdvancedAnalysis = () => {
    if (shouldShowPaywall(FEATURES.ADVANCED_ANALYSIS)) {
      Alert.alert(
        'Professional Analysis',
        'Advanced spectral analysis is available with EVP Pro subscription.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Upgrade', onPress: () => navigation.navigate('Paywall') }
        ]
      );
      return;
    }

    // Advanced analysis would be implemented here
    Alert.alert('Advanced Analysis', 'Feature coming soon in the next update!');
  };

  const handleSessionSelect = (sessionId) => {
    setSelectedSessionId(sessionId);
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
    sessionSelector: {
      padding: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.primary,
    },
    selectorTitle: {
      ...typography.h3,
      color: colors.text.primary,
      marginBottom: spacing.sm,
    },
    sessionList: {
      flexDirection: 'row',
    },
    sessionChip: {
      backgroundColor: colors.background.secondary,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: 16,
      marginRight: spacing.sm,
      borderWidth: 1,
      borderColor: colors.border.primary,
    },
    selectedChip: {
      backgroundColor: colors.primary + '20',
      borderColor: colors.primary,
    },
    chipText: {
      ...typography.caption,
      color: colors.text.secondary,
    },
    selectedChipText: {
      color: colors.primary,
    },
    content: {
      flex: 1,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.xl,
    },
    emptyIcon: {
      fontSize: 64,
      color: colors.text.tertiary,
      marginBottom: spacing.lg,
    },
    emptyText: {
      ...typography.body,
      color: colors.text.secondary,
      textAlign: 'center',
      marginBottom: spacing.lg,
    },
    sessionInfo: {
      padding: spacing.lg,
      backgroundColor: colors.background.secondary,
      margin: spacing.md,
      borderRadius: 8,
    },
    sessionTitle: {
      ...typography.h2,
      color: colors.text.primary,
      marginBottom: spacing.sm,
    },
    sessionMeta: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: spacing.md,
    },
    metaItem: {
      marginRight: spacing.lg,
      marginBottom: spacing.xs,
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
    actionButtons: {
      flexDirection: 'row',
      gap: spacing.md,
    },
    actionButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primary,
      padding: spacing.md,
      borderRadius: 8,
    },
    secondaryButton: {
      backgroundColor: colors.background.tertiary,
      borderWidth: 1,
      borderColor: colors.border.primary,
    },
    buttonText: {
      ...typography.button,
      color: colors.text.primary,
      marginLeft: spacing.sm,
    },
    anomaliesSection: {
      margin: spacing.md,
    },
    sectionTitle: {
      ...typography.h3,
      color: colors.text.primary,
      marginBottom: spacing.md,
    },
    anomalyCard: {
      backgroundColor: colors.background.secondary,
      padding: spacing.md,
      borderRadius: 8,
      marginBottom: spacing.sm,
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
    confidenceBar: {
      height: 4,
      backgroundColor: colors.background.tertiary,
      borderRadius: 2,
      marginTop: spacing.sm,
      overflow: 'hidden',
    },
    confidenceFill: {
      height: '100%',
      backgroundColor: colors.accent,
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

  if (!currentSession && recentSessions.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📊</Text>
          <Text style={styles.emptyText}>
            No sessions available for analysis.{'\n'}
            Record your first EVP session to begin professional analysis.
          </Text>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Recording')}
          >
            <Icon name="fiber-smart-record" size={20} color={colors.text.primary} />
            <Text style={styles.buttonText}>Start Recording</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Session Selector */}
      {recentSessions.length > 1 && (
        <View style={styles.sessionSelector}>
          <Text style={styles.selectorTitle}>Select Session</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.sessionList}>
              {recentSessions.map((session) => (
                <TouchableOpacity
                  key={session.id}
                  style={[
                    styles.sessionChip,
                    selectedSessionId === session.id && styles.selectedChip
                  ]}
                  onPress={() => handleSessionSelect(session.id)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      selectedSessionId === session.id && styles.selectedChipText
                    ]}
                  >
                    {session.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      )}

      <ScrollView style={styles.content}>
        {currentSession ? (
          <>
            {/* Session Information */}
            <View style={styles.sessionInfo}>
              <Text style={styles.sessionTitle}>{currentSession.name}</Text>
              
              <View style={styles.sessionMeta}>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Duration</Text>
                  <Text style={styles.metaValue}>
                    {formatTimestamp(currentSession.duration)}
                  </Text>
                </View>
                
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Quality</Text>
                  <Text style={styles.metaValue}>
                    {currentSession.sample_rate / 1000}kHz/{currentSession.bit_depth}bit
                  </Text>
                </View>
                
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Anomalies</Text>
                  <Text style={[styles.metaValue, { color: currentSession.anomaly_count > 0 ? colors.accent : colors.text.primary }]}>
                    {currentSession.anomaly_count}
                  </Text>
                </View>
              </View>

              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.secondaryButton]}
                  onPress={() => navigation.navigate('SessionDetail', { sessionId: currentSession.id })}
                >
                  <Icon name="play-arrow" size={20} color={colors.text.primary} />
                  <Text style={styles.buttonText}>Review Session</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={handleAdvancedAnalysis}
                >
                  <Icon name="analytics" size={20} color={colors.text.primary} />
                  <Text style={styles.buttonText}>Advanced Analysis</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Anomalies Section */}
            <View style={styles.anomaliesSection}>
              <Text style={styles.sectionTitle}>
                Detected Anomalies ({currentSession.anomalies?.length || 0})
              </Text>
              
              {currentSession.anomalies && currentSession.anomalies.length > 0 ? (
                currentSession.anomalies.map((anomaly, index) => (
                  <TouchableOpacity
                    key={anomaly.id || index}
                    style={styles.anomalyCard}
                    onPress={() => navigation.navigate('AnomalyDetail', { 
                      anomalyId: anomaly.id,
                      sessionId: currentSession.id 
                    })}
                  >
                    <View style={styles.anomalyHeader}>
                      <Text style={styles.anomalyType}>
                        {anomaly.type.replace('_', ' ').toUpperCase()}
                      </Text>
                      <Text style={styles.anomalyTime}>
                        {formatTimestamp(anomaly.timestamp)}
                      </Text>
                    </View>
                    
                    <Text style={styles.anomalyDescription}>
                      {anomaly.description || 'Audio anomaly detected'}
                    </Text>
                    
                    {anomaly.confidence && (
                      <View style={styles.confidenceBar}>
                        <View 
                          style={[
                            styles.confidenceFill, 
                            { width: `${Math.round(anomaly.confidence * 100)}%` }
                          ]} 
                        />
                      </View>
                    )}
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.noAnomalies}>
                  <Text style={styles.noAnomaliesText}>
                    No anomalies detected in this session.{'\n'}
                    This could indicate a quiet investigation period or optimal recording conditions.
                  </Text>
                </View>
              )}
            </View>
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Loading analysis data...</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default AnalysisScreen;