// app/tabs/Dashboard.tsx
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

const COLORS = {
  primary: "#2B1B3D",
  secondary: "#FF6B6B",
  accent: "#4DD0E1",
  background: "#EDE7F6",
  textPrimary: "#ffffff",
};

export default function Dashboard() {
  return (
    <ScrollView 
      contentContainerStyle={styles.content} 
      style={{ flex: 1, backgroundColor: COLORS.background }}
    >
      {/* Focused Bot Status Card */}
      <View style={styles.card}>
        <Text style={styles.cardText}>Bot Status</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { 
    padding: 16, 
    flexDirection: "row", 
    flexWrap: "wrap", 
    justifyContent: "space-between" 
  },
  card: { 
    width: "100%",   // take full width for emphasis
    height: 150,     // slightly bigger since it's the only card
    backgroundColor: COLORS.primary, 
    borderRadius: 12, 
    marginBottom: 16, 
    justifyContent: "center", 
    alignItems: "center" 
  },
  cardText: { 
    color: COLORS.accent, 
    fontWeight: "bold", 
    fontSize: 18 
  },
});
