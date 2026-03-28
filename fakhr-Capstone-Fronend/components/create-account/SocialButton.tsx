import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  caColors,
  caRadii,
  caShadow,
  caSpacing,
} from "./createAccountTheme";

type Props = {
  provider: "google" | "facebook";
  onPress: () => void;
};

export function SocialButton({ provider, onPress }: Props) {
  const isGoogle = provider === "google";
  return (
    <Pressable
      style={({ pressed }) => [
        styles.btn,
        pressed && { opacity: 0.88, transform: [{ scale: 0.99 }] },
      ]}
      onPress={onPress}
    >
      {isGoogle ? (
        <View style={styles.row}>
          <Ionicons name="logo-google" size={22} color="#4285F4" />
          <Text style={styles.label}>Google</Text>
        </View>
      ) : (
        <View style={styles.row}>
          <Ionicons name="logo-facebook" size={24} color="#1877F2" />
          <Text style={styles.label}>Facebook</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    flex: 1,
    backgroundColor: caColors.inputBg,
    borderRadius: caRadii.input,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: caColors.border,
    paddingVertical: caSpacing.md,
    paddingHorizontal: caSpacing.md,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
    ...caShadow,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: caSpacing.sm,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: caColors.textPrimary,
  },
});
