import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  I18nManager,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLanguage } from "../../../context/LanguageContext";
import type { AppLanguage } from "../../../i18n";
import {
  cardShadow,
  colors,
  radius,
  spacing,
  typography,
} from "../../../theme";

export default function SettingsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { locale, setLocale, isRTL } = useLanguage();
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const reverseRows = isRTL !== I18nManager.isRTL;
  const languageLabel =
    locale === "ar"
      ? t("settings.arabic", { lng: "ar" })
      : t("settings.english", { lng: "en" });

  const selectLanguage = (next: AppLanguage) => {
    setLanguageModalVisible(false);
    if (next !== locale) {
      setLocale(next);
    }
  };

  return (
    <SafeAreaView style={styles.wrapper} edges={["top"]}>
      <View style={[styles.header, reverseRows && styles.rowReverse]}>
        <Pressable
          style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.7 }]}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel={t("settings.backToProfile")}
        >
          <Ionicons
            name={isRTL ? "arrow-forward" : "arrow-back"}
            size={24}
            color={colors.text}
          />
        </Pressable>
        <Text style={styles.headerTitle}>{t("settings.title")}</Text>
        <View style={styles.headerSide} />
      </View>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <TouchableOpacity
          style={[styles.settingItem, reverseRows && styles.rowReverse]}
          activeOpacity={0.85}
          onPress={() => router.push("/(tabs)/profile/edit-profile")}
        >
          <Text style={styles.settingLabel}>{t("settings.editProfile")}</Text>
          <Ionicons
            name={isRTL ? "chevron-back" : "chevron-forward"}
            size={18}
            color={colors.textMuted}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem} activeOpacity={0.85}>
          <Text style={styles.settingLabel}>{t("settings.notifications")}</Text>
          <Text style={styles.settingValue}>{t("settings.notificationsOn")}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.settingItem, reverseRows && styles.rowReverse]}
          activeOpacity={0.85}
          onPress={() => setLanguageModalVisible(true)}
          accessibilityRole="button"
          accessibilityLabel={`${t("settings.language")}, ${languageLabel}`}
        >
          <Text style={styles.settingLabel}>{t("settings.language")}</Text>
          <View style={[styles.valueRow, reverseRows && styles.rowReverse]}>
            <Text style={styles.settingValue}>{languageLabel}</Text>
            <Ionicons
              name={isRTL ? "chevron-back" : "chevron-forward"}
              size={18}
              color={colors.textMuted}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem} activeOpacity={0.85}>
          <Text style={styles.settingLabel}>{t("settings.privacy")}</Text>
          <Text style={styles.settingValue}>→</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={languageModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setLanguageModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setLanguageModalVisible(false)}
        >
          <Pressable style={styles.sheet}>
            <Text style={[styles.sheetTitle, isRTL && styles.textRtl]}>
              {t("settings.chooseLanguage")}
            </Text>

            <TouchableOpacity
              style={[styles.optionRow, reverseRows && styles.rowReverse]}
              onPress={() => selectLanguage("en")}
              accessibilityRole="button"
              accessibilityState={{ selected: locale === "en" }}
            >
              <Text style={styles.optionLabel}>{t("settings.english")}</Text>
              {locale === "en" ? (
                <Ionicons name="checkmark" size={22} color={colors.primary} />
              ) : (
                <View style={styles.optionSpacer} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.optionRow, reverseRows && styles.rowReverse]}
              onPress={() => selectLanguage("ar")}
              accessibilityRole="button"
              accessibilityState={{ selected: locale === "ar" }}
            >
              <Text style={styles.optionLabel}>
                {t("settings.arabic", { lng: "ar" })}
              </Text>
              {locale === "ar" ? (
                <Ionicons name="checkmark" size={22} color={colors.primary} />
              ) : (
                <View style={styles.optionSpacer} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => setLanguageModalVisible(false)}
            >
              <Text style={styles.cancelText}>{t("settings.cancel")}</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.backgroundCard,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: typography.h3,
    fontWeight: typography.weightBold,
    color: colors.text,
  },
  headerSide: {
    width: 40,
    height: 40,
  },
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: 100,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.backgroundCard,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...cardShadow,
  },
  settingLabel: {
    fontSize: typography.body,
    fontWeight: typography.weightMedium,
    color: colors.text,
  },
  settingValue: {
    fontSize: typography.body,
    color: colors.textMuted,
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  rowReverse: {
    flexDirection: "row-reverse",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  sheetTitle: {
    fontSize: typography.h3,
    fontWeight: typography.weightBold,
    color: colors.text,
    textAlign: "center",
    marginBottom: spacing.md,
  },
  textRtl: {
    writingDirection: "rtl",
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.backgroundCard,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.sm,
  },
  optionLabel: {
    fontSize: typography.body,
    fontWeight: typography.weightMedium,
    color: colors.text,
  },
  optionSpacer: {
    width: 22,
    height: 22,
  },
  cancelBtn: {
    alignItems: "center",
    paddingVertical: spacing.md,
    marginTop: spacing.xs,
  },
  cancelText: {
    fontSize: typography.body,
    fontWeight: typography.weightSemibold,
    color: colors.textMuted,
  },
});
