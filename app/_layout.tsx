// app/_layout.tsx
import { Stack } from 'expo-router';
import React from 'react';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen
        name="(tabs)"       // name of your tab layout folder
        options={{ headerShown: false }}  // hide the "(TABS)" header
      />
    </Stack>
  );
}
