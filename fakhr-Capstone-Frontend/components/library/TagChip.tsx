import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { libraryColors as c } from "../../constants/libraryTheme";

type Props = { label: string };

export function TagChip({ label }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: c.chipBg,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    marginRight: 8,
    marginBottom: 8,
  },
  text: {
    fontSize: 13,
    fontWeight: "600",
    color: c.chipText,
  },
});
