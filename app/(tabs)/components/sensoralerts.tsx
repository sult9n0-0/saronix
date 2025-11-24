import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface SensorAlertsProps {
  gasLevel?: number;
  distance?: number;
  survivorCount?: number;
}

export function SensorAlerts({
  gasLevel = 2.1,
  distance = 156,
  survivorCount = 3,
}: SensorAlertsProps) {
  const hasGasWarning = gasLevel > 2.0;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Sensors & Alerts</Text>

      {/* Gas Sensor */}
      <View style={styles.section}>
        <View style={styles.row}>
          <View style={styles.row}>
            <MaterialCommunityIcons name="weather-windy" size={20} color="#FFB74D" />
            <Text style={styles.label}>Gas Level</Text>
          </View>
          {hasGasWarning && (
            <MaterialCommunityIcons
              name="alert"
              size={20}
              color="#FF6B6B"
              style={styles.blink}
            />
          )}
        </View>
        <View style={styles.row}>
          <Text style={styles.value}>{gasLevel.toFixed(1)}</Text>
          <Text style={styles.unit}>ppm</Text>
        </View>
        {hasGasWarning && (
          <Text style={styles.warning}>⚠️ Gas leak detected - evacuate area</Text>
        )}
      </View>

      {/* Distance */}
      <View style={styles.section}>
        <View style={styles.row}>
          <FontAwesome5 name="tachometer-alt" size={20} color="#4DD0E1" />
          <Text style={styles.label}>Distance Traveled</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.value}>{distance}</Text>
          <Text style={styles.unit}>meters</Text>
        </View>
      </View>

      {/* Survivor Count */}
      <View style={styles.section}>
        <View style={styles.row}>
          <FontAwesome5 name="users" size={20} color="#4CAF50" />
          <Text style={styles.label}>Survivors Detected</Text>
        </View>
        <View style={styles.row}>
          <Text style={[styles.value, { color: "#4CAF50" }]}>{survivorCount}</Text>
          <Text style={styles.unit}>persons</Text>
        </View>
      </View>

      {/* Heat Signature Warning */}
      <View style={styles.heatWarning}>
        <View style={styles.row}>
          <MaterialCommunityIcons name="trending-up" size={18} color="#4DD0E1" />
          <View style={{ flex: 1, marginLeft: 6 }}>
            <Text style={styles.heatTitle}>Heat Signature Detected</Text>
            <Text style={styles.heatSub}>
              High temperature anomaly near section B-4
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#2B1B3D",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 12,
  },
  section: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#4DD0E133", // subtle divider
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    color: "#A7A0B8",
    marginLeft: 6,
  },
  value: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
  },
  unit: {
    fontSize: 12,
    color: "#A7A0B8",
    marginLeft: 4,
  },
  warning: {
    fontSize: 12,
    color: "#FF6B6B",
    fontWeight: "500",
    marginTop: 4,
  },
  heatWarning: {
    backgroundColor: "rgba(255, 107, 107, 0.1)",
    borderColor: "rgba(255, 107, 107, 0.3)",
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
  },
  heatTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4DD0E1",
  },
  heatSub: {
    fontSize: 12,
    color: "#A7A0B8",
    marginTop: 2,
  },
  blink: {
    opacity: 1, // will animate if needed
  },
});
