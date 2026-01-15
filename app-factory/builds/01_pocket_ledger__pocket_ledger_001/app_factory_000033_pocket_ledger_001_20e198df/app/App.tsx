import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>PocketLedger</Text>
        <Text style={styles.subtitle}>Privacy-first envelope budgeting</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Budget Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Budget Overview</Text>
          <View style={styles.budgetCard}>
            <Text style={styles.budgetAmount}>$1,247.50</Text>
            <Text style={styles.budgetLabel}>Available to Budget</Text>
          </View>
        </View>

        {/* Envelopes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Envelopes</Text>
          
          <View style={styles.envelope}>
            <View style={styles.envelopeHeader}>
              <Text style={styles.envelopeName}>🏠 Housing</Text>
              <Text style={styles.envelopeAmount}>$800.00</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progress, { width: '60%' }]} />
            </View>
            <Text style={styles.envelopeStatus}>$480 spent of $800</Text>
          </View>

          <View style={styles.envelope}>
            <View style={styles.envelopeHeader}>
              <Text style={styles.envelopeName}>🛒 Groceries</Text>
              <Text style={styles.envelopeAmount}>$300.00</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progress, { width: '45%' }]} />
            </View>
            <Text style={styles.envelopeStatus}>$135 spent of $300</Text>
          </View>

          <View style={styles.envelope}>
            <View style={styles.envelopeHeader}>
              <Text style={styles.envelopeName}>⛽ Transportation</Text>
              <Text style={styles.envelopeAmount}>$200.00</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progress, { width: '25%' }]} />
            </View>
            <Text style={styles.envelopeStatus}>$50 spent of $200</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>➕ Add Transaction</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>📷 Scan Receipt</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>💰 Create Envelope</Text>
          </TouchableOpacity>
        </View>

        {/* Privacy Notice */}
        <View style={styles.privacyNotice}>
          <Text style={styles.privacyText}>
            🔒 Your financial data stays on your device. No bank connections required.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  header: {
    backgroundColor: '#2563eb',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#bfdbfe',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  budgetCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  budgetAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#059669',
    marginBottom: 4,
  },
  budgetLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  envelope: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  envelopeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  envelopeName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
  },
  envelopeAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#059669',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    marginBottom: 8,
  },
  progress: {
    height: 6,
    backgroundColor: '#10b981',
    borderRadius: 3,
  },
  envelopeStatus: {
    fontSize: 12,
    color: '#6b7280',
  },
  actionButton: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2563eb',
    textAlign: 'center',
  },
  privacyNotice: {
    backgroundColor: '#ecfdf5',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#10b981',
    marginTop: 8,
  },
  privacyText: {
    fontSize: 14,
    color: '#047857',
    textAlign: 'center',
  },
});
