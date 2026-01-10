import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
  Linking,
} from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Components } from '../design/tokens';
import { MemeStorage } from '../services/MemeStorage';
import { RevenueCatService } from '../services/RevenueCatService';
import Button from '../components/Button';

interface SettingsItem {
  id: string;
  title: string;
  subtitle?: string;
  type: 'navigation' | 'switch' | 'button' | 'info';
  value?: boolean | string;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
  icon?: string;
  premium?: boolean;
}

export default function SettingsScreen() {
  const [isPro, setIsPro] = useState(false);
  const [memeCount, setMemeCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Settings state
  const [notifications, setNotifications] = useState(true);
  const [autoBackup, setAutoBackup] = useState(false);
  const [highQuality, setHighQuality] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [proStatus, count] = await Promise.all([
        RevenueCatService.hasPremiumAccess(),
        MemeStorage.getMemeCount()
      ]);
      setIsPro(proStatus);
      setMemeCount(count);
    } catch (error) {
      console.error('Failed to load settings data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpgradeToPro = () => {
    Alert.alert(
      'MemeVault Pro',
      'Unlock unlimited storage, AI tagging, cloud backup, and more!',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Learn More', onPress: () => console.log('Navigate to paywall') }
      ]
    );
  };

  const handleRestorePurchases = async () => {
    try {
      const result = await RevenueCatService.restorePurchases();
      if (result.success) {
        Alert.alert('Success', 'Purchases restored successfully!');
        await loadData();
      } else {
        Alert.alert('No Purchases Found', 'No previous purchases found for this account.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to restore purchases. Please try again.');
    }
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your memes, folders, and settings. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear Data', 
          style: 'destructive',
          onPress: async () => {
            try {
              await MemeStorage.clearAllData();
              Alert.alert('Success', 'All data has been cleared.');
              await loadData();
            } catch (error) {
              Alert.alert('Error', 'Failed to clear data. Please try again.');
            }
          }
        }
      ]
    );
  };

  const handleContactSupport = () => {
    Linking.openURL('mailto:support@memevault.app?subject=MemeVault Support');
  };

  const handleRateApp = () => {
    // For now, just show an alert
    Alert.alert(
      'Rate MemeVault',
      'Thank you for using MemeVault! Please rate us on the App Store.',
      [{ text: 'OK' }]
    );
  };

  const handleShareApp = () => {
    Alert.alert(
      'Share MemeVault',
      'Tell your friends about MemeVault!',
      [{ text: 'OK' }]
    );
  };

  const settingsSections = [
    {
      title: 'Account',
      items: [
        {
          id: 'subscription',
          title: isPro ? 'MemeVault Pro' : 'Upgrade to Pro',
          subtitle: isPro 
            ? 'You have access to all premium features'
            : 'Unlimited storage, AI tagging, and more',
          type: isPro ? 'info' : 'button',
          icon: '✨',
          onPress: isPro ? undefined : handleUpgradeToPro,
        },
        {
          id: 'restore',
          title: 'Restore Purchases',
          subtitle: 'Restore your previous purchases',
          type: 'button',
          icon: '🔄',
          onPress: handleRestorePurchases,
        },
      ] as SettingsItem[],
    },
    {
      title: 'Storage',
      items: [
        {
          id: 'storage_info',
          title: `${memeCount} Memes Stored`,
          subtitle: isPro ? 'Unlimited storage' : `${Math.max(0, 100 - memeCount)} remaining (free tier)`,
          type: 'info',
          icon: '💾',
        },
        {
          id: 'auto_backup',
          title: 'Auto Backup',
          subtitle: 'Automatically backup your memes to cloud',
          type: 'switch',
          value: autoBackup,
          onToggle: setAutoBackup,
          icon: '☁️',
          premium: true,
        },
        {
          id: 'high_quality',
          title: 'High Quality Images',
          subtitle: 'Save images at full resolution',
          type: 'switch',
          value: highQuality,
          onToggle: setHighQuality,
          icon: '🖼️',
        },
      ] as SettingsItem[],
    },
    {
      title: 'Preferences',
      items: [
        {
          id: 'notifications',
          title: 'Push Notifications',
          subtitle: 'Get notified about new features',
          type: 'switch',
          value: notifications,
          onToggle: setNotifications,
          icon: '🔔',
        },
      ] as SettingsItem[],
    },
    {
      title: 'About',
      items: [
        {
          id: 'rate',
          title: 'Rate MemeVault',
          subtitle: 'Help us improve by rating the app',
          type: 'navigation',
          icon: '⭐',
          onPress: handleRateApp,
        },
        {
          id: 'share',
          title: 'Share with Friends',
          subtitle: 'Tell others about MemeVault',
          type: 'navigation',
          icon: '📤',
          onPress: handleShareApp,
        },
        {
          id: 'support',
          title: 'Contact Support',
          subtitle: 'Get help or send feedback',
          type: 'navigation',
          icon: '💬',
          onPress: handleContactSupport,
        },
        {
          id: 'version',
          title: 'Version',
          subtitle: '1.0.0 (1)',
          type: 'info',
          icon: 'ℹ️',
        },
      ] as SettingsItem[],
    },
    {
      title: 'Data',
      items: [
        {
          id: 'clear_data',
          title: 'Clear All Data',
          subtitle: 'Delete all memes, folders, and settings',
          type: 'button',
          icon: '🗑️',
          onPress: handleClearData,
        },
      ] as SettingsItem[],
    },
  ];

  const renderSettingItem = (item: SettingsItem) => {
    const isDisabled = item.premium && !isPro;

    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.settingItem, isDisabled && styles.disabledItem]}
        onPress={item.onPress}
        disabled={item.type === 'info' || item.type === 'switch' || isDisabled}
      >
        <View style={styles.settingContent}>
          <View style={styles.settingIcon}>
            <Text style={styles.settingIconText}>{item.icon}</Text>
          </View>
          <View style={styles.settingText}>
            <Text style={[styles.settingTitle, isDisabled && styles.disabledText]}>
              {item.title}
              {item.premium && !isPro && (
                <Text style={styles.premiumBadge}> PRO</Text>
              )}
            </Text>
            {item.subtitle && (
              <Text style={[styles.settingSubtitle, isDisabled && styles.disabledText]}>
                {item.subtitle}
              </Text>
            )}
          </View>
          <View style={styles.settingAction}>
            {item.type === 'switch' ? (
              <Switch
                value={item.value as boolean}
                onValueChange={item.onToggle}
                trackColor={{ false: Colors.gray300, true: Colors.primary }}
                thumbColor={Colors.white}
                disabled={isDisabled}
              />
            ) : item.type === 'navigation' ? (
              <Text style={styles.settingArrow}>›</Text>
            ) : null}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSection = (section: { title: string; items: SettingsItem[] }) => (
    <View key={section.title} style={styles.section}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <View style={styles.sectionContent}>
        {section.items.map((item, index) => (
          <View key={item.id}>
            {renderSettingItem(item)}
            {index < section.items.length - 1 && <View style={styles.itemSeparator} />}
          </View>
        ))}
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading settings...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>
          Manage your account and preferences
        </Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {settingsSections.map(renderSection)}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  loadingText: {
    fontSize: Typography.fontSize.lg,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
  },
  
  header: {
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  
  title: {
    fontSize: Typography.fontSize.xxxxl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  
  subtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  
  scrollView: {
    flex: 1,
  },
  
  scrollContent: {
    paddingBottom: 100,
  },
  
  section: {
    marginTop: Spacing.lg,
  },
  
  sectionTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    marginHorizontal: Spacing.md,
    textTransform: 'uppercase',
  },
  
  sectionContent: {
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  
  settingItem: {
    backgroundColor: Colors.surface,
  },
  
  disabledItem: {
    opacity: 0.5,
  },
  
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
  },
  
  settingIcon: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  
  settingIconText: {
    fontSize: 18,
  },
  
  settingText: {
    flex: 1,
  },
  
  settingTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  
  premiumBadge: {
    fontSize: Typography.fontSize.xs,
    color: Colors.premium,
    fontWeight: Typography.fontWeight.bold,
  },
  
  settingSubtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    lineHeight: Typography.lineHeight.sm,
  },
  
  disabledText: {
    opacity: 0.6,
  },
  
  settingAction: {
    marginLeft: Spacing.md,
  },
  
  settingArrow: {
    fontSize: Typography.fontSize.xl,
    color: Colors.textTertiary,
    fontWeight: Typography.fontWeight.bold,
  },
  
  itemSeparator: {
    height: 1,
    backgroundColor: Colors.border,
    marginLeft: 56, // Account for icon width + margin
  },
});