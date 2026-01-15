import React from 'react';
import { View, StyleSheet } from 'react-native';
import PaywallScreen from '../src/screens/PaywallScreen';

export default function Paywall() {
  return (
    <View style={styles.container}>
      <PaywallScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
});