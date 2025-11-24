import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function LiveMap() {
  return (
    <View style={styles.container}>
      <Text>Live Map Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
