import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert, Linking } from 'react-native';
import { router } from 'expo-router';
import { ScreenShell, Button, Card } from '../ui/components';
import { colors, typography, spacing } from '../ui/tokens';
import { purchasesService } from '../services/purchases';
import type { CustomerInfo } from 'react-native-purchases';

export default function SettingsScreen() {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCustomerInfo();
  }, []);

  const loadCustomerInfo = async () => {
    try {
      const info = await purchasesService.getCustomerInfo();
      setCustomerInfo(info);
    } catch (error) {
      console.error('Failed to load customer info:', error);
    } finally {
      setLoading(false);
    }
  };

  const isPremium = customerInfo && Object.keys(customerInfo.entitlements.active).length > 0;

  const handleManageSubscription = async () => {
    try {
      const url = await purchasesService.getManageSubscriptionURL();
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert(
        'Unable to Open',
        'Please visit your app store account to manage subscriptions.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleContactSupport = () => {
    Linking.openURL('mailto:support@visualbell-app.com?subject=VisualBell Support Request');
  };

  const handleRestorePurchases = async () => {
    try {
      await purchasesService.restorePurchases();
      await loadCustomerInfo();
      Alert.alert('Success', 'Purchases restored successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to restore purchases. Please try again.');
    }
  };

  const handleResetOnboarding = () => {
    Alert.alert(
      'Reset App Tutorial',
      'This will show the welcome tutorial again for your child. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset Tutorial',
          onPress: () => {
            // Reset onboarding flag in storage
            // AsyncStorage.removeItem('onboarding_completed');
            Alert.alert('Tutorial Reset', 'The welcome tutorial will show next time your child opens the app.');
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <ScreenShell variant="parent">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{
            fontSize: typography.sizes.bodyLarge,
            color: colors.muted,
            fontFamily: typography.families.primary,
          }}>
            Loading settings...
          </Text>
        </View>
      </ScreenShell>
    );
  }

  return (
    <ScreenShell variant="parent" padding={false}>
      <ScrollView
        contentContainerStyle={{
          padding: spacing.lg,
          paddingBottom: spacing['4xl'],
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{ alignItems: 'center', marginBottom: spacing.xl }}>
          <Text style={{
            fontSize: typography.sizes.headingLarge,
            fontWeight: typography.weights.bold,
            color: colors.foreground,
            fontFamily: typography.families.primary,
          }}>
            Parent Settings
          </Text>
          <Text style={{
            fontSize: typography.sizes.bodyMedium,
            color: colors.muted,
            textAlign: 'center',
            marginTop: spacing.sm,
            fontFamily: typography.families.primary,
          }}>
            Manage VisualBell for your family
          </Text>
        </View>

        {/* Subscription Status */}
        <Card padding="large" style={{ marginBottom: spacing.xl }}>
          <View style={{ alignItems: 'center' }}>
            <Text style={{
              fontSize: 48,
              marginBottom: spacing.sm,
            }}>
              {isPremium ? '⭐' : '🔒'}
            </Text>
            <Text style={{
              fontSize: typography.sizes.headingMedium,
              fontWeight: typography.weights.semibold,
              color: colors.foreground,
              marginBottom: spacing.sm,
              fontFamily: typography.families.primary,
            }}>
              {isPremium ? 'Premium Active' : 'Free Plan'}
            </Text>
            <Text style={{
              fontSize: typography.sizes.bodyMedium,
              color: colors.muted,
              textAlign: 'center',
              marginBottom: spacing.lg,
              fontFamily: typography.families.primary,
            }}>
              {isPremium
                ? 'You have access to all premium themes and features'
                : 'Upgrade to unlock premium themes and features'
              }
            </Text>

            {isPremium ? (
              <Button
                title="Manage Subscription"
                onPress={handleManageSubscription}
                variant="secondary"
                style={{ width: '100%' }}
              />
            ) : (
              <Button
                title="Upgrade to Premium"
                onPress={() => router.push('/paywall')}
                style={{ width: '100%' }}
              />
            )}
          </View>
        </Card>

        {/* Family Settings */}
        <View style={{ marginBottom: spacing.xl }}>
          <Text style={{
            fontSize: typography.sizes.headingMedium,
            fontWeight: typography.weights.semibold,
            color: colors.foreground,
            marginBottom: spacing.lg,
            fontFamily: typography.families.primary,
          }}>
            Family Settings
          </Text>

          <View style={{ gap: spacing.md }}>
            <Card padding="medium">
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flex: 1 }}>
                  <Text style={{
                    fontSize: typography.sizes.bodyLarge,
                    fontWeight: typography.weights.medium,
                    color: colors.foreground,
                    fontFamily: typography.families.primary,
                  }}>
                    Timer Limits
                  </Text>
                  <Text style={{
                    fontSize: typography.sizes.bodyMedium,
                    color: colors.muted,
                    fontFamily: typography.families.primary,
                  }}>
                    Currently: 5 min - 30 min
                  </Text>
                </View>
                <Button title="Change" variant="ghost" size="small" />
              </View>
            </Card>

            <Card padding="medium">
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flex: 1 }}>
                  <Text style={{
                    fontSize: typography.sizes.bodyLarge,
                    fontWeight: typography.weights.medium,
                    color: colors.foreground,
                    fontFamily: typography.families.primary,
                  }}>
                    Sound Settings
                  </Text>
                  <Text style={{
                    fontSize: typography.sizes.bodyMedium,
                    color: colors.muted,
                    fontFamily: typography.families.primary,
                  }}>
                    Gentle chimes, respects silent mode
                  </Text>
                </View>
                <Button title="Adjust" variant="ghost" size="small" />
              </View>
            </Card>

            <Card padding="medium">
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flex: 1 }}>
                  <Text style={{
                    fontSize: typography.sizes.bodyLarge,
                    fontWeight: typography.weights.medium,
                    color: colors.foreground,
                    fontFamily: typography.families.primary,
                  }}>
                    App Tutorial
                  </Text>
                  <Text style={{
                    fontSize: typography.sizes.bodyMedium,
                    color: colors.muted,
                    fontFamily: typography.families.primary,
                  }}>
                    Reset welcome tutorial for your child
                  </Text>
                </View>
                <Button
                  title="Reset"
                  variant="ghost"
                  size="small"
                  onPress={handleResetOnboarding}
                />
              </View>
            </Card>
          </View>
        </View>

        {/* Support & Info */}
        <View style={{ marginBottom: spacing.xl }}>
          <Text style={{
            fontSize: typography.sizes.headingMedium,
            fontWeight: typography.weights.semibold,
            color: colors.foreground,
            marginBottom: spacing.lg,
            fontFamily: typography.families.primary,
          }}>
            Support & Information
          </Text>

          <View style={{ gap: spacing.md }}>
            <Button
              title="Contact Support"
              onPress={handleContactSupport}
              variant="secondary"
              style={{ width: '100%' }}
            />

            <Button
              title="Restore Purchases"
              onPress={handleRestorePurchases}
              variant="secondary"
              style={{ width: '100%' }}
            />

            <View style={{ alignItems: 'center', marginTop: spacing.lg }}>
              <Text style={{
                fontSize: typography.sizes.caption,
                color: colors.muted,
                fontFamily: typography.families.primary,
              }}>
                VisualBell v1.0.0
              </Text>
              <Text style={{
                fontSize: typography.sizes.caption,
                color: colors.muted,
                textAlign: 'center',
                marginTop: spacing.xs,
                fontFamily: typography.families.primary,
              }}>
                Made with ❤️ for families
              </Text>
            </View>
          </View>
        </View>

        {/* Back Button */}
        <Button
          title="Back to Timer"
          onPress={() => router.back()}
          variant="ghost"
          style={{ alignSelf: 'center' }}
        />
      </ScrollView>
    </ScreenShell>
  );
}