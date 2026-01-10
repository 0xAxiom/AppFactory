import React from 'react';
import { View, SafeAreaView, StatusBar, ViewStyle } from 'react-native';
import { colors, spacing } from '../tokens';

interface ScreenShellProps {
  children: React.ReactNode;
  variant?: 'default' | 'child' | 'parent';
  padding?: boolean;
  style?: ViewStyle;
  safeArea?: boolean;
}

export const ScreenShell: React.FC<ScreenShellProps> = ({
  children,
  variant = 'default',
  padding = true,
  style,
  safeArea = true,
}) => {
  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case 'child':
        // Optimized for child interaction with extra padding
        return {
          backgroundColor: colors.background,
          padding: padding ? spacing.lg : 0,
        };
      
      case 'parent':
        // Standard adult interface with normal spacing
        return {
          backgroundColor: colors.surface,
          padding: padding ? spacing.md : 0,
        };
      
      default:
        return {
          backgroundColor: colors.background,
          padding: padding ? spacing.md : 0,
        };
    }
  };

  const baseStyle: ViewStyle = {
    flex: 1,
    ...getVariantStyles(),
  };

  const Container = safeArea ? SafeAreaView : View;

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={colors.background}
        translucent={false}
      />
      <Container style={[baseStyle, style]}>
        {children}
      </Container>
    </>
  );
};