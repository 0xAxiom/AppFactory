/**
 * Dashboard Screen - Main screen showing warranty items grouped by status
 */

import React, { useCallback, useMemo } from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { useItems } from '../../src/contexts/ItemsContext';
import { useSubscription, FREE_TIER_LIMIT } from '../../src/contexts/SubscriptionContext';
import { ItemCard } from '../../src/components/ItemCard';
import { StatusSection } from '../../src/components/StatusSection';
import { EmptyState } from '../../src/components/EmptyState';
import { FAB } from '../../src/components/FAB';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';

export default function DashboardScreen() {
  const { items, isLoading, refreshItems, itemCount, expiringCount, activeCount, expiredCount } = useItems();
  const { isPremium, canAddMoreItems } = useSubscription();

  // Group items by status
  const { expiringItems, activeItems, expiredItems } = useMemo(() => {
    return {
      expiringItems: items.filter(i => i.status === 'expiring'),
      activeItems: items.filter(i => i.status === 'active'),
      expiredItems: items.filter(i => i.status === 'expired'),
    };
  }, [items]);

  const handleAddPress = useCallback(() => {
    if (!canAddMoreItems(itemCount)) {
      router.push('/paywall');
    } else {
      router.push('/(tabs)/add');
    }
  }, [canAddMoreItems, itemCount]);

  const handleItemPress = useCallback((itemId: string) => {
    router.push(`/item/${itemId}`);
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (itemCount === 0) {
    return (
      <View style={styles.container}>
        <EmptyState
          title="Your Vault is Empty"
          message="Start protecting your purchases by adding your first warranty item."
          actionLabel="Add First Item"
          onAction={handleAddPress}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refreshItems}
            tintColor={colors.primary}
          />
        }
      >
        {/* Expiring Soon Section */}
        {expiringCount > 0 && (
          <StatusSection
            title="Expiring Soon"
            count={expiringCount}
            color={colors.warning}
            defaultExpanded={true}
          >
            {expiringItems.map(item => (
              <ItemCard
                key={item.id}
                item={item}
                onPress={() => handleItemPress(item.id)}
              />
            ))}
          </StatusSection>
        )}

        {/* Active Section */}
        {activeCount > 0 && (
          <StatusSection
            title="Active"
            count={activeCount}
            color={colors.secondary}
            defaultExpanded={expiringCount === 0}
          >
            {activeItems.map(item => (
              <ItemCard
                key={item.id}
                item={item}
                onPress={() => handleItemPress(item.id)}
              />
            ))}
          </StatusSection>
        )}

        {/* Expired Section */}
        {expiredCount > 0 && (
          <StatusSection
            title="Expired"
            count={expiredCount}
            color={colors.muted}
            defaultExpanded={false}
          >
            {expiredItems.map(item => (
              <ItemCard
                key={item.id}
                item={item}
                onPress={() => handleItemPress(item.id)}
              />
            ))}
          </StatusSection>
        )}

        {/* Item limit notice */}
        {!isPremium && (
          <View style={styles.limitNotice}>
            <View style={styles.limitBadge}>
              <View style={styles.limitText}>
                {`${itemCount}/${FREE_TIER_LIMIT} items`}
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      <FAB onPress={handleAddPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.screenPadding,
    paddingBottom: 100, // Space for FAB
  },
  limitNotice: {
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  limitBadge: {
    backgroundColor: `${colors.primary}10`,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
  },
  limitText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
});
