import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useState } from "react";
import {
  ActivityIndicator,
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
import { register } from "../../api/auth.api";
import { signupColors as colors } from "../../constants/signupTheme";
import { useAuth, USER_PROFILE_CACHE_KEY } from "../../context/AuthContext";

export function CreateAccountScreen() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const registerMutation = useMutation({
    mutationFn: register,
    onSuccess: async (data) => {
      if (!data?.token || !data?.user) {
        Alert.alert(
          "Something went wrong",
          "We could not save your session. Please sign in with your new account."
        );
        router.replace("/(auth)/login");
        return;
      }
      await SecureStore.setItemAsync("token", data.token);
      await SecureStore.setItemAsync(
        USER_PROFILE_CACHE_KEY,
        JSON.stringify(data.user)
      );
      setUser(data.user);
      router.replace("/(signup)/child-profile-setup");
    },
    onError: (error: unknown) => {
      const err = error as { message?: string; response?: { data?: { message?: string } } };
      const msg =
        err?.message ||
        err?.response?.data?.message ||
        "Failed to create account. Please try again.";
      Alert.alert("Registration Failed", msg);
    },
  });

  const handleBack = () => {
    try {
      if (typeof router.canGoBack === "function" && router.canGoBack()) {
        router.back();
        return;
      }
    } catch {
      /* fall through */
    }
    router.replace("/(auth)/welcome");
  };

  const handleSignUp = () => {
    if (!name.trim() || !email.trim() || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }
    if (!agreedToTerms) {
      Alert.alert("Error", "Please agree to the Terms & Privacy");
      return;
    }
    registerMutation.mutate({
      name: name.trim(),
      email: email.trim(),
      password,
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 8 : 0}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.headerRow}>
            <Pressable
              onPress={handleBack}
              hitSlop={12}
              style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}
            >
              <Ionicons name="chevron-back" size={26} color={colors.text} />
            </Pressable>
            <Text style={styles.headerTitle}>Create Account</Text>
            <View style={styles.headerSpacer} />
          </View>

          {/* Logo */}
          <View style={styles.logoWrap}>
            <View style={styles.logoSquare}>
              <Ionicons name="leaf" size={40} color={colors.white} />
            </View>
          </View>

          <Text style={styles.heroTitle}>Join Fakhr</Text>
          <Text style={styles.heroSubtitle}>
            Start your journey with a calm mind and organized soul.
          </Text>

          {/* Full Name */}
          <Text style={styles.label}>Full Name</Text>
          <View style={styles.inputRow}>
            <Ionicons
              name="person-outline"
              size={20}
              color={colors.textLight}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              placeholderTextColor={colors.textLight}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              autoCorrect={false}
            />
          </View>

          {/* Email */}
          <Text style={styles.label}>Email Address</Text>
          <View style={styles.inputRow}>
            <Ionicons
              name="mail-outline"
              size={20}
              color={colors.textLight}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="example@fakhr.com"
              placeholderTextColor={colors.textLight}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Password */}
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputRow}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color={colors.textLight}
              style={styles.inputIcon}
            />
            <TextInput
              style={[styles.input, styles.inputPassword]}
              placeholder="••••••••"
              placeholderTextColor={colors.textLight}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <Pressable
              onPress={() => setShowPassword((v) => !v)}
              hitSlop={10}
              style={({ pressed }) => [styles.eyeBtn, pressed && styles.pressed]}
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={22}
                color={colors.textLight}
              />
            </Pressable>
          </View>

          {/* Terms */}
          <Pressable
            style={styles.termsRow}
            onPress={() => setAgreedToTerms((v) => !v)}
          >
            <View
              style={[
                styles.checkboxOuter,
                agreedToTerms && styles.checkboxOuterChecked,
              ]}
            >
              {agreedToTerms ? (
                <Ionicons name="checkmark" size={14} color={colors.white} />
              ) : null}
            </View>
            <Text style={styles.termsText}>
              I agree to the{" "}
              <Text style={styles.termsLink}>Terms & Privacy</Text>
            </Text>
          </Pressable>

          {/* Sign Up */}
          <Pressable
            style={({ pressed }) => [
              styles.signUpBtn,
              registerMutation.isPending && styles.signUpBtnDisabled,
              pressed && styles.pressed,
            ]}
            onPress={handleSignUp}
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <>
                <Text style={styles.signUpText}>Sign Up</Text>
                <Ionicons name="arrow-forward" size={20} color={colors.white} />
              </>
            )}
          </Pressable>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR SIGN UP WITH</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social */}
          <View style={styles.socialRow}>
            <Pressable
              style={({ pressed }) => [
                styles.socialBtn,
                pressed && styles.pressed,
              ]}
              onPress={() =>
                Alert.alert("Google", "Google sign-up is not available yet.")
              }
            >
              <View style={styles.googleMark}>
                <Text style={styles.googleG}>G</Text>
              </View>
              <Text style={styles.socialLabel}>Google</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.socialBtn,
                pressed && styles.pressed,
              ]}
              onPress={() =>
                Alert.alert("Facebook", "Facebook sign-up is not available yet.")
              }
            >
              <View style={styles.fbMark}>
                <Text style={styles.fbF}>f</Text>
              </View>
              <Text style={styles.socialLabel}>Facebook</Text>
            </Pressable>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerMuted}>Already have an account? </Text>
            <Pressable onPress={() => router.push("/(auth)/login")}>
              <Text style={styles.footerLink}>Log In</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bgApp,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.text,
  },
  headerSpacer: {
    width: 40,
  },
  logoWrap: {
    alignItems: "center",
    marginTop: 12,
    marginBottom: 20,
  },
  logoSquare: {
    width: 88,
    height: 88,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.text,
    textAlign: "center",
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textMuted,
    textAlign: "center",
    marginBottom: 28,
    paddingHorizontal: 8,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.inputBorder,
    paddingHorizontal: 14,
    marginBottom: 18,
    minHeight: 54,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    paddingVertical: 14,
  },
  inputPassword: {
    paddingRight: 8,
  },
  eyeBtn: {
    padding: 6,
  },
  termsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
    marginTop: 4,
  },
  checkboxOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.textLight,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
  },
  checkboxOuterChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 20,
  },
  termsLink: {
    textDecorationLine: "underline",
    color: colors.text,
    fontWeight: "600",
  },
  signUpBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: colors.primary,
    borderRadius: 999,
    paddingVertical: 16,
    marginBottom: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  signUpBtnDisabled: {
    opacity: 0.55,
  },
  signUpText: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.white,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
  dividerText: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.6,
    color: colors.textLight,
    marginHorizontal: 12,
  },
  socialRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 32,
  },
  socialBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingVertical: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.inputBorder,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  googleMark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
  },
  googleG: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.googleBlue,
  },
  fbMark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.facebookBlue,
    alignItems: "center",
    justifyContent: "center",
  },
  fbF: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.white,
    marginTop: -1,
  },
  socialLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
  },
  footer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
  },
  footerMuted: {
    fontSize: 15,
    color: colors.textMuted,
  },
  footerLink: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.primaryDark,
  },
  pressed: {
    opacity: 0.85,
  },
});
