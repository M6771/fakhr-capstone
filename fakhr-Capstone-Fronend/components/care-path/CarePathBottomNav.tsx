import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { carePathColors, carePathSpacing } from "./carePathTheme";

export type CarePathTabId = "home" | "path" | "stats" | "profile";

type Tab = {
  id: CarePathTabId;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconActive: keyof typeof Ionicons.glyphMap;
};

const TABS: Tab[] = [
  { id: "home", label: "Home", icon: "home-outline", iconActive: "home" },
  {
    id: "path",
    label: "Path",
    icon: "git-branch-outline",
    iconActive: "git-branch",
  },
  {
    id: "stats",
    label: "Stats",
    icon: "bar-chart-outline",
    iconActive: "bar-chart",
  },
  {
    id: "profile",
    label: "Profile",
    icon: "person-outline",
    iconActive: "person",
  },
];

type Props = {
  active: CarePathTabId;
  onTabPress: (id: CarePathTabId) => void;
};

export function CarePathBottomNav({ active, onTabPress }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.bar,
        {
          paddingBottom: Math.max(insets.bottom, carePathSpacing.md),
        },
      ]}
    >
      {TABS.map((tab) => {
        const isActive = tab.id === active;
        const name = isActive ? tab.iconActive : tab.icon;
        const color = isActive
          ? carePathColors.primary
          : carePathColors.textSecondary;
        return (
          <Pressable
            key={tab.id}
            style={({ pressed }) => [
              styles.item,
              pressed && styles.itemPressed,
            ]}
            onPress={() => onTabPress(tab.id)}
          >
            <Ionicons name={name} size={24} color={color} />
            <Text style={[styles.label, { color }]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
    backgroundColor: carePathColors.card,
    paddingTop: carePathSpacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: carePathColors.progressTrack,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 8,
  },
  item: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: carePathSpacing.xs,
    minWidth: 64,
  },
  itemPressed: {
    opacity: 0.75,
  },
  label: {
    fontSize: 11,
    fontWeight: "500",
    marginTop: 4,
  },
});
