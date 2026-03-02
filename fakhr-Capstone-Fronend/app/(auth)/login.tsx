import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import {
  Alert,
  I18nManager,
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

// Brand colors
const colors = {
  primary: "#6E7CAF",
  primarySoft: "#AAB3D6",
  bgTop: "#BCC3D8",
  bgBottom: "#AAB3D6",
  accent: "#8B91AF",
  text: "#6E7CAF",
  textSecondary: "#8B91AF",
  border: "#AAB3D6",
  white: "#FFFFFF",
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
      Alert.alert("خطأ", "يرجى تعبئة جميع الحقول");
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
          <View style={styles.logoBlock}>
            <View style={styles.logoIconWrap}>
              <View style={styles.logoIcon}>
                <Ionicons name="heart" size={32} color={colors.white} />
              </View>
            </View>
            <Text style={styles.appName}>فخر</Text>
            <Text style={styles.appTagline}>رحلة الدعم تبدأ هنا</Text>
          </View>

          <View style={styles.authForm}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>البريد الإلكتروني</Text>
              <TextInput
                style={styles.input}
                placeholder="أدخل بريدك الإلكتروني"
                placeholderTextColor={colors.textSecondary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                textAlign="right"
                writingDirection={I18nManager.isRTL ? "rtl" : "rtl"}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>كلمة المرور</Text>
              <View style={styles.inputWrap}>
                <TextInput
                  style={styles.inputInWrap}
                  placeholder="أدخل كلمة المرور"
                  placeholderTextColor={colors.textSecondary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!isPasswordVisible}
                  textAlign="right"
                  writingDirection={I18nManager.isRTL ? "rtl" : "rtl"}
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
                    color={colors.textSecondary}
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
                {loginMutation.isPending ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
              </Text>
            </Pressable>

            <Pressable>
              {({ pressed }) => (
                <Text
                  style={[
                    styles.forgotPassword,
                    pressed && { opacity: 0.7 },
                  ]}
                >
                  نسيت كلمة المرور؟
                </Text>
              )}
            </Pressable>

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>أو</Text>
              <View style={styles.dividerLine} />
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.btnSecondary,
                pressed && { opacity: 0.85 },
              ]}
              onPress={() => router.push("/(auth)/register")}
            >
              <Text style={styles.btnSecondaryText}>إنشاء حساب جديد</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgTop,
  },
  keyboard: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 48,
    paddingHorizontal: 32,
    paddingBottom: 40,
    alignItems: "center",
  },
  logoBlock: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoIconWrap: {
    marginBottom: 24,
  },
  logoIcon: {
    width: 88,
    height: 88,
    borderRadius: 24,
    backgroundColor: colors.accent,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
  },
  appName: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 8,
  },
  appTagline: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  authForm: {
    width: "100%",
    maxWidth: 360,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    color: colors.text,
    textAlign: "right",
  },
  input: {
    width: "100%",
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: 16,
    backgroundColor: colors.white,
    color: colors.text,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  inputWrap: {
    position: "relative",
  },
  inputInWrap: {
    width: "100%",
    paddingVertical: 16,
    paddingRight: 18,
    paddingLeft: 52,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: 16,
    backgroundColor: colors.white,
    color: colors.text,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  togglePassword: {
    position: "absolute",
    left: 14,
    top: "50%",
    transform: [{ translateY: -10 }],
    borderRadius: 6,
    padding: 6,
  },
  btnPrimary: {
    width: "100%",
    paddingVertical: 16,
    backgroundColor: colors.primary,
    borderRadius: 24,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 3,
  },
  btnPrimaryText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  forgotPassword: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: 24,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    gap: 8,
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
  dividerText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  btnSecondary: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.white,
    alignItems: "center",
  },
  btnSecondaryText: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.primary,
  },
});
