import React from 'react';
import { View, StyleSheet } from 'react-native';
import SessionsScreen from '../../src/screens/SessionsScreen';

export default function Sessions() {
  return (
    <View style={styles.container}>
      <SessionsScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
});