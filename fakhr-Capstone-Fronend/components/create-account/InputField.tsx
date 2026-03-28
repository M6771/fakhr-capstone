import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";
import {
  caColors,
  caRadii,
  caShadow,
  caSpacing,
} from "./createAccountTheme";

type Props = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
} & TextInputProps;

export function InputField({ label, icon, style, ...inputProps }: Props) {
  return (
    <View style={styles.group}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.field}>
        <Ionicons
          name={icon}
          size={20}
          color={caColors.textSecondary}
          style={styles.leftIcon}
        />
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={caColors.textSecondary}
          {...inputProps}
        />
      </View>
    </View>
  );
}

const INPUT_H = 52;

const styles = StyleSheet.create({
  group: {
    marginBottom: caSpacing.lg,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: caColors.textPrimary,
    marginBottom: caSpacing.xs,
  },
  field: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: caColors.inputBg,
    borderRadius: caRadii.input,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: caColors.border,
    minHeight: INPUT_H,
    paddingRight: caSpacing.md,
    ...caShadow,
  },
  leftIcon: {
    marginLeft: caSpacing.md,
    marginRight: caSpacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: caColors.textPrimary,
    paddingVertical: caSpacing.md,
    paddingRight: caSpacing.sm,
  },
});
