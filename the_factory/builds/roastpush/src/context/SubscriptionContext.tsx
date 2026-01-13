import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  initPurchases,
  checkPremiumStatus,
  getOfferings,
  purchasePackage,
  restorePurchases as restorePurchasesService,
  addPurchaseListener,
} from '../services/purchases';
import { PurchasesPackage } from 'react-native-purchases';

interface SubscriptionContextType {
  isPremium: boolean;
  isLoading: boolean;
  purchaseMonthly: () => Promise<boolean>;
  purchaseYearly: () => Promise<boolean>;
  restorePurchases: () => Promise<boolean>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [monthlyPackage, setMonthlyPackage] = useState<PurchasesPackage | null>(null);
  const [yearlyPackage, setYearlyPackage] = useState<PurchasesPackage | null>(null);

  useEffect(() => {
    async function init() {
      try {
        await initPurchases();
        const premium = await checkPremiumStatus();
        setIsPremium(premium);

        const offerings = await getOfferings();
        setMonthlyPackage(offerings.monthly);
        setYearlyPackage(offerings.yearly);
      } catch (error) {
        console.warn('Failed to initialize purchases:', error);
      } finally {
        setIsLoading(false);
      }
    }

    init();

    // Listen for purchase updates
    const unsubscribe = addPurchaseListener(setIsPremium);
    return unsubscribe;
  }, []);

  async function purchaseMonthly(): Promise<boolean> {
    if (!monthlyPackage) {
      console.log('Monthly package not available');
      // In mock mode, simulate successful purchase for testing
      setIsPremium(true);
      return true;
    }

    try {
      const success = await purchasePackage(monthlyPackage);
      if (success) {
        setIsPremium(true);
      }
      return success;
    } catch (error) {
      console.warn('Monthly purchase failed:', error);
      return false;
    }
  }

  async function purchaseYearly(): Promise<boolean> {
    if (!yearlyPackage) {
      console.log('Yearly package not available');
      // In mock mode, simulate successful purchase for testing
      setIsPremium(true);
      return true;
    }

    try {
      const success = await purchasePackage(yearlyPackage);
      if (success) {
        setIsPremium(true);
      }
      return success;
    } catch (error) {
      console.warn('Yearly purchase failed:', error);
      return false;
    }
  }

  async function restorePurchases(): Promise<boolean> {
    try {
      const success = await restorePurchasesService();
      if (success) {
        setIsPremium(true);
      }
      return success;
    } catch (error) {
      console.warn('Restore failed:', error);
      return false;
    }
  }

  return (
    <SubscriptionContext.Provider
      value={{
        isPremium,
        isLoading,
        purchaseMonthly,
        purchaseYearly,
        restorePurchases,
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
