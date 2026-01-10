import React from 'react';
import { View, StyleSheet } from 'react-native';
import SessionDetailScreen from '../src/screens/SessionDetailScreen';

export default function SessionDetail() {
  return (
    <View style={styles.container}>
      <SessionDetailScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
});