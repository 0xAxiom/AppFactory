/**
 * Add Item Screen - Form for adding new warranty items
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { useItems } from '../../src/contexts/ItemsContext';
import { useSubscription, FREE_TIER_LIMIT } from '../../src/contexts/SubscriptionContext';
import { usePreferences } from '../../src/contexts/PreferencesContext';
import { Button } from '../../src/components/Button';
import { Input } from '../../src/components/Input';
import { pickImageFromCamera, pickImageFromLibrary } from '../../src/services/images';
import { scheduleWarrantyNotification } from '../../src/services/notifications';
import { getTodayISO } from '../../src/utils/dates';
import { colors } from '../../src/theme/colors';
import { spacing, radius, shadows } from '../../src/theme/spacing';
import { typography } from '../../src/theme/typography';
import type { Category } from '../../src/types';
import { CATEGORY_INFO, WARRANTY_PRESETS } from '../../src/types';

export default function AddItemScreen() {
  const { addItem, itemCount } = useItems();
  const { canAddMoreItems } = useSubscription();
  const { settings } = usePreferences();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>('electronics');
  const [purchaseDate, setPurchaseDate] = useState(getTodayISO());
  const [warrantyMonths, setWarrantyMonths] = useState(12);
  const [receiptUri, setReceiptUri] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleImagePick = useCallback(async (source: 'camera' | 'library') => {
    const uri = source === 'camera'
      ? await pickImageFromCamera()
      : await pickImageFromLibrary();

    if (uri) {
      setReceiptUri(uri);
    }
  }, []);

  const showImagePicker = useCallback(() => {
    Alert.alert(
      'Add Receipt Photo',
      'Choose how to add your receipt',
      [
        { text: 'Take Photo', onPress: () => handleImagePick('camera') },
        { text: 'Choose from Library', onPress: () => handleImagePick('library') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  }, [handleImagePick]);

  const validate = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!receiptUri) {
      newErrors.receipt = 'Receipt photo is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [name, receiptUri]);

  const handleSubmit = useCallback(async () => {
    if (!validate()) return;

    // Check item limit
    if (!canAddMoreItems(itemCount)) {
      router.push('/paywall');
      return;
    }

    setIsSubmitting(true);
    try {
      const newItem = await addItem({
        name: name.trim(),
        category,
        purchaseDate,
        warrantyMonths,
        receiptUri: receiptUri!,
      });

      // Schedule notification if enabled
      if (settings.notificationsEnabled) {
        await scheduleWarrantyNotification(newItem, settings.notificationDaysBefore);
      }

      // Navigate back to dashboard
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to save item. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [validate, canAddMoreItems, itemCount, name, category, purchaseDate, warrantyMonths, receiptUri, addItem, settings]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Receipt Photo */}
        <TouchableOpacity
          style={[styles.imageContainer, errors.receipt && styles.imageContainerError]}
          onPress={showImagePicker}
          accessibilityRole="button"
          accessibilityLabel="Add receipt photo"
        >
          {receiptUri ? (
            <Image source={{ uri: receiptUri }} style={styles.image} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.imageIcon}>📷</Text>
              <Text style={styles.imageText}>Tap to add receipt photo</Text>
            </View>
          )}
        </TouchableOpacity>
        {errors.receipt && <Text style={styles.errorText}>{errors.receipt}</Text>}

        {/* Product Name */}
        <Input
          label="Product Name"
          value={name}
          onChangeText={setName}
          placeholder="e.g., Samsung TV 55 inch"
          error={errors.name}
          required
        />

        {/* Category */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.categoryContainer}>
              {(Object.keys(CATEGORY_INFO) as Category[]).map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryChip,
                    category === cat && styles.categoryChipSelected,
                  ]}
                  onPress={() => setCategory(cat)}
                >
                  <Text style={styles.categoryIcon}>
                    {cat === 'electronics' ? '📱' : cat === 'appliances' ? '🏠' : cat === 'furniture' ? '🛋️' : cat === 'vehicles' ? '🚗' : '📦'}
                  </Text>
                  <Text
                    style={[
                      styles.categoryLabel,
                      category === cat && styles.categoryLabelSelected,
                    ]}
                  >
                    {CATEGORY_INFO[cat].label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Purchase Date */}
        <Input
          label="Purchase Date"
          value={purchaseDate}
          onChangeText={setPurchaseDate}
          placeholder="YYYY-MM-DD"
        />

        {/* Warranty Duration */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Warranty Duration</Text>
          <View style={styles.warrantyContainer}>
            {WARRANTY_PRESETS.map((preset) => (
              <TouchableOpacity
                key={preset.value}
                style={[
                  styles.warrantyChip,
                  warrantyMonths === preset.value && styles.warrantyChipSelected,
                ]}
                onPress={() => setWarrantyMonths(preset.value)}
              >
                <Text
                  style={[
                    styles.warrantyLabel,
                    warrantyMonths === preset.value && styles.warrantyLabelSelected,
                  ]}
                >
                  {preset.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Save Button */}
      <View style={styles.footer}>
        <Button
          title="Save Item"
          onPress={handleSubmit}
          loading={isSubmitting}
          fullWidth
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.screenPadding,
  },
  imageContainer: {
    height: 200,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    marginBottom: spacing.md,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    ...shadows.card,
  },
  imageContainerError: {
    borderColor: colors.error,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageIcon: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  imageText: {
    ...typography.body,
    color: colors.text.secondary,
  },
  errorText: {
    ...typography.small,
    color: colors.error,
    marginTop: -spacing.sm,
    marginBottom: spacing.md,
  },
  fieldContainer: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  categoryContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.sm,
  },
  categoryChipSelected: {
    backgroundColor: `${colors.primary}10`,
    borderColor: colors.primary,
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: spacing.xs,
  },
  categoryLabel: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  categoryLabelSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
  warrantyContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  warrantyChip: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  warrantyChipSelected: {
    backgroundColor: `${colors.primary}10`,
    borderColor: colors.primary,
  },
  warrantyLabel: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  warrantyLabelSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
  footer: {
    padding: spacing.screenPadding,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
