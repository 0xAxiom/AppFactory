import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Constants from 'expo-constants';
import { Button, Card } from '../../src/ui/components';
import { theme } from '../../src/ui/theme';
import { usePremiumStore } from '../../src/store/premiumStore';

export default function SettingsScreen() {
  const { isPremium } = usePremiumStore();
  const appVersion = Constants.expoConfig?.version || '1.0.0';

  const handleUpgrade = () => {
    router.push('/paywall');
  };

  const handleRestorePurchases = async () => {
    const { restore } = usePremiumStore.getState();
    try {
      const success = await restore();
      if (success) {
        Alert.alert('Success', 'Purchases restored successfully!');
      } else {
        Alert.alert('No Purchases', 'No previous purchases found.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to restore purchases.');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Premium Status */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Subscription</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Status</Text>
            <Text style={[styles.value, isPremium && styles.premiumText]}>
              {isPremium ? 'Premium' : 'Free'}
            </Text>
          </View>
          {!isPremium && (
            <Button
              title="Upgrade to Premium"
              onPress={handleUpgrade}
              variant="primary"
              style={styles.upgradeButton}
            />
          )}
          <Button
            title="Restore Purchases"
            onPress={handleRestorePurchases}
            variant="ghost"
          />
        </Card>

        {/* App Info */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Version</Text>
            <Text style={styles.value}>{appVersion}</Text>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.lg,
    gap: theme.spacing.lg,
  },
  section: {
    padding: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  label: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
  },
  value: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textPrimary,
    fontWeight: '500',
  },
  premiumText: {
    color: theme.colors.primary,
  },
  upgradeButton: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
});
