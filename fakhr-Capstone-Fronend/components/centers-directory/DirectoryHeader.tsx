import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { dirColors, dirShadowSoft, dirSpacing } from "./directoryTheme";

type Props = {
  title?: string;
};

export function DirectoryHeader({ title = "Centers & Professionals" }: Props) {
  const router = useRouter();

  return (
    <View style={styles.row}>
      <Pressable
        style={({ pressed }) => [styles.circleBtn, pressed && styles.pressed]}
        onPress={() => router.back()}
        hitSlop={10}
      >
        <Ionicons name="arrow-back" size={22} color={dirColors.textPrimary} />
      </Pressable>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <Pressable
        style={({ pressed }) => [styles.circleBtn, pressed && styles.pressed]}
        onPress={() => Alert.alert("Notifications", "No new notifications.")}
      >
        <Ionicons
          name="notifications-outline"
          size={22}
          color={dirColors.textPrimary}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: dirSpacing.lg,
  },
  circleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: dirColors.chip,
    alignItems: "center",
    justifyContent: "center",
    ...dirShadowSoft,
  },
  title: {
    flex: 1,
    marginHorizontal: dirSpacing.md,
    fontSize: 17,
    fontWeight: "700",
    color: dirColors.textPrimary,
    textAlign: "center",
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
});
