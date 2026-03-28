import React from "react";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { libColors, libRadii, libSpacing } from "./libraryTheme";

const TAGS = [
  "#Speech",
  "#Behavior",
  "#Mobility",
  "#Inclusion",
  "#LegalRights",
];

type Props = {
  onTagPress?: (tag: string) => void;
};

export function LibraryTagChips({ onTagPress }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      style={styles.scroll}
    >
      {TAGS.map((tag) => (
        <Pressable
          key={tag}
          style={({ pressed }) => [
            styles.chip,
            pressed && { opacity: 0.85, transform: [{ scale: 0.97 }] },
          ]}
          onPress={() => onTagPress?.(tag)}
        >
          <Text style={styles.chipText}>{tag}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    marginBottom: libSpacing.xl,
    marginHorizontal: -libSpacing.screen,
    paddingHorizontal: libSpacing.screen,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: libSpacing.sm,
    paddingRight: libSpacing.screen,
  },
  chip: {
    backgroundColor: libColors.chip,
    paddingHorizontal: libSpacing.md,
    paddingVertical: libSpacing.sm,
    borderRadius: libRadii.pill,
  },
  chipText: {
    fontSize: 12,
    fontWeight: "600",
    color: libColors.textSecondary,
  },
});
