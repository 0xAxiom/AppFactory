import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Purchases, { CustomerInfo, PurchasesOffering, PurchasesPackage, PurchasesError } from 'react-native-purchases';

interface SubscriptionContextType {
  isSubscribed: boolean;
  customerInfo: CustomerInfo | null;
  offerings: PurchasesOffering | null;
  isLoading: boolean;
  error: string | null;
  purchasePackage: (packageToPurchase: PurchasesPackage) => Promise<boolean>;
  restorePurchases: () => Promise<boolean>;
  isInitialized: boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [offerings, setOfferings] = useState<PurchasesOffering | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Check if user has pro entitlement
  const isSubscribed = customerInfo?.entitlements.active.pro !== undefined;

  useEffect(() => {
    initializePurchases();
  }, []);

  const initializePurchases = async () => {
    try {
      // Get API keys from environment
      const iosApiKey = process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY;
      const androidApiKey = process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY;

      // Use placeholder keys if not provided (with warning)
      const apiKey = iosApiKey || androidApiKey;
      if (!apiKey) {
        console.warn('⚠️ DEV WARNING: RevenueCat API keys not found in environment variables.');
        console.warn('⚠️ Please set EXPO_PUBLIC_REVENUECAT_IOS_API_KEY and EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY');
        setError('RevenueCat not configured. Please check environment variables.');
        setIsLoading(false);
        return;
      }

      // Configure debug logging
      if (__DEV__) {
        Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);
      }

      // Initialize Purchases
      await Purchases.configure({ apiKey });
      console.log('✅ RevenueCat initialized successfully');

      // Get initial customer info
      const info = await Purchases.getCustomerInfo();
      setCustomerInfo(info);

      // Get current offering
      const currentOfferings = await Purchases.getOfferings();
      if (currentOfferings.current) {
        setOfferings(currentOfferings.current);
        console.log('✅ RevenueCat offerings loaded:', currentOfferings.current.identifier);
      } else {
        console.warn('⚠️ No current offering found. Check RevenueCat dashboard configuration.');
        setError('No subscription packages available. Please check your configuration.');
      }

      setIsInitialized(true);
    } catch (err) {
      console.error('❌ Failed to initialize RevenueCat:', err);
      setError(err instanceof Error ? err.message : 'Failed to initialize RevenueCat');
    } finally {
      setIsLoading(false);
    }
  };

  const purchasePackage = async (packageToPurchase: PurchasesPackage): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const { customerInfo: updatedCustomerInfo } = await Purchases.purchasePackage(packageToPurchase);
      setCustomerInfo(updatedCustomerInfo);

      console.log('✅ Purchase successful');
      return true;
    } catch (err) {
      const purchaseError = err as PurchasesError;
      
      if (purchaseError.userCancelled) {
        console.log('ℹ️ User cancelled purchase');
        return false;
      }

      console.error('❌ Purchase failed:', purchaseError.message);
      setError(purchaseError.message || 'Purchase failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const restorePurchases = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const restoredCustomerInfo = await Purchases.restorePurchases();
      setCustomerInfo(restoredCustomerInfo);

      console.log('✅ Purchases restored successfully');
      return true;
    } catch (err) {
      const restoreError = err as PurchasesError;
      console.error('❌ Restore failed:', restoreError.message);
      setError(restoreError.message || 'Failed to restore purchases');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SubscriptionContext.Provider
      value={{
        isSubscribed,
        customerInfo,
        offerings,
        isLoading,
        error,
        purchasePackage,
        restorePurchases,
        isInitialized,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}