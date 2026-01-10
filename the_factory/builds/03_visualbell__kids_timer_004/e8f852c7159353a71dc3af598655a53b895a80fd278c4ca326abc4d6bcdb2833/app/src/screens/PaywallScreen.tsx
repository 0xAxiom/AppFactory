import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert, Linking } from 'react-native';
import { router } from 'expo-router';
import { ScreenShell, Button, Card } from '../ui/components';
import { colors, typography, spacing } from '../ui/tokens';
import { purchasesService } from '../services/purchases';
import type { Offerings, PurchasesPackage } from 'react-native-purchases';

export default function PaywallScreen() {
  const [offerings, setOfferings] = useState<Offerings | null>(null);
  const [loading, setLoading] = useState(false);
  const [restoring, setRestoring] = useState(false);

  useEffect(() => {
    loadOfferings();
  }, []);

  const loadOfferings = async () => {
    try {
      const fetchedOfferings = await purchasesService.getOfferings();
      setOfferings(fetchedOfferings);
    } catch (error) {
      console.error('Failed to load offerings:', error);
    }
  };

  const handlePurchase = async (package_: PurchasesPackage) => {
    if (loading) return;

    setLoading(true);
    try {
      const customerInfo = await purchasesService.purchasePackage(package_);
      
      if (customerInfo) {
        Alert.alert(
          'Welcome to Premium!',
          'Thank you for upgrading to VisualBell Premium. You now have access to all premium themes and features!',
          [
            {
              text: 'Start Using Premium',
              onPress: () => router.back(),
            },
          ]
        );
      }
    } catch (error: any) {
      if (error.userCancelled) {
        // User cancelled the purchase
        return;
      }
      
      Alert.alert(
        'Purchase Failed',
        'We couldn\'t process your purchase. Please try again or contact support.',
        [{ text: 'OK' }]
      );
      console.error('Purchase failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async () => {
    if (restoring) return;

    setRestoring(true);
    try {
      const customerInfo = await purchasesService.restorePurchases();
      
      if (customerInfo && Object.keys(customerInfo.entitlements.active).length > 0) {
        Alert.alert(
          'Purchases Restored!',
          'Your premium features have been restored.',
          [
            {
              text: 'Continue',
              onPress: () => router.back(),
            },
          ]
        );
      } else {
        Alert.alert(
          'No Purchases Found',
          'We couldn\'t find any previous purchases to restore.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      Alert.alert(
        'Restore Failed',
        'We couldn\'t restore your purchases. Please try again.',
        [{ text: 'OK' }]
      );
      console.error('Restore failed:', error);
    } finally {
      setRestoring(false);
    }
  };

  const openPrivacyPolicy = () => {
    // In a real app, link to your privacy policy
    Linking.openURL('https://your-website.com/privacy');
  };

  const openTermsOfService = () => {
    // In a real app, link to your terms of service
    Linking.openURL('https://your-website.com/terms');
  };

  const currentOffering = offerings?.current;
  const packages = currentOffering?.availablePackages || [];

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
        <View style={{ alignItems: 'center', marginBottom: spacing['2xl'] }}>
          <Text style={{
            fontSize: typography.sizes.headingLarge,
            fontWeight: typography.weights.bold,
            color: colors.foreground,
            textAlign: 'center',
            fontFamily: typography.families.primary,
          }}>
            Unlock VisualBell Premium
          </Text>
          <Text style={{
            fontSize: typography.sizes.bodyLarge,
            color: colors.muted,
            textAlign: 'center',
            marginTop: spacing.sm,
            fontFamily: typography.families.primary,
          }}>
            Better family routines start here
          </Text>
        </View>

        {/* Premium Features */}
        <Card padding="large" style={{ marginBottom: spacing.xl }}>
          <Text style={{
            fontSize: typography.sizes.headingMedium,
            fontWeight: typography.weights.semibold,
            color: colors.foreground,
            marginBottom: spacing.lg,
            textAlign: 'center',
            fontFamily: typography.families.primary,
          }}>
            What You Get
          </Text>

          {[
            { icon: '🎨', title: '8 Premium Themes', desc: 'Space, Ocean, Garden, and more magical timer animations' },
            { icon: '🔊', title: '15+ Completion Sounds', desc: 'Nature sounds, gentle chimes, and custom family recordings' },
            { icon: '⚡', title: 'Custom Timer Presets', desc: 'Save up to 10 routine timers for instant family use' },
            { icon: '👥', title: 'Multiple Timers', desc: 'Run 3 timers at once for complex family coordination' },
            { icon: '📊', title: 'Usage Analytics', desc: 'Weekly insights to optimize family routine effectiveness' },
            { icon: '☁️', title: 'Family Cloud Sync', desc: 'Share premium features across all family devices' },
          ].map((feature, index) => (
            <View key={index} style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: spacing.md,
            }}>
              <Text style={{ fontSize: 24, marginRight: spacing.md }}>
                {feature.icon}
              </Text>
              <View style={{ flex: 1 }}>
                <Text style={{
                  fontSize: typography.sizes.bodyLarge,
                  fontWeight: typography.weights.semibold,
                  color: colors.foreground,
                  fontFamily: typography.families.primary,
                }}>
                  {feature.title}
                </Text>
                <Text style={{
                  fontSize: typography.sizes.bodyMedium,
                  color: colors.muted,
                  fontFamily: typography.families.primary,
                }}>
                  {feature.desc}
                </Text>
              </View>
            </View>
          ))}
        </Card>

        {/* Subscription Options */}
        {packages.length > 0 && (
          <View style={{ marginBottom: spacing.xl }}>
            <Text style={{
              fontSize: typography.sizes.headingMedium,
              fontWeight: typography.weights.semibold,
              color: colors.foreground,
              marginBottom: spacing.lg,
              textAlign: 'center',
              fontFamily: typography.families.primary,
            }}>
              Choose Your Plan
            </Text>

            {packages.map((package_, index) => {
              const isAnnual = package_.identifier.includes('annual');
              const isFamily = package_.identifier.includes('family');
              
              return (
                <Card
                  key={package_.identifier}
                  variant={isAnnual ? 'floating' : 'default'}
                  padding="large"
                  style={{
                    marginBottom: spacing.md,
                    borderWidth: isAnnual ? 3 : 1,
                    borderColor: isAnnual ? colors.primary : colors.surface,
                  }}
                >
                  {isAnnual && (
                    <View style={{
                      position: 'absolute',
                      top: -10,
                      right: spacing.lg,
                      backgroundColor: colors.success,
                      paddingHorizontal: spacing.md,
                      paddingVertical: spacing.xs,
                      borderRadius: 12,
                    }}>
                      <Text style={{
                        color: 'white',
                        fontSize: typography.sizes.caption,
                        fontWeight: typography.weights.bold,
                      }}>
                        BEST VALUE
                      </Text>
                    </View>
                  )}

                  <View style={{ alignItems: 'center' }}>
                    <Text style={{
                      fontSize: typography.sizes.headingMedium,
                      fontWeight: typography.weights.bold,
                      color: colors.foreground,
                      fontFamily: typography.families.primary,
                    }}>
                      {package_.storeProduct.title}
                    </Text>
                    
                    <Text style={{
                      fontSize: typography.sizes.bodyLarge,
                      color: colors.muted,
                      textAlign: 'center',
                      marginVertical: spacing.sm,
                      fontFamily: typography.families.primary,
                    }}>
                      {package_.storeProduct.description}
                    </Text>

                    <Text style={{
                      fontSize: typography.sizes.headingLarge,
                      fontWeight: typography.weights.bold,
                      color: colors.primary,
                      marginBottom: spacing.lg,
                      fontFamily: typography.families.primary,
                    }}>
                      {package_.storeProduct.priceString}
                    </Text>

                    <Button
                      title={loading ? 'Processing...' : `Start 7-Day Free Trial`}
                      onPress={() => handlePurchase(package_)}
                      disabled={loading}
                      loading={loading}
                      size="large"
                      style={{ width: '100%' }}
                    />

                    {isFamily && (
                      <Text style={{
                        fontSize: typography.sizes.caption,
                        color: colors.muted,
                        textAlign: 'center',
                        marginTop: spacing.sm,
                        fontFamily: typography.families.primary,
                      }}>
                        Works on up to 5 family devices
                      </Text>
                    )}
                  </View>
                </Card>
              );
            })}
          </View>
        )}

        {/* Trust Signals */}
        <View style={{ alignItems: 'center', marginBottom: spacing.xl }}>
          <Text style={{
            fontSize: typography.sizes.bodyMedium,
            color: colors.muted,
            textAlign: 'center',
            marginBottom: spacing.sm,
            fontFamily: typography.families.primary,
          }}>
            ✓ 7-day free trial with full access{'\n'}
            ✓ Cancel anytime - no questions asked{'\n'}
            ✓ Family-safe guarantee - no ads or tracking{'\n'}
            ✓ Customer support designed for parents
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={{ gap: spacing.md }}>
          <Button
            title={restoring ? 'Restoring...' : 'Restore Purchases'}
            onPress={handleRestore}
            variant="secondary"
            disabled={restoring}
            loading={restoring}
          />

          <Button
            title="Maybe Later"
            onPress={() => router.back()}
            variant="ghost"
          />
        </View>

        {/* Legal Links */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginTop: spacing.xl,
          gap: spacing.lg,
        }}>
          <Button
            title="Privacy Policy"
            onPress={openPrivacyPolicy}
            variant="ghost"
            size="small"
          />
          <Button
            title="Terms of Service"
            onPress={openTermsOfService}
            variant="ghost"
            size="small"
          />
        </View>
      </ScrollView>
    </ScreenShell>
  );
}