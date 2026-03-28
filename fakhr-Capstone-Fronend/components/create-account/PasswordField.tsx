import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import {
  caColors,
  caRadii,
  caShadow,
  caSpacing,
} from "./createAccountTheme";

type Props = {
  label?: string;
  value: string;
  onChangeText: (t: string) => void;
  visible: boolean;
  onToggleVisible: () => void;
  placeholder?: string;
};

const INPUT_H = 52;

export function PasswordField({
  label = "Password",
  value,
  onChangeText,
  visible,
  onToggleVisible,
  placeholder = "••••••••",
}: Props) {
  return (
    <View style={styles.group}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.field}>
        <Ionicons
          name="lock-closed-outline"
          size={20}
          color={caColors.textSecondary}
          style={styles.leftIcon}
        />
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={caColors.textSecondary}
          secureTextEntry={!visible}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Pressable
          style={({ pressed }) => [styles.eye, pressed && { opacity: 0.65 }]}
          onPress={onToggleVisible}
          hitSlop={8}
        >
          <Ionicons
            name={visible ? "eye-off-outline" : "eye-outline"}
            size={22}
            color={caColors.textSecondary}
          />
        </Pressable>
      </View>
    </View>
  );
}

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
  eye: {
    padding: caSpacing.sm,
    marginRight: caSpacing.xs,
  },
});
