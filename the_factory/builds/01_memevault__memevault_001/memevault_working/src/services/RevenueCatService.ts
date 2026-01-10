import Purchases, { CustomerInfo, PurchasesOffering } from 'react-native-purchases';

export interface SubscriptionStatus {
  isActive: boolean;
  productIdentifier?: string;
  expirationDate?: Date;
}

/**
 * RevenueCat Service for MemeVault Pro subscriptions
 */
export class RevenueCatService {
  private static initialized = false;
  private static readonly ENTITLEMENT_ID = 'memevault_pro';

  static async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      await Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);
      await Purchases.configure({
        apiKey: 'your_revenuecat_public_api_key_here', // Replace with actual key
      });

      this.initialized = true;
      console.log('✅ RevenueCat initialized');
    } catch (error) {
      console.error('❌ RevenueCat initialization failed:', error);
      throw error;
    }
  }

  static async getSubscriptionStatus(): Promise<SubscriptionStatus> {
    try {
      const customerInfo: CustomerInfo = await Purchases.getCustomerInfo();
      const entitlement = customerInfo.entitlements.active[this.ENTITLEMENT_ID];
      
      if (entitlement) {
        return {
          isActive: true,
          productIdentifier: entitlement.productIdentifier,
          expirationDate: entitlement.expirationDate 
            ? new Date(entitlement.expirationDate) 
            : undefined,
        };
      }

      return { isActive: false };
    } catch (error) {
      console.error('❌ Failed to get subscription status:', error);
      return { isActive: false };
    }
  }

  static async getOfferings(): Promise<PurchasesOffering | null> {
    try {
      const offerings = await Purchases.getOfferings();
      return offerings.current;
    } catch (error) {
      console.error('❌ Failed to get offerings:', error);
      return null;
    }
  }

  static async purchaseSubscription(packageIdentifier: string): Promise<{
    success: boolean;
    customerInfo?: CustomerInfo;
    error?: string;
  }> {
    try {
      const offerings = await Purchases.getOfferings();
      const currentOffering = offerings.current;
      
      if (!currentOffering) {
        return { success: false, error: 'No offerings available' };
      }

      const packageToPurchase = currentOffering.availablePackages.find(
        pkg => pkg.identifier === packageIdentifier
      );

      if (!packageToPurchase) {
        return { success: false, error: 'Package not found' };
      }

      const purchaseResult = await Purchases.purchasePackage(packageToPurchase);
      const customerInfo = purchaseResult.customerInfo;
      
      if (customerInfo.entitlements.active[this.ENTITLEMENT_ID]) {
        return { success: true, customerInfo };
      } else {
        return { success: false, error: 'Purchase completed but entitlement not activated' };
      }
    } catch (error: any) {
      console.error('❌ Purchase failed:', error);
      return { success: false, error: error.message || 'Purchase failed' };
    }
  }

  static async restorePurchases(): Promise<{
    success: boolean;
    customerInfo?: CustomerInfo;
  }> {
    try {
      const customerInfo = await Purchases.restorePurchases();
      return { success: true, customerInfo };
    } catch (error) {
      console.error('❌ Restore failed:', error);
      return { success: false };
    }
  }

  static async hasPremiumAccess(): Promise<boolean> {
    try {
      const status = await this.getSubscriptionStatus();
      return status.isActive;
    } catch (error) {
      return false;
    }
  }
}