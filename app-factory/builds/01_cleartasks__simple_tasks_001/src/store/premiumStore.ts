import { create } from 'zustand';
import Purchases, { CustomerInfo } from 'react-native-purchases';

interface PremiumStore {
  isPremium: boolean;
  isLoading: boolean;
  purchasePackage: (packageIdentifier: string) => Promise<void>;
  restorePurchases: () => Promise<void>;
  checkPremiumStatus: () => Promise<void>;
}

export const usePremiumStore = create<PremiumStore>((set, get) => ({
  isPremium: false,
  isLoading: false,

  purchasePackage: async (packageIdentifier: string) => {
    try {
      set({ isLoading: true });
      
      const offerings = await Purchases.getOfferings();
      const packages = offerings.current?.availablePackages || [];
      const packageToPurchase = packages.find(pkg => 
        pkg.identifier === packageIdentifier
      );

      if (packageToPurchase) {
        const purchaseResult = await Purchases.purchasePackage(packageToPurchase);
        const customerInfo = purchaseResult.customerInfo;
        
        const isPremium = customerInfo.entitlements.active['premium'] != null;
        set({ isPremium });
      }
    } catch (error) {
      console.error('Purchase error:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  restorePurchases: async () => {
    try {
      set({ isLoading: true });
      const customerInfo = await Purchases.restorePurchases();
      const isPremium = customerInfo.entitlements.active['premium'] != null;
      set({ isPremium });
    } catch (error) {
      console.error('Restore purchases error:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  checkPremiumStatus: async () => {
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      const isPremium = customerInfo.entitlements.active['premium'] != null;
      set({ isPremium });
    } catch (error) {
      console.error('Check premium status error:', error);
    }
  },
}));