import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { initPurchases } from '../src/lib/revenuecat';
import { database } from '../src/data/database';
import { usePremiumStore } from '../src/store/premiumStore';
import { ErrorBoundary } from '../src/utils/errorBoundary';
import { logger } from '../src/utils/logging';

export default function RootLayout() {
  const { checkPremiumStatus } = usePremiumStore();

  useEffect(() => {
    const initApp = async () => {
      try {
        // Initialize database
        await database.init();
        logger.info('Database initialized');

        // Initialize RevenueCat
        await initPurchases();
        logger.info('RevenueCat initialized');

        // Check premium status
        await checkPremiumStatus();
        logger.info('Premium status checked');
      } catch (error) {
        logger.error('App initialization failed:', error);
      }
    };

    initApp();

    // Cleanup on unmount
    return () => {
      database.close().catch((error) => {
        logger.error('Database cleanup failed:', error);
      });
    };
  }, [checkPremiumStatus]);

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <StatusBar style="auto" />
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          <Stack.Screen
            name="paywall"
            options={{
              title: 'Upgrade to Premium',
              presentation: 'modal',
            }}
          />
        </Stack>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
