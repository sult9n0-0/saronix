// components/MapPanel.tsx
import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import Svg, { Circle, Defs, G, Line, Path, Pattern, Polygon, Rect, Text as SvgText } from "react-native-svg";

interface MapPanelProps {
  style?: object;
}
export function MapPanel({ style }: MapPanelProps) {
  const botX = 50;
  const botY = 30;

  const obstacles = [
    { x: 30, y: 20, width: 15, height: 25 },
    { x: 70, y: 60, width: 20, height: 15 },
    { x: 10, y: 70, width: 25, height: 20 },
  ];

  const survivors = [
    { id: 1, x: 25, y: 50, name: "Survivor A" },
    { id: 2, x: 75, y: 40, name: "Survivor B" },
    { id: 3, x: 40, y: 75, name: "Survivor C" },
  ];

  const safePaths = [
    { from: { x: botX, y: botY }, to: { x: 25, y: 50 } },
    { from: { x: botX, y: botY }, to: { x: 75, y: 40 } },
  ];

  const { width, height } = Dimensions.get("window");

  // Map the 0-100 svg coordinates to a real-world lat/lon/alt bounding box
  const LAT_MIN = 37.4215;
  const LAT_MAX = 37.4240;
  const LON_MIN = -122.0860;
  const LON_MAX = -122.0820;
  const ALT_MIN = 0; // meters
  const ALT_MAX = 30; // meters

  function toLatLon(x: number, y: number) {
    // x: 0..100 maps to lon from LON_MIN..LON_MAX
    const lon = LON_MIN + (x / 100) * (LON_MAX - LON_MIN);
    // y: 0..100 maps to lat from LAT_MAX..LAT_MIN (svg y increases downward)
    const lat = LAT_MAX - (y / 100) * (LAT_MAX - LAT_MIN);
    // altitude inversely proportional to y (higher on map -> higher altitude)
    const alt = ALT_MIN + (1 - y / 100) * (ALT_MAX - ALT_MIN);
    return { lat, lon, alt };
  }

  const botGeo = toLatLon(botX, botY);

  return (
    <View style={styles.fullscreen}>
      {/* Map SVG fills entire screen minus nav/header */}
      <View style={styles.mapContainer}>
        <Svg width="100%" height="100%" viewBox="0 0 100 100">
          <Defs>
            <Pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <Path d="M 10 0 L 0 0 0 10" stroke="rgba(0,213,255,0.1)" strokeWidth="0.5" fill="none" />
            </Pattern>
          </Defs>

          <Rect width="100" height="100" fill="url(#grid)" />

          {safePaths.map((path, idx) => (
            <Line
              key={idx}
              x1={path.from.x}
              y1={path.from.y}
              x2={path.to.x}
              y2={path.to.y}
              stroke="rgba(34,197,94,0.4)"
              strokeWidth="1.5"
              strokeDasharray="3,3"
            />
          ))}

          {obstacles.map((ob, idx) => (
            <G key={idx}>
              <Rect
                x={ob.x}
                y={ob.y}
                width={ob.width}
                height={ob.height}
                fill="rgba(239,68,68,0.3)"
                stroke="rgba(239,68,68,0.6)"
                strokeWidth="1"
              />
              <SvgText
                x={ob.x + ob.width / 2}
                y={ob.y + ob.height / 2}
                fill="rgba(239,68,68,0.7)"
                fontSize="4"
                textAnchor="middle"
                alignmentBaseline="middle"
              >
                ⚠
              </SvgText>
            </G>
          ))}

          {survivors.map((s) => (
            <G key={s.id}>
              <Circle cx={s.x} cy={s.y} r="2.5" fill="rgba(34,197,94,0.8)" stroke="rgba(34,197,94,1)" strokeWidth="1" />
              <Circle cx={s.x} cy={s.y} r="4.5" fill="none" stroke="rgba(34,197,94,0.3)" strokeWidth="1" />
            </G>
          ))}

          <G>
            <Circle cx={botX} cy={botY} r="3" fill="rgba(0,213,255,1)" stroke="rgba(0,213,255,0.5)" strokeWidth="1" />
            <Polygon
              points={`${botX},${botY - 4} ${botX + 2.5},${botY + 2} ${botX - 2.5},${botY + 2}`}
              fill="rgba(0,213,255,0.6)"
            />
            <Circle cx={botX} cy={botY} r="6" fill="none" stroke="rgba(0,213,255,0.2)" strokeWidth="1" />
          </G>
        </Svg>
      </View>

      {/* Legend floating at bottom */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendIcon, { backgroundColor: "#00d5ff" }]} />
          <ThemedText style={styles.legendText}>Bot Position</ThemedText>
        </View>

        <View style={styles.legendItem}>
          <View style={[styles.legendIcon, { backgroundColor: "#22c55e" }]} />
          <ThemedText style={styles.legendText}>Survivors</ThemedText>
        </View>

        <View style={styles.legendItem}>
          <View style={[styles.legendIcon, { backgroundColor: "#ef4444" }]} />
          <ThemedText style={styles.legendText}>Obstacles</ThemedText>
        </View>

        <View style={styles.legendItem}>
          <View style={[styles.legendIcon, { borderColor: "#22c55e", borderWidth: 1, borderStyle: "dashed" }]} />
          <ThemedText style={styles.legendText}>Safe Path</ThemedText>
        </View>
      </View>

      {/* Coordinates floating at top-right */}
      <ThemedView style={styles.coordsContainer}>
        <ThemedText type="defaultSemiBold">Coordinates</ThemedText>
        <ThemedText>Lat: {botGeo.lat.toFixed(6)}</ThemedText>
        <ThemedText>Lon: {botGeo.lon.toFixed(6)}</ThemedText>
        <ThemedText>Alt: {botGeo.alt.toFixed(1)} m</ThemedText>
        <ThemedText style={{ marginTop: 6 }}>Map X: {botX.toFixed(1)} Y: {botY.toFixed(1)}</ThemedText>
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  fullscreen: {
    flex: 1,
    backgroundColor: "#0f172a",
    paddingTop: 0,
  },

  mapContainer: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "#1e293b",
  },

  legend: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },

  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },

  legendIcon: {
    width: 14,
    height: 14,
    borderRadius: 3,
    marginRight: 6,
  },

  legendText: {
    color: "#e2e8f0",
    fontSize: 14,
  },
  coordsContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(226,232,240,0.08)',
    backgroundColor: 'rgba(15,23,42,0.72)',
    minWidth: 140,
  },
});
