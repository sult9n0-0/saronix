import React, { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, Easing, PanResponder, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Feather from "react-native-vector-icons/Feather";

interface Detection {
  id: number;
  x: number;
  y: number;
  confidence: number;
}

export function LiveFeedPanel() {
  const [detections, setDetections] = useState<Detection[]>([
    { id: 1, x: 45, y: 30, confidence: 0.95 },
    { id: 2, x: 75, y: 65, confidence: 0.87 },
    { id: 3, x: 25, y: 55, confidence: 0.92 },
  ]);

  const feedWidth = Dimensions.get("window").width - 32; // more width
  const feedHeight = (feedWidth * 9) / 10; // bigger height

  const animations = useRef(detections.map(() => new Animated.Value(1))).current;

  useEffect(() => {
    animations.forEach((anim) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, { toValue: 1.3, duration: 800, useNativeDriver: true, easing: Easing.ease }),
          Animated.timing(anim, { toValue: 1, duration: 800, useNativeDriver: true, easing: Easing.ease }),
        ])
      ).start();
    });
  }, [animations]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDetections((prev) =>
        prev.map((d) => ({
          ...d,
          x: Math.random() * 90 + 5,
          y: Math.random() * 90 + 5,
        }))
      );
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  // Marker state
  const markerPos = useRef(new Animated.ValueXY({ x: feedWidth / 2, y: feedHeight / 2 })).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        markerPos.setOffset({ x: markerPos.x._value, y: markerPos.y._value });
        markerPos.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event([null, { dx: markerPos.x, dy: markerPos.y }], { useNativeDriver: false }),
      onPanResponderRelease: () => {
        markerPos.flattenOffset();
      },
    })
  ).current;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Live Feed</Text>
        <View style={styles.recording}>
          <View style={styles.recordDot} />
          <Text style={styles.recordText}>Recording</Text>
        </View>
      </View>

      <View style={styles.feedWrapper}>
        <View style={[styles.feedContainer, { width: feedWidth, height: feedHeight }]}>
          {detections.map((d, idx) => (
            <Animated.View
              key={d.id}
              style={[
                styles.detection,
                { left: `${d.x}%`, top: `${d.y}%`, transform: [{ scale: animations[idx] }] },
              ]}
            >
              <View style={styles.detectionOuter} />
              <View style={styles.detectionInner} />
              <View style={styles.confidenceLabel}>
                <Text style={styles.confidenceText}>{Math.round(d.confidence * 100)}%</Text>
              </View>
            </Animated.View>
          ))}

          {/* Draggable Marker */}
          <Animated.View
            {...panResponder.panHandlers}
            style={[
              styles.marker,
              {
                transform: markerPos.getTranslateTransform(),
              },
            ]}
          >
            <Feather name="map-pin" size={28} color="#f43f5e" />
          </Animated.View>
        </View>
      </View>

      <View style={styles.controlsContainer}>
        <View style={styles.controls}>
          <TouchableOpacity style={styles.markButton}>
            <Text style={styles.markButtonText}>Mark Survivor Location</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.captureButton}>
            <Text style={styles.captureButtonText}>Capture</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            <Text style={{ fontWeight: "bold" }}>{detections.length}</Text> humans detected • Drag the red marker
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: "#1e1e2f", borderRadius: 16, padding: 16, marginBottom: 16 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  title: { fontSize: 18, fontWeight: "bold", color: "#fff" },
  recording: { flexDirection: "row", alignItems: "center", gap: 4 },
  recordDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#22c55e" },
  recordText: { fontSize: 12, color: "#aaa" },
  feedWrapper: { alignSelf: "center" },
  feedContainer: { backgroundColor: "#000", borderRadius: 12, overflow: "hidden", position: "relative" },
  detection: { position: "absolute", width: 60, height: 60, marginLeft: -30, marginTop: -30, alignItems: "center", justifyContent: "center" },
  detectionOuter: { position: "absolute", width: 60, height: 60, borderRadius: 30, borderWidth: 2, borderColor: "rgba(34,197,94,0.6)" },
  detectionInner: { position: "absolute", width: 58, height: 58, borderRadius: 29, borderWidth: 1, borderColor: "rgba(34,197,94,0.3)" },
  confidenceLabel: { position: "absolute", bottom: -18, backgroundColor: "rgba(34,197,94,0.1)", paddingHorizontal: 4, borderRadius: 4 },
  confidenceText: { fontSize: 10, fontWeight: "600", color: "#22c55e" },
  marker: { position: "absolute", width: 32, height: 32, alignItems: "center", justifyContent: "center" },
  controlsContainer: { marginTop: 12 },
  controls: { flexDirection: "row", gap: 8, marginBottom: 8 },
  markButton: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#0ea5e9", paddingVertical: 10, borderRadius: 8 },
  markButtonText: { color: "#fff", fontWeight: "600" },
  captureButton: { backgroundColor: "#64748b", paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8 },
  captureButtonText: { color: "#fff", fontWeight: "600" },
  infoBox: { backgroundColor: "rgba(100,116,139,0.2)", borderRadius: 8, padding: 8 },
  infoText: { fontSize: 12, color: "#aaa" },
});
