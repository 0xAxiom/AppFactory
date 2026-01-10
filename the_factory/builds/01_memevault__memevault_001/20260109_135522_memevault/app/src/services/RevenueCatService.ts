import Purchases from 'react-native-purchases';

export interface SubscriptionStatus {
  isActive: boolean;
  productIdentifier?: string;
  expirationDate?: Date;
}

export class RevenueCatService {
  private static initialized = false;

  static async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // Initialize RevenueCat with your API key
      // Replace with your actual RevenueCat public key
      await Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);
      await Purchases.configure({
        apiKey: 'your_revenuecat_public_api_key_here',
      });

      this.initialized = true;
      console.log('RevenueCat initialized successfully');
    } catch (error) {
      console.error('Failed to initialize RevenueCat:', error);
      throw error;
    }
  }

  static async getSubscriptionStatus(): Promise<SubscriptionStatus> {
    try {
      const purchaserInfo = await Purchases.getCustomerInfo();
      const isActive = typeof purchaserInfo.entitlements.active['pro'] !== 'undefined';
      
      if (isActive) {
        const entitlement = purchaserInfo.entitlements.active['pro'];
        return {
          isActive: true,
          productIdentifier: entitlement.productIdentifier,
          expirationDate: entitlement.expirationDate ? new Date(entitlement.expirationDate) : undefined,
        };
      }

      return { isActive: false };
    } catch (error) {
      console.error('Failed to get subscription status:', error);
      return { isActive: false };
    }
  }

  static async showPaywall(): Promise<boolean> {
    try {
      const offerings = await Purchases.getOfferings();
      
      if (offerings.current && offerings.current.availablePackages.length > 0) {
        const package = offerings.current.availablePackages[0];
        const purchaseResult = await Purchases.purchasePackage(package);
        
        if (typeof purchaseResult.customerInfo.entitlements.active['pro'] !== 'undefined') {
          console.log('Purchase successful!');
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Purchase failed:', error);
      return false;
    }
  }

  static async restorePurchases(): Promise<boolean> {
    try {
      const purchaserInfo = await Purchases.restorePurchases();
      const isActive = typeof purchaserInfo.entitlements.active['pro'] !== 'undefined';
      console.log('Restore purchases result:', isActive);
      return isActive;
    } catch (error) {
      console.error('Failed to restore purchases:', error);
      return false;
    }
  }
}

// Initialize service
export const initializeRevenueCat = () => {
  RevenueCatService.initialize().catch(console.error);
};