import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePremiumStore } from '../src/store/premiumStore';

export default function SettingsScreen() {
  const { isPremium, isLoading, purchasePackage, restorePurchases, checkPremiumStatus } = usePremiumStore();

  useEffect(() => {
    checkPremiumStatus();
  }, []);

  const handleUpgrade = () => {
    Alert.alert(
      'Upgrade to Premium',
      'Get unlimited tasks, custom themes, and cloud backup.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Monthly $2.99', onPress: () => purchasePackage('cleartasks_premium_monthly') },
        { text: 'Annual $19.99', onPress: () => purchasePackage('cleartasks_premium_annual') },
      ]
    );
  };

  const handleRestore = async () => {
    await restorePurchases();
    Alert.alert('Restored', 'Your purchases have been restored.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Premium</Text>
          
          {isPremium ? (
            <View style={styles.premiumCard}>
              <Text style={styles.premiumTitle}>Premium Active</Text>
              <Text style={styles.premiumDescription}>
                You have unlimited tasks, custom themes, and cloud backup.
              </Text>
            </View>
          ) : (
            <View style={styles.upgradeCard}>
              <Text style={styles.upgradeTitle}>Upgrade to Premium</Text>
              <Text style={styles.upgradeDescription}>
                • Unlimited tasks (currently limited to 20){'\n'}
                • Custom themes{'\n'}
                • Cloud backup and sync{'\n'}
                • Priority support
              </Text>
              <TouchableOpacity 
                style={styles.upgradeButton} 
                onPress={handleUpgrade}
                disabled={isLoading}
              >
                <Text style={styles.upgradeButtonText}>
                  {isLoading ? 'Loading...' : 'Upgrade Now'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <TouchableOpacity style={styles.settingRow} onPress={handleRestore}>
            <Text style={styles.settingText}>Restore Purchases</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <TouchableOpacity style={styles.settingRow}>
            <Text style={styles.settingText}>Contact Support</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingRow}>
            <Text style={styles.settingText}>Privacy Policy</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingRow}>
            <Text style={styles.settingText}>Terms of Service</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.version}>ClearTasks v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
  },
  premiumCard: {
    backgroundColor: '#F0FDF4',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#059669',
  },
  premiumTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#059669',
    marginBottom: 4,
  },
  premiumDescription: {
    fontSize: 14,
    color: '#064E3B',
  },
  upgradeCard: {
    backgroundColor: '#DBEAFE',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2563EB',
  },
  upgradeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563EB',
    marginBottom: 8,
  },
  upgradeDescription: {
    fontSize: 14,
    color: '#1E3A8A',
    marginBottom: 16,
  },
  upgradeButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  upgradeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  settingText: {
    fontSize: 16,
    color: '#1E293B',
  },
  settingArrow: {
    fontSize: 18,
    color: '#64748B',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  version: {
    fontSize: 12,
    color: '#64748B',
  },
});