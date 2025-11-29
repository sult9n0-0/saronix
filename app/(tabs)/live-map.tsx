import React from 'react';
import { View } from 'react-native';
import { MapPanel } from './components/mappanel';

export default function LiveMap() {
  return (
    <View style={{ flex: 1 }}>
      <MapPanel />
    </View>
  );
}
