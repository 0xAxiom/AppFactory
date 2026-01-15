import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { EnergyLevel } from '../types';
import { getEnergyColor, getEnergyLabel } from '../utils/helpers';
import { energyColors } from '../theme';

interface EnergyIndicatorProps {
  level: EnergyLevel | null;
  showLabel?: boolean;
  size?: 'small' | 'medium' | 'large';
  style?: any;
}

export default function EnergyIndicator({ 
  level, 
  showLabel = true, 
  size = 'medium',
  style 
}: EnergyIndicatorProps) {
  if (!level) {
    return (
      <Card style={[styles.container, style]} mode="outlined">
        <View style={styles.unknownContent}>
          <MaterialCommunityIcons name="help" size={24} color="#9ca3af" />
          <Text style={styles.unknownText}>Check in with your energy</Text>
        </View>
      </Card>
    );
  }

  const energyTheme = energyColors[level];
  const iconName = getIconForEnergy(level);
  const iconSize = getSizeValue(size, { small: 20, medium: 28, large: 36 });
  const containerHeight = getSizeValue(size, { small: 60, medium: 80, large: 100 });

  return (
    <Card style={[styles.container, { height: containerHeight }, style]} mode="outlined">
      <LinearGradient
        colors={[energyTheme.background, energyTheme.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <MaterialCommunityIcons 
            name={iconName} 
            size={iconSize} 
            color={energyTheme.text} 
          />
          {showLabel && (
            <Text style={[styles.label, { color: energyTheme.text }]}>
              {getEnergyLabel(level)}
            </Text>
          )}
        </View>
      </LinearGradient>
    </Card>
  );
}

function getIconForEnergy(level: EnergyLevel): string {
  switch (level) {
    case 'low':
      return 'battery-low';
    case 'medium':
      return 'battery-medium';
    case 'high':
      return 'battery-high';
    default:
      return 'battery-unknown';
  }
}

function getSizeValue(size: string, values: { small: number; medium: number; large: number }) {
  return values[size as keyof typeof values] || values.medium;
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    elevation: 2,
  },
  gradient: {
    flex: 1,
    borderRadius: 12,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  label: {
    fontWeight: '600',
    fontSize: 14,
  },
  unknownContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 8,
  },
  unknownText: {
    color: '#9ca3af',
    fontSize: 12,
    textAlign: 'center',
  },
});