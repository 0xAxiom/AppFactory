import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Alert, AppState, AppStateStatus } from 'react-native';
import { ScreenShell, Button, Card } from '../ui/components';
import { CircularTimer } from '../components/timer/CircularTimer';
import { colors, typography, spacing } from '../ui/tokens';
import * as Notifications from 'expo-notifications';
import { Audio } from 'expo-av';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Timer state management
interface TimerState {
  duration: number;      // Total timer duration in seconds
  remainingTime: number; // Time remaining in seconds
  isRunning: boolean;    // Whether timer is actively counting down
  isPaused: boolean;     // Whether timer is paused
  startTime: Date | null; // When current session started
  theme: 'default' | 'space' | 'underwater' | 'garden';
}

export default function HomeScreen() {
  const [timerState, setTimerState] = useState<TimerState>({
    duration: 0,
    remainingTime: 0,
    isRunning: false,
    isPaused: false,
    startTime: null,
    theme: 'default',
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const appState = useRef(AppState.currentState);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true);

  // Check onboarding status and navigate appropriately
  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const hasCompletedOnboarding = await AsyncStorage.getItem('hasCompletedOnboarding');
      
      if (!hasCompletedOnboarding) {
        router.replace('/onboarding');
      } else if (timerState.duration === 0) {
        router.push('/time-selection');
      }
    } catch (error) {
      console.error('Failed to check onboarding status:', error);
      // If we can't check, assume onboarding is needed
      router.replace('/onboarding');
    } finally {
      setIsCheckingOnboarding(false);
    }
  };

  // Timer countdown logic
  useEffect(() => {
    if (timerState.isRunning && !timerState.isPaused && timerState.remainingTime > 0) {
      timerRef.current = setInterval(() => {
        setTimerState(prev => {
          const newRemainingTime = Math.max(0, prev.remainingTime - 1);
          
          if (newRemainingTime <= 0) {
            return {
              ...prev,
              remainingTime: 0,
              isRunning: false,
            };
          }
          
          return {
            ...prev,
            remainingTime: newRemainingTime,
          };
        });
      }, 1000);

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }
  }, [timerState.isRunning, timerState.isPaused, timerState.remainingTime]);

  // Handle app state changes (background/foreground)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription?.remove();
  }, []);

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (timerState.isRunning && !timerState.isPaused) {
      if (nextAppState === 'background') {
        // Schedule notification for timer completion
        scheduleTimerNotification();
      } else if (nextAppState === 'active') {
        // Cancel notification and sync timer
        Notifications.cancelAllScheduledNotificationsAsync();
        syncTimerWithRealTime();
      }
    }
    appState.current = nextAppState;
  };

  const scheduleTimerNotification = async () => {
    if (timerState.remainingTime <= 0) return;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'VisualBell Timer',
        body: 'Your timer is done! Great job! ⏰',
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: {
        seconds: timerState.remainingTime,
      },
    });
  };

  const syncTimerWithRealTime = () => {
    if (!timerState.startTime) return;

    const now = new Date();
    const elapsedMs = now.getTime() - timerState.startTime.getTime();
    const elapsedSeconds = Math.floor(elapsedMs / 1000);
    const newRemainingTime = Math.max(0, timerState.duration - elapsedSeconds);

    setTimerState(prev => ({
      ...prev,
      remainingTime: newRemainingTime,
      isRunning: newRemainingTime > 0,
    }));
  };

  const startTimer = (duration: number, theme: string = 'default') => {
    setTimerState({
      duration,
      remainingTime: duration,
      isRunning: true,
      isPaused: false,
      startTime: new Date(),
      theme: theme as any,
    });
  };

  const pauseTimer = () => {
    setTimerState(prev => ({
      ...prev,
      isRunning: false,
      isPaused: true,
    }));
  };

  const resumeTimer = () => {
    setTimerState(prev => ({
      ...prev,
      isRunning: true,
      isPaused: false,
      startTime: new Date(Date.now() - (prev.duration - prev.remainingTime) * 1000),
    }));
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    Alert.alert(
      'Stop Timer?',
      'Are you sure you want to stop the timer?',
      [
        { text: 'Keep Going', style: 'cancel' },
        {
          text: 'Stop Timer',
          style: 'destructive',
          onPress: () => {
            setTimerState({
              duration: 0,
              remainingTime: 0,
              isRunning: false,
              isPaused: false,
              startTime: null,
              theme: 'default',
            });
            router.push('/time-selection');
          },
        },
      ]
    );
  };

  const handleTimerComplete = async () => {
    // Play completion sound (placeholder for now)
    try {
      // TODO: Add sound file at assets/sounds/gentle-chime.mp3
      console.log('Timer completed - would play completion sound');
    } catch (error) {
      console.log('Could not play completion sound:', error);
    }

    // Show completion celebration
    Alert.alert(
      '🎉 Time\'s Up! 🎉',
      'Great job completing your timer!',
      [
        {
          text: 'Start Another Timer',
          onPress: () => {
            setTimerState({
              duration: 0,
              remainingTime: 0,
              isRunning: false,
              isPaused: false,
              startTime: null,
              theme: 'default',
            });
            router.push('/time-selection');
          },
        },
      ]
    );
  };

  // Cleanup sound on unmount
  useEffect(() => {
    return sound ? () => {
      sound.unloadAsync();
    } : undefined;
  }, [sound]);

  if (isCheckingOnboarding || timerState.duration === 0) {
    // Show loading while checking onboarding or redirecting
    return (
      <ScreenShell variant="child">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{
            fontSize: typography.sizes.headingMedium,
            color: colors.muted,
            fontFamily: typography.families.primary,
          }}>
            Loading...
          </Text>
        </View>
      </ScreenShell>
    );
  }

  return (
    <ScreenShell variant="child">
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        paddingBottom: spacing['3xl'],
      }}>
        {/* Main Timer Display */}
        <Card variant="timer" padding="extraLarge" style={{ marginBottom: spacing['2xl'] }}>
          <CircularTimer
            duration={timerState.duration}
            remainingTime={timerState.remainingTime}
            isRunning={timerState.isRunning}
            isPaused={timerState.isPaused}
            onComplete={handleTimerComplete}
            onPause={pauseTimer}
            onResume={resumeTimer}
            theme={timerState.theme}
          />
        </Card>

        {/* Control Buttons */}
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-around',
          width: '100%',
          paddingHorizontal: spacing.lg,
        }}>
          {timerState.isRunning || timerState.isPaused ? (
            <>
              <Button
                title={timerState.isPaused ? "▶️ Start" : "⏸️ Pause"}
                onPress={timerState.isPaused ? resumeTimer : pauseTimer}
                size="large"
                style={{ flex: 1, marginRight: spacing.md }}
              />
              <Button
                title="⏹️ Stop"
                onPress={stopTimer}
                variant="secondary"
                size="large"
                style={{ flex: 1, marginLeft: spacing.md }}
              />
            </>
          ) : (
            <Button
              title="🎯 New Timer"
              onPress={() => router.push('/time-selection')}
              size="large"
              style={{ width: '80%' }}
            />
          )}
        </View>

        {/* Parent Settings Access (Hidden) */}
        <View style={{ 
          position: 'absolute', 
          bottom: spacing.lg, 
          right: spacing.lg,
          width: 60,
          height: 60,
        }}>
          <Button
            title="⚙️"
            onPress={() => router.push('/settings')}
            variant="ghost"
            size="small"
            style={{ opacity: 0.3 }}
          />
        </View>
      </View>
    </ScreenShell>
  );
}