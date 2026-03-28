import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { libColors, libRadii, libSpacing } from "./libraryTheme";

export type DisabilityId = "physical" | "intellectual" | "sensory";

type Item = {
  id: DisabilityId;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
};

const ITEMS: Item[] = [
  { id: "physical", label: "Physical", icon: "accessibility-outline" },
  { id: "intellectual", label: "Intellectual", icon: "school-outline" },
  { id: "sensory", label: "Sensory", icon: "eye-outline" },
];

type Props = {
  active: DisabilityId;
  onChange: (id: DisabilityId) => void;
  onViewAll?: () => void;
};

export function LibraryCategoryPills({
  active,
  onChange,
  onViewAll,
}: Props) {
  return (
    <View style={styles.section}>
      <View style={styles.head}>
        <Text style={styles.sectionTitle}>Disability Type</Text>
        <Pressable onPress={onViewAll} hitSlop={8}>
          <Text style={styles.viewAll}>View All</Text>
        </Pressable>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {ITEMS.map((item) => {
          const isActive = item.id === active;
          return (
            <Pressable
              key={item.id}
              style={({ pressed }) => [
                styles.pill,
                isActive ? styles.pillActive : styles.pillInactive,
                pressed && { opacity: 0.88, transform: [{ scale: 0.98 }] },
              ]}
              onPress={() => onChange(item.id)}
            >
              <Ionicons
                name={item.icon}
                size={18}
                color={isActive ? libColors.card : libColors.textSecondary}
              />
              <Text
                style={[styles.pillText, isActive && styles.pillTextActive]}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: libSpacing.xl,
  },
  head: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: libSpacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: libColors.textPrimary,
  },
  viewAll: {
    fontSize: 14,
    fontWeight: "500",
    color: libColors.textSecondary,
  },
  scroll: {
    gap: libSpacing.md,
    paddingRight: libSpacing.screen,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: libSpacing.sm,
    paddingVertical: libSpacing.md,
    paddingHorizontal: libSpacing.lg,
    borderRadius: libRadii.pill,
    marginRight: libSpacing.md,
  },
  pillActive: {
    backgroundColor: libColors.primary,
  },
  pillInactive: {
    backgroundColor: libColors.pillInactiveBg,
  },
  pillText: {
    fontSize: 14,
    fontWeight: "600",
    color: libColors.textSecondary,
  },
  pillTextActive: {
    color: libColors.card,
  },
});
