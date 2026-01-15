// Sessions Home Screen - Main entry point for investigations
// Based on Stage 03 wireframes: prominent New Session CTA + recent sessions list

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

import { useTheme } from '../styles/theme';
import { useDatabase, SessionRepository } from '../services/database';
import { usePurchases, FEATURES, FREE_LIMITS } from '../services/purchases';

const SessionsScreen = () => {
  const navigation = useNavigation();
  const { colors, typography, spacing } = useTheme();
  const { database } = useDatabase();
  const { shouldShowPaywall, hasProFeatures } = usePurchases();

  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadSessions();
  }, [database]);

  const loadSessions = async () => {
    if (!database) return;

    try {
      const sessionRepo = new SessionRepository(database);
      const recentSessions = await sessionRepo.getRecentSessions();
      const sessionStats = await sessionRepo.getSessionStats();
      
      setSessions(recentSessions);
      setStats(sessionStats);
    } catch (error) {
      console.error('Failed to load sessions:', error);
      Alert.alert('Error', 'Failed to load sessions');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleNewSession = () => {
    // Check if user has reached free tier limits
    if (!hasProFeatures() && sessions.length >= FREE_LIMITS.MAX_SESSIONS) {
      Alert.alert(
        'Session Limit Reached',
        `Free accounts are limited to ${FREE_LIMITS.MAX_SESSIONS} sessions. Upgrade to Pro for unlimited sessions.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Upgrade', onPress: () => navigation.navigate('Paywall') }
        ]
      );
      return;
    }

    navigation.navigate('Recording');
  };

  const handleSessionPress = (session) => {
    navigation.navigate('SessionDetail', { sessionId: session.id });
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    loadSessions();
  };

  const renderSessionItem = ({ item }) => (
    <SessionCard
      session={item}
      onPress={() => handleSessionPress(item)}
      colors={colors}
      typography={typography}
      spacing={spacing}
    />
  );

  const renderHeader = () => (
    <View style={styles.header}>
      {/* Atmospheric header with paranormal investigation theme */}
      <View style={[styles.atmosphericHeader, { backgroundColor: colors.investigation?.electromagnetic || colors.primary + '10' }]}>
        <View style={styles.headerContent}>
          <Icon name="radio" size={32} color={colors.investigation?.electromagnetic || colors.primary} style={styles.headerIcon} />
          <View style={styles.headerText}>
            <Text style={[styles.headerTitle, typography.h1, { color: colors.text.primary }]}>
              EVP Analysis Console
            </Text>
            <Text style={[styles.headerSubtitle, typography.body, { color: colors.text.secondary }]}>
              Professional Electronic Voice Phenomena Investigation
            </Text>
          </View>
        </View>
      </View>

      {/* Enhanced New Session CTA with atmospheric elements */}
      <TouchableOpacity
        style={[styles.newSessionButton, { 
          backgroundColor: colors.primary,
          shadowColor: colors.primary,
          shadowOpacity: 0.3,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 4 },
          elevation: 8,
        }]}
        onPress={handleNewSession}
        accessibilityLabel="Start new investigation session"
        accessibilityHint="Begin a new EVP recording session"
      >
        <View style={styles.recordingIndicator}>
          <View style={[styles.recordingPulse, { backgroundColor: colors.accent || colors.primary }]} />
          <Icon name="fiber-smart-record" size={28} color={colors.text.primary} style={styles.recordingIcon} />
        </View>
        <Text style={[styles.newSessionText, typography.h3, { color: colors.text.primary }]}>
          INITIATE INVESTIGATION
        </Text>
        <Text style={[styles.newSessionSubtext, typography.caption, { color: colors.text.primary + '80' }]}>
          High-fidelity EVP capture ready
        </Text>
      </TouchableOpacity>

      {/* Enhanced Investigation Statistics Dashboard */}
      {stats && (
        <View style={[styles.statsContainer, { 
          backgroundColor: colors.surface || '#1A1A1A',
          borderWidth: 1,
          borderColor: colors.investigation?.electromagnetic || colors.border || '#333',
          borderRadius: 12,
        }]}>
          <View style={styles.statsHeader}>
            <Text style={[styles.statsTitle, typography.h3, { color: colors.text.primary }]}>
              Investigation Summary
            </Text>
            <View style={[styles.statusIndicator, { backgroundColor: colors.status?.supernatural || colors.primary }]}>
              <Text style={[styles.statusText, typography.caption, { color: colors.text.primary }]}>ACTIVE</Text>
            </View>
          </View>
          <View style={styles.statsGrid}>
            <EnhancedStatItem 
              label="Sessions Conducted" 
              value={stats.total_sessions}
              icon="assessment"
              color={colors.investigation?.electromagnetic || colors.primary}
              colors={colors} 
              typography={typography} 
            />
            <EnhancedStatItem 
              label="Anomalies Detected" 
              value={stats.total_anomalies}
              icon="warning"
              color={colors.investigation?.spirit || colors.accent}
              highlight={stats.total_anomalies > 0}
              colors={colors} 
              typography={typography} 
            />
            <EnhancedStatItem 
              label="Total Recording" 
              value={formatDuration(stats.total_duration)}
              icon="schedule"
              color={colors.investigation?.thermal || colors.text.secondary}
              colors={colors} 
              typography={typography} 
            />
          </View>
        </View>
      )}

      {/* Free tier warning */}
      {!hasProFeatures() && sessions.length > FREE_LIMITS.MAX_SESSIONS * 0.8 && (
        <View style={[styles.warningBanner, { backgroundColor: colors.status.warning + '20', borderColor: colors.status.warning }]}>
          <Icon name="warning" size={16} color={colors.status.warning} />
          <Text style={[styles.warningText, typography.caption, { color: colors.status.warning }]}>
            {FREE_LIMITS.MAX_SESSIONS - sessions.length} sessions remaining. Upgrade for unlimited sessions.
          </Text>
        </View>
      )}

      {/* Recent Sessions Header */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, typography.h2, { color: colors.text.primary }]}>
          Recent Sessions
        </Text>
      </View>
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.primary,
    },
    header: {
      paddingHorizontal: spacing.md,
      paddingTop: spacing.md,
    },
    atmosphericHeader: {
      borderRadius: 12,
      padding: spacing.lg,
      marginBottom: spacing.lg,
      borderWidth: 1,
      borderColor: colors.investigation?.electromagnetic + '40' || '#333',
    },
    headerContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    headerIcon: {
      marginRight: spacing.md,
      opacity: 0.8,
    },
    headerText: {
      flex: 1,
    },
    headerTitle: {
      fontWeight: '700',
      letterSpacing: 0.5,
    },
    headerSubtitle: {
      marginTop: 4,
      opacity: 0.8,
    },
    newSessionButton: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.xl,
      paddingHorizontal: spacing.lg,
      borderRadius: 16,
      marginBottom: spacing.lg,
      position: 'relative',
      overflow: 'hidden',
    },
    recordingIndicator: {
      position: 'relative',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.sm,
    },
    recordingPulse: {
      position: 'absolute',
      width: 48,
      height: 48,
      borderRadius: 24,
      opacity: 0.3,
    },
    recordingIcon: {
      zIndex: 1,
    },
    newSessionText: {
      fontWeight: '700',
      letterSpacing: 1.5,
      textAlign: 'center',
    },
    newSessionSubtext: {
      marginTop: 4,
      textAlign: 'center',
      fontStyle: 'italic',
    },
    statsContainer: {
      padding: spacing.lg,
      marginBottom: spacing.lg,
    },
    statsHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    statsTitle: {
      fontWeight: '600',
      letterSpacing: 0.5,
    },
    statusIndicator: {
      paddingHorizontal: spacing.sm,
      paddingVertical: 4,
      borderRadius: 12,
    },
    statusText: {
      fontWeight: '600',
      fontSize: 10,
      letterSpacing: 0.5,
    },
    statsGrid: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    warningBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.md,
      borderRadius: 8,
      borderWidth: 1,
      marginBottom: spacing.lg,
    },
    warningText: {
      flex: 1,
      marginLeft: spacing.sm,
    },
    sectionHeader: {
      marginBottom: spacing.md,
    },
    sectionTitle: {},
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: spacing.xl,
    },
    emptyText: {
      textAlign: 'center',
      marginBottom: spacing.lg,
      color: colors.text.secondary,
    },
  });

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={[typography.body, { color: colors.text.secondary }]}>Loading sessions...</Text>
      </View>
    );
  }

  if (sessions.length === 0) {
    return (
      <View style={styles.container}>
        {renderHeader()}
        <View style={styles.emptyContainer}>
          <Icon name="fiber-smart-record" size={64} color={colors.text.tertiary} />
          <Text style={[styles.emptyText, typography.body]}>
            No investigation sessions yet.{'\n'}
            Start your first session to begin professional EVP analysis.
          </Text>
          <TouchableOpacity
            style={[styles.newSessionButton, { backgroundColor: colors.primary, width: 200 }]}
            onPress={handleNewSession}
          >
            <Icon name="add" size={20} color={colors.text.primary} />
            <Text style={[typography.button, { color: colors.text.primary, marginLeft: spacing.sm }]}>
              Start First Session
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={sessions}
        keyExtractor={(item) => item.id}
        renderItem={renderSessionItem}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={{ paddingBottom: spacing.lg }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      />
    </View>
  );
};

// Session Card Component
const SessionCard = ({ session, onPress, colors, typography, spacing }) => {
  const styles = StyleSheet.create({
    card: {
      backgroundColor: colors.background.secondary,
      margin: spacing.md,
      marginTop: 0,
      borderRadius: 8,
      padding: spacing.md,
      borderWidth: 1,
      borderColor: colors.border.primary,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    title: {
      flex: 1,
      ...typography.sessionTitle,
      color: colors.text.primary,
    },
    date: {
      ...typography.caption,
      color: colors.text.secondary,
    },
    metadata: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: spacing.sm,
    },
    metaItem: {
      flex: 1,
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
    anomalyCount: {
      color: colors.accent,
    },
  });

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1}>
          {session.name}
        </Text>
        <Text style={styles.date}>
          {formatDate(session.created_at)}
        </Text>
      </View>

      {session.location && (
        <Text style={[typography.body, { color: colors.text.secondary, marginBottom: spacing.sm }]}>
          {session.location}
        </Text>
      )}

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
          <Text style={[styles.metaValue, session.anomaly_count > 0 && styles.anomalyCount]}>
            {session.anomaly_count}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Enhanced Stat Item Component with professional investigation aesthetics
const EnhancedStatItem = ({ label, value, icon, color, highlight, colors, typography }) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: spacing.md,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: color + '20',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.sm,
    },
    value: {
      ...typography.h2,
      color: highlight ? color : colors.text.primary,
      fontWeight: '700',
      fontSize: 24,
    },
    label: {
      ...typography.caption,
      color: colors.text.secondary,
      textAlign: 'center',
      fontWeight: '500',
      marginTop: 4,
    },
    highlight: {
      position: 'absolute',
      top: 0,
      right: 0,
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: color,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Icon name={icon} size={20} color={color} />
        {highlight && <View style={styles.highlight} />}
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

// Legacy StatItem for backward compatibility
const StatItem = ({ label, value, colors, typography }) => {
  return (
    <EnhancedStatItem
      label={label}
      value={value}
      icon="assessment"
      color={colors.primary}
      colors={colors}
      typography={typography}
    />
  );
};

// Helper functions
const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const formatDuration = (milliseconds) => {
  if (!milliseconds) return '0:00';
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export default SessionsScreen;