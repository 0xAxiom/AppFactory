// Onboarding Screen for new users
// Introduces professional EVP investigation features

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

import { useTheme } from '../styles/theme';
import { useDatabase, SettingsRepository } from '../services/database';

const { width: screenWidth } = Dimensions.get('window');

const OnboardingScreen = () => {
  const navigation = useNavigation();
  const { colors, typography, spacing } = useTheme();
  const { database } = useDatabase();
  
  const [currentStep, setCurrentStep] = useState(0);

  const onboardingSteps = [
    {
      icon: '🔬',
      title: 'Professional EVP Analysis',
      description: 'Replace expensive hardware with superior mobile analysis capabilities. Professional-grade tools designed for serious paranormal investigators.'
    },
    {
      icon: '📊',
      title: 'Automatic Anomaly Detection',
      description: 'Advanced algorithms automatically detect and timestamp unusual audio patterns during recording, so you never miss potential evidence.'
    },
    {
      icon: '💼',
      title: 'Evidence-Quality Documentation',
      description: 'Export professional formats (WAV, FLAC) with metadata for credible investigation documentation and team collaboration.'
    },
    {
      icon: '🎯',
      title: 'Ready to Begin',
      description: 'Start your first investigation session to experience authentic professional-grade EVP analysis tools.'
    }
  ];

  const handleNext = async () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      await completeOnboarding();
    }
  };

  const handleSkip = async () => {
    await completeOnboarding();
  };

  const completeOnboarding = async () => {
    if (database) {
      try {
        const settingsRepo = new SettingsRepository(database);
        await settingsRepo.set('onboarding_completed', true, 'boolean');
      } catch (error) {
        console.error('Failed to save onboarding completion:', error);
      }
    }
    
    navigation.replace('Main');
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.primary,
      paddingHorizontal: spacing.lg,
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    icon: {
      fontSize: 80,
      marginBottom: spacing.xl,
    },
    title: {
      ...typography.h1,
      color: colors.text.primary,
      textAlign: 'center',
      marginBottom: spacing.lg,
    },
    description: {
      ...typography.body,
      color: colors.text.secondary,
      textAlign: 'center',
      lineHeight: 24,
      paddingHorizontal: spacing.md,
    },
    footer: {
      paddingBottom: spacing.xl,
    },
    pagination: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: spacing.lg,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.text.tertiary,
      marginHorizontal: 4,
    },
    activeDot: {
      backgroundColor: colors.primary,
      width: 20,
    },
    buttons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    skipButton: {
      padding: spacing.md,
    },
    skipText: {
      ...typography.body,
      color: colors.text.secondary,
    },
    nextButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      borderRadius: 8,
      flexDirection: 'row',
      alignItems: 'center',
    },
    nextText: {
      ...typography.button,
      color: colors.text.primary,
      marginRight: spacing.sm,
    },
  });

  const currentStepData = onboardingSteps[currentStep];

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.icon}>{currentStepData.icon}</Text>
        <Text style={styles.title}>{currentStepData.title}</Text>
        <Text style={styles.description}>{currentStepData.description}</Text>
      </View>

      <View style={styles.footer}>
        {/* Pagination dots */}
        <View style={styles.pagination}>
          {onboardingSteps.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentStep && styles.activeDot
              ]}
            />
          ))}
        </View>

        {/* Navigation buttons */}
        <View style={styles.buttons}>
          <TouchableOpacity 
            style={styles.skipButton} 
            onPress={handleSkip}
          >
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.nextButton} 
            onPress={handleNext}
          >
            <Text style={styles.nextText}>
              {currentStep === onboardingSteps.length - 1 ? 'Get Started' : 'Next'}
            </Text>
            <Icon 
              name={currentStep === onboardingSteps.length - 1 ? 'check' : 'arrow-forward'} 
              size={20} 
              color={colors.text.primary} 
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default OnboardingScreen;