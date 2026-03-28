import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  libColors,
  libRadii,
  libShadow,
  libSpacing,
} from "./libraryTheme";

type Props = {
  previewTitle: string;
  previewSub: string;
  bottomTitle: string;
  onSave?: () => void;
  onPress?: () => void;
};

export function LibraryInfographicCard({
  previewTitle,
  previewSub,
  bottomTitle,
  onSave,
  onPress,
}: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>INFOGRAPHIC</Text>
      </View>
      <Pressable
        style={({ pressed }) => [pressed && styles.pressedInner]}
        onPress={onPress}
      >
        <View style={styles.preview}>
          <View style={styles.previewIcon}>
            <Ionicons
              name="cloud-download-outline"
              size={40}
              color={libColors.textSecondary}
            />
          </View>
          <Text style={styles.previewTitle}>{previewTitle}</Text>
          <Text style={styles.previewSub}>{previewSub}</Text>
        </View>
      </Pressable>
      <View style={styles.bottom}>
        <Text style={styles.bottomTitle} numberOfLines={3}>
          {bottomTitle}
        </Text>
        <Pressable
          style={({ pressed }) => [
            styles.saveBtn,
            pressed && { opacity: 0.88, transform: [{ scale: 0.99 }] },
          ]}
          onPress={onSave}
        >
          <Ionicons
            name="download-outline"
            size={20}
            color={libColors.textPrimary}
          />
          <Text style={styles.saveText}>Save to Library</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: libColors.card,
    borderRadius: libRadii.card,
    marginBottom: libSpacing.xl,
    overflow: "hidden",
    ...libShadow,
  },
  pressedInner: {
    opacity: 0.96,
  },
  badge: {
    position: "absolute",
    top: libSpacing.lg,
    left: libSpacing.lg,
    zIndex: 2,
    backgroundColor: libColors.infographicBadge,
    paddingHorizontal: libSpacing.md,
    paddingVertical: libSpacing.xs,
    borderRadius: libRadii.sm,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.6,
    color: libColors.textSecondary,
  },
  preview: {
    backgroundColor: libColors.searchBg,
    paddingTop: 52,
    paddingBottom: libSpacing.xl,
    paddingHorizontal: libSpacing.xl,
    alignItems: "center",
  },
  previewIcon: {
    marginBottom: libSpacing.md,
  },
  previewTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: libColors.textPrimary,
    textAlign: "center",
    marginBottom: libSpacing.xs,
  },
  previewSub: {
    fontSize: 13,
    color: libColors.textSecondary,
  },
  bottom: {
    padding: libSpacing.xl,
  },
  bottomTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: libColors.textPrimary,
    lineHeight: 24,
    marginBottom: libSpacing.lg,
  },
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: libSpacing.sm,
    backgroundColor: libColors.searchBg,
    paddingVertical: libSpacing.md,
    borderRadius: libRadii.pill,
  },
  saveText: {
    fontSize: 15,
    fontWeight: "600",
    color: libColors.textPrimary,
  },
});
