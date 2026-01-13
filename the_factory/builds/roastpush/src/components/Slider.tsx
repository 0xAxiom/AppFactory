import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  PanResponder,
  Dimensions,
  LayoutChangeEvent,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors } from '../ui/theme';

interface SliderProps {
  value: number;
  min: number;
  max: number;
  step: number;
  onValueChange: (value: number) => void;
  isPremiumLocked?: boolean;
  premiumThreshold?: number;
}

export default function Slider({
  value,
  min,
  max,
  step,
  onValueChange,
  isPremiumLocked = false,
  premiumThreshold = max,
}: SliderProps) {
  const [sliderWidth, setSliderWidth] = useState(0);
  const lastValue = useRef(value);

  const clampedValue = Math.min(Math.max(value, min), isPremiumLocked ? premiumThreshold : max);
  const percentage = ((clampedValue - min) / (max - min)) * 100;

  const handleLayout = (event: LayoutChangeEvent) => {
    setSliderWidth(event.nativeEvent.layout.width);
  };

  const calculateValue = (x: number): number => {
    const effectiveMax = isPremiumLocked ? premiumThreshold : max;
    const range = effectiveMax - min;
    const ratio = Math.max(0, Math.min(1, x / sliderWidth));
    const rawValue = min + ratio * range;
    return Math.round(rawValue / step) * step;
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const newValue = calculateValue(evt.nativeEvent.locationX);
        if (newValue !== lastValue.current) {
          lastValue.current = newValue;
          Haptics.selectionAsync();
          onValueChange(newValue);
        }
      },
      onPanResponderMove: (evt) => {
        const newValue = calculateValue(evt.nativeEvent.locationX);
        if (newValue !== lastValue.current) {
          lastValue.current = newValue;
          Haptics.selectionAsync();
          onValueChange(newValue);
        }
      },
    })
  ).current;

  return (
    <View style={styles.container} onLayout={handleLayout} {...panResponder.panHandlers}>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${percentage}%` }]} />
        {isPremiumLocked && (
          <View
            style={[
              styles.premiumSection,
              { left: `${((premiumThreshold - min) / (max - min)) * 100}%` },
            ]}
          />
        )}
      </View>
      <View style={[styles.thumb, { left: `${percentage}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 40,
    justifyContent: 'center',
  },
  track: {
    height: 8,
    backgroundColor: colors.background,
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 4,
  },
  premiumSection: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: colors.textSecondary + '40',
    borderRadius: 4,
  },
  thumb: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.accent,
    marginLeft: -12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
});
