import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { dirColors, dirRadii, dirSpacing } from "./directoryTheme";

export type FilterChipId = "near" | "pediatrics" | "therapy";

type ChipDef = {
  id: FilterChipId;
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  dropdown?: boolean;
};

const CHIPS: ChipDef[] = [
  { id: "near", label: "Near Me", icon: "navigate-outline" },
  { id: "pediatrics", label: "Pediatrics", dropdown: true },
  { id: "therapy", label: "Therapy", dropdown: true },
];

type Props = {
  activeId: FilterChipId;
  onSelect: (id: FilterChipId) => void;
  onDropdown?: (id: FilterChipId) => void;
};

export function DirectoryFilterChips({
  activeId,
  onSelect,
  onDropdown,
}: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scroll}
      style={styles.wrap}
    >
      {CHIPS.map((chip) => {
        const active = chip.id === activeId;
        return (
          <Pressable
            key={chip.id}
            style={({ pressed }) => [
              styles.pill,
              active ? styles.pillActive : styles.pillInactive,
              pressed && { opacity: 0.88, transform: [{ scale: 0.98 }] },
            ]}
            onPress={() => {
              onSelect(chip.id);
              if (chip.dropdown) {
                onDropdown?.(chip.id);
              }
            }}
          >
            {chip.icon ? (
              <Ionicons
                name={chip.icon}
                size={16}
                color={active ? dirColors.card : dirColors.textPrimary}
              />
            ) : null}
            <Text style={[styles.label, active && styles.labelActive]}>
              {chip.label}
            </Text>
            {chip.dropdown ? (
              <Ionicons
                name="chevron-down"
                size={16}
                color={active ? dirColors.card : dirColors.textSecondary}
              />
            ) : null}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: dirSpacing.xl,
    marginHorizontal: -dirSpacing.screen,
  },
  scroll: {
    flexDirection: "row",
    alignItems: "center",
    gap: dirSpacing.md,
    paddingHorizontal: dirSpacing.screen,
    paddingRight: dirSpacing.screen + dirSpacing.md,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: dirSpacing.md,
    paddingHorizontal: dirSpacing.lg,
    borderRadius: dirRadii.pill,
  },
  pillActive: {
    backgroundColor: dirColors.primary,
  },
  pillInactive: {
    backgroundColor: dirColors.chip,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: dirColors.textPrimary,
  },
  labelActive: {
    color: dirColors.card,
  },
});
