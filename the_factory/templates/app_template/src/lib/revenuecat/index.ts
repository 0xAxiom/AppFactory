import { Platform } from 'react-native';
import Purchases, {
  LOG_LEVEL,
  PurchasesOfferings,
  CustomerInfo,
  PurchasesPackage,
} from 'react-native-purchases';
import Constants from 'expo-constants';

export interface RevenueCatConfig {
  iosApiKey?: string;
  androidApiKey?: string;
}

export const initPurchases = async (): Promise<void> => {
  const iosKey = Constants.expoConfig?.extra?.iosApiKey || process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY;
  const androidKey = Constants.expoConfig?.extra?.androidApiKey || process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY;

  if (__DEV__) {
    Purchases.setLogLevel(LOG_LEVEL.DEBUG);
  }

  try {
    if (Platform.OS === 'ios' && iosKey) {
      await Purchases.configure({ apiKey: iosKey });
    } else if (Platform.OS === 'android' && androidKey) {
      await Purchases.configure({ apiKey: androidKey });
    } else {
      if (__DEV__) {
        console.warn('RevenueCat: No API key configured for platform:', Platform.OS);
        console.warn('Make sure to set EXPO_PUBLIC_REVENUECAT_IOS_API_KEY or EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY');
      }
    }
  } catch (error) {
    if (__DEV__) {
      console.error('RevenueCat initialization failed:', error);
    }
  }
};

export const getOfferings = async (): Promise<PurchasesOfferings | null> => {
  try {
    const offerings = await Purchases.getOfferings();
    return offerings;
  } catch (error) {
    if (__DEV__) {
      console.error('Failed to get offerings:', error);
    }
    return null;
  }
};

export const getCustomerInfo = async (): Promise<CustomerInfo | null> => {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return customerInfo;
  } catch (error) {
    if (__DEV__) {
      console.error('Failed to get customer info:', error);
    }
    return null;
  }
};

export const purchasePackage = async (
  packageToPurchase: PurchasesPackage
): Promise<{ customerInfo: CustomerInfo; success: boolean }> => {
  try {
    const purchaseResult = await Purchases.purchasePackage(packageToPurchase);
    return { customerInfo: purchaseResult.customerInfo, success: true };
  } catch (error) {
    if (__DEV__) {
      console.error('Purchase failed:', error);
    }
    throw error;
  }
};

export const restorePurchases = async (): Promise<CustomerInfo | null> => {
  try {
    const customerInfo = await Purchases.restorePurchases();
    return customerInfo;
  } catch (error) {
    if (__DEV__) {
      console.error('Restore failed:', error);
    }
    throw error;
  }
};

export const isPremium = (customerInfo: CustomerInfo | null): boolean => {
  if (!customerInfo) return false;
  return customerInfo.entitlements.active['pro'] != null;
};

export const getManageSubscriptionURL = (): string => {
  if (Platform.OS === 'ios') {
    return 'https://apps.apple.com/account/subscriptions';
  } else {
    return 'https://play.google.com/store/account/subscriptions';
  }
};