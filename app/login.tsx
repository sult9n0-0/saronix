// app/login.tsx
import React from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, ScrollView, Image } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

// Colors based on your theme
const COLORS = {
  primary: "#2B1B3D",      // Midnight Purple
  secondary: "#FF6B6B",    // Coral
  accent: "#4DD0E1",       // Soft Aqua
  background: "#EDE7F6",   // Pale Lavender
  textPrimary: "#ffffff",
  textSecondary: "#2B1B3D",
  placeholder: "#A7A0B8",
  errorBg: "#FFEBEB",
  errorText: "#B91C1C",
};

class LoginScreenClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      error: "",
      loading: false,
    };
  }

  handleSubmit = () => {
    const { email, password } = this.state;
    this.setState({ error: "", loading: true });

    if (!email || !password) {
      this.setState({ error: "Please fill in all fields", loading: false });
      return;
    }

    if (!email.includes("@")) {
      this.setState({ error: "Please enter a valid email", loading: false });
      return;
    }

    console.log("Login:", email, password);
    this.setState({ loading: false });
    this.props.router.replace("/dashboard");
  };

  handleDemoLogin = () => {
    console.log("Demo login");
    this.props.router.replace("/dashboard");
  };

  render() {
    const { email, password, error, loading } = this.state;

    return (
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          padding: 20,
          backgroundColor: COLORS.background,
        }}
      >
        {/* Logo & Header */}
        <View style={{ alignItems: "center", marginBottom: 30 }}>
          <Image
            source={require('../assets/images/saronix.jpg')}
            style={{ width: 130, height: 130, marginBottom: 15, borderRadius: 60, }}
            resizeMode="contain"
          />
          <Text style={{ fontSize: 28, fontWeight: "bold", color: COLORS.primary, marginBottom: 4 }}>
            Saronix
          </Text>
          <Text style={{ color: COLORS.accent, textAlign: "center" }}>
            Sign in to access your rescue operations
          </Text>
        </View>

        {/* Input Container */}
        <View style={{ backgroundColor: COLORS.primary, padding: 20, borderRadius: 16 }}>
          {/* Email */}
          <View style={{ marginBottom: 15 }}>
            <Text style={{ color: COLORS.secondary, marginBottom: 4, flexDirection: "row", alignItems: "center" }}>
              <MaterialCommunityIcons name="email" size={16} color={COLORS.secondary} /> Email Address
            </Text>
            <TextInput
              placeholder="you@rescuebot.io"
              placeholderTextColor={COLORS.placeholder}
              value={email}
              onChangeText={(text) => this.setState({ email: text })}
              keyboardType="email-address"
              style={{ backgroundColor: "#3B2A55", color: COLORS.textPrimary, padding: 12, borderRadius: 10 }}
            />
          </View>

          {/* Password */}
          <View style={{ marginBottom: 15 }}>
            <Text style={{ color: COLORS.secondary, marginBottom: 4, flexDirection: "row", alignItems: "center" }}>
              <MaterialCommunityIcons name="lock" size={16} color={COLORS.secondary} /> Password
            </Text>
            <TextInput
              placeholder="••••••••"
              placeholderTextColor={COLORS.placeholder}
              value={password}
              onChangeText={(text) => this.setState({ password: text })}
              secureTextEntry
              style={{ backgroundColor: "#3B2A55", color: COLORS.textPrimary, padding: 12, borderRadius: 10 }}
            />
          </View>

          {/* Error */}
          {error ? (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: COLORS.errorBg,
                borderColor: COLORS.errorText,
                borderWidth: 1,
                padding: 10,
                borderRadius: 10,
                marginBottom: 15,
              }}
            >
              <MaterialCommunityIcons name="alert-circle" size={16} color={COLORS.errorText} style={{ marginRight: 6 }} />
              <Text style={{ color: COLORS.errorText, flex: 1 }}>{error}</Text>
            </View>
          ) : null}

          {/* Login Button */}
          <TouchableOpacity
            onPress={this.handleSubmit}
            disabled={loading}
            style={{
              backgroundColor: COLORS.accent,
              padding: 14,
              borderRadius: 12,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.primary} />
            ) : (
              <MaterialCommunityIcons name="login" size={16} color={COLORS.primary} style={{ marginRight: 8 }} />
            )}
            <Text style={{ color: COLORS.primary, fontWeight: "bold" }}>{loading ? "Signing in..." : "Sign In"}</Text>
          </TouchableOpacity>

          {/* Demo Button */}
          <TouchableOpacity
            onPress={this.handleDemoLogin}
            style={{
              marginTop: 15,
              padding: 14,
              borderRadius: 12,
              alignItems: "center",
              borderWidth: 1,
              borderColor: COLORS.accent,
            }}
          >
            <Text style={{ color: COLORS.accent, fontWeight: "bold" }}>Try Demo</Text>
          </TouchableOpacity>
        </View>

        {/* Footer Info */}
        <Text style={{ color: COLORS.textSecondary, textAlign: "center", marginTop: 20, fontSize: 12 }}>
          For demo, use any email with "admin" in it for admin access
        </Text>
      </ScrollView>
    );
  }
}

// Wrapper to inject router
export default function LoginScreen() {
  const router = useRouter();
  return <LoginScreenClass router={router} />;
}
