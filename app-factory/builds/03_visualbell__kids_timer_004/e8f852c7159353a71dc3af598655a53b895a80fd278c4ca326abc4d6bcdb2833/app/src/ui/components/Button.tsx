import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  ViewStyle, 
  TextStyle, 
  ActivityIndicator 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { colors, typography, spacing, borderRadius, childDesign } from '../tokens';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'small' | 'medium' | 'large' | 'extraLarge';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  hapticFeedback?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  style,
  textStyle,
  hapticFeedback = true,
}) => {
  const handlePress = () => {
    if (disabled || loading) return;
    
    if (hapticFeedback) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    onPress();
  };

  const getSizeStyles = (): { container: ViewStyle; text: TextStyle } => {
    switch (size) {
      case 'small':
        return {
          container: { 
            paddingHorizontal: spacing.md, 
            paddingVertical: spacing.sm,
            minHeight: childDesign.touchTargets.minimum,
          },
          text: { fontSize: typography.sizes.bodyMedium }
        };
      case 'large':
        return {
          container: { 
            paddingHorizontal: spacing.xl, 
            paddingVertical: spacing.lg,
            minHeight: childDesign.touchTargets.preferred,
          },
          text: { fontSize: typography.sizes.bodyLarge }
        };
      case 'extraLarge':
        return {
          container: { 
            paddingHorizontal: spacing['2xl'], 
            paddingVertical: spacing.xl,
            minHeight: childDesign.touchTargets.extraLarge,
          },
          text: { fontSize: typography.sizes.headingMedium }
        };
      default: // medium
        return {
          container: { 
            paddingHorizontal: spacing.lg, 
            paddingVertical: spacing.md,
            minHeight: childDesign.touchTargets.minimum,
          },
          text: { fontSize: typography.sizes.bodyLarge }
        };
    }
  };

  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case 'secondary':
        return {
          backgroundColor: colors.surface,
          borderWidth: 2,
          borderColor: colors.primary,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          borderWidth: 0,
        };
      default: // primary
        return {}; // Will use gradient
    }
  };

  const getTextColor = (): string => {
    switch (variant) {
      case 'secondary':
      case 'ghost':
        return colors.primary;
      default:
        return colors.foreground;
    }
  };

  const sizeStyles = getSizeStyles();
  const variantStyles = getVariantStyles();

  const baseContainerStyle: ViewStyle = {
    borderRadius: borderRadius.large,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    opacity: disabled ? 0.5 : 1,
    ...sizeStyles.container,
    ...variantStyles,
  };

  const textStyles: TextStyle = {
    fontFamily: typography.families.primary,
    fontWeight: typography.weights.semibold,
    color: getTextColor(),
    textAlign: 'center',
    ...sizeStyles.text,
    ...textStyle,
  };

  const ButtonContent = () => (
    <>
      {loading && (
        <ActivityIndicator 
          color={getTextColor()} 
          size="small" 
          style={{ marginRight: spacing.sm }} 
        />
      )}
      {icon && !loading && (
        <>{icon}</>
      )}
      <Text style={textStyles}>{title}</Text>
    </>
  );

  // Primary buttons use gradient background
  if (variant === 'primary') {
    return (
      <TouchableOpacity
        onPress={handlePress}
        disabled={disabled || loading}
        activeOpacity={0.8}
        style={[baseContainerStyle, style]}
      >
        <LinearGradient
          colors={[colors.primary, colors.warning]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            ...baseContainerStyle,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />
        <ButtonContent />
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[baseContainerStyle, style]}
    >
      <ButtonContent />
    </TouchableOpacity>
  );
};