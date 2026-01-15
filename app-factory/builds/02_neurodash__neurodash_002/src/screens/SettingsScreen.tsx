import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Modal } from 'react-native';
import { List, Switch, Button, Card, Divider, Chip } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserPreferences } from '../types';
import { useSubscription } from '../context/SubscriptionContext';
import PaywallScreen from './PaywallScreen';

const defaultPreferences: UserPreferences = {
  voiceEnabled: true,
  hapticsEnabled: true,
  reminderFrequency: 'medium',
  focusSessionDefaults: {
    low: 15,
    medium: 25,
    high: 45,
  },
  accessibilityPreferences: {
    highContrast: false,
    reducedMotion: false,
    voiceOverEnabled: false,
  },
};

export default function SettingsScreen() {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const savedPrefs = await AsyncStorage.getItem('user_preferences');
      if (savedPrefs) {
        setPreferences({ ...defaultPreferences, ...JSON.parse(savedPrefs) });
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const savePreferences = async (newPreferences: UserPreferences) => {
    try {
      await AsyncStorage.setItem('user_preferences', JSON.stringify(newPreferences));
      setPreferences(newPreferences);
    } catch (error) {
      console.error('Error saving preferences:', error);
      Alert.alert('Error', 'Failed to save preferences. Please try again.');
    }
  };

  const updatePreference = <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    const newPreferences = { ...preferences, [key]: value };
    savePreferences(newPreferences);
  };

  const updateAccessibilityPreference = <K extends keyof UserPreferences['accessibilityPreferences']>(
    key: K,
    value: UserPreferences['accessibilityPreferences'][K]
  ) => {
    const newPreferences = {
      ...preferences,
      accessibilityPreferences: {
        ...preferences.accessibilityPreferences,
        [key]: value,
      },
    };
    savePreferences(newPreferences);
  };

  const clearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your energy history, tasks, and preferences. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All Data',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.multiRemove([
                'energy_history',
                'tasks',
                'user_preferences',
                'focus_sessions',
              ]);
              Alert.alert('Success', 'All data has been cleared. Please restart the app.');
            } catch (error) {
              console.error('Error clearing data:', error);
              Alert.alert('Error', 'Failed to clear data. Please try again.');
            }
          },
        },
      ]
    );
  };

  const exportData = async () => {
    try {
      const keys = ['energy_history', 'tasks', 'user_preferences'];
      const data = await AsyncStorage.multiGet(keys);
      const exportObject = Object.fromEntries(data.filter(([, value]) => value !== null));
      
      // In a real app, you'd share this data or save to device
      console.log('Export data:', JSON.stringify(exportObject, null, 2));
      Alert.alert(
        'Data Export', 
        'Your data has been logged to the console. In a production app, this would be saved to your device or cloud storage.'
      );
    } catch (error) {
      console.error('Error exporting data:', error);
      Alert.alert('Error', 'Failed to export data. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading settings...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Card style={styles.section}>
        <List.Section>
          <List.Subheader style={styles.sectionHeader}>App Behavior</List.Subheader>
          
          <List.Item
            title="Voice Input"
            description="Enable voice commands and audio input for energy check-ins"
            left={props => <List.Icon {...props} icon="microphone" color="#60a5fa" />}
            right={() => (
              <Switch
                value={preferences.voiceEnabled}
                onValueChange={(value) => updatePreference('voiceEnabled', value)}
                color="#60a5fa"
              />
            )}
            titleStyle={styles.listTitle}
            descriptionStyle={styles.listDescription}
          />
          
          <List.Item
            title="Haptic Feedback"
            description="Vibration feedback for interactions and confirmations"
            left={props => <List.Icon {...props} icon="vibrate" color="#10b981" />}
            right={() => (
              <Switch
                value={preferences.hapticsEnabled}
                onValueChange={(value) => updatePreference('hapticsEnabled', value)}
                color="#60a5fa"
              />
            )}
            titleStyle={styles.listTitle}
            descriptionStyle={styles.listDescription}
          />
        </List.Section>
      </Card>

      <Card style={styles.section}>
        <List.Section>
          <List.Subheader style={styles.sectionHeader}>Accessibility</List.Subheader>
          
          <List.Item
            title="High Contrast"
            description="Increase contrast for better visibility"
            left={props => <List.Icon {...props} icon="contrast" color="#f59e0b" />}
            right={() => (
              <Switch
                value={preferences.accessibilityPreferences.highContrast}
                onValueChange={(value) => updateAccessibilityPreference('highContrast', value)}
                color="#60a5fa"
              />
            )}
            titleStyle={styles.listTitle}
            descriptionStyle={styles.listDescription}
          />
          
          <List.Item
            title="Reduced Motion"
            description="Minimize animations and transitions"
            left={props => <List.Icon {...props} icon="motion-pause" color="#a78bfa" />}
            right={() => (
              <Switch
                value={preferences.accessibilityPreferences.reducedMotion}
                onValueChange={(value) => updateAccessibilityPreference('reducedMotion', value)}
                color="#60a5fa"
              />
            )}
            titleStyle={styles.listTitle}
            descriptionStyle={styles.listDescription}
          />
        </List.Section>
      </Card>

      <Card style={styles.section}>
        <List.Section>
          <List.Subheader style={styles.sectionHeader}>Focus Session Defaults</List.Subheader>
          
          <View style={styles.focusDefaults}>
            <Text style={styles.focusDefaultsTitle}>Default session lengths by energy level:</Text>
            
            <View style={styles.focusDefaultItem}>
              <MaterialCommunityIcons name="battery-low" size={20} color="#3b82f6" />
              <Text style={styles.focusDefaultLabel}>Low Energy:</Text>
              <Text style={styles.focusDefaultValue}>{preferences.focusSessionDefaults.low} minutes</Text>
            </View>
            
            <View style={styles.focusDefaultItem}>
              <MaterialCommunityIcons name="battery-medium" size={20} color="#f59e0b" />
              <Text style={styles.focusDefaultLabel}>Medium Energy:</Text>
              <Text style={styles.focusDefaultValue}>{preferences.focusSessionDefaults.medium} minutes</Text>
            </View>
            
            <View style={styles.focusDefaultItem}>
              <MaterialCommunityIcons name="battery-high" size={20} color="#10b981" />
              <Text style={styles.focusDefaultLabel}>High Energy:</Text>
              <Text style={styles.focusDefaultValue}>{preferences.focusSessionDefaults.high} minutes</Text>
            </View>
            
            <Text style={styles.focusDefaultsNote}>
              These are suggestions - you can always adjust session length when starting a focus session.
            </Text>
          </View>
        </List.Section>
      </Card>

      <Card style={styles.section}>
        <List.Section>
          <List.Subheader style={styles.sectionHeader}>Data & Privacy</List.Subheader>
          
          <List.Item
            title="Export Data"
            description="Download your energy history and tasks"
            left={props => <List.Icon {...props} icon="download" color="#60a5fa" />}
            onPress={exportData}
            titleStyle={styles.listTitle}
            descriptionStyle={styles.listDescription}
          />
          
          <Divider style={styles.divider} />
          
          <List.Item
            title="Clear All Data"
            description="Permanently delete all app data"
            left={props => <List.Icon {...props} icon="delete" color="#ef4444" />}
            onPress={clearAllData}
            titleStyle={[styles.listTitle, { color: '#ef4444' }]}
            descriptionStyle={styles.listDescription}
          />
        </List.Section>
      </Card>

      <Card style={styles.section}>
        <View style={styles.aboutSection}>
          <Text style={styles.aboutTitle}>About NeuroDash</Text>
          <Text style={styles.aboutText}>
            NeuroDash is designed specifically for neurodivergent minds, adapting to your natural energy patterns 
            instead of forcing rigid productivity systems.
          </Text>
          
          <View style={styles.aboutDetails}>
            <Text style={styles.aboutDetailItem}>Version 1.0.0</Text>
            <Text style={styles.aboutDetailItem}>Built with React Native & Expo</Text>
            <Text style={styles.aboutDetailItem}>Created by App Factory</Text>
          </View>
          
          <Text style={styles.aboutNote}>
            Your data stays on your device. We don't collect or share personal information.
          </Text>
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
    padding: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 50,
  },
  section: {
    backgroundColor: '#1f2937',
    marginBottom: 16,
  },
  sectionHeader: {
    color: '#60a5fa',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  listTitle: {
    color: '#e5e5e5',
    fontSize: 16,
    fontWeight: '500',
  },
  listDescription: {
    color: '#9ca3af',
    fontSize: 14,
    lineHeight: 18,
  },
  divider: {
    backgroundColor: '#374151',
    marginVertical: 8,
  },
  focusDefaults: {
    padding: 16,
    gap: 12,
  },
  focusDefaultsTitle: {
    color: '#e5e5e5',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  focusDefaultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 4,
  },
  focusDefaultLabel: {
    color: '#d1d5db',
    fontSize: 14,
    flex: 1,
  },
  focusDefaultValue: {
    color: '#e5e5e5',
    fontSize: 14,
    fontWeight: '500',
  },
  focusDefaultsNote: {
    color: '#9ca3af',
    fontSize: 12,
    fontStyle: 'italic',
    lineHeight: 16,
    marginTop: 8,
  },
  aboutSection: {
    padding: 20,
    gap: 16,
  },
  aboutTitle: {
    color: '#e5e5e5',
    fontSize: 18,
    fontWeight: '600',
  },
  aboutText: {
    color: '#d1d5db',
    fontSize: 14,
    lineHeight: 20,
  },
  aboutDetails: {
    gap: 4,
  },
  aboutDetailItem: {
    color: '#9ca3af',
    fontSize: 12,
  },
  aboutNote: {
    color: '#10b981',
    fontSize: 12,
    fontWeight: '500',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
  },
});