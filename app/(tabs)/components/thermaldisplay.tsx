import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";

interface ThermalDisplayProps {
  maxTemp: number;
  threshold?: number;
}

export function ThermalDisplay({ maxTemp, threshold = 60 }: ThermalDisplayProps) {
  const [currentTemp, setCurrentTemp] = useState(maxTemp * 0.3); // start cooler
  const animatedTemp = useRef(new Animated.Value(currentTemp)).current;

  // Simulate realistic gradual temperature changes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTemp(prev => {
        const change = (Math.random() - 0.5) * 2; // -1 to +1°C change
        let next = prev + change;
        next = Math.max(0, Math.min(maxTemp, next)); // clamp between 0 and maxTemp
        Animated.timing(animatedTemp, {
          toValue: next,
          duration: 800,
          easing: Easing.linear,
          useNativeDriver: false,
        }).start();
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [maxTemp]);

  const [displayTemp, setDisplayTemp] = useState(currentTemp);
  useEffect(() => {
    const listener = animatedTemp.addListener(({ value }) => setDisplayTemp(value));
    return () => animatedTemp.removeListener(listener);
  }, []);

  const percentage = (displayTemp / maxTemp) * 100;
  const isWarning = displayTemp > threshold;

  // Gradient color based on temperature
  const getColor = (temp: number) => {
    if (temp < maxTemp * 0.33) return "#4DD0E1"; // cool
    if (temp < maxTemp * 0.66) return "#FBC02D"; // warm
    return "#FF6B6B"; // hot
  };

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Thermal Sensor</Text>
        <MaterialCommunityIcons name="fire" size={24} color={getColor(displayTemp)} />
      </View>

      {/* Gauge */}
      <View style={styles.gaugeContainer}>
        <View style={[styles.gaugeCircle, { borderColor: getColor(displayTemp) }]}>
          <Text style={[styles.gaugeText, { color: getColor(displayTemp) }]}>
            {Math.round(displayTemp)}°C
          </Text>
        </View>
        <View style={styles.rangeContainer}>
          <Text style={styles.rangeText}>0°</Text>
          <View style={styles.rangeBar}>
            <Animated.View
              style={[
                styles.rangeIndicator,
                {
                  left: `${Math.min(percentage, 100)}%`,
                  backgroundColor: getColor(displayTemp),
                },
              ]}
            />
          </View>
          <Text style={styles.rangeText}>{maxTemp}°</Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Current</Text>
          <Text style={styles.statValue}>{Math.round(displayTemp)}°C</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Max</Text>
          <Text style={styles.statValue}>{maxTemp}°C</Text>
        </View>
      </View>

      {/* Warning */}
      {isWarning && (
        <View style={styles.warningContainer}>
          <MaterialCommunityIcons name="alert" size={18} color="#FF6B6B" />
          <View style={{ marginLeft: 6 }}>
            <Text style={styles.warningTitle}>High Temperature</Text>
            <Text style={styles.warningText}>
              Monitor thermal levels and consider reducing load
            </Text>
          </View>
        </View>
      )}
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
  },
  gaugeContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  gaugeCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  gaugeText: {
    fontSize: 22,
    fontWeight: "bold",
  },
  rangeContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  rangeText: {
    fontSize: 12,
    color: "#A7A0B8",
  },
  rangeBar: {
    flex: 1,
    height: 6,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 3,
    marginHorizontal: 4,
    overflow: "hidden",
  },
  rangeIndicator: {
    position: "absolute",
    width: 2,
    height: "100%",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.05)",
    padding: 12,
    borderRadius: 12,
    marginHorizontal: 4,
    alignItems: "center",
  },
  statLabel: {
    fontSize: 12,
    color: "#A7A0B8",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
  },
  warningContainer: {
    flexDirection: "row",
    padding: 8,
    backgroundColor: "rgba(255,107,107,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,107,107,0.3)",
    borderRadius: 12,
    alignItems: "flex-start",
  },
  warningTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FF6B6B",
  },
  warningText: {
    fontSize: 12,
    color: "#A7A0B8",
    marginTop: 2,
  },
});
