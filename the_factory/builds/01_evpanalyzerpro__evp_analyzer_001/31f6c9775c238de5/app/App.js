import React, { useEffect, useState } from 'react';
import { Platform, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Purchases from 'react-native-purchases';
import Constants from 'expo-constants';

import { AppNavigator } from './src/navigation/AppNavigator';
import { SubscriptionProvider } from './src/services/purchases';
import { DatabaseProvider } from './src/services/database';
import { ThemeProvider } from './src/styles/theme';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import LoadingScreen from './src/screens/LoadingScreen';

export default function App() {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize RevenueCat
        const revenueCatIosKey = Constants.expoConfig?.extra?.revenueCatIosKey;
        const revenueCatAndroidKey = Constants.expoConfig?.extra?.revenueCatAndroidKey;

        if (Platform.OS === 'ios' && revenueCatIosKey) {
          await Purchases.configure({ apiKey: revenueCatIosKey });
        } else if (Platform.OS === 'android' && revenueCatAndroidKey) {
          await Purchases.configure({ apiKey: revenueCatAndroidKey });
        } else {
          if (__DEV__) {
            console.warn('RevenueCat API keys not configured. Subscription features will be disabled.');
          }
        }

        // Enable debug logs in development
        if (__DEV__) {
          Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);
        }

        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize app:', error);
        if (__DEV__) {
          Alert.alert(
            'Initialization Error',
            'Failed to initialize the app. Please check your configuration.',
            [{ text: 'OK', onPress: () => setIsInitialized(true) }]
          );
        } else {
          setIsInitialized(true);
        }
      }
    };

    initializeApp();
  }, []);

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <ThemeProvider>
          <DatabaseProvider>
            <SubscriptionProvider>
              <StatusBar style="auto" />
              <AppNavigator />
            </SubscriptionProvider>
          </DatabaseProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}