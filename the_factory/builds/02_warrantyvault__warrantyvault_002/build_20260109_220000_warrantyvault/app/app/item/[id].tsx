/**
 * Item Detail Screen - Full item view with receipt and countdown
 */

import React, { useCallback, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
  Dimensions,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useItems } from '../../src/contexts/ItemsContext';
import { Button } from '../../src/components/Button';
import { deleteReceiptImage } from '../../src/services/images';
import { cancelItemNotifications } from '../../src/services/notifications';
import { formatDate, formatDaysRemaining } from '../../src/utils/dates';
import { colors } from '../../src/theme/colors';
import { spacing, radius, shadows } from '../../src/theme/spacing';
import { typography } from '../../src/theme/typography';
import { CATEGORY_INFO } from '../../src/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

function InfoCard({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <View style={styles.infoCard}>
      <Text style={styles.infoIcon}>{icon}</Text>
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

export default function ItemDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getItemById, deleteItem } = useItems();
  const [imageModalVisible, setImageModalVisible] = useState(false);

  const item = id ? getItemById(id) : undefined;

  const handleDelete = useCallback(async () => {
    if (!item) return;

    Alert.alert(
      'Delete Item',
      `Are you sure you want to delete "${item.name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // Delete the receipt image
              if (item.receiptUri) {
                await deleteReceiptImage(item.receiptUri);
              }
              // Cancel any scheduled notifications
              await cancelItemNotifications(item.id);
              // Delete the item
              await deleteItem(item.id);
              // Navigate back
              router.back();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete item. Please try again.');
            }
          },
        },
      ]
    );
  }, [item, deleteItem]);

  if (!item) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Item not found</Text>
        <Button title="Go Back" onPress={() => router.back()} />
      </View>
    );
  }

  const statusColors = colors.status[item.status];
  const categoryInfo = CATEGORY_INFO[item.category];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Receipt Image Hero */}
        <TouchableOpacity
          style={styles.imageContainer}
          onPress={() => setImageModalVisible(true)}
          activeOpacity={0.9}
          accessibilityLabel="Tap to view full receipt"
        >
          <Image source={{ uri: item.receiptUri }} style={styles.image} />
          <View style={styles.imageOverlay}>
            <Text style={styles.imageHint}>Tap to zoom</Text>
          </View>
        </TouchableOpacity>

        {/* Status Badge */}
        <View style={[styles.statusBadge, { backgroundColor: statusColors.bg }]}>
          <View style={[styles.statusDot, { backgroundColor: statusColors.border }]} />
          <Text style={[styles.statusText, { color: statusColors.text }]}>
            {item.status === 'active' ? 'Active' : item.status === 'expiring' ? 'Expiring Soon' : 'Expired'}
          </Text>
        </View>

        {/* Countdown */}
        <View style={styles.countdownContainer}>
          <Text style={[styles.countdownNumber, { color: statusColors.text }]}>
            {Math.abs(item.daysRemaining)}
          </Text>
          <Text style={styles.countdownLabel}>
            {item.daysRemaining >= 0 ? 'Days Remaining' : 'Days Expired'}
          </Text>
        </View>

        {/* Item Name */}
        <Text style={styles.itemName}>{item.name}</Text>

        {/* Info Cards */}
        <View style={styles.infoGrid}>
          <InfoCard
            label="Category"
            value={categoryInfo.label}
            icon={item.category === 'electronics' ? '📱' : item.category === 'appliances' ? '🏠' : item.category === 'furniture' ? '🛋️' : item.category === 'vehicles' ? '🚗' : '📦'}
          />
          <InfoCard
            label="Purchase Date"
            value={formatDate(item.purchaseDate)}
            icon="📅"
          />
          <InfoCard
            label="Warranty"
            value={`${item.warrantyMonths} months`}
            icon="🛡️"
          />
          <InfoCard
            label="Expires"
            value={formatDate(item.expirationDate)}
            icon="⏰"
          />
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.footer}>
        <Button
          title="Delete Item"
          onPress={handleDelete}
          variant="destructive"
          fullWidth
        />
      </View>

      {/* Full Screen Image Modal */}
      <Modal
        visible={imageModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setImageModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalContainer}
          activeOpacity={1}
          onPress={() => setImageModalVisible(false)}
        >
          <Image
            source={{ uri: item.receiptUri }}
            style={styles.modalImage}
            resizeMode="contain"
          />
          <TouchableOpacity
            style={styles.modalClose}
            onPress={() => setImageModalVisible(false)}
          >
            <Text style={styles.modalCloseText}>✕</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
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
    paddingBottom: spacing.xl,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  notFoundText: {
    ...typography.headline,
    color: colors.text.secondary,
    marginBottom: spacing.lg,
  },
  imageContainer: {
    width: '100%',
    height: 280,
    backgroundColor: colors.surface,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: spacing.sm,
    right: spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
  },
  imageHint: {
    ...typography.small,
    color: colors.text.inverse,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    marginTop: spacing.lg,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.sm,
  },
  statusText: {
    ...typography.bodyMedium,
  },
  countdownContainer: {
    alignItems: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  countdownNumber: {
    ...typography.display,
    fontSize: 64,
    lineHeight: 72,
  },
  countdownLabel: {
    ...typography.body,
    color: colors.text.secondary,
  },
  itemName: {
    ...typography.title,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.screenPadding,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.screenPadding,
    gap: spacing.sm,
  },
  infoCard: {
    width: (SCREEN_WIDTH - spacing.screenPadding * 2 - spacing.sm) / 2,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    ...shadows.card,
  },
  infoIcon: {
    fontSize: 24,
    marginRight: spacing.sm,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    ...typography.small,
    color: colors.text.secondary,
  },
  infoValue: {
    ...typography.bodyMedium,
    color: colors.text.primary,
  },
  footer: {
    padding: spacing.screenPadding,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: SCREEN_WIDTH,
    height: '80%',
  },
  modalClose: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseText: {
    fontSize: 20,
    color: colors.text.inverse,
  },
});
