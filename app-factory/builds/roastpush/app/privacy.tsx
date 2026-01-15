import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors, typography, spacing } from '../src/ui/theme';

export default function Privacy() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            Haptics.selectionAsync();
            router.back();
          }}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Privacy Policy</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.lastUpdated}>Last Updated: January 12, 2026</Text>

        <Text style={styles.sectionTitle}>Overview</Text>
        <Text style={styles.bodyText}>
          RoastPush ("we", "our", or "the app") is committed to protecting your privacy.
          This Privacy Policy explains how we collect, use, and safeguard your information
          when you use our mobile application.
        </Text>

        <Text style={styles.sectionTitle}>Information We Collect</Text>
        <Text style={styles.bodyText}>
          RoastPush is designed with privacy in mind. We collect minimal data:
        </Text>
        <Text style={styles.bulletPoint}>
          • <Text style={styles.bold}>Settings Preferences:</Text> Your intensity level,
          notification schedule, and category selections are stored locally on your device.
        </Text>
        <Text style={styles.bulletPoint}>
          • <Text style={styles.bold}>Roast History:</Text> The insults you receive are
          stored locally on your device for your viewing pleasure.
        </Text>
        <Text style={styles.bulletPoint}>
          • <Text style={styles.bold}>Subscription Status:</Text> If you subscribe to
          Premium, your purchase is processed through Apple/Google and RevenueCat. We
          receive only your anonymous subscription status.
        </Text>

        <Text style={styles.sectionTitle}>Data Storage</Text>
        <Text style={styles.bodyText}>
          All your data is stored locally on your device. We do not have access to your
          roast history, settings, or any personal information. When you delete the app,
          all data is permanently removed.
        </Text>

        <Text style={styles.sectionTitle}>Third-Party Services</Text>
        <Text style={styles.bodyText}>
          We use the following third-party services:
        </Text>
        <Text style={styles.bulletPoint}>
          • <Text style={styles.bold}>RevenueCat:</Text> For subscription management.
          RevenueCat may collect anonymous usage data. See their privacy policy at
          revenuecat.com/privacy.
        </Text>
        <Text style={styles.bulletPoint}>
          • <Text style={styles.bold}>Apple App Store / Google Play:</Text> For payment
          processing. Your payment information is handled entirely by Apple or Google.
        </Text>

        <Text style={styles.sectionTitle}>Analytics</Text>
        <Text style={styles.bodyText}>
          RoastPush does not collect analytics data. We do not track your usage, behavior,
          or any metrics. Your experience with the app stays between you and your device.
        </Text>

        <Text style={styles.sectionTitle}>Push Notifications</Text>
        <Text style={styles.bodyText}>
          The core functionality of RoastPush requires push notifications. These are
          scheduled locally on your device and do not require internet connectivity.
          You can disable notifications at any time through your device settings.
        </Text>

        <Text style={styles.sectionTitle}>Children's Privacy</Text>
        <Text style={styles.bodyText}>
          RoastPush is intended for users 17 years of age and older. We do not knowingly
          collect information from children under 17. The app contains mature humor that
          may not be suitable for younger audiences.
        </Text>

        <Text style={styles.sectionTitle}>Changes to This Policy</Text>
        <Text style={styles.bodyText}>
          We may update this Privacy Policy from time to time. We will notify you of any
          changes by posting the new Privacy Policy within the app and updating the "Last
          Updated" date.
        </Text>

        <Text style={styles.sectionTitle}>Contact Us</Text>
        <Text style={styles.bodyText}>
          If you have questions about this Privacy Policy, please contact us at:
          support@roastpush.app
        </Text>

        <View style={styles.footer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl + spacing.md,
    paddingBottom: spacing.md,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...typography.h2,
    color: colors.text,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  lastUpdated: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  bodyText: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: spacing.sm,
  },
  bulletPoint: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: spacing.xs,
    paddingLeft: spacing.sm,
  },
  bold: {
    fontWeight: '600',
    color: colors.text,
  },
  footer: {
    height: spacing.xxl,
  },
});
