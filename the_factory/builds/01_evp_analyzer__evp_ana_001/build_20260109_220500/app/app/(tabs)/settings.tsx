import { View, Text, StyleSheet, ScrollView, Switch, Pressable, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { colors, typography, spacing, radius } from '@/constants/theme';
import { ChevronRightIcon, LockIcon } from '@/ui/icons';
import { getSettings, saveSettings, clearAllData } from '@/services/storage';
import { useSubscription } from '@/stores/SubscriptionContext';
import { useRouter } from 'expo-router';
import { UserSettings } from '@/types';

export default function SettingsScreen() {
  const router = useRouter();
  const { isProUser, restorePurchases } = useSubscription();
  const [settings, setSettings] = useState<UserSettings | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const data = await getSettings();
    setSettings(data);
  };

  const updateSetting = async <K extends keyof UserSettings>(
    key: K,
    value: UserSettings[K]
  ) => {
    if (!settings) return;
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    await saveSettings({ [key]: value });
  };

  const handleRestore = async () => {
    const restored = await restorePurchases();
    Alert.alert(
      restored ? 'Purchases Restored' : 'No Purchases Found',
      restored
        ? 'Your EVP Pro subscription has been restored.'
        : 'We couldn\'t find any previous purchases for this account.'
    );
  };

  const handleClearData = () => {
    Alert.alert(
      'Delete All Data',
      'This will permanently delete all your investigations and recordings. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Everything',
          style: 'destructive',
          onPress: async () => {
            await clearAllData();
            Alert.alert('Data Deleted', 'All investigations have been removed.');
          },
        },
      ]
    );
  };

  if (!settings) return null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
        </View>

        {/* Subscription */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Subscription</Text>
          <View style={styles.card}>
            <Pressable
              style={styles.row}
              onPress={() => !isProUser && router.push('/paywall')}
            >
              <View style={styles.rowContent}>
                <Text style={styles.rowLabel}>Status</Text>
                <View style={styles.rowValue}>
                  <Text style={[styles.rowValueText, isProUser && styles.proText]}>
                    {isProUser ? 'EVP Pro' : 'Free'}
                  </Text>
                  {!isProUser && <ChevronRightIcon size={16} color={colors.text.tertiary} />}
                </View>
              </View>
            </Pressable>
            <View style={styles.divider} />
            <Pressable style={styles.row} onPress={handleRestore}>
              <Text style={styles.rowLabel}>Restore Purchases</Text>
            </Pressable>
          </View>
        </View>

        {/* Recording */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recording</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Sensitivity</Text>
              <Text style={styles.rowValueText}>
                {settings.sensitivityLevel.charAt(0).toUpperCase() +
                  settings.sensitivityLevel.slice(1)}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Recording Quality</Text>
              <Text style={styles.rowValueText}>
                {settings.recordingQuality === 'high' ? 'High (44.1kHz)' : 'Standard'}
              </Text>
            </View>
          </View>
        </View>

        {/* General */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Haptic Feedback</Text>
              <Switch
                value={settings.hapticFeedback}
                onValueChange={(value) => updateSetting('hapticFeedback', value)}
                trackColor={{ false: colors.background.tertiary, true: colors.accent.primary }}
                thumbColor={colors.text.primary}
              />
            </View>
            <View style={styles.divider} />
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Auto-save Location</Text>
              <Switch
                value={settings.autoSaveLocation}
                onValueChange={(value) => updateSetting('autoSaveLocation', value)}
                trackColor={{ false: colors.background.tertiary, true: colors.accent.primary }}
                thumbColor={colors.text.primary}
              />
            </View>
          </View>
        </View>

        {/* Data */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data</Text>
          <View style={styles.card}>
            <Pressable style={styles.row} onPress={handleClearData}>
              <Text style={[styles.rowLabel, styles.destructive]}>
                Delete All Investigations
              </Text>
            </Pressable>
          </View>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.card}>
            <Pressable
              style={styles.row}
              onPress={() => Linking.openURL('https://evpanalyzer.app/privacy')}
            >
              <Text style={styles.rowLabel}>Privacy Policy</Text>
              <ChevronRightIcon size={16} color={colors.text.tertiary} />
            </Pressable>
            <View style={styles.divider} />
            <Pressable
              style={styles.row}
              onPress={() => Linking.openURL('https://evpanalyzer.app/terms')}
            >
              <Text style={styles.rowLabel}>Terms of Service</Text>
              <ChevronRightIcon size={16} color={colors.text.tertiary} />
            </Pressable>
            <View style={styles.divider} />
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Version</Text>
              <Text style={styles.rowValueText}>1.0.0</Text>
            </View>
          </View>
        </View>

        <View style={styles.footer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
  },
  title: {
    ...typography.title1,
    color: colors.text.primary,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.footnote,
    color: colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  card: {
    backgroundColor: colors.background.secondary,
    marginHorizontal: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.background.tertiary,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    minHeight: 48,
  },
  rowContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowLabel: {
    ...typography.body,
    color: colors.text.primary,
  },
  rowValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  rowValueText: {
    ...typography.body,
    color: colors.text.secondary,
  },
  proText: {
    color: colors.accent.primary,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: colors.background.tertiary,
    marginHorizontal: spacing.md,
  },
  destructive: {
    color: colors.status.error,
  },
  footer: {
    height: spacing['2xl'],
  },
});
