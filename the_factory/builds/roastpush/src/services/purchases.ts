import Purchases, { PurchasesPackage, CustomerInfo } from 'react-native-purchases';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

const ENTITLEMENT_ID = 'premium';

let isConfigured = false;

export async function initPurchases(): Promise<void> {
  if (isConfigured) return;

  try {
    const apiKey = Platform.OS === 'ios'
      ? Constants.expoConfig?.extra?.revenueCatApiKeyApple
      : Constants.expoConfig?.extra?.revenueCatApiKeyGoogle;

    if (!apiKey || apiKey.includes('REPLACE')) {
      console.log('RevenueCat: Using mock mode (no API key configured)');
      return;
    }

    await Purchases.configure({ apiKey });
    isConfigured = true;
  } catch (error) {
    console.warn('Failed to configure RevenueCat:', error);
  }
}

export async function checkPremiumStatus(): Promise<boolean> {
  if (!isConfigured) {
    // Return false in mock mode
    return false;
  }

  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
  } catch (error) {
    console.warn('Failed to check premium status:', error);
    return false;
  }
}

export async function getOfferings(): Promise<{
  monthly: PurchasesPackage | null;
  yearly: PurchasesPackage | null;
}> {
  if (!isConfigured) {
    return { monthly: null, yearly: null };
  }

  try {
    const offerings = await Purchases.getOfferings();
    const current = offerings.current;

    return {
      monthly: current?.monthly || null,
      yearly: current?.annual || null,
    };
  } catch (error) {
    console.warn('Failed to get offerings:', error);
    return { monthly: null, yearly: null };
  }
}

export async function purchasePackage(pkg: PurchasesPackage): Promise<boolean> {
  if (!isConfigured) {
    console.log('RevenueCat: Mock purchase (not configured)');
    return false;
  }

  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    return customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
  } catch (error: any) {
    if (error.userCancelled) {
      return false;
    }
    throw error;
  }
}

export async function restorePurchases(): Promise<boolean> {
  if (!isConfigured) {
    console.log('RevenueCat: Mock restore (not configured)');
    return false;
  }

  try {
    const customerInfo = await Purchases.restorePurchases();
    return customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
  } catch (error) {
    console.warn('Failed to restore purchases:', error);
    return false;
  }
}

export function addPurchaseListener(
  callback: (isPremium: boolean) => void
): () => void {
  if (!isConfigured) {
    return () => {};
  }

  // RevenueCat SDK may return void or a subscription
  // We set up the listener and return a no-op cleanup function
  // since the listener is tied to the SDK lifecycle
  Purchases.addCustomerInfoUpdateListener((info: CustomerInfo) => {
    callback(info.entitlements.active[ENTITLEMENT_ID] !== undefined);
  });

  // Return empty cleanup - listener is managed by SDK
  return () => {};
}
