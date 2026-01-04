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
  const [autopilot, setAutopilot] = useState(false); // Autopilot state
  const obstacleDistanceRef = useRef<number | null>(null);
  const autopilotRef = useRef(false);
  const preferredTurnRef = useRef(true); // true = left, false = right
  const turnInProgressRef = useRef(false);

  const blinkAnim = useRef(new Animated.Value(0)).current;
  const alertTriggeredRef = useRef(false);

  const ARDUINO_SERVER = "http://192.168.137.143:5000/move";
  const AUTOPILOT_URL = "http://192.168.137.143:5000/autopilot";
  const CAMERA_FEED_URL = "http://192.168.137.143:5001/video_feed";
  const SURVIVOR_CHECK_URL = "http://192.168.137.143:5002/check_survivor";
  const OBSTACLE_CHECK_URL = "http://192.168.137.143:5000/distance";

  const setAutopilotRemote = async (enabled: boolean) => {
    try {
      await fetch(AUTOPILOT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ autopilot: enabled ? 1 : 0 }),
      });
      setBotOnline(true);
    } catch (e) {
      setBotOnline(false);
    }
  };

  // ---------------- Move Handler ----------------
  const handleMove = (direction: string) => {
    if (autopilot) return; // Don't allow manual moves during autopilot
    if (
      direction === "forward" &&
      obstacleDistance !== null &&
      obstacleDistance !== 0 &&
      obstacleDistance < 30
    )
      return;

    fetch(ARDUINO_SERVER, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ command: direction }),
    })
      .then(() => setBotOnline(true))
      .catch(() => setBotOnline(false));
  };

  // helper to send movement commands (used by autopilot)
  const sendCommand = async (command: string) => {
    try {
      await fetch(ARDUINO_SERVER, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command }),
      });
      setBotOnline(true);
    } catch (e) {
      setBotOnline(false);
    }
  };

  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

  // ---------------- Survivor Detection ----------------
  useEffect(() => {
    if (!humanDetected) return;

    const playSound = async () => {
      const { sound } = await Audio.Sound.createAsync(require("../../assets/alert.mp3"));
      setSound(sound);
      await sound.playAsync();
    };
    playSound();

    Vibration.vibrate(500);

    const blinkLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnim, { toValue: 1, duration: 500, useNativeDriver: false }),
        Animated.timing(blinkAnim, { toValue: 0, duration: 500, useNativeDriver: false }),
      ])
    );
    blinkLoop.start();

    const timer = setTimeout(() => {
      setHumanDetected(false);
      alertTriggeredRef.current = false;
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

        if (objects.includes("person") && !alertTriggeredRef.current) {
          alertTriggeredRef.current = true;
          setHumanDetected(true);
          setAlertMessage("⚠️ Survivor Detected!");
          setAlertVisible(true);
        }

        setBotOnline(true);
      } catch (e) {
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
        const distance = Number(data.distance_cm);
        const obstacle = data.obstacle;

        if (!Number.isFinite(distance)) {
          setObstacleDistance(null);
          obstacleDistanceRef.current = null;
        } else {
          setObstacleDistance(distance);
          obstacleDistanceRef.current = distance;
        }

        if (obstacle && distance !== 0 && distance < 30) {
          setAlertMessage(`⚠️ Obstacle Ahead! (${distance.toFixed(1)}cm)`);
          setAlertVisible(true);
        }

        setBotOnline(true);
      } catch (e) {
        setBotOnline(false);
      }
    }, 300);

    return () => clearInterval(interval);
  }, []);

  // ---------------- Autopilot Logic ----------------
  useEffect(() => {
    autopilotRef.current = autopilot;
    let cancelled = false;

    // Inform backend whenever autopilot is toggled.
    void setAutopilotRemote(autopilot);

    if (!autopilot) {
      // when turning autopilot off, ensure bot stops
      sendCommand("stop");
      return;
    }

    const runAutopilot = async () => {
      while (!cancelled && autopilotRef.current) {
        const dist = obstacleDistanceRef.current;

        if (dist !== null && dist !== 0 && dist < 30) {
          // stop and back until obstacle is gone
          await sendCommand("stop");

          while (
            autopilotRef.current &&
            obstacleDistanceRef.current !== null &&
            obstacleDistanceRef.current !== 0 &&
            obstacleDistanceRef.current < 30
          ) {
            await sendCommand("back");
            await delay(400);
          }

          // after backing clears the obstacle, perform a RIGHT turn for a total of 7 seconds
          turnInProgressRef.current = true;
          const totalTurnMs = 7000;
          let turnedMs = 0;
          const stepMs = 300;

          while (autopilotRef.current && turnedMs < totalTurnMs) {
            // if obstacle appears while turning, back until clear, then resume turning (do not reset turnedMs)
            if (
              obstacleDistanceRef.current !== null &&
              obstacleDistanceRef.current !== 0 &&
              obstacleDistanceRef.current < 30
            ) {
              // back until clear
              while (
                autopilotRef.current &&
                obstacleDistanceRef.current !== null &&
                obstacleDistanceRef.current !== 0 &&
                obstacleDistanceRef.current < 30
              ) {
                await sendCommand("back");
                await delay(400);
              }
            }

            // continue turning right in short pulses
            await sendCommand("right");
            await delay(stepMs);
            turnedMs += stepMs;
          }

          turnInProgressRef.current = false;
        } else {
          // path clear -> move forward in short pulses
          await sendCommand("forward");
          await delay(500);
        }

        await delay(120);
      }
    };

    runAutopilot();

    return () => {
      cancelled = true;
      autopilotRef.current = false;
      turnInProgressRef.current = false;
      sendCommand("stop");
    };
  }, [autopilot]);

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

      {/* CAMERA FEED */}
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
          <View style={{ width: "100%", height: 220, borderRadius: 12, overflow: "hidden" }}>
            <WebView
              source={{ uri: CAMERA_FEED_URL }}
              style={{ width: "100%", height: "100%" }}
              javaScriptEnabled
              scrollEnabled={false}
            />
          </View>
        ) : (
          <View
            style={{
              position: "absolute",
              width: "100%",
              height: 220,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#111",
              borderRadius: 12,
            }}
          >
            <Text style={{ color: "#FF6B6B", textAlign: "center" }}>Disconnected</Text>
          </View>
        )}

        <View style={styles.powerBadge}>
          <Feather name="zap" size={16} color="#4DD0E1" />
          <Text style={styles.powerText}>{botOnline ? "ACTIVE" : "OFFLINE"}</Text>
        </View>
      </Animated.View>

      {/* BUTTON CONTROLS */}
      <ScrollView style={{ marginTop: 20 }} contentContainerStyle={{ alignItems: "center", paddingBottom: 160 }}>
        {/* Forward */}
        <TouchableOpacity
          style={[styles.button, { padding: 20, backgroundColor: autopilot ? "#999" : "#4DD0E1" }]}
          onPress={() => handleMove("forward")}
          disabled={autopilot}
        >
          <Feather name="arrow-up" size={32} color={autopilot ? "#555" : "#2B1B3D"} />
        </TouchableOpacity>

        {/* Left + Right */}
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.button, { padding: 20, backgroundColor: autopilot ? "#999" : "#4DD0E1" }]}
            onPress={() => handleMove("left")}
            disabled={autopilot}
          >
            <Feather name="arrow-left" size={32} color={autopilot ? "#555" : "#2B1B3D"} />
          </TouchableOpacity>

          <View style={{ width: 50 }} />

          <TouchableOpacity
            style={[styles.button, { padding: 20, backgroundColor: autopilot ? "#999" : "#4DD0E1" }]}
            onPress={() => handleMove("right")}
            disabled={autopilot}
          >
            <Feather name="arrow-right" size={32} color={autopilot ? "#555" : "#2B1B3D"} />
          </TouchableOpacity>
        </View>

        {/* Bottom control row: STOP (left), DOWN (center), AUTO (right) */}
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 10, width: "100%" }}>
          <View style={{ width: 100, alignItems: "flex-end" }}>
            <TouchableOpacity
              style={[styles.controlSmall, { backgroundColor: autopilot ? "#999" : "#FF6B6B" }]}
              onPress={() => handleMove("stop")}
              disabled={autopilot}
            >
              <Text style={{ color: "#2B1B3D", fontWeight: "700" }}>STOP</Text>
            </TouchableOpacity>
          </View>

          <View style={{ width: 40 }} />

          <TouchableOpacity
            style={[styles.button, { padding: 20, backgroundColor: autopilot ? "#999" : "#4DD0E1" }]}
            onPress={() => handleMove("back")}
            disabled={autopilot}
          >
            <Feather name="arrow-down" size={32} color={autopilot ? "#555" : "#2B1B3D"} />
          </TouchableOpacity>

          <View style={{ width: 40 }} />

          <View style={{ width: 100, alignItems: "flex-start" }}>
            <TouchableOpacity
              style={[styles.controlSmall, { backgroundColor: autopilot ? "#FF6B6B" : "#4DD0E1" }]}
              onPress={() => setAutopilot((p) => !p)}
            >
              <Text style={{ color: "#2B1B3D", fontWeight: "700", fontSize: 12 }}>AUTO</Text>
            </TouchableOpacity>
          </View>
        </View>


      </ScrollView>
    </View>
  );
}

// ----------------- Styles -----------------
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#2B1B3D",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    overflow: "visible",
    alignItems: "center",
  },
  alertPopup: { position: "absolute", top: 60, zIndex: 100, backgroundColor: "#FF6B6B", padding: 12, borderRadius: 12 },
  alertText: { color: "#FFF", fontWeight: "700", fontSize: 16 },

  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%", marginBottom: 10 },
  title: { fontSize: 18, fontWeight: "600", color: "#EDE7F6" },

  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(16,185,129,0.3)",
  },
  liveDot: { width: 6, height: 6, backgroundColor: "#4DD0E1", borderRadius: 3, marginRight: 6 },
  liveText: { color: "#4DD0E1", fontSize: 12, fontWeight: "600" },

  cameraContainer: { backgroundColor: "#111", borderRadius: 12, height: 220, width: "100%", justifyContent: "center", alignItems: "center", overflow: "hidden" },
  grid: { position: "absolute", opacity: 0.12 },

  powerBadge: {
    position: "absolute",
    bottom: 10,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(77,208,225,0.3)",
  },
  powerText: { color: "#4DD0E1", fontSize: 12, marginLeft: 4, fontWeight: "600" },

  row: { flexDirection: "row", marginVertical: 10 },
  button: { backgroundColor: "#4DD0E1", padding: 28, borderRadius: 60, justifyContent: "center", alignItems: "center", marginVertical: 8 },
  autopilotButton: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: 24, minWidth: 120, alignItems: "center" },
  controlSmall: { width: 64, height: 48, borderRadius: 18, justifyContent: "center", alignItems: "center" },

  offlineBanner: { backgroundColor: "#FF6B6B", padding: 10, borderRadius: 8, marginBottom: 10, width: "100%", alignItems: "center" },
  offlineText: { color: "#EDE7F6", fontWeight: "700" },
});
