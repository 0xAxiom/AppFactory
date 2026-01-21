import { create } from 'zustand';
import { CustomerInfo } from 'react-native-purchases';
import {
  getCustomerInfo,
  isPremium as checkIsPremium,
  purchasePackage,
  restorePurchases,
  getOfferings,
} from '../lib/revenuecat';

export interface PremiumState {
  // Core state
  customerInfo: CustomerInfo | null;
  isPremium: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  checkPremiumStatus: () => Promise<void>;
  purchase: (packageIdentifier: string) => Promise<boolean>;
  restore: () => Promise<boolean>;
  clearError: () => void;
}

export const usePremiumStore = create<PremiumState>((set, get) => ({
  customerInfo: null,
  isPremium: false,
  isLoading: false,
  error: null,

  checkPremiumStatus: async () => {
    try {
      set({ isLoading: true, error: null });
      const customerInfo = await getCustomerInfo();
      const premium = checkIsPremium(customerInfo);

      set({
        customerInfo,
        isPremium: premium,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to check premium status',
      });
    }
  },

  purchase: async (packageIdentifier: string) => {
    try {
      set({ isLoading: true, error: null });

      const offerings = await getOfferings();
      if (!offerings?.current) {
        throw new Error('No offerings available');
      }

      const packageToPurchase = offerings.current.availablePackages.find(
        (pkg) => pkg.identifier === packageIdentifier
      );

      if (!packageToPurchase) {
        throw new Error(`Package ${packageIdentifier} not found`);
      }

      const result = await purchasePackage(packageToPurchase);
      const premium = checkIsPremium(result.customerInfo);

      set({
        customerInfo: result.customerInfo,
        isPremium: premium,
        isLoading: false,
      });

      return result.success;
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Purchase failed',
      });
      return false;
    }
  },

  restore: async () => {
    try {
      set({ isLoading: true, error: null });

      const customerInfo = await restorePurchases();
      const premium = checkIsPremium(customerInfo);

      set({
        customerInfo,
        isPremium: premium,
        isLoading: false,
      });

      return true;
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Restore failed',
      });
      return false;
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
