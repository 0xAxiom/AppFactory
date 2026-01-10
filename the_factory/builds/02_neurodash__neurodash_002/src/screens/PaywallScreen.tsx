import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Linking } from 'react-native';
import { Button, Card, ActivityIndicator, Chip } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSubscription } from '../context/SubscriptionContext';
import { PurchasesPackage } from 'react-native-purchases';

interface PaywallScreenProps {
  onClose: () => void;
}

export default function PaywallScreen({ onClose }: PaywallScreenProps) {
  const { offerings, isLoading, error, purchasePackage, restorePurchases, isInitialized } = useSubscription();
  const [purchasing, setPurchasing] = useState(false);
  const [restoring, setRestoring] = useState(false);

  const handlePurchase = async (packageToPurchase: PurchasesPackage) => {
    setPurchasing(true);
    try {
      const success = await purchasePackage(packageToPurchase);
      if (success) {
        onClose();
      }
    } catch (err) {
      console.error('Purchase error:', err);
    } finally {
      setPurchasing(false);
    }
  };

  const handleRestore = async () => {
    setRestoring(true);
    try {
      const success = await restorePurchases();
      if (success) {
        Alert.alert('Success', 'Your purchases have been restored successfully!');
        onClose();
      }
    } catch (err) {
      console.error('Restore error:', err);
    } finally {
      setRestoring(false);
    }
  };

  const handleTroubleshooting = () => {
    Linking.openURL('https://www.revenuecat.com/docs/offerings/troubleshooting-offerings');
  };

  const renderLoadingState = () => (
    <View style={styles.centerContainer}>
      <ActivityIndicator size="large" color="#60a5fa" />
      <Text style={styles.loadingText}>Loading subscription options...</Text>
    </View>
  );

  const renderErrorState = () => (
    <View style={styles.centerContainer}>
      <MaterialCommunityIcons name="alert-circle" size={64} color="#ef4444" />
      <Text style={styles.errorTitle}>Subscription Unavailable</Text>
      <Text style={styles.errorText}>{error}</Text>
      
      {!isInitialized && (
        <Text style={styles.devWarning}>
          🔧 DEV: Check that RevenueCat API keys are configured in environment variables
        </Text>
      )}
      
      <Button
        mode="outlined"
        onPress={handleTroubleshooting}
        style={styles.troubleshootButton}
      >
        Troubleshooting Guide
      </Button>
      
      <Button mode="outlined" onPress={onClose} style={styles.backButton}>
        Back to App
      </Button>
    </View>
  );

  const renderEmptyOfferings = () => (
    <View style={styles.centerContainer}>
      <MaterialCommunityIcons name="package-variant" size={64} color="#f59e0b" />
      <Text style={styles.errorTitle}>No Subscription Plans Available</Text>
      <Text style={styles.errorText}>
        Subscription plans are not currently configured. Please check back later.
      </Text>
      
      <Button
        mode="outlined"
        onPress={handleTroubleshooting}
        style={styles.troubleshootButton}
      >
        Configuration Help
      </Button>
      
      <Button mode="outlined" onPress={onClose} style={styles.backButton}>
        Continue with Free Features
      </Button>
    </View>
  );

  const renderPackage = (pkg: PurchasesPackage) => {
    const isPopular = pkg.packageType === 'MONTHLY';
    const product = pkg.storeProduct;
    
    return (
      <Card key={pkg.identifier} style={[styles.packageCard, isPopular && styles.popularPackage]}>
        {isPopular && (
          <View style={styles.popularBadge}>
            <Text style={styles.popularText}>Most Popular</Text>
          </View>
        )}
        
        <View style={styles.packageHeader}>
          <Text style={styles.packageTitle}>
            {pkg.packageType === 'ANNUAL' ? 'Annual Plan' : 'Monthly Plan'}
          </Text>
          <Text style={styles.packagePrice}>
            {product.priceString}
            {pkg.packageType === 'ANNUAL' && (
              <Text style={styles.savings}> (Save 40%)</Text>
            )}
          </Text>
        </View>
        
        <View style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <MaterialCommunityIcons name="check-circle" size={20} color="#10b981" />
            <Text style={styles.featureText}>Advanced Pattern Analytics</Text>
          </View>
          <View style={styles.featureItem}>
            <MaterialCommunityIcons name="check-circle" size={20} color="#10b981" />
            <Text style={styles.featureText}>AI Productivity Coach</Text>
          </View>
          <View style={styles.featureItem}>
            <MaterialCommunityIcons name="check-circle" size={20} color="#10b981" />
            <Text style={styles.featureText}>Health Data Integration</Text>
          </View>
          <View style={styles.featureItem}>
            <MaterialCommunityIcons name="check-circle" size={20} color="#10b981" />
            <Text style={styles.featureText}>Advanced Voice Features</Text>
          </View>
          <View style={styles.featureItem}>
            <MaterialCommunityIcons name="check-circle" size={20} color="#10b981" />
            <Text style={styles.featureText}>Team Coordination Tools</Text>
          </View>
        </View>
        
        <Button
          mode="contained"
          onPress={() => handlePurchase(pkg)}
          disabled={purchasing || restoring}
          loading={purchasing}
          style={styles.subscribeButton}
        >
          Subscribe Now
        </Button>
        
        {pkg.packageType === 'MONTHLY' && (
          <Text style={styles.trialNote}>Includes 7-day free trial</Text>
        )}
      </Card>
    );
  };

  if (isLoading && !offerings) {
    return (
      <View style={styles.container}>
        {renderLoadingState()}
      </View>
    );
  }

  if (error || !isInitialized) {
    return (
      <View style={styles.container}>
        {renderErrorState()}
      </View>
    );
  }

  if (!offerings || !offerings.availablePackages || offerings.availablePackages.length === 0) {
    return (
      <View style={styles.container}>
        {renderEmptyOfferings()}
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="star" size={48} color="#fbbf24" />
        <Text style={styles.title}>Unlock Your Full Potential</Text>
        <Text style={styles.subtitle}>
          Get advanced features designed specifically for neurodivergent productivity
        </Text>
      </View>

      <View style={styles.packagesContainer}>
        {offerings.availablePackages.map(renderPackage)}
      </View>

      <View style={styles.footer}>
        <Button
          mode="outlined"
          onPress={handleRestore}
          disabled={purchasing || restoring}
          loading={restoring}
          style={styles.restoreButton}
        >
          Restore Purchases
        </Button>
        
        <Button
          mode="text"
          onPress={onClose}
          disabled={purchasing || restoring}
          style={styles.dismissButton}
        >
          Continue with Free Features
        </Button>
        
        <View style={styles.legalContainer}>
          <Text style={styles.legalText}>
            Subscriptions auto-renew unless cancelled. Cancel anytime in device settings.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 16,
  },
  header: {
    alignItems: 'center',
    padding: 32,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#e5e5e5',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 22,
  },
  packagesContainer: {
    padding: 20,
    gap: 16,
  },
  packageCard: {
    backgroundColor: '#1f2937',
    padding: 24,
    position: 'relative',
  },
  popularPackage: {
    borderColor: '#60a5fa',
    borderWidth: 2,
  },
  popularBadge: {
    position: 'absolute',
    top: -8,
    left: 20,
    backgroundColor: '#60a5fa',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularText: {
    color: '#1f2937',
    fontSize: 12,
    fontWeight: '600',
  },
  packageHeader: {
    marginBottom: 20,
  },
  packageTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#e5e5e5',
    marginBottom: 4,
  },
  packagePrice: {
    fontSize: 32,
    fontWeight: '700',
    color: '#60a5fa',
  },
  savings: {
    fontSize: 16,
    fontWeight: '500',
    color: '#10b981',
  },
  featuresContainer: {
    marginBottom: 24,
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    flex: 1,
    fontSize: 16,
    color: '#d1d5db',
  },
  subscribeButton: {
    paddingVertical: 8,
    marginBottom: 8,
  },
  trialNote: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
    gap: 16,
  },
  restoreButton: {
    borderColor: '#60a5fa',
    minWidth: 200,
  },
  dismissButton: {
    color: '#9ca3af',
  },
  legalContainer: {
    marginTop: 16,
  },
  legalText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#9ca3af',
    marginTop: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#e5e5e5',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  devWarning: {
    fontSize: 14,
    color: '#f59e0b',
    textAlign: 'center',
    fontFamily: 'monospace',
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#92400e20',
    borderRadius: 8,
  },
  troubleshootButton: {
    borderColor: '#f59e0b',
    marginBottom: 12,
  },
  backButton: {
    borderColor: '#6b7280',
  },
});