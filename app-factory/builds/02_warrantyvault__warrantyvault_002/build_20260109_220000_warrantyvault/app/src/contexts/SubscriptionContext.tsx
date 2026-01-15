/**
 * Subscription Context - Manages RevenueCat subscription state
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import Purchases, {
  CustomerInfo,
  PurchasesPackage,
  PurchasesOffering,
  LOG_LEVEL,
} from 'react-native-purchases';
import Constants from 'expo-constants';

// RevenueCat configuration
const REVENUECAT_IOS_KEY = Constants.expoConfig?.extra?.revenuecatIosKey || '';
const REVENUECAT_ANDROID_KEY = Constants.expoConfig?.extra?.revenuecatAndroidKey || '';
const PREMIUM_ENTITLEMENT_ID = 'premium';
const FREE_TIER_LIMIT = 10;

interface SubscriptionContextValue {
  isPremium: boolean;
  isLoading: boolean;
  error: string | null;
  offerings: PurchasesOffering | null;
  customerInfo: CustomerInfo | null;
  canAddMoreItems: (currentCount: number) => boolean;
  purchase: (pkg: PurchasesPackage) => Promise<boolean>;
  restorePurchases: () => Promise<boolean>;
  checkEntitlement: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextValue | null>(null);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offerings, setOfferings] = useState<PurchasesOffering | null>(null);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);

  // Initialize RevenueCat
  useEffect(() => {
    const initializePurchases = async () => {
      try {
        const apiKey = Platform.OS === 'ios' ? REVENUECAT_IOS_KEY : REVENUECAT_ANDROID_KEY;

        if (!apiKey) {
          if (__DEV__) {
            console.warn(
              'RevenueCat API key not configured. Running in free mode.',
              'Set EXPO_PUBLIC_REVENUECAT_IOS_KEY or EXPO_PUBLIC_REVENUECAT_ANDROID_KEY'
            );
          }
          setIsLoading(false);
          return;
        }

        if (__DEV__) {
          Purchases.setLogLevel(LOG_LEVEL.DEBUG);
        }

        await Purchases.configure({ apiKey });

        // Fetch customer info and offerings
        const info = await Purchases.getCustomerInfo();
        setCustomerInfo(info);
        setIsPremium(info.entitlements.active[PREMIUM_ENTITLEMENT_ID] !== undefined);

        const offers = await Purchases.getOfferings();
        setOfferings(offers.current);

        // Listen for customer info changes
        Purchases.addCustomerInfoUpdateListener((info) => {
          setCustomerInfo(info);
          setIsPremium(info.entitlements.active[PREMIUM_ENTITLEMENT_ID] !== undefined);
        });
      } catch (err) {
        console.error('Error initializing RevenueCat:', err);
        setError('Failed to initialize subscriptions');
      } finally {
        setIsLoading(false);
      }
    };

    initializePurchases();
  }, []);

  // Check if user can add more items
  const canAddMoreItems = useCallback((currentCount: number): boolean => {
    if (isPremium) return true;
    return currentCount < FREE_TIER_LIMIT;
  }, [isPremium]);

  // Purchase a package
  const purchase = useCallback(async (pkg: PurchasesPackage): Promise<boolean> => {
    try {
      setError(null);
      const { customerInfo } = await Purchases.purchasePackage(pkg);
      setCustomerInfo(customerInfo);
      const hasPremium = customerInfo.entitlements.active[PREMIUM_ENTITLEMENT_ID] !== undefined;
      setIsPremium(hasPremium);
      return hasPremium;
    } catch (err: any) {
      if (!err.userCancelled) {
        console.error('Purchase error:', err);
        setError('Purchase failed. Please try again.');
      }
      return false;
    }
  }, []);

  // Restore purchases
  const restorePurchases = useCallback(async (): Promise<boolean> => {
    try {
      setError(null);
      const customerInfo = await Purchases.restorePurchases();
      setCustomerInfo(customerInfo);
      const hasPremium = customerInfo.entitlements.active[PREMIUM_ENTITLEMENT_ID] !== undefined;
      setIsPremium(hasPremium);
      return hasPremium;
    } catch (err) {
      console.error('Restore error:', err);
      setError('Failed to restore purchases');
      return false;
    }
  }, []);

  // Re-check entitlement
  const checkEntitlement = useCallback(async () => {
    try {
      const info = await Purchases.getCustomerInfo();
      setCustomerInfo(info);
      setIsPremium(info.entitlements.active[PREMIUM_ENTITLEMENT_ID] !== undefined);
    } catch (err) {
      console.error('Error checking entitlement:', err);
    }
  }, []);

  const value: SubscriptionContextValue = {
    isPremium,
    isLoading,
    error,
    offerings,
    customerInfo,
    canAddMoreItems,
    purchase,
    restorePurchases,
    checkEntitlement,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}

export { FREE_TIER_LIMIT, PREMIUM_ENTITLEMENT_ID };
