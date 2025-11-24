// app/(tabs)/_layout.tsx
import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarInactiveTintColor: Colors[colorScheme ?? 'light'].tabIconDefault, // ✅ FIXED
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: Colors[colorScheme ?? 'light'].background,
        },
      }}
    >

      {/* 🔍 Live Map */}
      <Tabs.Screen
        name="live-map"
        options={{
          title: 'Live Map',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="map.fill" color={color} />
          ),
        }}
      />

      {/* 📡 Controls */}
      <Tabs.Screen
        name="controls"
        options={{
          title: 'Controls',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="antenna.radiowaves.left.and.right" color={color} />
          ),
        }}
      />

      {/* 📊 Dashboard */}
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="chart.bar.fill" color={color} />
          ),
        }}
      />

      {/* 🧩 Tasks */}
      <Tabs.Screen
        name="tasks"
        options={{
          title: 'Tasks',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="puzzlepiece.fill" color={color} />
          ),
        }}
      />

    </Tabs>
  );
}
