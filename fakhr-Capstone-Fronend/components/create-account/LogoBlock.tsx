import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";
import { caColors, caRadii, caShadowButton, caSpacing } from "./createAccountTheme";

const SIZE = 88;

export function LogoBlock() {
  return (
    <View style={styles.wrap}>
      <View style={styles.square}>
        <Ionicons name="leaf" size={42} color={caColors.inputBg} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    marginBottom: caSpacing.xl,
  },
  square: {
    width: SIZE,
    height: SIZE,
    borderRadius: caRadii.logo,
    backgroundColor: caColors.primary,
    alignItems: "center",
    justifyContent: "center",
    ...caShadowButton,
  },
});
