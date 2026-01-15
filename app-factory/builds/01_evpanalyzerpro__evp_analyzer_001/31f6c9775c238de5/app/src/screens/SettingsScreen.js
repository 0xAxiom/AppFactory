// Settings Screen for app configuration and subscription management
// Based on Stage 03 wireframes with professional settings organization

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Switch,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

import { useTheme } from '../styles/theme';
import { useDatabase, SettingsRepository } from '../services/database';
import { usePurchases, getSubscriptionDisplayText } from '../services/purchases';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const { colors, typography, spacing } = useTheme();
  const { database } = useDatabase();
  const { 
    hasProFeatures, 
    getSubscriptionStatus, 
    restorePurchases,
    isLoading 
  } = usePurchases();

  const [settings, setSettings] = useState({
    audio_quality: 'high',
    sample_rate: '44100',
    bit_depth: '16',
    anomaly_sensitivity: 0.7,
    auto_detect_enabled: true,
    noise_reduction: true,
    export_format: 'wav',
    cloud_sync_enabled: false,
    privacy_analytics_enabled: true
  });

  const [subscriptionStatus, setSubscriptionStatus] = useState(null);

  useEffect(() => {
    loadSettings();
    loadSubscriptionStatus();
  }, [database]);

  const loadSettings = async () => {
    if (!database) return;

    try {
      const settingsRepo = new SettingsRepository(database);
      const allSettings = await settingsRepo.getAll();
      setSettings({ ...settings, ...allSettings });
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const loadSubscriptionStatus = () => {
    const status = getSubscriptionStatus();
    setSubscriptionStatus(status);
  };

  const updateSetting = async (key, value) => {
    if (!database) return;

    try {
      const settingsRepo = new SettingsRepository(database);
      const type = typeof value === 'boolean' ? 'boolean' : 
                   typeof value === 'number' ? 'number' : 'string';
      
      await settingsRepo.set(key, value, type);
      setSettings(prev => ({ ...prev, [key]: value }));
    } catch (error) {
      console.error('Failed to update setting:', error);
      Alert.alert('Error', 'Failed to save setting');
    }
  };

  const handleRestorePurchases = async () => {
    try {
      const result = await restorePurchases();
      Alert.alert(
        result.success ? 'Success' : 'No Purchases Found',
        result.message
      );
      
      if (result.success) {
        loadSubscriptionStatus();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to restore purchases');
    }
  };

  const handleContactSupport = () => {
    Alert.alert(
      'Contact Support',
      'How would you like to contact our investigation support team?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Email Support', 
          onPress: () => Linking.openURL('mailto:support@evpanalyzerpro.com?subject=EVP%20Analyzer%20Pro%20Support')
        }
      ]
    );
  };

  const handlePrivacyPolicy = () => {
    Linking.openURL('https://evpanalyzerpro.com/privacy');
  };

  const handleTermsOfService = () => {
    Linking.openURL('https://evpanalyzerpro.com/terms');
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.primary,
    },
    section: {
      marginTop: spacing.lg,
    },
    sectionTitle: {
      ...typography.h3,
      color: colors.text.primary,
      marginHorizontal: spacing.lg,
      marginBottom: spacing.md,
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background.secondary,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.primary,
    },
    settingIcon: {
      width: 24,
      marginRight: spacing.md,
    },
    settingContent: {
      flex: 1,
    },
    settingTitle: {
      ...typography.body,
      color: colors.text.primary,
      marginBottom: 2,
    },
    settingDescription: {
      ...typography.caption,
      color: colors.text.secondary,
    },
    settingValue: {
      ...typography.body,
      color: colors.text.secondary,
      marginRight: spacing.sm,
    },
    subscriptionCard: {
      backgroundColor: colors.background.secondary,
      margin: spacing.lg,
      borderRadius: 8,
      padding: spacing.lg,
      borderWidth: 1,
      borderColor: hasProFeatures() ? colors.primary : colors.border.primary,
    },
    subscriptionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    subscriptionIcon: {
      marginRight: spacing.md,
    },
    subscriptionTitle: {
      ...typography.h3,
      color: colors.text.primary,
    },
    subscriptionStatus: {
      ...typography.body,
      color: hasProFeatures() ? colors.primary : colors.text.secondary,
      marginBottom: spacing.sm,
    },
    subscriptionDescription: {
      ...typography.caption,
      color: colors.text.secondary,
      marginBottom: spacing.lg,
    },
    subscriptionButtons: {
      flexDirection: 'row',
      gap: spacing.md,
    },
    button: {
      flex: 1,
      backgroundColor: colors.primary,
      paddingVertical: spacing.md,
      borderRadius: 8,
      alignItems: 'center',
    },
    secondaryButton: {
      backgroundColor: colors.background.tertiary,
      borderWidth: 1,
      borderColor: colors.border.primary,
    },
    buttonText: {
      ...typography.button,
      color: colors.text.primary,
    },
    proFeatures: {
      marginTop: spacing.md,
    },
    proFeature: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    proFeatureText: {
      ...typography.caption,
      color: colors.text.secondary,
      marginLeft: spacing.sm,
    },
    version: {
      ...typography.caption,
      color: colors.text.tertiary,
      textAlign: 'center',
      marginTop: spacing.xl,
      marginBottom: spacing.lg,
    },
  });

  const SettingToggle = ({ title, description, value, onValueChange, icon, disabled = false }) => (
    <View style={[styles.settingItem, disabled && { opacity: 0.5 }]}>
      <Icon name={icon} size={24} color={colors.text.secondary} style={styles.settingIcon} />
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {description && <Text style={styles.settingDescription}>{description}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{ false: colors.background.tertiary, true: colors.primary + '40' }}
        thumbColor={value ? colors.primary : colors.text.tertiary}
      />
    </View>
  );

  const SettingOption = ({ title, description, value, onPress, icon }) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <Icon name={icon} size={24} color={colors.text.secondary} style={styles.settingIcon} />
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {description && <Text style={styles.settingDescription}>{description}</Text>}
      </View>
      {value && <Text style={styles.settingValue}>{value}</Text>}
      <Icon name="chevron-right" size={24} color={colors.text.tertiary} />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Subscription Status */}
      <View style={styles.subscriptionCard}>
        <View style={styles.subscriptionHeader}>
          <Icon 
            name={hasProFeatures() ? "verified" : "workspace-premium"} 
            size={24} 
            color={hasProFeatures() ? colors.primary : colors.text.secondary}
            style={styles.subscriptionIcon}
          />
          <Text style={styles.subscriptionTitle}>
            {hasProFeatures() ? 'EVP Pro Active' : 'EVP Pro'}
          </Text>
        </View>
        
        <Text style={styles.subscriptionStatus}>
          {subscriptionStatus ? getSubscriptionDisplayText(subscriptionStatus) : 'No active subscription'}
        </Text>
        
        <Text style={styles.subscriptionDescription}>
          {hasProFeatures() 
            ? 'You have access to all professional investigation features.'
            : 'Upgrade to unlock unlimited recording, advanced analysis, and professional export formats.'
          }
        </Text>

        <View style={styles.subscriptionButtons}>
          {hasProFeatures() ? (
            <>
              <TouchableOpacity 
                style={[styles.button, styles.secondaryButton]}
                onPress={handleRestorePurchases}
                disabled={isLoading}
              >
                <Text style={styles.buttonText}>Restore Purchases</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.button}
                onPress={() => Linking.openURL('https://apps.apple.com/account/subscriptions')}
              >
                <Text style={styles.buttonText}>Manage Subscription</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity 
                style={[styles.button, styles.secondaryButton]}
                onPress={handleRestorePurchases}
                disabled={isLoading}
              >
                <Text style={styles.buttonText}>Restore Purchases</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.button}
                onPress={() => navigation.navigate('Paywall')}
              >
                <Text style={styles.buttonText}>Upgrade to Pro</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {hasProFeatures() && (
          <View style={styles.proFeatures}>
            <View style={styles.proFeature}>
              <Icon name="check-circle" size={16} color={colors.primary} />
              <Text style={styles.proFeatureText}>Unlimited recording length</Text>
            </View>
            <View style={styles.proFeature}>
              <Icon name="check-circle" size={16} color={colors.primary} />
              <Text style={styles.proFeatureText}>Advanced spectral analysis</Text>
            </View>
            <View style={styles.proFeature}>
              <Icon name="check-circle" size={16} color={colors.primary} />
              <Text style={styles.proFeatureText}>Professional export formats</Text>
            </View>
          </View>
        )}
      </View>

      {/* Audio Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recording Settings</Text>
        
        <SettingOption
          title="Audio Quality"
          description="Recording quality and file size"
          value={settings.audio_quality === 'high' ? 'High (44.1kHz/16-bit)' : 'Standard'}
          icon="high-quality"
          onPress={() => {
            Alert.alert(
              'Audio Quality',
              'Choose recording quality. Higher quality provides better analysis accuracy but larger file sizes.',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Standard', onPress: () => updateSetting('audio_quality', 'standard') },
                { text: 'High', onPress: () => updateSetting('audio_quality', 'high') },
              ]
            );
          }}
        />

        <SettingToggle
          title="Auto-Detect Anomalies"
          description="Automatically detect and mark audio anomalies during recording"
          value={settings.auto_detect_enabled}
          onValueChange={(value) => updateSetting('auto_detect_enabled', value)}
          icon="auto-awesome"
        />

        <SettingToggle
          title="Noise Reduction"
          description="Apply real-time noise filtering to improve analysis"
          value={settings.noise_reduction}
          onValueChange={(value) => updateSetting('noise_reduction', value)}
          icon="noise-control-off"
        />
      </View>

      {/* Export Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Export Settings</Text>
        
        <SettingOption
          title="Export Format"
          description="Default format for audio exports"
          value={hasProFeatures() ? settings.export_format.toUpperCase() : 'MP3 (Free)'}
          icon="file-download"
          onPress={() => {
            if (!hasProFeatures()) {
              Alert.alert(
                'Professional Export',
                'WAV and FLAC export formats are available with EVP Pro subscription.',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Upgrade', onPress: () => navigation.navigate('Paywall') }
                ]
              );
              return;
            }

            Alert.alert(
              'Export Format',
              'Choose default export format for professional documentation.',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'WAV', onPress: () => updateSetting('export_format', 'wav') },
                { text: 'FLAC', onPress: () => updateSetting('export_format', 'flac') },
                { text: 'MP3', onPress: () => updateSetting('export_format', 'mp3') },
              ]
            );
          }}
        />

        <SettingToggle
          title="Cloud Sync"
          description="Sync sessions across devices (Pro only)"
          value={settings.cloud_sync_enabled && hasProFeatures()}
          onValueChange={(value) => {
            if (!hasProFeatures()) {
              navigation.navigate('Paywall');
              return;
            }
            updateSetting('cloud_sync_enabled', value);
          }}
          icon="cloud-sync"
          disabled={!hasProFeatures()}
        />
      </View>

      {/* Privacy Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Privacy & Analytics</Text>
        
        <SettingToggle
          title="Analytics"
          description="Help improve the app by sharing usage data"
          value={settings.privacy_analytics_enabled}
          onValueChange={(value) => updateSetting('privacy_analytics_enabled', value)}
          icon="analytics"
        />

        <SettingOption
          title="Privacy Policy"
          description="View our privacy policy and data usage"
          icon="privacy-tip"
          onPress={handlePrivacyPolicy}
        />

        <SettingOption
          title="Terms of Service"
          description="View terms and conditions"
          icon="description"
          onPress={handleTermsOfService}
        />
      </View>

      {/* Support */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        
        <SettingOption
          title="Contact Support"
          description="Get help with investigation techniques and app usage"
          icon="support"
          onPress={handleContactSupport}
        />

        <SettingOption
          title="Rate App"
          description="Share your experience with other investigators"
          icon="star-rate"
          onPress={() => {
            // In production, this would link to App Store/Play Store
            Alert.alert('Rate EVP Analyzer Pro', 'Thank you for supporting professional paranormal investigation!');
          }}
        />
      </View>

      <Text style={styles.version}>
        EVP Analyzer Pro v1.0.0{'\n'}
        Professional paranormal investigation toolkit
      </Text>
    </ScrollView>
  );
};

export default SettingsScreen;