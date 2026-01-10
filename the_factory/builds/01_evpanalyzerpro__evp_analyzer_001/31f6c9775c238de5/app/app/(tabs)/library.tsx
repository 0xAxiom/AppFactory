import React from 'react';
import { View, StyleSheet } from 'react-native';
import LibraryScreen from '../../src/screens/LibraryScreen';

export default function Library() {
  return (
    <View style={styles.container}>
      <LibraryScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
});