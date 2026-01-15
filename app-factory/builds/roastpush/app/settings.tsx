import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors, typography, spacing } from '../src/ui/theme';
import { useSettings } from '../src/context/SettingsContext';
import { useSubscription } from '../src/context/SubscriptionContext';
import { IntensityLevel, InsultCategory, CATEGORIES } from '../src/data/insults';
import Slider from '../src/components/Slider';

export default function Settings() {
  const { settings, updateSettings } = useSettings();
  const { isPremium, restorePurchases } = useSubscription();
  const [isRestoring, setIsRestoring] = useState(false);

  const intensityLevels: { key: IntensityLevel; label: string; icon: string; locked: boolean }[] = [
    { key: 'mild', label: 'Mild Tease', icon: 'happy-outline', locked: false },
    { key: 'medium', label: 'Solid Roast', icon: 'flame-outline', locked: false },
    { key: 'savage', label: 'Savage Burns', icon: 'skull-outline', locked: !isPremium },
  ];

  const categoryItems: { key: InsultCategory; label: string; locked: boolean }[] = [
    { key: 'general', label: 'General', locked: false },
    { key: 'work', label: 'Work Life', locked: false },
    { key: 'dating', label: 'Dating Life', locked: !isPremium },
    { key: 'fitness', label: 'Fitness', locked: !isPremium },
    { key: 'intelligence', label: 'Intelligence', locked: !isPremium },
    { key: 'appearance', label: 'Appearance', locked: !isPremium },
  ];

  const handleIntensityChange = (intensity: IntensityLevel) => {
    const level = intensityLevels.find(l => l.key === intensity);
    if (level?.locked) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      router.push('/paywall');
      return;
    }
    Haptics.selectionAsync();
    updateSettings({ intensity });
  };

  const handleCategoryToggle = (category: InsultCategory) => {
    const cat = categoryItems.find(c => c.key === category);
    if (cat?.locked) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      router.push('/paywall');
      return;
    }

    Haptics.selectionAsync();
    const current = settings?.categories || ['general', 'work'];
    let updated: InsultCategory[];

    if (current.includes(category)) {
      if (current.length === 1) {
        Alert.alert('Oops', 'You need at least one category enabled');
        return;
      }
      updated = current.filter(c => c !== category);
    } else {
      updated = [...current, category];
    }
    updateSettings({ categories: updated });
  };

  const handleDailyLimitChange = (value: number) => {
    if (value > 5 && !isPremium) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      router.push('/paywall');
      return;
    }
    updateSettings({ dailyLimit: value });
  };

  const handleRestore = async () => {
    setIsRestoring(true);
    Haptics.selectionAsync();
    try {
      const success = await restorePurchases();
      if (success) {
        Alert.alert('Restored!', 'Your premium access has been restored.');
      } else {
        Alert.alert('No Purchases Found', 'We couldn\'t find any previous purchases.');
      }
    } catch {
      Alert.alert('Error', 'Failed to restore purchases. Please try again.');
    }
    setIsRestoring(false);
  };

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
        <Text style={styles.title}>Settings</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {!isPremium && (
          <TouchableOpacity
            style={styles.premiumBanner}
            onPress={() => {
              Haptics.selectionAsync();
              router.push('/paywall');
            }}
            activeOpacity={0.8}
          >
            <View style={styles.premiumContent}>
              <Ionicons name="diamond" size={24} color={colors.background} />
              <View style={styles.premiumText}>
                <Text style={styles.premiumTitle}>Upgrade to Premium</Text>
                <Text style={styles.premiumSubtitle}>Unlock savage burns & more</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.background} />
          </TouchableOpacity>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Intensity</Text>
          {intensityLevels.map(level => (
            <TouchableOpacity
              key={level.key}
              style={[
                styles.optionRow,
                settings?.intensity === level.key && styles.optionRowSelected,
              ]}
              onPress={() => handleIntensityChange(level.key)}
              activeOpacity={0.7}
            >
              <View style={styles.optionLeft}>
                <Ionicons name={level.icon as any} size={20} color={colors.accent} />
                <Text style={styles.optionLabel}>{level.label}</Text>
              </View>
              {level.locked ? (
                <Ionicons name="lock-closed" size={18} color={colors.textSecondary} />
              ) : settings?.intensity === level.key ? (
                <Ionicons name="checkmark-circle" size={20} color={colors.accent} />
              ) : null}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Roasts</Text>
          <View style={styles.sliderContainer}>
            <Slider
              value={settings?.dailyLimit || 5}
              min={1}
              max={20}
              step={1}
              onValueChange={handleDailyLimitChange}
              isPremiumLocked={!isPremium}
              premiumThreshold={5}
            />
            <Text style={styles.sliderLabel}>
              {settings?.dailyLimit || 5} roasts per day
              {!isPremium && (settings?.dailyLimit || 5) >= 5 && ' (max for free)'}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Schedule</Text>
          <View style={styles.scheduleRow}>
            <View style={styles.scheduleItem}>
              <Text style={styles.scheduleLabel}>Start Time</Text>
              <Text style={styles.scheduleValue}>
                {settings?.startHour || 9}:00 AM
              </Text>
            </View>
            <View style={styles.scheduleItem}>
              <Text style={styles.scheduleLabel}>End Time</Text>
              <Text style={styles.scheduleValue}>
                {settings?.endHour || 22}:00
              </Text>
            </View>
          </View>
          <Text style={styles.scheduleNote}>
            Roasts are delivered randomly within this window
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          {categoryItems.map(cat => (
            <TouchableOpacity
              key={cat.key}
              style={styles.categoryRow}
              onPress={() => handleCategoryToggle(cat.key)}
              activeOpacity={0.7}
            >
              <Text style={styles.categoryLabel}>{cat.label}</Text>
              {cat.locked ? (
                <Ionicons name="lock-closed" size={18} color={colors.textSecondary} />
              ) : (
                <Switch
                  value={settings?.categories?.includes(cat.key) || false}
                  onValueChange={() => handleCategoryToggle(cat.key)}
                  trackColor={{ false: colors.surface, true: colors.accent + '60' }}
                  thumbColor={
                    settings?.categories?.includes(cat.key) ? colors.accent : colors.textSecondary
                  }
                />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <TouchableOpacity
            style={styles.linkRow}
            onPress={handleRestore}
            disabled={isRestoring}
          >
            <Ionicons name="refresh" size={20} color={colors.textSecondary} />
            <Text style={styles.linkLabel}>
              {isRestoring ? 'Restoring...' : 'Restore Purchases'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.linkRow}
            onPress={() => {
              Haptics.selectionAsync();
              router.push('/privacy');
            }}
          >
            <Ionicons name="shield-checkmark-outline" size={20} color={colors.textSecondary} />
            <Text style={styles.linkLabel}>Privacy Policy</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.version}>RoastPush v1.0.0</Text>
        </View>
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
  premiumBanner: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  premiumContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  premiumText: {
    gap: 2,
  },
  premiumTitle: {
    ...typography.body,
    color: colors.background,
    fontWeight: '600',
  },
  premiumSubtitle: {
    ...typography.caption,
    color: colors.background,
    opacity: 0.8,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  optionRow: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  optionRowSelected: {
    borderWidth: 1,
    borderColor: colors.accent,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  optionLabel: {
    ...typography.body,
    color: colors.text,
  },
  sliderContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
  },
  sliderLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  scheduleRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  scheduleItem: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
  },
  scheduleLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  scheduleValue: {
    ...typography.body,
    color: colors.text,
  },
  scheduleNote: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    fontStyle: 'italic',
  },
  categoryRow: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  categoryLabel: {
    ...typography.body,
    color: colors.text,
  },
  linkRow: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  linkLabel: {
    ...typography.body,
    color: colors.text,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  version: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});
