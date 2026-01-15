/**
 * Root Layout - App shell with providers
 */

import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ItemsProvider } from '../src/contexts/ItemsContext';
import { SubscriptionProvider } from '../src/contexts/SubscriptionContext';
import { PreferencesProvider } from '../src/contexts/PreferencesContext';
import { requestNotificationPermissions, addNotificationResponseListener } from '../src/services/notifications';
import { colors } from '../src/theme/colors';
import { router } from 'expo-router';

export default function RootLayout() {
  // Set up notification handling
  useEffect(() => {
    // Request notification permissions on app start
    requestNotificationPermissions();

    // Handle notification taps
    const subscription = addNotificationResponseListener((response) => {
      const itemId = response.notification.request.content.data?.itemId;
      if (itemId) {
        router.push(`/item/${itemId}`);
      }
    });

    return () => subscription.remove();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <PreferencesProvider>
          <SubscriptionProvider>
            <ItemsProvider>
              <StatusBar style="dark" />
              <Stack
                screenOptions={{
                  headerStyle: {
                    backgroundColor: colors.background,
                  },
                  headerTintColor: colors.text.primary,
                  headerTitleStyle: {
                    fontWeight: '600',
                  },
                  contentStyle: {
                    backgroundColor: colors.background,
                  },
                }}
              >
                <Stack.Screen
                  name="(tabs)"
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="item/[id]"
                  options={{
                    title: 'Item Details',
                    presentation: 'card',
                  }}
                />
                <Stack.Screen
                  name="paywall"
                  options={{
                    title: 'Upgrade to Premium',
                    presentation: 'modal',
                    headerShown: false,
                  }}
                />
              </Stack>
            </ItemsProvider>
          </SubscriptionProvider>
        </PreferencesProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
