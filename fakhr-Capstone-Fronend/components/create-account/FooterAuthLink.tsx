import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { caColors, caSpacing } from "./createAccountTheme";

type Props = {
  onLoginPress: () => void;
};

export function FooterAuthLink({ onLoginPress }: Props) {
  return (
    <Pressable
      style={({ pressed }) => [styles.wrap, pressed && { opacity: 0.8 }]}
      onPress={onLoginPress}
    >
      <Text style={styles.muted}>
        Already have an account?{" "}
        <Text style={styles.link}>Log In</Text>
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    paddingVertical: caSpacing.md,
  },
  muted: {
    fontSize: 15,
    color: caColors.textSecondary,
    textAlign: "center",
  },
  link: {
    fontSize: 15,
    fontWeight: "700",
    color: caColors.primary,
  },
});
