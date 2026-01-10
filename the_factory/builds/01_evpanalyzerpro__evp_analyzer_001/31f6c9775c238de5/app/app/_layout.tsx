import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Constants from 'expo-constants';
import Purchases from 'react-native-purchases';
import { Platform, Alert } from 'react-native';

import { ThemeProvider } from '../src/styles/theme';
import { ErrorBoundary } from '../src/components/ErrorBoundary';

export default function RootLayout() {
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
      } catch (error) {
        console.error('Failed to initialize app:', error);
        if (__DEV__) {
          Alert.alert(
            'Initialization Error',
            'Failed to initialize the app. Please check your configuration.',
            [{ text: 'OK' }]
          );
        }
      }
    };

    initializeApp();
  }, []);

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <ThemeProvider>
          <StatusBar style="light" backgroundColor="#0D0D0D" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: '#0D0D0D' },
              animation: 'fade'
            }}
          >
            <Stack.Screen 
              name="(tabs)" 
              options={{ 
                headerShown: false 
              }} 
            />
            <Stack.Screen
              name="recording"
              options={{
                title: 'EVP Recording Session',
                presentation: 'modal',
                headerShown: true,
                headerStyle: {
                  backgroundColor: '#1A1A1A',
                },
                headerTintColor: '#FFFFFF',
                headerTitleStyle: {
                  fontWeight: '600',
                },
              }}
            />
            <Stack.Screen
              name="paywall"
              options={{
                title: 'Upgrade to Pro',
                presentation: 'modal',
                headerShown: true,
                headerStyle: {
                  backgroundColor: '#1A1A1A',
                },
                headerTintColor: '#FFFFFF',
              }}
            />
            <Stack.Screen
              name="session-detail"
              options={{
                title: 'Session Details',
                headerShown: true,
                headerStyle: {
                  backgroundColor: '#1A1A1A',
                },
                headerTintColor: '#FFFFFF',
              }}
            />
            <Stack.Screen
              name="anomaly-detail"
              options={{
                title: 'Anomaly Analysis',
                headerShown: true,
                headerStyle: {
                  backgroundColor: '#1A1A1A',
                },
                headerTintColor: '#FFFFFF',
              }}
            />
          </Stack>
        </ThemeProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}