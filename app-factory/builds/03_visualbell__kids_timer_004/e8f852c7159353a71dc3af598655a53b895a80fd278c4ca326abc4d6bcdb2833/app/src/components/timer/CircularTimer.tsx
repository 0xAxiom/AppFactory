import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedProps,
  withTiming,
  withSequence,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { colors, typography, spacing, childDesign } from '../../ui/tokens';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const { width } = Dimensions.get('window');

interface CircularTimerProps {
  duration: number; // in seconds
  isRunning: boolean;
  isPaused: boolean;
  remainingTime: number;
  onComplete: () => void;
  onPause: () => void;
  onResume: () => void;
  theme?: 'default' | 'space' | 'underwater' | 'garden';
  size?: number;
}

export const CircularTimer: React.FC<CircularTimerProps> = ({
  duration,
  isRunning,
  isPaused,
  remainingTime,
  onComplete,
  onPause,
  onResume,
  theme = 'default',
  size = Math.min(width * 0.8, 320),
}) => {
  const [isCompleted, setIsCompleted] = useState(false);
  
  // Animation values
  const progress = useSharedValue(0);
  const celebrationScale = useSharedValue(1);
  const glowOpacity = useSharedValue(0.3);

  // Calculate progress percentage
  const progressPercentage = duration > 0 ? (duration - remainingTime) / duration : 0;
  const circumference = (size - 40) * Math.PI; // Accounting for stroke width
  const strokeDashoffset = circumference * (1 - progressPercentage);

  // Theme colors
  const getThemeColors = () => {
    switch (theme) {
      case 'space':
        return {
          primary: colors.themes.spaceAdventure.primary,
          secondary: colors.themes.spaceAdventure.secondary,
          accent: colors.themes.spaceAdventure.accent,
        };
      case 'underwater':
        return {
          primary: colors.themes.underwaterWorld.primary,
          secondary: colors.themes.underwaterWorld.secondary,
          accent: colors.themes.underwaterWorld.accent,
        };
      case 'garden':
        return {
          primary: colors.themes.fairyGarden.primary,
          secondary: colors.themes.fairyGarden.secondary,
          accent: colors.themes.fairyGarden.accent,
        };
      default:
        return {
          primary: colors.primary,
          secondary: colors.secondary,
          accent: colors.accent,
        };
    }
  };

  const themeColors = getThemeColors();

  // Update progress animation
  useEffect(() => {
    progress.value = withTiming(progressPercentage, {
      duration: 500,
      easing: Easing.out(Easing.quad),
    });
  }, [progressPercentage]);

  // Handle timer completion
  useEffect(() => {
    if (remainingTime <= 0 && !isCompleted && duration > 0) {
      setIsCompleted(true);
      
      // Celebration animation
      celebrationScale.value = withSequence(
        withTiming(1.1, { duration: 300 }),
        withTiming(1.05, { duration: 200 }),
        withTiming(1, { duration: 300 })
      );
      
      // Glow effect
      glowOpacity.value = withSequence(
        withTiming(0.8, { duration: 200 }),
        withDelay(800, withTiming(0.3, { duration: 500 }))
      );

      // Haptic feedback
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      // Complete callback
      setTimeout(() => {
        onComplete();
      }, 100);
    }
  }, [remainingTime, isCompleted, duration]);

  // Glow animation for running timer
  useEffect(() => {
    if (isRunning && !isPaused) {
      glowOpacity.value = withTiming(0.5, { duration: 1000 });
    } else {
      glowOpacity.value = withTiming(0.2, { duration: 500 });
    }
  }, [isRunning, isPaused]);

  // Format time display for children (simple format)
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle timer tap (pause/resume)
  const handleTimerTap = () => {
    if (isRunning) {
      onPause();
    } else if (isPaused) {
      onResume();
    }
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: celebrationScale.value }],
    };
  });

  const animatedGlowStyle = useAnimatedStyle(() => {
    return {
      opacity: glowOpacity.value,
    };
  });

  const animatedProgressProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: circumference * (1 - progress.value),
    };
  });

  const radius = (size - 40) / 2;
  const centerX = size / 2;
  const centerY = size / 2;

  return (
    <View style={{ alignItems: 'center' }}>
      {/* Glow effect background */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            width: size + 40,
            height: size + 40,
            borderRadius: (size + 40) / 2,
            backgroundColor: themeColors.primary,
          },
          animatedGlowStyle,
        ]}
      />
      
      {/* Main timer container */}
      <Animated.View style={[animatedContainerStyle]}>
        <TouchableOpacity
          onPress={handleTimerTap}
          activeOpacity={0.9}
          style={{
            width: size,
            height: size,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Background circle with gradient */}
          <LinearGradient
            colors={[colors.background, colors.surface]}
            style={{
              position: 'absolute',
              width: size - 20,
              height: size - 20,
              borderRadius: (size - 20) / 2,
            }}
          />

          {/* SVG Timer Ring */}
          <Svg
            width={size}
            height={size}
            style={{ position: 'absolute' }}
          >
            {/* Background track */}
            <Circle
              cx={centerX}
              cy={centerY}
              r={radius}
              stroke={colors.surface}
              strokeWidth={20}
              fill="transparent"
            />
            
            {/* Progress track */}
            <AnimatedCircle
              cx={centerX}
              cy={centerY}
              r={radius}
              stroke={themeColors.primary}
              strokeWidth={20}
              fill="transparent"
              strokeDasharray={circumference}
              animatedProps={animatedProgressProps}
              strokeLinecap="round"
              transform={`rotate(-90 ${centerX} ${centerY})`}
            />
          </Svg>

          {/* Time display */}
          <View style={{ alignItems: 'center' }}>
            <Text
              style={{
                fontSize: typography.sizes.timerDisplay,
                fontWeight: typography.weights.bold,
                color: colors.foreground,
                fontFamily: typography.families.primary,
              }}
            >
              {formatTime(remainingTime)}
            </Text>
            
            {/* Status text for children */}
            <Text
              style={{
                fontSize: typography.sizes.bodyLarge,
                fontWeight: typography.weights.medium,
                color: colors.muted,
                marginTop: spacing.sm,
                fontFamily: typography.families.primary,
              }}
            >
              {isCompleted ? '✨ All Done! ✨' : 
               isPaused ? 'Paused' : 
               isRunning ? 'Timer Running' : 'Ready to Start'}
            </Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};