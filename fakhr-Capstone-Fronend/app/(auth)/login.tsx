import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { login } from "../../api/auth.api";
import { useAuth } from "../../context/AuthContext";

// Design system colors
const colors = {
  bgApp: "#FAF9F6",
  bgCard: "rgba(255, 255, 255, 0.6)",
  primary: "#7FB77E",
  primaryHover: "#6A9E69",
  primarySoft: "#E8F0E8",
  text: "#2F2F2F",
  textSecondary: "#4A4A4A",
  textTertiary: "#8A8A8A",
  border: "rgba(0, 0, 0, 0.06)",
};

export default function LoginScreen() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: async (data) => {
      if (data.token) {
        await SecureStore.setItemAsync("token", data.token);
      }
      if (data.user) {
        setUser(data.user);
      }
      router.replace("/(tabs)");
    },
    onError: (error: any) => {
      const errorMessage = error?.message || error?.response?.data?.message || "Invalid credentials. Please try again.";
      Alert.alert("Login Failed", errorMessage);
    },
  });

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    loginMutation.mutate({ email, password });
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboard}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.authTitle}>Sign In</Text>
          <Text style={styles.authWelcome}>Welcome back</Text>
          <Text style={styles.authSub}>
            Sign in to continue. We&apos;re here to support you every step of the
            way.
          </Text>

          <View style={styles.authForm}>
            <View style={styles.authError} />
            <View style={styles.formGroup}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor={colors.textTertiary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrap}>
                <TextInput
                  style={styles.inputInWrap}
                  placeholder="Enter your password"
                  placeholderTextColor={colors.textTertiary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!isPasswordVisible}
                />
                <Pressable
                  style={({ pressed }) => [
                    styles.togglePassword,
                    pressed && { opacity: 0.7 },
                  ]}
                  onPress={() => setIsPasswordVisible((prev) => !prev)}
                >
                  <Ionicons
                    name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color={colors.textTertiary}
                  />
                </Pressable>
              </View>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.btnPrimary,
                pressed && { opacity: 0.8 },
              ]}
              onPress={handleLogin}
              disabled={loginMutation.isPending}
            >
              <Text style={styles.btnPrimaryText}>
                {loginMutation.isPending ? "Signing In..." : "Sign In"}
              </Text>
            </Pressable>
          </View>

          <Pressable onPress={() => router.push("/(auth)/register")}>
            {({ pressed }) => (
              <Text style={[styles.authFooter, pressed && { opacity: 0.7 }]}>
                Don&apos;t have an account?{" "}
                <Text style={styles.authFooterLink}>Create account</Text>
              </Text>
            )}
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgApp,
  },
  keyboard: {
    flex: 1,
  },
  scrollContent: {
    padding: 28,
    paddingHorizontal: 24,
    paddingBottom: 48,
    alignItems: "center",
  },
  authTitle: {
    fontSize: 22.4, // 1.4rem
    fontWeight: "600",
    marginBottom: 24,
    textAlign: "center",
    color: colors.text,
    letterSpacing: -0.32,
  },
  authWelcome: {
    fontSize: 24, // 1.5rem
    fontWeight: "600",
    marginBottom: 10,
    textAlign: "center",
    color: colors.text,
    letterSpacing: -0.32,
  },
  authSub: {
    fontSize: 15.2, // 0.95rem
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: 32,
    maxWidth: 320,
    lineHeight: 22.8,
  },
  authForm: {
    width: "100%",
    maxWidth: 360,
  },
  authError: {
    opacity: 0,
    height: 0,
    marginBottom: 0,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14.4, // 0.9rem
    fontWeight: "600",
    marginBottom: 8,
    color: colors.text,
  },
  input: {
    width: "100%",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12, // Rounded inputs
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: 16,
    backgroundColor: colors.bgCard, // Semi-transparent
    color: colors.text,
  },
  inputWrap: {
    position: "relative",
  },
  inputInWrap: {
    width: "100%",
    paddingVertical: 14,
    paddingRight: 48,
    paddingLeft: 16,
    borderRadius: 12, // Rounded inputs
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: 16,
    backgroundColor: colors.bgCard, // Semi-transparent
    color: colors.text,
  },
  togglePassword: {
    position: "absolute",
    right: 12,
    top: "50%",
    transform: [{ translateY: -10 }],
    borderRadius: 6,
    padding: 6,
  },
  btnPrimary: {
    width: "100%",
    paddingVertical: 16,
    backgroundColor: colors.primary,
    borderRadius: 24, // Rounded button
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  btnPrimaryText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  createAccountContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  createAccountText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333333",
  },
  authFooter: {
    textAlign: "center",
    fontSize: 14.4,
    color: colors.textSecondary,
  },
  authFooterLink: {
    color: colors.primary,
    fontWeight: "600",
  },
});
