/**
 * RevenueCat Purchases Service
 *
 * This service handles all subscription and in-app purchase functionality
 * using RevenueCat SDK. Configure with your API key for production use.
 *
 * Documentation: https://www.revenuecat.com/docs
 */

import Purchases, {
  PurchasesPackage,
  CustomerInfo,
} from 'react-native-purchases';

// Configuration
// Replace with your RevenueCat API key from the dashboard
const REVENUECAT_API_KEY_IOS = 'your_ios_api_key_here';
const REVENUECAT_API_KEY_ANDROID = 'your_android_api_key_here';

// Entitlement identifier - matches what you set in RevenueCat dashboard
const PREMIUM_ENTITLEMENT = 'premium';

/**
 * Initialize RevenueCat SDK
 * Call this once at app startup (e.g., in _layout.tsx)
 */
export async function initializePurchases(): Promise<void> {
  try {
    // Configure with appropriate key based on platform
    // In production, use Platform.OS to select the right key
    await Purchases.configure({
      apiKey: REVENUECAT_API_KEY_IOS, // or REVENUECAT_API_KEY_ANDROID
    });

    console.log('[Purchases] RevenueCat initialized successfully');
  } catch (error) {
    console.error('[Purchases] Failed to initialize RevenueCat:', error);
  }
}

/**
 * Check if user has premium access
 */
export async function isPremiumUser(): Promise<boolean> {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return (
      typeof customerInfo.entitlements.active[PREMIUM_ENTITLEMENT] !==
      'undefined'
    );
  } catch (error) {
    console.error('[Purchases] Failed to check premium status:', error);
    return false;
  }
}

/**
 * Get available subscription packages
 */
export async function getPackages(): Promise<PurchasesPackage[]> {
  try {
    const offerings = await Purchases.getOfferings();
    if (
      offerings.current !== null &&
      offerings.current.availablePackages.length > 0
    ) {
      return offerings.current.availablePackages;
    }
    return [];
  } catch (error) {
    console.error('[Purchases] Failed to get packages:', error);
    return [];
  }
}

/**
 * Purchase a package
 */
export async function purchasePackage(
  pkg: PurchasesPackage
): Promise<{ success: boolean; customerInfo?: CustomerInfo; error?: string }> {
  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);

    // Check if premium entitlement is now active
    if (
      typeof customerInfo.entitlements.active[PREMIUM_ENTITLEMENT] !==
      'undefined'
    ) {
      return { success: true, customerInfo };
    }

    return {
      success: false,
      error: 'Purchase completed but premium not activated',
    };
  } catch (error: any) {
    // Handle user cancellation gracefully
    if (error.userCancelled) {
      return { success: false, error: 'User cancelled' };
    }
    console.error('[Purchases] Purchase failed:', error);
    return { success: false, error: error.message || 'Purchase failed' };
  }
}

/**
 * Restore previous purchases
 */
export async function restorePurchases(): Promise<{
  success: boolean;
  isPremium: boolean;
  error?: string;
}> {
  try {
    const customerInfo = await Purchases.restorePurchases();
    const isPremium =
      typeof customerInfo.entitlements.active[PREMIUM_ENTITLEMENT] !==
      'undefined';
    return { success: true, isPremium };
  } catch (error: any) {
    console.error('[Purchases] Restore failed:', error);
    return { success: false, isPremium: false, error: error.message };
  }
}

/**
 * Get customer info
 */
export async function getCustomerInfo(): Promise<CustomerInfo | null> {
  try {
    return await Purchases.getCustomerInfo();
  } catch (error) {
    console.error('[Purchases] Failed to get customer info:', error);
    return null;
  }
}
