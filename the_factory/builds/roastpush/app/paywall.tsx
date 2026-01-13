import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors, typography, spacing } from '../src/ui/theme';
import { useSubscription } from '../src/context/SubscriptionContext';

const features = [
  {
    icon: 'skull' as const,
    title: 'Savage Burns Mode',
    description: 'Unlock the most brutal insults in our library',
  },
  {
    icon: 'infinite' as const,
    title: 'Unlimited Roasts',
    description: 'Get up to 20 roasts per day instead of 5',
  },
  {
    icon: 'albums' as const,
    title: 'All Categories',
    description: 'Dating, Fitness, Intelligence, Appearance & more',
  },
  {
    icon: 'library' as const,
    title: '2x More Content',
    description: 'Access our premium insult collection',
  },
];

export default function Paywall() {
  const { purchaseMonthly, purchaseYearly, restorePurchases } = useSubscription();
  const [isLoading, setIsLoading] = useState<'monthly' | 'yearly' | 'restore' | null>(null);

  const handlePurchase = async (type: 'monthly' | 'yearly') => {
    setIsLoading(type);
    Haptics.selectionAsync();
    try {
      const success = type === 'monthly' ? await purchaseMonthly() : await purchaseYearly();
      if (success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        router.back();
      }
    } catch {
      Alert.alert('Purchase Failed', 'Unable to complete purchase. Please try again.');
    }
    setIsLoading(null);
  };

  const handleRestore = async () => {
    setIsLoading('restore');
    Haptics.selectionAsync();
    try {
      const success = await restorePurchases();
      if (success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert('Restored!', 'Your premium access has been restored.');
        router.back();
      } else {
        Alert.alert('No Purchases Found', "We couldn't find any previous purchases.");
      }
    } catch {
      Alert.alert('Error', 'Failed to restore purchases. Please try again.');
    }
    setIsLoading(null);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => {
          Haptics.selectionAsync();
          router.back();
        }}
      >
        <Ionicons name="close" size={24} color={colors.text} />
      </TouchableOpacity>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="flame" size={48} color={colors.accent} />
          </View>
          <Text style={styles.title}>Go Premium</Text>
          <Text style={styles.subtitle}>Get absolutely destroyed</Text>
        </View>

        <View style={styles.featuresContainer}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureRow}>
              <View style={styles.featureIcon}>
                <Ionicons name={feature.icon} size={24} color={colors.accent} />
              </View>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.pricingContainer}>
          <TouchableOpacity
            style={[styles.planCard, styles.yearlyPlan]}
            onPress={() => handlePurchase('yearly')}
            disabled={isLoading !== null}
            activeOpacity={0.8}
          >
            <View style={styles.saveBadge}>
              <Text style={styles.saveText}>SAVE 48%</Text>
            </View>
            <View style={styles.planInfo}>
              <Text style={styles.planTitle}>Yearly</Text>
              <Text style={styles.planPrice}>$24.99/year</Text>
              <Text style={styles.planSubprice}>Just $2.08/month</Text>
            </View>
            {isLoading === 'yearly' && (
              <ActivityIndicator size="small" color={colors.background} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.planCard}
            onPress={() => handlePurchase('monthly')}
            disabled={isLoading !== null}
            activeOpacity={0.8}
          >
            <View style={styles.planInfo}>
              <Text style={styles.planTitleDark}>Monthly</Text>
              <Text style={styles.planPriceDark}>$3.99/month</Text>
            </View>
            {isLoading === 'monthly' && (
              <ActivityIndicator size="small" color={colors.accent} />
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.restoreButton}
          onPress={handleRestore}
          disabled={isLoading !== null}
        >
          <Text style={styles.restoreText}>
            {isLoading === 'restore' ? 'Restoring...' : 'Restore Purchases'}
          </Text>
        </TouchableOpacity>

        <View style={styles.legalContainer}>
          <Text style={styles.legalText}>
            Payment will be charged to your App Store account at confirmation of purchase.
            Subscription automatically renews unless auto-renew is turned off at least 24
            hours before the end of the current period. Your account will be charged for
            renewal within 24 hours prior to the end of the current period. You can manage
            and cancel your subscriptions by going to your account settings on the App
            Store after purchase.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  closeButton: {
    position: 'absolute',
    top: spacing.xxl + spacing.sm,
    right: spacing.lg,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl * 2,
    paddingBottom: spacing.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.h3,
    color: colors.accent,
  },
  featuresContainer: {
    marginBottom: spacing.xl,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
  },
  featureDescription: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  pricingContainer: {
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  planCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  yearlyPlan: {
    backgroundColor: colors.accent,
    position: 'relative',
    overflow: 'hidden',
  },
  saveBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#000',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderBottomLeftRadius: 8,
  },
  saveText: {
    ...typography.caption,
    color: '#fff',
    fontWeight: '700',
    fontSize: 10,
  },
  planInfo: {
    flex: 1,
  },
  planTitle: {
    ...typography.caption,
    color: colors.background,
    opacity: 0.8,
  },
  planTitleDark: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  planPrice: {
    ...typography.h2,
    color: colors.background,
  },
  planPriceDark: {
    ...typography.h3,
    color: colors.text,
  },
  planSubprice: {
    ...typography.caption,
    color: colors.background,
    opacity: 0.8,
  },
  restoreButton: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  restoreText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  legalContainer: {
    marginTop: spacing.md,
  },
  legalText: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    opacity: 0.7,
  },
});
