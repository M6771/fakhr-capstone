import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  carePathColors,
  carePathRadii,
  carePathShadowSoft,
  carePathSpacing,
} from "./carePathTheme";

type IconName = "flame-outline" | "checkmark-circle-outline";

type Props = {
  icon: IconName;
  label: string;
  value: string;
  trend: string;
};

export function CarePathStatCard({ icon, label, value, trend }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.labelRow}>
        <Ionicons name={icon} size={16} color={carePathColors.textSecondary} />
        <Text style={styles.label}>{label}</Text>
      </View>
      <Text style={styles.value}>{value}</Text>
      <View style={styles.trendRow}>
        <Ionicons name="trending-up" size={14} color={carePathColors.success} />
        <Text style={styles.trend}>{trend}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: carePathColors.card,
    borderRadius: carePathRadii.card,
    padding: carePathSpacing.lg,
    ...carePathShadowSoft,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: carePathSpacing.sm,
  },
  label: {
    fontSize: 13,
    color: carePathColors.textSecondary,
  },
  value: {
    fontSize: 22,
    fontWeight: "700",
    color: carePathColors.textPrimary,
    marginBottom: carePathSpacing.xs,
  },
  trendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  trend: {
    fontSize: 13,
    fontWeight: "600",
    color: carePathColors.success,
  },
});
