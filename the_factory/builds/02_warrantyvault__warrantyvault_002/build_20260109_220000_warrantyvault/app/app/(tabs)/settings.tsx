/**
 * Settings Screen - App configuration and subscription management
 */

import React, { useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Switch,
  Alert,
  Linking,
} from 'react-native';
import { router } from 'expo-router';
import Constants from 'expo-constants';
import { useSubscription } from '../../src/contexts/SubscriptionContext';
import { usePreferences } from '../../src/contexts/PreferencesContext';
import { Button } from '../../src/components/Button';
import { colors } from '../../src/theme/colors';
import { spacing, radius, shadows } from '../../src/theme/spacing';
import { typography } from '../../src/theme/typography';

// Links (replace with actual URLs)
const PRIVACY_POLICY_URL = 'https://warrantyvault.app/privacy';
const TERMS_OF_SERVICE_URL = 'https://warrantyvault.app/terms';
const SUPPORT_EMAIL = 'support@warrantyvault.app';

function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );
}

function SettingsRow({
  label,
  value,
  onPress,
  rightElement,
}: {
  label: string;
  value?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
}) {
  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      style={styles.row}
      onPress={onPress}
      accessibilityRole={onPress ? 'button' : undefined}
    >
      <Text style={styles.rowLabel}>{label}</Text>
      {rightElement || (value && <Text style={styles.rowValue}>{value}</Text>)}
      {onPress && <Text style={styles.chevron}>›</Text>}
    </Container>
  );
}

export default function SettingsScreen() {
  const { isPremium, restorePurchases, isLoading } = useSubscription();
  const { settings, updateSettings } = usePreferences();

  const handleUpgrade = useCallback(() => {
    router.push('/paywall');
  }, []);

  const handleRestore = useCallback(async () => {
    const restored = await restorePurchases();
    if (restored) {
      Alert.alert('Success', 'Your purchases have been restored.');
    } else {
      Alert.alert('No Purchases Found', 'No previous purchases were found to restore.');
    }
  }, [restorePurchases]);

  const handleOpenLink = useCallback((url: string) => {
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Could not open link');
    });
  }, []);

  const handleContactSupport = useCallback(() => {
    Linking.openURL(`mailto:${SUPPORT_EMAIL}?subject=WarrantyVault Support`);
  }, []);

  const handleNotificationToggle = useCallback((value: boolean) => {
    updateSettings({ notificationsEnabled: value });
  }, [updateSettings]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Upgrade Banner (Free Users Only) */}
      {!isPremium && (
        <View style={styles.upgradeBanner}>
          <View style={styles.upgradeContent}>
            <Text style={styles.upgradeTitle}>Upgrade to Premium</Text>
            <Text style={styles.upgradeDescription}>
              Unlock unlimited items, cloud backup, and more
            </Text>
          </View>
          <Button
            title="Upgrade"
            onPress={handleUpgrade}
            style={styles.upgradeButton}
          />
        </View>
      )}

      {/* Subscription Section */}
      <SettingsSection title="Subscription">
        <SettingsRow
          label="Status"
          value={isPremium ? 'Premium' : 'Free'}
        />
        {isPremium && (
          <SettingsRow
            label="Manage Subscription"
            onPress={() => Linking.openURL('https://apps.apple.com/account/subscriptions')}
          />
        )}
        <TouchableOpacity style={styles.restoreButton} onPress={handleRestore} disabled={isLoading}>
          <Text style={styles.restoreText}>Restore Purchases</Text>
        </TouchableOpacity>
      </SettingsSection>

      {/* Notifications Section */}
      <SettingsSection title="Notifications">
        <SettingsRow
          label="Expiration Alerts"
          rightElement={
            <Switch
              value={settings.notificationsEnabled}
              onValueChange={handleNotificationToggle}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.surface}
            />
          }
        />
        <SettingsRow
          label="Alert Days Before"
          value={`${settings.notificationDaysBefore} days`}
        />
      </SettingsSection>

      {/* Legal Section */}
      <SettingsSection title="Legal">
        <SettingsRow
          label="Privacy Policy"
          onPress={() => handleOpenLink(PRIVACY_POLICY_URL)}
        />
        <SettingsRow
          label="Terms of Service"
          onPress={() => handleOpenLink(TERMS_OF_SERVICE_URL)}
        />
      </SettingsSection>

      {/* Support Section */}
      <SettingsSection title="Support">
        <SettingsRow
          label="Contact Support"
          onPress={handleContactSupport}
        />
      </SettingsSection>

      {/* App Info */}
      <View style={styles.appInfo}>
        <Text style={styles.appName}>WarrantyVault</Text>
        <Text style={styles.version}>
          Version {Constants.expoConfig?.version || '1.0.0'}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.screenPadding,
  },
  upgradeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.primary}10`,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  upgradeContent: {
    flex: 1,
  },
  upgradeTitle: {
    ...typography.bodyMedium,
    color: colors.primary,
    marginBottom: 2,
  },
  upgradeDescription: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  upgradeButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.caption,
    color: colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  sectionContent: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    ...shadows.card,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    minHeight: 48,
  },
  rowLabel: {
    ...typography.body,
    color: colors.text.primary,
    flex: 1,
  },
  rowValue: {
    ...typography.body,
    color: colors.text.secondary,
  },
  chevron: {
    ...typography.body,
    color: colors.text.secondary,
    marginLeft: spacing.sm,
  },
  restoreButton: {
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  restoreText: {
    ...typography.body,
    color: colors.primary,
  },
  appInfo: {
    alignItems: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
  },
  appName: {
    ...typography.headline,
    color: colors.text.primary,
  },
  version: {
    ...typography.caption,
    color: colors.text.secondary,
  },
});
