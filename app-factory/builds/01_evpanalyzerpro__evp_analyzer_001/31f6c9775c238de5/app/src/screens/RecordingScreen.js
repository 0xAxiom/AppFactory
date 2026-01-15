// Recording Screen for EVP Investigation Sessions
// Based on Stage 02 and 03 specifications with real-time waveform and anomaly detection

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
  Vibration,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';

import { useTheme } from '../styles/theme';
import { useDatabase, SessionRepository, AnomalyRepository } from '../services/database';
import { usePurchases, FREE_LIMITS, FEATURES } from '../services/purchases';
import RecordingEngine from '../audio/RecordingEngine';
import WaveformView from '../components/WaveformView';

const { width: screenWidth } = Dimensions.get('window');

const RecordingScreen = () => {
  const navigation = useNavigation();
  const { colors, typography, spacing } = useTheme();
  const { database } = useDatabase();
  const { hasProFeatures, shouldShowPaywall } = usePurchases();

  // Recording state
  const [recordingState, setRecordingState] = useState('stopped'); // stopped, recording, paused
  const [duration, setDuration] = useState(0);
  const [audioLevel, setAudioLevel] = useState(-160);
  const [anomalies, setAnomalies] = useState([]);
  const [sessionName, setSessionName] = useState('');
  const [sessionLocation, setSessionLocation] = useState('');

  // Recording engine ref
  const recordingEngine = useRef(null);
  const sessionId = useRef(null);

  useEffect(() => {
    initializeRecording();
    return () => cleanup();
  }, []);

  const initializeRecording = async () => {
    try {
      recordingEngine.current = new RecordingEngine({
        sampleRate: 44100,
        bitDepth: 16,
        channels: 1
      });

      await recordingEngine.current.initialize();

      // Set up event listeners
      recordingEngine.current.setOnStatusUpdate((status) => {
        setDuration(status.duration);
        setAudioLevel(status.metering);
      });

      recordingEngine.current.setOnAnomalyDetected((anomaly) => {
        handleAnomalyDetected(anomaly);
      });

      recordingEngine.current.setOnError((error) => {
        Alert.alert('Recording Error', error.message);
      });

      // Generate session info
      const now = new Date();
      sessionId.current = `session_${now.getTime()}`;
      setSessionName(`Session ${now.toLocaleDateString()}`);
    } catch (error) {
      console.error('Failed to initialize recording:', error);
      Alert.alert('Initialization Error', 'Failed to set up audio recording.');
    }
  };

  const handleAnomalyDetected = async (anomaly) => {
    // Add haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Add to anomalies list
    const anomalyWithId = {
      ...anomaly,
      id: `anomaly_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };

    setAnomalies(prev => [...prev, anomalyWithId]);

    console.log('Anomaly detected and logged:', anomalyWithId);
  };

  const handleStartRecording = async () => {
    // Check free tier limits
    if (!hasProFeatures() && shouldShowPaywall(FEATURES.UNLIMITED_RECORDING)) {
      Alert.alert(
        'Recording Limit',
        `Free accounts are limited to ${FREE_LIMITS.RECORDING_DURATION / (60 * 1000)} minutes. Upgrade to Pro for unlimited recording.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Upgrade', onPress: () => navigation.navigate('Paywall') }
        ]
      );
      return;
    }

    const result = await recordingEngine.current?.startRecording();
    
    if (result?.success) {
      setRecordingState('recording');
      setAnomalies([]);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } else {
      Alert.alert('Recording Failed', result?.error || 'Unknown error occurred');
    }
  };

  const handlePauseRecording = async () => {
    if (recordingState === 'recording') {
      const result = await recordingEngine.current?.pauseRecording();
      if (result?.success) {
        setRecordingState('paused');
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } else if (recordingState === 'paused') {
      const result = await recordingEngine.current?.resumeRecording();
      if (result?.success) {
        setRecordingState('recording');
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
    }
  };

  const handleStopRecording = async () => {
    const result = await recordingEngine.current?.stopRecording();
    
    if (result?.success) {
      setRecordingState('stopped');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      await saveSession(result);
    } else {
      Alert.alert('Stop Recording Failed', result?.error || 'Unknown error occurred');
    }
  };

  const saveSession = async (recordingResult) => {
    if (!database || !sessionId.current) return;

    try {
      const sessionRepo = new SessionRepository(database);
      const anomalyRepo = new AnomalyRepository(database);

      // Create session record
      const session = {
        id: sessionId.current,
        name: sessionName,
        location: sessionLocation || null,
        start_time: Date.now() - duration,
        end_time: Date.now(),
        duration: duration,
        file_path: recordingResult.uri,
        file_size: recordingResult.size,
        sample_rate: recordingResult.sampleRate,
        bit_depth: recordingResult.bitDepth,
        anomaly_count: anomalies.length,
        analysis_status: 'completed',
        notes: null,
        investigators: null
      };

      await sessionRepo.create(session);

      // Save anomalies
      for (const anomaly of anomalies) {
        const anomalyRecord = {
          id: anomaly.id,
          session_id: sessionId.current,
          timestamp: anomaly.timestamp,
          duration: null,
          type: anomaly.type,
          confidence: anomaly.confidence,
          amplitude: anomaly.amplitude,
          frequency_range: null,
          description: anomaly.description,
          user_notes: null,
          user_validated: false
        };

        await anomalyRepo.create(anomalyRecord);
      }

      Alert.alert(
        'Session Saved',
        `Recording saved with ${anomalies.length} detected anomalies.`,
        [
          { text: 'New Session', onPress: () => resetForNewSession() },
          { 
            text: 'Review Session', 
            onPress: () => {
              navigation.replace('SessionDetail', { sessionId: sessionId.current });
            }
          }
        ]
      );
    } catch (error) {
      console.error('Failed to save session:', error);
      Alert.alert('Save Failed', 'Failed to save recording session.');
    }
  };

  const resetForNewSession = () => {
    setDuration(0);
    setAudioLevel(-160);
    setAnomalies([]);
    const now = new Date();
    sessionId.current = `session_${now.getTime()}`;
    setSessionName(`Session ${now.toLocaleDateString()}`);
  };

  const cleanup = async () => {
    await recordingEngine.current?.cleanup();
  };

  const handleCancel = () => {
    if (recordingState !== 'stopped') {
      Alert.alert(
        'Cancel Recording',
        'Are you sure you want to cancel the current recording? All data will be lost.',
        [
          { text: 'Keep Recording', style: 'cancel' },
          {
            text: 'Cancel Recording',
            style: 'destructive',
            onPress: async () => {
              await recordingEngine.current?.stopRecording();
              navigation.goBack();
            }
          }
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  // Check free tier time limit
  const isNearingLimit = !hasProFeatures() && duration > FREE_LIMITS.RECORDING_DURATION * 0.8;
  const hasReachedLimit = !hasProFeatures() && duration >= FREE_LIMITS.RECORDING_DURATION;

  useEffect(() => {
    if (hasReachedLimit && recordingState === 'recording') {
      handleStopRecording();
      Alert.alert(
        'Recording Limit Reached',
        'Free accounts are limited to 5 minutes. Your session has been saved automatically.',
        [
          { text: 'OK' },
          { text: 'Upgrade to Pro', onPress: () => navigation.navigate('Paywall') }
        ]
      );
    }
  }, [hasReachedLimit, recordingState]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.primary,
    },
    header: {
      padding: spacing.lg,
      alignItems: 'center',
    },
    sessionTitle: {
      ...typography.h2,
      color: colors.text.primary,
      textAlign: 'center',
      marginBottom: spacing.sm,
    },
    duration: {
      ...typography.h1,
      color: colors.primary,
      fontFamily: 'monospace',
      marginBottom: spacing.sm,
    },
    status: {
      ...typography.body,
      color: recordingState === 'recording' ? colors.session.recording : 
             recordingState === 'paused' ? colors.session.paused : 
             colors.text.secondary,
      textAlign: 'center',
    },
    waveformContainer: {
      flex: 1,
      marginHorizontal: spacing.md,
      marginBottom: spacing.lg,
    },
    controls: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.xl,
      gap: spacing.lg,
    },
    controlButton: {
      width: 64,
      height: 64,
      borderRadius: 32,
      justifyContent: 'center',
      alignItems: 'center',
    },
    recordButton: {
      backgroundColor: colors.session.recording,
      width: 80,
      height: 80,
      borderRadius: 40,
    },
    pauseButton: {
      backgroundColor: colors.session.paused,
    },
    stopButton: {
      backgroundColor: colors.session.stopped,
    },
    cancelButton: {
      backgroundColor: colors.background.secondary,
      borderWidth: 1,
      borderColor: colors.border.primary,
    },
    anomalyCounter: {
      position: 'absolute',
      top: 60,
      right: spacing.lg,
      backgroundColor: colors.accent,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: 12,
    },
    anomalyText: {
      ...typography.caption,
      color: colors.text.primary,
      fontWeight: '600',
    },
    warningBanner: {
      backgroundColor: colors.status.warning + '20',
      borderColor: colors.status.warning,
      borderWidth: 1,
      margin: spacing.md,
      padding: spacing.md,
      borderRadius: 8,
    },
    warningText: {
      ...typography.body,
      color: colors.status.warning,
      textAlign: 'center',
    },
  });

  const formatDuration = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getStatusText = () => {
    switch (recordingState) {
      case 'recording':
        return 'Recording in progress...';
      case 'paused':
        return 'Recording paused';
      default:
        return 'Ready to record';
    }
  };

  return (
    <View style={styles.container}>
      {/* Cancel Button */}
      <TouchableOpacity
        style={{ position: 'absolute', top: 16, left: 16, padding: spacing.sm, zIndex: 1 }}
        onPress={handleCancel}
      >
        <Icon name="close" size={24} color={colors.text.primary} />
      </TouchableOpacity>

      {/* Anomaly Counter */}
      {anomalies.length > 0 && (
        <View style={styles.anomalyCounter}>
          <Text style={styles.anomalyText}>
            {anomalies.length} anomal{anomalies.length === 1 ? 'y' : 'ies'}
          </Text>
        </View>
      )}

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.sessionTitle}>{sessionName}</Text>
        <Text style={styles.duration}>{formatDuration(duration)}</Text>
        <Text style={styles.status}>{getStatusText()}</Text>
      </View>

      {/* Warning for free tier */}
      {isNearingLimit && !hasReachedLimit && (
        <View style={styles.warningBanner}>
          <Text style={styles.warningText}>
            Recording will stop automatically in {formatDuration(FREE_LIMITS.RECORDING_DURATION - duration)}. Upgrade to Pro for unlimited recording.
          </Text>
        </View>
      )}

      {/* Waveform Visualization */}
      <View style={styles.waveformContainer}>
        <WaveformView
          audioLevel={audioLevel}
          isRecording={recordingState === 'recording'}
          anomalies={anomalies}
          duration={duration}
          colors={colors}
        />
      </View>

      {/* Recording Controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.controlButton, styles.cancelButton]}
          onPress={handleCancel}
          accessibilityLabel="Cancel recording"
        >
          <Icon name="close" size={24} color={colors.text.primary} />
        </TouchableOpacity>

        {recordingState === 'stopped' ? (
          <TouchableOpacity
            style={[styles.controlButton, styles.recordButton]}
            onPress={handleStartRecording}
            accessibilityLabel="Start recording"
          >
            <Icon name="fiber-manual-record" size={32} color={colors.text.primary} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.controlButton, styles.pauseButton]}
            onPress={handlePauseRecording}
            accessibilityLabel={recordingState === 'paused' ? "Resume recording" : "Pause recording"}
          >
            <Icon 
              name={recordingState === 'paused' ? "play-arrow" : "pause"} 
              size={24} 
              color={colors.text.primary} 
            />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.controlButton, styles.stopButton]}
          onPress={handleStopRecording}
          disabled={recordingState === 'stopped'}
          accessibilityLabel="Stop recording"
        >
          <Icon name="stop" size={24} color={colors.text.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RecordingScreen;