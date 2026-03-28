import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import {
  caColors,
  caRadii,
  caShadowButton,
  caSpacing,
} from "./createAccountTheme";

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
};

export function PrimaryButton({
  label,
  onPress,
  disabled,
  loading,
}: Props) {
  const inactive = disabled || loading;
  return (
    <Pressable
      style={({ pressed }) => [
        styles.btn,
        inactive && styles.btnDisabled,
        pressed && !inactive && { opacity: 0.92, transform: [{ scale: 0.99 }] },
      ]}
      onPress={onPress}
      disabled={inactive}
    >
      {loading ? (
        <ActivityIndicator color={caColors.inputBg} />
      ) : (
        <View style={styles.inner}>
          <Text style={styles.label}>{label}</Text>
          <Ionicons
            name="arrow-forward"
            size={20}
            color={caColors.inputBg}
            style={styles.arrow}
          />
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: "100%",
    minHeight: 54,
    borderRadius: caRadii.pill,
    backgroundColor: caColors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: caSpacing.xl,
    ...caShadowButton,
  },
  btnDisabled: {
    opacity: 0.55,
  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "700",
    color: caColors.inputBg,
  },
  arrow: {
    marginLeft: caSpacing.sm,
  },
});
