import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { libColors, libRadii, libSpacing } from "./libraryTheme";

type Props = {
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
};

export function LibrarySearchBar({
  value,
  onChangeText,
  placeholder = "Search videos, articles, guides...",
}: Props) {
  return (
    <View style={styles.wrap}>
      <Ionicons
        name="search-outline"
        size={20}
        color={libColors.textSecondary}
        style={styles.icon}
      />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={libColors.textSecondary}
        value={value}
        onChangeText={onChangeText}
        returnKeyType="search"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: libColors.searchBg,
    borderRadius: libRadii.pill,
    paddingHorizontal: libSpacing.lg,
    paddingVertical: libSpacing.md,
    marginBottom: libSpacing.xl,
  },
  icon: {
    marginRight: libSpacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: libColors.textPrimary,
    paddingVertical: 0,
  },
});
