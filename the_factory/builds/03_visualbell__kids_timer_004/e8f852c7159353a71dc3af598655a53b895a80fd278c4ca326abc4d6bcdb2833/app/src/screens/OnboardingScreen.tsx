import React, { useState } from 'react';
import { View, Text, Image } from 'react-native';
import { ScreenShell, Button, Card } from '../ui/components';
import { colors, typography, spacing } from '../ui/tokens';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const onboardingSteps = [
  {
    title: "Welcome to VisualBell!",
    description: "A visual timer designed specially for kids to help them stay focused and complete tasks.",
    icon: "⏰",
  },
  {
    title: "Visual & Fun",
    description: "Watch the colorful timer countdown with engaging animations that keep kids excited about time.",
    icon: "🎨",
  },
  {
    title: "Child-Friendly",
    description: "Simple, safe interface designed for little hands and growing minds. No complex buttons or confusing menus.",
    icon: "👶",
  },
  {
    title: "Let's Get Started!",
    description: "Ready to help your child develop better time awareness and focus? Let's set up your first timer!",
    icon: "🚀",
  }
];

export default function OnboardingScreen() {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const handleSkip = () => {
    completeOnboarding();
  };

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
      router.replace('/time-selection');
    } catch (error) {
      console.error('Failed to save onboarding completion:', error);
      router.replace('/time-selection');
    }
  };

  const currentOnboardingStep = onboardingSteps[currentStep];

  return (
    <ScreenShell variant="child">
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        paddingHorizontal: spacing.xl,
      }}>
        {/* Progress Indicator */}
        <View style={{
          flexDirection: 'row',
          marginBottom: spacing['2xl'],
        }}>
          {onboardingSteps.map((_, index) => (
            <View
              key={index}
              style={{
                width: 12,
                height: 12,
                borderRadius: 6,
                backgroundColor: index <= currentStep ? colors.primary : colors.mutedForeground,
                marginHorizontal: spacing.xs,
              }}
            />
          ))}
        </View>

        {/* Main Content */}
        <Card variant="elevated" padding="extraLarge" style={{ 
          width: '100%',
          alignItems: 'center',
          marginBottom: spacing['2xl'],
        }}>
          <Text style={{
            fontSize: 72,
            textAlign: 'center',
            marginBottom: spacing.lg,
          }}>
            {currentOnboardingStep.icon}
          </Text>

          <Text style={{
            fontSize: typography.sizes.headingLarge,
            fontFamily: typography.families.primary,
            fontWeight: 'bold',
            color: colors.primary,
            textAlign: 'center',
            marginBottom: spacing.lg,
          }}>
            {currentOnboardingStep.title}
          </Text>

          <Text style={{
            fontSize: typography.sizes.bodyLarge,
            fontFamily: typography.families.primary,
            color: colors.foreground,
            textAlign: 'center',
            lineHeight: 24,
          }}>
            {currentOnboardingStep.description}
          </Text>
        </Card>

        {/* Action Buttons */}
        <View style={{ 
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <Button
            title="Skip"
            onPress={handleSkip}
            variant="ghost"
            style={{ 
              opacity: currentStep === onboardingSteps.length - 1 ? 0 : 1,
            }}
            disabled={currentStep === onboardingSteps.length - 1}
          />

          <Button
            title={currentStep === onboardingSteps.length - 1 ? "Get Started!" : "Next"}
            onPress={handleNext}
            size="large"
            style={{ flex: 1, marginLeft: spacing.lg }}
          />
        </View>
      </View>
    </ScreenShell>
  );
}