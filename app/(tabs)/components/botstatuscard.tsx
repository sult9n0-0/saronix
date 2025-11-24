import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

interface BotStatusCardProps {
  botStatus?: "online" | "offline";
  batteryLevel?: number; // 0-100
  temperature?: number; // in °C
}

export function BotStatusCard({
  botStatus = "online",
  batteryLevel = 78,
  temperature = 42,
}: BotStatusCardProps) {
  const blinkAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const blink = Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(blinkAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    blink.start();
    return () => blink.stop();
  }, []);

  return (
    <View style={styles.card}>
      {/* Status Header */}
      <View style={styles.statusHeader}>
        <Text style={styles.title}>Bot Status</Text>
        <Animated.View
          style={[
            styles.statusDot,
            { backgroundColor: botStatus === "online" ? "#4DD0E1" : "#FF6B6B", opacity: blinkAnim },
          ]}
        />
      </View>

      {/* Status Info */}
      <View style={styles.statusInfo}>
        {/* Status */}
        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="robot-happy" size={24} color="#4DD0E1" />
          <View style={styles.infoTextContainer}>
            <Text style={styles.label}>Status</Text>
            <Text style={styles.value}>{botStatus}</Text>
          </View>
        </View>

        {/* Battery */}
        <View style={styles.infoRow}>
          <FontAwesome5 name="battery-three-quarters" size={24} color="#FFB74D" />
          <View style={styles.infoTextContainer}>
            <Text style={styles.label}>Battery</Text>
            <View style={styles.batteryRow}>
              <View style={styles.batteryBarBackground}>
                <View
                  style={[
                    styles.batteryBarFill,
                    { width: `${batteryLevel}%` },
                  ]}
                />
              </View>
              <Text style={styles.batteryPercent}>{batteryLevel}%</Text>
            </View>
          </View>
        </View>

        {/* Temperature */}
        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="thermometer" size={24} color="#4DD0E1" />
          <View style={styles.infoTextContainer}>
            <Text style={styles.label}>Temperature</Text>
            <Text style={styles.value}>{temperature}°C</Text>
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
  statusHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusInfo: {
    gap: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  infoTextContainer: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: "#A7A0B8",
  },
  value: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
  },
  batteryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  batteryBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: "#A7A0B8",
    borderRadius: 4,
    overflow: "hidden",
  },
  batteryBarFill: {
    height: "100%",
    backgroundColor: "#FFB74D",
  },
  batteryPercent: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#ffffff",
    minWidth: 30,
    textAlign: "right",
  },
});
