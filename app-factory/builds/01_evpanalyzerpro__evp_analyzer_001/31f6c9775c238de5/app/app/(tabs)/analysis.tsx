import React from 'react';
import { View, StyleSheet } from 'react-native';
import AnalysisScreen from '../../src/screens/AnalysisScreen';

export default function Analysis() {
  return (
    <View style={styles.container}>
      <AnalysisScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
});