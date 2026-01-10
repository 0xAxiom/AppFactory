import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { ScreenShell, Button, Card } from '../ui/components';
import { colors, typography, spacing, borderRadius } from '../ui/tokens';
import Slider from '@react-native-community/slider';

const { width } = Dimensions.get('window');

interface PresetTimer {
  id: string;
  duration: number; // in seconds
  label: string;
  icon: string;
  color: string;
}

const presetTimers: PresetTimer[] = [
  { id: '5min', duration: 300, label: '5 min', icon: '🏃', color: colors.themes.default.secondary },
  { id: '10min', duration: 600, label: '10 min', icon: '🎯', color: colors.themes.default.primary },
  { id: '15min', duration: 900, label: '15 min', icon: '📚', color: colors.themes.spaceAdventure.primary },
  { id: '30min', duration: 1800, label: '30 min', icon: '🎨', color: colors.themes.fairyGarden.primary },
];

const themes = [
  { id: 'default', name: 'Sunshine', emoji: '☀️', isPremium: false },
  { id: 'space', name: 'Space', emoji: '🚀', isPremium: false },
  { id: 'underwater', name: 'Ocean', emoji: '🐠', isPremium: true },
  { id: 'garden', name: 'Garden', emoji: '🌸', isPremium: true },
];

export default function TimeSelectionScreen() {
  const [selectedDuration, setSelectedDuration] = useState<number>(600); // Default 10 minutes
  const [selectedTheme, setSelectedTheme] = useState<string>('default');
  const [customTime, setCustomTime] = useState<number>(10); // Custom time in minutes

  const startTimerWithDuration = (duration: number) => {
    // Navigate back to home with timer configuration
    // In a real implementation, you'd pass these parameters
    router.push({
      pathname: '/',
      params: {
        duration: duration.toString(),
        theme: selectedTheme,
      },
    });
  };

  const formatMinutes = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    if (minutes === 1) return '1 minute';
    return `${minutes} minutes`;
  };

  return (
    <ScreenShell variant="child">
      <ScrollView
        contentContainerStyle={{
          padding: spacing.lg,
          paddingBottom: spacing['4xl'],
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{ alignItems: 'center', marginBottom: spacing['2xl'] }}>
          <Text style={{
            fontSize: typography.sizes.headingLarge,
            fontWeight: typography.weights.bold,
            color: colors.foreground,
            textAlign: 'center',
            fontFamily: typography.families.primary,
          }}>
            Choose Your Timer! ⏰
          </Text>
          <Text style={{
            fontSize: typography.sizes.bodyLarge,
            color: colors.muted,
            textAlign: 'center',
            marginTop: spacing.sm,
            fontFamily: typography.families.primary,
          }}>
            Pick how long you want to focus
          </Text>
        </View>

        {/* Preset Timer Buttons */}
        <View style={{ marginBottom: spacing['2xl'] }}>
          <Text style={{
            fontSize: typography.sizes.headingMedium,
            fontWeight: typography.weights.semibold,
            color: colors.foreground,
            marginBottom: spacing.lg,
            fontFamily: typography.families.primary,
          }}>
            Quick Times
          </Text>
          
          <View style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
          }}>
            {presetTimers.map((preset) => (
              <TouchableOpacity
                key={preset.id}
                onPress={() => startTimerWithDuration(preset.duration)}
                style={{
                  width: (width - spacing.lg * 3) / 2,
                  marginBottom: spacing.md,
                }}
                activeOpacity={0.8}
              >
                <Card
                  variant="preset"
                  padding="large"
                  style={{
                    borderColor: preset.color,
                    alignItems: 'center',
                    minHeight: 120,
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{
                    fontSize: 48,
                    marginBottom: spacing.sm,
                  }}>
                    {preset.icon}
                  </Text>
                  <Text style={{
                    fontSize: typography.sizes.headingMedium,
                    fontWeight: typography.weights.bold,
                    color: preset.color,
                    textAlign: 'center',
                    fontFamily: typography.families.primary,
                  }}>
                    {preset.label}
                  </Text>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Custom Timer Slider */}
        <View style={{ marginBottom: spacing['2xl'] }}>
          <Text style={{
            fontSize: typography.sizes.headingMedium,
            fontWeight: typography.weights.semibold,
            color: colors.foreground,
            marginBottom: spacing.lg,
            fontFamily: typography.families.primary,
          }}>
            Custom Time
          </Text>
          
          <Card padding="large">
            <Text style={{
              fontSize: typography.sizes.bodyLarge,
              fontWeight: typography.weights.medium,
              color: colors.foreground,
              textAlign: 'center',
              marginBottom: spacing.lg,
              fontFamily: typography.families.primary,
            }}>
              {formatMinutes(customTime * 60)}
            </Text>
            
            <Slider
              style={{ width: '100%', height: 60 }}
              minimumValue={1}
              maximumValue={60}
              value={customTime}
              onValueChange={setCustomTime}
              minimumTrackTintColor={colors.primary}
              maximumTrackTintColor={colors.surface}
              thumbStyle={{
                backgroundColor: colors.primary,
                width: 32,
                height: 32,
              }}
              trackStyle={{ height: 8, borderRadius: 4 }}
              step={1}
            />
            
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: spacing.sm,
            }}>
              <Text style={{
                fontSize: typography.sizes.caption,
                color: colors.muted,
                fontFamily: typography.families.primary,
              }}>
                1 min
              </Text>
              <Text style={{
                fontSize: typography.sizes.caption,
                color: colors.muted,
                fontFamily: typography.families.primary,
              }}>
                60 min
              </Text>
            </View>
            
            <Button
              title="Start Custom Timer"
              onPress={() => startTimerWithDuration(customTime * 60)}
              style={{ marginTop: spacing.lg }}
              size="large"
            />
          </Card>
        </View>

        {/* Theme Selection */}
        <View style={{ marginBottom: spacing['2xl'] }}>
          <Text style={{
            fontSize: typography.sizes.headingMedium,
            fontWeight: typography.weights.semibold,
            color: colors.foreground,
            marginBottom: spacing.lg,
            fontFamily: typography.families.primary,
          }}>
            Choose Theme
          </Text>
          
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: spacing.sm }}
          >
            {themes.map((theme) => (
              <TouchableOpacity
                key={theme.id}
                onPress={() => {
                  if (!theme.isPremium) {
                    setSelectedTheme(theme.id);
                  } else {
                    // TODO: Show premium upgrade modal
                    router.push('/paywall');
                  }
                }}
                style={{ marginRight: spacing.md }}
                activeOpacity={0.8}
              >
                <Card
                  variant="preset"
                  padding="medium"
                  style={{
                    width: 100,
                    height: 100,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderColor: selectedTheme === theme.id ? colors.primary : 'transparent',
                    borderWidth: 3,
                    opacity: theme.isPremium ? 0.6 : 1,
                  }}
                >
                  <Text style={{ fontSize: 32, marginBottom: spacing.xs }}>
                    {theme.emoji}
                  </Text>
                  <Text style={{
                    fontSize: typography.sizes.caption,
                    fontWeight: typography.weights.medium,
                    color: colors.foreground,
                    textAlign: 'center',
                    fontFamily: typography.families.primary,
                  }}>
                    {theme.name}
                  </Text>
                  {theme.isPremium && (
                    <Text style={{
                      fontSize: 16,
                      position: 'absolute',
                      top: 8,
                      right: 8,
                    }}>
                      🔒
                    </Text>
                  )}
                </Card>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Back button for parents */}
        <Button
          title="Back"
          onPress={() => router.back()}
          variant="ghost"
          style={{ alignSelf: 'center', marginTop: spacing.lg }}
        />
      </ScrollView>
    </ScreenShell>
  );
}