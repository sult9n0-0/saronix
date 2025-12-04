import { Feather } from "@expo/vector-icons";
import { Audio } from "expo-av";
import React, { useEffect, useRef, useState } from "react";
import { Animated, ScrollView, StyleSheet, Text, TouchableOpacity, Vibration, View } from "react-native";
import Svg, { Defs, Path, Pattern, Rect } from "react-native-svg";
import { WebView } from "react-native-webview";

// ----------------- Alert Popup Component -----------------
const AlertPopup = ({ visible, message, onHide }: { visible: boolean; message: string; onHide: () => void }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) return;

    Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();

    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start(() => onHide());
    }, 4000);

    return () => clearTimeout(timer);
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.alertPopup, { opacity: fadeAnim }]}>
      <Text style={styles.alertText}>{message}</Text>
    </Animated.View>
  );
};

// ----------------- Main Component -----------------
export default function ControlPanel() {
  const [botOnline, setBotOnline] = useState(true);
  const [humanDetected, setHumanDetected] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [obstacleDistance, setObstacleDistance] = useState<number | null>(null);

  const blinkAnim = useRef(new Animated.Value(0)).current;
  const alertTriggeredRef = useRef(false); // ensure single alert per detection

  const ARDUINO_SERVER = "http://192.168.137.143:5000/move";
  const CAMERA_FEED_URL = "http://192.168.137.143:5001/video_feed";
  const SURVIVOR_CHECK_URL = "http://192.168.137.143:5002/check_survivor";
  const OBSTACLE_CHECK_URL = "http://192.168.137.143:5000/distance";

  // ---------------- Move Handler ----------------
  const handleMove = (direction: string) => {
    if (direction === "forward" && obstacleDistance !== null && obstacleDistance < 30) {
      console.log("Forward blocked due to obstacle!");
      return;
    }

    fetch(ARDUINO_SERVER, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ command: direction }),
    })
      .then(() => setBotOnline(true))
      .catch(() => setBotOnline(false));
  };

// ---------------- Survivor detection effect ----------------
useEffect(() => {
  if (!humanDetected) return;

  // Play alert sound
  const playSound = async () => {
    const { sound } = await Audio.Sound.createAsync(require("../../assets/alert.mp3"));
    setSound(sound);
    await sound.playAsync();
  };
  playSound();

  // Vibrate device
  Vibration.vibrate(500);

  // Blink animation
  const blinkLoop = Animated.loop(
    Animated.sequence([
      Animated.timing(blinkAnim, { toValue: 1, duration: 500, useNativeDriver: false }),
      Animated.timing(blinkAnim, { toValue: 0, duration: 500, useNativeDriver: false }),
    ])
  );
  blinkLoop.start();

  const timer = setTimeout(() => {
    setHumanDetected(false);               // reset detection
    alertTriggeredRef.current = false;     // allow next alert
    blinkLoop.stop();
    blinkAnim.setValue(0);
  }, 5000);

  return () => {
    clearTimeout(timer);
    if (sound) sound.unloadAsync();
    blinkLoop.stop();
    blinkAnim.setValue(0);
  };
}, [humanDetected]);

// ---------------- Check SURVIVOR API ----------------
useEffect(() => {
  const interval = setInterval(async () => {
    try {
      const res = await fetch(SURVIVOR_CHECK_URL);
      const data = await res.json();
      const objects = data.objects || [];

      // Only trigger if at least one person is detected and no alert is active
      if (objects.includes("person") && !alertTriggeredRef.current) {
        console.log("⚠️ PERSON DETECTED");
        alertTriggeredRef.current = true;      // <- move check here
        setHumanDetected(true);                // triggers Survivor Detection Effect
        setAlertMessage("⚠️ Survivor Detected!");
        setAlertVisible(true);
      }

      setBotOnline(true);
    } catch (e) {
      console.log("Error checking survivor:", e);
      setBotOnline(false);
    }
  }, 200);

  return () => clearInterval(interval);
}, []);

  // ---------------- Check OBSTACLE API ----------------
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(OBSTACLE_CHECK_URL);
        const data = await res.json();
        const distance = data.distance_cm;
        const obstacle = data.obstacle;

        setObstacleDistance(distance);

        if (obstacle && distance < 30) {
          console.log(`⚠️ OBSTACLE DETECTED → Distance: ${distance}cm`);
          setAlertMessage(`⚠️ Obstacle Ahead! (${distance.toFixed(1)}cm)`);
          setAlertVisible(true);
        }

        setBotOnline(true);
      } catch (e) {
        console.log("Error checking obstacle:", e);
        setBotOnline(false);
      }
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.card}>
      <AlertPopup visible={alertVisible} message={alertMessage} onHide={() => setAlertVisible(false)} />

      {!botOnline && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>😞 Bot is offline</Text>
        </View>
      )}

      <View style={styles.header}>
        <Text style={styles.title}>Live Camera Feed</Text>
        {botOnline && (
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        )}
      </View>

      <Animated.View
        style={[
          styles.cameraContainer,
          {
            borderWidth: blinkAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 4] }),
            borderColor: blinkAnim.interpolate({ inputRange: [0, 1], outputRange: ["transparent", "#FF6B6B"] }),
          },
        ]}
      >
        <Svg style={styles.grid} height="100%" width="100%">
          <Defs>
            <Pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <Path d="M 40 0 L 0 0 0 40" stroke="#4DD0E1" strokeWidth="0.5" />
            </Pattern>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#grid)" />
        </Svg>

        {botOnline ? (
          <View style={styles.webviewWrapper}>
            <WebView source={{ uri: CAMERA_FEED_URL }} style={styles.webview} javaScriptEnabled scrollEnabled={false} />
          </View>
        ) : (
          <View style={styles.centerContent}>
            <Text style={{ color: "#FF6B6B", fontSize: 14, textAlign: "center" }}>
              Disconnected - Live Feed Real-time Camera from Saronix
            </Text>
          </View>
        )}

        <View style={styles.powerBadge}>
          <Feather name="zap" size={16} color="#4DD0E1" />
          <Text style={styles.powerText}>{botOnline ? "ACTIVE" : "OFFLINE"}</Text>
        </View>
      </Animated.View>

      <View style={{ width: "100%", marginTop: 20 }}>
        <ScrollView contentContainerStyle={{ alignItems: "center", paddingBottom: 80 }}>
          <TouchableOpacity style={[styles.button, { padding: 20 }]} onPress={() => handleMove("forward")}>
            <Feather name="arrow-up" size={32} color="#2B1B3D" />
          </TouchableOpacity>

          <View style={styles.row}>
            <TouchableOpacity style={[styles.button, { padding: 20 }]} onPress={() => handleMove("left")}>
              <Feather name="arrow-left" size={32} color="#2B1B3D" />
            </TouchableOpacity>

            <View style={{ width: 50 }} />

            <TouchableOpacity style={[styles.button, { padding: 20 }]} onPress={() => handleMove("right")}>
              <Feather name="arrow-right" size={32} color="#2B1B3D" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={[styles.button, { padding: 20 }]} onPress={() => handleMove("back")}>
            <Feather name="arrow-down" size={32} color="#2B1B3D" />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, { backgroundColor: "#FF6B6B", padding: 20 }]} onPress={() => handleMove("stop")}>
            <Text style={{ color: "#2B1B3D", fontWeight: "700" }}>STOP</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}

// ----------------- Styles -----------------
const styles = StyleSheet.create({
  card: { backgroundColor: "#2B1B3D", borderRadius: 16, padding: 16, marginBottom: 20, overflow: "hidden", alignItems: "center" },
  humanBanner: { position: "absolute", top: 10, zIndex: 50, backgroundColor: "#FF6B6B", paddingVertical: 8, paddingHorizontal: 16, borderRadius: 12 },
  humanBannerText: { color: "#FFF", fontWeight: "700", fontSize: 16 },
  alertPopup: { position: "absolute", top: 60, zIndex: 100, backgroundColor: "#FF6B6B", padding: 12, borderRadius: 12 },
  alertText: { color: "#FFF", fontWeight: "700", fontSize: 16 },

  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%", marginBottom: 10 },
  title: { fontSize: 18, fontWeight: "600", color: "#EDE7F6" },

  liveBadge: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(0,0,0,0.6)", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, borderWidth: 1, borderColor: "rgba(16,185,129,0.3)" },
  liveDot: { width: 6, height: 6, backgroundColor: "#4DD0E1", borderRadius: 3, marginRight: 6 },
  liveText: { color: "#4DD0E1", fontSize: 12, fontWeight: "600" },

  cameraContainer: { backgroundColor: "#111", borderRadius: 12, height: 220, width: "100%", justifyContent: "center", alignItems: "center", overflow: "hidden" },
  grid: { position: "absolute", opacity: 0.12 },

  webviewWrapper: { position: "absolute", width: "100%", height: "100%", zIndex: 10, borderRadius: 12, overflow: "hidden" },
  webview: { width: "100%", height: "100%" },

  centerContent: { zIndex: 20, alignItems: "center", justifyContent: "center", position: "absolute" },

  powerBadge: { position: "absolute", bottom: 10, right: 10, flexDirection: "row", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, borderWidth: 1, borderColor: "rgba(77,208,225,0.3)" },
  powerText: { color: "#4DD0E1", fontSize: 12, marginLeft: 4, fontWeight: "600" },

  row: { flexDirection: "row", marginVertical: 10 },
  button: { backgroundColor: "#4DD0E1", padding: 28, borderRadius: 60, justifyContent: "center", alignItems: "center", marginVertical: 8 },

  offlineBanner: { backgroundColor: "#FF6B6B", padding: 10, borderRadius: 8, marginBottom: 10, width: "100%", alignItems: "center" },
  offlineText: { color: "#EDE7F6", fontWeight: "700" },
});
