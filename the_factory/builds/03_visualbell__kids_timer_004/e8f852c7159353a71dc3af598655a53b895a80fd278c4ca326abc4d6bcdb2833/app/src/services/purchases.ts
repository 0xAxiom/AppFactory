import { Platform } from 'react-native';
import Purchases, {
  CustomerInfo,
  Offerings,
  PurchasesPackage,
  LOG_LEVEL,
} from 'react-native-purchases';
import Constants from 'expo-constants';

class PurchasesService {
  private isConfigured = false;

  async initialize(): Promise<void> {
    if (this.isConfigured) return;

    try {
      // Enable debug logging in development
      if (__DEV__) {
        Purchases.setLogLevel(LOG_LEVEL.DEBUG);
      }

      // Get API keys from environment
      const iosKey = process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY || Constants.expoConfig?.extra?.EXPO_PUBLIC_REVENUECAT_IOS_KEY;
      const androidKey = process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY || Constants.expoConfig?.extra?.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY;

      let apiKey: string | undefined;
      
      if (Platform.OS === 'ios') {
        apiKey = iosKey;
      } else if (Platform.OS === 'android') {
        apiKey = androidKey;
      }

      // Check if API key is a valid key (not placeholder)
      const isValidKey = apiKey && !apiKey.includes('placeholder') && !apiKey.includes('your_') && apiKey.length > 10;

      if (!isValidKey) {
        console.warn('RevenueCat API key not found - subscription features will be disabled');
        return;
      }

      // Configure RevenueCat
      await Purchases.configure({ apiKey });
      
      // Set anonymous user identifier
      const appUserID = await this.getOrCreateAppUserID();
      await Purchases.logIn(appUserID);

      this.isConfigured = true;
      console.log('RevenueCat configured successfully');
    } catch (error) {
      console.error('Failed to configure RevenueCat:', error);
    }
  }

  async getOrCreateAppUserID(): Promise<string> {
    // Generate stable anonymous user ID
    // In production, this could be stored in secure storage
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return userId;
  }

  async getOfferings(): Promise<Offerings | null> {
    try {
      if (!this.isConfigured) {
        await this.initialize();
      }
      
      const offerings = await Purchases.getOfferings();
      return offerings;
    } catch (error) {
      console.error('Failed to fetch offerings:', error);
      return null;
    }
  }

  async getCustomerInfo(): Promise<CustomerInfo | null> {
    try {
      if (!this.isConfigured) {
        await this.initialize();
      }
      
      const customerInfo = await Purchases.getCustomerInfo();
      return customerInfo;
    } catch (error) {
      console.error('Failed to fetch customer info:', error);
      return null;
    }
  }

  async purchasePackage(package_: PurchasesPackage): Promise<CustomerInfo | null> {
    try {
      const { customerInfo } = await Purchases.purchasePackage(package_);
      return customerInfo;
    } catch (error) {
      console.error('Purchase failed:', error);
      throw error;
    }
  }

  async restorePurchases(): Promise<CustomerInfo | null> {
    try {
      const customerInfo = await Purchases.restorePurchases();
      return customerInfo;
    } catch (error) {
      console.error('Restore purchases failed:', error);
      throw error;
    }
  }

  async checkEntitlement(entitlementId: string): Promise<boolean> {
    try {
      const customerInfo = await this.getCustomerInfo();
      if (!customerInfo) return false;

      const entitlement = customerInfo.entitlements.active[entitlementId];
      return entitlement?.isActive === true;
    } catch (error) {
      console.error('Failed to check entitlement:', error);
      return false;
    }
  }

  // Premium feature checks based on VisualBell's subscription model
  async hasPremiumThemes(): Promise<boolean> {
    return this.checkEntitlement('premium_themes');
  }

  async hasPremiumSounds(): Promise<boolean> {
    return this.checkEntitlement('premium_sounds');
  }

  async hasCustomPresets(): Promise<boolean> {
    return this.checkEntitlement('custom_presets');
  }

  async hasMultipleTimers(): Promise<boolean> {
    return this.checkEntitlement('multiple_timers');
  }

  async hasUsageAnalytics(): Promise<boolean> {
    return this.checkEntitlement('usage_analytics');
  }

  async hasFamilySync(): Promise<boolean> {
    return this.checkEntitlement('family_sync');
  }

  async getManageSubscriptionURL(): Promise<string> {
    try {
      const url = await Purchases.getCustomerInfo();
      // This returns the platform-specific URL for subscription management
      if (Platform.OS === 'ios') {
        return 'https://apps.apple.com/account/subscriptions';
      } else {
        return 'https://play.google.com/store/account/subscriptions';
      }
    } catch (error) {
      console.error('Failed to get subscription management URL:', error);
      return Platform.OS === 'ios' 
        ? 'https://apps.apple.com/account/subscriptions'
        : 'https://play.google.com/store/account/subscriptions';
    }
  }
}

export const purchasesService = new PurchasesService();