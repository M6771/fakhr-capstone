import React from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  carePathColors,
  carePathRadii,
  carePathSpacing,
} from "./carePathTheme";
import { CarePathCard } from "./CarePathCard";

type Props = {
  /** 0–100 */
  percent: number;
  supportingText: string;
};

export function CarePathWeeklyProgress({ percent, supportingText }: Props) {
  const clamped = Math.min(100, Math.max(0, percent));

  return (
    <CarePathCard style={styles.cardWrap}>
      <View style={styles.topRow}>
        <Text style={styles.overline}>WEEKLY PROGRESS</Text>
        <Text style={styles.percent}>{Math.round(clamped)}%</Text>
      </View>
      <Text style={styles.title}>This Week</Text>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${clamped}%` }]} />
      </View>
      <Text style={styles.support}>{supportingText}</Text>
    </CarePathCard>
  );
}

const styles = StyleSheet.create({
  cardWrap: {
    marginBottom: carePathSpacing.lg,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: carePathSpacing.sm,
  },
  overline: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.8,
    color: carePathColors.textSecondary,
    textTransform: "uppercase",
  },
  percent: {
    fontSize: 16,
    fontWeight: "700",
    color: carePathColors.textSecondary,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: carePathColors.textPrimary,
    marginBottom: carePathSpacing.md,
  },
  track: {
    height: 10,
    borderRadius: carePathRadii.pill,
    backgroundColor: carePathColors.progressTrack,
    overflow: "hidden",
    marginBottom: carePathSpacing.md,
  },
  fill: {
    height: "100%",
    borderRadius: carePathRadii.pill,
    backgroundColor: carePathColors.primary,
  },
  support: {
    fontSize: 14,
    fontStyle: "italic",
    color: carePathColors.textSecondary,
    lineHeight: 20,
  },
});
