import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

/**
 * Root Layout
 *
 * This is the root layout for the app. It wraps all screens with
 * a Stack navigator and sets up the status bar.
 */
export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1a1a2e',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          contentStyle: {
            backgroundColor: '#1a1a2e',
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: 'Home',
          }}
        />
        <Stack.Screen
          name="paywall"
          options={{
            title: 'Upgrade',
            presentation: 'modal',
          }}
        />
      </Stack>
    </>
  );
}
