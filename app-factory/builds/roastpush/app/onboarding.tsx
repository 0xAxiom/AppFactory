import { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../src/ui/theme';
import { requestNotificationPermissions } from '../src/services/notifications';

const ONBOARDING_KEY = 'roastpush_onboarding_complete';
const { width } = Dimensions.get('window');

const slides = [
  {
    icon: 'flame' as const,
    title: 'Get Roasted',
    subtitle: 'Random insults delivered straight to your notifications.',
    description: "No effort required. Just turn it on and let the burns fly.",
  },
  {
    icon: 'notifications' as const,
    title: 'Surprise Attacks',
    subtitle: "You'll never know when the next roast hits.",
    description: 'Set your schedule. Control the intensity. Brace yourself.',
  },
  {
    icon: 'skull' as const,
    title: 'Choose Your Pain',
    subtitle: 'From mild teasing to savage destruction.',
    description: "Pick your intensity level. We don't judge. Much.",
  },
];

export default function Onboarding() {
  const [currentPage, setCurrentPage] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const page = Math.round(event.nativeEvent.contentOffset.x / width);
    if (page !== currentPage) {
      setCurrentPage(page);
      Haptics.selectionAsync();
    }
  };

  const handleNext = async () => {
    if (currentPage < slides.length - 1) {
      scrollRef.current?.scrollTo({ x: width * (currentPage + 1), animated: true });
    } else {
      await requestNotificationPermissions();
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace('/home');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {slides.map((slide, index) => (
          <View key={index} style={styles.slide}>
            <View style={styles.iconContainer}>
              <Ionicons name={slide.icon} size={80} color={colors.accent} />
            </View>
            <Text style={styles.title}>{slide.title}</Text>
            <Text style={styles.subtitle}>{slide.subtitle}</Text>
            <Text style={styles.description}>{slide.description}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentPage && styles.dotActive,
              ]}
            />
          ))}
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>
            {currentPage === slides.length - 1 ? "Let's Go" : 'Next'}
          </Text>
          <Ionicons
            name={currentPage === slides.length - 1 ? 'checkmark' : 'arrow-forward'}
            size={20}
            color={colors.background}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  slide: {
    width,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.h3,
    color: colors.accent,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: 300,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
    paddingTop: spacing.lg,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.surface,
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: colors.accent,
    width: 24,
  },
  button: {
    backgroundColor: colors.accent,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
  },
  buttonText: {
    ...typography.button,
    color: colors.background,
  },
});
