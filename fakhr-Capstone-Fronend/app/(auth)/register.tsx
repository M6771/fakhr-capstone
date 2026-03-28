import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { register } from "../../api/auth.api";
import {
  CheckboxRow,
  CreateAccountHeader,
  FooterAuthLink,
  InputField,
  LogoBlock,
  PasswordField,
  PrimaryButton,
  SocialButton,
  SocialDivider,
  caColors,
  caSpacing,
} from "../../components/create-account";
import { useAuth } from "../../context/AuthContext";

export default function RegisterScreen() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const registerMutation = useMutation({
    mutationFn: register,
    onSuccess: async (data) => {
      if (data.token) {
        await SecureStore.setItemAsync("token", data.token);
      }
      if (data.user) {
        setUser(data.user);
      }
      Alert.alert("Success", "Account created successfully!", [
        {
          text: "OK",
          onPress: () => router.replace("/(tabs)"),
        },
      ]);
    },
    onError: (error: unknown) => {
      const err = error as {
        message?: string;
        response?: { data?: { message?: string } };
      };
      const errorMessage =
        err?.message ||
        err?.response?.data?.message ||
        "Failed to create account. Please try again.";
      Alert.alert("Registration Failed", errorMessage);
    },
  });

  const handleSignUp = () => {
    if (!formData.name || !formData.email || !formData.password) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    if (formData.password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    if (!agreedToTerms) {
      Alert.alert("Error", "Please agree to the Terms & Privacy");
      return;
    }

    registerMutation.mutate({
      name: formData.name,
      email: formData.email,
      password: formData.password,
    });
  };

  const termsAlert = () => {
    Alert.alert(
      "Terms & Privacy",
      "Terms of service and privacy policy (placeholder)."
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboard}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 24}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <CreateAccountHeader />

          <LogoBlock />

          <Text style={styles.heroTitle}>Join Fakhr</Text>
          <Text style={styles.heroSub}>
            Start your journey with a calm mind and organized soul.
          </Text>

          <View style={styles.form}>
            <InputField
              label="Full Name"
              icon="person-outline"
              placeholder="Enter your name"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              autoCapitalize="words"
            />

            <InputField
              label="Email Address"
              icon="mail-outline"
              placeholder="example@fakhr.com"
              value={formData.email}
              onChangeText={(text) =>
                setFormData({ ...formData, email: text })
              }
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <PasswordField
              value={formData.password}
              onChangeText={(text) =>
                setFormData({ ...formData, password: text })
              }
              visible={showPassword}
              onToggleVisible={() => setShowPassword((v) => !v)}
            />

            <CheckboxRow
              checked={agreedToTerms}
              onToggle={() => setAgreedToTerms((v) => !v)}
              onTermsPress={termsAlert}
            />

            <PrimaryButton
              label="Sign Up"
              onPress={handleSignUp}
              loading={registerMutation.isPending}
              disabled={!agreedToTerms}
            />

            <SocialDivider />

            <View style={styles.socialRow}>
              <SocialButton
                provider="google"
                onPress={() =>
                  Alert.alert("Google", "Google sign-up coming soon.")
                }
              />
              <View style={styles.socialGap} />
              <SocialButton
                provider="facebook"
                onPress={() =>
                  Alert.alert("Facebook", "Facebook sign-up coming soon.")
                }
              />
            </View>
          </View>

          <FooterAuthLink
            onLoginPress={() => router.push("/(auth)/login" as never)}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: caColors.background,
  },
  keyboard: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: caSpacing.xl,
    paddingTop: caSpacing.sm,
    paddingBottom: caSpacing.xxl,
    alignItems: "center",
    justifyContent: "center",
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: caColors.textPrimary,
    textAlign: "center",
    marginBottom: caSpacing.sm,
  },
  heroSub: {
    fontSize: 15,
    lineHeight: 22,
    color: caColors.textSecondary,
    textAlign: "center",
    marginBottom: caSpacing.xxl,
    maxWidth: 320,
    paddingHorizontal: caSpacing.sm,
  },
  form: {
    width: "100%",
    maxWidth: 400,
  },
  socialRow: {
    flexDirection: "row",
    width: "100%",
    marginBottom: caSpacing.lg,
  },
  socialGap: {
    width: caSpacing.md,
  },
});
