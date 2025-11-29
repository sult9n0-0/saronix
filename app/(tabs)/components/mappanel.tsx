// components/MapPanel.tsx
import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
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
          <Text style={styles.legendText}>Bot Position</Text>
        </View>

        <View style={styles.legendItem}>
          <View style={[styles.legendIcon, { backgroundColor: "#22c55e" }]} />
          <Text style={styles.legendText}>Survivors</Text>
        </View>

        <View style={styles.legendItem}>
          <View style={[styles.legendIcon, { backgroundColor: "#ef4444" }]} />
          <Text style={styles.legendText}>Obstacles</Text>
        </View>

        <View style={styles.legendItem}>
          <View style={[styles.legendIcon, { borderColor: "#22c55e", borderWidth: 1, borderStyle: "dashed" }]} />
          <Text style={styles.legendText}>Safe Path</Text>
        </View>
      </View>
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
});
