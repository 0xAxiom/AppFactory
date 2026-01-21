import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../src/ui/components';
import { theme } from '../../src/ui/theme';

export default function OnboardingWelcome() {
  const handleGetStarted = () => {
    router.push('/onboarding/features');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome to {{ APP_NAME }}</Text>
          <Text style={styles.subtitle}>{{ ONBOARDING_WELCOME_MESSAGE }}</Text>
        </View>

        <View style={styles.hero}>
          {/* App icon or illustration would go here */}
          <View style={styles.iconPlaceholder}>
            <Text style={styles.iconText}>📱</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Button
            title="Get Started"
            onPress={handleGetStarted}
            variant="primary"
            style={styles.primaryButton}
          />

          <Button
            title="Skip for now"
            onPress={() => router.replace('/(tabs)')}
            variant="ghost"
            style={styles.skipButton}
          />
        </View>
      </View>
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
    padding: theme.spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginTop: theme.spacing.xxl,
  },
  title: {
    fontSize: theme.typography.fontSize.xxxl,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: theme.typography.lineHeight.relaxed,
  },
  hero: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.lg,
  },
  iconText: {
    fontSize: 48,
  },
  footer: {
    gap: theme.spacing.md,
  },
  primaryButton: {
    marginBottom: theme.spacing.sm,
  },
  skipButton: {
    marginTop: theme.spacing.sm,
  },
});
