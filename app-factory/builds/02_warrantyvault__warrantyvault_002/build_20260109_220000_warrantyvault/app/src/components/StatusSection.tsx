/**
 * StatusSection Component - Collapsible section header for item groups
 */

import React, { useState } from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { colors } from '../theme/colors';
import { spacing, radius } from '../theme/spacing';
import { typography } from '../theme/typography';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface StatusSectionProps {
  title: string;
  count: number;
  color: string;
  defaultExpanded?: boolean;
  children: React.ReactNode;
}

export function StatusSection({
  title,
  count,
  color,
  defaultExpanded = true,
  children,
}: StatusSectionProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const toggleExpanded = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={toggleExpanded}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={`${title}, ${count} items, ${expanded ? 'expanded' : 'collapsed'}`}
        accessibilityState={{ expanded }}
      >
        <View style={styles.headerLeft}>
          <View style={[styles.indicator, { backgroundColor: color }]} />
          <Text style={styles.title}>{title}</Text>
          <View style={[styles.countBadge, { backgroundColor: `${color}20` }]}>
            <Text style={[styles.count, { color }]}>{count}</Text>
          </View>
        </View>
        <Text style={styles.chevron}>{expanded ? '▼' : '▶'}</Text>
      </TouchableOpacity>

      {expanded && <View style={styles.content}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  indicator: {
    width: 4,
    height: 20,
    borderRadius: 2,
    marginRight: spacing.sm,
  },
  title: {
    ...typography.headline,
    color: colors.text.primary,
    marginRight: spacing.sm,
  },
  countBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  count: {
    ...typography.small,
    fontWeight: '600',
  },
  chevron: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  content: {
    marginTop: spacing.sm,
  },
});
