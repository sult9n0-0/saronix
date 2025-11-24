import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Tasks() {
  return (
    <View style={styles.container}>
      <Text>Tasks Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
