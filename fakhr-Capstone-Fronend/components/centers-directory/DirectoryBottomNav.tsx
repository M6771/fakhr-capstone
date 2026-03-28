import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  dirColors,
  dirShadowSoft,
  dirSpacing,
} from "./directoryTheme";

export type DirectoryNavTabId = "home" | "directory" | "bookings" | "profile";

type Props = {
  active: DirectoryNavTabId;
};

const TABS: {
  id: DirectoryNavTabId;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconActive: keyof typeof Ionicons.glyphMap;
}[] = [
  { id: "home", label: "Home", icon: "home-outline", iconActive: "home" },
  {
    id: "directory",
    label: "Directory",
    icon: "business-outline",
    iconActive: "business",
  },
  {
    id: "bookings",
    label: "Bookings",
    icon: "calendar-outline",
    iconActive: "calendar",
  },
  {
    id: "profile",
    label: "Profile",
    icon: "person-outline",
    iconActive: "person",
  },
];

export function DirectoryBottomNav({ active }: Props) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, dirSpacing.md);

  const onTab = (id: DirectoryNavTabId) => {
    if (id === active) return;
    switch (id) {
      case "home":
        router.replace("/(tabs)");
        break;
      case "directory":
        router.replace("/(tabs)/directory/centers-professionals" as never);
        break;
      case "bookings":
        Alert.alert("Bookings", "Your bookings will appear here soon.");
        break;
      case "profile":
        router.replace("/(tabs)/profile");
        break;
    }
  };

  return (
    <View style={[styles.wrap, { paddingBottom: bottomPad }]}>
      <View style={styles.row}>
        {TABS.map((t) => (
          <NavItem
            key={t.id}
            {...t}
            active={active}
            onPress={() => onTab(t.id)}
          />
        ))}
      </View>
    </View>
  );
}

function NavItem({
  id,
  label,
  icon,
  iconActive,
  active,
  onPress,
}: (typeof TABS)[number] & {
  active: DirectoryNavTabId;
  onPress: () => void;
}) {
  const isActive = active === id;
  const color = isActive ? dirColors.primary : dirColors.textSecondary;
  return (
    <Pressable
      style={({ pressed }) => [styles.item, pressed && { opacity: 0.8 }]}
      onPress={onPress}
    >
      <Ionicons
        name={(isActive ? iconActive : icon) as keyof typeof Ionicons.glyphMap}
        size={22}
        color={color}
      />
      <Text style={[styles.label, { color }]} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: dirColors.card,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E5E7EB",
    ...dirShadowSoft,
    shadowOffset: { width: 0, height: -2 },
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingTop: dirSpacing.sm,
  },
  item: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: dirSpacing.xs,
    gap: 2,
  },
  label: {
    fontSize: 10,
    fontWeight: "600",
  },
});
