/**
 * Paywall Screen - Subscription offering modal
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSubscription } from '../src/contexts/SubscriptionContext';
import { Button } from '../src/components/Button';
import { colors } from '../src/theme/colors';
import { spacing, radius, shadows } from '../src/theme/spacing';
import { typography } from '../src/theme/typography';

const TERMS_URL = 'https://warrantyvault.app/terms';
const PRIVACY_URL = 'https://warrantyvault.app/privacy';

const BENEFITS = [
  { icon: '♾️', title: 'Unlimited Items', description: 'Track all your warranties without limits' },
  { icon: '☁️', title: 'Cloud Backup', description: 'Never lose your data (coming soon)' },
  { icon: '📄', title: 'PDF Export', description: 'Export warranty documents (coming soon)' },
  { icon: '🏷️', title: 'Custom Categories', description: 'Organize items your way (coming soon)' },
];

export default function PaywallScreen() {
  const { offerings, purchase, restorePurchases, isLoading } = useSubscription();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('annual');
  const [isPurchasing, setIsPurchasing] = useState(false);

  const monthlyPackage = offerings?.availablePackages.find(p => p.identifier === '$rc_monthly');
  const annualPackage = offerings?.availablePackages.find(p => p.identifier === '$rc_annual');

  const handlePurchase = useCallback(async () => {
    const pkg = selectedPlan === 'monthly' ? monthlyPackage : annualPackage;
    if (!pkg) {
      Alert.alert('Error', 'Unable to load subscription options. Please try again later.');
      return;
    }

    setIsPurchasing(true);
    try {
      const success = await purchase(pkg);
      if (success) {
        router.back();
      }
    } finally {
      setIsPurchasing(false);
    }
  }, [selectedPlan, monthlyPackage, annualPackage, purchase]);

  const handleRestore = useCallback(async () => {
    setIsPurchasing(true);
    try {
      const restored = await restorePurchases();
      if (restored) {
        Alert.alert('Success', 'Your purchases have been restored!');
        router.back();
      } else {
        Alert.alert('No Purchases Found', 'No previous purchases were found to restore.');
      }
    } finally {
      setIsPurchasing(false);
    }
  }, [restorePurchases]);

  const handleClose = useCallback(() => {
    router.back();
  }, []);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Close Button */}
      <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
        <Text style={styles.closeButtonText}>✕</Text>
      </TouchableOpacity>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>🔐</Text>
          <Text style={styles.title}>Upgrade to Premium</Text>
          <Text style={styles.subtitle}>
            Unlock the full power of WarrantyVault
          </Text>
        </View>

        {/* Benefits */}
        <View style={styles.benefitsContainer}>
          {BENEFITS.map((benefit, index) => (
            <View key={index} style={styles.benefitRow}>
              <Text style={styles.benefitIcon}>{benefit.icon}</Text>
              <View style={styles.benefitContent}>
                <Text style={styles.benefitTitle}>{benefit.title}</Text>
                <Text style={styles.benefitDescription}>{benefit.description}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Plan Selection */}
        <View style={styles.plansContainer}>
          {/* Annual Plan */}
          <TouchableOpacity
            style={[styles.planCard, selectedPlan === 'annual' && styles.planCardSelected]}
            onPress={() => setSelectedPlan('annual')}
            accessibilityRole="radio"
            accessibilityState={{ selected: selectedPlan === 'annual' }}
          >
            <View style={styles.planBadge}>
              <Text style={styles.planBadgeText}>BEST VALUE</Text>
            </View>
            <View style={styles.planHeader}>
              <View style={[styles.planRadio, selectedPlan === 'annual' && styles.planRadioSelected]}>
                {selectedPlan === 'annual' && <View style={styles.planRadioDot} />}
              </View>
              <Text style={styles.planTitle}>Annual</Text>
            </View>
            <Text style={styles.planPrice}>
              {annualPackage?.product.priceString || '$29.99'}/year
            </Text>
            <Text style={styles.planSavings}>Save 37%</Text>
          </TouchableOpacity>

          {/* Monthly Plan */}
          <TouchableOpacity
            style={[styles.planCard, selectedPlan === 'monthly' && styles.planCardSelected]}
            onPress={() => setSelectedPlan('monthly')}
            accessibilityRole="radio"
            accessibilityState={{ selected: selectedPlan === 'monthly' }}
          >
            <View style={styles.planHeader}>
              <View style={[styles.planRadio, selectedPlan === 'monthly' && styles.planRadioSelected]}>
                {selectedPlan === 'monthly' && <View style={styles.planRadioDot} />}
              </View>
              <Text style={styles.planTitle}>Monthly</Text>
            </View>
            <Text style={styles.planPrice}>
              {monthlyPackage?.product.priceString || '$3.99'}/month
            </Text>
          </TouchableOpacity>
        </View>

        {/* CTA Button */}
        <View style={styles.ctaContainer}>
          <Button
            title={isPurchasing ? 'Processing...' : 'Subscribe Now'}
            onPress={handlePurchase}
            loading={isPurchasing}
            fullWidth
          />
        </View>

        {/* Restore & Legal */}
        <View style={styles.footer}>
          <TouchableOpacity onPress={handleRestore} disabled={isPurchasing}>
            <Text style={styles.restoreText}>Restore Purchases</Text>
          </TouchableOpacity>

          <View style={styles.legalLinks}>
            <TouchableOpacity onPress={() => Linking.openURL(TERMS_URL)}>
              <Text style={styles.legalText}>Terms of Service</Text>
            </TouchableOpacity>
            <Text style={styles.legalDivider}>•</Text>
            <TouchableOpacity onPress={() => Linking.openURL(PRIVACY_URL)}>
              <Text style={styles.legalText}>Privacy Policy</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.disclaimer}>
            Subscription automatically renews unless canceled at least 24 hours before the end of the current period.
            You can manage and cancel your subscription anytime in your App Store settings.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  closeButtonText: {
    fontSize: 18,
    color: colors.text.secondary,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.screenPadding,
    paddingTop: spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logo: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  title: {
    ...typography.title,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  benefitsContainer: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    ...shadows.card,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  benefitIcon: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    ...typography.bodyMedium,
    color: colors.text.primary,
  },
  benefitDescription: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  plansContainer: {
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  planCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 2,
    borderColor: colors.border,
    ...shadows.card,
  },
  planCardSelected: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}05`,
  },
  planBadge: {
    position: 'absolute',
    top: -10,
    right: 12,
    backgroundColor: colors.secondary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  planBadgeText: {
    ...typography.small,
    color: colors.text.inverse,
    fontWeight: '700',
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  planRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
    marginRight: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  planRadioSelected: {
    borderColor: colors.primary,
  },
  planRadioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  planTitle: {
    ...typography.bodyMedium,
    color: colors.text.primary,
  },
  planPrice: {
    ...typography.headline,
    color: colors.text.primary,
    marginLeft: 28,
  },
  planSavings: {
    ...typography.caption,
    color: colors.secondary,
    marginLeft: 28,
    fontWeight: '600',
  },
  ctaContainer: {
    marginBottom: spacing.lg,
  },
  footer: {
    alignItems: 'center',
  },
  restoreText: {
    ...typography.body,
    color: colors.primary,
    marginBottom: spacing.md,
  },
  legalLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  legalText: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  legalDivider: {
    ...typography.caption,
    color: colors.text.secondary,
    marginHorizontal: spacing.sm,
  },
  disclaimer: {
    ...typography.small,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});
