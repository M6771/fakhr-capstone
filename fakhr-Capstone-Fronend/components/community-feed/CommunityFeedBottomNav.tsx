import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  feedColors,
  feedFabShadow,
  feedSpacing,
} from "./communityFeedTheme";

export type CommunityFeedNavTabId =
  | "home"
  | "discover"
  | "circles"
  | "settings";

type Props = {
  active: CommunityFeedNavTabId;
  onFabPress: () => void;
  onSupportPress?: () => void;
};

const FAB = 60;

const TABS: {
  id: CommunityFeedNavTabId;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconActive: keyof typeof Ionicons.glyphMap;
}[] = [
  { id: "home", label: "Home", icon: "home-outline", iconActive: "home" },
  {
    id: "discover",
    label: "Discover",
    icon: "compass-outline",
    iconActive: "compass",
  },
  {
    id: "circles",
    label: "Circles",
    icon: "people-circle-outline",
    iconActive: "people-circle",
  },
  {
    id: "settings",
    label: "Settings",
    icon: "settings-outline",
    iconActive: "settings",
  },
];

export function CommunityFeedBottomNav({
  active,
  onFabPress,
  onSupportPress,
}: Props) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, feedSpacing.md);
  const fabBottom = bottomPad + 8;

  const go = (id: CommunityFeedNavTabId) => {
    if (id === active) return;
    switch (id) {
      case "home":
        router.replace("/(tabs)" as never);
        break;
      case "discover":
        router.replace("/(tabs)/community" as never);
        break;
      case "circles":
        router.push("/(tabs)/community/events" as never);
        break;
      case "settings":
        router.push("/(tabs)/profile/settings" as never);
        break;
      default:
        break;
    }
  };

  return (
    <View style={[styles.wrap, { paddingBottom: bottomPad }]}>
      <View style={styles.bar}>
        <View style={styles.side}>
          <NavItem
            tab={TABS[0]}
            active={active}
            onPress={() => go(TABS[0].id)}
          />
          <NavItem
            tab={TABS[1]}
            active={active}
            onPress={() => go(TABS[1].id)}
          />
        </View>
        <View style={styles.fabSlot} />
        <View style={[styles.side, styles.sideRight]}>
          <NavItem
            tab={TABS[2]}
            active={active}
            onPress={() => go(TABS[2].id)}
          />
          <NavItem
            tab={TABS[3]}
            active={active}
            onPress={() => go(TABS[3].id)}
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
        <Ionicons name="add" size={34} color={feedColors.card} />
      </Pressable>

      <Pressable
        style={({ pressed }) => [
          styles.supportFab,
          { bottom: bottomPad + 52 },
          pressed && { opacity: 0.85 },
        ]}
        onPress={
          onSupportPress ??
          (() => Alert.alert("Support", "How can we help? (placeholder)."))
        }
      >
        <Ionicons name="help" size={20} color={feedColors.card} />
      </Pressable>
    </View>
  );
}

function NavItem({
  tab,
  active,
  onPress,
}: {
  tab: (typeof TABS)[number];
  active: CommunityFeedNavTabId;
  onPress: () => void;
}) {
  const isActive = active === tab.id;
  const color = isActive ? feedColors.primary : feedColors.textSecondary;
  return (
    <Pressable
      style={({ pressed }) => [styles.item, pressed && { opacity: 0.75 }]}
      onPress={onPress}
    >
      <Ionicons
        name={(isActive ? tab.iconActive : tab.icon) as keyof typeof Ionicons.glyphMap}
        size={22}
        color={color}
      />
      <Text style={[styles.label, { color }]} numberOfLines={1}>
        {tab.label}
      </Text>
    </Pressable>
  );
}

const SUPPORT = 40;

const styles = StyleSheet.create({
  wrap: {
    position: "relative",
    backgroundColor: feedColors.card,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: feedColors.chip,
    paddingTop: feedSpacing.sm,
  },
  bar: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: feedSpacing.xs,
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
    width: FAB + feedSpacing.md,
  },
  item: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 56,
    paddingVertical: feedSpacing.xs,
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
    backgroundColor: feedColors.primary,
    alignItems: "center",
    justifyContent: "center",
    ...feedFabShadow,
  },
  fabPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.95 }],
  },
  supportFab: {
    position: "absolute",
    right: feedSpacing.lg,
    width: SUPPORT,
    height: SUPPORT,
    borderRadius: SUPPORT / 2,
    backgroundColor: feedColors.textPrimary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
});
