import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { BotStatusCard } from "./components/botstatuscard";
import { EmergencySOS } from "./components/emergencysos";
import { LiveFeedPanel } from "./components/livefeedpanel"; // <-- import Live Feed
import { SensorAlerts } from "./components/sensoralerts";
import { ThermalDisplay } from "./components/thermaldisplay";

const COLORS = {
  background: "#EDE7F6",
};

export default function Dashboard() {
  const handleSOS = () => {
    console.log("SOS triggered!"); // placeholder for real SOS logic
  };

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      style={{ flex: 1, backgroundColor: COLORS.background }}
    >
      {/* Focused Bot Status Card */}
      <BotStatusCard />

      {/* Sensor Alerts Card */}
      <SensorAlerts />

      {/* Thermal Sensor Card */}
      <ThermalDisplay maxTemp={100} threshold={60} />

      {/* Emergency SOS Card */}
      <EmergencySOS onSOS={handleSOS} />

      {/* Live Feed Panel */}
      <LiveFeedPanel />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    gap: 16, // spacing between cards
  },
});
