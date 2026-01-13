import * as Notifications from 'expo-notifications';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { getRandomInsult, IntensityLevel, InsultCategory } from '../data/insults';
import { saveRoast } from './database';

export interface NotificationSettings {
  intensity: IntensityLevel;
  categories: InsultCategory[];
  dailyLimit: number;
  startHour: number;
  endHour: number;
  isPremium: boolean;
}

// Configure notification handling
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function initNotifications(): Promise<void> {
  // Set up notification received listener
  Notifications.addNotificationReceivedListener(notification => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  });
}

export async function requestNotificationPermissions(): Promise<boolean> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();

  if (existingStatus === 'granted') {
    return true;
  }

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleRoasts(settings: NotificationSettings): Promise<void> {
  // Cancel all existing notifications
  await Notifications.cancelAllScheduledNotificationsAsync();

  const { intensity, categories, dailyLimit, startHour, endHour, isPremium } = settings;

  // Calculate random times within the window
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Generate random notification times for today and tomorrow
  for (let dayOffset = 0; dayOffset < 2; dayOffset++) {
    const baseDate = new Date(today);
    baseDate.setDate(baseDate.getDate() + dayOffset);

    const times = generateRandomTimes(dailyLimit, startHour, endHour);

    for (const { hour, minute } of times) {
      const notificationDate = new Date(baseDate);
      notificationDate.setHours(hour, minute, 0, 0);

      // Skip if time has already passed
      if (notificationDate <= now) continue;

      const insult = getRandomInsult(intensity, categories, isPremium);
      if (!insult) continue;

      try {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: getRandomTitle(),
            body: insult.text,
            data: {
              insult: insult.text,
              intensity: insult.intensity,
              category: insult.category,
            },
            sound: true,
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: notificationDate,
          },
        });

        // Save to history when notification is scheduled
        // Note: In production, you'd save when notification is received
        // For now, we save at schedule time for demo purposes
      } catch (error) {
        console.warn('Failed to schedule notification:', error);
      }
    }
  }
}

function generateRandomTimes(
  count: number,
  startHour: number,
  endHour: number
): { hour: number; minute: number }[] {
  const times: { hour: number; minute: number }[] = [];
  const minutesInRange = (endHour - startHour) * 60;

  // Generate unique random times
  const usedMinutes = new Set<number>();

  for (let i = 0; i < count && usedMinutes.size < minutesInRange; i++) {
    let randomMinute: number;
    do {
      randomMinute = Math.floor(Math.random() * minutesInRange);
    } while (usedMinutes.has(randomMinute));

    usedMinutes.add(randomMinute);

    const hour = startHour + Math.floor(randomMinute / 60);
    const minute = randomMinute % 60;
    times.push({ hour, minute });
  }

  return times.sort((a, b) => a.hour * 60 + a.minute - (b.hour * 60 + b.minute));
}

function getRandomTitle(): string {
  const titles = [
    "Hey, you.",
    "Reality check",
    "Friendly reminder",
    "FYI",
    "Just so you know",
    "Heads up",
    "Quick thought",
    "About you...",
    "Don't forget",
    "Breaking news",
  ];
  return titles[Math.floor(Math.random() * titles.length)];
}

// Handle notification response (when user taps notification)
export function setupNotificationResponseHandler(
  onResponse: (insult: string, intensity: string, category: string) => void
): () => void {
  const subscription = Notifications.addNotificationResponseReceivedListener(response => {
    const data = response.notification.request.content.data;
    if (data?.insult) {
      // Save to history when notification is tapped
      saveRoast(data.insult as string, data.intensity as string, data.category as string);
      onResponse(data.insult as string, data.intensity as string, data.category as string);
    }
  });

  return () => subscription.remove();
}

// Also save when notification is received (not just tapped)
export function setupNotificationReceivedHandler(): () => void {
  const subscription = Notifications.addNotificationReceivedListener(notification => {
    const data = notification.request.content.data;
    if (data?.insult) {
      saveRoast(data.insult as string, data.intensity as string, data.category as string);
    }
  });

  return () => subscription.remove();
}
