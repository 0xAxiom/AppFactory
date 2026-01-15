import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { SettingsProvider } from '../src/context/SettingsContext';
import { SubscriptionProvider } from '../src/context/SubscriptionContext';
import { initDatabase } from '../src/services/database';
import { initNotifications, setupNotificationReceivedHandler } from '../src/services/notifications';
import { colors } from '../src/ui/theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await initDatabase();
        await initNotifications();
      } catch (e) {
        console.warn('Initialization error:', e);
      } finally {
        setIsReady(true);
        await SplashScreen.hideAsync();
      }
    }
    prepare();

    // Set up notification received handler to save roasts to history
    const cleanup = setupNotificationReceivedHandler();
    return cleanup;
  }, []);

  if (!isReady) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <SubscriptionProvider>
      <SettingsProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.background },
            animation: 'slide_from_right',
          }}
        />
      </SettingsProvider>
    </SubscriptionProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});
