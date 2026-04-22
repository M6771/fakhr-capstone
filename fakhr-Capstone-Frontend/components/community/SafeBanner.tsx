import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { libraryColors as c } from "../../constants/libraryTheme";

export function SafeBanner() {
  return (
    <View style={styles.wrap}>
      <View style={styles.iconCircle}>
        <Ionicons name="shield-checkmark" size={22} color={c.primary} />
      </View>
      <View style={styles.textBlock}>
        <Text style={styles.title}>Safe Community Space</Text>
        <Text style={styles.sub}>
          All content is moderated to ensure a supportive environment for all
          parents.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: c.chipBg,
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: c.white,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  textBlock: { flex: 1 },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: c.text,
    marginBottom: 4,
  },
  sub: {
    fontSize: 13,
    lineHeight: 18,
    color: c.textMuted,
  },
});
