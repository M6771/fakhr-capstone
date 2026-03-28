import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  carePathColors,
  carePathRadii,
  carePathShadowSoft,
  carePathSpacing,
} from "./carePathTheme";

type Props = {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  completed?: boolean;
  completedAt?: string;
  onToggle?: () => void;
};

export function CarePathTaskRow({
  title,
  subtitle,
  icon,
  completed = false,
  completedAt,
  onToggle,
}: Props) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.92 }]}
      onPress={onToggle}
      disabled={!onToggle}
    >
      <View
        style={[
          styles.iconWrap,
          completed && styles.iconWrapDone,
        ]}
      >
        <Ionicons
          name={icon}
          size={22}
          color={
            completed ? carePathColors.success : carePathColors.textSecondary
          }
        />
      </View>
      <View style={styles.textCol}>
        <Text
          style={[styles.title, completed && styles.titleDone]}
          numberOfLines={2}
        >
          {title}
        </Text>
        {completed && completedAt ? (
          <Text style={styles.completedAt}>Completed at {completedAt}</Text>
        ) : (
          <Text style={styles.subtitle}>{subtitle}</Text>
        )}
      </View>
      <View style={styles.trailing}>
        {completed ? (
          <View style={styles.checkDone}>
            <Ionicons
              name="checkmark"
              size={18}
              color={carePathColors.card}
            />
          </View>
        ) : (
          <View style={styles.checkEmpty} />
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: carePathColors.card,
    borderRadius: carePathRadii.card,
    padding: carePathSpacing.lg,
    marginBottom: carePathSpacing.md,
    ...carePathShadowSoft,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: carePathColors.inputBg,
    alignItems: "center",
    justifyContent: "center",
    marginRight: carePathSpacing.md,
  },
  iconWrapDone: {
    backgroundColor: `${carePathColors.success}22`,
  },
  textCol: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: carePathColors.textPrimary,
    marginBottom: 4,
  },
  titleDone: {
    textDecorationLine: "line-through",
    color: carePathColors.textSecondary,
  },
  subtitle: {
    fontSize: 14,
    color: carePathColors.textSecondary,
  },
  completedAt: {
    fontSize: 13,
    fontStyle: "italic",
    color: carePathColors.textSecondary,
  },
  trailing: {
    marginLeft: carePathSpacing.sm,
  },
  checkEmpty: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: carePathColors.progressTrack,
  },
  checkDone: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: carePathColors.success,
    alignItems: "center",
    justifyContent: "center",
  },
});
