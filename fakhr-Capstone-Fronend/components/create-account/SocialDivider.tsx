import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { caColors, caSpacing } from "./createAccountTheme";

type Props = {
  label?: string;
};

export function SocialDivider({ label = "OR SIGN UP WITH" }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.line} />
      <Text style={styles.text}>{label}</Text>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: caSpacing.lg,
    gap: caSpacing.md,
  },
  line: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: caColors.border,
  },
  text: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.6,
    color: caColors.textSecondary,
  },
});
