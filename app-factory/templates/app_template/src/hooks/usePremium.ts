/**
 * usePremium Hook
 *
 * Convenience hook for checking premium status and triggering purchases.
 * Wraps the premiumStore for simpler component usage.
 *
 * Usage:
 *   const { isPremium, isLoading, showPaywall } = usePremium();
 *
 *   if (!isPremium) {
 *     return <Button onPress={showPaywall} title="Upgrade" />;
 *   }
 */

import { useCallback, useEffect } from 'react';
import { router } from 'expo-router';
import { usePremiumStore } from '../store/premiumStore';

interface UsePremiumReturn {
  /** Whether user has active premium subscription */
  isPremium: boolean;
  /** Whether a purchase/restore operation is in progress */
  isLoading: boolean;
  /** Last error message, if any */
  error: string | null;
  /** Navigate to paywall screen */
  showPaywall: () => void;
  /** Check current premium status (refreshes from RevenueCat) */
  refresh: () => Promise<void>;
  /** Restore previous purchases */
  restore: () => Promise<boolean>;
  /** Clear any error state */
  clearError: () => void;
}

export function usePremium(): UsePremiumReturn {
  const {
    isPremium,
    isLoading,
    error,
    checkPremiumStatus,
    restore,
    clearError,
  } = usePremiumStore();

  // Check premium status on mount
  useEffect(() => {
    checkPremiumStatus();
  }, []);

  const showPaywall = useCallback(() => {
    router.push('/paywall');
  }, []);

  return {
    isPremium,
    isLoading,
    error,
    showPaywall,
    refresh: checkPremiumStatus,
    restore,
    clearError,
  };
}

/**
 * Gate component - renders children only if user is premium
 *
 * Usage:
 *   <PremiumGate fallback={<UpgradePrompt />}>
 *     <PremiumFeature />
 *   </PremiumGate>
 */
export function usePremiumGate() {
  const { isPremium, showPaywall } = usePremium();

  const requirePremium = useCallback(
    (action: () => void) => {
      if (isPremium) {
        action();
      } else {
        showPaywall();
      }
    },
    [isPremium, showPaywall]
  );

  return {
    isPremium,
    requirePremium,
    showPaywall,
  };
}
