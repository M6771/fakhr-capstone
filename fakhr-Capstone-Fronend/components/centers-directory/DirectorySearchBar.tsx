import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { dirColors, dirRadii, dirSpacing } from "./directoryTheme";

type Props = {
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
};

export function DirectorySearchBar({
  value,
  onChangeText,
  placeholder = "Search centers or specialists",
}: Props) {
  return (
    <View style={styles.wrap}>
      <Ionicons
        name="search-outline"
        size={20}
        color={dirColors.textSecondary}
        style={styles.icon}
      />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={dirColors.textSecondary}
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
    backgroundColor: dirColors.searchBg,
    borderRadius: dirRadii.pill,
    paddingHorizontal: dirSpacing.lg,
    paddingVertical: dirSpacing.md,
    marginBottom: dirSpacing.lg,
  },
  icon: {
    marginRight: dirSpacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: dirColors.textPrimary,
    paddingVertical: 0,
  },
});
