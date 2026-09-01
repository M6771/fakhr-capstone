import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useState } from "react";
import {
  ActivityIndicator,
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
import { useTranslation } from "react-i18next";
import { register } from "../../api/auth.api";
import { signupColors as colors } from "../../constants/signupTheme";
import { useAuth, USER_PROFILE_CACHE_KEY } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";

export function CreateAccountScreen() {
  const { t } = useTranslation();
  const { locale, setLocale } = useLanguage();
  const isRTL = locale === "ar";
  const reverseRows = isRTL !== I18nManager.isRTL;
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
        Alert.alert(t("signup.sessionErrorTitle"), t("signup.sessionError"));
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
        t("signup.createAccountFailed");
      Alert.alert(t("signup.registrationFailed"), msg);
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
      Alert.alert(t("common.error"), t("signup.fillAllFields"));
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert(t("common.error"), t("signup.invalidEmail"));
      return;
    }
    if (password.length < 6) {
      Alert.alert(t("common.error"), t("signup.passwordTooShort"));
      return;
    }
    if (!agreedToTerms) {
      Alert.alert(t("common.error"), t("signup.mustAgreeToTerms"));
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
          <View style={[styles.headerRow, reverseRows && styles.rowReverse]}>
            <Pressable
              onPress={handleBack}
              hitSlop={12}
              style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}
            >
              <Ionicons
                name={isRTL ? "chevron-forward" : "chevron-back"}
                size={26}
                color={colors.text}
              />
            </Pressable>
            <Text style={[styles.headerTitle, isRTL && styles.textRtl]}>
              {t("signup.headerTitle")}
            </Text>
            <Pressable
              onPress={() => setLocale(isRTL ? "en" : "ar")}
              hitSlop={8}
              style={({ pressed }) => [
                styles.langToggle,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.langToggleText}>
                {isRTL ? t("signup.useEnglish") : t("signup.useArabic")}
              </Text>
            </Pressable>
          </View>

          {/* Logo */}
          <View style={styles.logoWrap}>
            <View style={styles.logoSquare}>
              <Ionicons name="leaf" size={40} color={colors.white} />
            </View>
          </View>

          <Text style={[styles.heroTitle, isRTL && styles.textRtl]}>
            {t("signup.joinTitle")}
          </Text>
          <Text style={[styles.heroSubtitle, isRTL && styles.textRtl]}>
            {t("signup.subtitle")}
          </Text>

          {/* Full Name */}
          <Text style={[styles.label, isRTL && styles.textRtl]}>
            {t("signup.fullName")}
          </Text>
          <View style={[styles.inputRow, reverseRows && styles.rowReverse]}>
            <Ionicons
              name="person-outline"
              size={20}
              color={colors.textLight}
              style={isRTL ? styles.inputIconRtl : styles.inputIcon}
            />
            <TextInput
              style={[styles.input, isRTL && styles.inputRtl]}
              placeholder={t("signup.fullNamePlaceholder")}
              placeholderTextColor={colors.textLight}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              autoCorrect={false}
              textAlign={isRTL ? "right" : "left"}
            />
          </View>

          {/* Email */}
          <Text style={[styles.label, isRTL && styles.textRtl]}>
            {t("signup.email")}
          </Text>
          <View style={[styles.inputRow, reverseRows && styles.rowReverse]}>
            <Ionicons
              name="mail-outline"
              size={20}
              color={colors.textLight}
              style={isRTL ? styles.inputIconRtl : styles.inputIcon}
            />
            <TextInput
              style={[styles.input, isRTL && styles.inputRtl]}
              placeholder={t("signup.emailPlaceholder")}
              placeholderTextColor={colors.textLight}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              textAlign={isRTL ? "right" : "left"}
            />
          </View>

          {/* Password */}
          <Text style={[styles.label, isRTL && styles.textRtl]}>
            {t("signup.password")}
          </Text>
          <View style={[styles.inputRow, reverseRows && styles.rowReverse]}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color={colors.textLight}
              style={isRTL ? styles.inputIconRtl : styles.inputIcon}
            />
            <TextInput
              style={[styles.input, styles.inputPassword, isRTL && styles.inputRtl]}
              placeholder={t("signup.passwordPlaceholder")}
              placeholderTextColor={colors.textLight}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              textAlign={isRTL ? "right" : "left"}
            />
            <Pressable
              onPress={() => setShowPassword((v) => !v)}
              hitSlop={10}
              style={({ pressed }) => [styles.eyeBtn, pressed && styles.pressed]}
              accessibilityLabel={
                showPassword ? t("auth.hidePassword") : t("auth.showPassword")
              }
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
            style={[styles.termsRow, reverseRows && styles.rowReverse]}
            onPress={() => setAgreedToTerms((v) => !v)}
          >
            <View
              style={[
                styles.checkboxOuter,
                isRTL ? styles.checkboxOuterRtl : null,
                agreedToTerms && styles.checkboxOuterChecked,
              ]}
            >
              {agreedToTerms ? (
                <Ionicons name="checkmark" size={14} color={colors.white} />
              ) : null}
            </View>
            <Text style={[styles.termsText, isRTL && styles.textRtl]}>
              {t("signup.agreeToTermsText")}{" "}
              <Text style={styles.termsLink}>{t("signup.termsPrivacy")}</Text>
            </Text>
          </Pressable>

          {/* Sign Up */}
          <Pressable
            style={({ pressed }) => [
              styles.signUpBtn,
              reverseRows && styles.rowReverse,
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
                <Text style={styles.signUpText}>{t("signup.signUp")}</Text>
                <Ionicons
                  name={isRTL ? "arrow-back" : "arrow-forward"}
                  size={20}
                  color={colors.white}
                />
              </>
            )}
          </Pressable>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>{t("signup.orSignUpWith")}</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social */}
          <View style={[styles.socialRow, reverseRows && styles.rowReverse]}>
            <Pressable
              style={({ pressed }) => [
                styles.socialBtn,
                reverseRows && styles.rowReverse,
                pressed && styles.pressed,
              ]}
              onPress={() =>
                Alert.alert(t("signup.google"), t("signup.googleUnavailable"))
              }
            >
              <View style={styles.googleMark}>
                <Text style={styles.googleG}>G</Text>
              </View>
              <Text style={styles.socialLabel}>{t("signup.google")}</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.socialBtn,
                reverseRows && styles.rowReverse,
                pressed && styles.pressed,
              ]}
              onPress={() =>
                Alert.alert(t("signup.facebook"), t("signup.facebookUnavailable"))
              }
            >
              <View style={styles.fbMark}>
                <Text style={styles.fbF}>f</Text>
              </View>
              <Text style={styles.socialLabel}>{t("signup.facebook")}</Text>
            </Pressable>
          </View>

          {/* Footer */}
          <View style={[styles.footer, reverseRows && styles.rowReverse]}>
            <Text style={styles.footerMuted}>{t("signup.alreadyHaveAccount")} </Text>
            <Pressable onPress={() => router.push("/(auth)/login")}>
              <Text style={styles.footerLink}>{t("signup.logIn")}</Text>
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
  langToggle: {
    minWidth: 40,
    height: 32,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.inputBorder,
  },
  langToggleText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
  },
  rowReverse: {
    flexDirection: "row-reverse",
  },
  textRtl: {
    textAlign: "right",
    writingDirection: "rtl",
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
    marginEnd: 10,
  },
  inputIconRtl: {
    marginStart: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    paddingVertical: 14,
  },
  inputRtl: {
    textAlign: "right",
    writingDirection: "rtl",
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
    marginEnd: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
  },
  checkboxOuterChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkboxOuterRtl: {
    marginEnd: 0,
    marginStart: 12,
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
