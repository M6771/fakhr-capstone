import React from "react";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { feedColors, feedRadii, feedSpacing } from "./communityFeedTheme";

export type FeedTabId = "all" | "tips" | "education";

const TABS: { id: FeedTabId; label: string }[] = [
  { id: "all", label: "All Posts" },
  { id: "tips", label: "Parenting Tips" },
  { id: "education", label: "Education" },
];

type Props = {
  active: FeedTabId;
  onChange: (id: FeedTabId) => void;
};

export function CommunityTabPills({ active, onChange }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scroll}
      style={styles.wrap}
    >
      {TABS.map((t) => {
        const isActive = t.id === active;
        return (
          <Pressable
            key={t.id}
            style={({ pressed }) => [
              styles.pill,
              isActive ? styles.pillActive : styles.pillInactive,
              pressed && { opacity: 0.88, transform: [{ scale: 0.98 }] },
            ]}
            onPress={() => onChange(t.id)}
          >
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {t.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: feedSpacing.lg,
    marginHorizontal: -feedSpacing.screen,
  },
  scroll: {
    flexDirection: "row",
    alignItems: "center",
    gap: feedSpacing.md,
    paddingHorizontal: feedSpacing.screen,
    paddingRight: feedSpacing.screen + feedSpacing.md,
  },
  pill: {
    paddingVertical: feedSpacing.md,
    paddingHorizontal: feedSpacing.lg,
    borderRadius: feedRadii.pill,
  },
  pillActive: {
    backgroundColor: feedColors.primary,
  },
  pillInactive: {
    backgroundColor: feedColors.chip,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: feedColors.textPrimary,
  },
  labelActive: {
    color: feedColors.card,
  },
});
