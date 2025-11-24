// app/(tabs)/_layout.tsx
import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Animated, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');
const COLORS = {
  primary: "#2B1B3D",
  secondary: "#FF6B6B",
  accent: "#4DD0E1",
  background: "#EDE7F6",
  textPrimary: "#ffffff",
};

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const activeColor = Colors[colorScheme ?? 'light'].tint;
  const inactiveColor = Colors[colorScheme ?? 'light'].tabIconDefault;

  // Burger menu state
  const [menuVisible, setMenuVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(width)).current;

  const openMenu = () => {
    slideAnim.setValue(width);
    setMenuVisible(true);
    Animated.timing(slideAnim, {
      toValue: width * 0.4,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const closeMenu = () => {
    Animated.timing(slideAnim, {
      toValue: width,
      duration: 300,
      useNativeDriver: false,
    }).start(() => setMenuVisible(false));
  };

  const handleLogout = () => console.log('Logout clicked');
  const handleAddBot = () => console.log('Add Bot clicked');
  const handleSettings = () => console.log('Settings clicked');
  const handleProfile = () => console.log('Profile clicked');

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>S</Text>
          </View>
          <View>
            <Text style={styles.title}>Saronix</Text>
            <Text style={styles.subtitle}>Operations Online</Text>
          </View>
        </View>
        <TouchableOpacity onPress={openMenu} style={styles.burgerButton}>
          <Text style={styles.burgerText}>☰</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={{ flex: 1 }}>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: activeColor,
            tabBarInactiveTintColor: inactiveColor,
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
              tabBarIcon: ({ color }) => <Ionicons name="location" size={28} color={color} />,
            }}
          />

          {/* 📡 Controls */}
          <Tabs.Screen
            name="controls"
            options={{
              title: 'Controls',
              tabBarIcon: ({ color }) => <Ionicons name="radio" size={28} color={color} />,
            }}
          />

          {/* 📊 Dashboard */}
          <Tabs.Screen
            name="dashboard"
            options={{
              title: 'Dashboard',
              tabBarIcon: ({ color }) => <Ionicons name="analytics" size={28} color={color} />,
            }}
          />

          {/* 🧩 Tasks */}
          <Tabs.Screen
            name="tasks"
            options={{
              title: 'Tasks',
              tabBarIcon: ({ color }) => <Ionicons name="clipboard" size={28} color={color} />,
            }}
          />
        </Tabs>
      </View>

      {/* Burger Menu */}
      {menuVisible && (
        <TouchableOpacity style={styles.menuOverlay} activeOpacity={1} onPress={closeMenu}>
          <Animated.View style={[styles.menu, { left: slideAnim }]}>
            <TouchableOpacity style={styles.menuItem} onPress={handleProfile}>
              <Text style={styles.menuItemText}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={handleAddBot}>
              <Text style={styles.menuItemText}>Add Bot</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={handleSettings}>
              <Text style={styles.menuItemText}>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <Text style={[styles.menuItemText, { color: COLORS.secondary }]}>Logout</Text>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { padding: 16, backgroundColor: COLORS.primary, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: COLORS.secondary },
  logoContainer: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  logoCircle: { width: 50, height: 50, borderRadius: 25, backgroundColor: COLORS.secondary, justifyContent: 'center', alignItems: 'center' },
  logoText: { color: COLORS.primary, fontWeight: 'bold' },
  title: { color: COLORS.textPrimary, fontSize: 18, fontWeight: 'bold' },
  subtitle: { color: COLORS.accent, fontSize: 12 },
  burgerButton: { padding: 8 },
  burgerText: { fontSize: 28, color: COLORS.accent },
  menuOverlay: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.3)' },
  menu: { position: 'absolute', top: 0, width: '60%', height: '100%', backgroundColor: COLORS.primary, paddingTop: 50, paddingHorizontal: 16 },
  menuItem: { paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: COLORS.accent + '33' },
  menuItemText: { color: COLORS.accent, fontWeight: 'bold', fontSize: 16 },
});
