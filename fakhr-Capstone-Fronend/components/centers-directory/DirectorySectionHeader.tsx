import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { dirColors, dirSpacing } from "./directoryTheme";

type Props = {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function DirectorySectionHeader({
  title,
  actionLabel = "View All",
  onAction,
}: Props) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
      <Pressable onPress={onAction} hitSlop={8}>
        <Text style={styles.action}>{actionLabel}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: dirSpacing.lg,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: dirColors.textPrimary,
  },
  action: {
    fontSize: 14,
    fontWeight: "500",
    color: dirColors.textSecondary,
  },
});
