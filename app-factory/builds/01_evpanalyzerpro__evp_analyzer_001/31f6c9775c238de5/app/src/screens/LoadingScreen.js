// Loading screen for app initialization
// Shows during RevenueCat and database setup

import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '../styles/theme';

const LoadingScreen = () => {
  const { colors, typography, spacing } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.primary,
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.lg,
    },
    logo: {
      fontSize: 48,
      marginBottom: spacing.lg,
    },
    title: {
      ...typography.h2,
      color: colors.text.primary,
      marginBottom: spacing.md,
      textAlign: 'center',
    },
    subtitle: {
      ...typography.body,
      color: colors.text.secondary,
      marginBottom: spacing.xl,
      textAlign: 'center',
    },
    loader: {
      marginBottom: spacing.lg,
    },
    status: {
      ...typography.caption,
      color: colors.text.tertiary,
      textAlign: 'center',
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>🔊</Text>
      
      <Text style={styles.title}>EVP Analyzer Pro</Text>
      
      <Text style={styles.subtitle}>
        Professional paranormal investigation toolkit
      </Text>

      <ActivityIndicator 
        size="large" 
        color={colors.primary} 
        style={styles.loader}
      />

      <Text style={styles.status}>
        Initializing professional analysis tools...
      </Text>
    </View>
  );
};

export default LoadingScreen;