import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  Linking,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PurchasesOffering, PurchasesPackage } from 'react-native-purchases';
import { getOfferings } from '../src/lib/revenuecat';
import { usePremiumStore } from '../src/store/premiumStore';
import { Button, LoadingState, ErrorState, Card } from '../src/ui/components';
import { theme } from '../src/ui/theme';
import { logger } from '../src/utils/logging';
import Constants from 'expo-constants';

export default function PaywallScreen() {
  const [offerings, setOfferings] = useState<PurchasesOffering | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    purchase,
    restore,
    isLoading: isPurchasing,
    isPremium,
  } = usePremiumStore();

  const privacyUrl =
    Constants.expoConfig?.extra?.privacyUrl ||
    process.env.EXPO_PUBLIC_PRIVACY_POLICY_URL;
  const termsUrl =
    Constants.expoConfig?.extra?.termsUrl ||
    process.env.EXPO_PUBLIC_TERMS_OF_SERVICE_URL;

  useEffect(() => {
    if (isPremium) {
      router.back();
      return;
    }

    loadOfferings();
  }, [isPremium]);

  const loadOfferings = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const fetchedOfferings = await getOfferings();

      if (!fetchedOfferings?.current) {
        setError(
          'No subscription plans available. Please check your RevenueCat configuration.'
        );
      } else {
        setOfferings(fetchedOfferings.current);
      }
    } catch (err) {
      logger.error('Failed to load offerings:', err);
      setError('Failed to load subscription plans. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePurchase = async (pkg: PurchasesPackage) => {
    try {
      const success = await purchase(pkg.identifier);
      if (success) {
        Alert.alert(
          'Welcome to Premium!',
          'Your subscription is now active. Enjoy unlimited access!',
          [{ text: 'OK', onPress: () => router.back() }]
        );
      }
    } catch (err) {
      Alert.alert('Purchase Failed', 'Something went wrong. Please try again.');
    }
  };

  const handleRestore = async () => {
    try {
      const success = await restore();
      if (success) {
        Alert.alert(
          'Purchases Restored',
          'Your subscription has been restored.'
        );
      } else {
        Alert.alert('No Purchases Found', 'No previous purchases were found.');
      }
    } catch (err) {
      Alert.alert(
        'Restore Failed',
        'Failed to restore purchases. Please try again.'
      );
    }
  };

  const openPrivacyPolicy = () => {
    if (privacyUrl) {
      Linking.openURL(privacyUrl);
    }
  };

  const openTermsOfService = () => {
    if (termsUrl) {
      Linking.openURL(termsUrl);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingState message="Loading subscription plans..." />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <ErrorState
          message={error}
          onRetry={loadOfferings}
          retryLabel="Retry"
        />
      </SafeAreaView>
    );
  }

  if (!offerings || !offerings.availablePackages.length) {
    return (
      <SafeAreaView style={styles.container}>
        <ErrorState
          title="No Plans Available"
          message="Subscription plans are not configured. Please contact support."
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Upgrade to Premium</Text>
          <Text style={styles.subtitle}>
            Unlock unlimited features and get the most out of {{ APP_NAME }}.
          </Text>
        </View>

        <View style={styles.features}>
          {/* PREMIUM_FEATURES_PLACEHOLDER */}
        </View>

        <View style={styles.packages}>
          {offerings.availablePackages.map((pkg) => (
            <Card key={pkg.identifier} style={styles.packageCard}>
              <View style={styles.packageHeader}>
                <Text style={styles.packageTitle}>
                  {pkg.storeProduct.title}
                </Text>
                <Text style={styles.packagePrice}>
                  {pkg.storeProduct.priceString}
                </Text>
              </View>

              {pkg.storeProduct.subscriptionPeriod && (
                <Text style={styles.packagePeriod}>
                  per {pkg.storeProduct.subscriptionPeriod}
                </Text>
              )}

              <Button
                title={`Subscribe ${pkg.storeProduct.priceString}`}
                onPress={() => handlePurchase(pkg)}
                loading={isPurchasing}
                style={styles.purchaseButton}
              />
            </Card>
          ))}
        </View>

        <View style={styles.footer}>
          <Button
            title="Restore Purchases"
            onPress={handleRestore}
            variant="ghost"
            loading={isPurchasing}
            style={styles.restoreButton}
          />

          <Text style={styles.disclaimer}>
            Subscriptions automatically renew unless cancelled at least 24 hours
            before the end of the current period. Cancel anytime in your device
            settings.
          </Text>

          <View style={styles.links}>
            <Button
              title="Privacy Policy"
              onPress={openPrivacyPolicy}
              variant="ghost"
              size="sm"
            />
            <Text style={styles.linkSeparator}>•</Text>
            <Button
              title="Terms of Service"
              onPress={openTermsOfService}
              variant="ghost"
              size="sm"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: theme.typography.fontSize.xxxl,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: theme.typography.lineHeight.relaxed,
  },
  features: {
    marginBottom: theme.spacing.xl,
  },
  packages: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  packageCard: {
    padding: theme.spacing.lg,
  },
  packageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  packageTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  packagePrice: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  packagePeriod: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  purchaseButton: {
    marginTop: theme.spacing.sm,
  },
  footer: {
    alignItems: 'center',
    paddingTop: theme.spacing.lg,
  },
  restoreButton: {
    marginBottom: theme.spacing.lg,
  },
  disclaimer: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textTertiary,
    textAlign: 'center',
    lineHeight: theme.typography.lineHeight.relaxed,
    marginBottom: theme.spacing.md,
  },
  links: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  linkSeparator: {
    color: theme.colors.textTertiary,
    fontSize: theme.typography.fontSize.sm,
  },
});
