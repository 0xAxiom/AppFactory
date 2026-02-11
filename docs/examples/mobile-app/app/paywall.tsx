import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * Paywall Screen
 *
 * Displays subscription options using RevenueCat.
 * This is a placeholder implementation - configure RevenueCat
 * with your API key for real purchases.
 */
export default function PaywallScreen() {
  const router = useRouter();

  const handlePurchase = async (plan: string) => {
    // In a real app, this would call RevenueCat
    // See src/services/purchases.ts for the implementation
    console.log(`Purchase ${plan} plan`);
    alert(
      `This is a demo. In production, this would initiate a ${plan} subscription via RevenueCat.`
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.emoji}>✨</Text>
          <Text style={styles.title}>Unlock Premium</Text>
          <Text style={styles.subtitle}>
            Get access to all features with a premium subscription
          </Text>
        </View>

        {/* Benefits */}
        <View style={styles.benefits}>
          <View style={styles.benefit}>
            <Text style={styles.checkmark}>✓</Text>
            <Text style={styles.benefitText}>
              Unlimited access to all features
            </Text>
          </View>
          <View style={styles.benefit}>
            <Text style={styles.checkmark}>✓</Text>
            <Text style={styles.benefitText}>Remove all advertisements</Text>
          </View>
          <View style={styles.benefit}>
            <Text style={styles.checkmark}>✓</Text>
            <Text style={styles.benefitText}>Priority customer support</Text>
          </View>
          <View style={styles.benefit}>
            <Text style={styles.checkmark}>✓</Text>
            <Text style={styles.benefitText}>Sync across all devices</Text>
          </View>
        </View>

        {/* Plans */}
        <View style={styles.plans}>
          {/* Monthly Plan */}
          <Pressable
            style={({ pressed }) => [
              styles.planCard,
              pressed && styles.planPressed,
            ]}
            onPress={() => handlePurchase('monthly')}
          >
            <Text style={styles.planName}>Monthly</Text>
            <Text style={styles.planPrice}>$4.99</Text>
            <Text style={styles.planPeriod}>per month</Text>
          </Pressable>

          {/* Yearly Plan */}
          <Pressable
            style={({ pressed }) => [
              styles.planCard,
              styles.planCardFeatured,
              pressed && styles.planPressed,
            ]}
            onPress={() => handlePurchase('yearly')}
          >
            <View style={styles.saveBadge}>
              <Text style={styles.saveBadgeText}>SAVE 50%</Text>
            </View>
            <Text style={styles.planName}>Yearly</Text>
            <Text style={styles.planPrice}>$29.99</Text>
            <Text style={styles.planPeriod}>per year</Text>
          </Pressable>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Cancel anytime. Subscription renews automatically.
          </Text>
          <Pressable onPress={() => router.back()}>
            <Text style={styles.link}>Maybe Later</Text>
          </Pressable>
        </View>
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
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    lineHeight: 24,
  },
  benefits: {
    marginBottom: 32,
  },
  benefit: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkmark: {
    fontSize: 20,
    color: '#22c55e',
    marginRight: 12,
    fontWeight: 'bold',
  },
  benefitText: {
    fontSize: 16,
    color: '#fff',
  },
  plans: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  planCard: {
    flex: 1,
    backgroundColor: '#252542',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  planCardFeatured: {
    borderColor: '#6366f1',
    backgroundColor: '#2d2d4a',
  },
  planPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  saveBadge: {
    position: 'absolute',
    top: -10,
    backgroundColor: '#6366f1',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  saveBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  planName: {
    fontSize: 16,
    color: '#888',
    marginBottom: 8,
  },
  planPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  planPeriod: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  link: {
    color: '#6366f1',
    fontSize: 16,
    fontWeight: '500',
  },
});
