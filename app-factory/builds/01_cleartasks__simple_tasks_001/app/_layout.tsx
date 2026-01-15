import { useEffect } from 'react';
import { Platform } from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Purchases, { LOG_LEVEL } from 'react-native-purchases';

export default function RootLayout() {
  useEffect(() => {
    Purchases.setLogLevel(LOG_LEVEL.VERBOSE);
    
    if (Platform.OS === 'ios') {
      Purchases.configure({ apiKey: 'appl_PLACEHOLDER_IOS_KEY' });
    } else if (Platform.OS === 'android') {
      Purchases.configure({ apiKey: 'goog_PLACEHOLDER_ANDROID_KEY' });
    }
  }, []);

  return (
    <SafeAreaProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="settings" options={{ title: "Settings" }} />
      </Stack>
    </SafeAreaProvider>
  );
}