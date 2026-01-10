import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { purchasesService } from '../src/services/purchases';
import { databaseService } from '../src/services/database';

// Configure notifications for timer completion
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function RootLayout() {
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Initialize database
      await databaseService.initialize();
      console.log('Database initialized');

      // Initialize RevenueCat purchases
      await purchasesService.initialize();
      console.log('Purchases service initialized');

      // Request notification permissions
      if (Platform.OS !== 'web') {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
          console.warn('Notification permissions not granted');
        }
      }
    } catch (error) {
      console.error('Failed to initialize app:', error);
    }
  };

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          gestureEnabled: true,
        }}
      >
        <Stack.Screen 
          name="index" 
          options={{ 
            title: 'Timer',
          }} 
        />
        <Stack.Screen 
          name="time-selection" 
          options={{ 
            title: 'Choose Timer',
            presentation: 'modal',
          }} 
        />
        <Stack.Screen 
          name="onboarding" 
          options={{ 
            title: 'Welcome',
            gestureEnabled: false,
          }} 
        />
        <Stack.Screen 
          name="paywall" 
          options={{ 
            title: 'Premium Features',
            presentation: 'modal',
          }} 
        />
        <Stack.Screen 
          name="settings" 
          options={{ 
            title: 'Parent Settings',
            presentation: 'modal',
          }} 
        />
      </Stack>
    </>
  );
}