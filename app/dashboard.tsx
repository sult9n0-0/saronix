// app/dashboard.tsx
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { Animated, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const COLORS = {
  primary: "#2B1B3D",
  secondary: "#FF6B6B",
  accent: "#4DD0E1",
  background: "#EDE7F6",
  textPrimary: "#ffffff",
  textSecondary: "#2B1B3D",
  muted: "#A7A0B8",
};

const { width } = Dimensions.get("window");

export default function Dashboard() {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("Dashboard"); // Track active bottom tab
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

  const handleLogout = () => router.replace("/login");
  const handleAddBot = () => console.log("Add bot clicked");
  const handleSettings = () => console.log("Settings clicked");
  const handleProfile = () => console.log("Profile clicked");

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>RB</Text>
          </View>
          <View>
            <Text style={styles.title}>Rescue Bot Control</Text>
            <Text style={styles.subtitle}>Mission Active</Text>
          </View>
        </View>
        <TouchableOpacity onPress={openMenu} style={styles.burgerButton}>
          <Text style={styles.burgerText}>☰</Text>
        </TouchableOpacity>
      </View>

      {/* Dashboard Content */}
      <ScrollView contentContainerStyle={styles.content} style={{ marginBottom: 70 }}>
        <View style={styles.card}><Text style={styles.cardText}>Bot Status</Text></View>
        <View style={styles.card}><Text style={styles.cardText}>Sensor Alerts</Text></View>
        <View style={styles.card}><Text style={styles.cardText}>Live Feed</Text></View>
        <View style={styles.card}><Text style={styles.cardText}>Map Panel</Text></View>
        <View style={styles.card}><Text style={styles.cardText}>Control Panel</Text></View>
        <View style={styles.card}><Text style={styles.cardText}>Mission Timeline</Text></View>
      </ScrollView>

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

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        {["Live Map", "Controls", "Dashboard", "Tasks"].map((tab) => {
          const isActive = activeTab === tab;
          let icon = "📊"; // default
          if (tab === "Live Map") icon = "🔍";
          if (tab === "Controls") icon = "📡";
          if (tab === "Dashboard") icon = "📊";
          if (tab === "Tasks") icon = "🧩";
          return (
            <TouchableOpacity
              key={tab}
              style={styles.navItem}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.navIcon, { color: isActive ? COLORS.accent : COLORS.muted }]}>{icon}</Text>
              <Text style={[styles.navText, { color: isActive ? COLORS.accent : COLORS.muted }]}>{tab}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { padding: 16, backgroundColor: COLORS.primary, flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderBottomWidth: 1, borderBottomColor: COLORS.secondary },
  logoContainer: { flexDirection: "row", alignItems: "center", gap: 12 },
  logoCircle: { width: 50, height: 50, borderRadius: 25, backgroundColor: COLORS.secondary, justifyContent: "center", alignItems: "center" },
  logoText: { color: COLORS.primary, fontWeight: "bold" },
  title: { color: COLORS.textPrimary, fontSize: 18, fontWeight: "bold" },
  subtitle: { color: COLORS.accent, fontSize: 12 },
  burgerButton: { padding: 8 },
  burgerText: { fontSize: 28, color: COLORS.accent },
  content: { padding: 16, flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  card: { width: "48%", height: 100, backgroundColor: COLORS.primary, borderRadius: 12, marginBottom: 16, justifyContent: "center", alignItems: "center" },
  cardText: { color: COLORS.accent, fontWeight: "bold" },
  menuOverlay: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.3)" },
  menu: { position: "absolute", top: 0, width: "60%", height: "100%", backgroundColor: COLORS.primary, paddingTop: 50, paddingHorizontal: 16 },
  menuItem: { paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: COLORS.accent + "33" },
  menuItemText: { color: COLORS.accent, fontWeight: "bold", fontSize: 16 },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 60,
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: COLORS.secondary,
  },
  navItem: { justifyContent: "center", alignItems: "center" },
  navIcon: { fontSize: 20 },
  navText: { fontSize: 12, marginTop: 2 },
});
