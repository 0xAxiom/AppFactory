/**
 * ItemCard Component - Displays warranty item in list
 */

import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  Image,
  StyleSheet,
} from 'react-native';
import type { ItemWithStatus } from '../types';
import { CATEGORY_INFO } from '../types';
import { colors } from '../theme/colors';
import { spacing, radius, shadows } from '../theme/spacing';
import { typography } from '../theme/typography';
import { formatDaysRemaining } from '../utils/dates';

interface ItemCardProps {
  item: ItemWithStatus;
  onPress: () => void;
}

export function ItemCard({ item, onPress }: ItemCardProps) {
  const statusColors = colors.status[item.status];
  const categoryInfo = CATEGORY_INFO[item.category];

  return (
    <TouchableOpacity
      style={[styles.container, { borderLeftColor: statusColors.border }]}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`${item.name}, ${categoryInfo.label}, ${formatDaysRemaining(item.daysRemaining)}`}
    >
      {/* Thumbnail */}
      <View style={styles.thumbnailContainer}>
        {item.receiptUri ? (
          <Image source={{ uri: item.receiptUri }} style={styles.thumbnail} />
        ) : (
          <View style={[styles.thumbnailPlaceholder, { backgroundColor: statusColors.bg }]}>
            <Text style={styles.thumbnailIcon}>{categoryInfo.icon === 'smartphone' ? '📱' : categoryInfo.icon === 'home' ? '🏠' : categoryInfo.icon === 'sofa' ? '🛋️' : categoryInfo.icon === 'car' ? '🚗' : '📦'}</Text>
          </View>
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.category}>{categoryInfo.label}</Text>
      </View>

      {/* Status Badge */}
      <View style={[styles.badge, { backgroundColor: statusColors.bg }]}>
        <Text style={[styles.badgeText, { color: statusColors.text }]}>
          {item.status === 'expired'
            ? 'Expired'
            : item.daysRemaining <= 30
            ? `${item.daysRemaining}d`
            : item.daysRemaining <= 365
            ? `${Math.floor(item.daysRemaining / 30)}mo`
            : `${Math.floor(item.daysRemaining / 365)}y`}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderLeftWidth: 4,
    ...shadows.card,
  },
  thumbnailContainer: {
    marginRight: spacing.md,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: radius.md,
  },
  thumbnailPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbnailIcon: {
    fontSize: 24,
  },
  content: {
    flex: 1,
    marginRight: spacing.sm,
  },
  name: {
    ...typography.bodyMedium,
    color: colors.text.primary,
    marginBottom: 2,
  },
  category: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.xl,
    minWidth: 40,
    alignItems: 'center',
  },
  badgeText: {
    ...typography.small,
    fontWeight: '600',
  },
});
