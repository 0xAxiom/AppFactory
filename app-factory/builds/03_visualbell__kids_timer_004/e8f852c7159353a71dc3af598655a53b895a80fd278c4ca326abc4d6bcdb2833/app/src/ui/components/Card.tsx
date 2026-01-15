import React from 'react';
import { View, ViewStyle } from 'react-native';
import { colors, spacing, borderRadius, shadows } from '../tokens';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'timer' | 'preset' | 'floating';
  padding?: 'none' | 'small' | 'medium' | 'large' | 'extraLarge';
  style?: ViewStyle;
  elevation?: 'subtle' | 'card' | 'float' | 'modal';
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'medium',
  style,
  elevation = 'card',
}) => {
  const getPaddingValue = () => {
    switch (padding) {
      case 'none': return 0;
      case 'small': return spacing.sm;
      case 'large': return spacing.xl;
      case 'extraLarge': return spacing['2xl'];
      default: return spacing.lg; // medium
    }
  };

  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case 'timer':
        // Special styling for main timer container
        return {
          backgroundColor: colors.background,
          borderRadius: borderRadius.large,
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          elevation: 8, // Android shadow
        };
      
      case 'preset':
        // Preset timer selection cards
        return {
          backgroundColor: colors.surface,
          borderRadius: borderRadius.medium,
          borderWidth: 2,
          borderColor: 'transparent',
        };
      
      case 'floating':
        // Elevated cards that appear to float
        return {
          backgroundColor: colors.background,
          borderRadius: borderRadius.large,
        };
      
      default:
        // Standard card styling
        return {
          backgroundColor: colors.background,
          borderRadius: borderRadius.medium,
        };
    }
  };

  const getShadowStyle = (): ViewStyle => {
    switch (elevation) {
      case 'subtle':
        return {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
          elevation: 2,
        };
      case 'float':
        return {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.12,
          shadowRadius: 24,
          elevation: 12,
        };
      case 'modal':
        return {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 16 },
          shadowOpacity: 0.16,
          shadowRadius: 32,
          elevation: 16,
        };
      default: // card
        return {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.08,
          shadowRadius: 16,
          elevation: 4,
        };
    }
  };

  const baseStyle: ViewStyle = {
    padding: getPaddingValue(),
    ...getVariantStyles(),
    ...(variant !== 'timer' && getShadowStyle()), // Timer has custom shadow
  };

  return (
    <View style={[baseStyle, style]}>
      {children}
    </View>
  );
};