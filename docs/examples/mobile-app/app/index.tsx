import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * Home Screen
 *
 * The main landing screen of the app. Shows a welcome message
 * and a button to access premium features via the paywall.
 */
export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Welcome Section */}
        <View style={styles.header}>
          <Text style={styles.title}>Welcome</Text>
          <Text style={styles.subtitle}>
            This is a minimal mobile app example from App Factory.
          </Text>
        </View>

        {/* Features Section */}
        <View style={styles.features}>
          <Text style={styles.sectionTitle}>What You Get</Text>

          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>📱</Text>
            <View style={styles.featureText}>
              <Text style={styles.featureName}>Expo Router</Text>
              <Text style={styles.featureDesc}>
                File-based navigation for React Native
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>💰</Text>
            <View style={styles.featureText}>
              <Text style={styles.featureName}>RevenueCat</Text>
              <Text style={styles.featureDesc}>
                Subscription and in-app purchase handling
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>⚡</Text>
            <View style={styles.featureText}>
              <Text style={styles.featureName}>TypeScript</Text>
              <Text style={styles.featureDesc}>Type-safe development</Text>
            </View>
          </View>
        </View>

        {/* Action Button */}
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => router.push('/paywall')}
        >
          <Text style={styles.buttonText}>Unlock Premium</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  header: {
    marginTop: 32,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    color: '#888',
    lineHeight: 26,
  },
  features: {
    marginVertical: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#252542',
    padding: 16,
    borderRadius: 12,
  },
  featureIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  featureText: {
    flex: 1,
  },
  featureName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 14,
    color: '#888',
  },
  button: {
    backgroundColor: '#6366f1',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 24,
  },
  buttonPressed: {
    backgroundColor: '#4f46e5',
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
