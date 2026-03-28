import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { libColors, libFabShadow, libSpacing } from "./libraryTheme";

export type LibraryTabId = "home" | "library" | "community" | "profile";

type Props = {
  active: LibraryTabId;
  onTabPress: (id: LibraryTabId) => void;
  onFabPress?: () => void;
  fabBottomOffset?: number;
};

export function LibraryBottomNav({
  active,
  onTabPress,
  onFabPress,
  fabBottomOffset,
}: Props) {
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, libSpacing.md);
  const fabBottom = fabBottomOffset ?? bottomPad + 10;

  return (
    <View style={[styles.wrap, { paddingBottom: bottomPad }]}>
      <View style={styles.bar}>
        <View style={styles.side}>
          <NavItem
            id="home"
            label="Home"
            icon="home-outline"
            iconActive="home"
            active={active}
            onPress={onTabPress}
          />
          <NavItem
            id="library"
            label="Library"
            icon="library-outline"
            iconActive="library"
            active={active}
            onPress={onTabPress}
          />
        </View>
        <View style={styles.fabSlot} />
        <View style={[styles.side, styles.sideRight]}>
          <NavItem
            id="community"
            label="Community"
            icon="people-outline"
            iconActive="people"
            active={active}
            onPress={onTabPress}
          />
          <NavItem
            id="profile"
            label="Profile"
            icon="person-outline"
            iconActive="person"
            active={active}
            onPress={onTabPress}
          />
        </View>
      </View>
      <Pressable
        style={({ pressed }) => [
          styles.fab,
          { bottom: fabBottom },
          pressed && styles.fabPressed,
        ]}
        onPress={onFabPress}
      >
        <Ionicons name="add" size={32} color={libColors.card} />
      </Pressable>
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
}: {
  id: LibraryTabId;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconActive: keyof typeof Ionicons.glyphMap;
  active: LibraryTabId;
  onPress: (id: LibraryTabId) => void;
}) {
  const isActive = active === id;
  const color = isActive ? libColors.primary : libColors.textSecondary;
  return (
    <Pressable
      style={({ pressed }) => [styles.item, pressed && { opacity: 0.75 }]}
      onPress={() => onPress(id)}
    >
      <Ionicons
        name={(isActive ? iconActive : icon) as keyof typeof Ionicons.glyphMap}
        size={22}
        color={color}
      />
      <Text style={[styles.label, { color }]}>{label}</Text>
    </Pressable>
  );
}

const FAB = 56;

const styles = StyleSheet.create({
  wrap: {
    position: "relative",
    backgroundColor: libColors.card,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: libColors.chip,
    paddingTop: libSpacing.sm,
  },
  bar: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: libSpacing.sm,
  },
  side: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  sideRight: {
    justifyContent: "space-evenly",
  },
  fabSlot: {
    width: FAB + libSpacing.md,
  },
  item: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 56,
    paddingVertical: libSpacing.xs,
  },
  label: {
    fontSize: 10,
    fontWeight: "600",
    marginTop: 2,
  },
  fab: {
    position: "absolute",
    alignSelf: "center",
    left: "50%",
    marginLeft: -FAB / 2,
    width: FAB,
    height: FAB,
    borderRadius: FAB / 2,
    backgroundColor: libColors.primary,
    alignItems: "center",
    justifyContent: "center",
    ...libFabShadow,
  },
  fabPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.95 }],
  },
});
