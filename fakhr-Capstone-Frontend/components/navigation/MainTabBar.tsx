import { Ionicons } from "@expo/vector-icons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { CommonActions } from "@react-navigation/native";
import React from "react";
import {
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { libraryColors as c } from "../../constants/libraryTheme";

export function MainTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, 8);
  const barHeight = 56;
  const focusedRoute = state.routes[state.index]?.name;

  const renderTab = (name: "index" | "library" | "community" | "profile") => {
    const route = state.routes.find((r) => r.name === name);
    if (!route) return <View key={name} style={styles.tab} />;
    const opts = descriptors[route.key].options;
    const label = String(opts.tabBarLabel ?? opts.title ?? name);
    const focused = focusedRoute === name;
    const color = focused ? c.primary : c.textTertiary;

    let iconName: React.ComponentProps<typeof Ionicons>["name"] = "ellipse-outline";
    if (name === "index") iconName = focused ? "home" : "home-outline";
    if (name === "library") iconName = focused ? "library" : "library-outline";
    if (name === "community") iconName = focused ? "people" : "people-outline";
    if (name === "profile") iconName = focused ? "person" : "person-outline";

    const onPress = () => {
      const event = navigation.emit({
        type: "tabPress",
        target: route.key,
        canPreventDefault: true,
      });
      if (!focused && !event.defaultPrevented) {
        navigation.dispatch(
          CommonActions.navigate({
            name: route.name,
            params: route.params,
          })
        );
      }
    };

    return (
      <Pressable
        key={route.key}
        accessibilityRole="button"
        onPress={onPress}
        style={styles.tab}
      >
        <Ionicons name={iconName} size={24} color={color} />
        <Text style={[styles.label, { color }]} numberOfLines={1}>
          {label}
        </Text>
      </Pressable>
    );
  };

  return (
    <View
      style={[
        styles.outer,
        {
          paddingBottom: bottomPad,
        },
      ]}
    >
      <View style={[styles.row, { minHeight: barHeight }]}>
        {renderTab("index")}
        {renderTab("library")}
        <View style={styles.fabSpacer} />
        {renderTab("community")}
        {renderTab("profile")}
      </View>
      <Pressable
        accessibilityRole="button"
        style={[
          styles.fab,
          {
            bottom: bottomPad + barHeight - 28,
          },
        ]}
        onPress={() =>
          Alert.alert("Fakhr Library", "Add new content (coming soon).")
        }
      >
        <Ionicons name="add" size={32} color={c.white} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: c.white,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: c.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: Platform.OS === "android" ? 12 : 0,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
  },
  fabSpacer: {
    width: 56,
  },
  label: {
    fontSize: 10,
    fontWeight: "500",
    marginTop: 2,
  },
  fab: {
    position: "absolute",
    left: "50%",
    marginLeft: -28,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: c.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
});
