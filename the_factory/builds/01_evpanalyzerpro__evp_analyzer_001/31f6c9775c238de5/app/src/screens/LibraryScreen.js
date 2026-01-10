// Library Screen for session management and browsing
// Based on Stage 03 wireframes with search and filter capabilities

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

import { useTheme } from '../styles/theme';
import { useDatabase, SessionRepository } from '../services/database';

const LibraryScreen = () => {
  const navigation = useNavigation();
  const { colors, typography, spacing } = useTheme();
  const { database } = useDatabase();

  const [sessions, setSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedSessions, setSelectedSessions] = useState(new Set());
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [sortBy, setSortBy] = useState('date'); // date, name, anomalies

  useEffect(() => {
    loadSessions();
  }, [database]);

  useEffect(() => {
    filterSessions();
  }, [sessions, searchQuery, sortBy]);

  const loadSessions = async () => {
    if (!database) return;

    try {
      const sessionRepo = new SessionRepository(database);
      const allSessions = await sessionRepo.findAll(100, 0); // Load up to 100 sessions
      setSessions(allSessions);
    } catch (error) {
      console.error('Failed to load sessions:', error);
      Alert.alert('Error', 'Failed to load session library');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const filterSessions = () => {
    let filtered = [...sessions];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(session => 
        session.name.toLowerCase().includes(query) ||
        (session.location && session.location.toLowerCase().includes(query)) ||
        (session.notes && session.notes.toLowerCase().includes(query))
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'anomalies':
          return b.anomaly_count - a.anomaly_count;
        case 'date':
        default:
          return b.created_at - a.created_at;
      }
    });

    setFilteredSessions(filtered);
  };

  const handleSessionPress = (session) => {
    if (isSelectionMode) {
      toggleSessionSelection(session.id);
    } else {
      navigation.navigate('SessionDetail', { sessionId: session.id });
    }
  };

  const handleSessionLongPress = (session) => {
    if (!isSelectionMode) {
      setIsSelectionMode(true);
      setSelectedSessions(new Set([session.id]));
    }
  };

  const toggleSessionSelection = (sessionId) => {
    const newSelection = new Set(selectedSessions);
    if (newSelection.has(sessionId)) {
      newSelection.delete(sessionId);
    } else {
      newSelection.add(sessionId);
    }
    
    setSelectedSessions(newSelection);
    
    if (newSelection.size === 0) {
      setIsSelectionMode(false);
    }
  };

  const handleSelectAll = () => {
    if (selectedSessions.size === filteredSessions.length) {
      setSelectedSessions(new Set());
      setIsSelectionMode(false);
    } else {
      setSelectedSessions(new Set(filteredSessions.map(s => s.id)));
    }
  };

  const handleDeleteSelected = () => {
    if (selectedSessions.size === 0) return;

    Alert.alert(
      'Delete Sessions',
      `Are you sure you want to delete ${selectedSessions.size} session${selectedSessions.size === 1 ? '' : 's'}? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteSelectedSessions();
          }
        }
      ]
    );
  };

  const deleteSelectedSessions = async () => {
    if (!database) return;

    try {
      const sessionRepo = new SessionRepository(database);
      
      for (const sessionId of selectedSessions) {
        await sessionRepo.delete(sessionId);
      }
      
      setSelectedSessions(new Set());
      setIsSelectionMode(false);
      await loadSessions();
      
      Alert.alert('Success', 'Selected sessions deleted successfully');
    } catch (error) {
      console.error('Failed to delete sessions:', error);
      Alert.alert('Error', 'Failed to delete sessions');
    }
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    loadSessions();
  };

  const renderSessionItem = ({ item }) => (
    <SessionLibraryCard
      session={item}
      isSelected={selectedSessions.has(item.id)}
      isSelectionMode={isSelectionMode}
      onPress={() => handleSessionPress(item)}
      onLongPress={() => handleSessionLongPress(item)}
      colors={colors}
      typography={typography}
      spacing={spacing}
    />
  );

  const renderHeader = () => (
    <View style={styles.header}>
      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: colors.background.secondary, borderColor: colors.border.primary }]}>
        <Icon name="search" size={20} color={colors.text.tertiary} />
        <TextInput
          style={[styles.searchInput, typography.body, { color: colors.text.primary }]}
          placeholder="Search sessions, locations, notes..."
          placeholderTextColor={colors.text.tertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Icon name="clear" size={20} color={colors.text.tertiary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Sort Controls */}
      <View style={styles.controls}>
        <View style={styles.sortContainer}>
          <Text style={[styles.sortLabel, typography.caption, { color: colors.text.secondary }]}>
            Sort by:
          </Text>
          <TouchableOpacity 
            style={[styles.sortButton, sortBy === 'date' && styles.activeSortButton]}
            onPress={() => setSortBy('date')}
          >
            <Text style={[styles.sortText, sortBy === 'date' && styles.activeSortText]}>Date</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.sortButton, sortBy === 'name' && styles.activeSortButton]}
            onPress={() => setSortBy('name')}
          >
            <Text style={[styles.sortText, sortBy === 'name' && styles.activeSortText]}>Name</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.sortButton, sortBy === 'anomalies' && styles.activeSortButton]}
            onPress={() => setSortBy('anomalies')}
          >
            <Text style={[styles.sortText, sortBy === 'anomalies' && styles.activeSortText]}>Anomalies</Text>
          </TouchableOpacity>
        </View>

        {/* Session Count */}
        <Text style={[typography.caption, { color: colors.text.secondary }]}>
          {filteredSessions.length} of {sessions.length} sessions
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
      padding: spacing.md,
      backgroundColor: colors.background.primary,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.md,
      borderRadius: 8,
      borderWidth: 1,
      marginBottom: spacing.md,
    },
    searchInput: {
      flex: 1,
      marginLeft: spacing.sm,
      marginRight: spacing.sm,
    },
    controls: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    sortContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    sortLabel: {
      marginRight: spacing.sm,
    },
    sortButton: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: 4,
      marginRight: spacing.xs,
    },
    activeSortButton: {
      backgroundColor: colors.primary + '20',
    },
    sortText: {
      ...typography.caption,
      color: colors.text.secondary,
    },
    activeSortText: {
      color: colors.primary,
      fontWeight: '600',
    },
    selectionBar: {
      backgroundColor: colors.primary,
      padding: spacing.md,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    selectionText: {
      ...typography.button,
      color: colors.text.primary,
    },
    selectionActions: {
      flexDirection: 'row',
      gap: spacing.lg,
    },
    emptyContainer: {
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
    newSessionButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      borderRadius: 8,
      flexDirection: 'row',
      alignItems: 'center',
    },
    buttonText: {
      ...typography.button,
      color: colors.text.primary,
      marginLeft: spacing.sm,
    },
  });

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={[typography.body, { color: colors.text.secondary }]}>Loading session library...</Text>
      </View>
    );
  }

  if (sessions.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📚</Text>
          <Text style={styles.emptyText}>
            Your session library is empty.{'\n'}
            Start recording EVP sessions to build your investigation archive.
          </Text>
          <TouchableOpacity
            style={styles.newSessionButton}
            onPress={() => navigation.navigate('Recording')}
          >
            <Icon name="add" size={20} color={colors.text.primary} />
            <Text style={styles.buttonText}>Start First Session</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Selection mode bar */}
      {isSelectionMode && (
        <View style={styles.selectionBar}>
          <TouchableOpacity onPress={handleSelectAll}>
            <Text style={styles.selectionText}>
              {selectedSessions.size === filteredSessions.length ? 'Deselect All' : 'Select All'}
            </Text>
          </TouchableOpacity>
          
          <Text style={styles.selectionText}>
            {selectedSessions.size} selected
          </Text>
          
          <View style={styles.selectionActions}>
            <TouchableOpacity onPress={handleDeleteSelected}>
              <Icon name="delete" size={24} color={colors.text.primary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsSelectionMode(false)}>
              <Icon name="close" size={24} color={colors.text.primary} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      <FlatList
        data={filteredSessions}
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
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No sessions match your search criteria.
            </Text>
          </View>
        )}
      />
    </View>
  );
};

// Session Library Card Component
const SessionLibraryCard = ({ 
  session, 
  isSelected, 
  isSelectionMode, 
  onPress, 
  onLongPress, 
  colors, 
  typography, 
  spacing 
}) => {
  const styles = StyleSheet.create({
    card: {
      backgroundColor: colors.background.secondary,
      margin: spacing.md,
      marginTop: 0,
      borderRadius: 8,
      padding: spacing.md,
      borderWidth: 1,
      borderColor: isSelected ? colors.primary : colors.border.primary,
    },
    selectedCard: {
      backgroundColor: colors.primary + '10',
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
    selectionIndicator: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: spacing.sm,
    },
    date: {
      ...typography.caption,
      color: colors.text.secondary,
    },
    location: {
      ...typography.body,
      color: colors.text.secondary,
      marginBottom: spacing.sm,
    },
    metadata: {
      flexDirection: 'row',
      justifyContent: 'space-between',
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

  return (
    <TouchableOpacity 
      style={[styles.card, isSelected && styles.selectedCard]} 
      onPress={onPress}
      onLongPress={onLongPress}
    >
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1}>
          {session.name}
        </Text>
        
        {isSelectionMode && (
          <View style={styles.selectionIndicator}>
            {isSelected && <Icon name="check" size={16} color={colors.text.primary} />}
          </View>
        )}
        
        {!isSelectionMode && (
          <Text style={styles.date}>
            {formatDate(session.created_at)}
          </Text>
        )}
      </View>

      {session.location && (
        <Text style={styles.location} numberOfLines={1}>
          📍 {session.location}
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
            {session.sample_rate / 1000}kHz
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

export default LibraryScreen;