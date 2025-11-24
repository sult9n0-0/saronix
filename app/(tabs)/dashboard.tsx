// app/tabs/Dashboard.tsx
import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { BotStatusCard } from "./components/botstatuscard";
import { SensorAlerts } from "./components/sensoralerts";

const COLORS = {
  background: "#EDE7F6",
};

export default function Dashboard() {
  return (
    <ScrollView 
      contentContainerStyle={styles.content} 
      style={{ flex: 1, backgroundColor: COLORS.background }}
    >
      {/* Focused Bot Status Card */}
      <BotStatusCard />

      {/* Sensor Alerts Card */}
      <SensorAlerts />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { 
    padding: 16,
    gap: 16, // space between cards (React Native >=0.71)
  },
});
