import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="welcome" options={{ headerShown: false }} />
      <Stack.Screen name="features" options={{ headerShown: false }} />
      <Stack.Screen name="complete" options={{ headerShown: false }} />
    </Stack>
  );
}
