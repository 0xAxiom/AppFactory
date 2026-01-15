import Purchases, { LOG_LEVEL } from 'react-native-purchases';
import Constants from 'expo-constants';

// Entitlement identifier for premium features
export const ENTITLEMENT_ID = 'pro';

// Platform-specific API keys from environment
const REVENUECAT_IOS_KEY = Constants.expoConfig?.extra?.EXPO_PUBLIC_REVENUECAT_IOS_KEY || process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY;
const REVENUECAT_ANDROID_KEY = Constants.expoConfig?.extra?.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY || process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY;

export const initializePurchases = async () => {
  try {
    // Set log level based on environment
    const logLevel = __DEV__ ? LOG_LEVEL.DEBUG : LOG_LEVEL.WARN;
    Purchases.setLogLevel(logLevel);

    // Configure platform-specific keys
    if (Platform.OS === 'ios') {
      if (REVENUECAT_IOS_KEY) {
        await Purchases.configure({ apiKey: REVENUECAT_IOS_KEY });
      } else {
        console.warn('⚠️ DEV WARNING: RevenueCat iOS API key not found. Set EXPO_PUBLIC_REVENUECAT_IOS_KEY in your environment.');
        return;
      }
    } else if (Platform.OS === 'android') {
      if (REVENUECAT_ANDROID_KEY) {
        await Purchases.configure({ apiKey: REVENUECAT_ANDROID_KEY });
      } else {
        console.warn('⚠️ DEV WARNING: RevenueCat Android API key not found. Set EXPO_PUBLIC_REVENUECAT_ANDROID_KEY in your environment.');
        return;
      }
    }

    console.log('RevenueCat initialized successfully');
  } catch (error) {
    console.error('RevenueCat initialization failed:', error);
    throw error;
  }
};

export const getOfferings = async () => {
  try {
    const offerings = await Purchases.getOfferings();
    return offerings;
  } catch (error) {
    console.error('Error fetching offerings:', error);
    return { current: null, all: {} };
  }
};

export const purchasePackage = async (packageToPurchase) => {
  try {
    const { customerInfo } = await Purchases.purchasePackage(packageToPurchase);
    return customerInfo;
  } catch (error) {
    if (error.userCancelled) {
      console.log('User cancelled purchase');
      return null;
    }
    console.error('Purchase error:', error);
    throw error;
  }
};

export const restorePurchases = async () => {
  try {
    const customerInfo = await Purchases.restorePurchases();
    return customerInfo;
  } catch (error) {
    console.error('Restore purchases error:', error);
    throw error;
  }
};

export const getCustomerInfo = async () => {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return customerInfo;
  } catch (error) {
    console.error('Error getting customer info:', error);
    return null;
  }
};

export const isProUser = (customerInfo) => {
  if (!customerInfo) return false;
  return customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
};

export const getManageSubscriptionsURL = async () => {
  try {
    const url = await Purchases.getManagementURL();
    return url;
  } catch (error) {
    console.error('Error getting management URL:', error);
    return null;
  }
};

// Hook for subscription state
import { useState, useEffect } from 'react';

export const usePurchases = () => {
  const [customerInfo, setCustomerInfo] = useState(null);
  const [offerings, setOfferings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPurchaseData = async () => {
      try {
        const [info, offers] = await Promise.all([
          getCustomerInfo(),
          getOfferings()
        ]);
        setCustomerInfo(info);
        setOfferings(offers);
      } catch (error) {
        console.error('Error fetching purchase data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchaseData();

    // Listen for customer info updates
    const listener = Purchases.addCustomerInfoUpdateListener(setCustomerInfo);

    return () => {
      listener.remove();
    };
  }, []);

  return {
    customerInfo,
    offerings,
    loading,
    isProUser: isProUser(customerInfo),
    purchasePackage,
    restorePurchases,
    getManageSubscriptionsURL
  };
};

export default {
  initializePurchases,
  getOfferings,
  purchasePackage,
  restorePurchases,
  getCustomerInfo,
  isProUser,
  getManageSubscriptionsURL,
  usePurchases,
  ENTITLEMENT_ID
};