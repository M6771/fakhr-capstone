import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { libColors, libFabShadow, libSpacing } from "./libraryTheme";

type Props = {
  title?: string;
};

export function LibraryHeader({ title = "Fakhr Library" }: Props) {
  return (
    <View style={styles.row}>
      <Pressable
        style={({ pressed }) => [styles.menuBtn, pressed && styles.pressed]}
        onPress={() => Alert.alert("Menu", "Navigation menu (placeholder).")}
        hitSlop={10}
      >
        <Ionicons name="menu" size={22} color={libColors.card} />
      </Pressable>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <View style={styles.right}>
        <Pressable
          style={({ pressed }) => [styles.iconCircle, pressed && styles.pressed]}
          onPress={() => Alert.alert("Notifications", "No new notifications.")}
        >
          <Ionicons
            name="notifications-outline"
            size={22}
            color={libColors.textPrimary}
          />
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.iconCircle, pressed && styles.pressed]}
          onPress={() => Alert.alert("Profile", "Profile (placeholder).")}
        >
          <Ionicons
            name="person-outline"
            size={22}
            color={libColors.textPrimary}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: libSpacing.lg,
  },
  menuBtn: {
    width: 44,
    height: 44,
    borderRadius: libRadii.fab,
    backgroundColor: libColors.primary,
    alignItems: "center",
    justifyContent: "center",
    ...libFabShadow,
    shadowOpacity: 0.08,
    elevation: 4,
  },
  title: {
    flex: 1,
    marginHorizontal: libSpacing.md,
    fontSize: 18,
    fontWeight: "700",
    color: libColors.textPrimary,
    textAlign: "center",
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: libSpacing.sm,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: libColors.chip,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.96 }],
  },
});
