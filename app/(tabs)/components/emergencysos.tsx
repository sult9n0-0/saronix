// components/EmergencySOS.tsx
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Feather from "react-native-vector-icons/Feather";

interface EmergencySOSProps {
  onSOS?: () => void;
}

export function EmergencySOS({ onSOS }: EmergencySOSProps) {
  const [isActive, setIsActive] = useState(false);
  const [confirmationStep, setConfirmationStep] = useState<"idle" | "confirm" | "sending" | "sent">("idle");
  const [tapCount, setTapCount] = useState(0);

  const handleSOSClick = () => {
    if (confirmationStep === "idle") {
      setConfirmationStep("confirm");
      setTapCount(1);
    } else if (confirmationStep === "confirm") {
      const next = tapCount + 1;
      if (next >= 3) {
        triggerSOS();
        setTapCount(0);
      } else {
        setTapCount(next);
      }
    }
  };

  const triggerSOS = () => {
    setConfirmationStep("sending");
    setIsActive(true);

    setTimeout(() => {
      setConfirmationStep("sent");
      if (onSOS) onSOS();

      setTimeout(() => {
        setConfirmationStep("idle");
        setIsActive(false);
      }, 5000);
    }, 2000);
  };

  const handleCancel = () => {
    setConfirmationStep("idle");
    setTapCount(0);
  };

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <Feather name="alert-triangle" size={24} color="#FF6B6B" />
        <Text style={styles.title}>Emergency SOS</Text>
      </View>
      <Text style={styles.subtitle}>
        Trigger emergency protocol and alert authorities
      </Text>

      {/* SOS Button */}
      <View style={styles.buttonWrapper}>
        <TouchableOpacity
          onPress={handleSOSClick}
          disabled={confirmationStep === "sending"}
          style={[
            styles.sosButton,
            isActive
              ? styles.active
              : confirmationStep === "confirm"
              ? styles.confirm
              : styles.idle,
          ]}
        >
          {confirmationStep === "sending" ? (
            <Text style={styles.buttonText}>Sending...</Text>
          ) : confirmationStep === "sent" ? (
            <View style={styles.sentContainer}>
              <Feather name="phone" size={24} color="#ffffff" />
              <Text style={styles.buttonTextSmall}>SOS Sent!</Text>
            </View>
          ) : (
            <View style={styles.pressContainer}>
              <Feather name="alert-triangle" size={32} color="#FF6B6B" />
              <Text style={styles.buttonTextSmall}>Press to Activate</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Confirmation */}
      {confirmationStep === "confirm" && (
        <View style={styles.confirmContainer}>
          <Text style={styles.confirmText}>
            Tap {3 - tapCount} more times to activate
          </Text>
          <View style={styles.progressDots}>
            {[0, 1, 2].map((idx) => (
              <View
                key={idx}
                style={[
                  styles.dot,
                  idx < tapCount ? styles.dotActive : styles.dotInactive,
                ]}
              />
            ))}
          </View>
          <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Sent Info */}
      {confirmationStep === "sent" && (
        <View style={styles.sentInfo}>
          <Text style={styles.sentTitle}>Emergency Alert Sent</Text>
          <Text style={styles.sentSubtitle}>
            Authorities have been notified of the emergency
          </Text>
          <View style={styles.channels}>
            {[
              { icon: "phone", name: "Emergency Services", status: "Notified" },
              { icon: "send", name: "Team Alerts", status: "Sent" },
              { icon: "lock", name: "Data Logged", status: "Saved" },
            ].map((channel, idx) => (
              <View key={idx} style={styles.channelRow}>
                <Feather name={channel.icon} size={16} color="#4CAF50" />
                <Text style={styles.channelName}>{channel.name}</Text>
                <Text style={styles.channelStatus}>{channel.status}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Idle Info */}
      {confirmationStep === "idle" && (
        <View style={styles.idleInfo}>
          <Text style={styles.infoTitle}>Use only in critical emergencies</Text>
          <Text style={styles.infoItem}>• Immediately halts all bot operations</Text>
          <Text style={styles.infoItem}>• Alerts emergency services</Text>
          <Text style={styles.infoItem}>• Notifies your team</Text>
          <Text style={styles.infoItem}>• Locks mission data</Text>
        </View>
      )}
    </View>
  );
}

// Styles remain the same as your previous component


const styles = StyleSheet.create({
  card: {
    backgroundColor: "#2B1B3D",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  title: { fontSize: 18, fontWeight: "bold", color: "#ffffff", marginLeft: 8 },
  subtitle: { color: "#A7A0B8", textAlign: "center", marginBottom: 16 },
  buttonWrapper: { alignItems: "center", marginBottom: 16 },
  sosButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  active: { backgroundColor: "#FF6B6B" },
  confirm: { backgroundColor: "#FF6B6B99" },
  idle: { backgroundColor: "#FF6B6B55" },
  buttonText: { color: "#fff", fontWeight: "bold" },
  pressContainer: {
  flexDirection: "column", // keep it vertical
  alignItems: "center",
  justifyContent: "center", // vertically center content
  gap: 4, // small spacing between icon and text
},
buttonTextSmall: {
  color: "#fff",
  fontSize: 14, // slightly bigger so it aligns visually
  fontWeight: "600",
  textAlign: "center", // ensure text is centered under icon
},
  sentContainer: { alignItems: "center" },
  confirmContainer: { alignItems: "center" },
  confirmText: { color: "#FF6B6B", marginBottom: 8 },
  progressDots: { flexDirection: "row", gap: 4, marginBottom: 8 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  dotActive: { backgroundColor: "#FF6B6B" },
  dotInactive: { backgroundColor: "#A7A0B8" },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#A7A0B8",
    borderRadius: 8,
  },
  cancelText: { color: "#2B1B3D", fontWeight: "bold" },
  sentInfo: { padding: 8 },
  sentTitle: { fontWeight: "bold", color: "#4CAF50", fontSize: 14 },
  sentSubtitle: { fontSize: 12, color: "#A7A0B8", marginBottom: 8 },
  channels: { marginTop: 8 },
  channelRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 },
  channelName: { flex: 1, color: "#fff", fontSize: 12 },
  channelStatus: { color: "#A7A0B8", fontSize: 12 },
  idleInfo: { marginTop: 8 },
  infoTitle: { fontWeight: "bold", color: "#FF6B6B", marginBottom: 4 },
  infoItem: { color: "#A7A0B8", fontSize: 12 },
});
