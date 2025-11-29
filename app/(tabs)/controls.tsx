import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Svg, { Defs, Path, Pattern, Rect } from "react-native-svg";
import { WebView } from "react-native-webview";

export default function ControlPanel() {
  const [botOnline, setBotOnline] = useState(true);
  const [moistureData, setMoistureData] = useState<{ raw: number; percent: number; category: string } | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const ARDUINO_SERVER = "http://192.168.137.143:5000/move";
  const CAMERA_FEED_URL = "http://192.168.137.143:5001/video_feed";

  const handleMove = (direction: string) => {
    fetch(ARDUINO_SERVER, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ command: direction }),
    })
      .then((res) => res.json())
      .then(() => setBotOnline(true))
      .catch(() => setBotOnline(false));
  };

  const handleMeasureMoisture = () => {
    fetch(ARDUINO_SERVER, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ command: "moisture" }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "ok" && data.moisture) {
          setMoistureData(data.moisture);
          setModalVisible(true);
        } else {
          alert("Failed to get moisture data");
        }
      })
      .catch(() => alert("Error communicating with Arduino"));
  };

  return (
    <View style={styles.card}>
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

      <View style={styles.cameraContainer}>
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
      </View>

      <View style={{ width: "100%", marginTop: 20 }}>
        <ScrollView contentContainerStyle={{ alignItems: "center" }}>
          <TouchableOpacity style={[styles.button, { padding: 20, backgroundColor: "#4DD0E1" }]} onPress={() => handleMove("forward")}>
            <Feather name="arrow-up" size={32} color="#2B1B3D" />
          </TouchableOpacity>

          <View style={styles.row}>
            <TouchableOpacity style={[styles.button, { padding: 20, backgroundColor: "#4DD0E1" }]} onPress={() => handleMove("left")}>
              <Feather name="arrow-left" size={32} color="#2B1B3D" />
            </TouchableOpacity>

            <View style={{ width: 50 }} />

            <TouchableOpacity style={[styles.button, { padding: 20, backgroundColor: "#4DD0E1" }]} onPress={() => handleMove("right")}>
              <Feather name="arrow-right" size={32} color="#2B1B3D" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={[styles.button, { padding: 20, backgroundColor: "#4DD0E1" }]} onPress={() => handleMove("back")}>
            <Feather name="arrow-down" size={32} color="#2B1B3D" />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, { backgroundColor: "#FF6B6B", padding: 20 }]} onPress={() => handleMove("stop")}>
            <Text style={{ color: "#2B1B3D", fontWeight: "700" }}>STOP</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, { backgroundColor: "#FF6B6B", padding: 10, marginTop: 6 }]} onPress={handleMeasureMoisture}>
            <Text style={{ color: "#2B1B3D", fontWeight: "700" }}>Measure Moisture</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <Modal visible={modalVisible} transparent={false} animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>🌱 Moisture Status</Text>
            {moistureData ? (
              <View style={styles.modalData}>
                <Text style={styles.modalText}>Category: {moistureData.category}</Text>
                <Text style={styles.modalText}>Percent: {moistureData.percent}%</Text>
                <Text style={styles.modalText}>Raw Value: {moistureData.raw}</Text>
              </View>
            ) : (
              <Text style={styles.modalText}>No data available.</Text>
            )}
            <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: "#2B1B3D", borderRadius: 16, padding: 16, marginBottom: 20, overflow: "hidden", alignItems: "center" },
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
  modalContainer: { flex: 1, backgroundColor: "#2B1B3D", justifyContent: "center", alignItems: "center" },
  modalContent: { backgroundColor: "#2B1B3D", borderRadius: 16, padding: 24, width: "85%", alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 10 },
  modalTitle: { fontSize: 20, fontWeight: "700", color: "#FF6B6B", marginBottom: 16, textAlign: "center" },
  modalData: { marginBottom: 24, alignItems: "center" },
  modalText: { color: "#EDE7F6", fontSize: 16, marginVertical: 4 },
  modalButton: { backgroundColor: "#4DD0E1", paddingVertical: 12, paddingHorizontal: 32, borderRadius: 12, alignItems: "center" },
  modalButtonText: { color: "#2B1B3D", fontWeight: "700", fontSize: 16 },
});
