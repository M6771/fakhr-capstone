import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { caColors, caRadii, caSpacing } from "./createAccountTheme";

type Props = {
  checked: boolean;
  onToggle: () => void;
  onTermsPress?: () => void;
};

export function CheckboxRow({ checked, onToggle, onTermsPress }: Props) {
  return (
    <View style={styles.row}>
      <Pressable
        style={({ pressed }) => [
          styles.box,
          checked && styles.boxChecked,
          pressed && { opacity: 0.85 },
        ]}
        onPress={onToggle}
      >
        {checked ? (
          <Text style={styles.check}>✓</Text>
        ) : null}
      </Pressable>
      <View style={styles.textWrap}>
        <Text style={styles.text}>I agree to the </Text>
        <Pressable onPress={onTermsPress} hitSlop={4}>
          <Text style={styles.link}>Terms & Privacy</Text>
        </Pressable>
      </View>
    </View>
  );
}

const BOX = 22;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: caSpacing.xl,
    gap: caSpacing.md,
  },
  box: {
    width: BOX,
    height: BOX,
    borderRadius: caRadii.checkbox,
    borderWidth: 2,
    borderColor: caColors.border,
    backgroundColor: caColors.inputBg,
    alignItems: "center",
    justifyContent: "center",
  },
  boxChecked: {
    backgroundColor: caColors.primary,
    borderColor: caColors.primary,
  },
  check: {
    color: caColors.inputBg,
    fontSize: 13,
    fontWeight: "700",
  },
  textWrap: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  text: {
    fontSize: 14,
    color: caColors.textPrimary,
    lineHeight: 20,
  },
  link: {
    fontSize: 14,
    color: caColors.link,
    textDecorationLine: "underline",
    fontWeight: "600",
    lineHeight: 20,
  },
});
