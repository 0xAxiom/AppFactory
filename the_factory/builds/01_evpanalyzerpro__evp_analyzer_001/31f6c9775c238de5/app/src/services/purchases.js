// RevenueCat subscription service for EVP Analyzer Pro
// Based on Stage 04 monetization specifications

import React, { createContext, useContext, useEffect, useState } from 'react';
import Purchases from 'react-native-purchases';

// Subscription configuration based on Stage 04
const SUBSCRIPTION_CONFIG = {
  productId: 'evp_pro_subscription',
  entitlementId: 'pro_features',
  offerings: {
    monthly: 'monthly_4_99',
    annual: 'annual_49_99'
  }
};

const PurchasesContext = createContext(null);

export const SubscriptionProvider = ({ children }) => {
  const [customerInfo, setCustomerInfo] = useState(null);
  const [offerings, setOfferings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializePurchases = async () => {
      try {
        // Set up customer info listener
        Purchases.addCustomerInfoUpdateListener((info) => {
          setCustomerInfo(info);
        });

        // Get initial customer info
        const info = await Purchases.getCustomerInfo();
        setCustomerInfo(info);

        // Get available offerings
        const availableOfferings = await Purchases.getOfferings();
        setOfferings(availableOfferings);

        setIsLoading(false);
      } catch (error) {
        console.error('Failed to initialize purchases:', error);
        setError(error.message);
        setIsLoading(false);
      }
    };

    initializePurchases();

    return () => {
      // Clean up listener
      Purchases.removeCustomerInfoUpdateListener();
    };
  }, []);

  // Check if user has pro features
  const hasProFeatures = () => {
    return customerInfo?.entitlements?.active?.[SUBSCRIPTION_CONFIG.entitlementId] !== undefined;
  };

  // Check if user is in trial period
  const isInTrial = () => {
    const entitlement = customerInfo?.entitlements?.active?.[SUBSCRIPTION_CONFIG.entitlementId];
    return entitlement?.willRenew === true && entitlement?.periodType === 'TRIAL';
  };

  // Get trial end date
  const getTrialEndDate = () => {
    const entitlement = customerInfo?.entitlements?.active?.[SUBSCRIPTION_CONFIG.entitlementId];
    if (entitlement && isInTrial()) {
      return new Date(entitlement.expirationDate);
    }
    return null;
  };

  // Purchase subscription
  const purchaseSubscription = async (packageIdentifier) => {
    try {
      setIsLoading(true);
      const purchaseInfo = await Purchases.purchasePackage(packageIdentifier);
      
      // Analytics tracking for successful purchase
      if (__DEV__) {
        console.log('Purchase successful:', purchaseInfo);
      }
      
      return { success: true, purchaseInfo };
    } catch (error) {
      console.error('Purchase failed:', error);
      
      let errorMessage = 'Purchase failed. Please try again.';
      
      // Handle specific error types
      if (error.code === 'USER_CANCELLED') {
        errorMessage = 'Purchase was cancelled.';
      } else if (error.code === 'PAYMENT_PENDING') {
        errorMessage = 'Payment is pending approval.';
      } else if (error.code === 'PRODUCT_NOT_AVAILABLE') {
        errorMessage = 'This subscription is not available.';
      } else if (error.code === 'PURCHASE_NOT_ALLOWED') {
        errorMessage = 'Purchases are not allowed on this device.';
      }
      
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Restore purchases
  const restorePurchases = async () => {
    try {
      setIsLoading(true);
      const restoredInfo = await Purchases.restorePurchases();
      
      const hasActiveSubscription = restoredInfo.entitlements.active[SUBSCRIPTION_CONFIG.entitlementId] !== undefined;
      
      if (hasActiveSubscription) {
        return { success: true, message: 'Purchases restored successfully!' };
      } else {
        return { success: false, message: 'No active subscriptions found to restore.' };
      }
    } catch (error) {
      console.error('Restore failed:', error);
      return { success: false, message: 'Failed to restore purchases. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  // Get current offering packages
  const getCurrentOffering = () => {
    return offerings?.current;
  };

  // Get subscription status info
  const getSubscriptionStatus = () => {
    const entitlement = customerInfo?.entitlements?.active?.[SUBSCRIPTION_CONFIG.entitlementId];
    
    if (!entitlement) {
      return {
        status: 'inactive',
        willRenew: false,
        expirationDate: null,
        productIdentifier: null
      };
    }

    return {
      status: isInTrial() ? 'trial' : 'active',
      willRenew: entitlement.willRenew,
      expirationDate: new Date(entitlement.expirationDate),
      productIdentifier: entitlement.productIdentifier,
      originalPurchaseDate: new Date(entitlement.originalPurchaseDate)
    };
  };

  // Check if specific feature should be gated
  const shouldShowPaywall = (feature) => {
    if (hasProFeatures()) {
      return false;
    }

    // Define which features require pro subscription
    const proFeatures = [
      'unlimited_recording',
      'cloud_sync',
      'advanced_analysis',
      'professional_export',
      'batch_processing'
    ];

    return proFeatures.includes(feature);
  };

  const value = {
    customerInfo,
    offerings,
    isLoading,
    error,
    hasProFeatures,
    isInTrial,
    getTrialEndDate,
    purchaseSubscription,
    restorePurchases,
    getCurrentOffering,
    getSubscriptionStatus,
    shouldShowPaywall,
    subscriptionConfig: SUBSCRIPTION_CONFIG
  };

  return (
    <PurchasesContext.Provider value={value}>
      {children}
    </PurchasesContext.Provider>
  );
};

export const usePurchases = () => {
  const context = useContext(PurchasesContext);
  if (!context) {
    throw new Error('usePurchases must be used within a SubscriptionProvider');
  }
  return context;
};

// Helper functions for subscription logic
export const getSubscriptionDisplayText = (status) => {
  switch (status.status) {
    case 'trial':
      const daysRemaining = Math.ceil((status.expirationDate - new Date()) / (1000 * 60 * 60 * 24));
      return `Free trial - ${daysRemaining} days remaining`;
    case 'active':
      return status.willRenew ? 'Active subscription' : 'Subscription expires soon';
    default:
      return 'No active subscription';
  }
};

export const formatPrice = (price, currencyCode) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode
  }).format(price);
};

// Constants for feature gating
export const FEATURES = {
  UNLIMITED_RECORDING: 'unlimited_recording',
  CLOUD_SYNC: 'cloud_sync',
  ADVANCED_ANALYSIS: 'advanced_analysis',
  PROFESSIONAL_EXPORT: 'professional_export',
  BATCH_PROCESSING: 'batch_processing'
};

// Free tier limits
export const FREE_LIMITS = {
  RECORDING_DURATION: 5 * 60 * 1000, // 5 minutes in milliseconds
  MAX_SESSIONS: 10,
  EXPORT_FORMAT: 'mp3' // Limited to MP3, pro gets WAV/FLAC
};

export default {
  SubscriptionProvider,
  usePurchases,
  FEATURES,
  FREE_LIMITS,
  getSubscriptionDisplayText,
  formatPrice
};