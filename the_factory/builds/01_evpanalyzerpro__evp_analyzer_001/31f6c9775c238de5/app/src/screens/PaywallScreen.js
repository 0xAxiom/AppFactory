// Paywall Screen for EVP Analyzer Pro subscription
// Based on Stage 04 monetization strategy and RevenueCat integration

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

import { useTheme } from '../styles/theme';
import { usePurchases, formatPrice } from '../services/purchases';

const PaywallScreen = () => {
  const navigation = useNavigation();
  const { colors, typography, spacing } = useTheme();
  const {
    offerings,
    isLoading,
    purchaseSubscription,
    restorePurchases,
    getCurrentOffering,
    hasProFeatures,
    getSubscriptionStatus
  } = usePurchases();

  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  useEffect(() => {
    // If user already has pro features, navigate back
    if (hasProFeatures()) {
      navigation.goBack();
      return;
    }

    // Select annual package by default for better value
    const currentOffering = getCurrentOffering();
    if (currentOffering?.availablePackages) {
      const annualPackage = currentOffering.availablePackages.find(
        pkg => pkg.packageType === 'ANNUAL'
      );
      const monthlyPackage = currentOffering.availablePackages.find(
        pkg => pkg.packageType === 'MONTHLY'
      );
      
      setSelectedPackage(annualPackage || monthlyPackage || currentOffering.availablePackages[0]);
    }
  }, [offerings, hasProFeatures]);

  const handlePurchase = async () => {
    if (!selectedPackage || isPurchasing) return;

    setIsPurchasing(true);

    try {
      const result = await purchaseSubscription(selectedPackage);
      
      if (result.success) {
        Alert.alert(
          'Welcome to Pro!',
          'Your subscription is now active. Enjoy unlimited professional features.',
          [
            { text: 'Get Started', onPress: () => navigation.goBack() }
          ]
        );
      } else {
        Alert.alert('Purchase Failed', result.error);
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleRestore = async () => {
    setIsRestoring(true);

    try {
      const result = await restorePurchases();
      Alert.alert(
        result.success ? 'Success' : 'No Purchases Found',
        result.message,
        [
          { 
            text: 'OK', 
            onPress: () => {
              if (result.success) {
                navigation.goBack();
              }
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to restore purchases. Please try again.');
    } finally {
      setIsRestoring(false);
    }
  };

  const currentOffering = getCurrentOffering();
  const packages = currentOffering?.availablePackages || [];
  
  const monthlyPackage = packages.find(pkg => pkg.packageType === 'MONTHLY');
  const annualPackage = packages.find(pkg => pkg.packageType === 'ANNUAL');

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.primary,
    },
    scrollView: {
      flex: 1,
    },
    content: {
      padding: spacing.lg,
    },
    header: {
      alignItems: 'center',
      marginBottom: spacing.xl,
    },
    icon: {
      fontSize: 64,
      marginBottom: spacing.md,
    },
    title: {
      ...typography.h1,
      color: colors.text.primary,
      textAlign: 'center',
      marginBottom: spacing.sm,
    },
    subtitle: {
      ...typography.body,
      color: colors.text.secondary,
      textAlign: 'center',
      lineHeight: 24,
    },
    valueProps: {
      marginBottom: spacing.xl,
    },
    valueProp: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    valuePropIcon: {
      marginRight: spacing.md,
      color: colors.accent,
    },
    valuePropText: {
      ...typography.body,
      color: colors.text.primary,
      flex: 1,
    },
    pricingContainer: {
      marginBottom: spacing.xl,
    },
    packageOption: {
      borderWidth: 2,
      borderRadius: 12,
      padding: spacing.lg,
      marginBottom: spacing.md,
      borderColor: colors.border.primary,
    },
    selectedPackage: {
      borderColor: colors.primary,
      backgroundColor: colors.primary + '10',
    },
    packageHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    packageType: {
      ...typography.h3,
      color: colors.text.primary,
    },
    savings: {
      backgroundColor: colors.accent,
      paddingHorizontal: spacing.sm,
      paddingVertical: 2,
      borderRadius: 4,
    },
    savingsText: {
      ...typography.caption,
      color: colors.text.primary,
      fontWeight: '600',
    },
    packagePrice: {
      ...typography.h2,
      color: colors.primary,
      fontWeight: '600',
    },
    packageDetails: {
      ...typography.caption,
      color: colors.text.secondary,
      marginTop: spacing.xs,
    },
    purchaseButton: {
      backgroundColor: colors.primary,
      borderRadius: 8,
      paddingVertical: spacing.lg,
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    purchaseButtonDisabled: {
      backgroundColor: colors.text.disabled,
    },
    purchaseButtonText: {
      ...typography.button,
      color: colors.text.primary,
      fontWeight: '600',
    },
    restoreButton: {
      alignItems: 'center',
      paddingVertical: spacing.md,
      marginBottom: spacing.lg,
    },
    restoreButtonText: {
      ...typography.body,
      color: colors.primary,
    },
    footer: {
      alignItems: 'center',
      paddingTop: spacing.lg,
      borderTopWidth: 1,
      borderTopColor: colors.border.primary,
    },
    legalText: {
      ...typography.caption,
      color: colors.text.tertiary,
      textAlign: 'center',
      lineHeight: 16,
      marginBottom: spacing.md,
    },
    linkText: {
      color: colors.primary,
      textDecorationLine: 'underline',
    },
    closeButton: {
      position: 'absolute',
      top: 16,
      right: 16,
      padding: spacing.sm,
      zIndex: 1,
    },
  });

  if (isLoading || !currentOffering) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[typography.body, { color: colors.text.secondary, marginTop: spacing.md }]}>
          Loading subscription options...
        </Text>
      </View>
    );
  }

  const calculateSavings = () => {
    if (!monthlyPackage || !annualPackage) return 0;
    const monthlyYearlyPrice = monthlyPackage.product.price * 12;
    const annualPrice = annualPackage.product.price;
    return Math.round(((monthlyYearlyPrice - annualPrice) / monthlyYearlyPrice) * 100);
  };

  const savings = calculateSavings();

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.closeButton} 
        onPress={() => navigation.goBack()}
        accessibilityLabel="Close paywall"
      >
        <Icon name="close" size={24} color={colors.text.primary} />
      </TouchableOpacity>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.icon}>🔬</Text>
          <Text style={styles.title}>Upgrade to EVP Pro</Text>
          <Text style={styles.subtitle}>
            Unlock professional-grade analysis tools and replace expensive hardware with superior mobile capabilities.
          </Text>
        </View>

        <View style={styles.valueProps}>
          {PRO_FEATURES.map((feature, index) => (
            <View key={index} style={styles.valueProp}>
              <Icon name={feature.icon} size={20} style={styles.valuePropIcon} />
              <Text style={styles.valuePropText}>{feature.text}</Text>
            </View>
          ))}
        </View>

        <View style={styles.pricingContainer}>
          {annualPackage && (
            <TouchableOpacity
              style={[styles.packageOption, selectedPackage?.identifier === annualPackage.identifier && styles.selectedPackage]}
              onPress={() => setSelectedPackage(annualPackage)}
            >
              <View style={styles.packageHeader}>
                <Text style={styles.packageType}>Annual Plan</Text>
                {savings > 0 && (
                  <View style={styles.savings}>
                    <Text style={styles.savingsText}>Save {savings}%</Text>
                  </View>
                )}
              </View>
              <Text style={styles.packagePrice}>
                {formatPrice(annualPackage.product.price, annualPackage.product.currencyCode)}/year
              </Text>
              <Text style={styles.packageDetails}>
                ${(annualPackage.product.price / 12).toFixed(2)}/month • Billed annually
              </Text>
            </TouchableOpacity>
          )}

          {monthlyPackage && (
            <TouchableOpacity
              style={[styles.packageOption, selectedPackage?.identifier === monthlyPackage.identifier && styles.selectedPackage]}
              onPress={() => setSelectedPackage(monthlyPackage)}
            >
              <View style={styles.packageHeader}>
                <Text style={styles.packageType}>Monthly Plan</Text>
              </View>
              <Text style={styles.packagePrice}>
                {formatPrice(monthlyPackage.product.price, monthlyPackage.product.currencyCode)}/month
              </Text>
              <Text style={styles.packageDetails}>
                Billed monthly • Cancel anytime
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={[styles.purchaseButton, (!selectedPackage || isPurchasing) && styles.purchaseButtonDisabled]}
          onPress={handlePurchase}
          disabled={!selectedPackage || isPurchasing}
        >
          {isPurchasing ? (
            <ActivityIndicator color={colors.text.primary} />
          ) : (
            <Text style={styles.purchaseButtonText}>
              Start Free Trial
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.restoreButton}
          onPress={handleRestore}
          disabled={isRestoring}
        >
          {isRestoring ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <Text style={styles.restoreButtonText}>Restore Purchases</Text>
          )}
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.legalText}>
            Start with a free 14-day trial. Subscription automatically renews unless cancelled at least 24 hours before the end of the current period. You can manage and cancel subscriptions in your device's App Store settings.
          </Text>
          
          <Text style={styles.legalText}>
            <Text style={styles.linkText}>Privacy Policy</Text> • <Text style={styles.linkText}>Terms of Service</Text>
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

// Pro features list based on Stage 04 specifications
const PRO_FEATURES = [
  {
    icon: 'schedule',
    text: 'Unlimited recording length (vs 5-minute free limit)'
  },
  {
    icon: 'analytics',
    text: 'Advanced spectral analysis with frequency visualization'
  },
  {
    icon: 'cloud-upload',
    text: 'Cloud session backup and cross-device sync'
  },
  {
    icon: 'high-quality',
    text: 'Professional export formats (WAV, FLAC) with metadata'
  },
  {
    icon: 'batch-prediction',
    text: 'Batch anomaly analysis across multiple sessions'
  },
  {
    icon: 'support',
    text: 'Priority customer support with investigation guidance'
  }
];

export default PaywallScreen;