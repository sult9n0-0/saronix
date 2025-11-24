import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Controls() {
  return (
    <View style={styles.container}>
      <Text>Controls Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
