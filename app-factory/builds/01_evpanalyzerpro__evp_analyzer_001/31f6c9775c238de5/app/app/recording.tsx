import React from 'react';
import { View, StyleSheet } from 'react-native';
import RecordingScreen from '../src/screens/RecordingScreen';

export default function Recording() {
  return (
    <View style={styles.container}>
      <RecordingScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
});