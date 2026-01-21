/**
 * Analytics Integration (Optional)
 *
 * This module provides a simple analytics wrapper using PostHog.
 * PostHog is privacy-focused and has a generous free tier (1M events/month).
 *
 * Setup:
 * 1. Create account at https://posthog.com
 * 2. Get your API key from Project Settings
 * 3. Add to .env: EXPO_PUBLIC_POSTHOG_API_KEY=phc_xxxx
 * 4. Add to .env: EXPO_PUBLIC_POSTHOG_HOST=https://app.posthog.com
 *
 * Installation:
 *   npx expo install posthog-react-native
 *
 * Usage:
 *   import { analytics } from './lib/analytics';
 *   analytics.track('button_pressed', { button: 'upgrade' });
 */

import Constants from 'expo-constants';

// Type definitions for events
export interface AnalyticsEvents {
  // App lifecycle
  app_opened: Record<string, never>;
  app_backgrounded: Record<string, never>;

  // Onboarding
  onboarding_started: Record<string, never>;
  onboarding_completed: { screens_viewed: number };
  onboarding_skipped: { screen: string };

  // Core actions
  feature_used: { feature: string; context?: string };
  button_pressed: { button: string; screen?: string };
  screen_viewed: { screen: string };

  // Monetization
  paywall_viewed: { trigger: string };
  purchase_started: { product: string; price?: string };
  purchase_completed: { product: string; price?: string };
  purchase_cancelled: { product: string };
  purchase_restored: Record<string, never>;

  // Errors
  error_occurred: { error: string; context?: string };

  // Custom events (add your own)
  [key: string]: Record<string, unknown>;
}

// Check if PostHog is configured
const POSTHOG_API_KEY =
  Constants.expoConfig?.extra?.posthogApiKey ||
  process.env.EXPO_PUBLIC_POSTHOG_API_KEY;
const POSTHOG_HOST =
  Constants.expoConfig?.extra?.posthogHost ||
  process.env.EXPO_PUBLIC_POSTHOG_HOST ||
  'https://app.posthog.com';

const isConfigured = Boolean(POSTHOG_API_KEY);

// PostHog instance (lazy loaded)
let posthogInstance: any = null;

async function getPostHog() {
  if (!isConfigured) return null;

  if (!posthogInstance) {
    try {
      // Dynamic import to avoid errors if not installed
      const PostHog = await import('posthog-react-native');
      posthogInstance = new PostHog.PostHog(POSTHOG_API_KEY!, {
        host: POSTHOG_HOST,
      });
    } catch (error) {
      if (__DEV__) {
        console.warn(
          'PostHog not installed. Run: npx expo install posthog-react-native'
        );
      }
      return null;
    }
  }

  return posthogInstance;
}

/**
 * Analytics API
 */
export const analytics = {
  /**
   * Track an event
   */
  async track<K extends keyof AnalyticsEvents>(
    event: K,
    properties?: AnalyticsEvents[K]
  ): Promise<void> {
    const posthog = await getPostHog();
    if (posthog) {
      posthog.capture(event, properties);
    }

    if (__DEV__) {
      console.log(`[Analytics] ${event}`, properties);
    }
  },

  /**
   * Identify a user (call after purchase or sign-in)
   */
  async identify(
    userId: string,
    traits?: Record<string, unknown>
  ): Promise<void> {
    const posthog = await getPostHog();
    if (posthog) {
      posthog.identify(userId, traits);
    }

    if (__DEV__) {
      console.log(`[Analytics] Identify: ${userId}`, traits);
    }
  },

  /**
   * Set user properties without identifying
   */
  async setUserProperties(properties: Record<string, unknown>): Promise<void> {
    const posthog = await getPostHog();
    if (posthog) {
      posthog.capture('$set', { $set: properties });
    }
  },

  /**
   * Track screen view
   */
  async screen(
    screenName: string,
    properties?: Record<string, unknown>
  ): Promise<void> {
    const posthog = await getPostHog();
    if (posthog) {
      posthog.screen(screenName, properties);
    }

    if (__DEV__) {
      console.log(`[Analytics] Screen: ${screenName}`, properties);
    }
  },

  /**
   * Reset analytics (call on logout)
   */
  async reset(): Promise<void> {
    const posthog = await getPostHog();
    if (posthog) {
      posthog.reset();
    }
  },

  /**
   * Flush any pending events
   */
  async flush(): Promise<void> {
    const posthog = await getPostHog();
    if (posthog) {
      await posthog.flush();
    }
  },

  /**
   * Check if analytics is configured
   */
  isConfigured(): boolean {
    return isConfigured;
  },
};

/**
 * Hook for tracking screen views with Expo Router
 *
 * Usage in _layout.tsx:
 *   import { useAnalyticsScreen } from './lib/analytics';
 *   useAnalyticsScreen();
 */
export function useAnalyticsScreen() {
  // This would integrate with Expo Router's navigation state
  // For now, it's a placeholder for manual screen tracking
}

export default analytics;
