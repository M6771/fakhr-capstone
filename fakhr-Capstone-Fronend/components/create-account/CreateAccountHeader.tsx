import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { caColors, caRadii, caShadow, caSpacing } from "./createAccountTheme";

type Props = {
  title?: string;
};

const HIT = 44;

export function CreateAccountHeader({ title = "Create Account" }: Props) {
  const router = useRouter();

  return (
    <View style={styles.row}>
      <Pressable
        style={({ pressed }) => [styles.back, pressed && { opacity: 0.75 }]}
        onPress={() => router.back()}
        hitSlop={8}
      >
        <Ionicons name="arrow-back" size={22} color={caColors.textPrimary} />
      </Pressable>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <View style={styles.backSpacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: caSpacing.xl,
  },
  back: {
    width: HIT,
    height: HIT,
    borderRadius: caRadii.input,
    backgroundColor: caColors.inputBg,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: caColors.border,
    ...caShadow,
  },
  backSpacer: {
    width: HIT,
    height: HIT,
  },
  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 17,
    fontWeight: "700",
    color: caColors.textPrimary,
    marginHorizontal: caSpacing.sm,
  },
});
