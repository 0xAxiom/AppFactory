import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ViewStyle, 
  TextStyle,
  ActivityIndicator,
  View,
} from 'react-native';
import { Colors, Typography, BorderRadius, Spacing, Components } from '../design/tokens';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'premium';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  fullWidth = false,
  style,
  textStyle,
}: ButtonProps) {
  const buttonStyle = [
    styles.base,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    style,
  ];

  const contentStyle = [
    styles.content,
    icon && styles.contentWithIcon,
  ];

  const textStyles = [
    styles.text,
    styles[`${variant}Text` as keyof typeof styles],
    styles[`${size}Text` as keyof typeof styles],
    disabled && styles.disabledText,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      <View style={contentStyle}>
        {loading ? (
          <ActivityIndicator 
            size="small" 
            color={variant === 'outline' ? Colors.primary : Colors.white} 
          />
        ) : (
          <>
            {icon && <View style={styles.icon}>{icon}</View>}
            <Text style={textStyles}>{title}</Text>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    minHeight: 48,
  },
  
  // Variants
  primary: Components.button.primary,
  secondary: Components.button.secondary,
  outline: Components.button.outline,
  premium: Components.button.premium,
  
  // Sizes
  small: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    minHeight: 36,
  },
  medium: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    minHeight: 48,
  },
  large: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    minHeight: 56,
  },
  
  // States
  disabled: {
    opacity: 0.6,
  },
  
  fullWidth: {
    width: '100%',
  },
  
  // Content
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  contentWithIcon: {
    justifyContent: 'center',
  },
  
  icon: {
    marginRight: Spacing.sm,
  },
  
  // Text styles
  text: {
    fontWeight: Typography.fontWeight.semibold,
    textAlign: 'center',
  },
  
  primaryText: {
    fontSize: Typography.fontSize.base,
    color: Colors.white,
  },
  
  secondaryText: {
    fontSize: Typography.fontSize.base,
    color: Colors.white,
  },
  
  outlineText: {
    fontSize: Typography.fontSize.base,
    color: Colors.primary,
  },
  
  premiumText: {
    fontSize: Typography.fontSize.base,
    color: Colors.black,
  },
  
  smallText: {
    fontSize: Typography.fontSize.sm,
  },
  
  mediumText: {
    fontSize: Typography.fontSize.base,
  },
  
  largeText: {
    fontSize: Typography.fontSize.lg,
  },
  
  disabledText: {
    opacity: 0.8,
  },
});