import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import * as Haptics from 'expo-haptics';
import Purchases, { PurchasesPackage } from 'react-native-purchases';
import { colors, typography, spacing, radius } from '@/constants/theme';
import { CloseIcon, CheckIcon, LockIcon, WaveformIcon, AnomalyIcon, ExportIcon } from '@/ui/icons';
import { useSubscription } from '@/stores/SubscriptionContext';

interface PricingOption {
  id: string;
  title: string;
  price: string;
  period: string;
  savings?: string;
  package?: PurchasesPackage;
}

const FEATURES = [
  {
    icon: <WaveformIcon size={24} color={colors.accent.primary} />,
    title: 'Advanced Spectrogram',
    description: 'Detailed frequency analysis with visual playback',
  },
  {
    icon: <AnomalyIcon size={24} color={colors.status.anomaly} />,
    title: 'Anomaly Detection',
    description: 'AI-powered identification of unusual audio patterns',
  },
  {
    icon: <ExportIcon size={24} color={colors.accent.primary} />,
    title: 'Export & Share',
    description: 'Save clips and share findings with investigators',
  },
];

export default function PaywallScreen() {
  const router = useRouter();
  const { restorePurchases } = useSubscription();
  const [selectedOption, setSelectedOption] = useState<string>('yearly');
  const [isLoading, setIsLoading] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [pricingOptions, setPricingOptions] = useState<PricingOption[]>([
    {
      id: 'yearly',
      title: 'Annual',
      price: '$29.99',
      period: '/year',
      savings: 'Save 50%',
    },
    {
      id: 'monthly',
      title: 'Monthly',
      price: '$4.99',
      period: '/month',
    },
  ]);

  useEffect(() => {
    loadOfferings();
  }, []);

  const loadOfferings = async () => {
    try {
      setIsLoading(true);
      const offerings = await Purchases.getOfferings();

      if (offerings.current) {
        const packages = offerings.current.availablePackages;
        const updatedOptions: PricingOption[] = [];

        packages.forEach((pkg) => {
          if (pkg.packageType === 'ANNUAL') {
            updatedOptions.push({
              id: 'yearly',
              title: 'Annual',
              price: pkg.product.priceString,
              period: '/year',
              savings: 'Save 50%',
              package: pkg,
            });
          } else if (pkg.packageType === 'MONTHLY') {
            updatedOptions.push({
              id: 'monthly',
              title: 'Monthly',
              price: pkg.product.priceString,
              period: '/month',
              package: pkg,
            });
          }
        });

        if (updatedOptions.length > 0) {
          setPricingOptions(updatedOptions);
        }
      }
    } catch (error) {
      console.error('Failed to load offerings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePurchase = async () => {
    const option = pricingOptions.find((o) => o.id === selectedOption);
    if (!option?.package) {
      Alert.alert('Error', 'Unable to process purchase. Please try again.');
      return;
    }

    try {
      setIsPurchasing(true);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      const { customerInfo } = await Purchases.purchasePackage(option.package);

      if (customerInfo.entitlements.active['evp_pro']) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert('Welcome to EVP Pro!', 'You now have access to all premium features.', [
          { text: 'Continue', onPress: () => router.back() },
        ]);
      }
    } catch (error: any) {
      if (!error.userCancelled) {
        Alert.alert('Purchase Failed', 'There was an error processing your purchase. Please try again.');
      }
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleRestore = async () => {
    setIsLoading(true);
    const restored = await restorePurchases();
    setIsLoading(false);

    if (restored) {
      Alert.alert('Purchases Restored', 'Your EVP Pro subscription has been restored.', [
        { text: 'Continue', onPress: () => router.back() },
      ]);
    } else {
      Alert.alert('No Purchases Found', "We couldn't find any previous purchases for this account.");
    }
  };

  const handleClose = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <CloseIcon size={24} color={colors.text.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.heroSection}>
          <View style={styles.badge}>
            <LockIcon size={16} color={colors.accent.primary} />
            <Text style={styles.badgeText}>EVP PRO</Text>
          </View>
          <Text style={styles.heroTitle}>Unlock Advanced Analysis</Text>
          <Text style={styles.heroSubtitle}>
            Access professional-grade tools for serious paranormal investigation
          </Text>
        </View>

        <View style={styles.featuresSection}>
          {FEATURES.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <View style={styles.featureIcon}>{feature.icon}</View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.pricingSection}>
          {pricingOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.pricingCard,
                selectedOption === option.id && styles.pricingCardSelected,
              ]}
              onPress={() => setSelectedOption(option.id)}
              activeOpacity={0.8}
            >
              <View style={styles.pricingRadio}>
                {selectedOption === option.id && (
                  <View style={styles.pricingRadioInner} />
                )}
              </View>
              <View style={styles.pricingInfo}>
                <View style={styles.pricingHeader}>
                  <Text style={styles.pricingTitle}>{option.title}</Text>
                  {option.savings && (
                    <View style={styles.savingsBadge}>
                      <Text style={styles.savingsText}>{option.savings}</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.pricingPrice}>
                  {option.price}
                  <Text style={styles.pricingPeriod}>{option.period}</Text>
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.purchaseButton}
          onPress={handlePurchase}
          disabled={isPurchasing || isLoading}
          activeOpacity={0.8}
        >
          {isPurchasing ? (
            <ActivityIndicator color={colors.text.primary} />
          ) : (
            <Text style={styles.purchaseButtonText}>Continue</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.restoreButton} onPress={handleRestore} disabled={isLoading}>
          <Text style={styles.restoreButtonText}>Restore Purchases</Text>
        </TouchableOpacity>

        <Text style={styles.legalText}>
          Payment will be charged to your Apple ID account at confirmation of purchase. Subscription automatically renews unless canceled at least 24 hours before the end of the current period. You can manage and cancel your subscriptions in your App Store account settings.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  closeButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing['3xl'],
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.accent.muted,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    marginBottom: spacing.md,
  },
  badgeText: {
    ...typography.caption1,
    color: colors.accent.primary,
    fontWeight: '700',
    letterSpacing: 1,
  },
  heroTitle: {
    ...typography.title1,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  heroSubtitle: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    maxWidth: 280,
  },
  featuresSection: {
    backgroundColor: colors.background.secondary,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.background.tertiary,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.background.tertiary,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  featureTitle: {
    ...typography.headline,
    color: colors.text.primary,
  },
  featureDescription: {
    ...typography.footnote,
    color: colors.text.secondary,
    marginTop: 2,
  },
  pricingSection: {
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  pricingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.background.tertiary,
  },
  pricingCardSelected: {
    borderColor: colors.accent.primary,
    backgroundColor: colors.accent.muted,
  },
  pricingRadio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.accent.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  pricingRadioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.accent.primary,
  },
  pricingInfo: {
    flex: 1,
  },
  pricingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  pricingTitle: {
    ...typography.headline,
    color: colors.text.primary,
  },
  savingsBadge: {
    backgroundColor: colors.accent.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  savingsText: {
    ...typography.caption2,
    color: colors.background.primary,
    fontWeight: '700',
  },
  pricingPrice: {
    ...typography.title3,
    color: colors.text.primary,
    marginTop: 2,
  },
  pricingPeriod: {
    ...typography.body,
    color: colors.text.secondary,
    fontWeight: '400',
  },
  purchaseButton: {
    backgroundColor: colors.accent.primary,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  purchaseButtonText: {
    ...typography.headline,
    color: colors.text.primary,
  },
  restoreButton: {
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  restoreButtonText: {
    ...typography.body,
    color: colors.accent.primary,
  },
  legalText: {
    ...typography.caption2,
    color: colors.text.tertiary,
    textAlign: 'center',
    lineHeight: 16,
  },
});
